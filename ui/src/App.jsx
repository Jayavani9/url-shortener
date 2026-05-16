import { useState, useEffect } from "react";

const BASE = "http://localhost:8000";

export default function UrlShortenerUI() {
  const [url, setUrl]           = useState("");
  const [alias, setAlias]       = useState("");
  const [apiKey, setApiKey]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState("");
  const [copied, setCopied]     = useState(false);
  const [analytics, setAnalytics] = useState([]);
  const [stats, setStats]       = useState({ links: 0, clicks: 0 });

  useEffect(() => { loadAnalytics(); }, []);

  async function loadAnalytics() {
    try {
      const resp = await fetch(`${BASE}/urls`, {
        headers: { "X-API-Key": apiKey || "" }
      });
      const data = await resp.json();
      const urls = data.urls || [];
      setAnalytics(urls);
      setStats({
        links:  urls.length,
        clicks: urls.reduce((sum, u) => sum + u.hits, 0),
      });
    } catch {}
  }

  async function handleShorten() {
    setError(""); setResult(null);
    if (!url) return setError("Please paste a URL.");
    if (!apiKey) return setError("API key required.");
    setLoading(true);
    try {
      const resp = await fetch(`${BASE}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: JSON.stringify({ url }),
      });
      const data = await resp.json();
      if (!resp.ok) return setError(data.error || "Something went wrong.");
      setResult(data);
      loadAnalytics();
    } catch {
      setError("Cannot reach server. Is it running on port 8000?");
    } finally {
      setLoading(false);
    }
  }

  function copyUrl() {
    if (!result) return;
    navigator.clipboard.writeText(result.short_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)",
      color: "white",
      padding: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 1200, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>

        {/* ── Left ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "8px 18px", borderRadius: 999, fontSize: 13, color: "#cbd5e1",
            width: "fit-content"
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", animation: "pulse 2s infinite" }}/>
            Smart URL Management Platform
          </div>

          <div>
            <h1 style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.1, letterSpacing: -2, marginBottom: 16 }}>
              Shorten URLs.<br/>
              <span style={{ background: "linear-gradient(90deg, #22d3ee, #3b82f6, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Grow Faster.
              </span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 18, lineHeight: 1.7, maxWidth: 480 }}>
              Create sleek, trackable, and shareable links with advanced analytics, custom branding, and lightning-fast performance.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => document.getElementById("urlInput").focus()}
              style={{
                padding: "14px 28px", borderRadius: 16, border: "none", cursor: "pointer",
                background: "linear-gradient(90deg, #06b6d4, #3b82f6)",
                color: "white", fontWeight: 700, fontSize: 15,
                boxShadow: "0 8px 32px rgba(6,182,212,0.3)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.target.style.transform = "scale(1)"}
            >
              Get Started Free
            </button>
            <button style={{
              padding: "14px 28px", borderRadius: 16, cursor: "pointer",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
              color: "white", fontWeight: 600, fontSize: 15,
              backdropFilter: "blur(12px)",
            }}>
              View Analytics
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, paddingTop: 8 }}>
            {[
              { label: "Links Created", value: stats.links > 0 ? `${stats.links}` : "12M+" },
              { label: "Monthly Clicks", value: stats.clicks > 0 ? `${stats.clicks}` : "98M+" },
              { label: "Uptime",         value: "99.99%" },
            ].map(item => (
              <div key={item.label} style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(16px)", borderRadius: 24, padding: "20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
              }}>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{item.value}</div>
                <div style={{ color: "#64748b", fontSize: 13, marginTop: 6 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Card ── */}
        <div style={{ position: "relative" }}>
          {/* glow */}
          <div style={{
            position: "absolute", inset: -20,
            background: "rgba(6,182,212,0.15)", filter: "blur(60px)", borderRadius: "50%",
            pointerEvents: "none"
          }}/>

          <div style={{
            position: "relative",
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(32px)", borderRadius: 36, padding: 32,
            boxShadow: "0 32px 80px rgba(0,0,0,0.4)", overflow: "hidden"
          }}>
            {/* purple blob */}
            <div style={{
              position: "absolute", top: -40, right: -40, width: 180, height: 180,
              background: "rgba(168,85,247,0.2)", filter: "blur(60px)", borderRadius: "50%",
              pointerEvents: "none"
            }}/>

            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800 }}>Create Short Link</h2>
                  <p style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>Transform long URLs instantly</p>
                </div>
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: "linear-gradient(135deg, #22d3ee, #3b82f6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, boxShadow: "0 8px 24px rgba(59,130,246,0.4)"
                }}>🔗</div>
              </div>

              {/* API Key */}
              <div>
                <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>
                  API Key
                </label>
                <div style={inputWrap}>
                  <span style={{ fontSize: 16 }}>🔑</span>
                  <input
                    type="password"
                    placeholder="Your API key from .env"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    style={inputStyle}
                  />
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: apiKey ? "#34d399" : "#475569",
                    boxShadow: apiKey ? "0 0 8px #34d399" : "none",
                    transition: "all 0.3s", flexShrink: 0
                  }}/>
                </div>
              </div>

              {/* URL input */}
              <div>
                <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>
                  Paste your long URL
                </label>
                <div style={inputWrap}>
                  <span style={{ fontSize: 16 }}>🌐</span>
                  <input
                    id="urlInput"
                    type="text"
                    placeholder="https://your-super-long-url.com/goes/here"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleShorten()}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Custom alias + expiry */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Custom Alias</label>
                  <div style={inputWrap}>
                    <span style={{ color: "#475569", fontSize: 13 }}>snip/</span>
                    <input
                      type="text"
                      placeholder="brand-name"
                      value={alias}
                      onChange={e => setAlias(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Expiry</label>
                  <div style={{ ...inputWrap, color: "#94a3b8", fontSize: 14 }}>
                    Never Expire
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding: "12px 16px", borderRadius: 12,
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                  color: "#f87171", fontSize: 13, fontFamily: "monospace"
                }}>
                  ⚠ {error}
                </div>
              )}

              {/* Button */}
              <button
                onClick={handleShorten}
                disabled={loading}
                style={{
                  width: "100%", padding: "16px", borderRadius: 16, border: "none",
                  background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(90deg, #06b6d4, #3b82f6, #a855f7)",
                  color: "white", fontWeight: 700, fontSize: 16, cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 8px 32px rgba(59,130,246,0.4)",
                  transition: "all 0.3s",
                  transform: loading ? "none" : "scale(1)",
                }}
                onMouseEnter={e => { if (!loading) e.target.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.target.style.transform = "scale(1)"; }}
              >
                {loading ? "⏳ Generating..." : "Generate Short URL"}
              </button>

              {/* Result */}
              {result && (
                <div style={{
                  background: "rgba(2,6,23,0.6)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 24, padding: 20,
                  animation: "fadeIn 0.3s ease",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Your Short Link</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#22d3ee" }}>{result.short_url}</div>
                    </div>
                    <button
                      onClick={copyUrl}
                      style={{
                        padding: "8px 20px", borderRadius: 12, border: "none", cursor: "pointer",
                        background: copied ? "linear-gradient(90deg,#06b6d4,#3b82f6)" : "rgba(255,255,255,0.1)",
                        color: "white", fontWeight: 600, fontSize: 13,
                        transition: "all 0.2s",
                      }}
                    >
                      {copied ? "✓ Copied!" : "Copy"}
                    </button>
                  </div>

                  {/* Mini analytics from loaded data */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                    {[
                      { title: "Clicks",  value: analytics.find(u => u.code === result.code)?.hits ?? 0 },
                      { title: "Code",    value: result.code },
                      { title: "Status",  value: "Active" },
                    ].map(item => (
                      <div key={item.title} style={{
                        background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "14px",
                        border: "1px solid rgba(255,255,255,0.05)"
                      }}>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>{item.value}</div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{item.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analytics table */}
              {analytics.length > 0 && (
                <div style={{
                  background: "rgba(2,6,23,0.4)", borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden"
                }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#64748b", letterSpacing: 1, textTransform: "uppercase" }}>Recent Links</span>
                    <button onClick={loadAnalytics} style={{ background: "none", border: "none", color: "#22d3ee", cursor: "pointer", fontSize: 12 }}>↻ Refresh</button>
                  </div>
                  {analytics.slice(0, 4).map(row => (
                    <div key={row.code} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)",
                      fontSize: 13,
                    }}>
                      <span style={{
                        background: "rgba(34,211,238,0.1)", color: "#22d3ee",
                        padding: "3px 10px", borderRadius: 6, fontFamily: "monospace", fontSize: 12, fontWeight: 700
                      }}>{row.code}</span>
                      <span style={{ color: "#64748b", flex: 1, margin: "0 12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {row.original}
                      </span>
                      <span style={{
                        background: "rgba(168,85,247,0.15)", color: "#a78bfa",
                        padding: "3px 10px", borderRadius: 99, fontSize: 12
                      }}>{row.hits} hits</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: #475569 !important; }
      `}</style>
    </div>
  );
}

const inputWrap = {
  background: "rgba(2,6,23,0.4)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10,
};

const inputStyle = {
  background: "transparent", outline: "none", border: "none",
  color: "white", fontSize: 14, width: "100%",
};
