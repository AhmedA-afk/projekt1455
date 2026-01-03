"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./Countdown.module.css";


export default function Countdown() {
    const [isMounted, setIsMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);

    function calculateTimeLeft() {
        // Current time in IST (consistent with DayHero)
        const now = new Date();
        const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        const istNow = new Date(istString);

        // Target: Jan 1, 2030 00:00:00 (IST context)
        // Since we treat istNow as a local Date object representing IST time,
        // we can compare it directly to a local Date object for 2030-01-01 00:00:00
        const target = new Date("2030-01-01T00:00:00");

        let difference = target - istNow;

        if (difference <= 0) {
            return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        // Precise Year Calculation
        // Create a date object clone for "current + X years"
        let tempDate = new Date(istNow);
        let years = target.getFullYear() - tempDate.getFullYear();

        // Check if we've gone too far (e.g. if today is Dec 2026 and target is Jan 2030, years is 4, but really 3 full years)
        tempDate.setFullYear(tempDate.getFullYear() + years);
        if (tempDate > target) {
            years--;
            tempDate = new Date(istNow);
            tempDate.setFullYear(tempDate.getFullYear() + years);
        }

        // Now tempDate is at the last full year anniversary.
        // Calculate remaining difference from that anniversary to target
        const remainingDiff = target - tempDate;

        const days = Math.floor(remainingDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingDiff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingDiff / 1000 / 60) % 60);
        const seconds = Math.floor((remainingDiff / 1000) % 60);

        return { years, days, hours, minutes, seconds };
    }

    useEffect(() => {
        setIsMounted(true);
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!isMounted || !timeLeft) {
        return (
            <div className={styles.container}>
                {["Years", "Days", "Hours", "Minutes", "Seconds"].map((label) => (
                    <div key={label} className={styles.item}>
                        <span className={styles.number} style={{ opacity: 0.1 }}>00</span>
                        <span className={styles.label}>{label}</span>
                    </div>
                ))}
            </div>
        );
    }

    const items = [
        { label: "Years", value: timeLeft.years },
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
    ];

    return (
        <div className={styles.container}>
            {items.map((item) => (
                <div key={item.label} className={styles.item}>
                    <motion.span
                        key={item.value}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ ease: "easeOut", duration: 0.3 }}
                        className={styles.number}
                    >
                        {item.value < 10 ? `0${item.value}` : item.value}
                    </motion.span>
                    <span className={styles.label}>{item.label}</span>
                </div>
            ))}
        </div>
    );
}
