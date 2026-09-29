import { cp, copyFile } from 'fs/promises';
import { existsSync } from 'fs';

// 1. Copie public/ dans dist/ (Vite le fait déjà via copyPublicDir ; conservé
//    pour les fichiers ajoutés après le build).
// 2. Expose la page 404 pré-rendue à la racine (dist/404.html). Vercel la sert
//    avec un vrai statut 404 pour toute URL inconnue, maintenant que la rewrite
//    catch-all vers index.html a été retirée de vercel.json. Sans pré-rendu
//    (build local), le fichier n'existe pas et rien n'est généré.
async function main() {
  try {
    if (existsSync('public')) {
      await cp('public', 'dist', { recursive: true });
      console.log('public/ copié dans dist/');
    }
    if (existsSync('dist/404/index.html')) {
      await copyFile('dist/404/index.html', 'dist/404.html');
      console.log('dist/404.html généré depuis la page 404 pré-rendue');
    } else {
      // Sans pré-rendu (prévisualisations Vercel, build local), les routes ne
      // sont pas des fichiers statiques : Vercel sert alors 404.html, qui doit
      // contenir le shell de l'application pour que le routeur affiche la page
      // demandée (avec un statut 404, acceptable hors production).
      await copyFile('dist/index.html', 'dist/404.html');
      console.log('Pas de pré-rendu : dist/404.html = shell SPA (les routes profondes restent servies, statut 404)');
    }
  } catch (error) {
    console.error('copy-public : erreur', error);
    process.exit(1);
  }
}

main();
