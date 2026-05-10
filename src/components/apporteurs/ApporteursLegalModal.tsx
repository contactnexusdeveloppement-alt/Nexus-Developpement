import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

/**
 * Modale "Mentions légales du programme apporteur".
 * Contenu juridique validé côté NED, à mettre à jour si la grille évolue.
 */
const ApporteursLegalModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-xs underline-offset-4 hover:underline focus:outline-none focus-visible:underline"
          style={{ color: "var(--ned-silver)" }}
        >
          Mentions légales du programme
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-w-2xl"
        style={{
          backgroundColor: "var(--ned-bg-elevated)",
          borderColor: "var(--ned-border)",
          color: "var(--ned-silver-light)",
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "var(--ned-silver-light)" }}>
            Mentions légales du programme
          </DialogTitle>
        </DialogHeader>

        {/* Conteneur scrollable : on cap la hauteur du corps pour que le titre reste fixe */}
        <div
          className="max-h-[65vh] overflow-y-auto pr-2 -mr-2"
          style={{ color: "var(--ned-silver)" }}
        >
          <div className="text-sm leading-relaxed space-y-3">
            <p>
              Le programme «&nbsp;Apporteur d'affaires&nbsp;» est proposé par la société{" "}
              <strong style={{ color: "var(--ned-silver-light)" }}>Nexus Développement (NED)</strong>,
              SARL au capital de 500&nbsp;€, immatriculée au RCS de Versailles sous le numéro{" "}
              <span className="tabular-nums">995&nbsp;394&nbsp;095</span>, dont le siège social est
              situé au 4&nbsp;rue de la Ferme, 78990&nbsp;Elancourt.
            </p>

            <Section title="Conditions d'éligibilité">
              Pour bénéficier des commissions, l'Apporteur doit être majeur et disposer du statut
              d'auto-entrepreneur (micro-entrepreneur) avec un numéro SIRET valide à la date du
              versement de la commission. La validation de la candidature ne constitue pas une
              garantie de revenus.
            </Section>

            <Section title="Rémunération">
              La commission s'élève à 20&nbsp;% du chiffre d'affaires hors taxes effectivement
              encaissé par Nexus Développement auprès du client présenté. Aucune commission n'est
              due en cas de prospect déjà connu de Nexus Développement, en cas d'impayé, ou si la
              signature intervient au-delà du délai de droit de suite de 12&nbsp;mois à compter de
              la présentation.
            </Section>

            <Section title="Versement">
              La commission est versée par virement bancaire sous 30&nbsp;jours calendaires à
              compter de l'encaissement intégral du prix par Nexus Développement, sur réception
              d'une facture conforme émise par l'Apporteur.
            </Section>

            <Section title="Engagement contractuel">
              La participation au programme est subordonnée à la signature préalable d'un contrat
              d'apporteur d'affaires entre l'Apporteur et Nexus Développement, dont les
              stipulations prévalent en cas de divergence avec les présentes mentions.
            </Section>

            <Section title="Données personnelles">
              Les informations collectées via le formulaire de candidature sont traitées par Nexus
              Développement aux fins exclusives du recrutement et de la gestion du programme. Elles
              sont conservées pendant la durée du programme majorée des délais légaux de
              prescription. Conformément au RGPD, vous disposez d'un droit d'accès, de
              rectification, d'effacement et d'opposition à l'adresse{" "}
              <a
                href="mailto:contact.nexus.developpement@gmail.com"
                className="underline underline-offset-2 hover:no-underline"
                style={{ color: "var(--ned-accent)" }}
              >
                contact.nexus.developpement@gmail.com
              </a>
              .
            </Section>

            <Section title="Modification du programme">
              Nexus Développement se réserve le droit de modifier ou de mettre fin au programme à
              tout moment, sans que cette décision n'affecte les commissions déjà acquises au titre
              des dossiers en cours.
            </Section>

            <Section title="Loi applicable">
              Le programme est régi par le droit français. Tout litige relèvera de la compétence
              exclusive du Tribunal de commerce de Versailles.
            </Section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h3
      className="text-sm font-bold mb-1.5"
      style={{ color: "var(--ned-silver-light)" }}
    >
      {title}
    </h3>
    <p>{children}</p>
  </section>
);

export default ApporteursLegalModal;
