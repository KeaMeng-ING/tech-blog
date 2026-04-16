"use client";

import { useEffect, useState } from "react";
import { newsletterService } from "@/services/newsletter.service";
import { categoriesService } from "@/services/categories.service";
import { Subscription, NewsletterHistory, Category } from "@/types";

export default function NewsletterPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [history, setHistory] = useState<NewsletterHistory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendModal, setSendModal] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [sendResult, setSendResult] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [subs, hist, cats] = await Promise.all([
        newsletterService.getSubscriptions(),
        newsletterService.getHistory(),
        categoriesService.getAll(),
      ]);
      setSubscriptions(subs);
      setHistory(hist);
      setCategories(cats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSend = async () => {
    if (selectedTopics.length === 0) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await newsletterService.sendNewsletter(selectedTopics);
      setSendResult(res.message);
      await load();
    } catch (e: unknown) {
      setSendResult(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const handlePause = async (id: string) => {
    await newsletterService.pauseSubscription(id);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this subscription?")) return;
    await newsletterService.deleteSubscription(id);
    load();
  };

  const activeCount = subscriptions.filter((s) => s.isActive).length;

  const statusColor: Record<string, { bg: string; color: string }> = {
    Success: { bg: "rgba(34,197,94,0.1)", color: "#22c55e" },
    Failed: { bg: "rgba(239,68,68,0.1)", color: "#f87171" },
    Pending: { bg: "rgba(234,179,8,0.1)", color: "#eab308" },
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h1 style={{ color: "#a78bfa", fontSize: "36px", fontWeight: 700, margin: "0 0 4px" }}>Newsletter Management</h1>
          <p style={{ color: "#6b7280", margin: 0, fontSize: "14px", maxWidth: "500px" }}>
            Broadcast ecosystem updates and manage your subscriber network with high-fidelity engagement tools.
          </p>
        </div>
        <button
          onClick={() => setSendModal(true)}
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", border: "none", borderRadius: "8px", padding: "10px 20px", color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
        >
          ▶ Manual Send
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "28px" }}>
        <div style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "12px", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ color: "#6b7280", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "8px" }}>TOTAL SUBSCRIBERS</div>
            <div style={{ color: "white", fontSize: "32px", fontWeight: 700 }}>{loading ? "—" : subscriptions.length.toLocaleString()}</div>
            <div style={{ color: "#22d3ee", fontSize: "12px", marginTop: "4px" }}>↑ +12.4% this month</div>
          </div>
          <div style={{ width: "40px", height: "40px", background: "#13131f", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
        </div>
        <div style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "12px", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ color: "#6b7280", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "8px" }}>ACTIVE SUBSCRIBERS</div>
            <div style={{ color: "white", fontSize: "32px", fontWeight: 700 }}>{loading ? "—" : activeCount}</div>
            <div style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px" }}>of {subscriptions.length} total</div>
          </div>
          <div style={{ width: "40px", height: "40px", background: "#13131f", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12" />
            </svg>
          </div>
        </div>
        <div style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "12px", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ color: "#6b7280", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "8px" }}>NEWSLETTERS SENT</div>
            <div style={{ color: "white", fontSize: "32px", fontWeight: 700 }}>{loading ? "—" : history.length}</div>
            <div style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px" }}>All time</div>
          </div>
          <div style={{ width: "40px", height: "40px", background: "#13131f", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "20px" }}>
        {/* Subscriber Registry */}
        <div style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #1e1e35" }}>
            <h3 style={{ color: "white", margin: 0, fontSize: "16px", fontWeight: 600 }}>Subscriber Registry</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e1e35" }}>
                {["USER ENTITY", "STATUS", "TOPICS", "JOINED", "ACTIONS"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", color: "#6b7280", fontSize: "11px", fontWeight: 600, letterSpacing: "0.8px", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>Loading...</td></tr>
              ) : subscriptions.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>No subscribers yet.</td></tr>
              ) : subscriptions.map((sub) => (
                <tr key={sub.id} style={{ borderBottom: "1px solid #13131f" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", background: "#1e1e35", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>
                        {sub.email[0].toUpperCase()}
                      </div>
                      <span style={{ color: "white", fontSize: "13px" }}>{sub.email}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ background: sub.isActive ? "rgba(34,197,94,0.1)" : "rgba(107,114,128,0.1)", color: sub.isActive ? "#22c55e" : "#9ca3af", fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "4px" }}>
                      {sub.isActive ? "ACTIVE" : "PAUSED"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#9ca3af", fontSize: "12px" }}>{sub.topics.join(", ")}</td>
                  <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: "12px" }}>{new Date(sub.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {sub.isActive && (
                        <button onClick={() => handlePause(sub.id)}
                          style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)", borderRadius: "5px", padding: "4px 8px", color: "#eab308", fontSize: "11px", cursor: "pointer" }}>
                          Pause
                        </button>
                      )}
                      <button onClick={() => handleDelete(sub.id)}
                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "5px", padding: "4px 8px", color: "#f87171", fontSize: "11px", cursor: "pointer" }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dispatch History */}
        <div style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "12px", padding: "20px" }}>
          <h3 style={{ color: "white", margin: "0 0 20px", fontSize: "16px", fontWeight: 600 }}>Dispatch History</h3>
          {loading ? (
            <p style={{ color: "#6b7280", fontSize: "13px" }}>Loading...</p>
          ) : history.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: "13px" }}>No newsletters sent yet.</p>
          ) : (
            history.map((h) => (
              <div key={h.id} style={{ display: "flex", gap: "12px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #13131f" }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: h.status === "Success" ? "#22c55e" : "#ef4444",
                    marginTop: "5px",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#6b7280", fontSize: "11px", marginBottom: "4px" }}>
                    {new Date(h.sentAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
                  </div>
                  <div style={{ color: "white", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                    {h.topics.join(", ")}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "11px", marginBottom: "8px" }}>
                    Sent to {h.totalSent} recipients
                  </div>
                  <span style={{ background: (statusColor[h.status] || statusColor.Pending).bg, color: (statusColor[h.status] || statusColor.Pending).color, fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px", letterSpacing: "0.5px" }}>
                    {h.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Manual Send Modal */}
      {sendModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#0e0e1a", border: "1px solid #1e1e35", borderRadius: "14px", padding: "28px", width: "440px" }}>
            <h3 style={{ color: "white", margin: "0 0 8px", fontSize: "18px", fontWeight: 600 }}>Manual Newsletter Send</h3>
            <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 20px" }}>Select topics to send the latest posts to active subscribers.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedTopics((t) => t.includes(cat.slug) ? t.filter((x) => x !== cat.slug) : [...t, cat.slug])}
                  style={{
                    background: selectedTopics.includes(cat.slug) ? "rgba(124,58,237,0.2)" : "#13131f",
                    border: `1px solid ${selectedTopics.includes(cat.slug) ? "#7c3aed" : "#1e1e35"}`,
                    borderRadius: "6px",
                    padding: "6px 12px",
                    color: selectedTopics.includes(cat.slug) ? "#a78bfa" : "#9ca3af",
                    fontSize: "13px",
                    cursor: "pointer",
                    fontWeight: selectedTopics.includes(cat.slug) ? 600 : 400,
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            {sendResult && (
              <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "8px", padding: "10px 14px", color: "#22c55e", fontSize: "13px", marginBottom: "16px" }}>
                {sendResult}
              </div>
            )}
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => { setSendModal(false); setSendResult(null); setSelectedTopics([]); }}
                style={{ background: "none", border: "1px solid #1e1e35", borderRadius: "8px", padding: "9px 18px", color: "#9ca3af", fontSize: "13px", cursor: "pointer" }}>
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={sending || selectedTopics.length === 0}
                style={{ background: selectedTopics.length === 0 ? "#1e1e35" : "linear-gradient(135deg, #7c3aed, #4f46e5)", border: "none", borderRadius: "8px", padding: "9px 18px", color: "white", fontSize: "13px", fontWeight: 600, cursor: sending || selectedTopics.length === 0 ? "not-allowed" : "pointer" }}
              >
                {sending ? "Sending..." : "Send Newsletter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}