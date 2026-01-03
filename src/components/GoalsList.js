"use client";

import { motion } from "framer-motion";
import styles from "./GoalsList.module.css";

export default function GoalsList() {
    const goals = [
        {
            title: "Life Stability & Closure",
            subtitle: "Build a stable personal base: own a house (mortgage acceptable), own a car (EMI acceptable), fully own a bike, and clear the education loan — proving long-term continuity and responsibility."
        },
        {
            title: "Unshaped Narrative",
            subtitle: "Create and see through a storytelling platform that rejects conventional narrative structure, success metrics, and forced meaning — giving the idea an honest, complete chance to exist."
        },
        {
            title: "Build a Business End-to-End",
            subtitle: "Experience the full business lifecycle — idea, build, ship, sell, operate, and close or continue — regardless of outcome, without abandoning the loop halfway."
        },
        {
            title: "Clear a High-Bar Interview & Receive an Offer",
            subtitle: "Prepare for and pass the interview process of a genuinely high-standard company (brand irrelevant) and receive an offer as external proof of technical capability."
        },
        {
            title: "One Intentional Trip per Year",
            subtitle: "Take one deliberate trip each year as punctuation — to step out of routine, regain perspective, and reset — not as escape or reward."
        },
        {
            title: "Create & Release a Full-Length Film",
            subtitle: "Make and release a complete long-form film (platform irrelevant) as a single finished artifact that demands sustained effort, coordination, and closure."
        },
        {
            title: "Play Guitar Well",
            subtitle: "Develop enough guitar skill to confidently play full songs cleanly and musically, accepting long periods of being bad without disengaging."
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.list}>
                {goals.map((goal, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={styles.item}
                    >
                        <span className={styles.number}>
                            {(index + 1).toString().padStart(2, '0')}
                        </span>
                        <div className={styles.content}>
                            <h3 className={styles.title}>{goal.title}</h3>
                            <p className={styles.subtitle}>{goal.subtitle}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
