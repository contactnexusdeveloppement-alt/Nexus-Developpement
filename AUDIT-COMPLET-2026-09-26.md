# Audit complet — nexusdeveloppement.fr

Date : 2026-09-26. Dépôt : HEAD `c430dff` (main, 2026-05-16), branche `audit/2026-09-26` (PR #1). Site live : https://nexusdeveloppement.fr (prod = exactement c430dff, vérifié via l'API Vercel).

**Méthode.** 10 auditeurs spécialisés (sécurité, API, SEO, live, RGPD/juridique, accessibilité, performance, UX/contenu, architecture, DevOps) ont lu le dépôt et sondé le site live (curl, DNS, Lighthouse mobile, tests navigateur). Chaque constat cite fichier:ligne et une preuve reproductible ; 40 constats ont été remontés indépendamment par 2 à 4 auditeurs et fusionnés. La passe de vérification adversariale prévue pour les constats critiques, hauts et moyens n'a pas été exécutée (limite de crédits) : aucun constat n'a de contre-vérification indépendante, tous sont livrés tels que rapportés par leur auditeur (voir annexe C).

---

## 1. Résumé exécutif

Le site est techniquement sain à la base (pré-rendu opérationnel, en-têtes de sécurité complets, aucun secret exposé, validation serveur stricte, TTFB 20 ms) mais il **vend des choses qu'il ne tient pas et casse ses propres parcours de conversion**.

Les trois problèmes qui comptent :

1. **Une exposition juridique directe.** La page service principale affiche « Garantie satisfaction ou remboursement intégral » et « Performance garantie » alors que les CGV disent acompte non remboursable et obligation de moyens ; pas de médiateur de la consommation désigné ; politique de cookies qui décrit des traceurs inexistants ; promesse de gains chiffrée aux apporteurs ; un « Directeur Créatif » fictif déclaré à Google dans le sitemap images. Tout cela relève du L121-2 C. conso.
2. **Les CTA principaux ne marchent pas.** « Commander maintenant » (15 boutons sur 5 pages services) ne mène nulle part ; le menu « Tarifs / Réserver / Contact » ramène en haut de l'accueil depuis toute page interne ; les liens de bas de page vers le formulaire atterrissent au mauvais endroit ; les 7 cases « services souhaités » du devis sont inaccessibles au clavier. Le seul canal de leads du site est en partie mort.
3. **Contenu et code non tenus.** Trois grilles de prix contradictoires sur les mêmes pages, délais et capital social en cinq versions, démos fictives présentées comme réalisations, home à 69/100 en perf mobile (LCP 5,1 s) parce que le pré-rendu est jeté au premier rendu React, et une CI qui déploie sans lint ni typecheck (main est parti avec 4 erreurs TS).

Ce qui est solide : pipeline GitHub Actions traçable, CSP/HSTS/CORS stricts, 3 Edge Functions avec listes blanches, échappement et limite de taille effectifs, JSON-LD valides, mentions légales et politique de confidentialité bien structurées, 25 routes pré-rendues alignées avec le sitemap, aucun traceur réel, page équipe honnête.

---

## 2. Scores par dimension

| Dimension | Note /100 | Justification |
|---|---|---|
| Sécurité | 72 | En-têtes, CORS, validation et gestion des secrets exemplaires ; mais relais d'emails ouvert (mail de confirmation avec texte libre vers n'importe quelle adresse, sans honeypot) et DMARC `p=none` sans SPF. |
| SEO/GEO | 58 | Pré-rendu, canonicals, JSON-LD et Lighthouse SEO 100 ; mais soft-404 sur toute URL inconnue, pages villes reliées uniquement par le footer (aucun lien contextuel), H1 de la home tronqué dans le HTML servi, FAQPage global désaligné, titles jusqu'à 107 caractères. |
| Conformité juridique | 45 | Mentions légales et politique de confidentialité complètes ; mais 1 constat critique (garantie remboursement niée par les CGV) et 6 hauts (médiateur absent, cookies fictifs, gains apporteurs, newsletter fantôme, prix sans HT, membre d'équipe fictif dans le sitemap). |
| Accessibilité | 55 | Lighthouse 96-100, alt partout, zoom autorisé ; mais le formulaire de devis est inutilisable au clavier (services, selects maison), cartes portfolio non focusables, aucun `<main>` sur 15 pages, 12 constats moyens. |
| Performance | 62 | TTFB 20 ms, CLS 0, WebP, polices auto-hébergées, Brotli ; mais home 69 en mobile (LCP 5,1 s) : pré-rendu écrasé par React, canvas rAF jamais annulé, framer-motion sur 100 % des pages, favicon 142 Ko. |
| UX/Contenu | 42 | Coordonnées cohérentes, 3 vrais clients, page équipe honnête ; mais CTA « Commander » mort, menu inopérant hors accueil, prix/délais contradictoires, chiffres invérifiables, démos sans marqueur, promo expirée sur /links. |
| Qualité de code | 60 | Lazy-loading propre, données centralisées, `api/_lib` partagé ; mais tsc 4 erreurs et ESLint 2 erreurs sur main, 12 fichiers morts, 8 dépendances inutiles, CSS de la démo restaurant qui écrase le site, api/ hors typecheck, échec email admin avalé. |
| DevOps | 60 | Pipeline fiable et traçable, secrets sains, previews sous SSO ; mais aucune barrière qualité, deux pipelines divergents (prod Actions Node 20 / previews Vercel Node 24), Node 20 en fin de vie, aucun test, token Vercel « Full Account ». |

---

## 3. Top 10 priorités

| N° | Constat | Sévérité | Effort | Gain attendu |
|---|---|---|---|---|
| 1 | Retirer « satisfait ou remboursé » / « Performance garantie » ou les écrire dans les CGV (rgpd-1) | Critique | S | Ferme le risque L121-2 sur la page service n°1 et la meta description Google |
| 2 | Réparer « Commander maintenant » sur les 5 pages services (ux-1) | Critique | S | Remet en service 15 CTA de conversion |
| 3 | Fermer le relais d'emails : plus de texte libre dans le mail client, honeypot sur QuoteForm/CallBooking (securite-1) | Haute | S puis M | Protège la réputation du domaine d'envoi, donc les leads |
| 4 | Vraie 404 : page /404 pré-rendue + rewrite ciblée dans vercel.json (seo-1) | Haute | S | Fin du soft-404, budget de crawl et GSC propres |
| 5 | Navigation interne : menu Tarifs/Réserver/Contact, scroll d'ancre après lazy, liens footer (ux-5, ux-6, ux-9) | Haute | S | Les parcours « page service → formulaire » fonctionnent enfin |
| 6 | Supprimer le bloc Théo Gautier du sitemap images et les 8 portraits fictifs de public/assets (rgpd-2, archi-1) | Haute | XS | Plus de fausse équipe indexable |
| 7 | Home : import statique d'Index, pré-rendu conservé, canvas rAF annulé (perf-1, perf-2) | Haute | M | LCP < 3 s visé, perf mobile > 80 |
| 8 | Formulaire de devis accessible : services en `<button aria-pressed>`, Select Radix (a11y-1, a11y-3) | Haute | S | Formulaire utilisable au clavier et au lecteur d'écran |
| 9 | Une seule grille de prix par page, mention HT partout (ux-4, rgpd-12, ux-13) | Haute | S | Cohérence tarifs FAQ / cartes / JSON-LD, conformité L112-1 |
| 10 | Lint + typecheck dans deploy.yml et job CI sur PR (devops-1) | Haute | S | Plus de régression TS/ESLint en prod |

Juste derrière : médiateur de la consommation (rgpd-3, S), maillage contextuel des pages villes (seo-2, S), politique de cookies réaliste (rgpd-4, S), échec de l'email admin avalé (api-1, S).

### Déjà corrigé dans cette PR

Trois commits sur la branche `audit/2026-09-26` (PR #1), postérieurs au HEAD audité c430dff, corrigent une partie des constats. Build, lint, typecheck et vérification navigateur passent sur la branche ; rien n'est encore déployé (deploy.yml ne tourne que sur main).

- `365cf18` (26/09) : menu desktop à partir de lg (navigation cassée entre 768 et 1030 px) ; suppression du bandeau cookies et réécriture de la politique cookies (rgpd-4, rgpd-6, a11y-22) ; retrait des `@import` Google Fonts bloqués par la CSP (perf-13) ; footer : liens services vers les vraies routes, « Consulting » retiré, faux formulaire newsletter supprimé (ux-9, rgpd-10) ; promesse « PageSpeed 95+ » reformulée (rgpd-1, partiel) ; `esbuild.drop` replacé au bon niveau (les `console.log` partaient en production) ; 4 erreurs TypeScript corrigées et script `typecheck` ajouté (devops-1, partiel).
- `4211794` (29/09) : « Commander maintenant » navigue vers l'accueil et le scroll d'ancre attend le montage des sections lazy (nouveau composant `HashScroll`), menu Tarifs/Réserver/Contact et CTA en liens `/#ancre` (ux-1, ux-5, ux-6) ; « Garantie satisfaction ou remboursement intégral », « Performance garantie », « nous garantissons » retirés, meta description sans emoji (rgpd-1) ; mention HT sur toutes les cartes + note TVA, FAQ des pages Automatisation et Applications web générées depuis la source du JSON-LD, JSON-LD de l'accueil aligné (ux-4, rgpd-12, ux-13) ; support « sous 48 h », capital 500 €, chiffres invérifiables retirés ; apporteurs : « dashboard temps réel » retiré, promesse de gains remplacée par un exemple à 20 % ; /links : promo périmée retirée, « Audit gratuit » → « Appel découverte » ; lien ODR fermé retiré des mentions légales et CGV (rgpd-3, partiel : médiateur toujours à désigner) ; Théo Gautier retiré du sitemap images et 8 portraits fictifs supprimés (rgpd-2, archi-1) ; formulaire de devis accessible (fieldset + `aria-pressed`, Select Radix, labels reliés, honeypot, erreurs serveur mappées par code, option e-commerce) (a11y-1, a11y-3) ; cartes portfolio/catalogue en vrais liens, badge « Démo », compteur « 3 réalisations · 4 démos », ItemList limité aux clients ; H1 complet dans le DOM, machine à écrire désactivée en pré-rendu et sous prefers-reduced-motion ; API : email admin critère de succès, logs structurés, codes d'erreur stables, honeypot, plus de texte libre dans les emails de confirmation, labels budget/délai, `reply_to` (api-1, securite-1 sans Turnstile) ; vraie 404 : route /404 pré-rendue copiée en `dist/404.html`, rewrite catch-all remplacée par une rewrite ciblée (seo-1, à vérifier au curl après le premier déploiement).
- `78316d7` (29/09) : lint + typecheck avant déploiement dans deploy.yml et job CI sur pull request (devops-1) ; boucle `requestAnimationFrame` du fond animé annulée au démontage et réduite à une image sous prefers-reduced-motion (perf-2).

- Vague 3 (29/09) : hydratation du HTML pré-rendu au lieu de le remplacer (`hydrateRoot`, accueil en import statique, sections statiques, formulaires montés après hydratation via `ClientOnly`, `Suspense` par route, animations d'entrée désactivées en pré-rendu et à l'hydratation via `intro()`, toasters montés côté client, nœuds texte adjacents fusionnés) : vérifié avec Playwright, le H1 et la navigation pré-rendus sont conservés et le LCP réel est au premier paint (perf-1, point 7 du Top 10) ; chunk vendor unique (fin du cycle react-vendor ↔ ui-vendor, qui plantait le bundle de développement) ; page `/e-commerce` (menu, services, footer, sitemap, llms.txt, pré-rendu) ; liens croisés entre pages villes + liens villes dans la FAQ de l'accueil (seo-2) ; titles et descriptions raccourcis (seo-7) ; OG image en JPEG 1200×630 avec dimensions et alt, icône Apple opaque, manifest sans `standalone` ni catégories invalides (annexe D) ; cache 1 jour + stale-while-revalidate sur les images non hashées, immutable réservé à `/assets` et `/fonts` (live-6) ; liens morts de la démo agence immobilière (devops : Header/Footer de la démo) ; simulateur apporteurs : tickets alignés sur la grille, formule maintenance corrigée, CA HT au lieu de « gain », hypothèse basse par défaut, FAQ et modale alignées (annexe D) ; date de mise à jour des pages légales en constante (rgpd-7) ; `vite:preloadError` → rechargement (annexe D) ; reliquats Netlify et fichier `.tmp` supprimés (securite-7, devops-18, archi-9).

Restent ouverts : le Turnstile du point 3 (clés Cloudflare), la désignation d'un médiateur (rgpd-3, abonnement à souscrire), la réception réelle des emails et l'observabilité (annexe D, zones non auditées).

---

## 4. Constats détaillés par dimension

Format : titre, sévérité, effort, emplacement, preuve, impact, correctif. Les constats bas et info tiennent sur une ligne. Tous les constats sont « non vérifiés » (voir annexe C).

### 4.1 Sécurité

**Relais d'emails ouvert : /api/send-quote et /api/book-call envoient un mail de confirmation à n'importe quelle adresse avec du texte libre, sans honeypot ni captcha** — securite-1 (aussi api-2)
- Sévérité : haute · Effort : S (points 1-2) puis M · `api/send-quote.ts:212`, `api/book-call.ts:189`
- Preuve : `to: [data.email]` ; `projectDetails` (jusqu'à 5 000 caractères, :48) et `name` recopiés dans le corps (:176, :186). `grep -rniE "turnstile|recaptcha|hcaptcha|honeypot" src index.html` → uniquement ApporteursForm. Rate-limit en mémoire par isolat (rate-limit.ts:3-5), plusieurs isolats observés en live. Test live 6 × POST `{}` : 400, 400, 400, 429, 429, 429. DKIM du domaine d'envoi valide.
- Impact : un script fait émettre par `noreply@send.nexusdeveloppement.fr` (DKIM valide) du phishing ou du spam au contenu choisi, 3/h/IP. Plaintes spam, suspension Resend possible, donc perte des leads, seule fonction métier du site.
- Correctif : 1) ne plus recopier `projectDetails` dans le mail client, restreindre `name` à lettres/espaces/tirets/apostrophes ; 2) reprendre le honeypot `website` d'ApporteursForm.tsx:259-279 dans QuoteForm et CallBooking avec le rejet serveur d'apporteurs-candidature.ts:81-84 ; 3) ensuite Cloudflare Turnstile vérifié côté Edge (ajouter challenges.cloudflare.com à la CSP) et limiteur partagé `@upstash/ratelimit` clé IP + email.

**Le rate-limit (3/h/IP) est décompté avant la validation : trois erreurs de saisie bloquent le prospect une heure, IP partagées** — securite-2 (aussi api-4)
- Sévérité : moyenne · Effort : XS · `api/send-quote.ts:97`
- Preuve : `rateLimit(...)` appelé avant `req.json()` (:117) et `validateBody` (:125) ; même ordre book-call.ts:81 et apporteurs-candidature.ts:178. Live : 3 × POST `{}` → 400 `Invalid name`, 4e → 429 `Retry-After: 3600`. QuoteForm n'a que `required`, aucune validation du téléphone alors que le serveur applique `PHONE_REGEX`.
- Impact : un prospect qui corrige deux fois son numéro reçoit « Trop de demandes » une heure ; tous les visiteurs derrière une IP (entreprise, CGNAT) partagent 3 envois.
- Correctif : déplacer `rateLimit` après `validateBody`, ou deux compteurs (tentatives 30/h, envois 3/h après succès Resend). Valider téléphone et email côté client avec la regex serveur.

**CSP : `script-src 'unsafe-inline'` et hôtes Google en allowlist uniquement pour un bloc GA4 avec ID placeholder** — securite-3
- Sévérité : moyenne · Effort : XS · `vercel.json:35`, `index.html:67-76`
- Preuve : `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com`. index.html:66-77 contient le bloc GA4 (`gtag/js?id=G-XXXXXXXXXX`) entièrement commenté, dans le dépôt comme en live : aucun script GA n'est exécuté (live-19 le confirme). Un seul `<script>` inline exécutable (243 octets) ; `grep -rn dangerouslySetInnerHTML src/` → 0. Nonce impossible (HTML statique en cache CDN).
- Impact : `'unsafe-inline'` neutralise la protection XSS de la CSP ; googletagmanager.com est un hôte connu de contournement CSP, en allowlist pour rien.
- Correctif : supprimer index.html:63-76, retirer `'unsafe-inline'` et les hôtes Google de `script-src`, `google-analytics.com` de `connect-src`. Le jour où GA est activé : hash `'sha256-…'` ou config dans un fichier de src/. Déployer d'abord en `Report-Only`. Garder `style-src 'unsafe-inline'`.

**Dépôt GitHub public : l'audit brut publie les faiblesses non corrigées, le code expose le nom du honeypot et les seuils** — securite-4 (aussi archi-21, devops-17)
- Sévérité : moyenne · Effort : XS · `AUDIT-BRUT-2026-09-26.md:127`
- Preuve : API GitHub → `"private": false`. Commit 784e2cb = AUDIT-BRUT (155 Ko) poussé sur origin. :127-131 décrit le relais d'emails avec fichier:ligne. apporteurs-candidature.ts:82 champ honeypot `website`, :178 seuil 3/h. Six fichiers .md versionnés dont quatre rapports datés.
- Impact : mode d'emploi public des points faibles ; le honeypot ne filtre plus que les bots qui ne lisent pas le code. Aucun secret ni donnée personnelle (vérifié).
- Correctif : passer le dépôt en privé. Sinon sortir AUDIT-*.md et SEO-*.md du dépôt, .gitignore, purge d'historique (irréversible, à valider).

**Authentification email : DMARC `p=none`, aucun SPF sur l'apex, sous-domaine d'envoi sans SPF ni MX publiés** — securite-5 (aussi api-13)
- Sévérité : moyenne · Effort : S · DNS (hors dépôt)
- Preuve : `_dmarc.nexusdeveloppement.fr` = `v=DMARC1; p=none;` sans `rua=` ; apex : aucun TXT, aucun MX ; `send.nexusdeveloppement.fr` : aucun TXT ni MX ; `resend._domainkey.send.…` présent ; `send.send.…` a SPF amazonses + MX feedback-smtp (return-path OK). Expéditeur : `noreply@send.nexusdeveloppement.fr` (send-quote.ts:106).
- Impact : n'importe qui envoie un mail `xxx@nexusdeveloppement.fr` sans rejet et sans que vous le sachiez. Délivrabilité transactionnelle fragile dès qu'il y a du volume.
- Correctif : apex `TXT "v=spf1 -all"` ; `_dmarc` → `p=quarantine; rua=mailto:contact.nexus.developpement@gmail.com; adkim=r; aspf=r` puis `p=reject` ; recréer SPF/MX de `send.` tels qu'affichés dans Resend et vérifier « Verified ».

