import { useMemo, useState } from "react";
import { Edit3, Pencil, RefreshCw, ShieldCheck } from "lucide-react";
import { useSmartHome } from "@/context/SmartHomeContext";
import { RoomScene } from "@/RoomScene";
import { relayIcons } from "@/lib/smart-home-icons";

const statusTone: Record<string, string> = {
  idle: "status-idle",
  connecting: "status-connecting",
  connected: "status-connected",
  error: "status-error",
  offline: "status-offline",
};

const DevicesSection = () => {
  const {
    relays,
    pirState,
    connectionStatus,
    pillText,
    selectedConnection,
    isConnected,
    setRelayName,
    setRelayIcon,
    toggleRelay,
    togglePir,
    refreshStates,
    allOff,
    connectSelected,
  } = useSmartHome();

  const [editingRelayId, setEditingRelayId] = useState<number | null>(null);
  const [draftName, setDraftName] = useState("");
  const [iconRelayId, setIconRelayId] = useState<number | null>(null);

  const currentTopic = useMemo(
    () => (selectedConnection ? `home/${selectedConnection.dev}` : "home/<device-id>"),
    [selectedConnection],
  );

  const beginRename = (relayId: number, currentName: string) => {
    setEditingRelayId(relayId);
    setDraftName(currentName);
  };

  const finishRename = () => {
    if (editingRelayId === null) return;
    setRelayName(editingRelayId, draftName);
    setEditingRelayId(null);
    setDraftName("");
  };

  return (
    <section id="devices" className="devices-section relative z-[2] w-full max-w-[1240px] mx-auto px-6 py-32">
      <div className="device-intro mb-16 max-w-[780px]">
        <div className="text-accent text-[12px] tracking-[0.22em] uppercase font-extrabold mb-3">Dashboard</div>
        <h2 className="text-foreground text-[clamp(30px,4vw,42px)] leading-[1.05] tracking-tight font-extrabold mb-4">Realtime relay control is back.</h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          Rename relays, swap icons, publish live MQTT commands, refresh retained states, and manage PIR from one surface.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
        <div className="space-y-6">
          <div className="conn-bar tilt-card rounded-[30px] p-6 md:p-7 glass-surface-strong">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <div className="text-accent text-[11px] font-extrabold tracking-[0.18em] uppercase mb-2">Control Bridge</div>
                <div className="text-foreground text-2xl font-bold mb-2">
                  {selectedConnection ? selectedConnection.name : "No connection selected"}
                </div>
                <div className="text-muted-foreground text-sm">
                  {selectedConnection
                    ? `${selectedConnection.dev} · ${selectedConnection.broker}:${selectedConnection.port}`
                    : "Jump to Connections and save a device before connecting."}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className={`status-pill ${statusTone[connectionStatus]}`}>
                  <span className="status-pill__dot" />
                  <span>{pillText}</span>
                </div>
                <button className="control-btn control-btn--primary" onClick={connectSelected}>
                  {isConnected ? "Disconnect" : "Connect"}
                </button>
                <button className="control-btn" onClick={refreshStates}>
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <button className="control-btn control-btn--danger" onClick={allOff}>
                  All Off
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relay-grid">
            {relays.map((relay) => {
              const Icon = relayIcons[relay.iconIndex] || relayIcons[0];
              const isEditing = editingRelayId === relay.id;

              return (
                <div
                  key={relay.id}
                  className={`rc tilt-card ${relay.status === "on" ? "on" : "off"}`}
                  onClick={() => toggleRelay(relay.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      className="rc-ico"
                      title="Change icon"
                      onClick={(event) => {
                        event.stopPropagation();
                        setIconRelayId(relay.id);
                      }}
                    >
                      <div className="rc-ico-inner">
                        <Icon className="w-7 h-7" />
                      </div>
                    </button>

                    <button
                      type="button"
                      className="rc-edit-btn"
                      title="Rename"
                      onClick={(event) => {
                        event.stopPropagation();
                        beginRename(relay.id, relay.name);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4">
                    {isEditing ? (
                      <input
                        autoFocus
                        maxLength={18}
                        value={draftName}
                        className="rc-name-input"
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => setDraftName(event.target.value)}
                        onBlur={finishRename}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") finishRename();
                          if (event.key === "Escape") {
                            setEditingRelayId(null);
                            setDraftName("");
                          }
                        }}
                      />
                    ) : (
                      <div className="rc-name">{relay.name}</div>
                    )}
                  </div>

                  <div className="toggle">
                    <div className="toggle-thumb" />
                  </div>

                  <div className="rc-state">{relay.status === "on" ? "ON" : "OFF"}</div>
                </div>
              );
            })}
          </div>

          <div className={`pir-card tilt-card ${pirState ? "pir-on" : ""}`}>
            <div>
              <div className="text-accent text-[11px] tracking-[0.18em] uppercase font-extrabold mb-2">Motion Sensor</div>
              <div className="text-foreground text-xl font-bold mb-1">PIR Trigger</div>
              <div className="text-muted-foreground text-sm">Publishes to `{currentTopic}/pir` with retained ON/OFF state.</div>
            </div>

            <button className={`pir-btn ${pirState ? "on" : ""}`} onClick={togglePir}>
              <ShieldCheck className="w-4 h-4" />
              <span>{pirState ? "Active" : "Enable"}</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="device-house tilt-card relative rounded-[32px] overflow-hidden perspective-1200 h-[600px] xl:h-[700px]" style={{ boxShadow: "var(--shadow-lg)" }}>
            <div className="absolute inset-0 z-0">
               <RoomScene modelUrl="" />
            </div>
            <div className="absolute inset-0 rounded-[32px] pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(10,16,24,0.95) 100%)" }} />
            <div className="absolute bottom-6 left-6 right-6 z-10 pointer-events-none">
              <div className="text-accent text-[11px] font-extrabold tracking-[0.18em] uppercase mb-2">Live Topic Base</div>
              <div className="text-foreground text-xl font-bold break-all">{currentTopic}</div>
              <div className="text-muted-foreground text-sm mt-2">
                Relay topics: `{currentTopic}/relay/1` to `{currentTopic}/relay/4`<br/>
                PIR topic: `{currentTopic}/pir`
              </div>
            </div>
          </div>

          <div className="dev-banner tilt-card rounded-[30px] p-6" style={{
            background: "linear-gradient(180deg, rgba(200,210,240,0.08), rgba(200,210,240,0.03)), linear-gradient(145deg, rgba(10,14,28,0.82) 0%, rgba(18,24,46,0.74) 54%, rgba(22,30,56,0.84) 100%)",
            border: "1px solid rgba(200,210,240,0.1)",
            boxShadow: "var(--shadow-lg)",
          }}>
            <div className="flex items-center gap-3 mb-4">
              <Edit3 className="w-5 h-5 text-accent" />
              <div className="text-foreground text-lg font-bold">What was restored</div>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>Relay state publishing with retained MQTT messages.</p>
              <p>Saved broker/device profiles using local storage.</p>
              <p>Rename and icon customization for all four relays.</p>
              <p>Manual refresh, disconnect, PIR toggle, and live activity logging.</p>
            </div>
          </div>
        </div>
      </div>

      {iconRelayId !== null ? (
        <div className="icon-picker-overlay" onClick={() => setIconRelayId(null)}>
          <div className="icon-picker-modal" onClick={(event) => event.stopPropagation()}>
            <div className="text-foreground text-xl font-bold mb-2">Choose relay icon</div>
            <div className="text-muted-foreground text-sm mb-5">Pick the icon that best matches this device.</div>
            <div className="icon-picker-grid">
              {relayIcons.map((Icon, index) => (
                <button
                  key={index}
                  type="button"
                  className={`ipm-icon-btn ${relays.find((relay) => relay.id === iconRelayId)?.iconIndex === index ? "selected" : ""}`}
                  onClick={() => setRelayIcon(iconRelayId, index)}
                >
                  <Icon className="w-6 h-6" />
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button className="control-btn control-btn--primary" onClick={() => setIconRelayId(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default DevicesSection;
