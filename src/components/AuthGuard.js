"use client";

import { useAuth } from "@/context/AuthContext";
import Login from "@/components/Login";

export default function AuthGuard({ children }) {
    const { user, loading } = useAuth();

    // While loading auth state, show nothing or a minimal spinner
    if (loading) return (
        <div style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--background)",
            color: "var(--foreground)"
        }}>
            ...
        </div>
    );

    // If not authenticated, show Login screen
    if (!user) {
        return <Login />;
    }

    // If authenticated, render the app
    return <>{children}</>;
}
