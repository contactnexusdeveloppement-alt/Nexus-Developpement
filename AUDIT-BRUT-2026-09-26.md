# Audit complet — constats bruts (2026-09-26)

Site : https://nexusdeveloppement.fr — dépôt HEAD c430dff (2026-05-16).

État : le workflow d'audit (10 auditeurs spécialisés puis dédoublonnage, vérification adversariale et synthèse) a été interrompu par la limite d'utilisation. Les constats de la section « Constats des auditeurs » sont BRUTS : non dédoublonnés, non vérifiés, classés par sévérité annoncée par l'auditeur. Les 10 auditeurs (archi, securite, seo, rgpd, a11y, perf, ux, devops, live, api) ont été interrompus avant de rendre leurs constats structurés : aucun constat d'auditeur n'a pu être récupéré. Ce fichier contient donc uniquement les mesures Lighthouse et les constats vérifiés manuellement. À relancer : le workflow complet (script audit-nexus-site) une fois la limite d'utilisation levée.

# Lighthouse 12, mobile simulé (Moto G, 4G lent), exécuté le 2026-09-26 sur le site live

| Page | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|---|---|---|
| / (home) | 69 | 96 | 93 | 100 | 3,0 s | 5,1 s | 180 ms | 0 | 5,3 s |
| /creation-site-web | 81 | 98 | 93 | 100 | 2,8 s | 3,7 s | 10 ms | 0 | 5,0 s |
| /agence-web-versailles | 84 | 100 | 93 | 100 | 2,5 s | 3,5 s | 60 ms | 0 | 5,0 s |

Home, détails : 52 requêtes, 22 scripts, 1 208 kB transférés, 1 111 éléments DOM, main thread 4,9 s (script evaluation 1,3 s, style/layout 1,16 s), bootup dominé par assets/AnimatedBackground-*.js. Élément LCP : le paragraphe du hero (`p.text-xl.md:text-2xl`), à 5,1 s. Serveur : 20 ms (TTFB excellent, le problème est côté rendu client).
- render-blocking : assets/index-*.css (119 kB) et /fonts/fonts.css → 830 ms estimés.
- Images non responsives / mal dimensionnées : /restaurant/screenshot.webp, /salon/screenshot.webp, engagement-maintenance-*.webp, et une image externe hotlinkée https://images.unsplash.com/photo-1451187580459-43490279c0fa (309 kB d'économies estimées).
- uses-rel-preconnect : images.unsplash.com (310 ms).
- unused CSS 11 kB, unused JS 21 kB (react-vendor), ui-vendor signalé « unminified » (6 kB).
- Accessibilité : un bouton avec contraste insuffisant (div.flex > div.flex > button.group), et le lien logo de la nav a un aria-label qui ne contient pas son texte visible (label-content-name-mismatch).
- Best practices : erreur console CSP (une feuille de style Google Fonts est bloquée par la CSP style-src 'self'), plus une « inspector issue » CSP.
Le site affiche « Performance garantie : Score Google PageSpeed 95+ sur tous nos projets » alors que sa propre home est à 69 en mobile.


## Constats vérifiés manuellement (navigateur intégré + code)

- **Menu cassé entre 768 et ~1030 px** (haute, S) : src/components/Navigation.tsx:98 passe le menu desktop en flex dès md (768 px). Mesuré à 768 px : « Notre Équipe » (x 738-822) et « Demander un devis » (x 846-1028) sont hors écran, et le logo (16-144) chevauche « Services » (144-257). Correctif : passer le menu desktop sur lg: ou réduire logo/gaps en md.
- **Bandeau cookies inutile et non conforme** (haute, S) : src/components/CookieConsent.tsx:11-19, localStorage cookieConsent n'est écrit que par handleAccept ; la croix (handleClose, l. 35) ne mémorise rien, le bandeau revient à chaque page. Texte « En continuant votre navigation, vous acceptez » = formule refusée par la CNIL. Aucun traceur (GA commenté dans index.html), les cookies strictement nécessaires sont exemptés de consentement : supprimer le bandeau (ou une mention simple, sans bouton Accepter).
- **@import Google Fonts bloqué par la CSP** (moyenne, XS) : src/index.css:1 importe Playfair Display + Inter depuis fonts.googleapis.com alors que les polices sont auto-hébergées (public/fonts). La CSP style-src 'self' bloque la requête : erreur console sur toutes les pages (relevée par Lighthouse), pénalité best-practices. Idem src/styles/restaurant/index.css:1 (Lato/Oswald) et src/pages/Concession.tsx:13-15 (Montserrat/Outfit) : les démos n'ont jamais leurs polices. Supprimer ces imports.
- **Newsletter du footer factice** (moyenne, S) : src/components/Footer.tsx:107-112, un input et un bouton sans form/onSubmit/fetch ; le texte « En vous inscrivant, vous acceptez notre politique de confidentialité » promet un traitement qui n'existe pas. Retirer le bloc ou le brancher.
- **Lien « Consulting » du footer** (basse, XS) : src/components/Footer.tsx:55 pointe vers #services, ancre qui n'existe que sur la home.
- **Promesse « Score Google PageSpeed 95+ sur tous nos projets » contredite par le site lui-même** (haute, M) : Lighthouse mobile home = 69 (tableau ci-dessus). Retirer la promesse ou tenir l'objectif : LCP 5,1 s à cause du CSS bloquant (119 kB), d'AnimatedBackground, d'images non redimensionnées et d'une image Unsplash hotlinkée (src/data/projects.ts:97).
- **Live différent du dépôt** (à trancher) : HTML live Last-Modified 2026-09-09, dernier commit 2026-05-16 ; le title live de la home diffère de index.html du dépôt. Vérifier si des changements ont été déployés sans être commités.

## Constats des auditeurs

Non disponibles (workflow interrompu, voir ci-dessus).

## Points forts relevés (vérifiés manuellement)

- Pré-rendu réel des 25 routes (HTML complet servi aux crawlers), SEO Lighthouse 100/100 sur les 3 pages testées.
- Headers de sécurité complets sur le live (CSP, HSTS preload, X-Frame-Options DENY, nosniff, Permissions-Policy), TTFB 20 ms.
- Accessibilité Lighthouse 96 à 100, CLS 0 sur toutes les pages testées.
- Polices auto-hébergées avec preload, images en WebP, build qui passe.
