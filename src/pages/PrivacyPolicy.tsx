import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Shield,
    Lock,
    Eye,
    Database,
    Globe,
    UserCheck,
    Mail,
    Server,
    Scale,
    AlertTriangle,
    Cookie,
    Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/AnimatedBackground";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";

const PrivacyPolicy = () => {

    const sections = [
        {
            icon: UserCheck,
            title: "1. Responsable de traitement",
            content: (
                <div className="space-y-3 text-slate-300 leading-relaxed">
                    <p>
                        Le responsable du traitement de vos données personnelles, au sens du Règlement Général sur la Protection des Données (Règlement UE 2016/679, « RGPD ») et de la loi « Informatique et Libertés » modifiée, est :
                    </p>
                    <div className="bg-slate-950/40 border border-blue-500/10 rounded-xl p-4 space-y-1 text-sm">
                        <p><strong className="text-white">NEXUS DEVELOPPEMENT (NED)</strong>, SARL au capital de 500&nbsp;€</p>
                        <p>Siège social : 4 rue de la Ferme, 78990 Élancourt, France</p>
                        <p>SIREN 995 394 095 — RCS Versailles</p>
                        <p>Représentée par son gérant : <strong className="text-white">Adam Le Charlès</strong></p>
                        <p>
                            Contact : <a href="mailto:contact.nexus.developpement@gmail.com" className="text-blue-400 hover:text-blue-300 underline">contact.nexus.developpement@gmail.com</a> · <a href="tel:+33761847580" className="text-blue-400 hover:text-blue-300 underline">+33 7 61 84 75 80</a>
                        </p>
                    </div>
                    <p className="text-sm text-slate-400">
                        Compte tenu de notre taille, nous ne sommes pas tenus de désigner un Délégué à la Protection des Données (DPO). Toute question relative à la protection de vos données peut être adressée directement au contact ci-dessus.
                    </p>
                </div>
            )
        },
        {
            icon: Database,
            title: "2. Données collectées & finalités",
            content: (
                <div className="space-y-4 text-slate-300 leading-relaxed text-sm">
                    <p>Nous ne collectons que les données strictement nécessaires aux finalités suivantes :</p>

                    <div className="space-y-3">
                        <FinalityBlock
                            label="Réponse à une demande de devis ou de contact"
                            data="Civilité, nom, prénom, email, téléphone, type d'activité, description du projet, budget, délai."
                        />
                        <FinalityBlock
                            label="Réservation d'un appel de présentation"
                            data="Nom, email, téléphone, date et créneau souhaités."
                        />
                        <FinalityBlock
                            label="Candidature au programme « Apporteur d'affaires »"
                            data="Civilité, nom, prénom, email, téléphone, date de naissance, ville, statut professionnel, statut auto-entrepreneur, source, motivation, estimation du réseau."
                        />
                        <FinalityBlock
                            label="Gestion de la relation client après signature d'un devis"
                            data="Données ci-dessus + données de facturation (raison sociale, SIRET, adresse, IBAN si paiement par virement)."
                        />
                    </div>

                    <p>
                        Aucune donnée sensible au sens de l'article 9 du RGPD (origine, opinions, santé, etc.) n'est collectée. Aucune décision automatisée produisant des effets juridiques n'est mise en œuvre.
                    </p>
                </div>
            )
        },
        {
            icon: Scale,
            title: "3. Bases légales du traitement",
            content: (
                <div className="space-y-3 text-slate-300 leading-relaxed text-sm">
                    <p>
                        Conformément à l'article 6 du RGPD, chaque finalité repose sur une base légale précise :
                    </p>
                    <ul className="space-y-2 ml-0">
                        <LegalBasisItem
                            finality="Réponse aux formulaires (devis, contact, réservation d'appel, candidature apporteur)"
                            basis="Exécution de mesures précontractuelles prises à votre demande"
                            article="art. 6.1.b RGPD"
                        />
                        <LegalBasisItem
                            finality="Exécution d'un contrat signé (suivi de projet, facturation, livraison)"
                            basis="Exécution du contrat auquel vous êtes partie"
                            article="art. 6.1.b RGPD"
                        />
                        <LegalBasisItem
                            finality="Conservation des coordonnées après le dernier contact à des fins de relance commerciale ciblée"
                            basis="Intérêt légitime de Nexus Développement à maintenir la relation commerciale"
                            article="art. 6.1.f RGPD"
                        />
                        <LegalBasisItem
                            finality="Respect des obligations comptables, fiscales et légales (conservation des factures)"
                            basis="Obligation légale"
                            article="art. 6.1.c RGPD"
                        />
                    </ul>
                    <p className="text-slate-400 italic pt-1">
                        Vous pouvez à tout moment vous opposer aux traitements fondés sur l'intérêt légitime (voir section « Vos droits »).
                    </p>
                </div>
            )
        },
        {
            icon: Clock,
            title: "4. Durée de conservation",
            content: (
                <div className="space-y-3 text-slate-300 leading-relaxed text-sm">
                    <ul className="space-y-2">
                        <ConservationItem
                            label="Prospects (formulaires non transformés en client)"
                            duration="3 ans à compter du dernier contact"
                        />
                        <ConservationItem
                            label="Clients (après signature d'un devis)"
                            duration="3 ans à compter de la fin de la relation commerciale"
                        />
                        <ConservationItem
                            label="Factures et pièces comptables"
                            duration="10 ans (article L.123-22 du Code de commerce)"
                        />
                        <ConservationItem
                            label="Candidatures apporteur d'affaires non retenues"
                            duration="2 ans à compter du dépôt de la candidature"
                        />
                        <ConservationItem
                            label="Logs techniques (Vercel, anti-spam)"
                            duration="12 mois maximum"
                        />
                    </ul>
                    <p>
                        À l'issue de ces durées, vos données sont supprimées définitivement ou anonymisées de manière irréversible.
                    </p>
                </div>
            )
        },
        {
            icon: Server,
            title: "5. Destinataires & sous-traitants",
            content: (
                <div className="space-y-3 text-slate-300 leading-relaxed text-sm">
                    <p>
                        Vos données ne sont <strong className="text-white">ni vendues ni louées</strong> à des tiers. Elles sont transmises uniquement à nos sous-traitants techniques, encadrés contractuellement (DPA — Data Processing Agreement) et auxquels nous imposons un niveau de protection équivalent au nôtre :
                    </p>
                    <ul className="space-y-2">
                        <SubProcessorItem
                            name="Vercel Inc."
                            country="États-Unis"
                            role="Hébergement du site et exécution des fonctions serveur (formulaires)"
                            safeguard="Adhérent EU-US Data Privacy Framework + Clauses Contractuelles Types"
                        />
                        <SubProcessorItem
                            name="Resend, Inc."
                            country="États-Unis"
                            role="Envoi des emails transactionnels (confirmations, notifications de devis et candidatures)"
                            safeguard="Adhérent EU-US Data Privacy Framework + Clauses Contractuelles Types"
                        />
                    </ul>
                    <p className="text-slate-400 italic pt-1">
                        Vos données peuvent également être communiquées aux autorités administratives ou judiciaires lorsque la loi nous y oblige.
                    </p>
                </div>
            )
        },
        {
            icon: Globe,
            title: "6. Transferts hors Union européenne",
            content: (
                <div className="space-y-3 text-slate-300 leading-relaxed text-sm">
                    <p>
                        Nos sous-traitants Vercel et Resend sont établis aux <strong className="text-white">États-Unis</strong>. Le transfert de données personnelles vers ce pays est encadré par :
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-400">
                        <li>
                            <strong className="text-white">EU-US Data Privacy Framework</strong> — décision d'adéquation de la Commission européenne du 10 juillet 2023, à laquelle Vercel et Resend adhèrent.
                        </li>
                        <li>
                            <strong className="text-white">Clauses Contractuelles Types</strong> (Standard Contractual Clauses) — adoptées par la Commission européenne en 2021, intégrées à nos accords de sous-traitance.
                        </li>
                    </ul>
                    <p>
                        Ces garanties assurent un niveau de protection essentiellement équivalent à celui offert par le droit européen.
                    </p>
                </div>
            )
        },
        {
            icon: Lock,
            title: "7. Sécurité",
            content: (
                <div className="space-y-3 text-slate-300 leading-relaxed text-sm">
                    <p>
                        Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte, altération ou divulgation :
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-400">
                        <li>Chiffrement TLS de toutes les communications (HSTS preload)</li>
                        <li>En-têtes de sécurité stricts (CSP, X-Frame-Options, Referrer-Policy)</li>
                        <li>Validation et échappement systématiques des données soumises aux formulaires</li>
                        <li>Limitation du nombre de soumissions par IP et par heure (rate-limiting)</li>
                        <li>Aucune clé d'API ni secret n'est exposé côté client</li>
                        <li>Accès aux données limité aux gérants de Nexus Développement</li>
                    </ul>
                </div>
            )
        },
        {
            icon: UserCheck,
            title: "8. Vos droits",
            content: (
                <div className="space-y-3 text-slate-300 leading-relaxed text-sm">
                    <p>Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants :</p>
                    <ul className="space-y-1 ml-0">
                        <RightItem label="Droit d'accès" desc="obtenir confirmation que vos données sont traitées et en obtenir une copie" />
                        <RightItem label="Droit de rectification" desc="faire corriger toute donnée inexacte ou incomplète" />
                        <RightItem label="Droit à l'effacement" desc="« droit à l'oubli », sous réserve de nos obligations légales de conservation" />
                        <RightItem label="Droit à la limitation" desc="restreindre temporairement le traitement de vos données" />
                        <RightItem label="Droit à la portabilité" desc="récupérer vos données dans un format structuré, couramment utilisé et lisible par machine" />
                        <RightItem label="Droit d'opposition" desc="vous opposer à tout moment au traitement de vos données pour des raisons tenant à votre situation particulière (art. 21 RGPD), notamment ceux fondés sur l'intérêt légitime" />
                        <RightItem label="Droit de retrait du consentement" desc="lorsque le traitement est fondé sur votre consentement, vous pouvez le retirer à tout moment sans que cela affecte la licéité du traitement antérieur" />
                        <RightItem label="Droit de définir des directives post-mortem" desc="vous pouvez définir des directives relatives au sort de vos données après votre décès" />
                    </ul>
                    <p className="pt-2">
                        Pour exercer ces droits, contactez-nous à : <a href="mailto:contact.nexus.developpement@gmail.com" className="text-blue-400 hover:text-blue-300 underline">contact.nexus.developpement@gmail.com</a>. Une preuve d'identité pourra vous être demandée en cas de doute raisonnable.
                    </p>
                    <p>
                        Nous nous engageons à vous répondre dans un délai d'<strong className="text-white">un (1) mois</strong> à compter de la réception de votre demande. Ce délai peut être prolongé de deux mois supplémentaires en cas de demande complexe ou nombreuse, auquel cas nous vous en informerons dans le mois initial.
                    </p>
                </div>
            )
        },
        {
            icon: AlertTriangle,
            title: "9. Réclamation auprès de la CNIL",
            content: (
                <div className="space-y-3 text-slate-300 leading-relaxed text-sm">
                    <p>
                        Si, après nous avoir contactés, vous estimez que vos droits ne sont pas respectés ou que le traitement de vos données n'est pas conforme à la réglementation, vous avez le droit d'introduire une réclamation auprès de l'autorité de contrôle compétente :
                    </p>
                    <div className="bg-slate-950/40 border border-blue-500/10 rounded-xl p-4 space-y-1">
                        <p><strong className="text-white">Commission Nationale de l'Informatique et des Libertés (CNIL)</strong></p>
                        <p>3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07</p>
                        <p>
                            <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">www.cnil.fr/fr/plaintes</a>
                        </p>
                    </div>
                </div>
            )
        },
        {
            icon: Cookie,
            title: "10. Cookies",
            content: (
                <div className="space-y-3 text-slate-300 leading-relaxed text-sm">
                    <p>
                        Notre site n'utilise que des cookies <strong className="text-white">strictement nécessaires</strong> au fonctionnement (mémorisation du consentement, préférences techniques). Aucun cookie publicitaire ou de traçage tiers n'est déposé sans votre consentement explicite.
                    </p>
                    <p>
                        Si nous activons ultérieurement des outils de mesure d'audience (Google Analytics ou équivalent), ces cookies seront soumis à votre consentement préalable via la bannière cookies, et vous pourrez le retirer à tout moment. Voir la <Link to="/cookies" className="text-blue-400 hover:text-blue-300 underline">Politique cookies</Link> pour le détail.
                    </p>
                </div>
            )
        },
        {
            icon: Eye,
            title: "11. Modifications de la présente politique",
            content: (
                <div className="space-y-3 text-slate-300 leading-relaxed text-sm">
                    <p>
                        La présente politique peut être mise à jour pour refléter des évolutions légales, techniques ou liées à notre activité. La date de dernière mise à jour figure en bas de cette page. En cas de modification substantielle, nous vous en informerons par tout moyen approprié (email, bandeau sur le site).
                    </p>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen relative font-sans text-slate-200">
            <SEO
                title="Politique de Confidentialité | Nexus Développement"
                description="Politique de confidentialité de Nexus Développement : responsable de traitement, finalités, bases légales RGPD, transferts hors UE, droits, durée de conservation, sous-traitants."
                canonical="/confidentialite"
            />
            <div className="fixed inset-0 z-0">
                <AnimatedBackground />
            </div>

            <div className="relative z-10 py-20 px-4 md:px-8">
                <div className="container mx-auto max-w-4xl">
                    <div className="flex justify-center md:justify-start">
                        <Link to="/">
                            <Button variant="ghost" className="mb-12 text-slate-400 hover:text-white hover:bg-white/5 transition-all group">
                                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                Retour à l'accueil
                            </Button>
                        </Link>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6">
                            <Shield className="w-8 h-8 text-blue-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-4">
                            Politique de Confidentialité
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Nous protégeons vos données comme nous protégeons notre code.
                        </p>
                    </motion.div>

                    <div className="grid gap-8">
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 hover:border-blue-500/20 transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
                                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 shrink-0">
                                        <section.icon className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <h2 className="text-xl font-bold text-white mb-4 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-3">
                                            {section.title}
                                        </h2>
                                        {section.content}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mt-12 text-center"
                        >
                            <p className="text-slate-400 mb-4">Une question sur vos données ?</p>
                            <a
                                href="mailto:contact.nexus.developpement@gmail.com"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-300 hover:text-blue-200 transition-all duration-300 break-all"
                            >
                                <Mail className="w-4 h-4 shrink-0" />
                                <span className="break-all text-sm sm:text-base">contact.nexus.developpement@gmail.com</span>
                            </a>
                        </motion.div>
                    </div>

                    <div className="mt-20 text-center border-t border-white/5 pt-8">
                        <p className="text-slate-500 text-sm">
                            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sous-composants de présentation -----------------------------------------

const FinalityBlock = ({ label, data }: { label: string; data: string }) => (
    <div className="bg-slate-950/40 border border-blue-500/10 rounded-xl p-3">
        <p className="text-white font-semibold mb-1">{label}</p>
        <p className="text-slate-400">{data}</p>
    </div>
);

const LegalBasisItem = ({ finality, basis, article }: { finality: string; basis: string; article: string }) => (
    <li className="bg-slate-950/40 border border-blue-500/10 rounded-xl p-3">
        <p className="text-white font-semibold mb-1">{finality}</p>
        <p className="text-slate-400">
            Base légale : <span className="text-blue-300">{basis}</span> ({article})
        </p>
    </li>
);

const ConservationItem = ({ label, duration }: { label: string; duration: string }) => (
    <li className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
        <span className="text-white font-medium sm:flex-1">{label}</span>
        <span className="text-blue-300 sm:flex-shrink-0">{duration}</span>
    </li>
);

const SubProcessorItem = ({ name, country, role, safeguard }: { name: string; country: string; role: string; safeguard: string }) => (
    <li className="bg-slate-950/40 border border-blue-500/10 rounded-xl p-3">
        <p className="text-white font-semibold mb-1">{name} <span className="text-slate-400 font-normal text-xs">— {country}</span></p>
        <p className="text-slate-300 mb-1">{role}</p>
        <p className="text-slate-400 text-xs italic">{safeguard}</p>
    </li>
);

const RightItem = ({ label, desc }: { label: string; desc: string }) => (
    <li className="leading-relaxed">
        <strong className="text-white">{label}</strong> <span className="text-slate-400">: {desc}.</span>
    </li>
);

export default PrivacyPolicy;
