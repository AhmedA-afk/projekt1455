"use client";

import { useState, useEffect } from "react";
import JournalEditor from "@/components/JournalEditor";
import styles from "./page.module.css";
import { useAuth } from "@/context/AuthContext";
import Login from "@/components/Login";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { getDaysRemaining } from "@/lib/dateUtils";

export default function DailyJournal() {
    const [pageNumber, setPageNumber] = useState(null); // The "1455" number
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const today = getDaysRemaining();
        setPageNumber(today); // Start at today

        // Load data for today
        loadEntry(today);
    }, []);

    const loadEntry = (day) => {
        const saved = localStorage.getItem(`journal_daily_${day}`);
        if (saved) {
            const parsed = JSON.parse(saved);
            setTitle(parsed.title || "");
            setContent(parsed.content || "");
        } else {
            setTitle("");
            setContent("");
        }
    };

    const saveEntry = (currentDay, newTitle, newContent) => {
        const entry = { title: newTitle, content: newContent, timestamp: new Date().toISOString() };
        localStorage.setItem(`journal_daily_${currentDay}`, JSON.stringify(entry));
    };

    // Auto-save effect
    useEffect(() => {
        if (pageNumber !== null && mounted) {
            const timer = setTimeout(() => {
                saveEntry(pageNumber, title, content);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [title, content, pageNumber, mounted]);

    const handlePrev = () => {
        const nextDay = pageNumber + 1; // Previous day chronologically is a higher countdown number (1456 comes before 1455 in countdown logic? Wait.)
        // Countdown: 1455 (Today) -> 1454 (Tomorrow).
        // So "Previous Day" (Yesterday) was 1456.
        // "Page Number" usually implies Order.
        // If Page 1455 is Today. 
        // User said: "left days 1455- 1454-1453 as page number".
        // Left arrow should go to 1456 (Yesterday)? Or Left arrow goes to 1454 (Tomorrow)?
        // Usually Left = Back = Past. Past was 1456.
        // Right = Forward = Future. Future is 1454.
        // Let's implement that logic.

        const newPage = pageNumber + 1;
        setPageNumber(newPage);
        loadEntry(newPage);
    };

    const handleNext = () => {
        const newPage = pageNumber - 1;
        setPageNumber(newPage);
        loadEntry(newPage);
    };

    if (!mounted || pageNumber === null) return null;

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <div className={styles.navGroup}>
                    <button onClick={handlePrev} className={styles.navBtn} title="Previous Day (Higher Count)">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <span className={styles.pageNumber}>Page {pageNumber}</span>
                    <button onClick={handleNext} className={styles.navBtn} title="Next Day (Lower Count)">
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
