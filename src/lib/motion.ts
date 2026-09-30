// Animations d'entrée framer-motion (initial → animate au montage).
//
// Renvoie `false` (pas d'animation d'entrée, l'élément est rendu directement
// dans son état final) dans deux cas :
// - pré-rendu Puppeteer (navigator.webdriver) : sinon le HTML statique est
//   capturé avec `opacity: 0` et la page reste invisible jusqu'au JavaScript ;
// - hydratation d'une page pré-rendue (window.__NED_PRERENDERED__) : le
//   contenu est déjà affiché, rejouer le fondu le ferait disparaître.
export function intro<T>(values: T): T | false {
  if (typeof window === "undefined") return values;
  if (navigator.webdriver || window.__NED_PRERENDERED__) return false;
  return values;
}
