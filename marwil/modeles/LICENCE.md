# Modèle 3D : iphone-15-pro-max.glb

- **Titre** : Apple iPhone 15 Pro Max Black
- **Auteur** : polyman (Polyman_3D), https://sketchfab.com/Polyman_3D
- **Source** : https://sketchfab.com/3d-models/apple-iphone-15-pro-max-black-df17520841214c1792fb8a44c6783ee7
- **Licence** : Creative Commons Attribution 4.0 (CC BY 4.0), http://creativecommons.org/licenses/by/4.0/
  (ces trois informations sont aussi inscrites dans le fichier, `asset.extras`)
- **Copie récupérée** : version optimisée (glTF-Transform, compression Draco, textures WebP) publiée dans le dépôt public
  `adrianhajdin/iphone` (`public/models/scene.glb`), téléchargée le 23/11/2026 via
  https://cdn.jsdelivr.net/gh/adrianhajdin/iphone@main/public/models/scene.glb (fichier identique, 887 328 octets,
  dans `sanidhyy/apple-clone`, `zyferlink/apple-react-web-app`, `grep-many/apple-iphone-15`).

## Obligation d'attribution (CC BY 4.0)
Créditer l'auteur sur la page qui affiche le modèle, par exemple en pied de page :

> Modèle 3D « Apple iPhone 15 Pro Max Black » par polyman (Sketchfab), licence CC BY 4.0, modifié (couleurs).

Signaler les modifications (couleurs changées en code). Le logo et le nom Apple restent des marques d'Apple :
la licence couvre le modèle, pas les marques.

## Notes techniques
- Compression Draco : charger avec `DRACOLoader` (décodeur `https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/gltf/`).
- Unité : mètre. Taille réelle : 7,77 x 15,95 x 1,23 cm (épaisseur avec le bloc photo).
- Écran vers -Z, dos vers +Z, haut vers +Y.
- Matériaux utiles pour changer la couleur :
  - `oZRkkORNzkufnGD` : verre arrière dépoli (couleur du dos)
  - `eShKpuMNVJTRrgg` : cadre en titane (tranches, boutons)
  - `bCgzXjHOanGdTFV` : plateau du bloc photo
  - `zFdeDaGNRwzccye` / `pIJKfZsazmcpEiU` : écran (noir / fond d'écran émissif)
  - `PaletteMaterial003` : atlas partagé (bagues d'objectifs, logo) : ne pas teinter

---

# Modèle 3D : iphone-16-ultramarine.glb

- **Titre** : iPhone 16 Ultramarine (fixed)
- **Auteur** : EV_car2013, https://sketchfab.com/EV_car2013
- **Source** : https://sketchfab.com/3d-models/iphone-16-ultramarine-fixed-8eb2922b08b44ea78bbbda66a63d68cd
- **Licence** : Creative Commons Attribution 4.0 (CC BY 4.0), http://creativecommons.org/licenses/by/4.0/
  (ces trois informations sont aussi inscrites dans le fichier, `asset.extras`)
- **Copie récupérée** : export Sketchfab d'origine (non compressé, généré par Sketchfab 16.44), publié dans le dépôt public
  `BardanGurung23/iPhone-16-homepage` (`public/models/iphone16.glb`), téléchargé le 23/11/2026 via
  https://raw.githubusercontent.com/BardanGurung23/iPhone-16-homepage/main/public/models/iphone16.glb (3 811 032 octets).

## Obligation d'attribution (CC BY 4.0)
Créditer l'auteur sur la page qui affiche le modèle, par exemple en pied de page :

> Modèle 3D « iPhone 16 Ultramarine (fixed) » par EV_car2013 (Sketchfab), licence CC BY 4.0, modifié (couleurs).

Signaler les modifications (couleurs changées en code). Le logo et le nom Apple restent des marques d'Apple :
la licence couvre le modèle, pas les marques.

## Notes techniques
- Pas de compression Draco (GLTFLoader seul suffit). Extensions : aucune.
- Unité : CENTIMÈTRE (le fichier mesure 7,25 x 14,76 x 1,13 unités) : multiplier par 0,01 pour le mettre à l'échelle
  du modèle iPhone 15 Pro Max (en mètres).
- Le modèle n'est PAS centré : centre de la boîte englobante en x = 1,84, y = 0, z = 0,17 (recentrer en code).
- Écran vers -Z, dos vers +Z, haut vers +Y (même orientation que iphone.glb).
- Matériaux utiles pour changer la couleur (couleurs en facteurs, sans texture de couleur, donc faciles à teinter) :
  - `WUYxwatEaLwQKYC` : verre arrière (couleur du dos)
  - `DdWdzDpAESzZMHT_001` : cadre en aluminium (tranches) ; `RbixOJvwPDAnJgY` : boutons latéraux
  - `wwdjrsOZDspvrxe_001` : bandes d'antenne
  - `QqdCrHxuCzexUxf` : verre du plateau photo (transparent, alpha 0,49) posé sur `RmyubFjMaxDJSTu_001`
    (fond du plateau, avec texture : mettre `map = null` pour le teinter) ; `pMTAaHJdVwYXgSm` : bord du plateau
  - `rlvJaAxZokQwvfU` : bagues métalliques des objectifs
  - `guTcKQwdaToGoMi_001` : logo pomme
  - `vWKPeCPaRejOene` : écran (fond d'écran bleu nuit en texture émissive : remplacer `emissiveMap` pour l'éteindre ou y mettre une image)

## iPhone 17 Pro (iphone-17-pro.glb, iphone17pro.json)
- Titre : « iPhone 17 Pro », auteur : Ranguel (https://sketchfab.com/Ranguel)
- Licence : CC BY 4.0 (http://creativecommons.org/licenses/by/4.0/)
- Source : https://sketchfab.com/3d-models/iphone-17-pro-4541aa8a28324b33a2baaf81d263aaec (copie publique du dépôt diebraga, fichier d'origine)
- Crédit à afficher : « iPhone 17 Pro » par Ranguel, CC BY 4.0. Apple, iPhone et le logo Apple sont des marques d'Apple Inc., non couvertes par cette licence.
