"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const FREE_DAILY_LIMIT = 10;

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hola 👋 Soy tu asistente de bienestar. Te escucho y te ayudo con técnicas simples. ¿Qué te trae por aquí hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Plan MVP: toggles locales (luego se conectan a Stripe)
  const [plan, setPlan] = useState<"free" | "basic" | "premium">("free");

  const todayKey = getTodayKey();
  const usedToday = useMemo(() => {
    const raw = localStorage.getItem("usedToday");
    const parsed = raw ? JSON.parse(raw) as { day: string; count: number } : { day: todayKey, count: 0 };
    if (parsed.day !== todayKey) {
      localStorage.setItem("usedToday", JSON.stringify({ day: todayKey, count: 0 }));
      return 0;
    }
    return parsed.count;
  }, [todayKey, messages.length]);

  const canSend = plan === "free" ? usedToday < FREE_DAILY_LIMIT : true;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function incUsage() {
    const raw = localStorage.getItem("usedToday");
    const parsed = raw ? JSON.parse(raw) : { day: todayKey, count: 0 };
    const next = parsed.day === todayKey ? { ...parsed, count: parsed.count + 1 } : { day: todayKey, count: 1 };
    localStorage.setItem("usedToday", JSON.stringify(next));
  }

  async function sendMessage() {
    if (!input.trim()) return;
    if (!canSend) {
      setMessages(m => [...m, { role: "assistant", content: "Has llegado al límite diario del plan Gratis (10 mensajes). Vuelve mañana o pasa a un plan de pago para seguir chateando sin límite." }]);
      return;
    }
    const newMsgs = [...messages, { role: "user", content: input.trim() }];
    setMessages(newMsgs);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: newMsgs })
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "assistant", content: data.content }]);
      incUsage();
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "No he podido responder ahora. Inténtalo otra vez, por favor." }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <strong>Plan:</strong>
          <button className={`btn ${plan === "free" ? "" : "secondary"}`} onClick={() => setPlan("free")}>Gratis</button>
          <button className={`btn ${plan === "basic" ? "" : "secondary"}`} onClick={() => setPlan("basic")}>Básico</button>
          <button className={`btn ${plan === "premium" ? "" : "secondary"}`} onClick={() => setPlan("premium")}>Premium</button>
          {plan === "free" && (
            <span style={{ marginLeft: "auto", fontSize: 13, color: "#666" }}>
              Hoy: {usedToday}/{FREE_DAILY_LIMIT} mensajes
            </span>
          )}
        </div>
      </div>

      <div className="card" style={{ height: "65vh", overflowY: "auto", marginBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "10px 0", display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "75%",
              padding: "10px 12px",
              borderRadius: 12,
              background: m.role === "user" ? "#111" : "#f2f2f2",
              color: m.role === "user" ? "#fff" : "#111",
              whiteSpace: "pre-wrap",
              fontSize: 16,
              lineHeight: 1.4
            }}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="card" style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe aquí…"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          style={{ flex: 1, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <button className="btn" onClick={sendMessage} disabled={sending}>{sending ? "Enviando…" : "Enviar"}</button>
      </div>

      <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
        Consejo: escribe en frases cortas. Si necesitas ayuda inmediata: 112 / 024 (España).
      </div>
    </main>
  );
}