Constats bas et info :
- **securite-6** (basse, XS, `vercel.json:34`) — HSTS annonce `preload` mais hstspreload.org → `status: unknown` ; prérequis remplis (308 http→https, www→apex). Trancher : soumettre ou retirer `preload`.
- **securite-7** (basse, XS, `netlify.toml:20`, `public/_headers`) — config Netlify morte et divergente (`X-XSS-Protection` obsolète, sans CSP/HSTS), `_headers` servi en 200 en prod, `interest-cohort=()` (FLoC) dans Permissions-Policy. Supprimer les deux fichiers, retirer `interest-cohort`.
- **securite-8** (basse, XS, `.github/workflows/deploy.yml:36`) — aucun bloc `permissions:` ni `concurrency:`, `vercel@latest` et actions par tag mobile, IDs Vercel en clair, `.vercel/` non ignoré, pas de dependabot. Ajouter `permissions: contents: read`, épingler versions/SHA, `.vercel` dans .gitignore.
- **securite-11** (info, XS) — `Access-Control-Allow-Origin: *` sur HTML et statiques : couche statique Vercel, pas le projet (`nextjs.org/favicon.ico` a le même) ; /api/* strict. Aucun impact ; optionnel dans vercel.json.
- **securite-12** (info, XS, `public/security.txt:5`) — security.txt en double (racine + .well-known), `Policy:` pointe vers la politique RGPD. Supprimer la copie racine, rappel avant le 30/04/2027.
- **securite-13** (info, XS, `api/_lib/cors.ts:7`) — `http://localhost:8080` et `:5173` autorisés en prod. Conditionner à `VERCEL_ENV !== "production"`.
- **securite-15** (info, XS, `vercel.json:8`) — alias `nexus-developpement.vercel.app` public (200) avec canonical correct ; previews sous SSO. Optionnel : 308 vers l'apex.

### 4.2 SEO / GEO

Voir aussi a11y-2 (H1 tronqué, section 4.4) et rgpd-2 (sitemap images, section 4.3).

**Soft-404 : toute URL inconnue répond 200 avec le HTML de la home, en index,follow** — seo-1 (aussi live-1)
- Sévérité : haute · Effort : S · `vercel.json:22`
- Preuve : `curl -sI /page-inexistante-xyz` → 200, 170 246 octets (= home), title de la home, canonical `/`, `robots index, follow`. Idem `/404`, `/Equipe`, `/EQUIPE`, `/agence-immo/login`. `/404.html` → 404 (aucune page 404 statique). Cause : rewrite catch-all `"/((?!api/.*|.*\\..*).*)"` → `/index.html` ; le noindex de NotFound.tsx:23-26 est client-only ; `/404` absent de ROUTES_TO_PRERENDER.
- Impact : soft-404 dans GSC, budget de crawl gaspillé, URLs parasites indexables sous le title de la home.
- Correctif : ajouter `/404` à ROUTES_TO_PRERENDER, copier `dist/404/index.html` → `dist/404.html` en post-build ; remplacer la rewrite catch-all par une rewrite ciblée `/agence-immo/property/:id` (les 25 autres routes sont des fichiers statiques). Vérifier `curl -sI /page-inexistante-xyz` → 404.

**Les 6 pages villes ne sont reliées que par le footer (liens en 12 px) : aucun lien contextuel dans le corps des pages ni entre villes** — seo-2 (requalifié par la relecture)
- Sévérité : moyenne (haute à l'origine, abaissée : les liens existent dans le footer) · Effort : S · `src/components/Footer.tsx:125-140`
- Preuve : Footer.tsx:5 importe `LOCAL_CITIES` et rend un `<Link to={`/${city.slug}`}>` par ville sous « Nos zones d'intervention en Yvelines » (l.125-140, `text-xs`) ; le HTML live de la home contient bien les 6 `href="/agence-web-…"`. Le grep initial (`agence-web-`) a raté les slugs construits dynamiquement. En revanche, aucun lien vers les villes dans le corps des pages, la FAQ ou entre villes.
- Impact : les pages locales ne reçoivent que des liens de pied de page, peu pondérés ; aucun maillage contextuel.
- Correctif : lien contextuel dans FAQ.tsx:16-17 (« Êtes-vous une agence locale ? »), bloc « Villes voisines » en bas de LocalCity.tsx, mention des villes dans les pages services.

Note : la relecture du 29/09 a tranché en faveur des auditeurs a11y (a11y-18) et archi : les liens existent dans le footer depuis c430dff.

**Pages villes : cartes services et CTA en `<button onClick=navigate>`, zéro lien crawlable dans le contenu** — seo-4
- Sévérité : moyenne · Effort : XS · `src/pages/LocalCity.tsx:219`
- Preuve : l.217-219 `<button onClick={() => navigate(service.href)}>` pour les 4 services ; l.129 retour accueil ; CTA en `navigate("/#reservation")`. `grep -c "navigate(" LocalCity.tsx` → 5. Seuls `<a>` du corps : `tel:` et `mailto:`.
- Impact : aucun signal des pages villes vers les pages services.
- Correctif : `<Link to={service.href}>` avec les mêmes classes, `<Link to="/#reservation">` pour les CTA.

**Pages villes : ~88 % du texte identique d'une ville à l'autre** — seo-5
- Sévérité : moyenne · Effort : M · `src/pages/LocalCity.tsx:64`
- Preuve : comptage node : 104 à 123 mots uniques par ville contre ~873 mots templatés (FAQ l.64-85 = 717 mots). Titles l.93 et descriptions l.94 ne diffèrent que par nom et distance.
- Impact : Google regroupe les pages quasi identiques ; peu de chances de ranker sur « agence web <ville> ».
- Correctif : 2-3 champs réellement locaux par ville dans localCities.ts (FAQ propre, secteurs, accès), FAQ templatée réduite à 2 questions. Objectif ≥ 40 % de texte unique.

**Titles jusqu'à 107 caractères et descriptions > 160 sur 13+ pages** — seo-7 (aussi live-4)
- Sévérité : moyenne · Effort : S · `src/pages/LocalCity.tsx:93`
- Preuve : live : SQY 107, Montigny 104, Versailles 92, home 90, /apporteurs 74. Descriptions : /concession-automobile 227, /agence-immobiliere 216, / 196, /catalogue 194, /equipe 188.
- Impact : titles tronqués en SERP (marque et « Automatisation » disparaissent), descriptions coupées avant le CTA.
- Correctif : ≤ 60 caractères (`Agence web ${city.name} (${dept}) | Nexus Développement`), descriptions ≤ 155 avec CTA en tête ; garde-fou `console.warn` en dev dans SEO.tsx.

**og-image.png est un JPEG servi en image/png ; aucune dimension/alt OG, une seule image pour 25 pages** — seo-8 (aussi live-8)
- Sévérité : moyenne · Effort : S · `public/og-image.png`
- Preuve : premiers octets `ffd8ffe0` (JFIF), 1200 × 640, 36 287 octets, `Content-Type: image/png`. Aucun `og:image:width/height/alt` dans index.html ni SEO.tsx. `/og-image.webp` existe mais n'est pas utilisé en og:image.
- Impact : type MIME incohérent pour certains scrapers, premier partage sans image, aperçu identique pour toutes les pages.
- Correctif : renommer en og-image.jpg 1200 × 630, mettre à jour les 6 références, ajouter width/height/alt/type dans SEO.tsx, générer une image par service/démo.

**Fiches biens démo (/agence-immo/property/:id) indexables avec le title de la home et canonical vers /** — seo-9 (aussi archi-13)
- Sévérité : moyenne · Effort : S · `src/pages/PropertyDetail.tsx:8`
- Preuve : aucun `import SEO` ; route absente du sitemap et de ROUTES_TO_PRERENDER (seul écart entre App, sitemap et prerender). `curl /agence-immo/property/1` → title de la home, canonical `/`, 170 246 octets.
- Impact : 4-5 URLs crawlables déclarées copies de la home avec un contenu immobilier fictif.
- Correctif : `<SEO title={`Démo : ${property.title}`} canonical=… />` + prop `noindex` dans SEO.tsx ; ou pré-rendre et ajouter au sitemap.

**FAQPage JSON-LD global injecté sur les 25 pages avec 6 questions invisibles ; FAQ pages désalignées** — live-3 (aussi seo-6)
- Sévérité : moyenne · Effort : S · `index.html:327`
- Preuve : bloc statique du `<head>` présent sur /cgv, /mentions-legales, /links… Script node : 6 questions, 0 visible sur toutes les pages testées. La FAQ visible de la home (FAQ.tsx:12-29) n'est pas balisée. Pages service/villes : 2 FAQPage par page, questions JSON-LD ≠ texte visible sur /creation-site-web (3 absentes sur 5).
- Impact : contraire aux consignes Google (contenu balisé visible, un FAQPage par page) ; risque d'action manuelle, bruit GSC.
- Correctif : supprimer le FAQPage global d'index.html ; générer chaque FAQPage depuis le même tableau que la FAQ affichée.

Constats bas et info :
- **seo-12** (basse, XS, `src/components/SEO.tsx:107`) — schemas dynamiques dupliqués après hydratation (8 ld+json sur /agence-web-versailles + 3 réinjectés). Supprimer `script[data-dynamic-schema]` au début du useEffect.
- **seo-14** (basse, XS, `index.html:12`) — meta de repli avec emojis, canonical/og:url sans slash final, `meta keywords`. Aligner sur Index.tsx, supprimer keywords.
- **seo-16** (basse, S, `src/pages/WebsiteCreation.tsx:85`) — BreadcrumbList sur 12 pages sans fil d'Ariane visible (`aria-label="breadcrumb"` → 0). Créer `Breadcrumb.tsx` alimenté par le même tableau.
- **live-10** (basse, S, `public/sitemap.xml:5`, aussi seo-11) — lastmod 23 × 2026-04-30 alors que les pages ont changé en septembre. Générer le sitemap au build depuis ROUTES_TO_PRERENDER + `git log -1 --format=%cs`.
- **live-11** (basse, XS, `vercel.json:15`, aussi seo-17) — `/index.html`, `/equipe/index.html`, variantes de casse en 200. Redirects `/index.html` → `/` et `/:path+/index.html` → `/:path+`.
- **live-12** (basse, XS, `vercel.json:9`) — chaîne de 3 redirections depuis `http://www.…/equipe/`. Règle combinée www + slash.
- **live-14** (basse, XS, `public/robots.txt`) — aucun `Disallow` ; 25 blocs `Allow: /` redondants. Ajouter `Disallow: /api/`.
- **seo-18** (info, XS, `public/llms.txt:57`) — « 23 pages » (25 réelles), « équipe complète » (2 personnes), /apporteurs et /links absents, aucune mention de « Ned ». Mettre à jour, idéalement générer depuis ROUTES_TO_PRERENDER.
- **seo-19** (info, S, `src/components/restaurant/Hero.tsx:21`) — H1 « The Hudson Loft » et « DRIVEN BY PASSION » sous `lang="fr"` sur des pages indexées. Bandeau « Démo » visible ou `noindex, follow`.

### 4.3 Conformité juridique

**« Garantie satisfaction ou remboursement intégral » et « Performance garantie » affichées, mais niées par les CGV** — rgpd-1 (aussi ux-2)
- Sévérité : critique · Effort : S · `src/pages/WebsiteCreation.tsx:263`
- Preuve : :263 `<strong>Garantie satisfaction</strong> ou remboursement intégral` ; :251 « Performance garantie : Score Google PageSpeed 95+ sur tous nos projets » ; :240, :303 « nous garantissons ». index.html:13 (meta description home) « ⚡ Performance garantie », :350 FAQPage « Nous garantissons une livraison rapide ». Contre : CGV.tsx:149 « acompte de 40 % … non remboursable », :234 « aucune somme … remboursable au prorata », :308-314 obligation de moyens, pas d'obligation de résultat « quant à la performance … au référencement », art. 7 délais indicatifs. `grep -n rembours CGV.tsx` → aucune clause de remboursement intégral ; `grep satisfaction` → 0. Confirmé en prod (curl).
- Impact : pratique commerciale trompeuse (L121-2 2°) sur la page service principale et la meta description Google : nullité, remboursement forcé, exposition DGCCRF.
- Correctif : une seule vérité. Soit supprimer les 5 mentions (remplacer « Performance garantie » par « Sites optimisés Core Web Vitals », « garantissons » par « visons »). Soit écrire une vraie garantie dans CGV art. 13 (périmètre, délai, exclusions) et adapter art. 5/6.

**Membre d'équipe fictif « Théo Gautier — Directeur Créatif » déclaré à Google et 8 portraits fictifs servis en production** — rgpd-2 (aussi seo-10, live-5)
- Sévérité : haute · Effort : XS · `public/sitemap-images.xml:28`
- Preuve : lignes 29-30 `theo_gautier.webp` / `Théo Gautier — Directeur Créatif` sous `<loc>/equipe</loc>`, identique en prod. `curl -I /assets/theo_gautier.webp` → 200, 83 210 o ; idem sarah_chen, emma_dubois. `ls public/assets` : 8 portraits (chloe_durand, emma_dubois, julie_morel, lucas_martin, maxime_leroy, sarah_chen, theo_gautier, thomas_petit), aussi dans dist/. Aucune page ne les affiche ; Team.tsx:21-38 n'a que Adam et Théo.
- Impact : Google Images peut indexer une personne fictive comme membre de l'équipe (L121-2 2° f). Les 8 portraits restent prêts à réapparaître.
- Correctif : supprimer les lignes 28-31 du sitemap images, les 8 .webp de public/assets et src/assets, redéployer, demander la suppression de l'URL dans Search Console.

**Aucun médiateur de la consommation désigné et lien vers la plateforme ODR fermée depuis juillet 2025** — rgpd-3
- Sévérité : haute · Effort : S · `src/pages/LegalNotice.tsx:96`
- Preuve : CGV.tsx:45 s'applique aux « consommateurs ». LegalNotice.tsx:96-110 et CGV.tsx:492-506 : « peut recourir à un médiateur » sans nom ni adresse. Lien `ec.europa.eu/consumers/odr/` (4 occurrences) → 301 vers une page « discontinued as of 20 July 2025 ».
- Impact : L616-1 impose les coordonnées du médiateur ; amende administrative jusqu'à 15 000 € (L641-1). Lien mort sur les pages légales.
- Correctif : option A (recommandée) : réserver l'offre aux professionnels (CGV art. 1), supprimer les paragraphes consommateurs et le lien ODR. Option B : adhérer à un médiateur (CM2C, Medicys, CNPM…), inscrire nom/adresse/site.

**Politique de cookies décrit des traceurs qui n'existent pas (Supabase, cookie_consent, mesure d'audience) et un bandeau avec refus qui n'existe pas** — rgpd-4
- Sévérité : haute · Effort : S · `src/pages/CookiePolicy.tsx:51`
- Preuve : :51 « sb-* (Supabase) » → aucune dépendance Supabase, seule occurrence dans src. :52 « cookie_consent 6 mois » → réalité : `localStorage.setItem("cookieConsent", "true")` (CookieConsent.tsx:19). :58-73 mesure d'audience → GA commenté, `Set-Cookie` vide en prod. :97-98 « accepter, refuser ou personnaliser » → un seul bouton « Accepter » (CookieConsent.tsx:59-64). :99-100 « lien dédié en pied de page » → inexistant.
- Impact : information inexacte (art. 12-13 RGPD), première chose lue en cas de plainte CNIL ; fait croire à un profilage.
- Correctif : réécrire pour décrire la réalité (aucun cookie, une clé localStorage exemptée, aucun traceur), supprimer les sections 3-4, aligner PrivacyPolicy.tsx:267.

**Programme apporteurs : promesse « 1 500 à 3 000 € avec 5 personnes » et « dashboard apporteur en temps réel » inexistant** — rgpd-5
- Sévérité : haute · Effort : S · `src/components/apporteurs/ApporteursFinalCTA.tsx:231`
- Preuve : :231-232 « Vous pouvez vous faire 1 500 à 3 000 € rien qu'avec ces 5 personnes » (suppose 5 signatures sur 5 alors que le simulateur fixe 25/40/60 %, ApporteursSimulator.tsx:14-18). ApporteursFAQ.tsx:40 et ApporteursProcess.tsx:490 « dashboard apporteur en temps réel » → aucune route, site sans base. Cible : « Étudiants », « Sans emploi » (ApporteursTargets.tsx:7-9).
- Impact : recrutement de particuliers sur une promesse de gains non étayée et une fonctionnalité inexistante (L121-2).
- Correctif : formulation conditionnelle cohérente avec le simulateur ; remplacer « dashboard » par « point d'avancement par email à chaque étape ».

**Newsletter du footer : faux formulaire (aucun envoi) avec mention d'acceptation de la politique de confidentialité** — rgpd-10 (aussi ux-8)
- Sévérité : haute · Effort : XS · `src/components/Footer.tsx:106`
- Preuve : :106-118 `<input type="email">` + `<button aria-label="S'inscrire">` sans `<form>`, `onSubmit`, `onClick`, état ou API (`grep "onSubmit|<form|fetch"` → 0). :119-121 mention sans lien. Finalité « newsletter » absente de PrivacyPolicy.tsx:56-71 et :89-108. Présent sur toutes les pages.
- Impact : fonctionnalité fantôme ; branchée telle quelle, il manquerait l'opt-in L34-5 CPCE et la finalité.
- Correctif : supprimer le bloc Footer.tsx:100-122 (recommandé). Sinon Edge Function + double opt-in + case décochée + finalité dans la politique.

**Grilles tarifaires affichées sans mention HT/TTC alors que CGV et JSON-LD disent HT** — rgpd-12 (aussi ux-3)
- Sévérité : haute · Effort : XS · `src/components/PricingCard.tsx:76`
- Preuve : pricingData.ts:28 « À partir de 950€ », :39 « Hébergement 50€/mois », :86 « 390€ »… sans « HT » ; `grep -i "HT\b|TVA|hors taxe"` sur Pricing/PricingCard → 0. CGV.tsx:142-145 « hors taxes (HT) … TVA 20 % ajoutée », schemas.ts:87 `valueAddedTaxIncluded: false`, FAQ « 950 € HT ».
- Impact : un consommateur (admis par les CGV) lit 950 € et reçoit 1 140 € TTC ; le prix consommateur doit être TTC (L112-1). Nuit à la « transparence tarifaire » (Team.tsx:48-49).
- Correctif : suffixer « HT » dans PricingCard.tsx:84-95, mention « Prix hors taxes, TVA 20 % en sus » sous chaque grille. Si B2C : TTC ou les deux.

**Bandeau cookies injustifié (aucun cookie), consentement « par poursuite de navigation », lien vers les mentions légales** — rgpd-6
- Sévérité : moyenne · Effort : XS · `src/components/CookieConsent.tsx:46`
- Preuve : :46 « En continuant votre navigation, vous acceptez » ; aucun Set-Cookie en prod ; :51 lien vers /mentions-legales ; :34-40 la croix ne mémorise pas → bandeau à chaque visite.
- Impact : la CNIL (2020-091) rejette la poursuite de navigation ; ici rien n'est soumis à consentement. Gêne chaque visiteur.
- Correctif : supprimer CookieConsent tant qu'aucun traceur n'est activé (voir « Déjà corrigé » : composant absent de la copie de travail). Si GA un jour : bandeau bloquant Accepter/Refuser de même niveau.

**« Dernière mise à jour » calculée à la date du jour sur les 5 pages légales** — rgpd-7
- Sévérité : moyenne · Effort : XS · `src/pages/CGV.tsx:623`
- Preuve : `new Date().toLocaleDateString(...)` dans CGV.tsx:623-628, PrivacyPolicy.tsx:370, LegalNotice.tsx:198, TermsOfService.tsx:161, CookiePolicy.tsx:282-287. Prod : « 16 mai 2026 » pré-rendu puis remplacé par la date de consultation. CGV art. 20 : « version en vigueur au jour de la commande » sans date réelle.
- Impact : faux signal de fraîcheur ; impossible de prouver quelle version s'appliquait à une commande.
- Correctif : `src/lib/legal.ts` avec `LEGAL_LAST_UPDATED = "2026-05-16"`, numéro de version dans l'en-tête des CGV.

**Google (boîte Gmail) est un destinataire réel des données de formulaires mais n'est pas déclaré ; contact RGPD sur @gmail.com** — rgpd-8
- Sévérité : moyenne · Effort : S · `src/pages/PrivacyPolicy.tsx:157`
- Preuve : `ADMIN_EMAIL = … || "contact.nexus.developpement@gmail.com"` dans les 3 fonctions (apporteurs : date de naissance, statut, ville, motivation). PrivacyPolicy.tsx:157-170 ne liste que Vercel et Resend.
- Impact : information incomplète sur destinataires et transferts hors UE (art. 13.1.e-f). Image : contact légal sur Gmail.
- Correctif : ajouter Google LLC (Gmail, États-Unis, DPF) ; créer contact@nexusdeveloppement.fr, `ADMIN_EMAIL` en variable Vercel, remplacer les 15+ occurrences.

**Réservation d'appel sans information RGPD au point de collecte ; devis renvoie vers les mentions légales** — rgpd-9
- Sévérité : moyenne · Effort : XS · `src/components/CallBooking.tsx:448`
- Preuve : étape 3 (:448-497) collecte nom/email/téléphone sans mention ni lien (`grep -i "confidentialit|consent|rgpd"` → 0). QuoteForm.tsx:407 lien vers `/mentions-legales` ; ApporteursForm.tsx:547-555 pointe correctement vers /confidentialite.
- Impact : art. 13 non respecté au moment de la collecte ; LegalNotice n'a pas de section données personnelles.
- Correctif : phrase + lien /confidentialite après CallBooking.tsx:497 ; QuoteForm.tsx:407 → `/confidentialite`.

**CGV : clauses inopposables aux consommateurs alors que les CGV se déclarent applicables aux consommateurs** — rgpd-11
- Sévérité : moyenne · Effort : S · `src/pages/CGV.tsx:408`
- Preuve : :408 plafond de responsabilité sans carve-out consommateur (R212-1 6°). Art. 12 (:349-371) fonde la perte de rétractation sur L221-28 3° (biens) au lieu du régime services (L221-25 / L221-28 1°), renonciation pré-rédigée (:363), pas de formulaire type (R221-1), indemnité 15 % sans réciprocité (:369).
- Impact : clauses réputées non écrites ; rétractation de 14 jours exerçable faute de renonciation valable.
- Correctif : même arbitrage que rgpd-3. B2B : art. 1 « réservées aux professionnels ». B2C : exclure les consommateurs du plafond, réécrire art. 12, joindre le formulaire type.

**Apporteurs : formulaire ouvert dès 16 ans alors que le programme exige la majorité ; date de naissance complète ; durées de conservation contradictoires** — rgpd-14
- Sévérité : moyenne · Effort : XS · `src/components/apporteurs/ApporteursForm.tsx:104`
- Preuve : modale :48-49 « majeur et auto-entrepreneur » vs `isAdult` = 16 ans (:65-76, :104) et serveur `isAtLeast16` (:67-73). Date de naissance obligatoire transmise en clair sur Gmail (:254). Conservation : « durée du programme + prescription » (modale :76-78) vs « 2 ans » (PrivacyPolicy.tsx:134-137).
- Impact : mineurs candidats à un programme fermé ; collecte excessive (art. 5.1.c) ; deux durées pour un traitement.
- Correctif : 18 ans ou case « Je certifie être majeur(e) » vérifiée serveur ; harmoniser sur « 2 ans ».

Constats bas et info :
- **rgpd-15** (basse, XS, `LegalNotice.tsx:37`) — adresse Vercel périmée (Walnut) ; actuelle « 440 N Barranca Avenue #4133, Covina, CA 91723 » ; téléphone hébergeur absent (LCEN 6 III 1°).
- **rgpd-16** (basse, XS, `PrivacyPolicy.tsx:168`) — Resend présenté comme adhérent DPF ; ses DPA/privacy ne citent que les CCT. Vérifier sur dataprivacyframework.gov, sinon « CCT (DPA Resend) » (:168, :187, LegalNotice.tsx:41).
- **rgpd-17** (basse, XS, `QuoteForm.tsx:119`) — case de consentement bloquante sur un traitement fondé sur 6.1.b (mesures précontractuelles). Remplacer par une mention d'information ; préciser la relance des particuliers.
- **rgpd-18** (basse, XS, `Team.tsx:58`) — « cession totale des droits … à la livraison » et « pas de coûts cachés » vs CGV.tsx:327-338 (propriété jusqu'au paiement intégral, exclusions) et prix « à partir de ». Reformuler avec renvoi CGV art. 11.
- **rgpd-19** (basse, XS, `salon/testimonials/Testimonials.tsx:4`) — démos salon/restaurant/concession sans bandeau « démo » : faux avis 5 étoiles, fausse équipe sur votre domaine ; seule la démo immo l'affiche. Bandeau commun + catégorie « Démo » dans projects.ts.
- **rgpd-20** (info, XS, `PrivacyPolicy.tsx:37`) — « son gérant : Adam Le Charlès » alors que la SARL a deux co-gérants. Nommer les deux.
- **rgpd-21** (info, S, `TermsOfService.tsx:10`) — CGU génériques sans lien vers les autres documents, clause de compétence sans réserve consommateur. Supprimer /cgu ou l'enrichir.

### 4.4 Accessibilité

**Formulaire de devis : les 7 « services souhaités » (obligatoires) non sélectionnables au clavier ni au lecteur d'écran** — a11y-1
- Sévérité : haute · Effort : S · `src/components/QuoteForm.tsx:301`
- Preuve : :301-310 `<motion.div onClick={() => handleServiceToggle(…)} className="cursor-pointer …">` sans `role`, `tabIndex`, `aria-pressed` ni clavier. :110 soumission bloquée si `services.length === 0`. :294 `<h3>` non relié, pas de fieldset.
- Impact : un utilisateur clavier ou lecteur d'écran ne peut jamais envoyer le devis (WCAG 2.1.1, 4.1.2, 1.3.1).
- Correctif : `<button type="button" aria-pressed={isSelected}>` (ou checkbox sr-only + label) dans un `<fieldset><legend>`, animation via `motion.button`.

**Le H1 de la page d'accueil est tronqué dans le HTML pré-rendu à cause de l'effet machine à écrire** — a11y-2 (aussi perf-19, ux-14)
- Sévérité : haute · Effort : S · `src/components/Hero.tsx:49`
- Preuve : `useTypewriter(fullText, 50, !isMobile)` (66 caractères × 50 ms = 3,3 s), `useState(enabled ? '' : text)`, capture Puppeteer à 2 s (main.tsx:13-15). Prod : `curl / | grep -o "<h1…"` → « Agence Web &amp; Mobile : Créati » (28/66). Aucun `prefers-reduced-motion` dans le hook ; 67 rendus du Hero pendant 3,4 s.
- Impact : titre indexé et lu au chargement = « Agence Web & Mobile : Créati » ; H1 qui change pendant 3,3 s (WCAG 2.4.6, 2.3.3).
- Correctif : texte complet en `sr-only` + typed en `aria-hidden`, désactiver si `prefers-reduced-motion` ou `navigator.webdriver` ; ou `enabled=false` par défaut.

**Composant Select « maison » sans sémantique ARIA ni clavier ; labels Type d'activité / Budget / Délai non associés** — a11y-3
- Sévérité : haute · Effort : S · `src/components/ui/select.tsx:113`
- Preuve : trigger sans `aria-haspopup/expanded/controls` (:41-53), content `<div>` sans `role="listbox"` (:81-93), item `<div onClick>` sans `role="option"`, `tabIndex`, clavier ni fermeture extérieure (:113-124). QuoteForm.tsx:268/353/372 `Label htmlFor` sans `id` sur le trigger. @radix-ui/react-select installé mais non utilisé.
- Impact : les 3 listes du devis inutilisables au clavier (WCAG 1.3.1, 2.1.1, 4.1.2).
- Correctif : `npx shadcn@latest add select` (Radix) et `id` sur chaque SelectTrigger ; ou `<select>` natif.

**Cartes Portfolio et /catalogue : `div onClick` non focusables, aucun accès clavier aux démos** — a11y-4 (aussi seo-3, ux-22, securite-14)
- Sévérité : haute · Effort : S · `src/pages/ProjectsCatalog.tsx:67`
- Preuve : `handleClick → window.open(project.url, '_blank')` sur `motion.div` sans `role/tabIndex/onKeyDown` (ProjectsCatalog.tsx:45-68, Portfolio.tsx:44-69). `grep '(to|href)="/(salon-coiffure|restaurant|…)"' src/` → 0 : aucun lien crawlable vers les démos. Tous les `<a target="_blank">` externes ont bien `rel="noopener noreferrer"`.
- Impact : aucune démo atteignable au clavier, aucun lien pour les moteurs (WCAG 2.1.1, 4.1.2).
- Correctif : `<a href target="_blank" rel="noopener noreferrer">` (ou `<Link>`) englobant la carte, tilt sur un wrapper sans onClick, `focus-visible:ring-2`.

**Aucune prise en compte de prefers-reduced-motion hors Apporteurs et Links** — a11y-5
- Sévérité : moyenne · Effort : S · `src/index.css:167`
- Preuve : seule règle `@media (prefers-reduced-motion)` scopée `.theme-apporteurs *` ; `scroll-behavior: smooth` non conditionné ; `useReducedMotion|MotionConfig` → 0 ; AnimatedBackground sur 18 pages ; `animate-pulse` infini (PricingCard.tsx:60), `repeat: Infinity` (salon Hero), `animate-bounce` (immo).
- Impact : particules et animations infinies partout, sans réduction possible (WCAG 2.3.3) ; CPU mobile.
- Correctif : `<MotionConfig reducedMotion="user">` dans App.tsx, règle CSS globale, une seule frame dans AnimatedBackground si reduce.

**Démo concession : vidéo de fond autoplay/boucle (3,35 Mo) sans moyen de pause** — a11y-6
- Sévérité : moyenne · Effort : XS · `src/pages/Concession.tsx:195`
- Preuve : `<video autoPlay muted loop playsInline>` sans `controls`, aucun bouton pause, aucune règle reduced-motion dans style.css. Confirmé en prod.
- Impact : mouvement automatique > 5 s sans pause (WCAG 2.2.2 A) ; données mobiles.
- Correctif : bouton Pause/Lecture `aria-pressed`, pas d'autoplay si reduce, `poster` webp.

**Menu mobile : bouton sans aria-expanded/aria-controls, pas de piège de focus ni Échap, cible 40 px** — a11y-7
- Sévérité : moyenne · Effort : S · `src/components/Navigation.tsx:155`
- Preuve : :155-161 bouton `p-2` + icône 24 (40 px) sans `aria-expanded/controls` ; :167-168 panneau sans `role="dialog"`, `keydown Escape`, `useRef/focus()`. Confirmé en prod.
- Impact : ouverture non annoncée, focus derrière l'overlay, pas de sortie Échap (WCAG 4.1.2, 2.4.3, 2.1.2).
- Correctif : aria-expanded/controls, `role="dialog" aria-modal`, gestion Échap et focus ; ou réutiliser ui/sheet.tsx (Radix Dialog) ; `p-2.5`.

**FAQ : accordéon en `div onClick`, non utilisable au clavier, réponses fermées lues** — a11y-8
- Sévérité : moyenne · Effort : S · `src/components/FAQ.tsx:72`
- Preuve : :72-82 `<div className="cursor-pointer" onClick>` sans role/tabIndex/aria-expanded ; :84-86 `<h3>` sans bouton ; :93-97 `max-h-0 overflow-hidden` (reste dans l'arbre). ui/accordion.tsx (Radix) existe, utilisé seulement par ApporteursFAQ.
- Impact : 4 questions fermées inaccessibles au clavier (WCAG 2.1.1, 4.1.2).
- Correctif : utiliser Accordion de ui/accordion.tsx.

**Contrastes insuffisants (< 4,5:1) sur textes gris et placeholders du site principal** — a11y-9
- Sévérité : moyenne · Effort : XS · `src/components/QuoteForm.tsx:241`
- Preuve : placeholders `text-blue-200/20` sur `bg-slate-800/50` → 1,69:1 ; `text-blue-200/40` → 3,05:1 ; `text-gray-500` (Pricing.tsx:59, PricingCard.tsx:98/133, Portfolio.tsx:182) → 3,83-3,95:1 ; `text-slate-500` sur slate-950 (Footer) → 4,24:1.
- Impact : prix « à partir de », onglets tarifs, liens légaux, placeholders peu lisibles (WCAG 1.4.3).
- Correctif : `text-slate-400` (7,9:1), placeholders `/50` minimum, `/40` → `/60`.

**Démos : couleurs de marque or/rose-gold/orange sous 4,5:1 sur textes et boutons principaux** — a11y-10
- Sévérité : moyenne · Effort : S · `src/components/agence-immo/home/SearchBar.tsx:29`
- Preuve : `#D4AF37` sur blanc 2,10:1 ; `rose-gold-600` #be807b 3,20:1 (Navbar, Hero, « Confirmer le rendez-vous ») ; blanc sur `#e67e22` 2,85:1 (`.btn-primary`, `.filter-btn.active`).
- Impact : CTA des démos sous le seuil AA ; un prospect qui lance Lighthouse dessus voit la note chuter.
- Correctif : `rose-gold-800` #884f4d, `gold.dark` ≈ #8a6d1f, orange #b45309.

**Démos : boutons et liens icône sans nom accessible, toggle mobile en `div`, focus supprimé** — a11y-11
- Sévérité : moyenne · Effort : S · `src/components/agence-immo/layout/Header.tsx:64`
- Preuve : MENU en `hidden md:inline` (aucun nom mobile), recherche/cœur/fermeture sans label (:95-127) ; salon Navbar.tsx:62-67 sans aria-label ni focus ; restaurant Navbar.tsx:43-45 `<div onClick>` 28 px ; liens sociaux `href="#"` sans label (3 footers) ; ApporteursForm.tsx:202 `focus:outline-none`.
- Impact : boutons annoncés « bouton » ou « 0 », menu restaurant inaccessible au clavier (WCAG 4.1.2, 2.1.1, 2.4.7).
- Correctif : `aria-label`, `<button aria-expanded>`, `focus-visible:ring-2`.

**Skip link de l'accueil qui saute le H1, aucun `<main>` sur les pages du site principal** — a11y-12
- Sévérité : moyenne · Effort : S · `src/pages/Index.tsx:33`
- Preuve : skip link → `#services` (après le Hero/H1) ; `grep -c "<main"` → 0 sur 15 pages (Index, Team, 5 services, LocalCity, catalogue, 5 légales, NotFound) ; skip link seulement sur Index, Apporteurs, Links.
- Impact : pas de région principale sur 15 pages (WCAG 2.4.1, 1.3.1).
- Correctif : layout commun Navigation + `<main id="contenu">` + Footer, skip link → `#contenu`.

**« Nos Engagements » : descriptions visibles au survol uniquement, invisibles au clavier et incertaines sur mobile** — a11y-13 (aussi ux-17)
- Sévérité : moyenne · Effort : XS · `src/components/Methodology.tsx:108`
- Preuve : `opacity-0 group-hover:opacity-100` ; conteneur sans onClick/tabIndex/focus-within. Navigateur : 5 paragraphes à `opacity: 0` hors survol.
- Impact : 5 paragraphes d'argumentaire invisibles au clavier et probablement sur mobile (WCAG 1.4.13, 2.1.1).
- Correctif : `opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100`, `tabIndex={0}`.

**Modale légale Apporteurs : Dialog « maison » sans role=dialog, aria-modal, piège de focus ni Échap** — a11y-14
- Sévérité : moyenne · Effort : XS · `src/components/ui/dialog.tsx:88`
- Preuve : `<div className="fixed …" onClick={stopPropagation}>` sans role/aria/clavier ; « Close » en anglais (:98-105). @radix-ui/react-dialog déjà installé (ui/sheet.tsx:1).
- Impact : focus derrière l'overlay, modale non annoncée, pas de fermeture Échap (WCAG 2.4.3, 4.1.2, 2.1.2).
- Correctif : `npx shadcn@latest add dialog`, libellé « Fermer ».

**IDs `name`, `email`, `phone` dupliqués entre CallBooking et QuoteForm sur la même page** — a11y-15 (aussi ux-16)
- Sévérité : moyenne · Effort : XS · `src/components/CallBooking.tsx:454`
- Preuve : mêmes `id` dans CallBooking.tsx:454/470/486 et QuoteForm.tsx:236/247/259, tous deux rendus sur Index.tsx:63-68. L'auditeur UX ajoute : `isSlotAvailable` (:54-62) ne vérifie que l'index (60 min proposé à 11:30 malgré la pause 12:00-13:30) ; cellules calendrier 36 px.
- Impact : HTML invalide (WCAG 4.1.1), label du devis qui focalise le champ de réservation, `getElementById` non déterministe.
- Correctif : préfixer `booking-*` / `quote-*` et les `htmlFor`.

**Erreurs de formulaire uniquement par toast : aucun `aria-invalid`, `aria-describedby` ni message en ligne** — a11y-16 (aussi ux-15)
- Sévérité : moyenne · Effort : S · `src/components/QuoteForm.tsx:110`
- Preuve : validation → `toast({variant:"destructive"})` sans marquer le champ ni déplacer le focus ; `grep "aria-invalid|aria-describedby|aria-errormessage" src` → 0 (seul ApporteursForm.tsx:611 a un `role="alert"`). Point positif : toast Radix `role="status"` + `aria-live="assertive"`, persistant. UX : succès = toast + reset sans confirmation persistante.
- Impact : l'utilisateur ne sait pas quel champ corriger (WCAG 3.3.1, 3.3.3).
- Correctif : état d'erreur par champ, `aria-invalid` + `<p role="alert">` relié, `focus()` sur le premier champ invalide.

Constats bas :
- **a11y-17** (basse, S, `CallBooking.tsx:191`) — indicateur d'étapes en `role="navigation"` sans liens ni `aria-current`, radios sr-only sans focus visible, flèches calendrier 32 px. `<ol aria-label>` + `aria-current="step"` + zone `aria-live`, `has-[:focus-visible]:ring-2`, `h-11 w-11`.
- **a11y-18** (basse, XS, `Footer.tsx:107`) — hamburger 40 px, icônes sociales 40 px, liens villes ≈ 16 px de haut, liens légaux ≈ 20 px. `min-h-[44px] px-2`, `w-11 h-11`, `p-2.5`.
- **a11y-19** (basse, S, `Testimonials.tsx:126`) — carrousel `drag="x"` seul, sans boutons ni clavier ni scroll natif. `overflow-x-auto snap-x` + boutons Précédent/Suivant.
- **a11y-20** (basse, S, `agence-immo/shared/PropertyCard.tsx:35`) — `<button>` imbriqués dans `<Link>`. Carte en `<article>` + lien titre `after:absolute after:inset-0`, boutons sortis du lien.
- **a11y-21** (basse, XS, `Concession.tsx:202`) — textes anglais sans `lang="en"` (« DRIVEN BY PASSION », « Book a Table », aria-label « Previous/Next », sr-only « Close »), polices 8-11 px (Team.tsx:154, immo Header.tsx:102, Links.tsx:201). `lang`, traduire, minimum 12 px.
- **a11y-22** (basse, XS, `App.tsx:7`) — bandeau cookies en prod : `<a><button>En savoir plus</button></a>`, pas de rôle, `<h3>` hors hiérarchie ; composant absent de la copie de travail. `<Link>` stylé `buttonVariants`, `role="region"`, si conservé.

### 4.5 Performance

Lighthouse 12 mobile (Moto G, 4G lent) sur le site live, 26/09 : home **69** (FCP 3,0 s, LCP 5,1 s, TBT 180 ms, CLS 0, SI 5,3 s), /creation-site-web 81 (LCP 3,7 s), /agence-web-versailles 84 (LCP 3,5 s). Home : 52 requêtes, 22 scripts, 1 208 kB transférés, main thread 4,9 s, TTFB 20 ms. Le site affiche « Score Google PageSpeed 95+ sur tous nos projets » alors que sa home est à 69.

**Pré-rendu jeté à l'arrivée du JS : hero livré invisible (opacity 0, h1 tronqué) puis React efface tout — LCP 5,1 s** — perf-1
- Sévérité : haute · Effort : M · `src/main.tsx:5`
- Preuve : HTML servi : hero `<div style="opacity: 0; transform: translateY(30px)">`, 53 éléments `opacity: 0` sur la home (états framer-motion figés). `createRoot(...).render(<App />)` sans `hydrateRoot` (grep → 0) : React vide #root et affiche `PageLoader` (spinner) car `Index` est lazy (App.tsx:11). Lighthouse : Render Delay 4 500 ms sur `p.text-xl` ; build local sans pré-rendu : LCP 5,2 s.
- Impact : Core Web Vitals rouge ; page noire → spinner → hero qui refait son fade-in et son typewriter.
- Correctif : 1) import statique d'`Index`, supprimer le spinner plein écran ; 2) injecter `window.__PRERENDER__` et rendre les `motion.*` avec `initial={false}` / désactiver le typewriter pendant la capture ; 3) détecter `root.hasChildNodes()` et sauter les animations d'entrée ; à terme `hydrateRoot`.

**AnimatedBackground : boucle requestAnimationFrame jamais annulée (fuite à chaque navigation), calcul O(n²), sans prefers-reduced-motion** — perf-2
- Sévérité : haute · Effort : S · `src/components/AnimatedBackground.tsx:133`
- Preuve : `requestAnimationFrame(animate)` relancé sans condition, cleanup (:138-141) sans `cancelAnimationFrame` ; monté sur 16 pages. `particles.slice(i + 1).forEach` : 50 allocations + 1 225 distances par frame. Lighthouse : 1er poste du bootup (2 315 ms). Aggravant : `body::after` plein écran en `mix-blend-mode: overlay` (index.css:197-208) + backdrop-blur.
- Impact : CPU/batterie en continu, TBT/INP dégradés, charge cumulée à chaque navigation interne.
- Correctif : stocker l'id rAF et l'annuler, rien si reduce, pause sur `visibilitychange`, boucle indexée, 30 fps mobile, retirer le `body::after`.

**fonts.css figé en `media="all"` par le pré-rendu : feuille bloquante sur toutes les pages** — perf-3
- Sévérité : moyenne · Effort : XS · `index.html:50`
- Preuve : `media="print" onload="this.media='all'"` exécuté par Puppeteer avant capture → HTML servi `media="all"`. Lighthouse : render-blocking 830 ms estimés. Fichier de 1,5 kB.
- Impact : FCP retardé d'un RTT sur 25 pages.
- Correctif : inliner les 7 `@font-face` dans le `<style>` critique, garder les deux preload.

**favicon.ico de 142 kB (PNG 512×512) téléchargé à chaque première visite, jamais mis en cache ; manifest qui déclare un 48×48** — perf-4 (aussi live-7)
- Sévérité : moyenne · Effort : XS · `public/favicon.ico`
- Preuve : 512×512 PNG, 145 210 octets, 3e ressource la plus lourde ; `Cache-Control: max-age=0, must-revalidate` (aucune règle .ico). index.html:57 `shortcut icon` alors que les PNG 32/192/512 existent. favicon.png = 48×48.
- Impact : 12 % du poids de la home à chaque première visite ; icônes PWA invalides.
- Correctif : supprimer la ligne 57 ou regénérer un .ico 16/32/48 (~5 kB), règle cache `.ico`, manifest → favicon-192/512.

**Chunking circulaire : React empaqueté dans « ui-vendor », « react-vendor » l'importe** — perf-5 (aussi archi-14, devops-19)
- Sévérité : moyenne · Effort : S · `vite.config.ts:82`
- Preuve : build.log « Circular chunk: react-vendor -> ui-vendor -> react-vendor » ; react-vendor commence par `import{r as P,…}from"./ui-vendor-*.js"` ; `manualChunks` en forme objet. 185 + 182 kB, tous deux `modulepreload` partout.
- Impact : découpage sans effet, graphe fragile (TDZ), framer-motion non isolable.
- Correctif : `manualChunks` en fonction (react/react-dom/scheduler → `react`, framer-motion → `motion`).

**framer-motion complet (177 kB / 58 kB gz) sur 100 % des pages, pages légales comprises** — perf-7
- Sévérité : moyenne · Effort : M · `src/components/Hero.tsx:3`
- Preuve : 47 fichiers importent framer-motion dont CGV, LegalNotice, PrivacyPolicy, CookiePolicy ; ui-vendor importé par index-*.js ; seuls Portfolio, Testimonials, MagneticButton ont besoin du moteur complet.
- Impact : ≈ 55 kB gz avant interactivité sur des pages de texte.
- Correctif : `LazyMotion features={domAnimation} strict` + `m.` ; `domMax` en lazy pour Portfolio/Testimonials ; ou CSS + IntersectionObserver.

**Le « lazy loading » des sections de la home ne diffère rien : 8 Suspense montés d'un coup et 23 modulepreload figés** — perf-8
- Sévérité : moyenne · Effort : S · `src/pages/Index.tsx:51`
- Preuve : 8 sections lazy montées immédiatement ; 23 `<link rel="modulepreload">` capturés dans le HTML (CallBooking 73 kB avec react-day-picker + date-fns/locale/fr). Lighthouse : 22 scripts, 219 kB JS au chargement.
- Impact : le JS du pied de page concurrence le rendu du hero ; le commentaire de Index.tsx:9 est faux.
- Correctif : `LazySection` (IntersectionObserver, rootMargin 200 px) ; retirer les modulepreload runtime en post-traitement du prérendu.

**/identite-visuelle : 4 logos 1025×1025 = 1,2 Mo pour ~270 px affichés, sans lazy** — perf-9
- Sévérité : moyenne · Effort : XS · `src/pages/VisualIdentity.tsx:165`
- Preuve : AETHELRED 409 kB, « Océan & Terre » 390 kB, LUMINA 235 kB, « Aura creative » 173 kB ; `<img>` sans `loading` ; resize 600×600 q75 → 253 kB (−79 %). `.tmp` de 210 Ko servi.
- Impact : 1,2 Mo sur une page service mobile.
- Correctif : 600×600 q75, noms ASCII, `loading="lazy" width height`, supprimer le .tmp (voir archi-9).

