import { motion } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "Combien coûte la création d'un site web ?",
        answer: "Nos tarifs débutent à 950€ pour un site vitrine clé en main. Chaque projet est unique, c'est pourquoi nous fournissons un devis détaillé et transparent avant de commencer."
    },
    {
        question: "Êtes-vous une agence locale ?",
        answer: "Oui, Nexus Développement est une agence basée à Élancourt (78). Nous rencontrons avec plaisir nos clients de Saint-Quentin-en-Yvelines et de toute l'Île-de-France, mais nous travaillons aussi à distance dans toute la France."
    },
    {
        question: "Combien de temps faut-il pour créer mon site ?",
        answer: "Pour un site vitrine standard, comptez environ 10 jours après validation du design. Pour des projets plus complexes ou des applications sur-mesure, nous définissons un planning précis ensemble."
    },
    {
        question: "Le site sera-t-il visible sur Google ?",
        answer: "Absolument. Tous nos sites sont livrés avec une structure optimisée pour le SEO (Performance, Balisage, Mobile-first) pour maximiser votre visibilité dès le lancement."
    },
    {
        question: "Puis-je modifier le site moi-même après la livraison ?",
        answer: "Oui. Nous vous formons à l'utilisation de votre site pour que vous soyez autonome sur les modifications de textes et d'images."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 px-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent pointer-events-none" />

            <div className="container mx-auto max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6">
                        <HelpCircle className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent mb-4">
                        Questions Fréquentes
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Les réponses à vos questions pour démarrer votre projet sereinement
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div
                                className={`
                  bg-slate-900/50 backdrop-blur-xl border rounded-2xl overflow-hidden
                  transition-all duration-300 cursor-pointer
                  ${openIndex === index
                                        ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
                                        : 'border-white/5 hover:border-cyan-500/30'
                                    }
                `}
                                onClick={() => toggleItem(index)}
                            >
                                <div className="p-6 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-white pr-4">
                                        {item.question}
                                    </h3>
                                    <ChevronDown
                                        className={`w-5 h-5 text-cyan-400 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </div>

                                <div
                                    className={`
                    overflow-hidden transition-all duration-300
                    ${openIndex === index ? 'max-h-96' : 'max-h-0'}
                  `}
                                >
                                    <div className="px-6 pb-6 pt-0">
                                        <div className="border-t border-white/10 pt-4">
                                            <p className="text-slate-300 leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <p className="text-slate-400 mb-4">Une autre question ?</p>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/20 text-cyan-300 hover:text-cyan-200 transition-all duration-300"
                    >
                        Contactez-nous
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQ;
