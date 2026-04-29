# Guide de déploiement — site nexusdeveloppement.fr

> Refonte du 29 avril 2026 : tout passe désormais par **Vercel uniquement** (plus de Supabase).
> Architecture : site vitrine React + 3 Vercel Functions pour les formulaires.

## ⏱ Temps estimé : 10 minutes (vraiment)

---

## Étape 1 — Vercel : ajouter les variables d'environnement (3 min)

1. Allez sur https://vercel.com/dashboard
2. Cliquez sur votre projet `nexus-developpement` (ou son nom)
3. **Settings** (en haut) → **Environment Variables** (menu de gauche)

### a) Supprimer les anciennes variables Supabase
Si vous voyez des variables qui commencent par `VITE_SUPABASE_*`, **supprimez-les toutes** (3 points à droite → Remove). Plus utilisées.

### b) Ajouter les 4 nouvelles variables

Pour chacune ci-dessous : cliquez **Add New** → remplissez **Key** + **Value** → cochez les 3 environnements (Production / Preview / Development) → **Save**.

| Key | Value |
|---|---|
| `RESEND_API_KEY` | Votre clé Resend (commence par `re_…`) |
| `RESEND_FROM_EMAIL` | `Nexus Développement <noreply@send.nexusdeveloppement.fr>` |
| `ADMIN_EMAIL` | `contact.nexus.developpement@gmail.com` |

⚠️ **Aucune variable ne doit commencer par `VITE_`**. Les clés `VITE_*` seraient bundlées dans le JS public.

**Vérification :** dans la liste, vous voyez 4 variables, toutes sans préfixe `VITE_`.

---

## Étape 2 — Push le nouveau code sur Git (2 min)

Dans le terminal, depuis le dossier du projet :

```bash
git add -A
git commit -m "refonte: passage 100% Vercel, suppression Supabase, formulaires via /api"
git push origin main
```

Vercel détecte le push et lance automatiquement un build (visible dans **Deployments**).

**Vérification :**
- Attendez 1-2 min que le déploiement passe au vert ✅ "Ready"
- Si le build échoue, l'erreur est dans les logs Vercel — envoyez-la moi.

---

## Étape 3 — Tester en prod (3 min)

1. Allez sur https://nexusdeveloppement.fr (forcez le rafraîchissement avec Ctrl+Shift+R pour bypasser le cache)
2. Scrollez jusqu'à la section "Demande de Devis"
3. Remplissez avec une **vraie adresse email à vous** (pour vérifier que vous recevez la confirmation)
4. Cochez le consentement
5. Cliquez "Envoyer ma demande"

**Vous devez voir :**
- ✅ Toast vert "Demande envoyée !"
- ✅ Dans votre boîte mail, 2 emails arrivent dans les 30 secondes :
  - Un pour vous (le client) → "✅ Confirmation de votre demande de devis"
  - Un pour `contact.nexus.developpement@gmail.com` → "📩 Nouvelle demande de devis"

**Si ça ne marche pas :**
- Ouvrez la console du navigateur (F12 → Console) — vous verrez l'erreur
- Allez dans Vercel → Deployments → cliquez sur le dernier déploiement → **Functions** → cliquez sur `/api/send-quote` pour voir les logs
- Erreurs typiques :
  - `Email service not configured` → la variable `RESEND_API_KEY` n'est pas définie (étape 1) ou pas redéployée
  - `Trop de demandes` → vous avez testé 3 fois la même IP, attendez 1h
  - `Invalid X` → la validation rejette le payload

---

## Étape 4 — (Optionnel) Tester le formulaire de réservation d'appel (2 min)

Sur https://nexusdeveloppement.fr, scrollez jusqu'à "Réservez un appel" → choisissez une date/heure → renseignez vos infos → confirmez.

Vous devez recevoir 2 emails comme ci-dessus.

---

## Étape 5 — (Optionnel) Tester le chatbot

Cliquez sur l'icône de chat en bas à droite → tapez un message → vous devez voir la réponse arriver en streaming.

Si message "Service IA indisponible" : vous n'avez pas mis `OPENAI_API_KEY`, c'est normal.

---

## 🆘 En cas de problème

1. **Logs Vercel Functions** : Vercel → Deployments → dernier déploiement → onglet **Functions** → cliquez sur la function pour voir les invocations en temps réel
2. **Console navigateur** : F12 → Console → vous voyez les erreurs HTTP
3. **Si rien ne marche** : `git log -1` pour vérifier que le push est bien parti, `vercel inspect <deploy-url>` pour voir l'état du déploiement

---

## ✅ Checklist finale

```
[ ] Vercel : 4 variables d'env ajoutées (RESEND_API_KEY, RESEND_FROM_EMAIL, ADMIN_EMAIL, OPENAI_API_KEY)
[ ] Vercel : variables VITE_SUPABASE_* supprimées
[ ] Git : commit + push fait
[ ] Vercel : déploiement vert "Ready"
[ ] Test devis : 2 emails reçus
[ ] (Optionnel) Test réservation appel : 2 emails reçus
[ ] (Optionnel) Test chatbot : streaming fonctionne
```

Une fois la checklist terminée, le site est en production avec une infrastructure ultra-simple (Vercel + Resend, 2 services au lieu de 4 avant).

---

## Bonus : ce qu'on peut nettoyer côté Supabase (5 min, optionnel)

Vu qu'on n'utilise plus Supabase du tout, vous pouvez supprimer vos vieux projets pour libérer vos quotas gratuits (limite : 2 projets actifs en plan gratuit).

1. Allez sur https://supabase.com/dashboard
2. Pour chaque projet visible : cliquez dessus → **Settings** → **General** → tout en bas → **Delete project**
3. Confirmez en tapant le nom du projet

Après ça, vous serez à 0 projet Supabase. Si vous en recréez un un jour pour autre chose, ce sera tout neuf.
