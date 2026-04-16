# 🛡️ Audit de Sécurité & Conformité — Nexus Développement

> Date : 16 avril 2026
> Périmètre : repo https://github.com/contactnexusdeveloppement-alt/Nexus-Developpement
> Stack : Vite + React + TypeScript + Supabase + Vercel + Resend

---

## 🚨 Failles CRITIQUES (à traiter en priorité absolue)

### 1. Clé API Resend exposée publiquement ⚠️🔴
**Fichier :** `.env` (committé dans le repo public)
**Valeur exposée :** `VITE_RESEND_API_KEY="re_GD7jZvTi_LYh4oM8r72Hk9npriAwEZkjw"`

**Impact :**
- La clé Resend est une clé **secrète** permettant d'envoyer des emails depuis votre compte.
- Préfixée `VITE_`, elle est **bundlée côté client** : n'importe quel visiteur peut la lire dans le code JS du navigateur.
- Elle est aussi visible dans l'historique Git public → tout le monde peut la récupérer.
- Risque : usurpation d'identité email, spam massif depuis votre domaine, phishing, coûts surfacturés sur votre compte Resend, mise en quarantaine de votre réputation expéditeur.

**Actions immédiates :**
1. **Révoquer** la clé sur https://resend.com/api-keys → "Delete".
2. **Supprimer** `.env` de l'historique Git complet :
   ```bash
   pip install git-filter-repo
   git filter-repo --path .env --invert-paths --force
   git push --force-with-lease
   ```
3. Ajouter `.env` dans `.gitignore` (actuellement absent).
4. Déplacer l'envoi d'email dans une **Supabase Edge Function** (ou route API Vercel) qui utilise la clé côté serveur uniquement. Côté client : appeler la fonction, pas Resend directement.

### 2. Clé Supabase anon exposée (moins grave mais à noter) 🟡
**Fichier :** `.env` → `VITE_SUPABASE_PUBLISHABLE_KEY`

