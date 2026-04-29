import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    canonical?: string;
    schemas?: object[];
}

const SITE_URL = "https://nexusdeveloppement.fr";

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

    return (
        <Helmet>
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={absoluteImage} />
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteImage} />

            {schemas.map((schema, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                >{JSON.stringify(schema)}</script>
            ))}
        </Helmet>
    );
};

export default SEO;
