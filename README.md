# Buchverwaltung

![CI](https://github.com/SebastianDevOp/Fullstack-Challenge-Buchverwaltung/actions/workflows/ci.yml/badge.svg)

Eine Buchverwaltung mit polyglottem Backend: Next.js im Browser, Kotlin für die
Fachlogik, Scala für Empfehlungen. Entstanden als Coding-Challenge, seitdem
schrittweise zu einer vollständigen Anwendung ausgebaut.

## Architektur

```
                    ┌─────────────────┐
   Browser ────────►│  Next.js        │  Port 3000
                    │  Server Actions │
                    └────────┬────────┘
                             │ HTTP
                    ┌────────▼────────┐
                    │  Kotlin         │  Port 8080
                    │  Spring Boot    │  CRUD, Suche, Validierung
                    └────────┬────────┘
                             │ JDBC
                    ┌────────▼────────┐
                    │  PostgreSQL 17  │  Port 5432
                    └─────────────────┘

                    ┌─────────────────┐
                    │  Scala          │  Port 8081
                    │  Pekko HTTP     │  TF-IDF-Empfehlungen
                    └─────────────────┘
                             │ HTTP
                             └──────────► Kotlin-API

   Claude Desktop ──────────► MCP-Server (stdio) ──► Kotlin-API
```

Die Aufteilung ist bewusst: Der Kotlin-Dienst besitzt die Daten, der Scala-Dienst
rechnet. Er hält keine eigene Datenbankverbindung, sondern holt die Bücher über
HTTP — damit bleibt das Schema in einer Hand.

## Technologien

| Bereich | Womit |
|---|---|
| Web | Next.js 16, React 19, TypeScript, Tailwind 4 |
| API | Kotlin 2.3, Spring Boot 4.1, Hibernate, PostgreSQL 17 |
| Empfehlungen | Scala 3.3, Pekko HTTP, sbt |
| Migrationen | Flyway (im Kotlin-Dienst) |
| Tests | Vitest, JUnit 5, Testcontainers, MUnit |
| Werkzeuge | pnpm-Workspaces, Biome, Docker Compose, GitHub Actions |
| Integration | MCP-Server für Claude Desktop |

## Schnellstart

Voraussetzungen: Docker, Node mit pnpm, Java 21.

```bash
pnpm install
docker compose up -d --build
```

Das startet PostgreSQL, die Kotlin-API und den Empfehlungsdienst. Flyway legt das
Schema beim ersten Start selbst an — es sind keine weiteren Schritte nötig.

Testdaten einspielen:

```bash
pnpm --filter @book-manager/database seed
```

Web-Anwendung im Entwicklungsmodus:

```bash
pnpm run web:dev
```

Danach: <http://localhost:3000/books>

## Entwicklung

Für die tägliche Arbeit lässt man Datenbank und API im Container und startet nur
den Teil lokal, an dem man gerade arbeitet:

```bash
docker compose up -d postgres api        # Fundament im Container
pnpm run web:dev                         # Web lokal
```

Am Scala-Dienst:

```bash
docker compose up -d postgres api
cd backend/recommendation-service && sbt run
```

`sbt run` läuft nur im Vordergrund zuverlässig — es hält sich über
`StdIn.readLine()` am Leben.

### Nützliche Befehle

| Befehl | Wirkung |
|---|---|
| `pnpm run lint` | Biome über das gesamte Repository |
| `pnpm run typecheck` | TypeScript in allen Paketen |
| `pnpm --filter @book-manager/web test` | Web-Tests |
| `cd backend/book-api && ./gradlew test` | Kotlin-Tests inkl. Testcontainers |
| `cd backend/recommendation-service && sbt test` | Scala-Tests |
| `docker compose down` | Dienste stoppen, Daten bleiben |
| `docker compose down -v` | **löscht die Datenbank** |

Gradle und sbt beantworten wiederholte Aufrufe aus dem Cache. Für einen echten
Lauf: `./gradlew test --rerun-tasks` beziehungsweise `sbt clean test`.

## Struktur

```
backend/
  book-api/                  Kotlin, Spring Boot
    src/main/resources/db/migration/   Flyway-Migrationen
  recommendation-service/    Scala, Pekko HTTP
    src/main/scala/…/
      Models.scala           Datentypen und JSON-Formate
      TfIdf.scala            Zerlegung, IDF, Vektoren, Kosinus
      BooksClient.scala      Abruf der Bücher über HTTP
      Main.scala             Routen und Start
packages/
  web/                       Next.js
  mcp/                       MCP-Server für Claude Desktop
  database/                  Seed-Skript
```

## API

### Kotlin-Dienst — Port 8080

| Methode | Pfad | |
|---|---|---|
| GET | `/api/books` | Liste, mit `q`, `page`, `size` |
| GET | `/api/books/{id}` | einzelnes Buch |
| GET | `/api/books/titles` | nur die Titel |
| POST | `/api/books` | anlegen |
| PUT | `/api/books/{id}` | vollständig ersetzen |
| DELETE | `/api/books/{id}` | löschen |
| GET | `/api/authors` | Autorenliste |
| POST | `/api/authors` | anlegen oder vorhandenen zurückgeben |
| GET | `/api/health` | Zustand |

Die Suche liest Titel und Autorennamen. Sie ist als `UNION` formuliert statt als
`OR` über zwei Tabellen — nur so lassen sich die Trigramm-Indizes nutzen. Bei
50.000 Zeilen gemessen: 21 ms gegen 0,7 ms.

`POST /api/authors` löst den Namen normalisiert auf und gibt einen vorhandenen
Autor zurück, statt eine Dublette anzulegen. Ein eindeutiger Ausdrucks-Index in
der Datenbank sichert das auch gegen gleichzeitige Anfragen ab.

### Empfehlungsdienst — Port 8081

| Methode | Pfad | |
|---|---|---|
| GET | `/recommendations` | alle Titel |
| GET | `/recommendations/{id}` | ähnliche Bücher, absteigend |

Die Ähnlichkeit wird über **TF-IDF** und **Kosinus-Ähnlichkeit** berechnet, ohne
externe Bibliothek. Titel und Autorenname werden in Wörter zerlegt, seltene Wörter
höher gewichtet als häufige, und jedes Buch als Vektor dargestellt. Die Ähnlichkeit
zweier Bücher ist der Kosinus des Winkels zwischen ihren Vektoren.

Der Dienst lädt die Bücher **einmal beim Start**. Neu angelegte Bücher erscheinen
erst nach einem Neustart.

### MCP-Server

Fünf Werkzeuge für Claude Desktop: `get_books`, `search_books`, `get_authors`,
`add_book`, `delete_book`. Konfiguration in `packages/mcp/`.

## Datenbank

Das Schema gehört dem Kotlin-Dienst. Flyway wendet die Migrationen aus
`backend/book-api/src/main/resources/db/migration/` beim Start an; Hibernate prüft
danach mit `ddl-auto: validate`, ob Schema und Entities zusammenpassen.

Bei einer bestehenden Datenbank ohne Flyway-Historie greift
`baseline-version: 5` — der Ist-Zustand wird als Version 5 eingetragen und nichts
neu angewandt.

## Tests

| | Umfang |
|---|---|
| Web | 42 Tests, 6 Dateien — Zod-Schemata, Hooks, Komponenten, Server Actions |
| Kotlin | 33 Tests, 4 Dateien — Controller mit MockMvc, Repository mit Testcontainers |
| Scala | 7 Tests — die reinen TF-IDF-Funktionen |

Die Pipeline führt alle drei bei jedem Push und Pull Request aus.

## Geplant

Fünf Schritte bis zu einer Buchverwaltung, die man tatsächlich benutzen würde:

1. **Detailansicht** — Bücher lassen sich anlegen, ändern und löschen, aber nicht
   ansehen
2. **Beschreibungen** — Klappentexte von OpenLibrary, gespeichert in einer eigenen
   Spalte
3. **Empfehlungen in der Oberfläche** — der Scala-Dienst wird derzeit von keinem
   Client aufgerufen
4. **Lesestatus** — gelesen, am Lesen, will ich lesen
5. **Bewertungen und Notizen**

Danach: Redis als Zwischenspeicher vor OpenLibrary und den Empfehlungen,
Observability mit Actuator und Prometheus, Authentifizierung.

### Bekannte Grenzen

Die Beschreibungen aus Punkt 2 sind zugleich die Voraussetzung für brauchbare
Empfehlungen: Mit Titel und Autor allein hat jedes Buch nur rund acht Wörter, und
die Ähnlichkeit wird dann von Struktur-Wörtern wie „Teil 2" dominiert statt vom
Inhalt.

Die Cover-Bilder werden bei jedem Seitenaufruf einzeln von OpenLibrary geladen —
rund zwanzig Anfragen pro Aufruf, ohne Zwischenspeicher. Das ist der Grund für
Redis, nicht bloß eine Optimierung.

`docker compose up` genügt für den Betrieb; ein Deployment-Ziel, Datensicherungen
und Zugangsschutz gibt es nicht. Das Projekt läuft lokal, nicht öffentlich.
