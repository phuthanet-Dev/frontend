"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { ARTICLES } from "@/lib/articlesData";
import Navbar from "@/components/Navbar";

export default function ArticlesHub() {
    const locale = useLocale();
    const t = useTranslations();

    return (
        <div className="min-h-screen flex flex-col relative">
            <Navbar 
                currentLocale={locale} 
                onLocaleChange={(newLocale) => { 
                    document.cookie = `MYSTIC_LOCALE=${newLocale}; path=/; max-age=31536000`; 
                    window.location.reload(); 
                }} 
                onOpenAuthModal={() => { window.location.href = "/"; }} 
            />
            <main className="flex-1 flex flex-col items-center py-16 px-6 max-w-5xl mx-auto w-full">
                <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
                    {t("nav.articles")}
                </h1>
                <p className="text-mystic-300/70 mb-12 text-center max-w-2xl">
                    {t("nav.articlesDesc")}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {ARTICLES.map((article) => {
                        const title = article.title[locale] || article.title["th"];
                        const excerpt = article.excerpt[locale] || article.excerpt["th"];
                        return (
                            <Link href={`/articles/${article.slug}`} key={article.slug} className="block glass-card p-6 rounded-2xl border border-mystic-600/30 hover:border-gold-400/50 transition-colors group">
                                <h2 className="text-2xl font-bold text-mystic-200 group-hover:text-gold-300 transition-colors mb-3">
                                    {title}
                                </h2>
                                <p className="text-mystic-300/70 leading-relaxed">
                                    {excerpt}
                                </p>
                                <div className="mt-6 text-gold-400/80 text-sm font-semibold group-hover:text-gold-300 flex items-center gap-2">
                                    Read Article <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </main>
            
            <footer className="py-6 text-center border-t border-mystic-600/30 w-full mt-auto">
                <p className="text-mystic-300/40 text-xs mb-3 max-w-2xl mx-auto px-4">
                    {t("footer.disclaimer") || "Mystic Cards is for entertainment purposes only."}
                </p>
                <div className="flex justify-center gap-6 mt-2">
                    <a href="/privacy-policy" className="text-mystic-300/40 hover:text-mystic-300 transition-colors text-xs">{t("footer.privacyPolicy") || "Privacy Policy"}</a>
                    <p className="text-mystic-300/40 text-xs">
                        {t("footer.copyright") || "© 2026 Mystic Cards. All rights reserved."}
                    </p>
                    <a href="/terms-of-use" className="text-mystic-300/40 hover:text-mystic-300 transition-colors text-xs">{t("footer.termsOfUse") || "Terms of Use"}</a>
                </div>
            </footer>
        </div>
    );
}
