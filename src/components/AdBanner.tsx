"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
    adSlot?: string;
    adFormat?: "auto" | "rectangle" | "horizontal" | "vertical";
    className?: string;
}

declare global {
    interface Window {
        adsbygoogle: Array<Record<string, unknown>>;
    }
}

export default function AdBanner({
    adSlot = "XXXXXXXXXX",
    adFormat = "auto",
    className = "",
}: AdBannerProps) {
    const adRef = useRef<HTMLDivElement>(null);
    const isProduction = process.env.NODE_ENV === "production";

    useEffect(() => {
        if (isProduction && adRef.current) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch {
                // AdSense not loaded
            }
        }
    }, [isProduction]);

    // Development placeholder
    if (!isProduction) {
        return (
            <div className={`ad-banner-placeholder ${className}`}>
                <div className="ad-placeholder-inner">
                    <div className="ad-placeholder-icon">📢</div>
                    <span className="ad-placeholder-label">Advertisement</span>
                    <span className="ad-placeholder-size">Ad Space</span>
                </div>
            </div>
        );
    }

    // Production: Real AdSense
    return (
        <div ref={adRef} className={`ad-banner ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive="true"
            />
        </div>
    );
}
