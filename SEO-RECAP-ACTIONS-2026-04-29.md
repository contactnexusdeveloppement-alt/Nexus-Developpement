# Récap actions SEO — 29 avril 2026 (session autonome)

## ✅ Fait par moi (en autonomie)

### Fichiers de code (commits `55a1a19` + `679122c`)
- `public/sitemap.xml` — version simplifiée + `/cgv` et `/cookies` ajoutés
- `public/llms.txt` — créé (pour AI crawlers GPTBot, ClaudeBot, PerplexityBot)
- `public/robots.txt` — `/nx-panel-8f4a` retiré, 14 AI bots autorisés explicitement
- `index.html` — 3 schemas JSON-LD enrichis (Organization avec SIREN/TVA, LocalBusiness avec areaServed enrichi, WebSite ajouté)
- `vercel.json` — redirect `www`→apex (308), cache long sur MP4/WebM/PNG, headers spécifiques pour `/llms.txt` et `/sitemap.xml`
- `vite.config.ts` — `manualChunks` (split bundle JS) + **pre-rendering Puppeteer** des 17 routes publiques
- `src/main.tsx` — dispatch `render-event` pour Puppeteer
- `package.json` — ajout `@prerenderer/rollup-plugin` + `@prerenderer/renderer-puppeteer`

**Résultats mesurables :**
- Bundle initial : **305 KB → 81 KB** (−73 %)
- Vidéo Concession : **34 MB → 3.3 MB** (−90 %, via ffmpeg installé via winget)
- Build : **17 fichiers HTML statiques générés** (vs 1 vide avant) → bots Google + AI voient maintenant le vrai contenu

### Google Business Profile
- ✅ **4 avis sur 4 répondus** (Adelson, BodyStart Nutrition, Théo, Adam) avec messages personnalisés contenant des mots-clés SEO (boutique en ligne, salon, agence digitale Île-de-France, transformation digitale)

---

## ⚠️ Bloqué (raisons techniques) — à faire par vous

### 1. Compléter la fiche GBP (3 min, gain SEO local +5)
L'éditeur GBP est trop dynamique pour automatisation fiable. **À faire manuellement :**
1. Rouvrir https://www.google.com/search?q=Nexus+Developpement+Elancourt
2. Cliquer **"Éditer la fiche"**
3. Onglet **À propos** → "Catégorie d'activité" → ajouter 2-3 catégories secondaires :
   - Agence de communication
   - Société de conseil informatique
   - Agence de marketing digital
4. Onglet **Plus** → "Services" → ajouter chaque service avec description courte + prix indicatif :
   - Création de site web (à partir de 890 €)
   - Application mobile (sur devis)
   - Automatisation de processus (sur devis)
   - Identité visuelle (sur devis)
5. Onglet **Photos** → uploader 3-5 photos : logo, bureau (si possible), captures de réalisations

