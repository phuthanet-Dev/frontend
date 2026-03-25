import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { AuthContextProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        template: "%s | Mystic Cards",
        default: "Mystic Cards | AI Tarot, Oracle & Lenormand Readings",
    },
    description:
        "ดูดวงออนไลน์ด้วยไพ่ทาโรต์ ไพ่เลอนอร์ม็อง ไพ่ออราเคิล และดวงด้วย AI แม่นยำ Unveil your destiny with interactive AI tarot readings and comprehensive guides.",
    keywords: [
        "tarot", "card reading", "oracle", "lenormand", "fortune telling", "divination",
        "ดูดวง", "ดูดวงออนไลน์", "ดูดวงไพ่ทาโรต์", "ไพ่ทาโรต์แม่นๆ", "เปิดไพ่ยิปซี", "ทำนายดวง", "ไพ่ออราเคิล"
    ],
    openGraph: {
        title: "Mystic Cards | AI Tarot & Card Readings",
        description: "ดูดวงแบบเจาะลึกด้วย AI ผ่านไพ่ทาโรต์และเลอนอร์ม็อง ให้คำตอบที่แม่นยำและเป็นส่วนตัว",
        url: "https://mysticcards.app",
        siteName: "Mystic Cards",
        locale: "th_TH",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Mystic Cards | AI Tarot Readings",
        description: "Unveil your destiny with interactive AI tarot readings.",
    },
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} className="dark">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                {/* Google AdSense — replace ca-pub-XXXXXXXXXXXXXXXX with your real publisher ID */}
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
                    crossOrigin="anonymous"
                />
            </head>
            <body className="antialiased">
                <div className="starfield" />
                <AuthContextProvider>
                    <NextIntlClientProvider messages={messages}>
                        <div className="relative z-10">{children}</div>
                    </NextIntlClientProvider>
                </AuthContextProvider>
            </body>
        </html>
    );
}
