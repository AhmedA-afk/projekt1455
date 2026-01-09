"use client";

import { useState, useEffect, useRef } from "react";
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
    const [dataLoaded, setDataLoaded] = useState(false); // Fix: Block autosave until load
    const isLoadedRef = useRef(false); // Ref for synchronous status tracking

    const { user, loading } = useAuth(); // Get authenticated user

    useEffect(() => {
        setMounted(true);
        const today = getDaysRemaining();
        setPageNumber(today); // Start at today
    }, []);

    // Load Data from Firestore
    useEffect(() => {
        if (!user || pageNumber === null) return;

        // Reset loaded state on page change
        setDataLoaded(false);
        isLoadedRef.current = false;

        async function fetchData() {
            try {
                const docRef = doc(db, "users", user.uid, "daily", String(pageNumber));
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setTitle(data.title || "");
                    setContent(data.content || "");
                } else {
                    setTitle("");
                    setContent("");
                }
            } catch (e) {
                console.error("Error fetching daily journal:", e);
            } finally {
                // Ensure we mark data as loaded even if error, 
                // though on error we might want to block save? 
                // Ideally yes, but for now let's allow "retry" by editing.
                setDataLoaded(true);
                isLoadedRef.current = true;
            }
        }
        fetchData();
    }, [user, pageNumber]);

    // Save Data to Firestore (Debounced)
    useEffect(() => {
        // Fix: Strictly require dataLoaded before autosaving
        if (!user || pageNumber === null || !mounted || !isLoadedRef.current) return;

        const timer = setTimeout(async () => {
            try {
                const docRef = doc(db, "users", user.uid, "daily", String(pageNumber));
                await setDoc(docRef, {
                    title,
                    content,
                    updatedAt: new Date().toISOString()
                }, { merge: true });
            } catch (e) {
                console.error("Error saving daily journal:", e);
            }
        }, 1500); // 1.5s debounce

        return () => clearTimeout(timer);
    }, [title, content, user, pageNumber, mounted, dataLoaded]);

    const handlePrev = () => {
        const newPage = pageNumber + 1;
        setPageNumber(newPage);
    };

    const handleNext = () => {
        const newPage = pageNumber - 1;
        setPageNumber(newPage);
    };

    // Auth Protection
    if (loading) return null;
    if (!user) return <Login />;

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
