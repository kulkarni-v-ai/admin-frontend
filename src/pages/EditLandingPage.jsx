import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import {
    FiSave, FiRefreshCw, FiAlertTriangle, FiCheckCircle,
    FiChevronDown, FiChevronUp, FiExternalLink
} from "react-icons/fi";

const CARD_BG     = "rgba(255,255,255,0.03)";
const CARD_BORDER = "rgba(255,255,255,0.07)";
const INPUT_STYLE = {
    width: "100%", padding: "9px 12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "9px", color: "#e2e8f0",
    fontSize: "0.875rem", outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s",
    fontFamily: "inherit"
};
const PRIMARY = "#d4af37";

// ── Collapsible Section Wrapper ──────────────────────────
function Section({ title, emoji, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: "16px", overflow: "hidden" }}
        >
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    width: "100%", display: "flex", justifyContent: "space-between",
                    alignItems: "center", padding: "16px 20px",
                    background: "none", border: "none", cursor: "pointer",
                    color: "#fff", fontWeight: 700, fontSize: "0.95rem"
                }}
            >
                <span>{emoji} {title}</span>
                {open ? <FiChevronUp color="#64748b" /> : <FiChevronDown color="#64748b" />}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: "hidden" }}
                    >
                        <div style={{ padding: "0 20px 20px" }}>{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function Field({ label, value, onChange, multiline = false, placeholder = "" }) {
    return (
        <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                {label}
            </label>
            {multiline
                ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.6 }} />
                : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={INPUT_STYLE} />
            }
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────
export default function EditLandingPage() {
    const [cms, setCms]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError]   = useState(null);
    const [toast, setToast]   = useState(null); // { type: 'success'|'error', msg }

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchCMS = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const res = await api.get("/cms");
            setCms(res.data);
        } catch {
            setError("Failed to load CMS content.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCMS(); }, [fetchCMS]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const { hero, services, portfolio, statistics, shopHighlight, cta } = cms;
            await api.put("/cms", { hero, services, portfolio, statistics, shopHighlight, cta });
            showToast("success", "Landing page updated successfully!");
        } catch (err) {
            showToast("error", err.response?.data?.message || "Save failed.");
        } finally {
            setSaving(false);
        }
    };

    // Helper updaters
    const setHero   = (key, val) => setCms(c => ({ ...c, hero: { ...c.hero, [key]: val } }));
    const setShop   = (key, val) => setCms(c => ({ ...c, shopHighlight: { ...c.shopHighlight, [key]: val } }));
    const setCta    = (key, val) => setCms(c => ({ ...c, cta: { ...c.cta, [key]: val } }));
    const setStat   = (i, key, val) => setCms(c => { const s = [...c.statistics]; s[i] = { ...s[i], [key]: val }; return { ...c, statistics: s }; });
    const setPortfolio = (i, key, val) => setCms(c => { const p = [...c.portfolio]; p[i] = { ...p[i], [key]: val }; return { ...c, portfolio: p }; });
    const setService = (si, key, val) => setCms(c => { const s = [...c.services]; s[si] = { ...s[si], [key]: val }; return { ...c, services: s }; });
    const setServiceItem = (si, ii, val) => setCms(c => {
        const s = [...c.services]; const items = [...s[si].items]; items[ii] = val;
        s[si] = { ...s[si], items }; return { ...c, services: s };
    });

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", flexDirection: "column", gap: "14px" }}>
            <div style={{ width: "32px", height: "32px", border: `3px solid rgba(212,175,55,0.2)`, borderTopColor: PRIMARY, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            <p style={{ color: "#475569", fontSize: "0.875rem" }}>Loading CMS…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (error) return (
        <div style={{ padding: "3rem", textAlign: "center" }}>
            <FiAlertTriangle size={36} color="#ef4444" style={{ marginBottom: "10px" }} />
            <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>
            <button onClick={fetchCMS} style={{ padding: "10px 24px", background: PRIMARY, color: "#000", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 700 }}>Retry</button>
        </div>
    );

    if (!cms) return null;

    return (
        <div style={{ padding: "28px", maxWidth: "900px", margin: "0 auto" }}>

            {/* ── Header ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#fff", margin: 0 }}>Edit Landing Page</h1>
                    <p style={{ color: "#475569", fontSize: "0.875rem", marginTop: "6px" }}>
                        Changes save to the database and reflect live on <a href="https://houseofvisuals.co.in" target="_blank" rel="noopener noreferrer" style={{ color: PRIMARY, textDecoration: "none" }}>houseofvisuals.co.in <FiExternalLink size={11} /></a>
                    </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={fetchCMS}
                        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: "10px", color: "#64748b", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
                        <FiRefreshCw size={13} /> Reset
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
                        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 20px", background: `linear-gradient(135deg, ${PRIMARY}, #b8962c)`, border: "none", borderRadius: "10px", color: "#000", fontSize: "0.875rem", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, boxShadow: `0 4px 16px rgba(212,175,55,0.25)` }}>
                        <FiSave size={13} /> {saving ? "Saving…" : "Save Changes"}
                    </motion.button>
                </div>
            </div>

            {/* ── Toast ── */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "10px", marginBottom: "20px", fontSize: "0.875rem", fontWeight: 600,
                            background: toast.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                            border: `1px solid ${toast.type === "success" ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
                            color: toast.type === "success" ? "#34d399" : "#f87171"
                        }}>
                        {toast.type === "success" ? <FiCheckCircle size={16} /> : <FiAlertTriangle size={16} />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                {/* Hero */}
                <Section title="Hero Section" emoji="🌟" defaultOpen={true}>
                    <Field label="Tag Line"     value={cms.hero?.tag || ""}        onChange={v => setHero("tag", v)}        placeholder="e.g. Creative Agency & Shop" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                        <Field label="Title Line 1" value={cms.hero?.titleLine1 || ""} onChange={v => setHero("titleLine1", v)} placeholder="HOUSE" />
                        <Field label="Title Line 2" value={cms.hero?.titleLine2 || ""} onChange={v => setHero("titleLine2", v)} placeholder="OF" />
                        <Field label="Title Line 3" value={cms.hero?.titleLine3 || ""} onChange={v => setHero("titleLine3", v)} placeholder="VISUALS" />
                    </div>
                    <Field label="Subtitle" value={cms.hero?.subtitle || ""} onChange={v => setHero("subtitle", v)} placeholder="Creative growth and marketing house." multiline />
                </Section>

                {/* Statistics */}
                <Section title="Statistics" emoji="📊">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                        {(cms.statistics || []).map((stat, i) => (
                            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${CARD_BORDER}`, borderRadius: "10px", padding: "12px" }}>
                                <Field label="Value" value={stat.value} onChange={v => setStat(i, "value", v)} placeholder="10M+" />
                                <Field label="Label" value={stat.label} onChange={v => setStat(i, "label", v)} placeholder="Views" />
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Services */}
                <Section title="Services" emoji="⚙️">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                        {(cms.services || []).map((svc, si) => (
                            <div key={si} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${CARD_BORDER}`, borderRadius: "10px", padding: "14px" }}>
                                <Field label="Service Title" value={svc.title} onChange={v => setService(si, "title", v)} />
                                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Items</label>
                                {(svc.items || []).map((item, ii) => (
                                    <input key={ii} type="text" value={item} onChange={e => setServiceItem(si, ii, e.target.value)}
                                        style={{ ...INPUT_STYLE, marginBottom: "6px", display: "block" }} placeholder={`Item ${ii + 1}`} />
                                ))}
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Portfolio */}
                <Section title="Portfolio" emoji="🖼️">
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {(cms.portfolio || []).map((p, i) => (
                            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${CARD_BORDER}`, borderRadius: "10px", padding: "14px" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                                    <Field label="Title"    value={p.title}    onChange={v => setPortfolio(i, "title", v)}    />
                                    <Field label="Category" value={p.category} onChange={v => setPortfolio(i, "category", v)} />
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Span</label>
                                        <select value={p.span} onChange={e => setPortfolio(i, "span", e.target.value)}
                                            style={{ ...INPUT_STYLE, cursor: "pointer" }}>
                                            <option value="normal">Normal</option>
                                            <option value="wide">Wide</option>
                                            <option value="tall">Tall</option>
                                        </select>
                                    </div>
                                </div>
                                <Field label="Image URL" value={p.img} onChange={v => setPortfolio(i, "img", v)} placeholder="https://…" />
                                {p.img && (
                                    <img src={p.img} alt={p.title} onError={e => e.target.style.display = "none"}
                                        style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "8px", marginTop: "8px", opacity: 0.7 }} />
                                )}
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Shop Highlight */}
                <Section title="Shop Highlight" emoji="🛍️">
                    <Field label="Tag"     value={cms.shopHighlight?.tag    || ""} onChange={v => setShop("tag",    v)} placeholder="Shop Internet Culture" />
                    <Field label="Title 1" value={cms.shopHighlight?.title1 || ""} onChange={v => setShop("title1", v)} placeholder="Wear The" />
                    <Field label="Title 2" value={cms.shopHighlight?.title2 || ""} onChange={v => setShop("title2", v)} placeholder="Vision." />
                </Section>

                {/* CTA */}
                <Section title="Call to Action" emoji="📣">
                    <Field label="Title Line 1" value={cms.cta?.titleLine1 || ""} onChange={v => setCta("titleLine1", v)} placeholder="READY TO" />
                    <Field label="Title Line 2" value={cms.cta?.titleLine2 || ""} onChange={v => setCta("titleLine2", v)} placeholder="BE SEEN?" />
                </Section>

            </div>

            {/* Sticky Save Bar */}
            <div style={{ position: "sticky", bottom: "20px", marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 28px", background: `linear-gradient(135deg, ${PRIMARY}, #b8962c)`, border: "none", borderRadius: "12px", color: "#000", fontSize: "0.9rem", fontWeight: 800, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, boxShadow: `0 8px 24px rgba(212,175,55,0.35)` }}>
                    <FiSave size={15} /> {saving ? "Saving…" : "Save All Changes"}
                </motion.button>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
