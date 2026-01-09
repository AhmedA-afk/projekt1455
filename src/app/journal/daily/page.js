"use client";

import { useState, useEffect, useRef } from "react";
import JournalEditor from "@/components/JournalEditor";
import styles from "./page.module.css";
import { useAuth } from "@/context/AuthContext";
import Login from "@/components/Login";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

import { getDaysRemaining } from "@/lib/dateUtils";

export default function DailyJournal() {
    const [pageNumber, setPageNumber] = useState(null); // The "1455" number
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [mounted, setMounted] = useState(false);
    const [status, setStatus] = useState("loading"); // 'loading' | 'saved' | 'saving' | 'error'
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
        setStatus("loading");
        isLoadedRef.current = false;

        // Clear previous data immediately to prevent bleeding if fetch fails
        setTitle("");
        setContent("");

        const docRef = doc(db, "users", user.uid, "daily", String(pageNumber));

        // Real-time listener
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // We use function functional updates or direct checking can reduce re-renders 
                // but for strings simple set is usually fine relative to 1.5s debounce
                setTitle(data.title || "");
                setContent(data.content || "");
            } else {
                setTitle("");
                setContent("");
            }
            // Enable saving once we've successfully received a snapshot
            setDataLoaded(true);
            isLoadedRef.current = true;
            setStatus("saved");
        }, (error) => {
            console.error("Error listening to daily journal:", error);
            // Safety: Do NOT enable saving on error
            setStatus("error");
        });

        // Cleanup listener on unmount or page change
        return () => unsubscribe();
    }, [user, pageNumber]);

    // Save Data to Firestore (Debounced)
    useEffect(() => {
        // Fix: Strictly require dataLoaded before autosaving
        if (!user || pageNumber === null || !mounted || !isLoadedRef.current) return;

        setStatus("saving");

        const timer = setTimeout(async () => {
            try {
                const docRef = doc(db, "users", user.uid, "daily", String(pageNumber));
                await setDoc(docRef, {
                    title,
                    content,
                    updatedAt: new Date().toISOString()
                }, { merge: true });
                setStatus("saved");
            } catch (e) {
                console.error("Error saving daily journal:", e);
                setStatus("error");
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
                
                <div className={styles.statusIndicator}>
                    {status === "loading" && <span style={{color: "#888"}}>Loading...</span>}
                    {status === "saving" && <span style={{color: "#eda536"}}>Saving...</span>}
                    {status === "saved" && <span style={{color: "#4caf50"}}>All Changes Saved</span>}
                    {status === "error" && <span style={{color: "#f44336", fontWeight: "bold"}}>⚠️ Sync Error - Read Only</span>}
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
