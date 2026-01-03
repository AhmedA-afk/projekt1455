"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./DayHero.module.css";

export default function DayHero() {
    const [mounted, setMounted] = useState(false);
    const [daysLeft, setDaysLeft] = useState(0);
    const [currentDateStr, setCurrentDateStr] = useState("");

    useEffect(() => {
        setMounted(true);

        // Current time in IST
        const now = new Date();
        const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        const istDate = new Date(istString);

        // Reset IST date to midnight for clean day calculation
        istDate.setHours(0, 0, 0, 0);

        // Target Date: Jan 1, 2030 (treated as midnight IST for comparison)
        const target = new Date("2030-01-01T00:00:00");

        // Calculate difference in milliseconds
        const diff = target - istDate;

        // Convert to days
        // Math.floor is appropriate here:
        // If diff is 1455 days and 12 hours, floor is 1455.
        let days = Math.floor(diff / (1000 * 60 * 60 * 24));

        // Constraint: Max value is 1455 (Starting from Jan 7, 2026)
        if (days > 1455) {
            days = 1455;
        }

        setDaysLeft(days);

        // Format current date in IST
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' };
        setCurrentDateStr(now.toLocaleDateString('en-US', options));

    }, []);

    if (!mounted) return null;

    return (
        <div className={styles.container}>
            <motion.h1
                className={styles.days}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {daysLeft}
            </motion.h1>
            <motion.p
                className={styles.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.5, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
            >
                {currentDateStr}
            </motion.p>
        </div>
    );
}
