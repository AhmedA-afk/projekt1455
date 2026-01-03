"use client";

import Countdown from "@/components/Countdown";
import DayHero from "@/components/DayHero";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <DayHero />

      <div className={styles.countdownWrapper}>
        <Countdown />
      </div>
    </main>
  );
}
