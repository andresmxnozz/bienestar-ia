export default function HomePage() {
  return (
    <main>
      <section className="card" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Asistente de Bienestar (texto y voz)</h1>
        <p style={{ marginBottom: 12 }}>
          Te escucho con empatía y te guío con técnicas simples (respiración, grounding, higiene del sueño).
          <span className="badge" style={{ marginLeft: 8 }}>No sustituye terapia</span>
        </p>
        <a className="btn" href="/chat">Probar ahora</a>
      </section>

      <section className="card">
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>Planes y precios</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Precio</th>
              <th>Incluye</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Gratis</strong></td>
              <td>0 €</td>
              <td>
                Chat limitado (10 mensajes/día)<br/>
                Respuestas por texto<br/>
                1 ejercicio guiado (respiración/grounding)<br/>
                Recursos de emergencia
              </td>
              <td><a className="btn secondary" href="/chat">Empezar</a></td>
            </tr>
            <tr>
              <td><strong>Básico</strong></td>
              <td>4,99 €/mes</td>
              <td>
                Todo el Gratis +<br/>
                <strong>Texto ilimitado</strong><br/>
                Rutinas básicas (sueño/ansiedad)<br/>
                Historial guardado localmente
              </td>
              <td><a className="btn" href="/chat">Probar</a></td>
            </tr>
            <tr>
              <td><strong>Premium</strong></td>
              <td>9,99 €/mes</td>
              <td>
                Todo el Básico +<br/>
                <strong>Voz</strong> (enviar audio y recibir audio)<br/>
                <strong>Imágenes</strong> (próximo paso del MVP)<br/>
                Rutinas personalizadas + biblioteca de audios
              </td>
              <td><a className="btn" href="/chat">Probar</a></td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}
