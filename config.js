/* =========================================================================
   MAËNIS STUDIO : RÉGLAGES DU SITE
   C'est le seul fichier à modifier pour changer les prix, les contacts
   ou les offres. Garder les guillemets et les virgules.
   ========================================================================= */
window.MAENIS = {
  // Adresse de l'application Web Google (Apps Script) qui enregistre les fiches
  // et donne les identifiants MS-0001, MS-0002… Elle finit par /exec.
  // Tant qu'elle est vide, la fiche est envoyée par WhatsApp.
  backendUrl: "https://script.google.com/macros/s/AKfycbxt7iKnIFmk90N5JUa3fMgHipWMZYrdnSg4b5LclNijyj-GEB_qmdftjfT2FzAOyG4/exec",

  // Qui sommes-nous
  studio: {
    lancement: "Novembre 2026",
    fondatrice: "Marie"
  },

  whatsapp: "237690164222",              // sans + ni espaces
  whatsappAffiche: "+237 6 90 16 42 22",
  email: "marie.maenisstudio@gmail.com",

  reseaux: {
    instagram: "https://www.instagram.com/seethatbeauty.aw/",
    tiktok: "https://www.tiktok.com/@seethatbeauty",
    facebook: "https://www.facebook.com/1414685891734564",
    youtube: "https://www.youtube.com/channel/UCS12h1o3K390T3pG81qwlXA"
  },

  // Prix en euros affichés à côté des FCFA : taux fixe FCFA → euro + frais (en %), arrondi à l'euro supérieur
  euro: {
    taux: 655.957,
    frais: 10,
    note: "Prix en euros donnés à titre indicatif (taux de conversion + frais). Hors Cameroun, la main-d'œuvre et les matériaux n'étant pas les mêmes, les tarifs des produits physiques (tableaux, impressions) seront ajustés."
  },

  paiement: {
    acompte: 50,                        // pourcentage payé à la confirmation
    orangeMoney: "",                    // numéro Orange Money (sinon : envoyé à la confirmation)
    paypal: ""                          // lien PayPal.me (sinon : envoyé à la confirmation)
  },

  /* ----------------------------------------------------------------------
     FIDÉLITÉ (mêmes valeurs que dans apps-script/demandes.gs)
     ---------------------------------------------------------------------- */
  fidelite: {
    fcfaParPoint: 1000,     // 1 point pour 1 000 FCFA payés
    palier: 50,             // 50 points (= 50 000 FCFA)…
    reduction: 10,          // … donnent 10 % de réduction
    parrainage: 10,         // points pour le parrain quand son filleul commande
    anniversaire: 5         // points offerts le jour de l'anniversaire
  },

  /* ----------------------------------------------------------------------
     PERSONNAGES DU STUDIO (galerie + ceux qui se baladent sur le site)
     image : nom du fichier dans images/ (galerie-<image>.webp et perso-<image>.webp)
     balade : true = il se promène en bas de l'écran ; vole : true = il vole au lieu de marcher
     ---------------------------------------------------------------------- */
  personnages: [
    { image: "tricia-boite", nom: "Tricia", univers: "Figurine dans sa boîte", texte: "Une vraie cliente, devenue figurine dans sa boîte : en tableau, en avatar 3D ou en illustration" },
    { image: "zara-etoiles", nom: "Zara Étoiles", univers: "Espace", texte: "Astronaute qui cartographie des planètes inconnues avec son robot Bip.", balade: true, phrase: "Moi c'est Zara ! On compte les étoiles ensemble ? ✨" },
    { image: "dino-tchomp", nom: "Dino Tchomp", univers: "Dinosaures", texte: "Bébé dinosaure gourmand qui adore les mangues.", balade: true, phrase: "Tchomp ! Quelqu'un a vu ma mangue ? 🥭" },
    { image: "mama-tokpa", nom: "Mama Tokpa", univers: "Le marché", texte: "Vendeuse du marché qui connaît tous les secrets du quartier.", balade: true, phrase: "Venez, venez ! Au studio, tout est fait main 🧺" },
    { image: "bip", nom: "Bip", univers: "Robots", texte: "Petit robot curieux qui veut comprendre les blagues des humains.", balade: true, vole: true, phrase: "Bip bip ! Je peux être le compagnon de votre enfant 🤖" },
    { image: "capitaine-koumba", nom: "Capitaine Koumba", univers: "Pirates", texte: "Capitaine pirate qui cherche des trésors pour les rendre aux villages.", balade: true, phrase: "À l'abordage ! Le trésor est dans le catalogue 🏴‍☠️" },
    { image: "papillon-pepin", nom: "Papillon Pépin", univers: "Monde des fées", texte: "Le meilleur ami de Liya, bavard et gourmand de nectar.", balade: true, vole: true, phrase: "Coucou ! Je vole partout sur le site 🦋" },
    { image: "princesse-ayo", nom: "Princesse Ayo", univers: "Royaume africain", texte: "Princesse au grand cœur, curieuse, qui préfère l'aventure aux bals.", balade: true, phrase: "Votre enfant peut devenir prince ou princesse 👑" },
    { image: "fee-liya", nom: "Fée Liya", univers: "Monde des fées", texte: "Fée des papillons, rêveuse et malicieuse, elle sème des étincelles partout.", balade: true, vole: true, phrase: "Faites un vœu… et remplissez la fiche ✨" },
    { image: "samy-but", nom: "Samy But", univers: "Football", texte: "Attaquant de quartier qui rêve de la grande coupe.", balade: true, phrase: "Buuut ! Votre enfant aussi peut être un champion ⚽" },
    { image: "chevaliere-nala", nom: "Chevalière Nala", univers: "Royaume médiéval", texte: "Chevalière loyale et drôle, qui protège la vallée avec son petit dragon.", balade: true, phrase: "Une aventure ? Mon dragon et moi sommes prêts 🐉" },
    { image: "rin", nom: "Rin", univers: "Manga", texte: "Aventurière qui voyage de ville en ville sur son scooter volant." },
    { image: "eclipse", nom: "Éclipse", univers: "Super-héros", texte: "Héroïne qui contrôle la lumière et l'ombre ; le jour, elle est infirmière." },
    { image: "lion-acier", nom: "Lion d'Acier", univers: "Super-héros", texte: "Ingénieur de Douala qui a construit son armure dans un garage." },
    { image: "tonnan", nom: "Tonnan", univers: "Légendes", texte: "Gardien des orages, impressionnant mais tendre, il a peur des papillons." },
    { image: "kenji-ombre", nom: "Kenji Ombre", univers: "Ninjas", texte: "Ninja très discret… sauf quand il éternue." },
    { image: "comte-doudou", nom: "Comte Doudou", univers: "Halloween mignon", texte: "Vampire qui a peur du noir et dort avec une veilleuse." },
    { image: "roi-kito", nom: "Roi Kito", univers: "Contes africains", texte: "Lion conteur qui joue de la kora au coucher du soleil." },
    { image: "reine-amara", nom: "Reine Amara", univers: "Contes", texte: "Reine sage et élégante, gardienne des contes du royaume." },
    { image: "prince-kelan", nom: "Prince Kélan", univers: "Royaume africain", texte: "Prince rêveur et un peu maladroit, astronome du palais." },
    { image: "sirene-maya", nom: "Sirène Maya", univers: "Océan", texte: "Sirène gardienne du récif, elle parle aux baleines." },
    { image: "princesse-ayo-boite", nom: "Ayo en figurine", univers: "Figurine dans sa boîte", texte: "Le style « figurine dans sa boîte », en tableau" }
  ],

  /* ----------------------------------------------------------------------
     LES MONDES (voyage horizontal de l'accueil)
     fond : image de décor (ou "" pour un fond dessiné : style "etoiles" ou "comics")
     persos : les personnages (clé image) qui se tiennent devant le décor
     ---------------------------------------------------------------------- */
  mondes: [
    { id: "conte", titre: "Contes africains", accroche: "Sous le baobab, les histoires de nos grands-mères prennent vie.", fond: "images/monde-conte.webp", couleur: "#E2731E", persos: ["roi-kito", "reine-amara", "mama-tokpa"] },
    { id: "jungle", titre: "La jungle", accroche: "Lianes, mangues et rires : l'aventure commence derrière les feuilles.", fond: "images/monde-jungle.webp", couleur: "#2F8F4E", persos: ["dino-tchomp", "papillon-pepin"] },
    { id: "ocean", titre: "L'océan de Kribi", accroche: "Plongez avec Maya, la sirène qui parle aux baleines.", fond: "images/monde-ocean.webp", couleur: "#1576B8", persos: ["sirene-maya", "capitaine-koumba"] },
    { id: "royaume", titre: "Royaumes", accroche: "Princesses aventurières, princes rêveurs et dragons rigolos.", fond: "images/monde-royaume.webp", couleur: "#8E5A1E", persos: ["princesse-ayo", "chevaliere-nala", "prince-kelan"] },
    { id: "fees", titre: "Monde des fées", accroche: "Des étincelles partout, et un peu de magie dans chaque leçon.", fond: "images/monde-fees.webp", couleur: "#6B4BC4", persos: ["fee-liya", "rin"] },
    { id: "espace", titre: "Les étoiles", accroche: "Compter jusqu'à dix en visitant les planètes ? Facile.", fond: "", style: "etoiles", couleur: "#14183F", persos: ["zara-etoiles", "bip"] },
    { id: "heros", titre: "Super-héros", accroche: "Des héros d'ici, qui ressemblent à nos enfants.", fond: "", style: "comics", couleur: "#E63A2E", persos: ["lion-acier", "samy-but", "tonnan", "kenji-ombre"] }
  ],

  /* ----------------------------------------------------------------------
     RÉALISATIONS (le mur de vidéos)
     ---------------------------------------------------------------------- */
  realisations: [
    { video: "videos/enfants.mp4", poster: "videos/enfants.jpg", type: "Enfants", titre: "Votre enfant, héros de son dessin animé", offre: "dessin-anime-enfant" },
    { video: "videos/alphabet.mp4", poster: "videos/alphabet.jpg", type: "Apprendre", titre: "Aïcha apprend l'alphabet", offre: "dessin-anime-enfant" },
    { video: "videos/lina-ep1.mp4", poster: "videos/lina-ep1.jpg", type: "Série animée", titre: "Lina, ép. 1 « Le maquillage de maman »", offre: "serie-personnage" },
    { video: "videos/serie-inaya.mp4", poster: "videos/serie-inaya.jpg", type: "Série à suspense", titre: "La fille que tout le monde voulait être", offre: "serie-personnage" },
    { video: "videos/pub-boutique.mp4", poster: "videos/pub-boutique.jpg", type: "Pub vidéo", titre: "Ta boutique mérite plus qu'une photo", offre: "pub-video-boutique" },
    { video: "videos/motion.mp4", poster: "videos/motion.jpg", type: "Motion design", titre: "Le showreel du studio", offre: "motion-design" },
    { video: "videos/popart-site.mp4", poster: "videos/popart-site.jpg", type: "Pop art", titre: "Votre photo en œuvre pop art", offre: "portrait-pop-art" }
  ],

  /* ----------------------------------------------------------------------
     AVIS DES CLIENTS (la section n'apparaît que s'il y a au moins un avis)
     Modèle : { nom: "Awa, Douala", offre: "Portrait pop art", texte: "…", note: 5 },
     ---------------------------------------------------------------------- */
  avis: [
  ],

  /* ----------------------------------------------------------------------
     CATALOGUE
     prix : nombre en FCFA (0 = sur devis). « des » = prix d'appel affiché.
     apartir: true → affiche « à partir de » devant le prix.
     ---------------------------------------------------------------------- */
  // ---------- Maënis Tech (sites, commandes, tableaux de bord) ----------
  // Prix « à partir de », ajustés au rendez-vous. Délai de réponse du suivi : 3 jours ouvrés minimum.
  tech: {
    offres: [
      { id: "site", ico: "🌐", titre: "Votre site web", prix: 100000, suivi: 10000,
        change: "Vos clients vous trouvent, voient vos produits et vous écrivent sur WhatsApp en un clic, même à 23 h.",
        points: ["Page animée : présentation, produits, prix, avis, plan d'accès", "Bouton WhatsApp et liens vers vos réseaux", "Lisible sur téléphone, rapide même en 3G"] },
      { id: "commandes", ico: "📦", titre: "Vos commandes s'organisent toutes seules", prix: 70000, suivi: 10000,
        change: "Fini les commandes perdues dans WhatsApp ou dans le cahier : chaque commande arrive rangée, avec un numéro.",
        points: ["Le client remplit une fiche et reçoit un numéro de commande", "Tout arrive dans un tableau : à préparer, payée, livrée", "Une alerte à chaque nouvelle commande ; option fidélité"] },
      { id: "tableau", ico: "📊", titre: "Tableau de bord automatisé", prix: 60000, suivi: 7500,
        change: "Chaque soir, en un coup d'œil : vos ventes, votre caisse, votre stock, vos meilleurs produits.",
        points: ["Excel ou Google Sheets, les calculs se font tout seuls", "Graphiques et alertes (stock bas, dépense inhabituelle)", "30 min de formation pour l'utiliser"] },
      { id: "sur-mesure", ico: "🛠️", titre: "Votre outil de gestion sur mesure", prix: 250000, suivi: 25000,
        change: "Un outil fait pour votre façon de travailler, au lieu de vous adapter à un logiciel compliqué.",
        points: ["Commandes, clients, stock, rendez-vous, équipe…", "Sur devis, après un rendez-vous pour comprendre le besoin"] }
    ],
    pack: { titre: "Pack Lancement", detail: "Site web + commandes automatisées + pub vidéo Express", prix: 170000, sansPack: 190000, suivi: 15000 },
    suivi: {
      essentiel: "hébergement, sauvegardes, corrections de pannes, 1 petite modification par mois",
      prioritaire: "tout l'Essentiel + 3 modifications par mois + un point visio mensuel, vos demandes passent en premier (environ 2 fois le prix de l'Essentiel)",
      regles: "Demandes par WhatsApp écrit ou par mail, du lundi au vendredi. Réponse sous 3 jours ouvrés minimum. Engagement de 3 mois."
    }
  },

  offres: [
    {
      id: "dessin-anime-enfant",
      guetteur: "zara-etoiles",
      categorie: "enfants",
      titre: "Votre enfant, héros de son dessin animé",
      accroche: "Il devient un personnage de dessin animé et apprend en s'amusant : l'alphabet, les couleurs, les bonnes habitudes… De 1 à 6 ans, en français ou en anglais.",
      des: 20000,
      couleur: "#F5C542",
      image: "images/enfant-aicha.webp",
      video: "videos/enfants.mp4",
      poster: "videos/enfants.jpg",
      galerie: ["images/enfant-aicha.webp", "images/enfant-apprend.webp", "images/famille.webp"],
      formules: [
        { nom: "Une vidéo + 1 coloriage offert", prix: 20000, apartir: true, detail: "Votre enfant en héros d'une vidéo éducative · prix selon la longueur" },
        { nom: "Abonnement 4 vidéos par mois", prix: 45500, apartir: true, detail: "Une nouvelle vidéo chaque vendredi soir, 1 coloriage offert avec chaque vidéo · selon le contenu souhaité", populaire: true },
        { nom: "Abonnement famille, frères et sœurs", prix: 60000, apartir: true, detail: "Tous les enfants dans les aventures, chaque mois, coloriages offerts · selon le contenu souhaité" }
      ],
      inclus: [
        "Son personnage 3D à partir de 2 ou 3 photos",
        "Son prénom, ses goûts, son doudou ou un compagnon original",
        "En français, en anglais ou les deux",
        "Un thème au choix : alphabet, chiffres, couleurs, formes, animaux, politesse, hygiène…"
      ],
      delai: "Abonnement : une nouvelle vidéo chaque vendredi soir",
      champs: [
        { nom: "prenom_enfant", label: "Prénom de l'enfant", type: "text", requis: true },
        { nom: "age_enfant", label: "Son âge", type: "select", options: ["1 an", "2 ans", "3 ans", "4 ans", "5 ans", "6 ans", "Plus de 6 ans"], requis: true },
        { nom: "theme", label: "Ce que la vidéo doit lui apprendre", type: "chips", options: ["L'alphabet", "Les chiffres", "Les couleurs", "Les formes", "Les animaux", "La politesse", "Se laver les mains et les dents", "Des mots en anglais", "Conseillez-moi"] },
        { nom: "langue", label: "Langue de la vidéo", type: "select", options: ["Français", "Anglais", "Français et anglais"] },
        { nom: "aime", label: "Ce qu'il aime (couleur, animal, jouet, plat…)", type: "textarea" }
      ]
    },
    {
      id: "portrait-pop-art",
      guetteur: "princesse-ayo",
      categorie: "pop-art",
      titre: "Votre photo en œuvre pop art",
      accroche: "Un tableau unique, rien qu'à vous : bande dessinée, Warhol, wax, graffiti, collage, figurine ou figurine dans sa boîte.",
      des: 15000,
      couleur: "#E8457A",
      image: "images/popart-bd.webp",
      mosaique: ["images/popart-bd.webp", "images/popart-warhol.webp", "images/popart-wax.webp", "images/popart-graffiti.webp", "images/popart-collage.webp", "images/popart-figurine.webp"],
      video: "videos/popart-site.mp4",
      poster: "videos/popart-site.jpg",
      galerie: ["images/popart-bd.webp", "images/tricia-boite.webp", "images/popart-warhol.webp", "images/popart-wax.webp", "images/popart-graffiti.webp", "images/popart-collage.webp", "images/popart-figurine.webp", "images/tricia-fiche.webp", "images/galerie-princesse-ayo-boite.webp", "images/salon-bd.webp", "images/salon-graffiti.webp"],
      formules: [
        { nom: "Fichier HD, style du catalogue", prix: 15000, detail: "Un style du catalogue, 1 proposition, 1 retouche, aperçu sur votre mur" },
        { nom: "Création unique, fichier HD", prix: 25000, detail: "Un style imaginé pour vous, plusieurs propositions, 2 retouches" },
        { nom: "Tableau 40 × 60 sous verre anti-reflet", prix: 50000, detail: "Encadré, verre anti-reflet", populaire: true },
        { nom: "Tableau 40 × 60 en plexiglas", prix: 40000, detail: "Encadré, plexiglas (plus léger, incassable)" },
        { nom: "Tableau 60 × 90 sous verre anti-reflet", prix: 75000, detail: "Grand format encadré, verre anti-reflet" },
        { nom: "Tableau 60 × 90 en plexiglas", prix: 65000, detail: "Grand format encadré, plexiglas" },
        { nom: "Duo de tableaux 40 × 60 sous verre anti-reflet", prix: 91000, detail: "2 tableaux assortis (−9 %) · en plexiglas : 73 000 FCFA" },
        { nom: "Trio de tableaux 40 × 60 sous verre anti-reflet", prix: 129000, detail: "3 tableaux assortis (−14 %) · en plexiglas : 103 000 FCFA" },
        { nom: "Duo de tableaux 60 × 90 sous verre anti-reflet", prix: 137000, detail: "2 grands tableaux assortis (−9 %) · en plexiglas : 118 000 FCFA" },
        { nom: "Trio de tableaux 60 × 90 sous verre anti-reflet", prix: 194000, detail: "3 grands tableaux assortis (−14 %) · en plexiglas : 168 000 FCFA" }
      ],
      inclus: [
        "Un aperçu de l'œuvre sur votre mur avant validation",
        "Tableaux : style du catalogue inclus. Création unique sur tableau : +10 000 FCFA par tableau",
        "Cadre noir, blanc ou doré, sous verre anti-reflet ou en plexiglas",
        "Hors Cameroun : la main-d'œuvre et les matériaux n'étant pas les mêmes, le prix des tableaux sera ajusté",
        "Livraison à Douala. Ailleurs : expédition possible, frais à la charge du client selon la ville",
        "Style « figurine dans sa boîte » : votre personnage façon jouet de collection, en fichier HD ou en tableau (c'est une image, pas un jouet)",
        "D'autres styles possibles en rendez-vous",
        "Idéal en cadeau : anniversaire, mariage, fête des mères"
      ],
      delai: "Tableau livré en 10 à 15 jours",
      champs: [
        { nom: "style", label: "Style qui vous plaît", type: "chips", options: ["Bande dessinée", "Warhol (4 couleurs)", "Wax", "Graffiti", "Collage", "Figurine", "Figurine dans sa boîte", "Je ne sais pas encore"] },
        { nom: "qui", label: "Qui sera sur l'œuvre ?", type: "select", options: ["Moi", "Un couple", "Ma famille", "Un enfant", "C'est un cadeau pour quelqu'un"] },
        { nom: "protection", label: "Verre ou plexiglas (pour un tableau)", type: "select", options: ["Pas de tableau, fichier seulement", "Sous verre anti-reflet", "En plexiglas", "Conseillez-moi"] },
        { nom: "cadre", label: "Cadre (pour un tableau)", type: "select", options: ["Pas de tableau, fichier seulement", "Noir", "Blanc", "Doré"] },
        { nom: "livraison", label: "Livraison du tableau", type: "select", options: ["Pas de tableau, fichier seulement", "À Douala", "Expédition dans une autre ville (frais à ma charge)", "Expédition hors du Cameroun (frais à ma charge)"] }
      ]
    },
    {
      id: "livre-coloriage",
      guetteur: "papillon-pepin",
      categorie: "enfants",
      titre: "Son monde à lui, en livre de coloriage",
      accroche: "Sa photo se transforme en dessin à colorier. Il s'y retrouve chez lui, avec sa famille, son doudou, son école, son quartier et tout ce qu'il aime.",
      des: 2500,
      couleur: "#52B8E8",
      image: "images/coloriage-couverture.webp",
      galerie: ["images/coloriage-livre-kribi.webp", "images/coloriage-feuille-foot.webp", "images/coloriage-couverture.webp", "images/coloriage-lion.webp", "images/coloriage-noel.webp", "images/coloriage-marche.webp", "images/coloriage-anniversaire.webp"],
      formules: [
        { nom: "Feuille de coloriage personnalisée imprimée", prix: 2500, apartir: true, detail: "Sa photo transformée en dessin, dans un décor qu'il aime · en PDF : 2 000 FCFA" },
        { nom: "Pack 5 feuilles imprimées", prix: 10000, apartir: true, detail: "5 scènes de sa vie : la maison, l'école, le marché, ses jeux… · en PDF : 8 000 FCFA" },
        { nom: "Livre de coloriage 20 pages imprimé et relié", prix: 22000, apartir: true, detail: "Son histoire en 20 dessins + une couverture en couleur · en PDF : 16 000 FCFA", populaire: true },
        { nom: "Frères et sœurs, anniversaires, écoles", prix: 0, detail: "Tous les enfants héros ensemble, tarif groupe" }
      ],
      inclus: [
        "À partir de vraies photos de l'enfant, transformées en dessins à colorier",
        "Les lieux et les objets de son quotidien : sa chambre, sa maison, son école, son quartier",
        "Ce qu'il aime : son doudou, ses jouets, ses animaux, ses plats, ses héros… et les personnes qu'il aime",
        "Son prénom sur la couverture et sur les pages",
        "Traits noirs épais, faciles à colorier dès 3 ans",
        "Imprimé et relié, ou en PDF haute qualité si vous préférez imprimer vous-même",
        "En PDF : la fiche pour votre imprimeur (papier, format, reliure). Version imprimée livrée à Douala, ailleurs frais d'envoi à votre charge",
        "Un aperçu gratuit avant de payer, une retouche offerte"
      ],
      delai: "Aperçu sous 24 à 48 h",
      champs: [
        { nom: "prenom_enfant", label: "Prénom de l'enfant (ou des enfants)", type: "text", requis: true },
        { nom: "age_enfant", label: "Âge", type: "text" },
        { nom: "quotidien", label: "Son quotidien et ce qu'il aime (maison, école, doudou, animaux, personnes, activités…)", type: "textarea" },
        { nom: "themes", label: "Thèmes", type: "chips", options: ["Animaux de la savane", "Noël", "Anniversaire", "Football", "Princesses et reines africaines", "Super-héros", "Marché et cuisine de chez nous", "Espace", "Dinosaures", "Un thème à moi"] }
      ]
    },
    {
      id: "pub-video-boutique",
      guetteur: "mama-tokpa",
      categorie: "pro",
      titre: "La pub vidéo de votre boutique",
      accroche: "30 secondes pour faire briller votre boutique. Les prix affichés sont ceux d'une vidéo de base : le prix final dépend du travail demandé et du type d'animation (motion design, dessin animé 3D, vidéo super réaliste…).",
      des: 20000,
      couleur: "#7FD17A",
      image: "images/pub-marie.webp",
      video: "videos/pub-boutique.mp4",
      poster: "videos/pub-boutique.jpg",
      galerie: ["images/pub-robe-noel.webp", "images/pub-marie.webp", "images/pub-sur-mesure.webp"],
      formules: [
        { nom: "Express", prix: 20000, apartir: true, detail: "Vous envoyez votre idée, je la réalise" },
        { nom: "Sur mesure", prix: 38000, apartir: true, detail: "Idée, script, voix, musique, tout ensemble", populaire: true },
        { nom: "Pack 2 vidéos express", prix: 37000, apartir: true, detail: "Deux vidéos de base" },
        { nom: "Pack 3 vidéos express", prix: 55000, apartir: true, detail: "Trois vidéos de base (−9 %)" },
        { nom: "Pack 3 vidéos sur mesure", prix: 107000, apartir: true, detail: "Trois vidéos créées de A à Z (−6 %)" }
      ],
      inclus: [
        "Prête entre 3 et 5 jours",
        "Offerts : la version carrée pour Facebook et un teaser de 10 s",
        "Format vertical pour TikTok, Reels et statuts WhatsApp",
        "Prix de base affiché : le prix final dépend du travail demandé et du type d'animation (motion design, dessin animé 3D, vidéo super réaliste…), confirmé avant de commencer"
      ],
      delai: "Prête entre 3 et 5 jours",
      champs: [
        { nom: "boutique", label: "Nom de votre boutique ou entreprise", type: "text", requis: true },
        { nom: "activite", label: "Ce que vous vendez", type: "text" },
        { nom: "type_animation", label: "Type d'animation souhaité", type: "chips", options: ["Motion design (textes et formes animés)", "Dessin animé 3D", "Vidéo super réaliste", "Je ne sais pas, conseillez-moi"] },
        { nom: "reseaux_vises", label: "Où sera publiée la vidéo ?", type: "chips", options: ["TikTok", "Instagram", "Facebook", "Statut WhatsApp", "YouTube"] }
      ]
    },
    {
      id: "motion-design",
      guetteur: "bip",
      categorie: "pro",
      titre: "Motion design et vidéos animées",
      accroche: "Textes animés, présentation de produit, écran de téléphone, avant/après : une animation pro pour votre marque.",
      des: 0,
      couleur: "#B48CF0",
      image: "videos/motion.jpg",
      video: "videos/motion.mp4",
      poster: "videos/motion.jpg",
      galerie: ["videos/motion.jpg"],
      formules: [
        { nom: "Projet sur devis", prix: 0, detail: "On définit ensemble le style, la durée et le message", populaire: true }
      ],
      inclus: [
        "Un style choisi ensemble",
        "Musique et bruitages",
        "Formats vertical, carré et horizontal",
        "Sous-titres à vos couleurs"
      ],
      delai: "Délai selon le projet",
      champs: [
        { nom: "projet", label: "Votre projet en quelques mots", type: "textarea", requis: true },
        { nom: "budget", label: "Budget envisagé", type: "select", options: ["Moins de 30 000 FCFA", "30 000 à 60 000 FCFA", "60 000 à 120 000 FCFA", "Plus de 120 000 FCFA", "Je ne sais pas"] }
      ]
    },
    {
      id: "serie-personnage",
      guetteur: "fee-liya",
      categorie: "pro",
      titre: "Votre personnage ou votre série animée",
      accroche: "Votre avatar 3D, une mascotte pour votre marque ou une mini-série : on crée votre univers.",
      des: 0,
      couleur: "#F08A4B",
      image: "images/serie-frigo.webp",
      video: "videos/serie-inaya.mp4",
      poster: "videos/serie-inaya.jpg",
      galerie: ["images/tricia-pixar.webp", "images/tricia-figurine.webp", "images/tricia-illustration.webp", "images/galerie-princesse-ayo-boite.webp", "images/galerie-zara-etoiles.webp", "images/galerie-dino-tchomp.webp", "images/galerie-chevaliere-nala.webp", "images/serie-frigo.webp", "images/serie-inaya.webp", "images/univers-conte.webp", "images/univers-ocean.webp", "images/univers-jungle.webp", "images/univers-fantastique.webp"],
      formules: [
        { nom: "Projet sur devis", prix: 0, detail: "Personnage, mascotte, épisodes : on en parle en rendez-vous", populaire: true }
      ],
      inclus: [
        "Fiche personnage (face, profil, expressions)",
        "Univers et décors originaux",
        "Épisodes courts pour les réseaux"
      ],
      delai: "Délai selon le projet",
      champs: [
        { nom: "projet", label: "Racontez-moi votre idée", type: "textarea", requis: true }
      ]
    }
  ]
};