**Captures salon / restaurant / agence-immo surdimensionnées sur la home et le catalogue** — perf-10
- Sévérité : moyenne · Effort : XS · `public/restaurant/screenshot.webp`
- Preuve : 1280×800 (82 / 77 kB) et 2560×919 (226 kB) contre 800×500 / 20 kB pour les captures clients ; cartes ≈ 400 px. Lighthouse : 60 + 57 kB gaspillés.
- Impact : ≈ 80 kB de trop sur la home, ≈ 250 kB sur /catalogue.
- Correctif : 800×500 via scripts/convert-portfolio-screenshots.mjs, committer.

**Vidéo hero de la démo concession : 3,35 Mo en autoplay, sans poster ni preload, mobile compris** — perf-11
- Sévérité : moyenne · Effort : S · `src/pages/Concession.tsx:195`
- Preuve : 3 432 375 octets, 1280×720, 17,9 s, ≈ 1 534 kbps, aucun `poster`, `preload`, WebM ni condition mobile. 1er fichier du site.
- Impact : 2,8× le poids total de la home pour un clic sur « Héritage Auto ».
- Correctif : ré-encoder (`-crf 30`, boucle 8-10 s, variante 960 px) < 1 Mo, `poster` + `preload="metadata"`, ne pas monter sur mobile / reduce / saveData.

