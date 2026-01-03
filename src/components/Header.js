"use client";

import styles from "./Header.module.css";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "./LogoutButton";

export default function Header() {
    return (
        <header className={styles.header}>
            <ThemeToggle />
            <h1 className={styles.title}>Projekt • 1455</h1>
            <LogoutButton />
        </header>
    );
}
