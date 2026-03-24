"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

const STORAGE_KEY = "mystic_freemium";
const FREE_READINGS_PER_DAY = 3;

interface FreemiumState {
    date: string; // YYYY-MM-DD
    used: number;
    adUnlocks: number; // extra readings earned from ads today
}

function getTodayKey(): string {
    return new Date().toISOString().slice(0, 10);
}

function loadState(): FreemiumState {
    if (typeof window === "undefined") {
        return { date: getTodayKey(), used: 0, adUnlocks: 0 };
    }
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const state: FreemiumState = JSON.parse(raw);
            // Reset if it's a new day
            if (state.date !== getTodayKey()) {
                return { date: getTodayKey(), used: 0, adUnlocks: 0 };
            }
            return state;
        }
    } catch {
        // ignore
    }
    return { date: getTodayKey(), used: 0, adUnlocks: 0 };
}

function saveState(state: FreemiumState): void {
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
}

export function useFreemium() {
    const [state, setState] = useState<FreemiumState>(loadState);
    const { vipUntil } = useAuth();

    // Sync state on mount (SSR safety)
    useEffect(() => {
        setState(loadState());
    }, []);

    // Check VIP validity
    const isVip = useMemo(() => {
        if (!vipUntil) return false;
        return new Date(vipUntil).getTime() > new Date().getTime();
    }, [vipUntil]);

    const totalAllowed = FREE_READINGS_PER_DAY + state.adUnlocks;
    const readingsLeft = isVip ? 999 : Math.max(0, totalAllowed - state.used);
    const canRead = isVip || readingsLeft > 0;

    const consumeReading = useCallback(() => {
        if (isVip) return; // VIP doesn't consume limits
        setState((prev) => {
            const next = { ...prev, used: prev.used + 1 };
            saveState(next);
            return next;
        });
    }, []);

    const unlockByAd = useCallback(() => {
        setState((prev) => {
            const next = { ...prev, adUnlocks: prev.adUnlocks + 1 };
            saveState(next);
            return next;
        });
    }, []);

    return {
        canRead,
        readingsLeft,
        isVip,
        totalFreeReadings: FREE_READINGS_PER_DAY,
        consumeReading,
        unlockByAd,
    };
}
