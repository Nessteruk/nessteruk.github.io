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
- Survol du bouton « Download CV » : fond bleu nuit et texte crème sur fond crème, fond bleu nuit et texte jaune sur fond jaune, fond jaune et texte bleu nuit sur le fond sombre (la maquette prévoyait du bleu nuit, invisible sur la section Work).
- Les éléments du header prennent leur couleur directement de la variable du thème (et non par héritage) : sinon une transition héritée s'ajoute à la leur et le changement de couleur arrive en retard.

## Défilement
- Défilement forcé section par section (molette, swipe, clavier, liens du menu). La nouvelle section glisse par-dessus l'ancienne en 0,6 s (power3.inOut) ; l'ancienne recule de 30 % (parallaxe).
- La section qui glisse porte une ombre portée uniquement quand les deux sections ont des fonds de couleurs différentes (pas entre Skills, More et Career, toutes jaunes).
- Le header a un fond opaque (couleur du thème) pour que le contenu en transition ne passe jamais visuellement dessous.
- Accueil et Contact : tous les textes ont la même profondeur de parallaxe pour ne jamais se chevaucher ; seule l'illustration a un décalage plus fort.
- Carrousel mobile : un swipe horizontal bloque le changement de section le temps du geste.
- Survol des boutons : balayage du fond de gauche à droite, rétraction inverse en sortie.
- Les éléments marqués `data-reveal="1|2|3"` apparaissent avec un décalage proportionnel à leur profondeur (90 px par niveau). L'accueil utilise une variante discrète (`reveal="subtle"` sur la section : 20 px par niveau, power3.out sur 1,1 s).
- Si le contenu d'une section dépasse la hauteur de l'écran (petits téléphones), la section défile d'abord en interne avant de passer à la suivante.
- L'URL reflète la section active (`#skills`, `#work`…) : un lien direct ouvre la bonne section.
- `prefers-reduced-motion` : changements de section instantanés, pas d'effet machine à écrire.

## Texte « machine à écrire »
- Joué uniquement à la première visite de chaque section ; aux visites suivantes, le texte est affiché directement.
- Le texte complet est présent dans le HTML (lecteurs d'écran, référencement) ; seule sa copie visuelle est animée.

## Contenus
- Sur mobile, la carte PRINT et les numéros 01-02-03 sont volontairement absents (confirmé par Ness).
- Les projets du carrousel sont des contenus provisoires (`src/data/content.ts`).
- Carrousel : l'image glisse à l'intérieur de son cadre (masquée) ; le texte et le bouton ne sont jamais masqués, ils se déplacent de 30 px avec un fondu (moins que l'espace qui les sépare de l'image, pour ne jamais la chevaucher).
- Sections avec texte tapé : le contenu est centré verticalement entre le texte tapé et le bas de l'écran (espace identique au-dessus et au-dessous), sur desktop comme sur mobile.
- Skills (desktop) : les grands numéros sont positionnés en absolu derrière les titres ; ils ne comptent pas dans le centrage vertical du contenu.

## Accueil : titre tapé et rôles
- « Hey ! I’m a » puis le rôle sont tapés avant le reste de l'accueil (une seule fois, à la première visite), puis le surlignage jaune balaie de gauche à droite.
- Toutes les 4 s, le rôle change (`roles` dans `src/data/content.ts`) : le surlignage se referme de droite à gauche, le texte est effacé caractère par caractère, le nouveau est tapé, puis le surlignage revient.
- Le surlignage est piloté par la variable CSS `--hl` (0 = fermé, 1 = ouvert) sur `HighlightText`.
- « Hey ! I’m a » et le rôle sont alignés sur la ligne de base du texte.
- Lecteurs d'écran : seule la phrase avec le premier rôle est lue, pour ne pas annoncer chaque changement.
- `prefers-reduced-motion` : pas de saisie ni de balayage, le rôle change simplement toutes les 4 s.
- Desktop : le texte de l'accueil est centré verticalement dans l'espace sous le header ; l'illustration garde sa position de la maquette.
- Entre « Hey ! I’m a » et le rôle : exactement une espace (0,28 em). Le surlignage déborde de 0,12 em de chaque côté du texte.
- Le curseur de saisie est positionné hors du flux, juste après le surlignage : il n'élargit jamais la barre jaune.
- Quand le rôle ou l'intro sont vides pendant la saisie, ils contiennent une espace de largeur nulle : la ligne garde sa ligne de base et ne saute pas verticalement.

## Clipping desktop
- Sur desktop, les sections ne défilent jamais en interne (le contenu tient toujours à l'écran grâce à la mise à l'échelle) : `.section__inner` est en `overflow: hidden`, et c'est le bord fixe de la section qui coupe les illustrations qui débordent de l'écran.
- Un effet de décalage à la souris (inclinaison 3D puis parallaxe 2D) a été testé puis retiré : il surchargeait le site.
