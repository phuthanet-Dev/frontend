import { Metadata } from "next";
import { ARTICLES } from "@/lib/articlesData";
import Script from "next/script";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const article = ARTICLES.find((a) => a.slug === slug);

    if (!article) return { title: "Article Not Found" };

    return {
        title: article.title["th"] || article.title["en"],
        description: article.excerpt["th"] || article.excerpt["en"],
        openGraph: {
            title: article.title["th"] || article.title["en"],
            description: article.excerpt["th"] || article.excerpt["en"],
            type: "article",
        },
    };
}

export default async function ArticleDetailLayout(props: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await props.params;
    const article = ARTICLES.find((a) => a.slug === slug);
    
    // JSON-LD schema payload (Rich Snippets)
    const jsonLd = article ? {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title["th"],
        "description": article.excerpt["th"],
        "author": {
            "@type": "Organization",
            "name": "Mystic Cards"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mystic Cards"
        }
    } : null;

    return (
        <>
            {jsonLd && (
                <Script
                    id={`json-ld-${article.slug}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            {props.children}
        </>
    );
}
