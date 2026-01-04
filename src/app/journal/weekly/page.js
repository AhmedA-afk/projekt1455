"use client";

import { useState, useEffect } from "react";
import JournalEditor from "@/components/JournalEditor";
import styles from "./page.module.css";
import { useAuth } from "@/context/AuthContext";
import Login from "@/components/Login";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { getCurrentWeek } from "@/lib/dateUtils";

// ... previous imports

export default function WeeklyArtefacts() {
    const [weekNumber, setWeekNumber] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [mounted, setMounted] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false); // Fix: Block autosave until load

    const { user, loading } = useAuth();

    useEffect(() => {
        const week = getCurrentWeek();
        console.log("Calculated Week (Util):", week);
        setWeekNumber(week);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!user || weekNumber === null) return;

        setDataLoaded(false); // Reset on change

        // Fetch logic separated
        const docRef = doc(db, "users", user.uid, "weekly", String(weekNumber));
        getDoc(docRef).then(docSnap => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setTitle(data.title || "");
                setContent(data.content || "");
            } else {
                setTitle("");
                setContent("");
            }
            setDataLoaded(true); // Allow saving now
        });
    }, [user, weekNumber]);

    // Save to Firestore (Debounced)
    useEffect(() => {
        if (!user || weekNumber === null || !mounted || !dataLoaded) return;

        const timer = setTimeout(async () => {
            try {
                const docRef = doc(db, "users", user.uid, "weekly", String(weekNumber));
                await setDoc(docRef, {
                    title,
                    content,
                    updatedAt: new Date().toISOString()
                }, { merge: true });
            } catch (e) {
                console.error("Error saving weekly entry:", e);
            }
        }, 1500); // 1.5s debounce

        return () => clearTimeout(timer);
    }, [title, content, user, weekNumber, mounted, dataLoaded]);

    // Auth Protection
    if (loading) return null;
    if (!user) return <Login />;

    const handlePrev = () => {
        if (weekNumber > 0) { // Allow going to 0
            const newWeek = weekNumber - 1;
            setWeekNumber(newWeek);
        }
    };

    const handleNext = () => {
        const newWeek = weekNumber + 1;
        setWeekNumber(newWeek);
    };

    if (!mounted || weekNumber === null) {
        return (
            <div className={styles.wrapper} style={{ alignItems: "center", paddingTop: "4rem" }}>
                <p>Loading Weekly Journal...</p>
                <p style={{ fontSize: "0.8rem", opacity: 0.5 }}>Week: {weekNumber ?? "Calculated..."}</p>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <div className={styles.navGroup}>
                    <button onClick={handlePrev} className={styles.navBtn} disabled={weekNumber <= 0} title="Previous Week">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <span className={styles.pageNumber}>Week {weekNumber}</span>
                    <button onClick={handleNext} className={styles.navBtn} title="Next Week">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                </div>
            </header>

            <JournalEditor
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
            />
        </div>
    );
}
