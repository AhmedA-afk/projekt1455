"use client";

import GoalsList from "@/components/GoalsList";
import styles from "./page.module.css";

export default function GoalsPage() {
    return (
        <main className={styles.main}>
            <h1 className={styles.title}>The 7 Goals</h1>
            <GoalsList />
        </main>
    );
}
