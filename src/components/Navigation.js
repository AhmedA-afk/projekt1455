"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";
import clsx from "clsx";

export default function Navigation() {
    const pathname = usePathname();

    return (
        <nav className={styles.nav}>
            <Link
                href="/"
                className={clsx(styles.link, { [styles.active]: pathname === "/" })}
            >
                Home
            </Link>
            <Link
                href="/goals"
                className={clsx(styles.link, { [styles.active]: pathname === "/goals" })}
            >
                Goals
            </Link>
            <Link
                href="/journal/daily"
                className={clsx(styles.link, { [styles.active]: pathname.startsWith("/journal") })}
            >
                Journal
            </Link>
        </nav>
    );
}
