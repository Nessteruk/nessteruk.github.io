# Décisions techniques

## Stack
- **Astro** (site 100 % statique) + **GSAP** (animations, plugin Observer pour le défilement section par section).
- Police **Inter** auto-hébergée via `@fontsource-variable/inter` : pas d'appel à Google Fonts (RGPD, performance).
- Pas de framework CSS : styles scopés dans chaque composant Astro, variables globales dans `src/styles/global.css`.

## Mise à l'échelle desktop
- La maquette desktop est en 1920 × 1080. Au-dessus de 1100 px de large, toutes les dimensions sont exprimées en multiples de `--u = min(100vw / 1920, 100svh / 1080)` : la composition reste identique à la maquette quelle que soit la taille de l'écran.
- Les textes courants ont un plancher (`max(15px, …)`) pour rester lisibles sur les petits écrans d'ordinateur.
- En dessous de 1100 px, c'est la maquette mobile qui s'applique.

## Thèmes de section
- Chaque section porte `data-theme` : `light` (fond crème), `accent` (fond jaune), `dark` (fond bleu nuit).
- L'en-tête et le décor fixes reçoivent le thème de la section active. Les composants utilisent `--fg` / `--bg` / `--mark` / `--on-fg` plutôt que des couleurs en dur : un même bouton s'adapte au fond.
- Survol du bouton « Download CV » sur fond sombre : la maquette prévoyait un fond bleu nuit (invisible sur la section Work) ; remplacé par un fond jaune.

## Défilement
- Défilement forcé section par section (molette, swipe, clavier, liens du menu). La nouvelle section glisse par-dessus l'ancienne en 0,8 s (power3.inOut) ; l'ancienne recule de 30 % (parallaxe).
- Le header a un fond opaque (couleur du thème) pour que le contenu en transition ne passe jamais visuellement dessous.
- Accueil et Contact : tous les textes ont la même profondeur de parallaxe pour ne jamais se chevaucher ; seule l'illustration a un décalage plus fort.
- Carrousel mobile : un swipe horizontal bloque le changement de section le temps du geste.
- Survol des boutons : balayage du fond de gauche à droite, rétraction inverse en sortie.
- Les éléments marqués `data-reveal="1|2|3"` apparaissent avec un décalage proportionnel à leur profondeur.
- Si le contenu d'une section dépasse la hauteur de l'écran (petits téléphones), la section défile d'abord en interne avant de passer à la suivante.
- L'URL reflète la section active (`#skills`, `#work`…) : un lien direct ouvre la bonne section.
- `prefers-reduced-motion` : changements de section instantanés, pas d'effet machine à écrire.

## Texte « machine à écrire »
- Joué uniquement à la première visite de chaque section ; aux visites suivantes, le texte est affiché directement.
- Le texte complet est présent dans le HTML (lecteurs d'écran, référencement) ; seule sa copie visuelle est animée.

## Contenus
- Sur mobile, la carte PRINT et les numéros 01-02-03 sont volontairement absents (confirmé par Ness).
- Les projets du carrousel sont des contenus provisoires (`src/data/content.ts`).
