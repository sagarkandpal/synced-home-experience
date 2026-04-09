import { FormEvent, useMemo, useState } from "react";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { useSmartHome } from "@/context/SmartHomeContext";

const emptyForm = {
  name: "",
  dev: "",
  broker: "broker.hivemq.com",
  port: "8884",
  user: "",
};

const ExperienceSection = () => {
  const {
    connections,
    activeConnectionId,
    logs,
    saveConnection,
    deleteConnection,
    selectConnection,
    clearLog,
  } = useSmartHome();

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState("");

  const sortedLogs = useMemo(() => [...logs].reverse(), [logs]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = saveConnection(form, editId);
    if (!result.ok) {
      setFormMessage(result.message || "Could not save connection.");
      return;
    }

    setFormMessage(editId ? "Connection updated." : "Connection saved.");
    setForm(emptyForm);
    setEditId(null);
  };

  const onEdit = (id: string) => {
    const selected = connections.find((item) => item.id === id);
    if (!selected) return;
    setEditId(id);
    setForm({
      name: selected.name,
      dev: selected.dev,
      broker: selected.broker,
      port: selected.port,
      user: selected.user || "",
    });
    setFormMessage("");
  };

  return (
    <section id="experience" className="experience-section relative z-[2] w-full py-32 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="experience-intro mb-20 max-w-[780px]">
          <div className="text-accent text-[12px] tracking-[0.22em] uppercase font-extrabold mb-3">Connections + Activity</div>
          <h2 className="text-foreground text-[clamp(30px,4vw,48px)] leading-[1.05] tracking-tight font-extrabold mb-4">
            MQTT profiles, now living inside the site.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Save multiple brokers, switch the active device, and watch publish/subscribe traffic stream into the activity log.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-6">
          <div className="space-y-6">
            <form className="form-card tilt-card rounded-[32px] p-6 md:p-7 glass-surface-strong" onSubmit={onSubmit}>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <div className="text-accent text-[11px] font-extrabold tracking-[0.18em] uppercase mb-2">Profile Form</div>
                  <div className="text-foreground text-2xl font-bold">{editId ? "Edit Connection" : "New Connection"}</div>
                </div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-border bg-foreground/5">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="field-wrap sm:col-span-2">
                  <span>Name</span>
                  <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
                </label>
                <label className="field-wrap sm:col-span-2">
                  <span>Device ID</span>
                  <input value={form.dev} onChange={(event) => setForm((prev) => ({ ...prev, dev: event.target.value }))} />
                </label>
                <label className="field-wrap">
                  <span>Broker</span>
                  <input value={form.broker} onChange={(event) => setForm((prev) => ({ ...prev, broker: event.target.value }))} />
                </label>
                <label className="field-wrap">
                  <span>Port</span>
                  <input value={form.port} onChange={(event) => setForm((prev) => ({ ...prev, port: event.target.value }))} />
                </label>
                <label className="field-wrap sm:col-span-2">
                  <span>Username</span>
                  <input value={form.user} onChange={(event) => setForm((prev) => ({ ...prev, user: event.target.value }))} />
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-6">
                <button type="submit" className="control-btn control-btn--primary">
                  {editId ? "Save Changes" : "Save Connection"}
                </button>
                {editId ? (
                  <button
                    type="button"
                    className="control-btn"
                    onClick={() => {
                      setEditId(null);
                      setForm(emptyForm);
                      setFormMessage("");
                    }}
                  >
                    Cancel
                  </button>
                ) : null}
                {formMessage ? <span className="text-sm text-accent font-semibold">{formMessage}</span> : null}
              </div>
            </form>

            <div className="saved-list tilt-card rounded-[32px] p-6 md:p-7" style={{
              background: "linear-gradient(145deg, #050508 0%, #0a0a14 50%, #050508 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            }}>
              <div className="text-accent text-[11px] font-extrabold tracking-[0.18em] uppercase mb-2">Saved Profiles</div>
              <div className="text-foreground text-2xl font-bold mb-5">Connections</div>

              <div className="space-y-3">
                {connections.length ? (
                  connections.map((connection) => {
                    const isActive = connection.id === activeConnectionId;
                    return (
                      <div key={connection.id} className={`si ${isActive ? "sel" : ""}`}>
                        <div className="si-info">
                          <div className="si-name">{connection.name}</div>
                          <div className="si-detail">{connection.dev} · {connection.broker}:{connection.port}</div>
                        </div>
                        <div className="si-right">
                          <button className={`btn-use ${isActive ? "sel" : ""}`} onClick={() => selectConnection(connection.id)}>
                            {isActive ? <Check className="w-4 h-4" /> : "Use"}
                          </button>
                          <button className="ico-btn" onClick={() => onEdit(connection.id)}>
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button className="ico-btn del" onClick={() => deleteConnection(connection.id)}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty">No saved connections yet.</div>
                )}
              </div>
            </div>
          </div>

          <div className="full-log tilt-card rounded-[32px] p-6 md:p-7" style={{
            background: "linear-gradient(180deg, rgba(200,210,240,0.08), rgba(200,210,240,0.03)), linear-gradient(145deg, rgba(10,14,28,0.82) 0%, rgba(18,24,46,0.74) 54%, rgba(22,30,56,0.84) 100%)",
            border: "1px solid rgba(200,210,240,0.1)",
            boxShadow: "var(--shadow-lg)",
          }}>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <div className="text-accent text-[11px] font-extrabold tracking-[0.18em] uppercase mb-2">Activity Log</div>
                <div className="text-foreground text-2xl font-bold">Publish / Subscribe Stream</div>
              </div>
              <button className="control-btn" onClick={clearLog}>Clear Log</button>
            </div>

            <div className="log-shell">
              {sortedLogs.length ? (
                sortedLogs.map((log) => (
                  <div key={log.id} className="log-line">
                    <span className="log-t">{log.time}</span>
                    <span className={`log-m ${log.type}`}>{log.message}</span>
                  </div>
                ))
              ) : (
                <div className="empty">No events yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