### 2. Homologuer la LinkedIn Company Page (10 min, gain backlink DA 90)
La page existe (`linkedin.com/company/nexus-developpement`) mais elle est **auto-générée par LinkedIn** et non homologuée. Adresse erronée (Saint-Germain-en-Laye au lieu d'Élancourt).

**Pour l'homologuer :**
1. Sur **votre profil LinkedIn personnel** (`linkedin.com/in/...`), section **Expérience** → **Ajouter un poste** :
   - Intitulé : Co-fondateur (ou votre rôle)
   - Entreprise : commencer à taper "Nexus Developpement", LinkedIn proposera la page existante → **sélectionner**
   - Date début : 22 décembre 2025 (date de création de la SARL)
2. Une fois fait, retourner sur https://www.linkedin.com/company/nexus-developpement/
3. Le bouton **"Homologuer cette page"** apparaîtra → cliquer
4. LinkedIn valide en 24-72h
5. Une fois validée : **Modifier la page** → corriger :
   - Adresse : 4 rue de la Ferme, 78990 Élancourt
   - Site web : `https://nexusdeveloppement.fr`
   - Secteur : Services et conseil informatique
   - Description complète (vous pouvez copier le contenu de `public/llms.txt`)
   - Logo (utiliser `public/nexus-logo.webp`)

### 3. Email pro `contact@nexusdeveloppement.fr` (5 min + ~1 €/mois)
Hostinger n'a pas de plan email actif sur votre compte. Trois options :

**Option A — Hostinger** (le plus simple, 1 €/mois) :
1. https://hpanel.hostinger.com/emails → choisir le plan le moins cher (Email Starter ~0.99 €/mois)
2. Domaine : nexusdeveloppement.fr
3. Créer la boîte `contact@nexusdeveloppement.fr`
4. Configurer un transfert (forward) vers `contact.nexus.developpement@gmail.com` → ainsi vous présentez l'adresse pro mais recevez tout sur Gmail

**Option B — Cloudflare Email Routing** (gratuit, mais nécessite de migrer le DNS) :
1. Créer compte Cloudflare gratuit
2. Ajouter `nexusdeveloppement.fr`
3. Changer les nameservers Hostinger vers ceux de Cloudflare
4. Réimporter les 6 records DNS actuels (DKIM, MX, SPF, etc.)
5. Activer Email Routing → créer alias `contact@` qui forward vers Gmail

**Option C — Garder Gmail** (gratuit, mais signal négatif persistant pour les responsables marketing PME)

**Une fois fait** : remplacer dans `index.html` (les 2 schemas LocalBusiness et Organization), `public/llms.txt`, `src/components/Footer.tsx`, `src/components/Contact.tsx` toutes les occurrences de `contact.nexus.developpement@gmail.com` par `contact@nexusdeveloppement.fr` — je peux faire ce remplacement quand vous me confirmez la création de l'email.

### 4. Inscriptions backlinks tier 1 (30 min total, gain backlinks DA 60-85)

Pour chacune, **vous créez le compte vous-même** (sécurité) et copiez les infos suivantes :

**Données NAP standardisées à utiliser partout :**
```
Nom : Nexus Développement
Adresse : 4 rue de la Ferme, 78990 Élancourt, France
Téléphone : +33 7 61 84 75 80
Email : contact.nexus.developpement@gmail.com (ou contact@... si vous avez fait l'étape 3)
Site web : https://nexusdeveloppement.fr
SIREN : 995394095
SIRET : 995 394 095 00013
TVA : FR49995394095
RCS : Versailles
Date de création : 22 décembre 2025
Description courte : Agence digitale française basée à Élancourt (78), spécialisée dans la création de sites web, applications mobiles, automatisation de processus et identité visuelle pour TPE et PME.
```

**Plateformes par ordre de priorité :**

| # | Plateforme | URL inscription | Effort | DA |
|---|---|---|---|:---:|
| 1 | **Sortlist** | https://www.sortlist.fr/register | 10 min (profil + portfolio) | 65 |
| 2 | **Clutch** | https://clutch.co/get-listed | 15 min | 80 |
| 3 | **Codeur.com** | https://www.codeur.com/annuaire/ajoutez-votre-agence | 5 min | 60 |
| 4 | **Pages Jaunes Pro** | https://www.pagesjaunes.fr/professionnel/inscription | 5 min | 85 |
| 5 | **Bing Places** | https://www.bingplaces.com | 5 min (synchronisé GBP) | 85 |
| 6 | **Apple Maps Connect** | https://mapsconnect.apple.com | 5 min | — (Maps iOS) |
| 7 | **Yelp FR** | https://business.yelp.fr/add | 5 min | 80 |
| 8 | **Kompass** | https://fr.kompass.com/registration | 5 min | 70 |
| 9 | **GoodFirms** | https://www.goodfirms.co/company/add | 5 min | 68 |
| 10 | **Manageo** | https://www.manageo.fr | 5 min | 50 |

### 5. Calendrier éditorial blog (long terme)
Le calendrier complet de **26 semaines / 30 articles** est dans `SEO-AUDIT-2026-04-29.md` (rapport seo-cluster). Briefs détaillés inclus pour chaque article.

**Workflow recommandé :**
- Décider qui rédige (vous / rédacteur freelance / Claude à votre demande)
- Cadence cible : 1 article/semaine
- Premier article à publier : pilier "Création de site web TPE/PME : guide complet 2026" (3500 mots)

---

## 📊 Bilan SEO

| Score | Avant | Après actions auto | Après actions manuelles |
|---|:---:|:---:|:---:|
| **Global** | 41/100 | **62/100 estimé** | **78/100 cible** |
| Technical SEO | 54 | 80 (pre-rendering) | 85 |
| Schema | 42 | 81 | 85 |
| Performance | 62 | 78 (bundle + vidéo) | 85 |
| GEO (AI search) | 18 | 70 (pre-render + llms.txt) | 80 |
| Local SEO | 14 | 55 (avis répondus) | 75 (GBP optimisée) |
| Backlinks | 5 | 5 | 35 (10 inscriptions) |
| Content | 51 | 51 | 75 (avec blog) |

---

## 🚀 Vercel : déploiement auto en cours

Le commit `679122c` a déclenché un nouveau déploiement Vercel. Dans 2-3 min, le site en prod devrait servir :
- 17 pages HTML pré-rendues (au lieu de la SPA vide)
- La vidéo Concession à 3.3 MB au lieu de 34 MB
- Les nouveaux schemas JSON-LD enrichis
- llms.txt accessible sur https://nexusdeveloppement.fr/llms.txt

**Test rapide à faire dans 5 min** : https://nexusdeveloppement.fr/creation-site-web → clic droit "Voir source" → vous devriez voir tout le contenu de la page directement dans le HTML (avant on voyait juste `<div id="root"></div>` vide).
