# Readme: Buchverwaltung Challenge

## 1. Erkenntnisse & Konzepte

### Next.js
* Framework für Fullstack-React-Anwendungen.
* Server vs. Client Components: [Erkenntnisse hier eintragen]
* Route Handlers (API): [Erkenntnisse hier eintragen]

### Drizzle ORM
* Type-safe SQL Query Builder für TypeScript.
* Relationen & Constraints: [Erkenntnisse hier eintragen]

### Clean Code
* DRY-Prinzip (Don't Repeat Yourself): [Erkenntnisse hier eintragen]
* Ausbaufähige Komponenten-Schnittstellen: [Erkenntnisse hier eintragen]

---

## 2. Aufgaben & Fortschritt

### Aufgabe 1: UI-Basis — Button
* Status: Erledigt
* Code:

```tsx
type ButtonProps = {
  variant: "primary" | "danger";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

const BASE_STYLE =
  "font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 transition-all duration-200";

const VARIANT_STYLES = {
  primary:
    "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80",
  danger:
    "text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80",
};

const DISABLED_STYLE =
  "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed";

export const Button = ({ variant, type, onClick, disabled, children }: ButtonProps) => {
  const buttonStyle = `${BASE_STYLE} ${disabled ? DISABLED_STYLE : VARIANT_STYLES[variant]}`;

  return (
    <button className={buttonStyle} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

```

### Aufgabe 2: UI-Basis — Input + Select

* Status: Offen
* Code Input:
```tsx
// Dein Code hier

```


* Code Select:
```tsx
// Dein Code hier

```



### Aufgabe 3: UI-Komposition — BookForm

* Status: Offen
* Notiz: Wiederverwendbar für Create & Edit (erhält onSubmit als Prop)
* Code:
```tsx
// Dein Code hier

```



### Aufgabe 4: Bücher-Seite mit Mock-Daten

* Status: Offen
* Notiz: Lokaler State im Frontend vor API-Anbindung

### Aufgabe 5 & 6: Datenbank-Schema & Migrationen

* Status: Offen
* Befehle:
* `pnpm --filter @book-manager/database generate`
* `pnpm --filter @book-manager/database migrate`



### Aufgabe 7 & 8: API-Endpunkte & Zod-Validierung

* Status: Offen
* Endpunkte: GET/POST `/api/books`, DELETE `/api/books/[id]`

### Aufgabe 9 & 10: PUT, Suche & Paginierung

* Status: Offen

### Aufgabe 11, 12 & 13: Tests, Optimistic UI & Server Actions

* Status: Offen

---

## 3. Fehler & Lösungen

### [Fehlermeldung hier]

* Ursache:
* Lösung:

```

---

Welche Aufgabe gehst du als Nächstes an?

```