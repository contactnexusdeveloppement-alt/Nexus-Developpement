# Nexus Développement — Site vitrine

Site officiel : https://nexusdeveloppement.fr

## Stack

- **Frontend** : Vite 5 + React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend** : Vercel Edge Functions (`/api/*`)
- **Email** : Resend (clé serveur Vercel uniquement)
- **Hébergement** : Vercel (région CDG1)

Aucune base de données. Aucun back-office. Tous les leads tombent par email à `contact.nexus.developpement@gmail.com`.

## Développement local

Prérequis : Node.js ≥ 20, Vercel CLI (pour tester les `/api/*` localement).

```bash
# Cloner et installer
git clone https://github.com/contactnexusdeveloppement-alt/Nexus-Developpement.git
cd Nexus-Developpement
npm install

# Pour le frontend seul (pas les /api)
npm run dev   # http://localhost:8080

# Pour tester le frontend + les Vercel Functions ensemble :
npm install -g vercel
vercel dev    # http://localhost:3000 (avec /api/* fonctionnels)
```

Pour `vercel dev`, créez un fichier `.env.local` à la racine avec :
```
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Nexus Développement <noreply@send.nexusdeveloppement.fr>
ADMIN_EMAIL=contact.nexus.developpement@gmail.com
```

## Vercel Functions

Deux Edge Functions dans `api/` :

| Endpoint | Déclencheur | Rôle |
|---|---|---|
| `POST /api/send-quote` | Formulaire "Demande de devis" | Valide, envoie 2 emails (admin + client) |
| `POST /api/book-call` | Formulaire "Réserver un appel" | Valide créneau, envoie 2 emails |

Toutes ont : validation stricte, rate-limiting en mémoire, CORS restreint, escape HTML, cap de taille body.

## Structure

```
api/                    # Vercel Edge Functions
├── _lib/               # Helpers partagés (cors, validation, rate-limit)
├── send-quote.ts
└── book-call.ts
src/
├── components/         # Composants React (Hero, Pricing, QuoteForm, etc.)
├── pages/              # Pages routées (Index, WebsiteCreation, etc.)
├── hooks/              # Hooks custom (useTypewriter, useToast, use-mobile)
├── lib/                # Utilitaires (cn helper)
├── data/               # Données statiques (projets, pricing)
├── styles/             # CSS spécifiques aux démos
└── assets/             # Images bundlées
public/                 # Assets servis bruts
```

## Variables d'environnement (Vercel Dashboard)

| Nom | Description |
|---|---|
| `RESEND_API_KEY` | Clé Resend (côté serveur) |
| `RESEND_FROM_EMAIL` | Adresse expéditrice (ex: `Nexus Développement <noreply@send.nexusdeveloppement.fr>`) |
| `ADMIN_EMAIL` | Adresse de réception des leads |

⚠️ **Aucune variable préfixée `VITE_*`** : les clés ne doivent pas être bundlées côté client.

## Sécurité

- Aucune clé secrète n'est jamais bundlée côté client.
- CSP, HSTS preload, X-Frame-Options DENY, etc. dans `vercel.json`.
- Toutes les Vercel Functions valident, rate-limitent, et escapent les inputs.
- Voir `AUDIT_COMPLET_2026-04-29.md` pour l'historique sécurité.

## Déploiement

Push sur `main` → Vercel déploie automatiquement.
