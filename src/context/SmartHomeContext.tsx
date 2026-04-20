import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import mqtt, { MqttClient } from "mqtt";

export type RelayStatus = "on" | "off";
export type ConnectionStatus = "idle" | "connecting" | "connected" | "error" | "offline";
export type LogType = "sys" | "pub" | "sub" | "err";

export interface RelayItem {
  id: number;
  name: string;
  iconIndex: number;
  status: RelayStatus;
}

export interface SavedConnection {
  id: string;
  name: string;
  dev: string;
  broker: string;
  port: string;
  user?: string;
}

export interface LogItem {
  id: string;
  time: string;
  type: LogType;
  message: string;
}

interface SmartHomeContextValue {
  relays: RelayItem[];
  pirState: boolean;
  logs: LogItem[];
  connections: SavedConnection[];
  activeConnectionId: string | null;
  connectionStatus: ConnectionStatus;
  pillText: string;
  isConnected: boolean;
  selectedConnection: SavedConnection | null;
  setRelayName: (relayId: number, name: string) => void;
  setRelayIcon: (relayId: number, iconIndex: number) => void;
  toggleRelay: (relayId: number) => void;
  allOff: () => void;
  refreshStates: () => void;
  togglePir: () => void;
  saveConnection: (input: Omit<SavedConnection, "id">, editId?: string | null) => { ok: boolean; message?: string };
  deleteConnection: (id: string) => void;
  selectConnection: (id: string) => void;
  connectSelected: () => void;
  disconnect: () => void;
  clearLog: () => void;
}

const DEFAULT_NAMES = ["Living Room Light", "Bedroom Fan", "Hall AC", "Bathroom Geyser"];
const DEFAULT_ICON_INDEXES = [0, 1, 2, 3];

const RELAY_NAMES_KEY = "arjunvis_rnames";
const RELAY_ICONS_KEY = "arjunvis_ricons";
const CONNECTIONS_KEY = "arjunvis_conns";
const ACTIVE_CONNECTION_KEY = "arjunvis_active";

const SmartHomeContext = createContext<SmartHomeContextValue | null>(null);

const readLocalStorageArray = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const getInitialRelays = (): RelayItem[] => {
  const names = readLocalStorageArray<string[]>(RELAY_NAMES_KEY, DEFAULT_NAMES);
  const iconIndexes = readLocalStorageArray<number[]>(RELAY_ICONS_KEY, DEFAULT_ICON_INDEXES);

  return DEFAULT_NAMES.map((defaultName, index) => ({
    id: index,
    name: names[index]?.trim() || defaultName,
    iconIndex: iconIndexes[index] ?? index,
    status: "off",
  }));
};

const formatTime = () => new Date().toTimeString().slice(0, 8);

