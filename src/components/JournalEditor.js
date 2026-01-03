"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import styles from "./JournalEditor.module.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Custom Toolbar Component
const CustomToolbar = () => (
    <div id="toolbar" className={styles.toolbar}>
        <span className="ql-formats">
            <select className="ql-header" defaultValue="">
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="">Normal</option>
            </select>
        </span>
        <span className="ql-formats">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
            <button className="ql-blockquote" />
        </span>
        <span className="ql-formats">
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <select className="ql-align" />
        </span>
        <span className="ql-formats">
            <button className="ql-link" />
            <button className="ql-clean" />
        </span>
    </div>
);

export default function JournalEditor({ title, setTitle, content, setContent }) {

    // Configure Quill to use our custom toolbar ID
    const modules = useMemo(() => ({
        toolbar: {
            container: "#toolbar",
        },
    }), []);

    const formats = [
        "header",
        "bold", "italic", "underline", "strike", "blockquote",
        "list", "bullet", "align",
        "link"
    ];

    return (
        <div className={styles.container}>
            {/* Toolbar placed ABOVE the title */}
            <CustomToolbar />

            <div className={styles.documentArea}>
                <input
                    type="text"
                    placeholder="Untitled"
                    className={styles.titleInput}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    className={styles.quill}
                    placeholder="Write regarding your day..."
                />
            </div>
        </div>
    );
}
