# GitHub Actions — Build + deploy avec pre-rendering

## Pourquoi ce workflow ?

Le pre-rendering Puppeteer (générer 23 fichiers HTML statiques avec le contenu
React déjà rendu côté serveur) ne fonctionne pas dans le sandbox build Vercel
(Chrome ne peut pas s'y lancer, exit code 127). On déporte donc le build en
GitHub Actions qui peut installer Chrome librement, puis on upload le `dist/`
déjà construit sur Vercel via `vercel deploy --prebuilt --prod`.

Résultat : Google et les AI crawlers (GPTBot, ClaudeBot, Perplexity) voient
directement le contenu HTML de chaque page sans avoir à exécuter JavaScript.
Impact massif sur le SEO et le GEO (Generative Engine Optimization).

## Setup en 3 étapes (à faire 1 seule fois)

### 1. Créer un Vercel Token

- Va sur <https://vercel.com/account/tokens>
- Clique **Create Token**, nomme-le `github-actions-nexus`, scope `Full Account`
- Copie le token généré (il ne sera plus affiché ensuite)

### 2. Ajouter le token dans GitHub Secrets

- Va sur <https://github.com/contactnexusdeveloppement-alt/Nexus-Developpement/settings/secrets/actions>
- Clique **New repository secret**
- Name : `VERCEL_TOKEN`
- Secret : colle le token Vercel
- Clique **Add secret**

### 3. Déclencher le premier déploiement

- Soit push un nouveau commit sur `main`
- Soit va sur l'onglet **Actions** du repo, sélectionne le workflow,
  clique **Run workflow** → branche `main`

## Comment ça marche

1. `actions/checkout@v4` clone le repo
2. `actions/setup-node@v4` installe Node 20 + cache npm
3. `npm ci` installe les dépendances
4. `npx puppeteer browsers install chrome` télécharge Chrome compatible Puppeteer
5. `npm run build` avec `PRERENDER=true` génère le `dist/` avec les 23 pages HTML statiques
6. `vercel pull` récupère la config Vercel du projet
7. `vercel build --prod` packe le dist au format Vercel
8. `vercel deploy --prebuilt --prod` upload sur Vercel sans rebuild

Durée totale moyenne : 6-8 minutes.

## Notes

- Le déploiement Git automatique de Vercel est désactivé via `vercel.json`
  (`git.deploymentEnabled.main = false`), pour éviter les double-builds.
- Si le workflow échoue, regarde les logs dans l'onglet Actions GitHub.
- Pour tester en local le pre-rendering : `PRERENDER=true npm run build`
  (nécessite que Chrome soit installé via `npx puppeteer browsers install chrome`).
