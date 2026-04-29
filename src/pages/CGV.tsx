import { Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Scroll,
  ShoppingCart,
  CreditCard,
  Clock,
  RefreshCw,
  ShieldCheck,
  AlertOctagon,
  Gavel,
  Mail,
  Scale,
  UserX,
  Copyright,
  FileWarning,
  Truck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/AnimatedBackground";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";

const CGV = () => {

  const sections = [
    {
      icon: Scroll,
      title: "1. Préambule & Objet",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Les présentes Conditions Générales de Vente (ci-après « CGV ») sont conclues entre :
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              La société <strong className="text-white">NEXUS DEVELOPPEMENT</strong> (SARL au capital de 500,00 €),
              SIREN 995 394 095, SIRET 995 394 095 00013, immatriculée au R.C.S. de Versailles
              sous le numéro 995 394 095, TVA intracommunautaire FR49995394095, dont le siège social est situé
              4 rue de la Ferme, 78990 Élancourt, France, ci-après dénommée « le Prestataire »,
            </li>
            <li>
              Et toute personne physique ou morale, professionnelle ou consommateur, procédant à la commande
              de prestations auprès du Prestataire, ci-après dénommée « le Client ».
            </li>
          </ul>
          <p>
            Les présentes CGV ont pour objet de définir les droits et obligations des parties dans le cadre
            de la fourniture par le Prestataire de services de création de sites internet, d'applications
            web et mobiles, d'automatisation, d'identité visuelle et de tout service connexe.
          </p>
          <p>
            Toute commande implique l'adhésion sans réserve du Client aux présentes CGV, qui prévalent sur
            toute autre condition, à l'exception de celles acceptées expressément par écrit par le Prestataire.
          </p>
        </div>
      ),
    },
    {
      icon: FileText,
      title: "2. Devis & Commande",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Toute prestation fait l'objet d'un devis préalable gratuit, détaillant la nature des services,
            le prix, les délais et les modalités d'exécution. La durée de validité du devis est de
            <strong className="text-white"> trente (30) jours</strong> à compter de sa date d'émission.
          </p>
          <p>
            La commande est réputée ferme et définitive à réception par le Prestataire du devis daté,
            signé et accompagné de la mention manuscrite « Bon pour accord », ainsi que du versement
            de l'acompte prévu à l'article 4.
          </p>
          <p>
            Toute modification du périmètre initial demandée par le Client après acceptation fera l'objet
            d'un avenant chiffré, soumis à la même procédure d'acceptation.
          </p>
        </div>
      ),
    },
    {
      icon: ShoppingCart,
      title: "3. Description des prestations",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>Le Prestataire propose notamment les prestations suivantes :</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Conception, développement et mise en ligne de sites web vitrines, e-commerce et applicatifs ;</li>
            <li>Développement d'applications web et mobiles (iOS, Android, multi-plateformes) ;</li>
            <li>Automatisation de processus métier et intégrations API ;</li>
            <li>Création d'identités visuelles, logos et chartes graphiques ;</li>
            <li>Maintenance, hébergement, formation et accompagnement technique.</li>
          </ul>
          <p>
            Le périmètre précis, les livrables, les technologies employées et les délais sont définis dans
            le devis ou le cahier des charges annexé.
          </p>
        </div>
      ),
    },
    {
      icon: CreditCard,
      title: "4. Prix & Modalités de paiement",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Les prix sont exprimés en euros, hors taxes (HT). Le Prestataire étant assujetti à la TVA
            (N° TVA intracommunautaire : <strong className="text-white">FR49995394095</strong>), la TVA
            au taux légal en vigueur (20 % à la date des présentes) est ajoutée aux prix HT indiqués
            sur le devis et la facture.
          </p>
          <p><strong className="text-white">Modalités de paiement :</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Un acompte de 40 % à la signature du devis, non remboursable sauf manquement du Prestataire ;</li>
            <li>30 % à mi-parcours ou à la livraison d'une étape convenue ;</li>
            <li>Le solde de 30 % à la livraison finale, avant mise en production.</li>
          </ul>
          <p>
            Les paiements sont effectués par virement bancaire sur le compte indiqué sur la facture.
            Le délai de règlement des factures est de <strong className="text-white">trente (30) jours</strong>
            à compter de leur date d'émission, sauf stipulation contraire.
          </p>
          <p>
            Conformément à l'article L.441-10 du Code de commerce, tout retard de paiement entraîne
            de plein droit, sans mise en demeure préalable :
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Des pénalités de retard au taux égal à <strong className="text-white">trois fois le taux d'intérêt légal</strong> ;</li>
            <li>Une indemnité forfaitaire pour frais de recouvrement de <strong className="text-white">40 €</strong> (article D.441-5 du Code de commerce) ;</li>
            <li>Le remboursement des frais de recouvrement justifiés excédant ce forfait.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: Clock,
      title: "5. Délais d'exécution",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Les délais indiqués dans le devis courent à compter de la réception de l'acompte et
            de l'ensemble des éléments nécessaires à l'exécution (contenus, visuels, accès, informations).
          </p>
          <p>
            Les délais sont donnés à titre indicatif. Tout retard imputable au Client (retard de fourniture
            de contenu, de validation ou de paiement) entraîne un décalage équivalent du planning, sans
            pouvoir donner lieu à indemnité. En cas de force majeure, les délais sont suspendus pour la durée
            de l'événement.
          </p>
        </div>
      ),
    },
    {
      icon: Truck,
      title: "6. Livraison, Recette & Acceptation",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            La livraison s'effectue par mise à disposition du Client d'un environnement de recette ou
            par publication en production, selon les modalités convenues.
          </p>
          <p>
            Le Client dispose d'un délai de <strong className="text-white">sept (7) jours calendaires</strong>
            à compter de la notification de livraison pour procéder à la recette et notifier par écrit
            les éventuelles réserves. À défaut de réserves notifiées dans ce délai, la recette est réputée
            tacitement acceptée et la prestation définitivement réceptionnée.
          </p>
          <p>
            Seules les non-conformités au devis ou au cahier des charges sont recevables. Toute évolution
            fonctionnelle nouvelle constitue un avenant payant.
          </p>
        </div>
      ),
    },
    {
      icon: UserX,
      title: "7. Obligations du Client",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>Le Client s'engage à :</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Fournir dans les délais l'ensemble des éléments nécessaires à l'exécution (contenus, accès, identifiants, éléments graphiques) ;</li>
            <li>Disposer des droits sur tous les éléments qu'il fournit (textes, images, marques, logos, polices) et garantir le Prestataire contre tout recours de tiers à ce titre ;</li>
            <li>Collaborer activement, valider les étapes dans les délais et désigner un interlocuteur unique décisionnaire ;</li>
            <li>Respecter les obligations de paiement prévues au contrat ;</li>
            <li>Se conformer à la législation en vigueur dans le cadre de l'exploitation du livrable.</li>
          </ul>
        </div>
      ),
    },
    {
      icon: ShieldCheck,
      title: "8. Obligations du Prestataire",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Le Prestataire est tenu d'une <strong className="text-white">obligation de moyens</strong>.
            Il s'engage à exécuter les prestations avec soin, diligence et selon les règles de l'art,
            conformément aux standards professionnels en vigueur.
          </p>
          <p>
            Le Prestataire ne saurait être tenu d'une obligation de résultat, notamment quant à la performance
            commerciale du Client, au référencement naturel, au nombre de visiteurs, de conversions
            ou au chiffre d'affaires généré par les livrables.
          </p>
        </div>
      ),
    },
    {
      icon: Copyright,
      title: "9. Propriété intellectuelle",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Les créations réalisées par le Prestataire restent sa propriété intellectuelle exclusive
            jusqu'au paiement intégral du prix. À compter du paiement intégral, les droits patrimoniaux
            sur les livrables finaux sont cédés au Client, pour une exploitation conforme à l'usage défini
            au contrat.
          </p>
          <p>
            Sont expressément exclus de la cession :
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Les composants open source, bibliothèques, frameworks et outils tiers, soumis à leurs licences propres ;</li>
            <li>Le savoir-faire, méthodologies, modèles, outils et composants génériques développés par le Prestataire, qui demeurent sa propriété et qu'il peut réutiliser librement ;</li>
            <li>Le code source intermédiaire, sauf cession expresse prévue au devis.</li>
          </ul>
          <p>
            Le Client autorise le Prestataire à mentionner son nom, son logo et à présenter les
            prestations réalisées dans son portfolio, sur son site et dans ses communications commerciales,
            sauf demande écrite contraire.
          </p>
        </div>
      ),
    },
    {
      icon: Wallet,
      title: "10. Rétractation & Annulation",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            <strong className="text-white">Clients professionnels :</strong> les prestations étant conclues
            entre professionnels, le droit de rétractation prévu par le Code de la consommation ne s'applique pas.
          </p>
          <p>
            <strong className="text-white">Clients consommateurs (à distance) :</strong> conformément aux articles
            L.221-18 et suivants du Code de la consommation, le consommateur dispose d'un délai de
            <strong className="text-white"> quatorze (14) jours</strong> pour exercer son droit de rétractation.
            Toutefois, conformément à l'article L.221-28, ce droit ne peut être exercé pour les contrats
            de fourniture de biens confectionnés selon les spécifications du consommateur ou nettement
            personnalisés. Le Client consommateur reconnaît que les prestations sur mesure entrent dans
            cette exception et renonce expressément à son droit de rétractation en autorisant
            le Prestataire à commencer l'exécution avant l'expiration dudit délai.
          </p>
          <p>
            En cas d'annulation unilatérale par le Client après le début d'exécution, l'acompte reste acquis
            au Prestataire et les prestations déjà réalisées sont facturées au prorata, majorées d'une
            indemnité forfaitaire de 15 % du solde restant dû.
          </p>
        </div>
      ),
    },
    {
      icon: RefreshCw,
      title: "11. Garantie & Maintenance",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Le Prestataire garantit les livrables contre les défauts de conformité pendant une durée de
            <strong className="text-white"> trois (3) mois</strong> à compter de la réception. Cette garantie
            couvre la correction des anomalies bloquantes reproductibles imputables au Prestataire, à l'exclusion :
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Des évolutions fonctionnelles ou demandes de modification ;</li>
            <li>Des dysfonctionnements résultant d'une intervention du Client ou d'un tiers ;</li>
            <li>Des pannes liées à l'hébergement, au réseau, aux navigateurs ou à des services tiers ;</li>
            <li>D'une utilisation non conforme à la documentation.</li>
          </ul>
          <p>
            Une prestation de maintenance évolutive et corrective peut être proposée sur devis distinct.
          </p>
        </div>
      ),
    },
    {
      icon: AlertOctagon,
      title: "12. Responsabilité & Limitations",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            La responsabilité du Prestataire est strictement limitée aux dommages <strong className="text-white">directs
            et prévisibles</strong> effectivement subis par le Client. Sont expressément exclus tous dommages
            indirects, notamment : perte d'exploitation, perte de chiffre d'affaires, perte de clientèle,
            perte d'image, perte de données, préjudice commercial ou moral.
          </p>
          <p>
            En tout état de cause, et sauf faute lourde ou dolosive, le montant cumulé de la responsabilité
            du Prestataire ne pourra excéder le montant hors taxes effectivement perçu au titre de la
            prestation concernée au cours des douze (12) derniers mois.
          </p>
          <p>
            Le Prestataire ne saurait être tenu responsable des interruptions, dysfonctionnements ou pertes
            de données résultant de services tiers (hébergeur, registrar, fournisseurs API, etc.), de la
            faute du Client ou d'un cas de force majeure.
          </p>
        </div>
      ),
    },
    {
      icon: FileWarning,
      title: "13. Confidentialité",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Chaque partie s'engage à considérer comme strictement confidentielles toutes les informations
            non publiques dont elle aurait connaissance à l'occasion de la prestation, et à ne pas les
            divulguer sans accord écrit préalable. Cette obligation survit pendant trois (3) ans après
            la fin des relations contractuelles.
          </p>
        </div>
      ),
    },
    {
      icon: Scale,
      title: "14. Données personnelles (RGPD)",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Dans l'exécution des prestations, le Prestataire peut être amené à traiter des données
            personnelles pour le compte du Client, en qualité de sous-traitant au sens du RGPD
            (Règlement UE 2016/679). Un accord de sous-traitance (DPA) est conclu sur demande.
          </p>
          <p>
            Le traitement des données personnelles du Client et des visiteurs du site est détaillé dans
            la <Link to="/confidentialite" className="text-blue-400 hover:text-blue-300 underline">Politique de Confidentialité</Link>.
          </p>
        </div>
      ),
    },
    {
      icon: FileWarning,
      title: "15. Force majeure",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Aucune partie ne pourra être tenue responsable d'un manquement résultant d'un cas de force majeure
            au sens de l'article 1218 du Code civil. Sont notamment considérés comme tels : catastrophes
            naturelles, guerre, pandémie, grèves, défaillances majeures des réseaux internet, actes
            d'autorités publiques, cyber-attaques indépendantes du fait de la partie.
          </p>
        </div>
      ),
    },
    {
      icon: AlertOctagon,
      title: "16. Résiliation",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            En cas de manquement grave de l'une des parties à ses obligations, non réparé dans un délai
            de <strong className="text-white">quinze (15) jours</strong> suivant la réception d'une mise
            en demeure par lettre recommandée avec accusé de réception, l'autre partie pourra résilier
            le contrat de plein droit, sans préjudice des dommages-intérêts.
          </p>
          <p>
            En cas de résiliation imputable au Client, l'acompte reste acquis au Prestataire et toutes les
            sommes dues au titre des prestations réalisées deviennent immédiatement exigibles.
          </p>
        </div>
      ),
    },
    {
      icon: Gavel,
      title: "17. Médiation & Litiges",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            En cas de différend, les parties s'engagent à rechercher une solution amiable avant toute action
            contentieuse.
          </p>
          <p>
            <strong className="text-white">Pour les clients consommateurs :</strong> conformément à l'article
            L.612-1 du Code de la consommation, le consommateur peut recourir gratuitement à un médiateur
            de la consommation. Le Client est également informé de l'existence de la plateforme européenne
            de règlement en ligne des litiges :
            {" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            .
          </p>
          <p>
            <strong className="text-white">Juridiction compétente :</strong> à défaut d'accord amiable,
            les tribunaux français seront seuls compétents. Pour les litiges entre professionnels, compétence
            exclusive est attribuée au <strong className="text-white">Tribunal de Commerce de Versailles</strong>,
            même en cas de pluralité de défendeurs ou d'appel en garantie.
          </p>
        </div>
      ),
    },
    {
      icon: Scale,
      title: "18. Droit applicable & Dispositions finales",
      content: (
        <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
          <p>
            Les présentes CGV sont régies par le droit français. Si l'une quelconque des stipulations venait
            à être déclarée nulle ou inapplicable, les autres stipulations conserveront leur pleine et
            entière validité.
          </p>
          <p>
            Le Prestataire se réserve le droit de modifier les présentes CGV à tout moment. La version
            applicable est celle en vigueur au jour de la commande.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen relative font-sans text-slate-200">
      <SEO
        title="Conditions Générales de Vente | Nexus Développement"
        description="CGV de Nexus Développement : modalités de vente des prestations, devis, paiement, livraison, garanties, propriété intellectuelle, médiation. SARL au capital de 1 000 €."
        canonical="/cgv"
      />
      <div className="fixed inset-0 z-0">
        <AnimatedBackground />
      </div>

      <div className="relative z-10 py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center md:justify-start">
            <Link to="/">
              <Button
                variant="ghost"
                className="mb-12 text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
              >
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
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-4 leading-[1.4] py-2">
              Conditions Générales de Vente
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Le cadre contractuel qui encadre chacune de nos prestations.
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
              <p className="text-slate-400 mb-4">Une question sur nos CGV ?</p>
              <a
                href="mailto:contact.nexus.developpement@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-300 hover:text-blue-200 transition-all duration-300 break-all"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span className="break-all text-sm sm:text-base">
                  contact.nexus.developpement@gmail.com
                </span>
              </a>
            </motion.div>
          </div>

          <div className="mt-20 text-center border-t border-white/5 pt-8">
            <p className="text-slate-500 text-sm">
              Dernière mise à jour :{" "}
              {new Date().toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CGV;
