"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";
import clsx from "clsx";

export default function JournalLayout({ children }) {
    const pathname = usePathname();

    return (
        <div className={styles.container}>
            <div className={styles.switcher}>
                <Link
                    href="/journal/daily"
                    className={clsx(styles.tab, { [styles.active]: pathname.includes("/daily") })}
                >
                    Daily
                </Link>
                <Link
                    href="/journal/weekly"
                    className={clsx(styles.tab, { [styles.active]: pathname.includes("/weekly") })}
                >
                    Artefacts
                </Link>
            </div>
            {children}
        </div>
    );
}
