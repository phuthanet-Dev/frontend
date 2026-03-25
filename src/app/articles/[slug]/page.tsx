"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ARTICLES } from "@/lib/articlesData";
import Navbar from "@/components/Navbar";

export default function ArticlePage() {
    const locale = useLocale();
    const t = useTranslations();
    const params = useParams();
    const slug = params.slug as string;
    
    const article = ARTICLES.find(a => a.slug === slug);
    
    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col text-mystic-200">
                <h1 className="text-4xl mb-4">Article Not Found</h1>
                <Link href="/articles" className="text-gold-400 hover:text-gold-300 underline">Return to Articles</Link>
            </div>
        );
    }

    const title = article.title[locale] || article.title["th"];
    const content = article.content[locale] || article.content["th"];

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
            <main className="flex-1 py-12 px-6 max-w-4xl mx-auto w-full">
                <Link href="/articles" className="text-mystic-300/60 hover:text-gold-400 text-sm flex items-center gap-2 mb-8 transition-colors w-fit">
                    <span>←</span> Back to Articles
                </Link>
                
                <article className="glass-card p-8 md:p-12 rounded-3xl border border-mystic-600/30">
                    <h1 className="text-3xl md:text-5xl font-black mb-10 text-mystic-100 leading-tight">
                        {title}
                    </h1>
                    
                    <div className="space-y-6 text-mystic-200/90 leading-relaxed text-lg">
                        {content.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </article>
            </main>
            
            <footer className="py-6 text-center border-t border-mystic-600/30 w-full mt-auto">
                <p className="text-mystic-300/40 text-xs mb-3 max-w-2xl mx-auto px-4">
                    {t("footer.disclaimer") || "Mystic Cards is for entertainment purposes only."}
                </p>
                <div className="flex justify-center flex-wrap gap-4 mt-2">
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
