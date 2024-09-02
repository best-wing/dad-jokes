"use client";

import { useState } from "react";
import SearchBar from "./components/SearchBar";
import styles from "./page.module.css";

export default function Home() {
  const [selectedJoke, setSelectedJoke] = useState<string>("");

  return (
    <main>
      <h1 className={styles.title}>Search jokes</h1>
      <p className={styles.jokeText}>{selectedJoke}</p>
      <SearchBar onSelect={(joke) => setSelectedJoke(joke)} />
    </main>
  );
}
