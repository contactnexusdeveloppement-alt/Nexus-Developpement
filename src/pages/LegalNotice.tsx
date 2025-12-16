import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useEffect } from "react";

const LegalNotice = () => {
  useEffect(() => {
    document.title = "Mentions Légales | Nexus Développement";
    
    return () => {
      document.title = "Nexus Développement | Sites Web, Automatisation & Identité Visuelle";
    };
  }, []);
  return (
    <div className="min-h-screen relative">
      {/* Arrière-plan animé */}
      <div className="fixed inset-0 z-0">
        <AnimatedBackground />
      </div>
      
      {/* Contenu */}
      <div className="relative z-10 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
        {/* Back button */}
        <Link to="/">
          <Button variant="ghost" className="mb-8 text-gray-300 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </Link>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(100,150,255,0.6)] text-center">
          Mentions Légales
        </h1>

        {/* Content */}
        <div className="space-y-8 bg-slate-800/80 border border-slate-700/50 backdrop-blur-xl rounded-lg p-8 shadow-xl">
          
          {/* Section 1: Informations légales */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-600 pb-2">
              1. Informations légales
            </h2>
            <div className="text-gray-200 space-y-2">
              <p><strong className="text-white">Raison sociale :</strong> Nexus Développement</p>
              <p><strong className="text-white">Forme juridique :</strong> SARL en cours de formation</p>
              <p><strong className="text-white">Capital social :</strong> 500€</p>
              <p><strong className="text-white">Siège social :</strong> 4 rue de la Ferme, 78990 Elancourt, France</p>
              <p><strong className="text-white">SIRET :</strong> En cours d'obtention</p>
              <p><strong className="text-white">TVA intracommunautaire :</strong> En cours d'obtention</p>
            </div>
          </section>

          {/* Section 2: Directeurs de publication */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-600 pb-2">
              2. Directeurs de publication
            </h2>
            <div className="text-gray-200 space-y-1">
              <p>• Adam Le Charlès</p>
              <p>• Théo Jacobée</p>
            </div>
          </section>

          {/* Section 3: Hébergement */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-600 pb-2">
              3. Hébergement du site
            </h2>
            <div className="text-gray-200 space-y-2">
              <p><strong className="text-white">Hébergeur :</strong> Lovable (GPT Engineer Inc.)</p>
              <p><strong className="text-white">Adresse :</strong> 2261 Market Street #4500, San Francisco, CA 94114, USA</p>
              <p><strong className="text-white">Site web :</strong> <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">https://lovable.dev</a></p>
            </div>
          </section>

          {/* Section 4: Protection des données personnelles (RGPD) */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-600 pb-2">
              4. Protection des données personnelles (RGPD)
            </h2>
            <div className="text-gray-200 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Responsable du traitement</h3>
                <p>Nexus Développement, représentée par Adam Le Charlès et Théo Jacobée</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Données collectées</h3>
                <p>Lors de votre demande de devis ou réservation d'appel via notre formulaire de contact, nous collectons les données suivantes :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Nom complet</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone (optionnel)</li>
                  <li>Type d'activité (optionnel)</li>
                  <li>Services souhaités</li>
                  <li>Description du projet</li>
                  <li>Budget estimé</li>
                  <li>Délai souhaité</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Finalité du traitement</h3>
                <p>Vos données sont utilisées exclusivement pour :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Le traitement de votre demande de devis</li>
                  <li>La gestion de vos réservations d'appels</li>
                  <li>Vous contacter dans le cadre de votre projet</li>
                  <li>L'établissement d'une proposition commerciale</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Base légale</h3>
                <p>Le traitement de vos données repose sur votre consentement explicite, donné lors de la soumission du formulaire.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Durée de conservation</h3>
                <p>Vos données personnelles sont conservées pendant une durée maximale de <strong className="text-white">3 ans</strong> à compter de notre dernier échange, conformément aux recommandations de la CNIL.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Vos droits</h3>
                <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong className="text-white">Droit d'accès :</strong> Vous pouvez demander l'accès à vos données personnelles</li>
                  <li><strong className="text-white">Droit de rectification :</strong> Vous pouvez demander la correction de vos données</li>
                  <li><strong className="text-white">Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos données</li>
                  <li><strong className="text-white">Droit d'opposition :</strong> Vous pouvez vous opposer au traitement de vos données</li>
                  <li><strong className="text-white">Droit à la portabilité :</strong> Vous pouvez récupérer vos données dans un format structuré</li>
                </ul>
                <p className="mt-3">Pour exercer ces droits, contactez-nous à l'adresse : <a href="mailto:contact.nexus.developpement@gmail.com" className="text-cyan-300 hover:text-cyan-200 underline">contact.nexus.developpement@gmail.com</a></p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Sécurité des données</h3>
                <p>Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour assurer la sécurité de vos données personnelles et empêcher leur divulgation, leur destruction, leur perte ou leur accès par des tiers non autorisés.</p>
              </div>
            </div>
          </section>

          {/* Section 5: Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-600 pb-2">
              5. Cookies
            </h2>
            <div className="text-gray-200 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Utilisation des cookies</h3>
                <p>Notre site utilise des cookies techniques nécessaires au bon fonctionnement du site et à l'amélioration de votre expérience de navigation.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Types de cookies utilisés</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong className="text-white">Cookies de session :</strong> Cookies temporaires permettant la navigation sur le site</li>
                  <li><strong className="text-white">Cookies de préférences :</strong> Stockage de vos préférences (ex: consentement aux cookies)</li>
                </ul>
                <p className="mt-3"><strong className="text-white">Aucun cookie publicitaire ou de tracking tiers n'est utilisé sur ce site.</strong></p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Gestion des cookies</h3>
                <p>Vous pouvez à tout moment désactiver les cookies dans les paramètres de votre navigateur :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong className="text-white">Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</li>
                  <li><strong className="text-white">Firefox :</strong> Options → Vie privée et sécurité → Cookies</li>
                  <li><strong className="text-white">Safari :</strong> Préférences → Confidentialité → Cookies</li>
                  <li><strong className="text-white">Edge :</strong> Paramètres → Confidentialité → Cookies</li>
                </ul>
                <p className="mt-3 text-sm italic">Note : La désactivation des cookies peut affecter le bon fonctionnement du site.</p>
              </div>
            </div>
          </section>

          {/* Section 6: Limitation de responsabilité */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-600 pb-2">
              6. Limitation de responsabilité
            </h2>
            <div className="text-gray-200 space-y-3">
              <p>Nexus Développement s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.</p>
              <p>En conséquence, Nexus Développement décline toute responsabilité :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site</li>
                <li>Pour tous dommages résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations diffusées</li>
                <li>Pour tout dommage, direct ou indirect, quelles qu'en soient les causes, origines, natures ou conséquences, provoqué à raison de l'accès de quiconque au site ou de l'impossibilité d'y accéder</li>
              </ul>
              <p className="mt-3">Le site peut être temporairement indisponible pour des raisons de maintenance, de mise à jour ou pour toute autre raison technique.</p>
            </div>
          </section>

          {/* Section 7: Liens hypertextes */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-600 pb-2">
              7. Liens hypertextes
            </h2>
            <div className="text-gray-200 space-y-3">
              <p><strong className="text-white">Liens sortants :</strong> Le site peut contenir des liens vers d'autres sites internet. Nexus Développement ne peut être tenue responsable du contenu de ces sites externes ni des éventuels dommages résultant de leur utilisation.</p>
              <p><strong className="text-white">Liens entrants :</strong> La création de liens hypertextes vers le site nexusdeveloppement.fr est autorisée sans demande d'autorisation préalable, sous réserve que ce lien ne porte pas atteinte à l'image de Nexus Développement. Tout site à caractère diffamatoire, pornographique, xénophobe ou pouvant porter atteinte à l'ordre public est exclu de cette autorisation.</p>
            </div>
          </section>

          {/* Section 8: Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-600 pb-2">
              8. Propriété intellectuelle
            </h2>
            <div className="text-gray-200 space-y-2">
              <p>L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes, icônes, etc.) est la propriété exclusive de Nexus Développement, sauf mention contraire.</p>
              <p>Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces éléments est strictement interdite sans l'accord express écrit de Nexus Développement.</p>
              <p>Toute utilisation non autorisée du contenu du site constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la Propriété Intellectuelle.</p>
            </div>
          </section>

          {/* Section 9: Droit applicable et juridiction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-600 pb-2">
              9. Droit applicable et juridiction compétente
            </h2>
            <div className="text-gray-200 space-y-2">
              <p>Les présentes mentions légales sont régies par le droit français.</p>
              <p>En cas de litige relatif à l'interprétation ou à l'exécution des présentes, et à défaut d'accord amiable, compétence exclusive est attribuée aux tribunaux compétents de <strong className="text-white">Versailles</strong> (Yvelines, France).</p>
            </div>
          </section>

          {/* Section 10: Médiation de la consommation */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-600 pb-2">
              10. Médiation de la consommation
            </h2>
            <div className="text-gray-200 space-y-3">
              <p>Conformément aux dispositions des articles L.611-1 et suivants du Code de la consommation, tout consommateur a le droit de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable du litige qui l'oppose à un professionnel.</p>
              <p>En cas de litige non résolu après réclamation préalable auprès de nos services, vous pouvez soumettre votre différend à un médiateur de la consommation.</p>
              <p><strong className="text-white">Plateforme européenne de règlement en ligne des litiges (RLL) :</strong></p>
              <p><a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">https://ec.europa.eu/consumers/odr</a></p>
              <p className="text-sm italic mt-2">Note : Le médiateur de la consommation sera désigné dès l'immatriculation définitive de la société.</p>
            </div>
          </section>

          {/* Section 11: Contact */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-600 pb-2">
              11. Nous contacter
            </h2>
            <div className="text-gray-200 space-y-2">
              <p>Pour toute question concernant ces mentions légales ou l'utilisation de vos données personnelles, vous pouvez nous contacter :</p>
              <p className="mt-4"><strong className="text-white">Email :</strong> <a href="mailto:contact.nexus.developpement@gmail.com" className="text-cyan-300 hover:text-cyan-200 underline">contact.nexus.developpement@gmail.com</a></p>
              <p><strong className="text-white">Téléphone :</strong> <a href="tel:+33761847580" className="text-cyan-300 hover:text-cyan-200 underline">+33 7 61 84 75 80</a></p>
              <p><strong className="text-white">Adresse :</strong> 4 rue de la Ferme, 78990 Elancourt, France</p>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center text-gray-400 text-sm pt-8 border-t border-slate-600">
            <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;
