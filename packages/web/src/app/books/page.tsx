"use client";

import { Button } from "@/components/Button";

export default function BooksPage() {
  return (
    <div>
      <h1>Bücher</h1>
      <p>Diese Seite wird von dir implementiert. Viel Erfolg!</p>
      <Button
        variant={"primary"}
        type={"button"}
        children="Hello"
        disabled={false}
        onClick={() => console.log("Hallo")}
      />
      <Button
        variant={"danger"}
        type={"button"}
        children="Hello"
        disabled={false}
        onClick={() => console.log("Hallo")}
      />
      <Button
        variant={"danger"}
        type={"button"}
        children="Hello"
        disabled={true}
        onClick={() => console.log("Hallo")}
      />
    </div>
  );
}
