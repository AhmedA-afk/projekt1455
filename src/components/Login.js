"use client";

import { useAuth } from "@/context/AuthContext";
import styles from "./Login.module.css";

export default function Login() {
    const { login } = useAuth();

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Journal Access</h2>
            <p className={styles.subtitle}>Sign in to sync your entries across devices.</p>
            <button onClick={login} className={styles.button}>
                Sign in with Google
            </button>
        </div>
    );
}
