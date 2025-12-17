import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
}

const SEO = ({
    title = "Nexus - Agence de Développement Tech",
    description = "Experts en création de sites web, applications mobiles et automatisation. Propulsez votre entreprise avec nos solutions digitales sur-mesure.",
    image = "/og-image.png",
    type = "website"
}: SEOProps) => {
    const siteTitle = title.includes("Nexus") ? title : `${title} | Nexus Développement`;

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEO;
