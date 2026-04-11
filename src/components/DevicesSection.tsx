import { useMemo, useState } from "react";
import { Pencil, RefreshCw, ShieldCheck } from "lucide-react";
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
          {/* Glow halo wrapper — outside overflow-hidden so halos bleed beyond the card */}
          <div className="relative">

            {/* Layer 1 — primary blue center glow */}
            <div className="absolute -inset-6 rounded-[50px] pointer-events-none" style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(55, 105, 230, 0.32) 0%, rgba(60, 90, 210, 0.18) 42%, transparent 70%)",
              filter: "blur(52px)",
            }} />
            {/* Layer 2 — violet accent, offset upper-right */}
            <div className="absolute -inset-10 rounded-[58px] pointer-events-none" style={{
              background: "radial-gradient(ellipse at 65% 35%, rgba(100, 60, 220, 0.20) 0%, transparent 56%)",
              filter: "blur(76px)",
            }} />
            {/* Layer 3 — deep indigo outer halo */}
            <div className="absolute -inset-16 rounded-[66px] pointer-events-none" style={{
              background: "radial-gradient(ellipse at 40% 62%, rgba(28, 55, 170, 0.15) 0%, transparent 52%)",
              filter: "blur(100px)",
            }} />

            <div
              className="device-house tilt-card relative rounded-[32px] overflow-hidden perspective-1200 h-[560px] xl:h-[660px]"
              style={{
                boxShadow: [
                  "0 0 0 1px rgba(90, 140, 255, 0.10)",
                  "0 0 30px rgba(45, 85, 210, 0.22)",
                  "0 0 80px rgba(25, 55, 165, 0.16)",
                  "0 32px 80px rgba(0, 0, 0, 0.70)",
                ].join(", "),
              }}
            >
              <div className="absolute inset-0 z-0">
                <RoomScene />
              </div>

              {/* Inner vignette — soft edge darkening for depth */}
              <div className="absolute inset-0 rounded-[32px] pointer-events-none" style={{
                background: [
                  "radial-gradient(ellipse at 50% 50%, transparent 42%, rgba(4, 8, 22, 0.50) 100%)",
                  "linear-gradient(180deg, rgba(4,8,22,0.14) 0%, transparent 22%, transparent 70%, rgba(4,8,22,0.42) 100%)",
                ].join(", "),
              }} />

              {/* Top shimmer accent line */}
              <div className="absolute top-0 left-[18%] right-[18%] h-px pointer-events-none" style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(130, 180, 255, 0.50) 50%, transparent 100%)",
              }} />

              {/* Subtle corner glints */}
              <div className="absolute top-0 left-0 w-24 h-24 rounded-tl-[32px] pointer-events-none" style={{
                background: "radial-gradient(ellipse at 0% 0%, rgba(100, 150, 255, 0.10) 0%, transparent 70%)",
              }} />
              <div className="absolute top-0 right-0 w-24 h-24 rounded-tr-[32px] pointer-events-none" style={{
                background: "radial-gradient(ellipse at 100% 0%, rgba(120, 80, 240, 0.08) 0%, transparent 70%)",
              }} />
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