**@import Google Fonts en tête du CSS (src/index.css:1 et démo restaurant), bloqué par la CSP** — perf-13 (corrigé dans la PR)
- Sévérité : moyenne · Effort : XS · `src/index.css:1`, `src/styles/restaurant/index.css:1`
- Preuve : `/assets/index-BxiYkHTL.css` live commence par `@import "https://fonts.googleapis.com/css2?family=Playfair+Display…"`  ; il vient de src/index.css:1 à c430dff (retiré par le commit 365cf18 sur la branche, d'où son absence du build local). Lighthouse : requête fonts.googleapis.com bloquée + erreur console CSP. Last-Modified 09/09 vs dernier commit 16/05.
- Impact : requête tierce + erreur CSP à chaque page  ; le live correspond bien à c430dff (devops-16), il n'y a pas de dérive de build.
- Correctif : déployer la branche audit/2026-09-26 (relancer le workflow depuis main reproduirait l'@import) et vérifier au curl l'absence d'`@import`.

**Cache-Control immutable 1 an sur tous les fichiers non hashés de public/ et même sur les 404** — live-6 (aussi perf-12)
- Sévérité : moyenne · Effort : XS · `vercel.json:45`
- Preuve : règles `/(.*).webp|.js|.css|.mp4|.png` → `max-age=31536000, immutable`. `/AETHELRED.webp`, `/og-image.png` → immutable ; `/xyz.png` → 404 avec immutable. Contournement déjà dans le code : `arno-polynice.webp?v=3`.
- Impact : remplacer une image sous le même nom laisse l'ancienne 1 an ; un 404 mis en cache masque l'ajout du fichier.
- Correctif : immutable seulement sur `/assets/(.*)` et `/fonts/(.*)` ; `max-age=86400, stale-while-revalidate=604800` pour le reste.

Constats bas et info :
- **perf-14** (basse, XS, `public/fonts/fonts.css`) — graisse 500 absente (77 `font-medium` rendus en 400), 900 du h1 non préchargée. Ajouter inter-500 ou passer en `font-semibold` ; précharger 900 ou h1 en `font-bold`.
- **perf-15** (basse, XS, `index.html:385`) — trois couleurs de fond (#020817 critique, #0f172a / #0a0f1e index.css, #000→#020617 canvas). Aligner sur #0a0f1e.
- **perf-16** (basse, XS, `Methodology.tsx:80`) — 17 `<img>` sur 22 sans `loading="lazy"` (5 engagements 174 kB sur la home), 0 sur 10 dans les démos (restaurant ≈ 1,35 Mo). `loading="lazy" decoding="async"`, images ≤ 800 px.
- **perf-17** (basse, XS, `projects.ts:97`) — carte CTA home + 4 biens immo hotlinkés sur images.unsplash.com (67 kB, preconnect 310 ms). Télécharger en 800×500 WebP.
- **perf-18** (basse, S, `Navigation.tsx:100`) — @radix-ui/react-navigation-menu (6 kB gz + ResizeObserver) pour un seul dropdown ; c'est le contenu réel du chunk « Footer 31 kB ». `<ul>` maison ou garder si l'a11y clavier prime.
- **perf-21** (info, S, `tailwind.config.ts`) — CSS unique 119 kB (18 kB gz) avec palettes démos et tokens `--sidebar`/`--chart` inutilisés ; 11 kB gz inutilisés. Supprimer les tokens, scoper les palettes démos.

### 4.6 UX / Contenu

**« Commander maintenant » ne mène nulle part sur les 5 pages services** — ux-1
- Sévérité : critique · Effort : S · `src/components/PricingCard.tsx:20`
- Preuve : :20-23 `navigate({ hash: '#devis', search })` sans `pathname` → reste sur la page courante ; aucun `id="devis"` hors QuoteForm (home). WebsiteCreation.tsx:227 sans `categoryId` (erreur tsc). Test live : clic → URL `/creation-site-web?category=undefined&plan=Essential#devis`, `getElementById('devis') = null`. Idem Automation, WebApps, MobileApps, VisualIdentity.
- Impact : 3 boutons × 5 pages morts sur les pages les mieux référencées.
- Correctif : `navigate({ pathname: '/', hash: '#devis', search })` + scroll une fois le formulaire monté (ux-6), ou QuoteForm en bas de chaque page service ; `categoryId='sites'` dans WebsiteCreation.tsx:227.

**Trois grilles de prix contradictoires sur les mêmes pages (FAQ visible vs cartes vs JSON-LD)** — ux-4 (aussi rgpd-13)
- Sévérité : haute · Effort : S · `src/pages/Automation.tsx:279`
- Preuve : Automation FAQ visible « Audit 490€ … complète 1490€ » vs cartes 390 / 450 / 1 200 € et FAQ JSON-LD ; WebApps.tsx:271 « 2990€ … 5990€ » vs « Dès 5 000 / 7 500 / 12 000€ » ; index.html:365 maintenance « 50€/80€/mois » vs 25€/60€ ; ApporteursFAQ.tsx:16/29 « site à 1 990 € HT », « maintenance 39 €/mois » inexistants ; simulateur « tarifs réels » avec 1200/1990/3500 et 8€/mois. Confirmé en prod.
- Impact : deux prix à 30 cm d'écart ; JSON-LD ≠ visible ; détruit « tarifs transparents ».
- Correctif : supprimer les FAQ codées en dur (Automation.tsx:273-306, WebApps.tsx:265-298), rendre FAQ_AUTOMATION / FAQ_WEBAPPS, montants depuis pricingData, corriger index.html:365 et les exemples apporteurs.

**Menu « Tarifs / Réserver / Contact » inopérant depuis toute page hors accueil** — ux-5
- Sévérité : haute · Effort : S · `src/components/Navigation.tsx:29`
- Preuve : hors accueil `navigate('/', { state: { scrollTo: id } })` ; aucun consommateur de `location.state.scrollTo` (seule occurrence : Navigation.tsx:31). Live depuis /equipe : clic « Tarifs » → `/`, scrollY 0, #tarifs à 5 020 px.
- Impact : 3 entrées du menu (desktop et mobile) inopérantes sur 20+ pages.
- Correctif : `<Link to="/#tarifs">` etc., gestion du hash dans Index (ux-6), supprimer le state.

**Scroll d'ancre déclenché avant le chargement des sections lazy** — ux-6
- Sévérité : haute · Effort : S · `src/components/Navigation.tsx:39`
- Preuve : setTimeout 100 ms puis scrollIntoView ; Testimonials, Portfolio, Pricing, CallBooking, QuoteForm en lazy. Live depuis /automatisation, « Réserver mon audit offert » → `/#reservation`, scrollY 3 410 mais `#reservation` à +2 873 px. Concerne 5 pages services, 6 villes, /links, /equipe.
- Impact : le parcours « page service → réserver » échoue silencieusement.
- Correctif : effet dans Index qui réessaie tant que la cible n'existe pas (rAF / MutationObserver, 3 s) ; ou eager si hash ; ou hauteurs min réalistes sur SectionLoader.

**L'e-commerce, seule expertise prouvée par le portfolio, n'est ni un service navigable ni une option du formulaire** — ux-7
- Sévérité : haute · Effort : M · `src/data/projects.ts:13`
- Preuve : les 3 réalisations réelles sont « E-commerce » (curl 200) ; pricingData.ts:197-254 a une catégorie ecommerce ; mais aucune route, absent du menu, de Services.tsx, du Hero ; QuoteForm mappe ecommerce → 'website'.
- Impact : le seul savoir-faire démontrable n'a ni page ni entrée de menu.
- Correctif : créer /e-commerce (gabarit WebsiteCreation), menu, Services.tsx, sitemap, service 'ecommerce' dans QuoteForm et VALID_SERVICES.

**Liens du footer en ancres #services/#portfolio/#contact morts sur les pages internes, et « Consulting » n'existe pas** — ux-9
- Sévérité : haute · Effort : XS · `src/components/Footer.tsx:52`
- Preuve : 4 liens services tous en `href="#services"`, `#portfolio`, `#contact` ; ces ids n'existent que sur l'accueil. « Consulting » : aucune autre occurrence hors démos.
- Impact : 6 liens du footer sans effet sur ~15 pages ; un service fantôme.
- Correctif : `<Link>` vers les vraies routes, retirer « Consulting ».

**/links : promo expirée et « Audit gratuit » en collision avec l'audit payant 390 €** — ux-10
- Sévérité : haute · Effort : XS · `src/pages/Links.tsx:41`
- Preuve : « Offre lancement -30% jusqu'au 15 sept » toujours en prod le 26/09 ; aucune remise ailleurs. :36 « Audit gratuit · 15 min » vs « Audit Approfondi 390€ » (pricingData.ts:85-86) et « Réserver mon audit offert » (Automation.tsx:320) sur la page qui vend l'audit à 390 €. CallBooking nomme le créneau « Appel découverte rapide ».
- Impact : offre périmée sur la page bio Instagram (80 % du trafic mobile selon Links.tsx:11) ; « audit » désigne un produit gratuit et un produit payant.
- Correctif : retirer le bandeau (ou le dater) ; « Appel découverte 15 min » partout, « audit » réservé au payant (Links.tsx:36, Automation.tsx:320, LocalCity.tsx:160/265).

**Chiffres et références d'expérience invérifiables pour une agence de 9 mois** — ux-11
- Sévérité : haute · Effort : S · `src/pages/Automation.tsx:25`
- Preuve : agence créée le 22/12/2025 (Team.tsx:128), 3 réalisations toutes e-commerce ; pourtant « Sur la base de nos missions » (Automation.tsx:25), « 30 à 40 % de nos missions » (WebApps.tsx:29), « 3 à 4 fois plus efficaces », « 30 à 50 % moins chers » (LocalCity.tsx:88), « design primé » (Portfolio.tsx:159, aucun prix), « PageSpeed 95+ sur tous nos projets ».
- Impact : allégations chiffrées sans base, démenties par la date de création visible.
- Correctif : supprimer statistiques et comparatifs, remplacer « primé » par un fait, scores Lighthouse réels des 3 sites livrés, FAQ au conditionnel.

**Quatre démos fictives présentées comme des « Réalisations », avec des fonctionnalités inexistantes** — ux-12
- Sévérité : haute · Effort : S · `src/data/projects.ts:44`
- Preuve : 4 démos en category 'Site Vitrine' comme les clients réels, sous « Nos Réalisations », compteur « 7 Projets », ItemList JSON-LD les inclut. :58 « réservation de table en temps réel » alors que restaurant/Reservation.tsx:23 fait `alert('… (Simulation)')`.
- Impact : un prospect croit à 7 clients ; « temps réel » est faux.
- Correctif : `isDemo: true`, badge « Démo », compteur « 3 réalisations · 4 démos », exclure de l'ItemList, corriger la description.

**Délais, support et capital social : cinq versions contradictoires** — ux-13
- Sévérité : haute · Effort : S · `src/components/Methodology.tsx:27`
- Preuve : support « 48 h, 7j/7 » vs « 24h, 7j/7 » ; délai site « 10 jours » vs « 2 à 4 semaines » vs « 2 et 8 semaines » (index.html:350) ; réponse devis « 24 h » vs « 24-48h » ; capital « 1 000 € » (WebsiteCreation.tsx:25, JSON-LD) vs « 500,00 € » (LegalNotice, CGV).
- Impact : engagements incohérents ; capital erroné dans une donnée structurée publique.
- Correctif : `src/data/company.ts` (capital, délais, SLA) utilisé partout ; WebsiteCreation.tsx:25 → 500 €.

**Démo agence immobilière : 5 liens de navigation vers des routes qui n'existent pas** — live-2
- Sévérité : haute · Effort : S · `src/components/agence-immo/layout/Header.tsx:104`
- Preuve : `/agence-immo`, `/agence-immo/login`, `/agence-immo/properties`, `?type=buy/rent`, `/properties` → tous 200 avec le HTML de la home (soft-404) ; App.tsx ne déclare que `/agence-immobiliere` et `/agence-immo/property/:id` ; les 4 fiches ne sont pas pré-rendues.
- Impact : logo, « L'Agence », « Nos Biens », « Espace client » → 404 React sur une démo commerciale ; 6 liens vers des soft-404 sur une page indexée.
- Correctif : logo et « L'Agence » → /agence-immobiliere, biens → `#biens`, retirer « Espace client » ; pré-rendre les 4 fiches ou rewrite ciblée.

**Le client ignore le code d'erreur serveur : 400/413/429/502/503 affichent tous « Une erreur est survenue »** — api-3
- Sévérité : haute · Effort : S · `src/components/QuoteForm.tsx:150`
- Preuve : `if (!res.ok) throw new Error(`HTTP ${res.status}`)` → toast générique (QuoteForm :172-176, CallBooking :123-127). Le serveur envoie pourtant « Trop de demandes. Réessayez plus tard. » + `Retry-After`. Téléphone non validé côté client : « 06 12 34 56 78 (perso) » rejeté par le serveur.
- Impact : le prospect réessaie à l'identique, consomme ses 3 tentatives, finit en 429 avec le même message.
- Correctif : lire le body, mapper 429 / 400 `Invalid phone` / 413-502-503 ; `maxLength`/`pattern` ; `code` stable côté serveur.

**Libellé « Commander maintenant » trompeur et 8e feature silencieusement coupée** — ux-18
- Sévérité : moyenne · Effort : XS · `src/components/PricingCard.tsx:126`
- Preuve : bouton « Commander » → pré-remplit un devis, aucun paiement ; `features.slice(0, 7)` alors que « 3 Automatisations » a 8 features (« Support & Monitoring 1 mois » jamais affiché) ; `truncate` / `line-clamp-2`.
- Impact : attente d'achat non tenue ; prestation vendue invisible.
- Correctif : « Demander un devis pour ce pack », retirer le slice.

**Marque : « Ned » surgit sans explication dans le tunnel apporteurs, « Nexus » seul au footer, email Gmail partout** — ux-19 (aussi seo-15)
- Sévérité : moyenne · Effort : S · `src/components/apporteurs/ApporteursHero.tsx:112`
- Preuve : « Programme officiel Ned », « concurrentes de Ned » (5 occurrences) vs ~100 « Nexus Développement » ; Footer « Nexus » seul ; SEO.tsx:34 suffixe `| Nexus Développement` sauf si le title contient « Nexus » → MobileApps finit par `| Nexus` ; LegalNotice « NEXUS DEVELOPPEMENT (NED) » sans définir le sigle ; Gmail sur chaque page.
- Impact : un candidat apporteur ne sait pas qui est « Ned » ; Gmail décrédibilise.
- Correctif : trancher (tout « Nexus Développement » ou « Ned (Nexus Développement) » une fois par page) ; contact@nexusdeveloppement.fr via une constante unique.

**Tutoiement, « je » singulier, coquille et emojis dans titres et meta** — ux-20
- Sévérité : moyenne · Effort : XS · `src/pages/Automation.tsx:224`
- Preuve : « Commence par un audit, ou passe directement à l'action » ; pricingData.ts:88 « J'analyse vos processus » ; Automation.tsx:258 « in vestissement » ; emojis dans h3 (Automation, WebApps), meta description, toasts, onglets ; « Absolument ! » ×3.
- Impact : rupture de ton, coquille visible, meta avec emojis, style « généré ».
- Correctif : nous/vous, corriger la coquille, icônes Lucide à la place des emojis, retirer les « Absolument ! ».

**Les FAQ promettent des prestations absentes des cartes tarifaires** — ux-21
- Sévérité : moyenne · Effort : S · `src/pages/LocalCity.tsx:84`
- Preuve : « fiche Google Business Profile incluse dans Business et Premium », « Search Console + Bing Webmaster », « audit concurrentiel, plan de contenu 3 à 6 mois », « café offert », « enregistrement des visios » : rien dans pricingData.ts:47-72.
- Impact : ce que dit la FAQ (et le FAQPage JSON-LD) devient exigible au devis.
- Correctif : ajouter aux features ou retirer des FAQ.

**ApporteursForm affiche tel quel le message serveur, en anglais ; textarea sans plafond** — api-5
- Sévérité : moyenne · Effort : S · `src/components/apporteurs/ApporteursForm.tsx:141`
- Preuve : `throw new Error(body.error || …)` → « Spam detected », « Invalid reason », « Email service unavailable » affichés ; textarea sans `maxLength` alors que le serveur coupe à 5 000 → 400.
- Impact : « Invalid reason » sans savoir quoi corriger ; un faux positif honeypot affiche « Spam detected ».
- Correctif : table erreur → message FR, `maxLength={5000}` + compteur, message neutre pour le honeypot.

**Double réservation indétectable, mais l'UI et l'email annoncent « confirmé »** — api-7
- Sévérité : moyenne · Effort : S · `src/components/CallBooking.tsx:111`
- Preuve : commentaire :37-39 « double-réservation assumée » mais toast « Réservation confirmée ! », bouton « Confirmer », email « ✅ Votre appel est confirmé ! » ; aucun .ics.
- Impact : deux prospects sur le même créneau, chacun confirmé.
- Correctif : « Demande de créneau reçue — confirmation sous 24 h », .ics dans l'email admin ; moyen terme Google Calendar freebusy ou Cal.com.

Constats bas et info :
- **ux-23** (basse, XS, `Contact.tsx:23`) — section Contact sans adresse ni horaires (présents seulement dans le JSON-LD) ; CTA devis des villes → `/#contact` au lieu de `/#devis`. Ajouter adresse/horaires/Maps ; LocalCity.tsx:161 → `/#devis`.
- **ux-24** (basse, S, `WebsiteCreation.tsx:313`) — pas d'espaces insécables avant : ? !, apostrophes droites, « Elancourt » sans accent (ApporteursLegalModal.tsx:44). Espace fine insécable, apostrophe typographique, Élancourt.

### 4.7 Qualité de code

**Échec de l'email admin avalé : 200 « success » dès qu'un seul des deux emails part, aucun log** — api-1
- Sévérité : haute · Effort : S · `api/send-quote.ts:222`
- Preuve : `Promise.allSettled` puis 502 seulement si `!adminOk && !clientOk` (:219-227), sinon 200 ; idem book-call.ts:196-204, apporteurs :325-333. Commentaire :194 « on log » mais `grep -rn "console\." api` → 0 ; le corps Resend n'est jamais lu.
- Impact : si Resend refuse l'email admin (422, clé révoquée, suppression) mais accepte le client, le prospect reçoit « Demande reçue » et l'agence rien, sans trace. Lead perdu invisible.
- Correctif : email admin = critère de succès (`if (!adminOk) { console.error(…) ; return 502 }`), client best-effort, `console.log` structuré par envoi.

**public/assets/ : 22 doublons byte-identiques de src/assets, jamais référencés, dont 8 portraits fictifs servis en prod** — archi-1 (aussi perf-20, ux-25)
- Sévérité : moyenne · Effort : S · `public/assets`
- Preuve : `cmp` → 22 × identiques, 1 404 Ko ; `grep -rnE "[\"'(]/assets/" src/ api/ index.html` → 0 : le code n'utilise que les imports Vite hashés. Seul sitemap-images.xml cite 8 fichiers. `curl -I /assets/chloe_durand.webp` → 200. Côté src/assets, 10 fichiers non importés (logo.webp, bodystart-project, 8 portraits). Aussi : concession-home.webp vs -optimized, AETHELRED.webp.tmp, src/App.css.
- Impact : 1,4 Mo dupliqués par build, fausse équipe exposée, deux emplacements pour la même image.
- Correctif : supprimer public/assets/ et les 10 non importés de src/assets ; pour les 8 URLs du sitemap images, retirer (theo_gautier dans tous les cas) ou déplacer en public/images/ avec nom stable.

**Le CSS global de la démo restaurant écrase le `.container` Tailwind du site après visite de /restaurant** — archi-2
- Sévérité : moyenne · Effort : S · `src/styles/restaurant/index.css:60`
- Preuve : lignes 2-18 `:root`, 60-64 `.container { max-width: var(--spacing-container); padding: 0 20px }`, `.section-title`, `.btn-*` sans préfixe `.restaurant-page` ; App.css = template Vite. dist/Restaurant-*.css contient `.container{…}` après index-*.css (1400 px / 2rem). `container mx-auto` dans 15+ composants. Concession est correctement scopé.
- Impact : CSS de chunk lazy jamais retiré en SPA : après /restaurant, tous les containers du site passent à 1200 px / 20 px.
- Correctif : préfixer toutes les règles par `.restaurant-page`, variables dans `.restaurant-page {}`, supprimer App.css et son import (Restaurant.tsx:12).

**ErrorBoundary.tsx existe mais n'est branché nulle part** — archi-3
- Sévérité : moyenne · Effort : S · `src/App.tsx:48`
- Preuve : `grep -rn ErrorBoundary src/` → uniquement la définition (69 lignes, fallback FR). App.tsx : `QueryClientProvider > TooltipProvider > BrowserRouter > Suspense > Routes`, 22 pages + 8 sections lazy.
- Impact : exception de rendu ou `import()` échoué (onglet ouvert avant un déploiement) = page blanche sans bouton.
- Correctif : `<ErrorBoundary><Suspense>…</Suspense></ErrorBoundary>` ; reload unique sur « Failed to fetch dynamically imported module » (garde sessionStorage).

**8 dépendances runtime inutilisées ou à vide, dont 3 dans le JS initial (react-query, sonner, next-themes)** — archi-4 (aussi perf-6)
- Sévérité : moyenne · Effort : S · `package.json:27`
- Preuve : `useQuery|useMutation` → 0 mais QueryClientProvider monté et react-query forcé dans react-vendor ; Sonner monté mais tous les `toast()` viennent de use-toast (Radix) ; `useTheme()` sans ThemeProvider ; @radix-ui/react-select et react-tooltip non importés (réimplémentations maison) ; react-dialog importé seulement par sheet.tsx (0 importeur) ; separator, toggle idem.
- Impact : deux systèmes de toast montés, JS initial alourdi, 8 paquets à auditer pour rien.
- Correctif : retirer QueryClientProvider et Sonner d'App.tsx, supprimer sonner/sheet/separator/toggle.tsx, `npm uninstall` les 8, retirer react-query des manualChunks ; remplacer tooltip.tsx maison par Radix si l'a11y compte.

**Fichiers source morts depuis le commit initial masqués par no-unused-vars désactivé** — archi-5
- Sévérité : moyenne · Effort : S · `src/components/NavLink.tsx:1`
- Preuve : 0 importeur pour App.css, NavLink.tsx, ErrorBoundary.tsx, hooks/use-mobile.tsx, ui/use-toast.ts, ui/sheet|separator|skeleton|toggle.tsx, assets/restaurant/react.svg, assets/logo.webp. eslint.config.js:23 `no-unused-vars: off`, tsconfig `noUnusedLocals: false`.
- Impact : ~12 fichiers qui polluent recherches et revues ; lecture trompeuse (on croit un ErrorBoundary en place).
- Correctif : supprimer les 11 (garder et brancher ErrorBoundary), ajouter `knip` en CI, réactiver `no-unused-vars` avec `^_`.

**scripts/ : 11 scripts d'images one-shot périmés sur 12, deux plantent, doublons CJS/ESM, chemin absolu de la machine d'Adam** — archi-6 (aussi devops-6)
- Sévérité : moyenne · Effort : S · `scripts/convert-portfolio-screenshots.mjs:29`
- Preuve : seul copy-public.mjs est référencé ; les autres ciblent des PNG/JPG qui n'existent plus ; convert-screenshots.js et convert-images.js → `ReferenceError: require is not defined` (`"type": "module"`) ; `SOURCE_DIR = "C:/Users/Adam/Desktop/Ned_web/src/assets"` ; sharp = 20,1 Mo installés à chaque `npm ci`.
- Impact : 11 scripts contradictoires dont 2 cassés ; 20 Mo de dépendance native en CI pour rien.
- Correctif : supprimer les 11 ; un seul `scripts/img.mjs <src> <dst> [--width]` documenté, sinon `npm uninstall sharp`.

**README, GUIDE_DEPLOIEMENT et commentaires décrivent une architecture qui n'existe plus** — archi-7 (aussi devops-4)
- Sévérité : moyenne · Effort : S · `README.md:41`
- Preuve : « Deux Edge Functions » (3 réelles) ; :83 renvoie à `AUDIT_COMPLET_2026-04-29.md` (inexistant, jamais versionné) ; :87 « Push sur main → Vercel déploie » (désactivé dans vercel.json, c'est Actions) ; :10 « CDG1 » (prod en iad1). GUIDE_DEPLOIEMENT : Supabase, chatbot, `OPENAI_API_KEY` (0 occurrence dans le code). Compteurs de pages 17 / 23 / 25 selon les fichiers ; « 6-8 minutes » vs 1 min 17 s réel.
- Impact : un dev qui suit le README déploie mal et cherche des fichiers inexistants.
- Correctif : réécrire README (3 fonctions, pipeline Actions + `PRERENDER=true` + `--prebuilt`, scripts), supprimer ou archiver GUIDE_DEPLOIEMENT, remplacer les nombres en dur par « voir ROUTES_TO_PRERENDER ».

**api/ n'est couvert par aucun tsconfig : `npm run typecheck` ne compile jamais le code serveur** — archi-8 (aussi api-14)
- Sévérité : moyenne · Effort : S · `tsconfig.app.json:29`
- Preuve : `include: ["src"]` / `["vite.config.ts"]`, `files: []` ; aucun api/tsconfig. ESLint linte api/ avec `globals.browser`. `npx tsc --noEmit --strict … api/*.ts` → exit 0 aujourd'hui.
- Impact : les 4 fichiers qui manipulent la clé Resend et la validation ne sont typés qu'au build Vercel.
- Correctif : `tsconfig.api.json` (lib ES2022 + WebWorker, strict), référence + script typecheck, bloc ESLint `api/**` avec `globals.serviceworker`.

**Fichiers parasites dans public/ livrés en production : .tmp de 210 Ko, noms avec espaces/accents, doublons, reliquats de templates** — archi-9 (aussi devops-9, live-9, live-15)
- Sévérité : moyenne · Effort : S · `public/AETHELRED.webp.tmp`
- Preuve : `.tmp` versionné (commit 0c216e2), servi en 200 `application/octet-stream` ; « Aura creative.webp », « Océan & Terre.webp » référencés bruts (VisualIdentity.tsx:155-158), `&` non échappé dans le HTML pré-rendu, `/aura%20creative.webp` (casse) → 404 ; placeholder.svg, 3 vite.svg, email-logo.webp non référencés mais servis ; security.txt doublon ; concession-home vs -optimized ; `_headers` servi.
- Impact : un `.tmp` téléchargeable sur le site d'une agence web, URLs non portables, ~230 Ko inutiles par build.
- Correctif : `git rm` des parasites, renommer en ASCII (`aura-creative.webp`, `ocean-et-terre.webp`…) dans public/branding/, mettre à jour VisualIdentity.tsx, `*.tmp` dans .gitignore.

**book-call : le serveur n'exclut ni week-ends, ni jours fériés, ni créneaux passés, ni dépassement de 18 h ; l'UI propose 60 min à 11 h 30** — api-6
- Sévérité : moyenne · Effort : S · `api/book-call.ts:41`
- Preuve : seul test `target < today || target > sixMonths` ; durée et créneau non croisés (17:30 + 60 min accepté) ; week-end filtré côté client seulement ; `férié|holiday` → 0. Client : `isSlotAvailable` ignore la pause 12:00-13:30. Aucune mention de fuseau.
- Impact : rendez-vous « confirmés » un samedi, un 1er mai, ou sur un créneau non tenu.
- Correctif : refuser jours 0/6, liste fériés FR, contiguïté et fin ≤ 18:00, heure Paris courante ; contiguïté côté client ; afficher « heure de Paris ».

**Sujets des emails admin construits avec le nom échappé HTML (« O&#039;Brien &amp; Fils »)** — api-8 (aussi securite-9)
- Sévérité : moyenne · Effort : XS · `api/send-quote.ts:203`
- Preuve : `subject: … ${safeName}` avec `safeName = escapeHtml(...)` (send-quote :203, book-call :180 et :190) ; apporteurs utilise le brut. `safeString` ne rejette ni `\r` ni `\n`.
- Impact : tout prospect avec apostrophe ou « & » génère un sujet illisible.
- Correctif : `data.name.replace(/[\r\n]+/g, " ")` dans les sujets.

**Budget et délai affichés en codes techniques dans les emails (« 1month », « <500 »)** — api-9
- Sévérité : moyenne · Effort : XS · `api/send-quote.ts:166`
- Preuve : `safeBudget`/`safeTimeline` injectés tels quels (:165-166, :184-185) ; `SERVICE_LABELS` existe mais pas d'équivalent budget/délai.
- Impact : « Délai : 2-3months » dans le récapitulatif envoyé au prospect.
- Correctif : `BUDGET_LABELS` et `TIMELINE_LABELS`.

Constats bas et info :
- **archi-11** (basse, XS, `package.json:8`, aussi devops-7) — `copy-public.mjs` recopie public/ alors que Vite le fait (`copyPublicDir: true`). `"build": "vite build"`, supprimer le script.
- **archi-12** (basse, XS, `tailwind.config.ts:123`) — @tailwindcss/typography installé mais non enregistré : `prose prose-invert prose-lg` sur 5 pages ne génèrent rien (`.prose` → 0 dans dist). Retirer les classes + désinstaller, ou enregistrer le plugin.
- **archi-15** (basse, XS, `agence-immo/layout/ScrollToTop.tsx:1`) — deux ScrollToTop quasi identiques, montés en double sur les pages immo. Supprimer la copie immo.
- **archi-16** (basse, M, `tailwind.config.ts:62`) — 4 démos, 3 stratégies CSS (modules, global préfixé, Tailwind global), tokens salon/immo dans le thème global, ~6,3 Mo d'assets démo. Préfixer les tokens ou wrappers `.salon-page`/`.immo-page` ; décider si les démos restent dans ce repo.
- **archi-17** (basse, XS, `src/main.tsx:12`) — fin de pré-rendu = timer fixe 2 s ; un runner lent produit des pages avec spinner sans échec de build. `<PrerenderReady />` réel + timer filet 8-10 s + `grep -L "<h1" dist/**/index.html` en CI.
- **archi-18** (basse, XS, `public/manifest.webmanifest:14`, aussi seo-13, live-16) — manifest déclare favicon.png (48×48) en 192/512 alors que les bons fichiers existent. Pointer vers favicon-192/512.
- **live-13** (basse, XS, `api/send-quote.ts:80`) — un 500 FUNCTION_INVOCATION_FAILED au premier appel (id `cdg1::xkcnv-1790459170652-549d6c251da4`), non reproduit ensuite (405 attendus). Lire les logs Vercel ; message d'erreur clair côté front.
- **api-10** (basse, S, `api/send-quote.ts:196`) — aucun `AbortSignal` sur les fetch Resend ni côté client. `AbortSignal.timeout(8_000)` serveur, `15_000` client.
- **api-11** (basse, S, `api/_lib/rate-limit.ts:15`) — Map par isolat, limite effective = 3 × isolats, remise à zéro au cold start, entrées expirées jamais purgées avant 10 000 clés ; IP non spoofable sur Vercel. Upstash `Ratelimit.slidingWindow(3, "1 h")` ou Vercel Firewall.
- **api-12** (basse, XS, `api/send-quote.ts:210`) — emails client sans `reply_to` ni coordonnées : une réponse part vers noreply@. `reply_to: ADMIN_EMAIL` + bloc contact.
- **api-15** (basse, XS, `api/send-quote.ts:173`) — email client `width="600"` fixe (déborde sur mobile) ; emails book-call sans `lang` ni `<title>`. `width="100%" max-width:600px`, factoriser `layout()` dans `api/_lib/email.ts`.
- **api-16** (basse, XS, `api/apporteurs-candidature.ts:283`) — aucune mention RGPD dans les emails, « L'équipe Ned » vs « Nexus Développement », Gmail en dur (:289) au lieu de `ADMIN_EMAIL`. Pied de page commun, une signature.
- **api-17** (basse, XS, `CallBooking.tsx:308`) — fenêtre 60 jours client vs 6 mois serveur ; QuoteForm sans `maxLength` alors que le serveur borne (100/30/100/5000). Constantes partagées, `maxLength` sur les inputs.
- **archi-20** (info, XS, `tailwind.config.ts:7`) — globs `./pages`, `./components`, `./app` inexistants ; 8 tokens `sidebar` sans composant. `content: ["./index.html", "./src/**/*.{ts,tsx}"]`, supprimer sidebar.
- **api-18** (info, XS, `api/send-quote.ts:117`) — Content-Type non contrôlé (JSON invalide → 400, correct), edge sans `regions` (adapté), 413 effectif y compris en chunked. Optionnel : 415 si `Content-Type ≠ application/json`.

### 4.8 DevOps

**Aucune barrière qualité en CI : main a été déployé avec 4 erreurs TypeScript et 2 erreurs ESLint** — devops-1 (aussi archi-19)
- Sévérité : haute · Effort : S · `.github/workflows/deploy.yml:41`
- Preuve : étapes `npm ci` → Chrome → `vercel build` → `vercel deploy --prebuilt`, aucun lint/typecheck/test. tsc sur main : ApporteursLegalModal `asChild`, select.tsx `position`, tooltip.tsx `sideOffset`, WebsiteCreation.tsx:227 `categoryId`. lint : 2 × no-explicit-any. c430dff = exactement la prod. Garde-fous désactivés : `no-unused-vars: off`, `strict: false`.
- Impact : une régression part en prod sans signal ; `asChild` était un vrai défaut de rendu.
- Correctif : fusionner la branche audit, ajouter `npm run lint` et `npm run typecheck` avant `vercel build`, `.github/workflows/ci.yml` sur `pull_request`, remonter `strict` progressivement.

**Deux pipelines de build : prod via Actions (Node 20, pré-rendu), previews via Vercel (Node 24, sans pré-rendu)** — devops-2
- Sévérité : moyenne · Effort : M · `vercel.json:3`
- Preuve : `deploymentEnabled.main=false` ne coupe que main ; 3 déploiements Git preview le 26/09 sur Vercel (`nodeVersion: 24.x`) sans `PRERENDER=true` ; deploy.yml sur `push main` uniquement, aucun job PR. Previews bien protégées par SSO.
- Impact : une preview ne reproduit ni le pré-rendu ni le runtime ; une PR n'a aucun check.
- Correctif : `"git": {"deploymentEnabled": false}` et job `pull_request` dans deploy.yml (`vercel build` avec PRERENDER=true, `deploy --prebuilt` sans `--prod`, URL en commentaire). Sinon aligner Node et documenter.

**Node 20 (fin de maintenance 30/04/2026) en CI, Node 24 sur Vercel et en local, aucun `engines`** — devops-3
- Sévérité : moyenne · Effort : XS · `.github/workflows/deploy.yml:26`
- Preuve : `node-version: 20`, netlify.toml `NODE_VERSION = 20`, README « ≥ 20 », Vercel 24.x, local v24.12.0, pas d'`engines`, pas de `.nvmrc`, `@types/node` ^22.
- Impact : build prod sur un runtime sans correctifs de sécurité ; trois versions selon l'endroit.
- Correctif : `engines: {node: ">=22"}`, `.nvmrc` = 22, `node-version-file`, Vercel 22.x, README.

**Pas de CLAUDE.md projet alors que la stack et le pipeline sortent du standard de l'agence** — devops-5
- Sévérité : moyenne · Effort : S · `README.md:1`
- Preuve : aucun CLAUDE.md ni `.claude/` ; le CLAUDE.md global impose Next.js/Supabase alors qu'ici Vite SPA, `PRERENDER=true` conditionnel, déploiement Actions, routes à maintenir à la main.
- Impact : chaque session repart des mauvaises conventions ; nouvelle route sans entrée dans ROUTES_TO_PRERENDER ni sitemap.
- Correctif : CLAUDE.md de 30 lignes (stack, commandes, règle « nouvelle route → prerender + sitemap », pipeline, variables, nommage des assets).

**6 vulnérabilités npm, toutes corrigeables par `npm audit fix` ; une seule au runtime, non exploitable ici** — devops-10 (aussi securite-10)
- Sévérité : moyenne · Effort : XS · `package.json:38`
- Preuve : postcss ≤ 8.5.22 (high ×2), nanoid, postcss-selector-parser = devDependencies (build) ; @remix-run/router 1.23.2 (open redirect) au runtime mais `redirect()|<Navigate` → 0, `navigate()` uniquement avec chemins constants ou encodés.
- Impact : bruit permanent (`npm audit` rouge, donc plus lu).
- Correctif : `npm audit fix` + `npm update` mineures, commit du lockfile, `npm audit --omit=dev --audit-level=high` en CI.

**Quatre majeures en retard (Vite 5, React Router 6, React 18, Tailwind 3) : plan de migration par ordre de risque** — devops-11
- Sévérité : moyenne · Effort : L · `package.json:62`
- Preuve : vite 5.4.21 → 8.3.1, react-router-dom 6.30.3 → 7.18.4, react 18.3.1 → 19.3.0, tailwindcss 3.4.19 → 4.3.3, typescript 5.9.3 → 7.0.2, eslint 9 → 10, react-day-picker 8 → 10. @prerenderer/* sans release depuis 2024 ; typescript-eslint bloque TS 7 ; react-hooks bloque ESLint 10.
- Impact : les sauts se cumulent (Vite 8 = Rolldown, `manualChunks` change) ; le plugin de pré-rendu non maintenu devient le point de blocage SEO.
- Correctif : étape 0 audit fix ; 1 Vite 7 + plugin-react-swc 4.3 + Node 22, valider `PRERENDER=true npm run build` (ou remplacer @prerenderer par un script Puppeteer maison) ; 2 react-router 7 ; 3 React 19 + Calendar regénéré ; 4 Tailwind 4 (contrôle visuel des 25 routes). Pas de TS 7 / ESLint 10 avant support. Une PR par étape.

**Token Vercel « Full Account » stocké dans GitHub** — devops-13
- Sévérité : moyenne · Effort : XS · `.github/workflows/README.md:20`
- Preuve : README « scope Full Account » ; le projet appartient à l'équipe nexus-projects qui héberge d'autres projets (bodystart).
- Impact : une fuite donne le contrôle de tous les projets, domaines et variables du compte.
- Correctif : token limité à l'équipe avec expiration 1 an, GitHub Environment `production` restreint à main, révoquer l'ancien.

**Aucun test : les 3 Edge Functions et le pré-rendu des 25 routes ne sont vérifiés par rien** — devops-14
- Sévérité : moyenne · Effort : M · `api/_lib/validation.ts:1`
- Preuve : aucun `*.test.*`, `vitest.config.*`, `playwright.config.*`, pas de script `test`. deploy.yml déploie sans vérifier que les 25 HTML existent ; un `render-event` jamais émis produit une coquille vide.
- Impact : une régression coupe les formulaires sans alerte ; un pré-rendu partiel remet le site en SPA vide pour Google (problème n°1 de l'audit SEO d'avril).
- Correctif : Vitest sur api/_lib (~15 tests : payloads, fenêtre rate-limit, CORS) ; `scripts/check-prerender.mjs` après `vercel build` (fichier existe, > 20 Ko, contient `<h1>`), échec = pas de déploiement.

Constats bas et info :
- **devops-15** (basse, S, `deploy.yml:45`) — pas de Lighthouse CI ni budget de perf alors que la home est à 69. `treosh/lighthouse-ci-action` sur 3 URL, `performance >= 0.8`, `LCP <= 3000`, warning puis bloquant.
- **devops-18** (basse, XS, `.gitignore:11`) — `.vercel/` et `*.tmp` non ignorés ; pas de `.gitattributes` avec `autocrlf=true` (8 fichiers texte de public/ en CRLF en local). `.gitattributes` `* text=auto eol=lf` + binaires, `git add --renormalize`.
- **devops-16** (info, XS) — live = commit c430dff exactement (déploiement dpl_SeS4o1U… du 16/05, 8 fichiers de public/ et 5 JSON-LD identiques) ; le Last-Modified du 09/09 est une date de cache CDN. Rien à corriger ; seule inconnue : l'ACAO `*` (securite-11). La réserve de perf-13 sur le CSS est levée : l'@import venait de src/index.css à c430dff.
- **live-17** (info, XS) — Age de 17 jours sur le cache edge = Date − Last-Modified, pas du contenu périmé ; revalidation ETag → 304 OK. Rien à faire.
- **live-19** (info, S, `index.html:64`) — aucune mesure d'audience (GA4 commenté, ID factice), aucun script tiers ; pas de données de trafic ni de conversion. Choisir GA4 après consentement ou Plausible/Umami sans cookie ; tracer les 3 formulaires.

---

## 5. Points forts

Dédoublonnés à partir des 10 auditeurs, chacun vérifié par au moins une preuve.

**Infrastructure et livraison**
- En-têtes de sécurité complets et identiques sur statique et /api/* : CSP (`frame-ancestors 'none'`, `object-src 'none'`, `base-uri`, `form-action`, `upgrade-insecure-requests`), HSTS 2 ans, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy (vercel.json:26-37, vérifiés par curl). `/.env`, `/.git/HEAD`, `/vercel.json`, `/package.json` → 404.
- Redirections canoniques correctes : http → https, www → apex (chemin et query conservés), slash final, tout en 308.
- Livraison : TTFB 20 ms, Brotli sur HTML/JS/CSS (home 170 Ko → 27 Ko), ETag + 304, `/assets/*` hashés en immutable, polices auto-hébergées woff2 sous-ensemble latin avec `font-display: swap` et preload.
- Pipeline GitHub Actions → `vercel deploy --prebuilt` traçable : 25 runs, un seul échec sur les 20 derniers, 1 min 17 s, chaque déploiement rattaché à son commit ; la prod est exactement main@c430dff. Previews sous SSO. `npm ci` + lockfile v3 + cache npm + `timeout-minutes` + `workflow_dispatch`.
- Gestion des secrets saine : un seul secret (`VERCEL_TOKEN`), `.env.example` sans valeur réelle, `.gitignore` bloque `.env*`/`*.pem`/`*.key`, aucune variable `VITE_*`, aucune sourcemap, historique git sans clé réelle, clé Resend uniquement côté Edge.

**API / Edge Functions**
- Validation serveur par listes fermées et longueurs bornées sur les 3 fonctions ; consentement exigé ; live : GET → 405, JSON invalide → 400, `{}` → 400 avec message de champ, jamais de stack ; env manquante → 503 explicite ; `/api/unknown` → 404.
- Échappement HTML systématique avant interpolation dans les mails, téléphone par regex avant `href="tel:"`, `dangerouslySetInnerHTML` → 0.
- Limite de taille de corps effective en prod (35 Ko → 413, y compris en `Transfer-Encoding: chunked`).
- CORS strict avec préflight, `Vary: Origin`, origine étrangère jamais reflétée ; rate-limit actif en rafale (429 + `Retry-After`) sur une IP non spoofable ; `reply_to` = email du visiteur sur les 3 emails admin ; bouton désactivé pendant l'envoi ; ApporteursForm avec honeypot, regex identiques client/serveur, double consentement ; date formatée en fr-FR/Europe/Paris ; `api/*.ts` passe `tsc --strict`.

**SEO / pré-rendu**
- Pré-rendu opérationnel : les 25 URLs du sitemap répondent 200 avec contenu réel, exactement 1 title, 1 description, 1 canonical auto-référente, 1 `<h1>`, `lang="fr"` ; les paramètres `?utm_*` ne modifient pas la canonical ; Lighthouse SEO 100.
- Routes, sitemap et ROUTES_TO_PRERENDER alignés (25 = 25 = 25, seul écart : la route dynamique de la démo immo).
- 5 JSON-LD globaux valides et liés (`#organization` ↔ `#localbusiness` ↔ `#website`), adresse, geo, horaires, SIREN/TVA, 2 fondateurs réels ; sameAs Pappers/annuaire/societe.com en 200.
- Fichiers de découvrabilité en place : robots.txt avec `User-agent: *` et 2 Sitemap, sitemap-images (14 URLs en 200), security.txt (Expires 2027-04-30), llms.txt riche, humans.txt, manifest, `google-site-verification`.
- 22/22 `<img>` avec alt non vide.

**Architecture et code**
- Lazy-loading systématique : 22 pages et 8 sections en `lazy()`, chunks isolés (CallBooking 74,7 Ko, Apporteurs 53,9 Ko, démos séparées), CSS des démos restaurant/concession dans leurs propres chunks, `esbuild.drop: ["console","debugger"]`, dist/ ignoré, alias `@/` cohérent.
- Source unique pour les 6 villes (localCities.ts pilote routes, contenu, liens), tarifs centralisés dans pricingData.ts, composant `SEO` sur 20/20 pages, helpers de schémas partagés, `api/_lib` (cors, rate-limit, validation) partagé par les 3 fonctions.
- Frontière client/serveur propre : `VITE_|import.meta.env` → 0 dans src.

**Juridique et contenu**
- Mentions légales LCEN complètes pour l'éditeur (SARL, capital, siège, SIREN/SIRET, RCS, TVA, directeur de publication, téléphone, email), hébergeur et sous-traitant email nommés.
- Politique de confidentialité structurée selon l'art. 13 : finalités par formulaire, base légale par finalité, durées chiffrées, sous-traitants avec pays et garantie, transferts hors UE, 8 droits, délai d'un mois, coordonnées CNIL.
- Aucun traceur réel : GA4 commenté, aucun Set-Cookie, aucune dépendance analytics ou Supabase.
- Page équipe honnête (2 co-gérants réels, date de création et immatriculation réelles), aucun faux témoignage sur les pages de l'agence (cas d'usage sans noms ni notes), 3 réalisations réelles en ligne (curl 200), coordonnées identiques sur tout le site et dans le JSON-LD.
- Programme apporteurs avec cadre juridique lisible (modale : identité, AE + SIRET, 20 % du CA HT encaissé, exclusions, droit de suite 12 mois, paiement 30 jours) et simulateur avec « Aucun gain n'est garanti ».
- Page 404 soignée (noindex client, URL fautive, 6 suggestions) ; page /links accessible (skip link, aria-labels, cibles 44 px, reduced-motion).

**Accessibilité et performance de base**
- Zoom mobile autorisé, `lang="fr"`, un seul H1 par page, skip links sur accueil/Apporteurs/Links, fond animé en `aria-hidden`, champs texte étiquetés (`Label htmlFor` + `id`), toasts annoncés et persistants, contrastes de base solides (muted 6,97:1, slate-400 7,87:1, CTA 8,65:1), liens du menu mobile à 48 px, landing Apporteurs avec erreurs en ligne `role="alert"` et `aria-live`.
- CLS = 0 sur les 3 pages auditées, images 100 % WebP dans src/, captures clients calibrées 800×500 à ~20 Ko, vidéo mp4 en faststart.

---

## 6. Plan d'action en 3 vagues

### Semaine 1 — quick wins XS/S et critiques

| Item | Effort | Réf. |
|---|---|---|
| Retirer ou contractualiser « satisfait ou remboursé » / « Performance garantie » (5 mentions + index.html:13 et :350) | S | rgpd-1 |
| Fait dans la PR : `PricingCard.scrollToQuote` → pathname `/` + `categoryId`, scroll d'ancre robuste | S | ux-1 |
| Fait dans la PR (sans Turnstile) : mail client sans texte libre, `name` restreint, honeypot sur les 3 formulaires | S | securite-1 (1-2) |
| Fait dans la PR, à vérifier après déploiement (`curl -I /xyz` → 404) : route `/404` pré-rendue + `dist/404.html` + rewrite ciblée | S | seo-1 |
| Fait dans la PR : bloc Théo Gautier retiré du sitemap images, 8 portraits supprimés | XS | rgpd-2, archi-1 |
| Fait dans la PR : liens footer vers les vraies routes, « Consulting » et newsletter retirés | XS | ux-9, rgpd-10 |
| Fait dans la PR : promo retirée, « Appel découverte » | XS | ux-10 |
| Fait dans la PR : suffixe « HT » + mention TVA | XS | rgpd-12 |
| Fait dans la PR : menu en `<Link to="/#…">` + composant HashScroll | S | ux-5, ux-6 |
| Fait dans la PR : services en `<button aria-pressed>` + fieldset, Select Radix, labels reliés | S | a11y-1, a11y-3 |
| Fait dans la PR (reste la fusion) : lint + typecheck dans deploy.yml, ci.yml sur PR | S | devops-1 |
| `rateLimit` après `validateBody`, validation téléphone côté client, message 429 explicite | XS | securite-2, api-3 (partiel) |
| Supprimer le bloc GA4 placeholder, retirer `'unsafe-inline'` et hôtes Google de la CSP (Report-Only d'abord) | XS | securite-3 |
| Passer le dépôt en privé | XS | securite-4 |
| Liens croisés entre villes + lien contextuel dans la FAQ (le bloc footer existe déjà) | S | seo-2 |
| Cache immutable restreint à `/assets` et `/fonts` | XS | live-6 |
| favicon.ico : supprimer la ligne 57 ou .ico 16/32/48, règle cache, manifest → 192/512 | XS | perf-4, archi-18 |
| Inliner fonts.css ; logos /identite-visuelle en 600×600 ASCII + lazy ; captures démos en 800×500 ; supprimer le .tmp | XS | perf-3, perf-9, perf-10, archi-9 (partiel) |
| Sujets d'email sans échappement HTML, labels budget/délai, `reply_to` client | XS | api-8, api-9, api-12 |
| Fait dans la PR pour CookieConsent ; reste : date légale en constante, lien devis → /confidentialite + mention sur CallBooking | XS | rgpd-6, rgpd-7, rgpd-9 |
| `engines` + `.nvmrc` 22 + Node 22 en CI et Vercel ; `npm audit fix` + mineures | XS | devops-3, devops-10 |
| Supprimer netlify.toml, public/_headers, `interest-cohort` ; `permissions: contents: read` ; `.vercel`/`*.tmp` ignorés | XS | securite-7, securite-8, devops-18 |
| Fait dans la PR (@import retirés) : vérifier au curl après déploiement de la branche | XS | perf-13 |
| Token Vercel limité à l'équipe + expiration, dans un Environment `production` | XS | devops-13 |

### Mois 1 — hautes M/L et moyennes structurantes

| Item | Effort | Réf. |
|---|---|---|
| Home : `Index` en import statique, pré-rendu conservé (`__PRERENDER__`, `initial={false}`, typewriter off), pas de spinner plein écran | M | perf-1 |
| AnimatedBackground : cancel rAF, reduce-motion, pause visibilitychange, boucle indexée, retirer `body::after` | S | perf-2, a11y-5 |
| H1 complet en sr-only + typewriter aria-hidden, désactivé sous reduce-motion / webdriver | S | a11y-2 |
| Une seule source de prix : supprimer les FAQ en dur, montants depuis pricingData, corriger index.html:365 et les exemples apporteurs ; `company.ts` pour capital/délais/SLA | S | ux-4, ux-13, ux-21 |
| Médiateur de la consommation : trancher B2B (art. 1 CGV) ou adhérer ; réécrire art. 12 et 14 en conséquence ; retirer le lien ODR | S | rgpd-3, rgpd-11 |
| Politique de cookies réaliste ; ajouter Google LLC aux destinataires ; contact@nexusdeveloppement.fr | S | rgpd-4, rgpd-8, ux-19 |
| Apporteurs : formulation de gains conditionnelle, retirer « dashboard », majorité à 18 ans, conservation harmonisée, messages d'erreur FR + maxLength | S | rgpd-5, rgpd-14, api-5 |
| Email admin = critère de succès + logs structurés ; timeouts Resend et client | S | api-1, api-10 |
| Client : mapper les codes d'erreur serveur, `maxLength`/`pattern`, erreurs inline `aria-invalid` + focus | S | api-3, a11y-16, api-17 |
| Cartes portfolio/catalogue en `<a>` ; badge « Démo », compteur « 3 réalisations · 4 démos », description restaurant corrigée ; bandeau démo commun | S | a11y-4, ux-12, rgpd-19 |
| Supprimer les chiffres invérifiables (missions, comparatifs, « primé », « 95+ ») | S | ux-11 |
| Démo immo : liens du header/footer vers des routes existantes ; SEO/noindex sur PropertyDetail | S | live-2, seo-9 |
| Turnstile vérifié côté Edge + limiteur partagé Upstash | M | securite-1 (3), api-11 |
| DNS : SPF apex `-all`, DMARC quarantine + rua, SPF/MX de `send.` | S | securite-5 |
| Accessibilité : menu mobile (sheet Radix), FAQ en Accordion Radix, Dialog Radix, IDs préfixés, contrastes, Engagements visibles, `<main>` + skip link, vidéo concession avec pause/poster, démos (labels, contrastes) | S chacun | a11y-6 à a11y-15 |
| Code mort : 11 fichiers, 8 dépendances, 11 scripts, ErrorBoundary branché, CSS restaurant scopé, `tsconfig.api.json`, README réécrit + CLAUDE.md projet | S chacun | archi-2 à archi-8, devops-5 |
| Titles ≤ 60 / descriptions ≤ 155 ; og-image en JPG 1200×630 + width/height/alt ; FAQPage global supprimé et FAQ générées depuis les données ; liens crawlables sur les pages villes | S | seo-7, seo-8, live-3, seo-4 |
| book-call : week-ends, fériés, contiguïté, fin ≤ 18 h ; « demande de créneau reçue » + .ics | S | api-6, api-7 |
| `manualChunks` en fonction ; `LazySection` pour les sections de la home ; vidéo concession < 1 Mo, non montée sur mobile | S / M | perf-5, perf-8, perf-11 |
| Un seul pipeline : `deploymentEnabled: false` + job preview dans Actions | M | devops-2 |
| Ton et coquilles (nous/vous, « investissement », emojis hors h3/meta/toasts) | XS | ux-20 |

### Trimestre — dette, migrations, contenu

| Item | Effort | Réf. |
|---|---|---|
| Migrations par étapes : Vite 7 (+ validation du pré-rendu ou script Puppeteer maison), react-router 7, React 19, Tailwind 4 ; une PR par étape avec lint + typecheck + build pré-rendu + Lighthouse | L | devops-11 |
| Tests : Vitest sur api/_lib, `check-prerender.mjs` bloquant, Lighthouse CI avec budget (perf ≥ 0.8, LCP ≤ 3 s) | M | devops-14, devops-15 |
| Page /e-commerce (gabarit WebsiteCreation, 3 cas clients, pricingData ecommerce), entrée de menu, option dans QuoteForm et VALID_SERVICES | M | ux-7 |
| Contenu local réel par ville (≥ 40 % de texte unique), FAQ templatée réduite | M | seo-5 |
| framer-motion en `LazyMotion` / `m.` ou CSS + IntersectionObserver ; navigation-menu Radix remplacé si utile ; tokens sidebar/chart et palettes démos scopés | M | perf-7, perf-18, perf-21, archi-16 |
| Sitemap généré au build avec lastmod git ; Breadcrumb visible alimenté par `breadcrumbSchema` ; redirects `/index.html` et chaîne www+slash ; robots `Disallow: /api/` ; llms.txt à jour | S | live-10, seo-16, live-11, live-12, live-14, seo-18 |
| Mesure d'audience sans cookie (Plausible/Umami) ou GA4 après consentement, événements sur les 3 formulaires | S | live-19 |
| Typographie française (espaces insécables, apostrophes), lang="en" sur les textes anglais, tailles ≥ 12 px ; carrousel et cartes immo accessibles ; étapes de réservation annoncées | S | ux-24, a11y-17, a11y-19, a11y-20, a11y-21 |
| Nettoyage résiduel : copy-public.mjs, typography plugin, ScrollToTop dupliqué, `PrerenderReady` réel, tailwind `content`, CGU (supprimer ou enrichir), mentions Vercel/Resend exactes, `Access-Control-Allow-Origin` explicite, HSTS preload tranché, security.txt unique, CORS localhost conditionné, Contact avec adresse/horaires | XS chacun | archi-11, archi-12, archi-15, archi-17, archi-20, rgpd-21, rgpd-15, rgpd-16, rgpd-17, rgpd-18, rgpd-20, securite-6, securite-11, securite-12, securite-13, securite-15, ux-23, api-15, api-16, api-18, perf-14 à perf-17, live-13 |

---

## Annexe A — Constats contestés

Aucun. La passe adversariale n'ayant pas été exécutée, aucun constat n'a été contesté par un vérificateur. Deux tensions internes entre auditeurs ont été tranchées par la relecture du 29/09 :

- **Liens villes dans le footer** : tranché. Les liens existent (Footer.tsx:125-140 à c430dff, présents dans le HTML live) ; seo-2 est requalifié en moyenne (absence de maillage contextuel).
- **CSS live vs dépôt** : tranché. L'@import venait de src/index.css:1 à c430dff ; le live est bien le build de c430dff (devops-16 avait raison) ; corrigé sur la branche (365cf18).

## Annexe B — Constats réfutés

Aucun.

## Annexe C — Limites de l'audit

- **Vérification adversariale non exécutée** (limite de crédits). Tous les constats, y compris les 2 critiques et les 28 hauts, portent la mention « non vérifié » ; ils sont livrés tels que rapportés par leur auditeur, avec leur preuve (commande, fichier:ligne, sortie observée). Les constats moyens, bas et info n'y étaient de toute façon pas destinés. Contre-pouvoir partiel : 40 constats ont été remontés indépendamment par 2 à 4 auditeurs et fusionnés (`merged_from`).
- **Lighthouse mobile réel** fourni sur le site live (lighthouse-summary.md) pour 3 pages seulement (/, /creation-site-web, /agence-web-versailles), Lighthouse 12, Moto G simulé, 4G lente, une seule passe par page.
- **Pas de test navigateur automatisé** (Playwright) : les vérifications de clics, scroll et `getElementById` ont été faites manuellement sur le site live pour un sous-ensemble de parcours (ux-1, ux-5, ux-6, a11y-13).
- **Lecture seule** : aucun build ni `npm install` lancé par les auditeurs ; les logs build/lint/tsc/audit/outdated proviennent d'une exécution préalable du 26/09 sur HEAD c430dff.
- **Fichiers modifiés pendant l'audit** : la branche audit/2026-09-26 a reçu trois commits de correctifs (365cf18, 4211794, 78316d7) pendant et après l'audit (voir « Déjà corrigé dans cette PR ») ; les numéros de ligne cités se réfèrent à c430dff.
- **Points non vérifiables depuis l'extérieur** : liste DPF pour Resend (API indisponible), stack du 500 `FUNCTION_INVOCATION_FAILED` (logs Vercel requis), comparaison du bundle CSS déployé, réglage projet Vercel responsable de l'ACAO `*`.
- **Auditeurs sans réponse** : aucun (10/10 ont rendu).

Total : 150 constats (2 critiques, 28 hauts, 63 moyens, 43 bas, 14 info), 0 contesté, 0 réfuté, plus 25 constats de seconde passe en annexe D (non vérifiés).

## Annexe D — Seconde passe du 29/09 (zones non couvertes, non vérifiée)

La relecture a identifié quatre zones absentes de l'audit. Deux ont pu être auditées avant l'interruption ; « Observabilité et alerting (erreurs, bounces sur le canal de leads) » et « Réception réelle des emails transactionnels (test de bout en bout des 3 formulaires) » restent à faire. Constats bruts, sévérité annoncée par l'auditeur.

### Simulateur de gains /apporteur (13 constats)

**Formule de la commission maintenance fausse : 4 € par client au lieu des ~192 € annoncés dans la FAQ (facteur 48)**
- Sévérité : haute · Effort : XS · `src/components/apporteurs/ApporteursSimulator.tsx:28`
- Preuve : l.27-29 : commentaire « 8€/mois × deals × 24 mois max sur 3 ans, pondération conservatrice 0.5 » puis `const maintenance3ans = dealsParMois * 12 * 3 * 8 * 0.5;`. Le facteur « 24 mois » n'est jamais appliqué : par client signé le code ajoute 8 × 0,5 = 4 € au total, alors que ApporteursFAQ.tsx l.24 promet « 8 €/mois × 24 = près de 200 € en plus par client ». Vérifié avec node sur le scénario par défaut (2 contacts, 40 %, mix équilibré = 0,8 deal/mois) : maintenance3ans = 115,2 € (1 % du « 11 578 € » affiché) ; selon la FAQ elle vaudrait 5 530 € (24 mois pleins), 3 763 € en ne comptant que les mois encaissables dans la fenêtre de 3 ans (somme de min(24, 36-t) pour t=0..35 = 588 mois pour 36 deals) ou 2 765 € avec la pondération 0,5. Valeurs pré-rendues servies en prod : « 318 € / 3 821 € / 11 578 € » (curl https://nexusdeveloppement.fr/apporteurs, HTTP 200). `git diff c430dff HEAD -- ApporteursSimulator.tsx` est vide : même code en prod et sur la branche d'audit.
- Impact : Le chiffre mis en avant en vert (« Sur 3 ans avec maintenance ») ne correspond ni au commentaire du code ni à la FAQ de la même page ; un candidat qui recoupe voit que « sans mentir » et « vrais chiffres » sont contredits par l'outil lui-même. Erreur dans le sens conservateur (sous-estimation), donc pas de sur-promesse, mais le libellé « avec maintenance » est faux puisque la maintenance pèse 1 %.
- Correctif : Remplacer l.27-29 par : `const MOIS_MAINTENANCE_3_ANS = 588; // somme de min(24, 36-t), t = 0..35` et `const maintenance3ans = dealsParMois * MOIS_MAINTENANCE_3_ANS * COMMISSION_RATE * FORFAIT_MENSUEL[mix];` (forfait mensuel tiré de pricingData : 50/75/115 €). Supprimer la pondération 0,5 ou l'afficher (« hypothèse : 1 client sur 2 souscrit un forfait mensuel »). Ajouter un test unitaire de computeGains sur le scénario par défaut.

**Tickets moyens 1 200 / 1 990 / 3 500 € du simulateur : aucun ne figure dans pricingData.ts, sous les titres « vrais chiffres » et « tarifs réels / effectifs »**
- Sévérité : haute · Effort : S · `src/components/apporteurs/ApporteursSimulator.tsx:8`
- Preuve : l.8-12 `TICKET_AVERAGE = { vitrines: 1200, equilibre: 1990, premium: 3500 }`. src/data/pricingData.ts : sites vitrine Essential « À partir de 950€ » (l.28), Business « À partir de 1 850€ » (l.44), Premium « À partir de 4 000€ » (l.62) ; 3 500 € n'existe que pour « E-commerce Standard » (l.220). Le mix « Plutôt projets premium » (3 500 €) est donc sous le prix plancher du site Premium (4 000 €), et 1 200 / 1 990 € ne correspondent à rien. La même page utilise trois prix de « site » différents : 1 850 € HT dans ApporteursFinalCTA.tsx l.34, 1 990 € HT dans ApporteursFAQ.tsx l.16, 1 990 € dans le simulateur. Pourtant l.100 « Voici les vrais chiffres, basés sur nos tarifs réels » et l.252 « Estimations honnêtes basées sur nos tarifs effectifs ». Aucune source (README, data, commentaire) ne justifie ces tickets. Confirmé en prod : « tarifs réels » et « tarifs effectifs » présents 1 fois chacun dans le HTML live. Le constat global « trois grilles de prix contradictoires » est connu ; celui-ci porte sur les entrées propres du simulateur.
- Impact : Le simulateur revendique une exactitude (« vrais chiffres ») qu'il ne tient pas : chaque montant affiché dérive de tickets non sourcés et incohérents avec la grille publique. Perte de crédibilité auprès de la cible (indépendants B2B, étudiants) et argument facile pour un apporteur mécontent.
- Correctif : Soit dériver les tickets de pricingData (`vitrines: 950`, `equilibre: 1850`, `premium: 4000`, en important les valeurs plutôt qu'en les recopiant), soit conserver des tickets moyens constatés mais les sourcer (« ticket moyen de nos devis signés en 2026 ») et retirer « vrais chiffres » / « tarifs réels » / « tarifs effectifs » (l.100 et l.252) au profit de « hypothèses basées sur notre grille ». Aligner FAQ l.16 et CTA l.34 sur le même exemple (site Business 1 850 € HT = 370 €).

**Prémisse « maintenance à 39 €/mois = 8 €/mois de commission » : aucun forfait à 39 € n'existe, la grille réelle donne 10 à 23 €/mois**
- Sévérité : moyenne · Effort : XS · `src/components/apporteurs/ApporteursFAQ.tsx:24`
- Preuve : FAQ l.24 : « Sur une maintenance à 39 €/mois, ça fait environ 8 €/mois × 24 = près de 200 € ». `grep -rn "39" src` ne trouve « 39 €/mois » qu'à cette ligne. pricingData.ts : « Hébergement 50€/mois » (l.39), « 75€/mois » (l.57), « 115€/mois » (l.74) pour les sites ; 25 et 60 €/mois pour l'automatisation (l.115, l.134) ; 100 à 400 €/mois pour apps et e-commerce. À 20 % : 10 / 15 / 23 €/mois, soit 240 / 360 / 552 € sur 24 mois (calcul node). Le simulateur reprend la même constante 8 (l.28) pour tous les mix.
- Impact : L'exemple chiffré de la FAQ et la constante du simulateur reposent sur un tarif fictif, inférieur à toute offre réelle : la commission récurrente est sous-estimée de 25 à 190 % et le lecteur ne peut pas la recouper avec la grille du site.
- Correctif : Réécrire FAQ l.24 avec un forfait réel : « Sur un site Business, le forfait mensuel est de 75 € HT : 15 €/mois × 24 = 360 € en plus par client ». Dans le simulateur, remplacer la constante 8 par `COMMISSION_RATE * FORFAIT_MENSUEL[mix]` avec `FORFAIT_MENSUEL = { vitrines: 50, equilibre: 75, premium: 115 }` importé de pricingData.

**Modale et FAQ divergent sur l'assiette du récurrent et le déclenchement du paiement (« encaissement intégral » vs « chaque échéance », plafond 24 mois absent de la modale)**
- Sévérité : moyenne · Effort : S · `src/components/apporteurs/ApporteursLegalModal.tsx:53`
- Preuve : Modale l.53-57 : « 20 % du chiffre d'affaires hors taxes effectivement encaissé … auprès du client présenté » sans mention des forfaits mensuels ni de plafond de durée ; l.61-63 : versement « sous 30 jours … à compter de l'encaissement intégral du prix … sur réception d'une facture conforme ». FAQ l.24 : « 20 % de chaque échéance encaissée pendant 24 mois maximum à compter de la signature » ; FAQ l.20 : « la commission n'est due que si nous encaissons l'intégralité du paiement ». Pour un forfait mensuel, l'« intégralité » n'est jamais atteinte avant la fin, et une lecture littérale de la modale (CA encaissé, sans plafond) donne droit à 20 % de tout le récurrent sans limite de durée. Chaque échéance de 8 à 23 € impliquerait par ailleurs une facture de l'apporteur dans les 30 jours.
- Impact : Les deux textes publics de la même page définissent deux assiettes différentes ; la modale précise que le contrat prévaut (l.67-69), ce qui limite l'exposition, mais le document intitulé « Mentions légales du programme » promet plus large que la FAQ. Source de litige et d'administratif absurde (24 micro-factures par client).
- Correctif : Compléter la section « Rémunération » de la modale : « La commission porte sur la prestation initiale et, pendant 24 mois à compter de la signature, sur les forfaits mensuels effectivement encaissés. Les commissions sur forfaits récurrents font l'objet d'un relevé trimestriel donnant lieu à une facture unique de l'Apporteur. » Reprendre la même formulation dans FAQ l.20 et l.24 et dans le contrat.

**« Gain mensuel » = chiffre d'affaires HT lissé, avant cotisations auto-entrepreneur : pour un étudiant, 318 € affichés = 235 à 251 € nets**
- Sévérité : moyenne · Effort : S · `src/components/apporteurs/ApporteursSimulator.tsx:232`
- Preuve : l.232 libellé « Gain mensuel estimé », l.25 `gainMensuel = dealsParMois * ticket * COMMISSION_RATE` sans aucune déduction ; aucune occurrence de « HT », « cotisations » ou « chiffre d'affaires » dans le simulateur (grep). Modale l.46-48 : statut auto-entrepreneur avec SIRET obligatoire, l.53 commission « hors taxes ». ApporteursTargets.tsx l.8 vise les « Étudiants … un complément de revenu ». Calcul node : 318,4 € × (1 − 0,212) = 251 € (BIC services 21,2 %) ; × (1 − 0,261) = 235 € (BNC, taux 2026), avant impôt sur le revenu et CFE. Le simulateur autorise des deals fractionnaires : 1 contact « Prudent » = 0,25 deal/mois affiché « 60 € » par mois alors que le revenu réel est 240 € une fois tous les 4 mois. Scénario maximal : 10 contacts / 60 % / premium = 50 400 €/an (l.24-26), au-dessus du seuil de franchise en base de TVA des prestations de services (37 500 € en vigueur depuis 2025 ; à vérifier avec la LF 2026) : l'apporteur devrait facturer la TVA (neutre pour Ned). Le plafond micro (77 700 € pour 2023-2025) n'est pas atteint. La qualification BIC/BNC de l'apport d'affaires n'est pas tranchée ici, d'où la fourchette 21,2-26,1 %.
- Impact : Le mot « gain » est lu comme un revenu net et régulier par la cible étudiante / sans emploi, alors qu'il s'agit d'un CA HT irrégulier dont 21 à 26 % partent en cotisations. Écart de 20 à 25 % entre le chiffre affiché et ce qui reste réellement.
- Correctif : Renommer les blocs « Chiffre d'affaires HT estimé par mois / par an » et ajouter sous les chiffres : « Montants HT que vous facturez en tant qu'auto-entrepreneur ; retirez environ 21 à 26 % de cotisations sociales, puis l'impôt sur le revenu. » Quand dealsParMois < 1, afficher « soit environ 1 client tous les N mois (N = Math.round(1 / dealsParMois)) » au lieu d'un montant mensuel lissé.

**Échelle « 1 à 10 contacts qualifiés par mois » déconnectée du reste de la page (réseau de 0 à 5 personnes, « vous connaissez 5 personnes ») : 0 impossible, plancher = 12 contacts/an**
- Sévérité : moyenne · Effort : S · `src/components/apporteurs/ApporteursSimulator.tsx:134`
- Preuve : l.123 « Combien de contacts qualifiés par mois ? », l.134-137 `min={1} max={10} step={1}`, l.53 valeur par défaut 2 (= 24 contacts qualifiés par an). ApporteursForm.tsx l.528-531 : la plus petite tranche du réseau est « 0 à 5 personnes » (au total, pas par mois) ; ApporteursFinalCTA.tsx l.21-23 « Vous connaissez 5 personnes qui ont besoin d'un site ? ». Le cas 0 contact (0 €) n'est pas représentable ; les valeurs affichées ne descendent jamais sous 60 €/mois (1 contact, prudent, vitrines, calcul node).
- Impact : Le plancher du simulateur suppose déjà un flux (12 contacts qualifiés par an) que la majorité des candidats, d'après la propre grille du formulaire, n'auront pas ; le montant le plus bas affiché est donc lui aussi optimiste, et l'unité change entre les sections (par mois / au total).
- Correctif : Passer le curseur en « contacts qualifiés par an » (0 à 24, défaut 3) et convertir dans computeGains (`dealsParMois = contactsParAn * taux / 12`), ou garder le mois mais démarrer à 0 avec un état « 0 € » explicite. Aligner le CTA final sur la même unité (« 5 contacts dans l'année »).

**Le chiffre mis en avant (vert) est le plus spéculatif : projection 3 ans à flux constant alors que la modale prévoit la fin du programme à tout moment**
- Sévérité : moyenne · Effort : XS · `src/components/apporteurs/ApporteursSimulator.tsx:237`
- Preuve : l.234-238 : seul le bloc « Sur 3 ans avec maintenance » reçoit `highlight` et la couleur `var(--ned-success)` (l.320) ; l.29 `total3ans = gainAnnuel * 3 + maintenance3ans` suppose 36 mois de flux identique. Modale l.89-91 : « se réserve le droit de modifier ou de mettre fin au programme à tout moment » ; FAQ l.36 : résiliation avec 30 jours de préavis. Le total par défaut 11 578 € contient 115 € de maintenance (1 %), malgré le libellé.
- Impact : L'œil est attiré sur le montant le moins garanti (36 mois d'hypothèses cumulées) alors que le programme n'engage Ned sur aucune durée ; c'est aussi le chiffre repris par le pré-rendu et donc indexable.
- Correctif : Mettre le `highlight` sur le gain annuel, renommer le troisième bloc « Projection sur 3 ans (flux constant, forfaits inclus) » et l'afficher en style secondaire ; ou supprimer le bloc 3 ans tant que la formule maintenance n'est pas corrigée.

**« Aucun gain n'est garanti » : 12 px italique hors carte, sans lien avec les chiffres ni avec les conditions (lien « Mentions légales » 5 sections plus bas)**
- Sévérité : moyenne · Effort : XS · `src/components/apporteurs/ApporteursSimulator.tsx:248`
- Preuve : l.248-254 : `<p className="mt-6 text-xs md:text-sm italic text-center …">` placé après la fermeture de la carte (l.246), soit 12 px en mobile, italique, alors que les montants sont en `text-2xl md:text-3xl font-bold` (l.318). Le conteneur des résultats (l.228-239) n'a pas d'`aria-describedby` vers ce texte ; l'annonce `aria-live` l.242-245 lit les trois montants sans la réserve. Le seul accès aux conditions (ApporteursLegalModal) est dans le formulaire, ApporteursForm.tsx l.570-572, après WhyUs, Process, Targets et FAQ. Contraste OK (#C8CDD3 sur #0A1628 = 11,3:1, calcul node) : le problème est la taille, la position et l'absence de lien, pas la couleur. Le texte dit aussi « dépend uniquement du nombre de clients réellement signés et payés » alors que la modale l.54-57 exclut aussi les prospects déjà connus et les signatures au-delà de 12 mois.
- Impact : La seule réserve qui protège la promesse « sans mentir » est l'élément le plus petit de la section ; un lecteur qui s'arrête aux chiffres ne la voit pas et n'a aucun moyen d'atteindre les conditions depuis le simulateur.
- Correctif : Déplacer la réserve à l'intérieur de la carte, sous les trois blocs, en `text-sm` non italique, avec `id` référencé par `aria-describedby` sur le conteneur des résultats ; compléter « … clients réellement signés, payés, non déjà connus de Ned et signés dans les 12 mois » ; ajouter à côté un déclencheur `<ApporteursLegalModal />` libellé « Voir les conditions du programme ».

**Arrondis incohérents : gain annuel ≠ 12 × gain mensuel affiché dans 21 combinaisons sur 90, dont la valeur par défaut**
- Sévérité : basse · Effort : XS · `src/components/apporteurs/ApporteursSimulator.tsx:33`
- Preuve : l.33-38 `formatEuros` arrondit chaque bloc indépendamment (`Math.round`, `maximumFractionDigits: 0`) à partir des valeurs non arrondies l.25-29. Calcul node sur les 90 combinaisons : 21 cas où `12 × Math.round(gainMensuel) !== Math.round(gainAnnuel)` ; par défaut « 318 € » × 12 = 3 816 € alors que l'écran affiche « 3 821 € » ; 1 contact / prudent / équilibré : « 100 € » × 12 = 1 200 € vs « 1 194 € ». Formatage fr-FR lui-même correct (« 318 € » = U+00A0 avant le symbole, séparateur de milliers fin) ; NaN impossible en usage normal (input range, `Number()` l.139).
- Impact : Un candidat qui vérifie à la calculatrice trouve des écarts de quelques euros sur une page qui titre « sans mentir ».
- Correctif : Arrondir le gain mensuel avant de dériver l'annuel et le total (`const gainMensuel = Math.round(deals * ticket * COMMISSION_RATE); const gainAnnuel = gainMensuel * 12;`) ou préfixer les montants d'un « ≈ ».

**Taux de signature 25 / 40 / 60 % étiquetés « Prudent / Réaliste / Optimiste » sans aucune source, et scénario médian sélectionné par défaut, pré-rendu et indexé**
- Sévérité : basse · Effort : XS · `src/components/apporteurs/ApporteursSimulator.tsx:53`
- Preuve : l.14-18 constantes, l.40-44 libellés ; l.53-55 état initial `useState(2)`, `"realiste"`, `"equilibre"`. `grep -rn "taux de signature" src README.md` ne renvoie que le simulateur : rien dans le dépôt n'appuie 40 % comme « réaliste ». vite.config.ts l.25 pré-rend « /apporteurs » : le HTML live contient « 318 € », « 3 821 € », « 11 578 € » (grep sur la page téléchargée), donc les moteurs indexent le scénario médian.
- Impact : Le mot « Réaliste » qualifie une hypothèse invérifiable pour une agence de 9 mois ; l'état par défaut, le seul visible sans interaction et le seul indexé, est déjà le scénario intermédiaire.
- Correctif : Renommer les options « Hypothèse basse / médiane / haute », sélectionner la basse par défaut (`useState<SignatureRate>("prudent")`) et ajouter une note « Taux indicatifs, non issus d'un historique » tant qu'aucune donnée réelle n'existe.

**Meta description et hero promettent 20 % « du montant de chaque projet signé » alors que la commission porte sur le HT effectivement encaissé**
- Sévérité : basse · Effort : XS · `src/pages/Apporteurs.tsx:64`
- Preuve : Apporteurs.tsx l.64 : « touchez 20 % du montant de chaque projet signé » ; ApporteursHero.tsx l.66-68 : « Si on signe, vous touchez 20 % du montant de la prestation » (ni HT ni encaissé). Modale l.53-56 : « 20 % du chiffre d'affaires hors taxes effectivement encaissé … Aucune commission n'est due … en cas d'impayé » ; ApporteursWhyUs.tsx l.9 « 20 % HT du montant encaissé » ; JobPosting l.21 « 20 % du chiffre d'affaires HT ». Le HTML live contient « projet signé » 3 fois.
- Impact : Le résumé indexé (snippet Google) et le premier écran énoncent une base de calcul (signé, montant TTC implicite) plus large que celle des conditions (HT encaissé, impayés exclus) : écart de 20 % de TVA sur un client particulier et fausse attente en cas d'impayé.
- Correctif : Remplacer par « touchez 20 % du montant HT encaissé sur chaque projet » dans la meta description (Apporteurs.tsx l.64) et le hero (ApporteursHero.tsx l.67) ; garder « signé » uniquement pour le droit de suite.

**« C'est la seule façon légale pour nous de vous payer une commission » : affirmation fausse, l'auto-entreprise est un choix de Ned, pas une obligation légale**
- Sévérité : basse · Effort : XS · `src/components/apporteurs/ApporteursFAQ.tsx:12`
- Preuve : FAQ l.11-12 : « Je dois être auto-entrepreneur, c'est obligatoire ? — Oui. C'est la seule façon légale pour nous de vous payer une commission. » Modale l.46-48 : le statut AE est une condition d'éligibilité posée par le programme. D'autres cadres permettent légalement de percevoir une commission d'apport d'affaires : entreprise individuelle au réel, société, portage salarial.
- Impact : Information juridique inexacte sur une page qui se veut carrée ; un indépendant déjà en société (cible « Indépendants B2B », ApporteursTargets.tsx l.13) comprend qu'il est exclu ou doit créer une auto-entreprise en double.
- Correctif : Réécrire : « C'est le statut que nous demandons pour pouvoir vous régler sur facture. Si vous avez déjà une entreprise (EI, société, portage), écrivez-nous : une facture avec SIRET suffit. » et aligner la modale l.46-48 (« disposer d'un numéro SIRET valide »).

**Point positif à sécuriser : les correctifs apporteurs de la branche d'audit (740 € au lieu de « 1 500 à 3 000 € », suppression du « dashboard ») ne sont pas en production**
- Sévérité : info · Effort : XS · `src/components/apporteurs/ApporteursFinalCTA.tsx:34`
- Preuve : Branche courante `audit/2026-09-26` (HEAD 78316d7 du 2026-09-29) ; `origin/main` = c430dff (2026-05-16) et deploy.yml ne se déclenche que sur `push: branches: [main]` (l.4-6). HTML live (curl du 2026-09-29) : « 1&nbsp;500 à 3&nbsp;000&nbsp;€ » présent 1 fois, « 740 » et « dashboard apporteur » absents ; `git diff c430dff HEAD` montre le remplacement l.34-36 (2 × 1 850 × 0,2 = 740 €, calcul exact) et FAQ l.40. Le simulateur, lui, est identique sur les deux versions.
- Impact : Tant que la branche n'est pas fusionnée, la promesse chiffrée déjà connue reste servie en production ; les constats de ce rapport sur le simulateur s'appliquent aux deux versions.
- Correctif : Fusionner la branche d'audit dans main (ou cherry-pick 365cf18 et 4211794) et vérifier après déploiement que « 740 € » apparaît dans le HTML de /apporteurs.

Points forts relevés : Les exemples chiffrés du texte sont arithmétiquement justes : 2 × 1 850 € × 20 % = 740 € (ApporteursFinalCTA.tsx l.34-35), 1 990 × 20 % = 398 € et 3 500 × 20 % = 700 € (ApporteursFAQ.tsx l.16), 39 × 20 % = 7,8 ≈ 8 € (l.24) ; les libellés 25 / 40 / 60 % (l.40-44) correspondent aux constantes l.14-18 (vérifié par node). ; Bornes et formatage sains : curseur `min=1 max=10 step=1` (l.134-137), `Number()` sur un input range, `Math.round` + `Intl.NumberFormat fr-FR` monnaie (l.33-38) : aucune valeur négative, décimale ou NaN atteignable en usage normal ; sortie « 318 € » avec espace insécable (U+00A0) avant le symbole. ; La réserve « Aucun gain n'est garanti — votre rémunération dépend … des clients réellement signés et payés » existe (ApporteursSimulator.tsx l.252-253) et elle est bien servie en production (présente 1 fois dans le HTML live). ; La modale pose un cadre juridique complet et cohérent avec le hero et les cartes sur les points clés : identité de la société et RCS (l.38-42), majorité + SIRET (l.46-48), 20 % du CA HT encaissé avec exclusions (l.53-57), droit de suite 12 mois, versement sous 30 jours sur facture (l.61-63), primauté du contrat (l.67-69), loi applicable (l.95-96) ; JobPosting (Apporteurs.tsx l.21) et WhyUs (l.9) reprennent bien « 20 % du CA HT ». ; Le simulateur est calculé dans un `useMemo` pur (`computeGains`, l.22-31) et testable isolément ; les contrôles ont une sémantique correcte (label `htmlFor` l.118, `role=radiogroup` + `aria-checked` l.161-187, zone `aria-live` l.242-245). ; La branche d'audit a déjà corrigé la promesse « 1 500 à 3 000 € » et le « dashboard apporteur » inexistant (git diff c430dff..HEAD sur ApporteursFinalCTA.tsx l.34-36 et ApporteursFAQ.tsx l.40), avec un exemple calculé exactement (740 €).

### PWA / manifest et comportement (12 constats)

**Hors-ligne ou après un déploiement, un chunk lazy manquant vide `#root` définitivement (reproduit en live) : aucun listener `vite:preloadError`, « retour » ne récupère rien**
- Sévérité : haute · Effort : XS · `src/main.tsx:5`
- Preuve : src/App.tsx:12-33 : 22 pages en `lazy(() => import(...))`, montées dans `<Suspense fallback={<PageLoader />}>` (l. 49) sans frontière d'erreur ; `grep -rn "preloadError\|ErrorBoundary" src` ne renvoie que la définition de la classe (src/components/ErrorBoundary.tsx:15) ; src/main.tsx (16 lignes) n'écoute aucun événement. Reproduction Playwright/Chromium sur https://nexusdeveloppement.fr/ : page chargée (`#root.innerHTML.length` = 136 705), `context.setOffline(true)`, clic sur `a[href="/equipe"]` (React Router `<Link>`, Navigation.tsx:121) → URL /equipe, `#root.innerHTML.length` = 0, `body.innerText` = "", console : `TypeError: Failed to fetch dynamically imported module: https://nexusdeveloppement.fr/assets/Team-DIQKNQZ1.js`. Simulation post-déploiement : requête du chunk réécrite vers `/assets/CGV-OLDHASH00.js` (vraie réponse Vercel : `404`, `text/plain`, « NOT_FOUND » — même chose que `curl -I https://nexusdeveloppement.fr/assets/Team-ZZZZZZZZ.js`) → même résultat (`#root` = 0) ; `page.goBack()` → URL / mais `#root` toujours = 0. Capture : scratchpad/offline-clientnav-equipe.png. Doc Vite (vite.dev/guide/build, « Load Error Handling ») : l'événement `vite:preloadError` existe précisément pour le cas « after new deployments when previous asset chunks have been removed ».
- Impact : Écran uni rgb(10,15,30) sans message ni bouton dès qu'un import() échoue : coupure réseau passagère sur mobile pendant une navigation interne, ou simple visite en cours au moment d'un déploiement (les chunks de l'ancien build disparaissent, pas de skew protection). Seul un rechargement manuel restaure le site ; en mode standalone (constat suivant) il n'y a même pas de bouton recharger.
- Correctif : src/main.tsx : `window.addEventListener('vite:preloadError', () => window.location.reload())` (snippet officiel Vite ; en ligne le reload récupère un HTML frais avec les nouveaux hashes, hors-ligne il affiche au moins la page d'erreur explicite du navigateur). Et brancher `<ErrorBoundary>` autour du `<Suspense>` de src/App.tsx:49 avec le fallback « Recharger la page » déjà codé dans ErrorBoundary.tsx (cf. archi-3).

**`display: standalone` sans service worker : le site « installé » s'ouvre sans barre d'adresse et, hors-ligne, n'affiche que la page d'erreur du navigateur**
- Sévérité : moyenne · Effort : XS · `public/manifest.webmanifest:6`
- Preuve : public/manifest.webmanifest:6 `"display": "standalone"`, :5 `"start_url": "/"`, :10 `"scope": "/"`. Aucun service worker : `find . -iname sw.js -o -iname 'service-worker*' -o -iname 'workbox*'` → rien ; `grep -rniE "serviceWorker|workbox|vite-plugin-pwa|registerSW" src public api index.html vite.config.ts` → 0 résultat (les seuls « hors-ligne » sont du texte marketing, MobileApps.tsx:39/54/61) ; package.json sans vite-plugin-pwa ni workbox. Live : `navigator.serviceWorker.getRegistrations().length` = 0, `caches.keys()` = [], `curl -I https://nexusdeveloppement.fr/sw.js` → 404. Rechargement hors-ligne (Playwright `setOffline(true)` + `page.reload()`) → `net::ERR_INTERNET_DISCONNECTED`, page `chrome-error://chromewebdata/` (dino : « Appuyez sur la barre d'espace pour jouer »), car le HTML est servi `Cache-Control: public, max-age=0, must-revalidate` (curl). Chrome (developer.chrome.com/blog/update-install-criteria) : le SW n'est plus requis pour installer « since version 108 on mobile and 112 on Desktop », Chrome affiche alors sa propre page hors-ligne. iOS applique `display` du manifest sans contrôler la taille des icônes (icône prise dans `apple-touch-icon`, index.html:56). Aujourd'hui Chrome refuse l'icône (console live : `Error while trying to use the following icon from the Manifest: https://nexusdeveloppement.fr/favicon.png (Resource size is not correct - typo in the Manifest?)`) : l'installation Android/desktop n'est bloquée que par le bug d'icône déjà connu ; sur iOS le piège est actif dès maintenant.
- Impact : Aucun bénéfice pour un site vitrine (pas d'usage hors-ligne, pas de notifications), mais une « app » qui masque l'URL et le cadenas pendant la saisie des formulaires, bloquée sur une page d'erreur navigateur dès que le réseau manque au lancement, et sans bouton recharger quand un chunk échoue. Le jour où l'icône est corrigée, Chrome proposera « Installer Nexus Développement » dans l'omnibox desktop et sur Android.
- Correctif : Option retenue : manifest minimal. Dans public/manifest.webmanifest, supprimer `display` (défaut « browser », ou l'écrire explicitement `"display": "browser"`), `orientation` et `categories` ; garder name/short_name/description/lang/start_url/scope/theme_color/background_color et les icônes corrigées (favicon-192/512, purpose any). Le site reste « ajoutable à l'écran d'accueil » comme raccourci qui ouvre le navigateur normal. Ne pas ajouter de service worker (chiffrage de l'alternative dans les notes). À faire avant ou en même temps que la correction d'icône.

**`orientation: portrait-primary` verrouille le portrait de l'app installée (tablettes Android) pour un site conçu pour le desktop**
- Sévérité : basse · Effort : XS · `public/manifest.webmanifest:11`
- Preuve : public/manifest.webmanifest:11 `"orientation": "portrait-primary"`. Le site a des mises en page paysage (Navigation.tsx:109-121 classes `xl:`, menu `md:w-[500px] md:grid-cols-2 lg:w-[600px]` l. 86). MDN (manifest/orientation) : s'applique aux contextes de navigation de premier niveau de l'app installée ; certains navigateurs ne l'appliquent pas en `display: browser`.
- Impact : Sur tablette Android installée en WebAPK, la rotation paysage est refusée ; ignoré sur iOS et desktop. Aucun cas d'usage : un site vitrine n'a pas de raison de forcer l'orientation.
- Correctif : Supprimer la ligne (sans objet une fois `display` standalone retiré).

**`categories` : « developer » n'existe pas dans la liste W3C et « productivity » décrit une application, pas une agence**
- Sévérité : basse · Effort : XS · `public/manifest.webmanifest:12`
- Preuve : public/manifest.webmanifest:12 `"categories": ["business", "productivity", "developer"]`. Liste des catégories standardisées (github.com/w3c/manifest/wiki/Categories, 28 valeurs : books, business, education, entertainment, finance, …, utilities, weather) : ni « developer » ni « developer tools » n'y figurent.
- Impact : Nul pour les visiteurs (les catégories ne servent qu'aux catalogues/stores qui listent des PWA), mais métadonnée fausse : le site n'est ni un outil de développeur ni un outil de productivité.
- Correctif : Supprimer le membre `categories`.

**Icônes déclarées `any maskable` avec des PNG transparents sans marge : ~24 % du logo hors zone de sécurité, fond rempli par l'OS**
- Sévérité : basse · Effort : XS · `public/manifest.webmanifest:18`
- Preuve : public/manifest.webmanifest:18 et :24 `"purpose": "any maskable"` (une seule image pour les deux usages). Analyse sharp (node, lecture seule) : favicon-512.png 512×512, alpha, 83,8 % de pixels transparents, 4 coins RGBA [76,105,113,0], contenu opaque de x 56→457 / y 14→501 (78,5 % × 95,3 % de l'image), 10 398 px opaques (24,6 %) hors du cercle de sécurité de rayon 40 % ; favicon-192.png : 24,0 % hors zone ; favicon.png (48 px) : 23,2 %. web.dev/articles/maskable-icon : le logo doit tenir « within a circular area in the center of the icon with a radius equal to 40% of the icon width », l'image doit être opaque avec marge, et « We don't recommend using multiple purposes for maskable icons ».
- Impact : Dès que les chemins d'icônes seront corrigés (constat déjà connu), les launchers Android (icônes adaptatives) rogneront le haut et le bas du logo et peindront le fond transparent en blanc ou noir : icône d'accueil dégradée. Les mêmes fichiers sont corrects en `purpose: any`.
- Correctif : Déclarer favicon-192.png et favicon-512.png en `"purpose": "any"` seulement. Si une maskable est voulue : générer `public/icon-maskable-512.png` avec le logo à ≤ 80 % du diamètre sur fond opaque #0a0f1e (sharp est déjà en devDependency : `resize(400,400)` + `extend({top:56,bottom:56,left:56,right:56,background:'#0a0f1e'})`) et la déclarer dans une entrée séparée.

**`apple-touch-icon` pointe vers un PNG transparent (taille déclarée 180, fichier 192) : iOS remplit le transparent en noir**
- Sévérité : basse · Effort : XS · `index.html:56`
- Preuve : index.html:56 `<link rel="apple-touch-icon" sizes="180x180" href="/favicon-192.png" />` (idem dist/index.html:56 et toutes les pages pré-rendues). sharp : favicon-192.png 192×192, hasAlpha=true, 83,6 % de pixels transparents, 4 coins alpha = 0. Comportement documenté (realfavicongenerator.net/blog/apple-touch-icon-turns-black ; makandracards « Do not use transparent PNGs for iOS favicons ») : iOS compose l'icône sur du noir et n'accepte pas la transparence.
- Impact : Le raccourci iOS « Sur l'écran d'accueil » affiche le logo sur une tuile noire, pas sur le bleu nuit du site ; c'est aujourd'hui le seul chemin d'installation réellement actif (Chrome refuse l'icône du manifest).
- Correctif : Générer `public/apple-touch-icon.png` 180×180 opaque (fond #0a0f1e, logo ~80 %) avec sharp et pointer index.html:56 dessus.

**`background_color` #0f172a et `theme_color` #1e3a8a ne correspondent à aucune couleur réellement peinte (body #0a0f1e, premier rendu #020817)**
- Sévérité : basse · Effort : XS · `public/manifest.webmanifest:7`
- Preuve : public/manifest.webmanifest:7-8 `"background_color": "#0f172a"`, `"theme_color": "#1e3a8a"` ; index.html:19 `<meta name="theme-color" content="#1e3a8a" />`. Couleurs peintes : index.html:402 CSS critique `background: hsl(222.2 84% 4.9%)` = #020817 (conversion node) ; src/index.css:190-194 `body { @apply bg-background text-foreground; background-color: #0a0f1e; }` (le littéral écrase `bg-background` = #0f1729) ; live `getComputedStyle(document.body).backgroundColor` = rgb(10, 15, 30) ; Navigation.tsx:86 `bg-[#0A0F1E]/95`. Contrastes (node) : #1e3a8a vs body #0a0f1e = 1,84:1 (bandeau bleu roi sur page quasi noire) ; #1e3a8a vs blanc = 10,36:1 (texte de la barre lisible : pas de problème de contraste). Complémentaire du constat connu « trois couleurs de fond » côté CSS : ici c'est le manifest qui n'est aligné sur aucune d'elles.
- Impact : Splash Android en #0f172a, puis flash #020817, puis #0a0f1e au lancement ; barre d'adresse Chrome Android bleu roi au-dessus d'une page bleu nuit pour tous les visiteurs mobiles (le meta theme-color s'applique aussi en navigation normale). Cosmétique.
- Correctif : Aligner sur la couleur réelle : `"background_color": "#0a0f1e"` et, sauf choix de marque assumé, `theme_color` + meta index.html:19 en #0a0f1e ; passer le CSS critique index.html:402 à #0a0f1e (cf. constat connu).

**Le manifest et le `theme-color` de l'agence sont servis sur les 4 démos : « installer » /restaurant crée une app « Nexus » qui s'ouvre sur l'accueil agence**
- Sévérité : basse · Effort : S · `index.html:60`
- Preuve : index.html:60 `<link rel="manifest" href="/manifest.webmanifest" />` et :19 theme-color sont dans le template unique des 25 routes pré-rendues ; `curl https://nexusdeveloppement.fr/restaurant | grep -oE '<(link|meta)[^>]*(manifest|theme-color)[^>]*>'` → `<link rel="manifest" href="/manifest.webmanifest">` et `<meta name="theme-color" content="#1e3a8a">` (idem /salon-coiffure) ; src/components/SEO.tsx ne pose aucun theme-color par page (`grep -n theme src/components/SEO.tsx` → rien). manifest:5 `start_url: "/"`, :10 `scope: "/"`.
- Impact : Un prospect qui ajoute la démo restaurant à son écran d'accueil obtient une icône et un nom « Nexus » qui lancent la home de l'agence ; la barre Chrome Android reste bleu agence sur des démos aux chartes or / rose-gold. Incohérent avec la présentation des démos comme « réalisations ».
- Correctif : Si `display` standalone est retiré, l'incohérence se réduit au raccourci : acceptable. Sinon, ne pas émettre le `<link rel=manifest>` sur les routes de démo et poser un theme-color par démo dans SEO.tsx.

**Validation : Chrome refuse déjà l'icône du manifest (console live) et Lighthouse n'audite plus le PWA — l'outil de contrôle est DevTools › Application › Manifest**
- Sévérité : info · Effort : XS · `public/manifest.webmanifest:15`
- Preuve : Console Chromium sur https://nexusdeveloppement.fr/ (Playwright, deux chargements) : `[warning] Error while trying to use the following icon from the Manifest: https://nexusdeveloppement.fr/favicon.png (Resource size is not correct - typo in the Manifest?)` — conséquence directe de manifest:15-16 (`/favicon.png` déclaré `192x192`, fichier réel 48×48 : constat connu). developer.chrome.com/docs/lighthouse/pwa : « PWA testing in Lighthouse is deprecated ». web.dev/articles/install-criteria : le manifest « must include a 192px and a 512px icon », `display` parmi fullscreen/standalone/minimal-ui. Le manifest lui-même est bien récupéré et parsé (Content-Type `application/manifest+json`, JSON valide via `node -e JSON.parse`).
- Impact : Aucun score Lighthouse ne signalera l'état PWA du site. Aujourd'hui l'installation Chrome (WebAPK Android, desktop) est refusée uniquement à cause de l'icône : corriger l'icône seule activerait le mode standalone partout (constat display). Comportement exact du repli Android (raccourci simple) déduit des critères Chrome, non testé sur appareil.
- Correctif : Après toute modification du manifest, vérifier sur le site live dans DevTools › Application › Manifest (Installability, Icons) plutôt que Lighthouse ; appliquer le constat display en même temps que la correction d'icône.

**Pas de membre `id` : l'identité de l'app dérive de `start_url`**
- Sévérité : info · Effort : XS · `public/manifest.webmanifest:5`
- Preuve : `node -e` JSON.parse sur public/manifest.webmanifest : clés = name, short_name, description, start_url, display, background_color, theme_color, lang, scope, orientation, categories, icons ; `id: undefined`, `screenshots: undefined`. Chrome dérive alors l'identifiant de `start_url` (« / »).
- Impact : Sans objet si le mode standalone est retiré. Si l'installabilité est conservée : tout changement futur de `start_url` (ex. `/?utm_source=pwa`) créerait une seconde app au lieu de mettre à jour l'existante.
- Correctif : Uniquement si l'option service worker est choisie : ajouter `"id": "/"`. Sinon rien.

**Le cache HTTP ne remplace pas un mode hors-ligne : HTML `must-revalidate`, assets `immutable`, aucune Cache Storage — hors-ligne = page d'erreur, en ligne = fraîcheur immédiate**
- Sévérité : info · Effort : XS · `vercel.json:39`
- Preuve : curl -I live : `/` → `Cache-Control: public, max-age=0, must-revalidate`, `text/html` ; `/manifest.webmanifest` → `max-age=0, must-revalidate`, `application/manifest+json; charset=utf-8` ; `/assets/Index-48paTF2B.js` → `public, max-age=31536000, immutable`, `application/javascript` (vercel.json:39 `/assets/(.*)` et :51 `/(.*).js`) ; `/favicon-192.png`, `/favicon-512.png` → immutable 1 an (vercel.json:82 `/(.*).png`). Live : `caches.keys()` = [] et 0 service worker. Test hors-ligne (Playwright) : `page.reload()` → `net::ERR_INTERNET_DISCONNECTED` malgré les assets en cache navigateur, car le HTML doit être revalidé et rien ne peut le servir.
- Impact : C'est la bonne stratégie pour un site vitrine sans SW : chaque déploiement est visible à la navigation suivante et aucun visiteur ne reste sur une vieille version. Elle n'offre par construction aucun hors-ligne (le HTML n'est jamais servi depuis le cache) : c'est le `display: standalone` qui est incohérent, pas le cache.
- Correctif : Rien à changer pour l'option manifest minimal. Pour l'option service worker, ajouter dans vercel.json une règle `/sw.js` → `Cache-Control: no-cache` : la règle `/(.*).js` :51 lui appliquerait sinon `immutable` 1 an (`curl -I /sw.js` renvoie déjà `Cache-Control: public, max-age=31536000, immutable` sur le 404).

**Rebranding « Ned » : `name`/`short_name` du manifest et icônes servies `immutable` 1 an sous des noms fixes**
- Sévérité : info · Effort : XS · `public/manifest.webmanifest:2`
- Preuve : public/manifest.webmanifest:2-3 `"name": "Nexus Développement"`, `"short_name": "Nexus"` ; index.html:53-57 pointent vers /favicon-32.png, /favicon-192.png, /favicon-512.png, /favicon.ico ; `curl -I /favicon-192.png` et `/favicon-512.png` → `Cache-Control: public, max-age=31536000, immutable` (règle vercel.json:82 `/(.*).png`).
- Impact : Au passage à Ned, remplacer le contenu des PNG sous le même nom laissera l'ancien logo Nexus dans les raccourcis et onglets des navigateurs qui l'ont en cache (jusqu'à un an) ; le manifest, lui, est en `max-age=0` et se mettra à jour tout de suite.
- Correctif : Le jour J : nouveaux noms de fichiers (`icon-ned-192.png`, `icon-ned-512.png`, `apple-touch-icon-ned.png`), mise à jour de manifest:2-3, :15/:21 et index.html:53-57 dans la même PR.

Points forts relevés : Le manifest est servi avec le bon type MIME (`Content-Type: application/manifest+json; charset=utf-8`) et en `Cache-Control: public, max-age=0, must-revalidate` (curl -I live) : toute correction est visible immédiatement ; le contenu live est identique au dépôt (711 octets live vs 738 : seule différence, les fins de ligne CRLF locales). ; JSON valide (`node -e JSON.parse`), membres essentiels présents et cohérents : name, short_name, description en français, `lang: fr-FR`, `start_url` et `scope` = `/` alignés sur la redirection www → apex de vercel.json ; `theme_color` #1e3a8a identique au meta theme-color d'index.html:19 ; `<link rel=manifest>` (index.html:60) présent sur toutes les pages pré-rendues (vérifié sur /, /restaurant, /salon-coiffure). ; `theme_color` #1e3a8a est lisible : contraste 10,36:1 avec le texte et les icônes blancs de la barre d'état/adresse (calcul node) — pas de problème d'accessibilité sur ce point. ; Stratégie de cache HTTP correcte pour la fraîcheur : HTML `max-age=0, must-revalidate`, fichiers hashés `/assets/*` en `immutable` 1 an avec le bon `Content-Type: application/javascript` (curl -I /assets/Index-48paTF2B.js) : un déploiement est pris en compte à la navigation suivante, sans HTML périmé. ; Aucun service worker enregistré ni Cache Storage (`getRegistrations()` = 0, `caches.keys()` = [] en live) : aucun visiteur ne peut rester coincé sur une vieille version et il n'y a rien à purger en cas d'incident — la simplicité est un atout pour un site vitrine. ; Le découpage lazy par route est effectif : les chunks Team-*.js et CGV-*.js ne sont récupérés qu'à la navigation (observé dans les logs réseau/console live), donc la surface d'échec hors-ligne se limite aux navigations internes ; la page d'accueil pré-rendue, une fois chargée, est complète.
