// V4: banque complète avec 9 thèmes. Anti-répetition gérée côté app.
const QUESTION_BANK = {
  general: [
    ["Quelle planète est surnommée la planète rouge ?",["Vénus","Mars","Jupiter","Mercure"],1],
    ["Quel est le plus grand océan du monde ?",["Atlantique","Indien","Arctique","Pacifique"],3],
    ["Combien de côtés possède un hexagone ?",["5","6","7","8"],1],
    ["Quel gaz les plantes absorbent-elles principalement ?",["Oxygène","Hydrogène","Dioxyde de carbone","Azote"],2],
    ["Dans quel pays se trouve la ville de Kyoto ?",["Chine","Corée du Sud","Japon","Thaïlande"],2],
    ["Quel instrument mesure les séismes ?",["Baromètre","Sismographe","Altimètre","Hygromètre"],1],
    ["Quel est le symbole chimique de l'or ?",["Ag","Au","O","Or"],1],
    ["Combien de joueurs une équipe de football aligne-t-elle au coup d'envoi ?",["9","10","11","12"],2],
    ["Quel est le plus long fleuve d'Afrique ?",["Congo","Niger","Nil","Zambèze"],2],
    ["Quelle langue est principalement parlée au Brésil ?",["Espagnol","Portugais","Français","Italien"],1],
    ["Quel organe pompe le sang dans le corps humain ?",["Poumon","Foie","Cœur","Rein"],2],
    ["Quelle est la capitale du Canada ?",["Toronto","Montréal","Ottawa","Vancouver"],2],
    ["Quel métal est liquide à température ambiante ?",["Fer","Mercure","Cuivre","Aluminium"],1],
    ["Combien de minutes y a-t-il dans deux heures ?",["100","110","120","140"],2],
    ["Quel animal est le plus grand mammifère vivant ?",["Éléphant d'Afrique","Baleine bleue","Girafe","Requin-baleine"],1],
    ["Quel continent compte le plus de pays ?",["Europe","Asie","Afrique","Amérique du Sud"],2],
    ["Quel est le résultat de 12 × 8 ?",["86","92","96","108"],2],
    ["Quelle couleur obtient-on en mélangeant bleu et jaune ?",["Orange","Vert","Violet","Marron"],1],
    ["Quelle est la capitale de l'Australie ?",["Sydney","Melbourne","Canberra","Brisbane"],2],
    ["Qui a peint la Joconde ?",["Van Gogh","Picasso","Léonard de Vinci","Michel-Ange"],2],
    ["Quel est le plus petit pays du monde ?",["Monaco","Vatican","Saint-Marin","Liechtenstein"],1],
    ["Combien de dents possède un adulte ?",["28","30","32","34"],2],
    ["Quel est le nombre pi (π) arrondi à deux décimales ?",["3,12","3,14","3,16","3,18"],1],
    ["Quel élément chimique a pour symbole O ?",["Or","Osmium","Oxygène","Olive"],2],
    ["Quelle est la vitesse de la lumière approximativement ?",["300 000 km/s","150 000 km/s","1 000 000 km/s","30 000 km/s"],0]
  ],
  contemporary: [
    ["Quel réseau social est connu pour ses vidéos courtes verticales ?",["LinkedIn","TikTok","Reddit","Wikipedia"],1],
    ["Que signifie l'abréviation IA ?",["Internet automatisé","Intelligence artificielle","Interface avancée","Information augmentée"],1],
    ["Quel service est principalement utilisé pour regarder des séries en streaming ?",["Netflix","Dropbox","Slack","Waze"],0],
    ["Quel appareil portable compte souvent les pas ?",["Routeur","Montre connectée","Scanner","Projecteur"],1],
    ["Quel format est couramment utilisé pour les podcasts ?",["Audio","Tableur","Image fixe","Carte papier"],0],
    ["Quel terme désigne une émission diffusée en direct sur internet ?",["Livestream","Firmware","Cookie","Hashtag"],0],
    ["Quelle technologie permet le paiement sans contact ?",["NFC","VGA","FTP","GPS"],0],
    ["Quel symbole précède souvent un mot-clé sur les réseaux sociaux ?",["&","#","%","@"],1],
    ["Quel service permet des réunions vidéo en ligne ?",["Zoom","Excel","Photoshop","Spotify"],0],
    ["Quel terme désigne une fausse information largement diffusée ?",["Podcast","Désinformation","Archive","Playlist"],1],
    ["Quel objet est utilisé pour recharger un smartphone sans câble ?",["Chargeur à induction","Carte SIM","Disque dur","Clé USB"],0],
    ["Quel terme désigne une personne qui crée régulièrement du contenu en ligne ?",["Influenceur","Archiviste","Imprimeur","Cartographe"],0],
    ["Quel système d'exploitation équipe de nombreux iPhone ?",["Android","Linux","iOS","Windows"],2],
    ["Quel service stocke des fichiers à distance sur internet ?",["Cloud","Bluetooth","BIOS","Cache"],0],
    ["Quel terme désigne une monnaie numérique décentralisée ?",["Cryptomonnaie","Coupon","Action papier","Jeton de métro"],0],
    ["Quel type de casque ajoute des éléments numériques au monde réel ?",["Réalité augmentée","Radio FM","Infrarouge","Télétexte"],0],
    ["Quel mot désigne une image humoristique virale sur internet ?",["Mème","Codec","Script","Pixel mort"],0],
    ["Quel format de contenu disparaît souvent après 24 heures ?",["Story","Wiki","Forum","Newsletter"],0],
    ["Quelle application appartient à Meta (Facebook) ?",["Snapchat","Instagram","TikTok","Twitter"],1],
    ["Quel est le nom du robot conversationnel d'OpenAI ?",["Siri","Alexa","ChatGPT","Cortana"],2]
  ],
  history: [
    ["En quelle année débute la Révolution française ?",["1776","1789","1815","1848"],1],
    ["Quel empire avait Rome pour capitale ?",["Empire romain","Empire ottoman","Empire aztèque","Empire du Mali"],0],
    ["Qui a été le premier homme à marcher sur la Lune ?",["Youri Gagarine","Buzz Aldrin","Neil Armstrong","John Glenn"],2],
    ["Quel mur est tombé en 1989 ?",["Mur d'Hadrien","Mur de Berlin","Grande Muraille","Mur des Lamentations"],1],
    ["Quelle civilisation a construit Machu Picchu ?",["Maya","Inca","Romaine","Phénicienne"],1],
    ["Quel roi de France était surnommé le Roi-Soleil ?",["Louis IX","Louis XIV","Henri IV","François Ier"],1],
    ["Dans quel pays les Jeux olympiques antiques sont-ils nés ?",["Italie","Égypte","Grèce","Turquie"],2],
    ["Quel navigateur atteint l'Amérique en 1492 ?",["Magellan","Christophe Colomb","Vasco de Gama","James Cook"],1],
    ["Quelle guerre oppose principalement le Nord et le Sud des États-Unis ?",["Guerre de Sécession","Guerre de Crimée","Guerre des Boers","Guerre de Cent Ans"],0],
    ["Quel peuple a construit les pyramides de Gizeh ?",["Égyptiens antiques","Vikings","Gaulois","Mongols"],0],
    ["Quel événement marque traditionnellement la fin du Moyen Âge ?",["Chute de Constantinople","Bataille de Verdun","Révolution russe","Traité de Rome"],0],
    ["Qui était Jeanne d'Arc ?",["Une reine d'Angleterre","Une figure militaire française","Une scientifique","Une impératrice romaine"],1],
    ["Quel empire était dirigé par Mansa Moussa ?",["Empire du Mali","Empire mongol","Empire byzantin","Empire inca"],0],
    ["Quel conflit mondial se termine en 1945 ?",["Première Guerre mondiale","Seconde Guerre mondiale","Guerre froide","Guerre de Corée"],1],
    ["Quel peuple est associé aux drakkars ?",["Vikings","Samouraïs","Spartiates","Aztèques"],0],
    ["Quelle ville fut ensevelie par le Vésuve en 79 ?",["Pompéi","Athènes","Sparte","Troie"],0],
    ["Quel document anglais de 1215 limite le pouvoir royal ?",["Magna Carta","Code civil","Déclaration de Balfour","Traité de Versailles"],0],
    ["Quel pays a offert la Statue de la Liberté aux États-Unis ?",["Espagne","France","Italie","Canada"],1],
    ["Qui a écrit 'Les Trois Mousquetaires' ?",["Victor Hugo","Alexandre Dumas","Balzac","Molière"],1],
    ["Quelle bataille a eu lieu en 1066 en Angleterre ?",["Waterloo","Hastings","Trafalgar","Agincourt"],1]
  ],
  cinema: [
    ["Qui a réalisé Titanic ?",["Steven Spielberg","James Cameron","Christopher Nolan","Ridley Scott"],1],
    ["Dans quelle série trouve-t-on Walter White ?",["Narcos","Breaking Bad","Ozark","Lost"],1],
    ["Quel film met en scène Dark Vador ?",["Star Trek","Star Wars","Dune","Avatar"],1],
    ["Qui interprète Harry Potter au cinéma ?",["Daniel Radcliffe","Rupert Grint","Tom Holland","Elijah Wood"],0],
    ["Dans Friends, quel est le prénom de la sœur de Monica ?",["Rachel","Phoebe","Ross","Emily"],2],
    ["Quel film a remporté l'Oscar du meilleur film en 2020 ?",["1917","Parasite","Joker","Once Upon a Time in Hollywood"],1],
    ["Qui a réalisé Pulp Fiction ?",["Martin Scorsese","Quentin Tarantino","David Fincher","Coen Brothers"],1],
    ["Dans Le Seigneur des Anneaux, qui porte l'Anneau ?",["Aragorn","Gandalf","Frodon","Legolas"],2],
    ["Quel acteur incarne Iron Man dans les films Marvel ?",["Chris Evans","Chris Hemsworth","Robert Downey Jr.","Mark Ruffalo"],2],
    ["Quel film d'animation met en scène un rat cuisinier ?",["Shrek","Ratatouille","Kung Fu Panda","Cars"],1],
    ["Dans Game of Thrones, quel est le nom du trône ?",["Trône de Fer","Trône d'Or","Trône de Glace","Trône d'Émeraude"],0],
    ["Qui a composé la musique d'Inception ?",["Hans Zimmer","John Williams","Ennio Morricone","Howard Shore"],0],
    ["Quel film raconte l'histoire du paquebot Titanic ?",["Pearl Harbor","Titanic","Le Pont de la Rivière Kwaï","La Grande Évasion"],1],
    ["Dans Matrix, quel est le vrai nom de Neo ?",["John Anderson","Thomas Anderson","Michael Anderson","David Anderson"],1],
    ["Quelle saga met en scène des dinosaures ?",["King Kong","Jurassic Park","Godzilla","Pacific Rim"],1]
  ],
  sport: [
    ["Combien de joueurs compose une équipe de basket sur le terrain ?",["4","5","6","7"],1],
    ["Quel pays a remporté la Coupe du monde de football 2018 ?",["Brésil","Allemagne","France","Argentine"],2],
    ["Dans quel sport utilise-t-on une raquette ?",["Football","Basket","Tennis","Rugby"],2],
    ["Quelle est la distance d'un marathon ?",["21,195 km","42,195 km","50 km","10 km"],1],
    ["Quel nageur détient le record de médailles olympiques ?",["Ian Thorpe","Michael Phelps","Mark Spitz","Ryan Lochte"],1],
    ["Combien de sets gagne-t-on pour remporter un match de tennis en Grand Chelem (hommes) ?",["2","3","4","5"],1],
    ["Quel pays est considéré comme le berceau du judo ?",["Chine","Corée du Sud","Japon","Thaïlande"],2],
    ["Quelle équipe de Formule 1 est basée à Maranello ?",["Mercedes","Red Bull","Ferrari","McLaren"],2],
    ["Dans quel sport le Super Bowl est-il la finale ?",["Baseball","Football américain","Basket","Hockey"],1],
    ["Quel joueur de tennis est surnommé 'La Rafa' ?",["Roger Federer","Novak Djokovic","Rafael Nadal","Andy Murray"],2],
    ["Quel pays a organisé les Jeux Olympiques de 2016 ?",["Chine","Royaume-Uni","Brésil","Russie"],2],
    ["Combien de points vaut un essai au rugby ?",["3","4","5","7"],2],
    ["Quel sport se pratique sur une planche et des vagues ?",["Ski","Surf","Snowboard","Planche à voile"],1],
    ["Quelle est la durée d'un match de football professionnel ?",["80 min","90 min","100 min","70 min"],1],
    ["Qui est le meilleur buteur de l'histoire de la Coupe du monde ?",["Pelé","Miroslav Klose","Ronaldo","Just Fontaine"],1],
    ["Dans quel sport utilise-t-on un palet ?",["Curling","Hockey sur glace","Les deux","Aucun"],2],
    ["Quelle couleur est associée au maillot du leader du Tour de France ?",["Rouge","Vert","Jaune","Blanc"],2],
    ["Quel sport se joue avec un ballon ovale ?",["Football","Rugby","Basket","Handball"],1],
    ["Quelle nation a remporté le plus de Coupes du monde de rugby ?",["Nouvelle-Zélande","Afrique du Sud","Australie","Angleterre"],0],
    ["Quel est le record du monde du 100 mètres (hommes) approximativement ?",["9,58 s","9,80 s","10,00 s","9,30 s"],0]
  ],
  animals: [
    ["Quel est le plus grand félin du monde ?",["Lion","Tigre","Léopard","Jaguar"],1],
    ["Quel animal est connu pour construire des barrages ?",["Loutre","Castor","Ragondin","Rat musqué"],1],
    ["Combien de cœurs possède une pieuvre ?",["1","2","3","4"],2],
    ["Quel oiseau est incapable de voler et vit en Antarctique ?",["Pélican","Manchot","Albatros","Pingouin"],1],
    ["Quel est le plus grand animal terrestre ?",["Rhinocéros","Éléphant d'Afrique","Girafe","Hippopotame"],1],
    ["Quel insecte produit du miel ?",["Guêpe","Abeille","Frelon","Bourdon"],1],
    ["Quel mammifère est le seul capable de voler ?",["Écureuil volant","Chauve-souris","Colibri","Papillon"],1],
    ["Quel animal change de couleur pour se camoufler ?",["Caméléon","Lézard","Serpent","Grenouille"],0],
    ["Quel est le plus rapide des animaux terrestres ?",["Lion","Guépard","Antilope","Léopard"],1],
    ["Quel animal symbolise la sagesse dans de nombreuses cultures ?",["Loup","Chouette","Renard","Aigle"],1],
    ["Combien de pattes a une araignée ?",["6","8","10","4"],1],
    ["Quel poisson est connu pour ses attaques très médiatisées ?",["Barracuda","Requin","Mérou","Thon"],1],
    ["Quel animal est le plus long de la planète ?",["Baleine bleue","Python","Géant","Calmar colossal"],0],
    ["Quel oiseau est capable de voler vers l'arrière ?",["Aigle","Colibri","Faucon","Hirondelle"],1],
    ["Quel félin est surnommé 'roi de la jungle' ?",["Tigre","Lion","Jaguar","Panthère"],1],
    ["Quel animal pond des œufs mais est un mammifère ?",["Ornithorynque","Kangourou","Koala","Échidné"],0],
    ["Quel est le plus grand reptile vivant ?",["Anaconda","Crocodile marin","Varan de Komodo","Tortue géante"],1],
    ["Quel insecte est appelé 'roi des abeilles' ?",["Frelon","Abeille","Bourdon","Faux"],3],
    ["Quel animal a la plus grande mémoire ?",["Chien","Éléphant","Dauphin","Pie"],1],
    ["Quel oiseau peut imiter la voix humaine ?",["Perroquet","Corbeau","Mésange","Moineau"],0]
  ],
  capitals: [
    ["Quelle est la capitale de l'Italie ?",["Milan","Rome","Venise","Naples"],1],
    ["Quelle est la capitale du Japon ?",["Osaka","Kyoto","Tokyo","Yokohama"],2],
    ["Quelle est la capitale du Brésil ?",["Rio de Janeiro","São Paulo","Salvador","Brasilia"],3],
    ["Quelle est la capitale de l'Allemagne ?",["Munich","Berlin","Hambourg","Francfort"],1],
    ["Quelle est la capitale du Canada ?",["Toronto","Montréal","Ottawa","Vancouver"],2],
    ["Quelle est la capitale de l'Australie ?",["Sydney","Melbourne","Canberra","Brisbane"],2],
    ["Quelle est la capitale de l'Espagne ?",["Barcelone","Madrid","Séville","Valence"],1],
    ["Quelle est la capitale de la Russie ?",["Saint-Pétersbourg","Moscou","Kiev","Varsovie"],1],
    ["Quelle est la capitale de l'Inde ?",["Mumbai","New Delhi","Calcutta","Bangalore"],1],
    ["Quelle est la capitale de l'Argentine ?",["Cordoba","Buenos Aires","Rosario","Mendoza"],1],
    ["Quelle est la capitale de la Norvège ?",["Bergen","Stavanger","Oslo","Tromsø"],2],
    ["Quelle est la capitale de la Grèce ?",["Thessalonique","Athènes","Patras","Héraklion"],1],
    ["Quelle est la capitale du Portugal ?",["Porto","Lisbonne","Faro","Coimbra"],1],
    ["Quelle est la capitale de la Thaïlande ?",["Chiang Mai","Phuket","Bangkok","Pattaya"],2],
    ["Quelle est la capitale de l'Égypte ?",["Le Caire","Alexandrie","Louxor","Assouan"],0],
    ["Quelle est la capitale de la Suède ?",["Göteborg","Malmö","Stockholm","Uppsala"],2],
    ["Quelle est la capitale du Mexique ?",["Guadalajara","Monterrey","Mexico","Cancún"],2],
    ["Quelle est la capitale de la Turquie ?",["Istanbul","Ankara","Izmir","Antalya"],1],
    ["Quelle est la capitale de la Pologne ?",["Cracovie","Varsovie","Gdansk","Wroclaw"],1],
    ["Quelle est la capitale de l'Irlande ?",["Cork","Galway","Dublin","Limerick"],2]
  ],
  flags: [
    ["Quel pays a un drapeau avec une croix rouge sur fond blanc ?",["France","Suisse","Angleterre","Danemark"],2],
    ["Quel pays a un drapeau tricolore bleu, blanc, rouge (vertical) ?",["Pays-Bas","France","Russie","Italie"],1],
    ["Quel pays a un drapeau avec un soleil levant ?",["Chine","Corée du Sud","Japon","Thaïlande"],2],
    ["Quel pays a un drapeau avec une feuille d'érable ?",["États-Unis","Canada","Australie","Nouvelle-Zélande"],1],
    ["Quel pays a un drapeau avec une étoile jaune sur fond rouge ?",["Chine","Vietnam","Turquie","Maroc"],1],
    ["Quel pays a un drapeau avec un lion doré tenant une épée ?",["Inde","Sri Lanka","Népal","Bhoutan"],1],
    ["Quel pays a un drapeau avec des bandes noire, rouge, or ?",["Belgique","Allemagne","Pays-Bas","Autriche"],1],
    ["Quel pays a un drapeau avec un croissant et une étoile ?",["Pakistan","Turquie","Algérie","Tous les trois"],3],
    ["Quel pays a un drapeau avec une silhouette d'oiseau ?",["Papouasie","Papouasie-Nouvelle-Guinée","Fidji","Samoa"],1],
    ["Quel pays a un drapeau avec une croix scandinave bleue et jaune ?",["Norvège","Suède","Finlande","Danemark"],1],
    ["Quel pays a un drapeau avec un dragon rouge ?",["Chine","Bhoutan","Pays de Galles","Tous"],2],
    ["Quel pays a un drapeau avec un arbre de cèdre ?",["Liban","Jordanie","Syrie","Israël"],0],
    ["Quel pays a un drapeau avec une étoile blanche sur fond bleu ?",["Israël","Grèce","Somalie","Les trois"],3],
    ["Quel pays a un drapeau avec un yin et yang ?",["Chine","Corée du Sud","Japon","Mongolie"],1],
    ["Quel pays a un drapeau avec un aigle bicéphale ?",["Autriche","Albanie","Serbie","Monténégro"],2],
    ["Quel pays a un drapeau avec un Union Jack ?",["Australie","Royaume-Uni","Nouvelle-Zélande","Les trois"],3],
    ["Quel pays a un drapeau avec une bande rouge, blanche, rouge horizontale ?",["Pologne","Autriche","Indonésie","Monaco"],1],
    ["Quel pays a un drapeau avec un éléphant blanc ?",["Thaïlande","Laos","Cambodge","Myanmar"],0],
    ["Quel pays a un drapeau avec une tulipe stylisée ?",["Pays-Bas","Belgique","Luxembourg","Turquie"],0],
    ["Quel pays a un drapeau avec un kangourou et un émeu ?",["Australie","Nouvelle-Zélande","Fidji","Papouasie"],0]
  ]
};

// V4: buildQuestionSet supporte les multi-thèmes et l'anti-répétition
function buildQuestionSet(topics, count, multipliers = false, usedIds = new Set()) {
  // topics peut être une chaîne ou un tableau de chaînes
  const topicList = Array.isArray(topics) ? topics : [topics];

  // Rassembler toutes les questions disponibles des thèmes sélectionnés
  let pool = [];
  topicList.forEach(topic => {
    const bank = QUESTION_BANK[topic] || [];
    bank.forEach((q, idx) => {
      const uid = `${topic}-${idx}`;
      if (!usedIds.has(uid)) {
        pool.push({ uid, text: q[0], choices: q[1], correct: q[2], multiplier: 1, topic });
      }
    });
  });

  // Mélanger
  pool.sort(() => Math.random() - 0.5);

  // Sélectionner
  const selected = pool.slice(0, count);

  // Appliquer les multiplicateurs si demandé
  if (multipliers && selected.length >= 4) {
    const positions = [...selected.keys()].sort(() => Math.random() - 0.5);
    positions.slice(0, 3).forEach(i => selected[i].multiplier = 2);
    selected[positions[3]].multiplier = 3;
  }

  return selected;
}
