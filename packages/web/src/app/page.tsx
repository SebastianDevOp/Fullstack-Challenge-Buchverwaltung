import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Willkommen zur Fullstack Challenge!</h1>

      <p>
        In dieser Challenge baust du eine einfache Buchverwaltungs-App mit Next.js und einer
        PostgreSQL-Datenbank. Die Grundstruktur ist bereits vorhanden – deine Aufgabe ist es, das
        Book-Feature vollständig zu implementieren.
      </p>

      <h2>Deine Aufgaben</h2>
      <ol>
        <li>
          <strong>Datenbank-Migration</strong> — Book Model in der Drizzle-Schema-Datei erstellen
          und die Datenbank migrieren
        </li>
        <li>
          <strong>API-Endpunkte</strong> — Routes für Bücher implementieren (GET, POST, PUT, DELETE)
        </li>
        <li>
          <strong>Frontend</strong> — Bücher-Seite bauen, die Bücher anzeigt und neue Bücher
          hinzufügen lässt
        </li>
      </ol>

      <h2>Nützliche Links</h2>
      <ul>
        <li>
          <Link href="/books">Bücher-Seite</Link> — Hier kommt deine Implementierung hin
        </li>
        <li>
          <a href="https://github.com/innFactory/book-manager" target="_blank" rel="noreferrer">
            README
          </a>{" "}
          — Aufgabenbeschreibung und weitere Details
        </li>
      </ul>

      <h2>Aktueller Stand</h2>
      <p>
        Die Bücher- und Autoren-Endpunkte liegen im Spring-Boot-Service unter{" "}
        <code>backend/book-api</code>. Das Frontend spricht über Server Actions mit diesem Service
        und greift nicht mehr selbst auf die Datenbank zu — es gibt genau einen Schreibweg. Die
        ursprünglichen Next.js-Routen wurden entfernt; sie stehen in der Git-Historie.
      </p>
      <p>
        <code>pnpm dev</code> startet Datenbank, Service und Frontend gemeinsam. Der Service braucht
        einige Sekunden zum Hochfahren – lädst du die Bücher-Seite sofort, schlägt der erste Aufruf
        fehl.
      </p>
    </div>
  );
}
