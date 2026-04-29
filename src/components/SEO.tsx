import { useEffect } from "react";

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    canonical?: string;
    schemas?: object[];
}

const SITE_URL = "https://nexusdeveloppement.fr";

/**
 * Gestion du <head> sans react-helmet-async : Helmet utilise un dispatcher
 * asynchrone (microtasks/raf) qui n'a souvent pas appliqué les changements
 * au DOM au moment où le pre-rendering Puppeteer capture le HTML, même avec
 * un setTimeout de 2s avant render-event. Conséquence : title, canonical,
 * og:* et JSON-LD spécifiques par page n'étaient pas pre-rendus.
 *
 * On bascule sur un useEffect direct + manipulation du document.head qui
 * est synchrone : avant que requestAnimationFrame suivant tourne, le DOM
 * est à jour. Au cleanup on retire les balises injectées pour éviter qu'une
 * navigation interne ne laisse traîner les meta de la page précédente.
 */
const SEO = ({
    title = "Nexus - Agence de Développement Tech",
    description = "Experts en création de sites web, applications mobiles et automatisation. Propulsez votre entreprise avec nos solutions digitales sur-mesure.",
    image = "/og-image.png",
    type = "website",
    canonical,
    schemas = [],
}: SEOProps) => {
    const siteTitle = title.includes("Nexus") ? title : `${title} | Nexus Développement`;
    const canonicalUrl = canonical
        ? canonical.startsWith("http")
            ? canonical
            : `${SITE_URL}${canonical}`
        : undefined;
    const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

    useEffect(() => {
        const previousTitle = document.title;
        document.title = siteTitle;

        const injected: HTMLElement[] = [];

        const ensureMeta = (selector: string, attrs: Record<string, string>) => {
            let el = document.head.querySelector<HTMLMetaElement>(selector);
            const wasExisting = !!el;
            if (!el) {
                el = document.createElement("meta");
                document.head.appendChild(el);
                injected.push(el);
            }
            Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
            return { el, wasExisting };
        };

        const previousValues: Array<{ el: HTMLElement; key: string; value: string | null }> = [];

        const setMeta = (kind: "name" | "property", key: string, value: string) => {
            const selector = `meta[${kind}="${key}"]`;
            const existing = document.head.querySelector(selector);
            if (existing) {
                previousValues.push({
                    el: existing as HTMLElement,
                    key: "content",
                    value: existing.getAttribute("content"),
                });
                existing.setAttribute("content", value);
            } else {
                ensureMeta(selector, { [kind]: key, content: value });
            }
        };

        setMeta("name", "description", description);
        setMeta("property", "og:type", type);
        setMeta("property", "og:title", siteTitle);
        setMeta("property", "og:description", description);
        setMeta("property", "og:image", absoluteImage);
        setMeta("name", "twitter:card", "summary_large_image");
        setMeta("name", "twitter:title", siteTitle);
        setMeta("name", "twitter:description", description);
        setMeta("name", "twitter:image", absoluteImage);

        let canonicalEl: HTMLLinkElement | null = null;
        let previousCanonical: string | null = null;
        let canonicalWasExisting = false;
        if (canonicalUrl) {
            canonicalEl = document.head.querySelector('link[rel="canonical"]');
            if (canonicalEl) {
                previousCanonical = canonicalEl.getAttribute("href");
                canonicalEl.setAttribute("href", canonicalUrl);
                canonicalWasExisting = true;
            } else {
                canonicalEl = document.createElement("link");
                canonicalEl.setAttribute("rel", "canonical");
                canonicalEl.setAttribute("href", canonicalUrl);
                document.head.appendChild(canonicalEl);
                injected.push(canonicalEl);
            }
            setMeta("property", "og:url", canonicalUrl);
        }

        const schemaScripts: HTMLScriptElement[] = [];
        schemas.forEach((schema) => {
            const script = document.createElement("script");
            script.type = "application/ld+json";
            script.dataset.dynamicSchema = "true";
            script.text = JSON.stringify(schema);
            document.head.appendChild(script);
            schemaScripts.push(script);
        });

        return () => {
            document.title = previousTitle;
            previousValues.forEach(({ el, key, value }) => {
                if (value === null) {
                    el.removeAttribute(key);
                } else {
                    el.setAttribute(key, value);
                }
            });
            injected.forEach((el) => el.remove());
            schemaScripts.forEach((el) => el.remove());
            if (canonicalEl && canonicalWasExisting && previousCanonical) {
                canonicalEl.setAttribute("href", previousCanonical);
            }
        };
    }, [siteTitle, description, type, absoluteImage, canonicalUrl, schemas]);

    return null;
};

export default SEO;
