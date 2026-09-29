import { Badge } from "@/components/ui/badge";
import { intro } from "@/lib/motion";
import { ArrowUpRight, ArrowLeft, ExternalLink } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useId, useRef } from "react";
import { Link } from "react-router-dom";
import { projects, ctaProject, clientProjects, demoProjects, isExternalUrl, Project } from "@/data/projects";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { breadcrumbSchema } from "@/lib/schemas";

const cardLinkClassName =
    "block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const pluralize = (count: number, singular: string) => (count > 1 ? `${singular}s` : singular);

type ProjectLinkProps = {
    project: Project;
    descriptionId: string;
    children: React.ReactNode;
};

/**
 * Lien englobant la carte : un vrai <a> (clavier, lecteur d'écran, clic molette).
 * - site client externe : nouvelle fenêtre ;
 * - démo interne : route react-router ;
 * - CTA « #contact » : la section n'existe pas sur /catalogue, on navigue vers
 *   /#contact ; le défilement une fois la home montée est assuré par <HashScroll />.
 */
const ProjectLink = ({ project, descriptionId, children }: ProjectLinkProps) => {
    if (isExternalUrl(project.url)) {
        return (
            <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Voir le projet ${project.title} (nouvelle fenêtre)`}
                aria-describedby={descriptionId}
                className={cardLinkClassName}
            >
                {children}
            </a>
        );
    }

    if (project.url.startsWith("#")) {
        return (
            <Link
                to={{ pathname: "/", hash: project.url }}
                aria-label="Démarrer votre projet : aller au formulaire de contact"
                aria-describedby={descriptionId}
                className={cardLinkClassName}
            >
                {children}
            </Link>
        );
    }

    return (
        <Link
            to={project.url}
            aria-label={`Voir la démo ${project.title}`}
            aria-describedby={descriptionId}
            className={cardLinkClassName}
        >
            {children}
        </Link>
    );
};

const CatalogProjectCard = ({ project, index }: { project: Project; index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const descriptionId = useId();

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const ActionIcon = isExternalUrl(project.url) ? ExternalLink : ArrowUpRight;

    return (
        <motion.div
            ref={ref}
            initial={intro({ opacity: 0, y: 50 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className="relative group"
        >
            <ProjectLink project={project} descriptionId={descriptionId}>
                <div
                    className="relative h-full min-h-[420px] rounded-xl bg-gray-900/40 border border-white/10 backdrop-blur-sm overflow-hidden flex flex-col transition-shadow duration-300 group-hover:shadow-[0_20px_50px_rgba(8,112,184,0.3)]"
                    style={{ transform: "translateZ(0)" }}
                >
                    {/* Image Section — aspect-[8/5] = ratio 1.6 (cohérent avec les
                        captures clients en 800×500 qu'on affiche sans crop CSS) */}
                    <div className="relative aspect-[8/5] overflow-hidden transform transition-transform duration-300" style={{ transform: "translateZ(30px)" }}>
                        {project.isDemo && (
                            <div className="absolute top-4 left-4 z-20">
                                <Badge className="bg-amber-500/20 text-amber-200 border border-amber-400/60 backdrop-blur-md">
                                    Démo
                                </Badge>
                            </div>
                        )}
                        <div className="absolute top-4 right-4 z-20">
                            <Badge className="bg-black/50 text-cyan-300 border border-cyan-500/50 backdrop-blur-md">
                                {project.category}
                            </Badge>
                        </div>
                        <img
                            src={project.image}
                            alt={project.altText}
                            loading="lazy"
                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${project.image.includes('concession') || project.image.includes('agence-immo') ? 'scale-110' : ''
                                }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-6 flex flex-col justify-between transform transition-transform duration-300 bg-gradient-to-b from-gray-900/0 to-gray-900/80" style={{ transform: "translateZ(50px)" }}>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                    {project.title}
                                </h3>
                                <div className="p-2 rounded-full bg-white/5 text-gray-300 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-300" aria-hidden="true">
                                    <ActionIcon className="w-4 h-4" />
                                </div>
                            </div>

                            <p id={descriptionId} className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                                {project.description}
                            </p>
                        </div>

                        {/* Technologies */}
                        <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t border-white/5">
                            {project.technologies.slice(0, 3).map((tech, idx) => (
                                <span
                                    key={idx}
                                    className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5 transition-colors group-hover:border-cyan-500/30 group-hover:text-cyan-200"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Shine Effect */}
                    <div
                        className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine"
                    />

                    {/* Border Glow */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ring-1 ring-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.15)]" />
                </div>
            </ProjectLink>
        </motion.div>
    );
};

const ProjectsCatalog = () => {
    // JSON-LD limité aux sites clients réels : les démos fictives n'en font pas partie.
    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Réalisations Nexus Développement",
        description: "Sites clients conçus et mis en ligne par Nexus Développement.",
        numberOfItems: clientProjects.length,
        itemListElement: clientProjects.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: project.title,
            url: project.url.startsWith("http") ? project.url : `https://nexusdeveloppement.fr${project.url}`,
        })),
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden pt-20 pb-20">
            <SEO
                title="Nos Réalisations & Démos | Nexus Développement"
                description="Réalisations et démos de Nexus Développement : boutiques en ligne clients et démos sectorielles (salon, restaurant, immobilier, concession). React et TypeScript."
                type="website"
                canonical="/catalogue"
                schemas={[
                    itemListSchema,
                    breadcrumbSchema([
                        { name: "Accueil", url: "/" },
                        { name: "Réalisations", url: "/catalogue" },
                    ]),
                ]}
            />
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">

                <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-6">
                        <Button
                            asChild
                            variant="ghost"
                            className="group pl-0 text-gray-400 hover:text-white hover:bg-transparent -ml-2"
                        >
                            <Link to="/">
                                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Retour à l'accueil
                            </Link>
                        </Button>

                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                                    Nos réalisations et démos
                                </span>
                            </h1>
                            <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
                                Nos sites clients en ligne, suivis de démos sectorielles fictives (salon de coiffure,
                                restaurant, concession automobile, agence immobilière) qui illustrent ce que nous
                                pouvons concevoir pour votre activité.
                            </p>
                        </div>
                    </div>

                    <p className="hidden md:flex items-baseline gap-2 pb-2 text-right">
                        <span className="text-3xl font-bold text-cyan-400">{clientProjects.length}</span>
                        <span className="text-sm text-gray-500 uppercase tracking-widest">
                            {pluralize(clientProjects.length, "réalisation")}
                        </span>
                        <span className="px-1 text-gray-600" aria-hidden="true">·</span>
                        <span className="text-3xl font-bold text-amber-300">{demoProjects.length}</span>
                        <span className="text-sm text-gray-500 uppercase tracking-widest">
                            {pluralize(demoProjects.length, "démo")}
                        </span>
                    </p>
                </div>

                <div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    style={{ perspective: "1000px" }}
                >
                    {[...projects, ctaProject].map((project, index) => (
                        <CatalogProjectCard key={project.title} project={project} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};
export default ProjectsCatalog;
