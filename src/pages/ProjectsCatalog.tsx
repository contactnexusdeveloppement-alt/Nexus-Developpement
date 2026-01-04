import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { projects, Project } from "@/data/projects";
import { Button } from "@/components/ui/button";

const CatalogProjectCard = ({ project, index }: { project: Project; index: number }) => {
    const ref = useRef<HTMLDivElement>(null);

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

    const handleClick = () => {
        if (project.url.startsWith('#')) {
            const element = document.querySelector(project.url);
            element?.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.open(project.url, '_blank');
        }
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className="relative group cursor-pointer"
            onClick={handleClick}
        >
            <div
                className="relative h-full min-h-[420px] rounded-xl bg-gray-900/40 border border-white/10 backdrop-blur-sm overflow-hidden flex flex-col transition-shadow duration-300 group-hover:shadow-[0_20px_50px_rgba(8,112,184,0.3)]"
                style={{ transform: "translateZ(0)" }}
            >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden transform transition-transform duration-300" style={{ transform: "translateZ(30px)" }}>
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
                            <div className="p-2 rounded-full bg-white/5 text-gray-300 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-300">
                                <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
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
        </motion.div>
    );
};

const ProjectsCatalog = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden pt-20 pb-20">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">

                <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-6">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/')}
                            className="group pl-0 text-gray-400 hover:text-white hover:bg-transparent -ml-2"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Retour à l'accueil
                        </Button>

                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                                    Nos Réalisations
                                </span>
                            </h1>
                            <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
                                Explorez notre collection complète de projets. De la conception web à l'identité visuelle,
                                chaque création est le fruit d'une passion pour l'excellence et l'innovation.
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:block pb-2">
                        <div className="text-right">
                            <div className="text-3xl font-bold text-cyan-400">{projects.length}</div>
                            <div className="text-sm text-gray-500 uppercase tracking-widest">Projets</div>
                        </div>
                    </div>
                </div>

                <div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    style={{ perspective: "1000px" }}
                >
                    {projects.map((project, index) => (
                        <CatalogProjectCard key={index} project={project} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};
export default ProjectsCatalog;
