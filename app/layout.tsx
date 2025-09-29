export const metadata = {
  title: "Bienestar IA",
  description: "Asistente de apoyo emocional (no sustituye terapia)."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <a href="/" style={{ fontWeight: 700, fontSize: 20 }}>Bienestar IA</a>
            <nav style={{ display: "flex", gap: 16 }}>
              <a href="/chat">Chat</a>
            </nav>
          </header>
          {children}
          <footer style={{ marginTop: 48, fontSize: 13, color: "#666" }}>
            <p>
              Este servicio ofrece apoyo emocional básico y <strong>no es atención sanitaria</strong>.
              No realizamos diagnósticos ni terapias. En emergencia llama al <strong>112</strong> o al <strong>024</strong> (España, 24 h).
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