export const SmartHomeProvider = ({ children }: { children: ReactNode }) => {
  const clientRef = useRef<MqttClient | null>(null);
  const baseTopicRef = useRef("");

  const [relays, setRelays] = useState<RelayItem[]>(getInitialRelays);
  const [pirState, setPirState] = useState(false);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [connections, setConnections] = useState<SavedConnection[]>(() =>
    readLocalStorageArray<SavedConnection[]>(CONNECTIONS_KEY, []),
  );
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(ACTIVE_CONNECTION_KEY);
  });
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [pillText, setPillText] = useState("Not connected");

  const selectedConnection = useMemo(
    () => connections.find((item) => item.id === activeConnectionId) ?? null,
    [connections, activeConnectionId],
  );

  const isConnected = !!clientRef.current?.connected;

  const addLog = useCallback((type: LogType, message: string) => {
    setLogs((prev) => {
      const next = [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          time: formatTime(),
          type,
          message,
        },
      ];
      return next.slice(-300);
    });
  }, []);

  useEffect(() => {
    window.localStorage.setItem(RELAY_NAMES_KEY, JSON.stringify(relays.map((relay) => relay.name)));
    window.localStorage.setItem(RELAY_ICONS_KEY, JSON.stringify(relays.map((relay) => relay.iconIndex)));
  }, [relays]);

  useEffect(() => {
    window.localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    if (activeConnectionId) {
      window.localStorage.setItem(ACTIVE_CONNECTION_KEY, activeConnectionId);
    } else {
      window.localStorage.removeItem(ACTIVE_CONNECTION_KEY);
    }
  }, [activeConnectionId]);

  useEffect(() => {
    addLog("sys", "Sync Home ready - add your MQTT device in Connections.");
  }, [addLog]);

  const publish = useCallback(
    (topic: string, message: string) => {
      const client = clientRef.current;
      if (!client?.connected) {
        addLog("err", "Not connected");
        return;
      }

      client.publish(topic, message, { retain: true });
      const shortTopic = topic.replace(`${baseTopicRef.current}/`, "");
      addLog("pub", `-> [${shortTopic}] ${message}`);
    },
    [addLog],
  );

  const updateRelayStatus = useCallback((relayId: number, status: RelayStatus) => {
    setRelays((prev) => prev.map((relay) => (relay.id === relayId ? { ...relay, status } : relay)));
  }, []);

  const connectToBroker = useCallback(
    (conn: SavedConnection) => {
      const currentClient = clientRef.current;
      if (currentClient) {
        try {
          currentClient.end(true);
        } catch {
          // Ignore cleanup failures.
        }
      }

      baseTopicRef.current = `home/${conn.dev}`;
      setConnectionStatus("connecting");
      setPillText("Connecting...");

      const isSecure = conn.port === "8884" || conn.port === "8883" || window.location.protocol === "https:";
      const protocol = isSecure ? "wss" : "ws";
      const url = `${protocol}://${conn.broker}:${conn.port}/mqtt`;
      addLog("sys", `Connecting -> ${url}`);

      const client = mqtt.connect(url, {
        clientId: `arjunvis_${Math.random().toString(16).slice(2)}`,
        clean: true,
        reconnectPeriod: 0,
        connectTimeout: 12000,
        username: conn.user || undefined,
      });

      clientRef.current = client;

      client.on("connect", () => {
        setConnectionStatus("connected");
        setPillText("Connected");
        addLog("sys", `Connected - subscribing to ${baseTopicRef.current}/#`);

        client.subscribe(`${baseTopicRef.current}/#`, (error) => {
          if (error) {
            addLog("err", `Subscribe error: ${error.message}`);
            return;
          }
          addLog("sys", "Subscribed - retained states loading...");
        });
      });

      client.on("message", (topic, payload) => {
        const message = payload.toString().trim();
        const shortTopic = topic.replace(`${baseTopicRef.current}/`, "");
        addLog("sub", `<- [${shortTopic}] ${message}`);

        if (topic === `${baseTopicRef.current}/pir`) {
          setPirState(message === "ON");
          return;
        }

        for (let i = 0; i < DEFAULT_NAMES.length; i += 1) {
          if (topic === `${baseTopicRef.current}/relay/${i + 1}`) {
            updateRelayStatus(i, message === "ON" ? "on" : "off");
          }
        }
      });

      client.on("error", (error) => {
        setConnectionStatus("error");
        setPillText("Error");
        addLog("err", `Warning: ${error.message}`);
        if (error.message.includes("WebSocket")) {
          addLog("sys", "Tip: use port 8884 for WSS or 8083 for WS.");
        }
      });

      client.on("close", () => {
        setConnectionStatus("idle");
        setPillText("Disconnected");
        addLog("sys", "Connection closed");
      });

      client.on("offline", () => {
        setConnectionStatus("offline");
        setPillText("Offline");
        addLog("sys", "Broker unreachable");
      });

      client.on("reconnect", () => {
        addLog("sys", "Attempting reconnect...");
      });
    },
    [addLog, updateRelayStatus],
  );

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      try {
        clientRef.current.end(true);
      } catch {
        // Ignore cleanup failures.
      }
    }
    clientRef.current = null;
    setConnectionStatus("idle");
    setPillText("Not connected");
    addLog("sys", "Disconnected");
  }, [addLog]);

  useEffect(() => () => {
    if (clientRef.current) {
      try {
        clientRef.current.end(true);
      } catch {
        // Ignore cleanup failures.
      }
    }
  }, []);

  const setRelayName = useCallback((relayId: number, name: string) => {
    setRelays((prev) =>
      prev.map((relay) =>
        relay.id === relayId
          ? { ...relay, name: name.trim() || DEFAULT_NAMES[relayId] }
          : relay,
      ),
    );
  }, []);

  const setRelayIcon = useCallback((relayId: number, iconIndex: number) => {
    setRelays((prev) =>
      prev.map((relay) => (relay.id === relayId ? { ...relay, iconIndex } : relay)),
    );
  }, []);

  const toggleRelay = useCallback(
    (relayId: number) => {
      setRelays((prev) => {
        const next: RelayItem[] = prev.map((relay) =>
          relay.id === relayId
            ? { ...relay, status: (relay.status === "on" ? "off" : "on") as RelayStatus }
            : relay,
        );

        const changed = next.find((relay) => relay.id === relayId);
        if (changed) {
          publish(`${baseTopicRef.current}/relay/${relayId + 1}`, changed.status === "on" ? "ON" : "OFF");
        }

        return next;
      });
    },
    [publish],
  );

  const allOff = useCallback(() => {
    setRelays((prev) => {
      prev.forEach((relay) => {
        if (relay.status === "on") {
          publish(`${baseTopicRef.current}/relay/${relay.id + 1}`, "OFF");
        }
      });
      return prev.map((relay) => ({ ...relay, status: "off" }));
    });
  }, [publish]);

  const refreshStates = useCallback(() => {
    const client = clientRef.current;
    if (!client?.connected) {
      addLog("err", "Not connected - connect first.");
      return;
    }

    addLog("sys", "Refreshing retained states...");
    client.unsubscribe(`${baseTopicRef.current}/#`, () => {
      client.subscribe(`${baseTopicRef.current}/#`, () => {
        addLog("sys", "Refresh complete");
      });
    });
  }, [addLog]);

  const togglePir = useCallback(() => {
    setPirState((prev) => {
      const next = !prev;
      publish(`${baseTopicRef.current}/pir`, next ? "ON" : "OFF");
      return next;
    });
  }, [publish]);

  const saveConnection = useCallback(
    (input: Omit<SavedConnection, "id">, editId?: string | null) => {
      if (!input.name || !input.dev || !input.broker || !input.port) {
        return { ok: false, message: "Fill Name, Device ID, Broker and Port." };
      }

      const normalized: SavedConnection = {
        id: editId || `${Date.now()}`,
        name: input.name.trim(),
        dev: input.dev.trim(),
        broker: input.broker.trim(),
        port: input.port.trim(),
        user: input.user?.trim() || "",
      };

      setConnections((prev) => {
        if (editId) {
          return prev.map((item) => (item.id === editId ? normalized : item));
        }
        return [...prev, normalized];
      });

      addLog("sys", editId ? `Updated connection "${normalized.name}".` : `Saved connection "${normalized.name}".`);
      return { ok: true };
    },
    [addLog],
  );

  const deleteConnection = useCallback((id: string) => {
    setConnections((prev) => prev.filter((item) => item.id !== id));
    if (activeConnectionId === id) {
      setActiveConnectionId(null);
      disconnect();
    }
    addLog("sys", "Connection removed.");
  }, [activeConnectionId, addLog, disconnect]);

  const selectConnection = useCallback((id: string) => {
    setActiveConnectionId(id);
    addLog("sys", "Active connection changed.");
  }, [addLog]);

  const connectSelected = useCallback(() => {
    if (clientRef.current?.connected) {
      disconnect();
      return;
    }

    if (!selectedConnection) {
      addLog("err", "No connection selected. Open Connections first.");
      return;
    }

    connectToBroker(selectedConnection);
  }, [addLog, connectToBroker, disconnect, selectedConnection]);

  const clearLog = useCallback(() => {
    setLogs([]);
  }, []);

  const value = useMemo<SmartHomeContextValue>(
    () => ({
      relays,
      pirState,
      logs,
      connections,
      activeConnectionId,
      connectionStatus,
      pillText,
      isConnected,
      selectedConnection,
      setRelayName,
      setRelayIcon,
      toggleRelay,
      allOff,
      refreshStates,
      togglePir,
      saveConnection,
      deleteConnection,
      selectConnection,
      connectSelected,
      disconnect,
      clearLog,
    }),
    [
      activeConnectionId,
      allOff,
      clearLog,
      connectSelected,
      connectionStatus,
      connections,
      deleteConnection,
      disconnect,
      isConnected,
      logs,
      pillText,
      pirState,
      refreshStates,
      relays,
      saveConnection,
      selectConnection,
      selectedConnection,
      setRelayIcon,
      setRelayName,
      togglePir,
      toggleRelay,
    ],
  );

  return <SmartHomeContext.Provider value={value}>{children}</SmartHomeContext.Provider>;
};

export const useSmartHome = () => {
  const context = useContext(SmartHomeContext);
  if (!context) {
    throw new Error("useSmartHome must be used within SmartHomeProvider");
  }
  return context;
};
