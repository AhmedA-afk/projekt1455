"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user && user.email !== "zenithrog@gmail.com") {
                await signOut(auth);
                setUser(null);
                alert("Access Denied: You are not authorized to access this personal website.");
            } else {
                setUser(user);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            if (result.user.email !== "zenithrog@gmail.com") {
                await signOut(auth);
                throw new Error("Access Denied: You are not authorized to access this personal website.");
            }
        } catch (error) {
            console.error("Login failed CODE:", error.code, "MSG:", error.message);
            alert(`Login Failed: ${error.message}`); // Alert for user visibility
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