**Impact :**
- La clé `anon` est **faite pour être publique** (c'est son rôle).
- **MAIS** sa sécurité repose **entièrement sur la qualité des politiques Row Level Security (RLS)** sur Supabase.
- Si une table n'a pas de RLS activée, n'importe quel visiteur peut lire/écrire dedans avec cette clé.

**Actions :**
- Vérifier que **TOUTES** les tables publiques ont RLS activé : `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`
- Vérifier qu'aucune table sensible (email_logs, opportunities, invoices, user_roles…) n'est accessible en `SELECT` à un rôle `anon`.

### 3. "Token d'accès" admin hardcodé dans le code client 🔴
**Fichier :** `src/pages/AdminLogin.tsx:13`
```ts
const ADMIN_ACCESS_TOKEN = "Nx8f4a-Sec2024-xK9mP";
```

**Impact :**
- Cette "sécurité par l'obscurité" est inutile : le token est dans le bundle JS public.
- N'importe qui peut lire le code source, récupérer le token, et accéder à `/nx-panel-8f4a?access=Nx8f4a-Sec2024-xK9mP`.
- Même la "randomisation" du path `/nx-panel-8f4a` est inutile pour la même raison.

**Action :** supprimer cette logique. La vraie protection est le couple `Supabase Auth + RLS + ProtectedRoute` avec vérification de rôle côté serveur. Le path peut rester customisé pour le confort, mais ne doit pas être considéré comme une mesure de sécurité.

---

## 🔶 Failles IMPORTANTES (à traiter rapidement)

### 4. Bouton « Créer un compte (1ère utilisation) » en production 🟠
**Fichier :** `src/pages/AdminLogin.tsx:177-185`

N'importe qui passant le check du token (trivial, cf. point 3) peut créer un compte. Si la règle RLS user_roles n'est pas correctement configurée, un compte créé pourrait se voir attribuer un rôle `admin` par erreur.

**Action :** supprimer le bouton de signup en production, créer les comptes admin manuellement via le dashboard Supabase.

### 5. Absence de Content Security Policy (CSP) 🟠
**Fichier :** `vercel.json`

Aucun header sécurité défini. Minimum recommandé :

```json
{
  "source": "/(.*)",
  "headers": [
    { "key": "X-Frame-Options", "value": "DENY" },
    { "key": "X-Content-Type-Options", "value": "nosniff" },
    { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
    { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
    { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
    { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co; font-src 'self' data:;" }
  ]
}
```

### 6. Préconnect vers un mauvais projet Supabase 🟠
**Fichier :** `index.html:9-10`

Le DNS prefetch pointe vers `rdrvjhhfmwtzbhljljxl.supabase.co`, mais le `.env` utilise `oowoybqlxlfcuddjxnkb.supabase.co`. Incohérence → perte de performance et potentielle fuite d'info sur un ancien projet.

### 7. Absence de rate limiting sur les formulaires 🟠
Aucune protection anti-bot / anti-spam sur le formulaire de contact ou de devis visibles. Résultat probable : floods et coûts d'email sur Resend.

**Actions recommandées :**
- hCaptcha ou Turnstile (Cloudflare) sur le formulaire public.
- Rate limiting via Vercel Edge Middleware ou Supabase Edge Function.

---

## 🟡 Points de conformité RGPD / Légal

| Document | Statut avant audit | Statut après audit |
|---|---|---|
| Mentions légales | ⚠️ incomplètes (pas de RCS, TVA, médiation) | ✅ complétées |
| CGU | ⚠️ trop courtes (5 sections) | ✅ enrichies (10 sections) |
| Politique de confidentialité | ⚠️ non conforme RGPD (pas de base légale, durées, DPO, CNIL) | ✅ refaite intégralement |
| Politique de cookies | ❌ absente | ✅ créée |
| **CGV** | ❌ **ABSENTES** (obligatoires dès qu'on vend une presta) | ✅ créées |

### ⚠️ Obligations légales encore à traiter par toi-même

1. **Déclaration CNIL simplifiée / registre RGPD** — obligatoire dès qu'on traite des données personnelles. Tenir un registre interne des traitements (article 30 RGPD).
2. **Mention TVA intracommunautaire** — à compléter dans les mentions légales dès assujettissement (ou mention "TVA non applicable, art. 293 B du CGI" si régime franchise).
3. **Médiateur de la consommation** — dès que tu as des clients particuliers, tu dois adhérer à un médiateur agréé (ex : Médiation de la consommation — AME, CNPM, etc.) et mentionner ses coordonnées dans CGV/mentions.
4. **Assurance RC Pro** — obligatoire pour certaines prestations, très fortement recommandée pour les autres (couvre erreurs, fuites de données, défauts de livrable).
5. **Clause de propriété intellectuelle dans le devis signé** — le devis DOIT référencer les CGV et les faire accepter. À ajouter à ton process commercial.
6. **DPA (Data Processing Agreement)** — à signer avec chaque client pour qui tu traites des données (art. 28 RGPD).
7. **Registre des sous-traitants** — lister formellement Vercel, Supabase, Resend (+ CCT UE-USA) dans un document interne.

---

## 📋 Failles MINEURES & Bonnes pratiques

- **`.env.example`** présent ✅ — bonne pratique.
- **Lazy loading** des pages ✅ — bien fait dans `App.tsx`.
- **`storage: localStorage`** dans le client Supabase : OK pour UX, mais le JWT y est stocké — vulnérable aux XSS. Si tu ajoutes un jour des contenus utilisateur affichés dans le DOM, force le passage à `httpOnly cookies` via une edge function.
- **`create-invoice-trigger.mjs` et autres scripts .mjs** : à vérifier qu'ils n'embarquent pas de secrets.
- **`apply_migration_draft.ts`, `execute-migrations-pg.mjs`** : scripts de migration exposés dans le repo. À déplacer dans un dossier `scripts/` non inclus dans le bundle prod.
- **Dossiers `temp_concession`, `temp_immo`, `temp_immo_fix`** : à nettoyer du repo, ressemblent à des restes de refactor.
- **`package-lock.json` committé** ✅ — bien.
- **`puppeteer` en devDep** : énorme, à supprimer s'il n'est plus utilisé.

---

## 🗺️ Plan de remédiation suggéré (par ordre)

### Semaine 1 — urgence
1. Révoquer clé Resend, nettoyer `.env` de l'historique git.
2. Ajouter `.env` au `.gitignore`.
3. Configurer les variables d'env directement sur Vercel / Netlify (plus dans le repo).
4. Supprimer `ADMIN_ACCESS_TOKEN` et le bouton signup de `AdminLogin.tsx`.
5. Ajouter les headers de sécurité dans `vercel.json`.

### Semaine 2 — conformité
6. Publier les nouvelles pages légales (déjà créées par ce commit) : /cgv, /cookies.
7. Modifier le footer du site pour inclure les liens vers CGV, CGU, mentions, confidentialité, cookies.
8. Mettre à jour `CookieConsent.tsx` pour pointer vers /cookies et implémenter un vrai consentement granulaire (nécessaire, statistiques, marketing).
9. Compléter les mentions légales (RCS, TVA, médiateur agréé).

### Semaine 3 — architecture sécu
10. Déplacer Resend dans une Supabase Edge Function.
11. Auditer les politiques RLS sur toutes les tables publiques.
12. Ajouter hCaptcha/Turnstile aux formulaires publics.
13. Mettre en place un rate limiting sur les endpoints sensibles.

### Semaine 4 — maintenance
14. Mettre à jour les dépendances (`npm audit fix`).
15. Retirer les dossiers `temp_*` du repo.
16. Documenter le registre des traitements (RGPD art. 30).
17. Sensibiliser l'équipe : les secrets ne sont JAMAIS dans `VITE_*`.

---

## 📎 Documents légaux créés ou mis à jour (ce commit)

| Fichier | État |
|---|---|
| `src/pages/CGV.tsx` | ✨ Créé — 18 articles, conforme Code de commerce + Code conso |
| `src/pages/CookiePolicy.tsx` | ✨ Créé — conforme ePrivacy + CNIL |
| `src/pages/PrivacyPolicy.tsx` | ♻️ Refait — 12 sections RGPD complètes |
| `src/pages/LegalNotice.tsx` | ♻️ Enrichi — RCS, TVA, médiation |
| `src/pages/TermsOfService.tsx` | ♻️ Enrichi — passage de 5 à 10 sections |
| `src/App.tsx` | ♻️ Routes `/cgv` et `/cookies` ajoutées |

⚠️ **Tous les textes sont génériques et doivent être relus par un juriste** avant publication définitive. Les points qui requièrent absolument ton arbitrage :
- Taux d'acompte (40/30/30 dans les CGV — adapte à ta politique).
- Durée de garantie (3 mois — standard, à valider).
- Juridiction compétente (Versailles — cohérent avec ton siège).
- Taux de TVA et régime applicable.
- Nom du médiateur agréé à insérer.

---

Un avocat spécialisé IT/propriété intellectuelle pourra valider le tout pour ~500-800 € et te fournir des versions "bulletproof" pour moins de 1 000 €. Avec ces documents comme base, la discussion ira vite.
