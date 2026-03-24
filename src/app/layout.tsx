import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { AuthContextProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
    title: "Mystic Cards — Online Tarot & Card Reading",
    description:
        "Unveil your destiny with our interactive tarot and card reading platform. Choose from Tarot, Lenormand, Oracle, and Playing Card decks.",
    keywords: [
        "tarot",
        "card reading",
        "oracle",
        "lenormand",
        "fortune telling",
        "divination",
    ],
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
