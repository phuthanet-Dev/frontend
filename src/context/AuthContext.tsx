"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import type { ProfileData } from "@/components/ProfileModal";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    needsProfile: boolean;
    vipUntil: string | null;
    coinBalance: number;
    fetchCoinBalance: () => Promise<void>;
    fetchAuthData: (currentUser?: User | null) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, pass: string) => Promise<void>;
    signUpWithEmail: (email: string, pass: string) => Promise<void>;
    completeProfile: (data: ProfileData) => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    needsProfile: false,
    vipUntil: null,
    coinBalance: 0,
    fetchCoinBalance: async () => { },
    fetchAuthData: async () => { },
    signInWithGoogle: async () => { },
    signInWithEmail: async () => { },
    signUpWithEmail: async () => { },
    completeProfile: async () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [needsProfile, setNeedsProfile] = useState(false);
    const [vipUntil, setVipUntil] = useState<string | null>(null);
    const [coinBalance, setCoinBalance] = useState(0);

    const fetchAuthData = async (currentUser?: User | null) => {
        const u = currentUser || user;
        if (!u) return;

        try {
            const token = await u.getIdToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

            // 1. Sync User (gets needsProfile & vipUntil)
            const syncRes = await fetch(`${apiUrl}/api/auth/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firebaseToken: token })
            });

            if (syncRes.ok) {
                const data = await syncRes.json();
                setNeedsProfile(!!data.needsProfile);
                setVipUntil(data.user?.vipUntil || null);
            }

            // 2. Fetch balance (can be optimized later into sync)
            await fetchCoinBalance(u);
        } catch (error) {
            console.error("Error fetching auth data", error);
        }
    }

    const fetchCoinBalance = async (currentUser?: User | null) => {
        const u = currentUser || user;
        if (!u) return;
        try {
            const token = await u.getIdToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            const res = await fetch(`${apiUrl}/api/coins/balance`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setCoinBalance(data.balance);
            }
        } catch (error) {
            console.error("Failed to fetch coin balance", error);
        }
    };

    useEffect(() => {
        // Force session persistence so user is logged out when browser is closed
        setPersistence(auth, browserSessionPersistence).catch(console.error);

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                try {
                    await fetchAuthData(currentUser);
                } catch (error) {
                    console.error("Error on auth state load:", error);
                }
            } else {
                setNeedsProfile(false);
                setVipUntil(null);
                setCoinBalance(0);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const signInWithEmail = async (email: string, pass: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (error) {
            console.error("Error signing in with Email", error);
            throw error;
        }
    };

    const signUpWithEmail = async (email: string, pass: string) => {
        try {
            await createUserWithEmailAndPassword(auth, email, pass);
        } catch (error) {
            console.error("Error signing up with Email", error);
            throw error;
        }
    };

    const completeProfile = async (data: ProfileData) => {
        if (!user) throw new Error("No authenticated user");
        const token = await user.getIdToken();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

        const response = await fetch(`${apiUrl}/api/auth/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Failed to save profile");
        }

        setNeedsProfile(false); // Successfully saved
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setNeedsProfile(false);
            setCoinBalance(0);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{
            user, loading, needsProfile, vipUntil, coinBalance,
            fetchCoinBalance, fetchAuthData, signInWithGoogle, signInWithEmail, signUpWithEmail, completeProfile, signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
}
