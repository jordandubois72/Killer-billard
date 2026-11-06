(function () {
"use strict";
/* ================= Données ================= */
var BALLS = {
  1:{color:"#F0B429",stripe:false}, 2:{color:"#2B6CB8",stripe:false}, 3:{color:"#C4361D",stripe:false},
  4:{color:"#6B3FA0",stripe:false}, 5:{color:"#E07B1A",stripe:false}, 6:{color:"#1E7A46",stripe:false},
  7:{color:"#7A2E2E",stripe:false}, 8:{color:"#181818",stripe:false}, 9:{color:"#F0B429",stripe:true},
  10:{color:"#2B6CB8",stripe:true}
};
var BALL_NUMBERS = Object.keys(BALLS).map(Number);

var ANIMALS = {
  1:{name:"Chèvre",badge:"#E8C34A"}, 2:{name:"Renard",badge:"#D9662A"}, 3:{name:"Panda",badge:"#7C8A95"},
  4:{name:"Lion",badge:"#B8752E"}, 5:{name:"Cochon",badge:"#D6708C"}, 6:{name:"Loup",badge:"#4F6B7A"},
  7:{name:"Ours",badge:"#7A4A2E"}, 8:{name:"Chat",badge:"#1F1F1F"}, 9:{name:"Perroquet",badge:"#2F9E63"},
  10:{name:"Taureau",badge:"#A33B3B"}
};
var FACE = "#F5EEDD", DARK = "#241a10", MANE = "#D9B36B";


var RULE_PRESETS = [
  "La 7 : tu sautes ton prochain tour",
  "La 12 : au tour d'après, place la blanche où tu veux",
  "Boules 10 à 15 : le suivant doit rentrer en bande",
  "Trou du milieu : une boule joker (7 ou 12) qui y tombe revient sur la table",
  "2 boules d'un coup : +2 vies"
];


/* ================= Utilitaires ================= */
function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
function uid() { return Math.random().toString(36).slice(2, 10); }
var _svgUidCounter = 0;
function nextSvgUid() { return "u" + (_svgUidCounter++); }


/* ================= Langues (FR / EN) ================= */
var I18N = {
  fr: {
    appSub: "Billard entre amis",
    tabPlay: "Jouer", tabLegends: "Légendes", tabBook: "Le Livre", tabHelp: "Aide", tabSettings: "Réglages",
    // accueil
    kingOfPool: "Roi du billard",
    newGame: "Nouvelle partie",
    setupLead: "Ajoute les joueurs de la soirée, puis lance la partie.",
    playerName: "Nom du joueur",
    add: "Ajouter",
    regulars: "Joueurs habituels",
    noPlayers: "Aucun joueur pour l'instant. Il en faut au moins deux.",
    oneMore: "Encore un joueur et c'est parti.",
    maxPlayers: "Dix joueurs maximum : une carte chacun.",
    startGame: "Lancer la partie",
    removeX: "Retirer {name}",
    playersCount_one: "{n} joueur", playersCount_many: "{n} joueurs",
    // distribution
    dealLeadClassic: "Chacun reçoit sa carte. Elle l'identifie pour toute la soirée et sert à tirer qui joue.",
    dealLeadDone: "Chacun a sa carte pour toute la soirée.",
    dealTurn: "Au tour de {name} de choisir sa carte",
    dealHint: "Touche une carte face cachée",
    letsGo: "C'est parti",
    continue: "Continuer",
    hiddenCard: "Carte face cachée",
    // partie
    round: "Manche {n}",
    tour: "Tour {n}",
    rules: "Règles",
    pickCard: "Pioche une carte pour savoir qui joue",
    cardsLeft_one: "{n} carte restante", cardsLeft_many: "{n} cartes restantes",
    newTourSoon: "Tout le monde a joué : nouveau tour…",
    yourTurn: "À toi de jouer !",
    turnOf: "C'est à {name} de jouer",
    tapToClose: "Touche pour fermer",
    loseLife: "{name} perd une vie",
    gainLife: "{name} gagne une vie",
    revive: "Réintégrer",
    reviveX: "Réintégrer {name}",
    eliminated: "Éliminé",
    nightRanking: "Classement de la soirée",
    endNight: "Terminer la soirée",
    undo: "Annuler",
    undoX: "Annuler : {label}",
    undone: "Annulé : {label}",
    houseRules: "Règles maison",
    noRulesYet: "Aucune règle ajoutée pour l'instant.",
    ruleExample: "Ex : la 7 fait passer son tour",
    pickIdea: "Piocher une idée de règle",
    closeIdeas: "Fermer les idées",
    close: "Fermer",
    // fin de manche
    winsRound: "remporte la manche {n}",
    undoMistake: "Annuler (fausse manœuvre)",
    addRuleQ: "Une règle pour la prochaine manche ? (facultatif)",
    nextRound: "Manche suivante",
    // fin de soirée
    savedNight: "Soirée enregistrée dans « Les soirées »",
    kingOfNight: "Roi de la soirée",
    finalRanking: "Classement final",
    rulesTonight: "Règles inventées ce soir",
    shareSummary: "Partager le résumé",
    copied: "Copié !",
    saveFile: "Sauvegarder mes données (fichier)",
    resumeNight: "Reprendre la soirée",
    roundsWon_one: "{n} manche", roundsWon_many: "{n} manches",
    shareTitle: "Killer : résultats de la soirée",
    shareRules: "Règles inventées :",
    // légendes
    legendsTitle: "Légendes",
    segWall: "Le Mur", segRanking: "Classement", segNights: "Soirées",
    wallLead: "Les avis de recherche de tous les temps.",
    wanted: "Wanted",
    reward: "Récompense",
    roundsWonLabel_one: "manche gagnée", roundsWonLabel_many: "manches gagnées",
    nobodyYet: "Personne n'a encore gagné de manche. Reviens après une soirée !",
    resetWall: "Réinitialiser le classement",
    resetConfirm: "Effacer tout le classement ? C'est définitif (l'historique des soirées est conservé).",
    yesErase: "Oui, effacer",
    cancel: "Annuler",
    byRounds: "Manches", byNights: "Soirées",
    rankRoundsLead: "Manches gagnées depuis toujours.",
    rankNightsLead: "Soirées remportées : le roi de chaque soirée est celui qui a gagné le plus de manches.",
    nights_one: "{n} soirée", nights_many: "{n} soirées",
    nightsWord_one: "soirée", nightsWord_many: "soirées",
    roundsWord_one: "manche", roundsWord_many: "manches",
    noNights: "Aucune soirée enregistrée pour l'instant. Chaque soirée jouée apparaîtra ici automatiquement, même si tu oublies de la terminer.",
    live: "En cours", unfinished: "Non terminée",
    noWinner: "Pas de vainqueur",
    nightRules: "Règles de la soirée",
    deleteNight: "Supprimer cette soirée",
    deleteNightConfirm: "Supprimer cette soirée de l'historique ? Le Mur ne change pas.",
    yesDelete: "Oui, supprimer",
    nightDeleted: "Soirée supprimée",
    // fiche joueur
    profile: "Fiche joueur",
    statRounds: "Manches gagnées",
    statNights: "Soirées jouées",
    statKing: "Soirées remportées",
    statRate: "Victoires",
    statStreak: "Série en cours",
    statBest: "Meilleure série",
    statLast: "Dernière partie",
    statFav: "Carte fétiche",
    streakNote: "Les séries comptent les manches gagnées d'affilée depuis la V3.",
    never: "jamais",
    // livre
    bookTitle: "Le Grand Livre",
    bookLead: "Toutes les règles maison inventées depuis le début, soirée après soirée.",
    bookAdd: "Ajouter une règle au livre",
    bookEmpty: "Aucune règle enregistrée pour l'instant.",
    edit: "Modifier", delete: "Supprimer", ok: "OK",
    // aide
    helpTitle: "Comment jouer",
    h1t: "Pour commencer", h1: "Entrez les joueurs, puis chacun reçoit une carte qui l'identifie pour toute la soirée. Tout le monde démarre chaque manche avec 3 vies.",
    h2t: "Qui joue ?", h2: "On pioche une carte parmi celles encore face cachée : c'est à cette personne de jouer. Chacun passe une fois par tour ; quand tout le monde a joué, un nouveau tour commence et on peut retomber sur soi-même juste après.",
    h3t: "La règle du jeu", h3: "Peu importe les couleurs, les rayées ou les numéros : le seul objectif est de rentrer au moins une boule à son tour. Si tu n'en rentres aucune, tu perds une vie.",
    h4t: "La casse", h4: "Le premier joueur tiré casse. S'il ne rentre aucune boule sur la casse, il a le droit de rejouer immédiatement.",
    h5t: "La boule 8", h5: "Rentrer la 8 fait gagner une vie bonus. Si toutes les boules sont rentrées avant qu'il y ait un vainqueur, on remet les boules en place avec une nouvelle 8, et la manche continue.",
    h6t: "Fin de la manche", h6: "Un joueur à 0 vie est éliminé pour le reste de la manche. Dès qu'il ne reste qu'un seul joueur avec des vies, il remporte la manche.",
    h7t: "Les règles maison", h7: "Le gagnant de la manche peut inventer une nouvelle règle, valable dès la manche suivante et jusqu'à la fin de la soirée. Les vies repassent à 3 à chaque manche ; les cartes et les règles restent.",
    h8t: "Une erreur ?", h8: "« Annuler » remet la partie comme avant le dernier geste (vie, carte, fin de manche, fin de soirée). Un joueur éliminé par erreur peut être réintégré avec 1 vie.",
    // réglages
    gameOptions: "Options de jeu",
    gameOptionsHint: "Active seulement ce qui vous plaît : tout est désactivable à tout moment.",
    optLastBullet: "Dernière balle", optLastBulletHint: "La ligne pulse en rouge quand il ne reste qu'une vie",
    optRivalries: "Rivalités", optRivalriesHint: "Ennemi juré et proie sur la fiche joueur",
    optTrophies: "Trophées", optTrophiesHint: "Badges à débloquer, annoncés pendant la partie",
    optChrono: "Mode chrono", optChronoHint: "Temps par coup ; à zéro, le joueur perd une vie",
    chronoLen: "Temps par coup",
    chronoSec: "sec", chronoPaused: "pause", chronoPause: "Mettre le chrono en pause", chronoResume: "Relancer le chrono",
    tTimeUp: "Temps écoulé : {name} perd une vie",
    trophyUnlocked: "{name} débloque « {trophy} »",
    trophiesTitle: "Trophées",
    tr_first: "Premier sang", trd_first: "Gagner une manche",
    tr_hat: "Coup du chapeau", trd_hat: "3 manches d'affilée",
    tr_streak5: "Inarrêtable", trd_streak5: "5 manches d'affilée",
    tr_survivor: "Sur le fil", trd_survivor: "Gagner avec une seule vie",
    tr_flawless: "Intouchable", trd_flawless: "Gagner sans perdre de vie",
    tr_phoenix: "Revenu d'entre les morts", trd_phoenix: "Gagner après avoir été réintégré",
    tr_king1: "Roi d'un soir", trd_king1: "Remporter une soirée",
    tr_king5: "Dynastie", trd_king5: "Remporter 5 soirées",
    tr_regular: "Pilier du saloon", trd_regular: "Jouer 10 soirées",
    tr_hunter: "Chasseur de primes", trd_hunter: "25 manches gagnées",
    tr_legend: "Légende de l'Ouest", trd_legend: "100 manches gagnées",
    rivalsTitle: "Rivalités",
    nemesis: "Ennemi juré", prey: "Sa proie",
    rivalCount_one: "devant lui {n} soirée", rivalCount_many: "devant lui {n} soirées",
    preyCount_one: "battu {n} soirée", preyCount_many: "battu {n} soirées",
    noRivalYet: "Pas encore assez de soirées pour désigner un rival.",
    shareCard: "Partager la carte de la soirée",
    shareSend: "Envoyer l'image",
    shareLoading: "Préparation de la carte…",
    potIn: "Rentrée", potMiss: "Ratée", moreInfo: "Infos", back: "Retour",
    whichBalls: "Quelle(s) boule(s) ?", whichHint: "Touche les boules rentrées sur ce coup",
    potConfirm_one: "Valider ({n} boule)", potConfirm_many: "Valider ({n} boules)", potNoDetail: "Sans préciser", ballsLeftShort: "{n} sur la table",
    livesLeft_one: "{n} vie restante", livesLeft_many: "{n} vies restantes",
    lastLife: "Dernière balle !",
    tableTitle: "Sur la table", ballsLeft_one: "{n} boule sur la table", ballsLeft_many: "{n} boules sur la table",
    tableFull: "Râtelier complet", rackN: "Râtelier {n}",
    eightOn: "La 8 est sur la table : une vie à gagner", eightOff: "La 8 est rentrée",
    rulesInPlay: "Règles en cours", ballOnTable: "sur la table", ballPottedBy: "rentrée par {name}",
    noBallRules: "Aucune règle maison ne cite une boule pour l'instant.",
    ballN: "la {n}", ballsAnd: " et ",
    tPot: "{name} rentre {balls}", tPotPlain: "{name} a rentré !", tEight: "{name} rentre la 8 : +1 vie !",
    tRerack: "Table vide : on remet toutes les boules",
    ruleAlertTitle: "{name} rentre {balls}", applyPlus: "+1 vie", applyMinus: "−1 vie", applySkip: "Passe son tour",
    tSkipSet: "{name} ne sera pas tiré au prochain tour", skipTag: "Passe son tour", tSkipped: "{name} passe ce tour",
    uPot: "{name} rentre {balls}", uMiss: "{name} rate son coup", uSkip: "{name} passe son tour", dismiss: "OK",
    tableInfo: "Infos de la table",
    optHouseRules: "Règles maison", optHouseRulesHint: "Ajouter une règle en fin de manche, rappels pendant la partie",
    optJokers: "Jokers", optJokersHint: "Le gagnant de la manche peut piocher un joker bonus ou malus",
    roundChoiceRule: "Nouvelle règle", roundChoiceJoker: "Piocher un joker",
    jokerDrawHint: "Bonus ou malus ? Le hasard décide.", jokerDraw: "Piocher",
    jokerBonus: "Joker bonus", jokerMalus: "Joker malus",
    jokerKeptBy: "{name} le garde pour plus tard", jokerGiveTo: "Donne ce malus à :",
    jokerRandomTarget: "Si personne n'est choisi, il ira à un joueur au hasard",
    jokersTitle: "Jokers", useJoker: "Utiliser", tJokerUsed: "{name} utilise « {joker} »",
    tJokerGiven: "{name} reçoit le joker « {joker} »", uJoker: "{name} utilise « {joker} »",
    bookTabRules: "Règles", bookTabJokers: "Jokers",
    jokersLead: "Le gagnant d'une manche peut tenter sa chance : il pioche un joker au hasard, une chance sur deux d'avoir un bonus ou un malus. Dans les deux cas, c'est pour lui.",
    jokerMalusFor: "Pas de chance : {name} le prend pour lui",
    jokerAdd: "Décris ton joker", jokerMine: "Joker perso", jokersNone: "Les jokers sont désactivés dans les Réglages.",
    jk_b1: "Seconde chance", jkt_b1: "Tu rates ? Retente le coup en bande, sans perdre de vie.",
    jk_b2: "Gilet pare-balles", jkt_b2: "Ta prochaine vie perdue ne compte pas.",
    jk_b3: "Main du shérif", jkt_b3: "Place la blanche où tu veux avant de jouer.",
    jk_b4: "À couvert", jkt_b4: "Tu sautes ton prochain tour : aucune vie en jeu.",
    jk_m1: "Mauvaise main", jkt_m1: "Ton prochain coup se joue avec ta mauvaise main.",
    jk_m2: "Bande imposée", jkt_m2: "Ton prochain coup doit rentrer en bande.",
    jk_m3: "Une seule main", jkt_m3: "Joue ton prochain coup en tenant la queue d'une seule main.",
    jk_m4: "Tête mise à prix", jkt_m4: "Si tu rates ton prochain coup, tu perds 2 vies.",
    tShieldArmed: "{name} est protégé : sa prochaine vie perdue ne compte pas", tSecondArmed: "{name} retente en bande : ce raté ne coûte pas de vie",
    tShieldUsed: "{joker} : {name} ne perd pas de vie", tBountyArmed: "{name} : son prochain raté coûte 2 vies", tBountyHit: "Tête mise à prix : {name} perd 2 vies",
    tagShield: "Protégé", tagBounty: "Vie ×2", jkNamePh: "Nom du joker", jkTextPh: "Ce qu'il fait", jkReset: "Texte d'origine", jokerAuto: "Effet automatique",
    tImageSaved: "Image enregistrée ✓",
    resetAll: "Tout remettre à zéro",
    resetQ: "Tout remettre à zéro ?",
    resetText: "Idéal pour repartir sur une base propre après des parties de test.",
    resetGone: "Effacés : le Mur des Légendes, les classements, toutes les soirées, les séries, les trophées, les joueurs habituels et la partie en cours.",
    resetKept: "Gardés : le Grand Livre des règles et tes réglages. Une sauvegarde automatique est faite juste avant, au cas où.",
    resetYes: "Tout effacer",
    tResetDone: "Tout est remis à zéro ✓",
    backupBeforeReset: "avant remise à zéro",
    cardFooter: "{n} manches jouées",
    settingsTitle: "Réglages",
    install: "Installer l'appli",
    installText: "Dans Safari : Partager → « Sur l'écran d'accueil ». Ouvre ensuite toujours l'appli par son icône : elle garde ses propres données.",
    appearance: "Apparence",
    themeLounge: "Saloon", themeClassic: "Classique",
    language: "Langue",
    comfort: "Confort",
    sound: "Sons", soundHint: "Coup de feu à chaque carte",
    haptics: "Vibrations", hapticsHint: "Retour tactile",
    wake: "Écran toujours allumé", wakeHint: "Pendant une partie",
    myData: "Mes données",
    autoSaved: "Tout est enregistré automatiquement sur ce téléphone, à chaque action.",
    dataCounts: "{nights} · {rules} · {players} au Mur",
    rules_one: "{n} règle", rules_many: "{n} règles",
    lastExport: "Dernier fichier de secours",
    exportDue: "Pense à exporter un fichier de secours : il te protège si le téléphone est réinitialisé.",
    today: "aujourd'hui",
    daysAgo_one: "il y a {n} jour", daysAgo_many: "il y a {n} jours",
    durable: "Stockage protégé",
    yes: "oui", no: "non", unknown: "inconnu",
    writeFail: "écriture impossible",
    exportBtn: "Exporter un fichier de secours",
    copyCode: "Copier le code",
    importFile: "Importer",
    pasteCode: "Coller un code de sauvegarde",
    hide: "Masquer",
    pasteHere: "Colle ici le code copié",
    importCode: "Importer ce code",
    autoBackups: "Sauvegardes automatiques",
    firstBackup: "La première sera créée à la fin de ta prochaine soirée.",
    restore: "Restaurer",
    regularsHint: "Les prénoms que tu utilises apparaîtront ici et s'ajouteront en un tap.",
    forgetX: "Oublier {name}",
    version: "Killer v{v}",
    // modales & messages
    importQ: "Remplacer les données de ce téléphone ?",
    importText: "Cette sauvegarde contient {nights}, {rules} et {players} au Mur{date}. Une copie de tes données actuelles est gardée dans les sauvegardes automatiques.",
    exportedOn: " (exportée le {d})",
    replace: "Remplacer",
    restoreQ: "Restaurer cette sauvegarde ?",
    restoreText: "Données du {d}. Tes données actuelles sont d'abord mises de côté.",
    restoredTitle: "Données restaurées",
    restoredText: "Le fichier principal était illisible. On a restauré la sauvegarde automatique du {d}.",
    tShared: "Sauvegarde envoyée ✓", tDownloaded: "Fichier de sauvegarde téléchargé ✓", tCopied: "Code de sauvegarde copié ✓",
    tExportFail: "Export impossible sur ce navigateur", tCopyFail: "Copie impossible : utilise l'export fichier",
    tImported: "Sauvegarde importée ✓", tRestored: "Sauvegarde restaurée ✓", tRecovered: "Données récupérées ✓",
    tLegacy: "Données de la V1 reprises ✓", tSaveFail: "Enregistrement impossible : stockage plein ou bloqué",
    tMax: "Dix joueurs maximum", tDup: "{name} est déjà dans la partie",
    tElim: "{name} est éliminé", tBack: "{name} est de retour (1 vie)",
    tLives_one: "{name} : {n} vie", tLives_many: "{name} : {n} vies",
    errNotJson: "Ce texte n'est pas une sauvegarde Killer lisible.",
    errNotKiller: "Ce fichier ne ressemble pas à une sauvegarde Killer.",
    errRead: "Lecture du fichier impossible.",
    uLifeMinus: "{name} −1 vie", uLifePlus: "{name} +1 vie", uCard: "carte de {name}",
    uNextRound: "manche suivante", uEndNight: "fin de soirée",
    backupAuto: "auto", backupNight: "soirée", backupBeforeImport: "avant import", backupBeforeRestore: "avant restauration"
  },
  en: {
    appSub: "Pool night with friends",
    tabPlay: "Play", tabLegends: "Legends", tabBook: "The Book", tabHelp: "Help", tabSettings: "Settings",
    kingOfPool: "King of the table",
    newGame: "New game",
    setupLead: "Add tonight's players, then start the game.",
    playerName: "Player name",
    add: "Add",
    regulars: "Regulars",
    noPlayers: "No players yet. You need at least two.",
    oneMore: "One more player and you're on.",
    maxPlayers: "Ten players max: one card each.",
    startGame: "Start the game",
    removeX: "Remove {name}",
    playersCount_one: "{n} player", playersCount_many: "{n} players",
    dealLeadClassic: "Everyone gets a card. It stands for you all night and decides who shoots.",
    dealLeadDone: "Everyone has their card for the night.",
    dealTurn: "{name}, pick your card",
    dealHint: "Tap a face-down card",
    letsGo: "Let's go",
    continue: "Continue",
    hiddenCard: "Face-down card",
    round: "Round {n}",
    tour: "Turn {n}",
    rules: "Rules",
    pickCard: "Draw a card to see who shoots",
    cardsLeft_one: "{n} card left", cardsLeft_many: "{n} cards left",
    newTourSoon: "Everyone has played: new turn…",
    yourTurn: "You're up!",
    turnOf: "{name} is up",
    tapToClose: "Tap to close",
    loseLife: "{name} loses a life",
    gainLife: "{name} gains a life",
    revive: "Bring back",
    reviveX: "Bring back {name}",
    eliminated: "Out",
    nightRanking: "Tonight's ranking",
    endNight: "End the night",
    undo: "Undo",
    undoX: "Undo: {label}",
    undone: "Undone: {label}",
    houseRules: "House rules",
    noRulesYet: "No rules added yet.",
    ruleExample: "E.g. the 7 skips your turn",
    pickIdea: "Draw a rule idea",
    closeIdeas: "Close ideas",
    close: "Close",
    winsRound: "wins round {n}",
    undoMistake: "Undo (misclick)",
    addRuleQ: "A rule for the next round? (optional)",
    nextRound: "Next round",
    savedNight: "Night saved in “Nights”",
    kingOfNight: "King of the night",
    finalRanking: "Final ranking",
    rulesTonight: "Rules invented tonight",
    shareSummary: "Share the results",
    copied: "Copied!",
    saveFile: "Save my data (file)",
    resumeNight: "Resume the night",
    roundsWon_one: "{n} round", roundsWon_many: "{n} rounds",
    shareTitle: "Killer: tonight's results",
    shareRules: "House rules:",
    legendsTitle: "Legends",
    segWall: "The Wall", segRanking: "Ranking", segNights: "Nights",
    wallLead: "All-time wanted posters.",
    wanted: "Wanted",
    reward: "Reward",
    roundsWonLabel_one: "round won", roundsWonLabel_many: "rounds won",
    nobodyYet: "Nobody has won a round yet. Come back after a night!",
    resetWall: "Reset the ranking",
    resetConfirm: "Erase the whole ranking? This can't be undone (night history is kept).",
    yesErase: "Yes, erase",
    cancel: "Cancel",
    byRounds: "Rounds", byNights: "Nights",
    rankRoundsLead: "Rounds won, all time.",
    rankNightsLead: "Nights won: the king of a night is whoever won the most rounds.",
    nights_one: "{n} night", nights_many: "{n} nights",
    nightsWord_one: "night", nightsWord_many: "nights",
    roundsWord_one: "round", roundsWord_many: "rounds",
    noNights: "No nights saved yet. Every night you play shows up here automatically, even if you forget to end it.",
    live: "Live", unfinished: "Unfinished",
    noWinner: "No winner",
    nightRules: "Rules of the night",
    deleteNight: "Delete this night",
    deleteNightConfirm: "Delete this night from history? The Wall stays the same.",
    yesDelete: "Yes, delete",
    nightDeleted: "Night deleted",
    profile: "Player card",
    statRounds: "Rounds won",
    statNights: "Nights played",
    statKing: "Nights won",
    statRate: "Win rate",
    statStreak: "Current streak",
    statBest: "Best streak",
    statLast: "Last played",
    statFav: "Lucky card",
    streakNote: "Streaks count rounds won in a row since V3.",
    never: "never",
    bookTitle: "The Rule Book",
    bookLead: "Every house rule invented since day one, night after night.",
    bookAdd: "Add a rule to the book",
    bookEmpty: "No rules saved yet.",
    edit: "Edit", delete: "Delete", ok: "OK",
    helpTitle: "How to play",
    h1t: "Getting started", h1: "Enter the players, then everyone gets a card that stands for them all night. Everyone starts each round with 3 lives.",
    h2t: "Who shoots?", h2: "Draw one of the face-down cards: that person shoots. Everyone plays once per turn; when everyone has played, a new turn starts and you can come up again right away.",
    h3t: "The rule", h3: "Colours, stripes and numbers don't matter: the only goal is to pot at least one ball on your turn. Pot nothing and you lose a life.",
    h4t: "The break", h4: "The first player drawn breaks. If nothing goes down on the break, they get to shoot again straight away.",
    h5t: "The 8 ball", h5: "Potting the 8 earns a bonus life. If every ball is down before there's a winner, rack them up again with a new 8 and the round goes on.",
    h6t: "End of the round", h6: "A player on 0 lives is out for the rest of the round. As soon as only one player has lives left, they win the round.",
    h7t: "House rules", h7: "The round winner can invent a new rule that applies from the next round until the end of the night. Lives reset to 3 each round; cards and rules stay.",
    h8t: "Made a mistake?", h8: "“Undo” puts the game back as it was before the last action (life, card, end of round, end of night). A player knocked out by mistake can be brought back with 1 life.",
    gameOptions: "Game options",
    gameOptionsHint: "Turn on only what you like: everything can be switched off anytime.",
    optLastBullet: "Last bullet", optLastBulletHint: "The row pulses red when only one life is left",
    optRivalries: "Rivalries", optRivalriesHint: "Nemesis and prey on the player card",
    optTrophies: "Trophies", optTrophiesHint: "Badges to unlock, announced during the game",
    optChrono: "Shot clock", optChronoHint: "Time per shot; at zero, the player loses a life",
    chronoLen: "Time per shot",
    chronoSec: "sec", chronoPaused: "paused", chronoPause: "Pause the clock", chronoResume: "Resume the clock",
    tTimeUp: "Time's up: {name} loses a life",
    trophyUnlocked: "{name} unlocks “{trophy}”",
    trophiesTitle: "Trophies",
    tr_first: "First blood", trd_first: "Win a round",
    tr_hat: "Hat trick", trd_hat: "3 rounds in a row",
    tr_streak5: "Unstoppable", trd_streak5: "5 rounds in a row",
    tr_survivor: "By a thread", trd_survivor: "Win with a single life",
    tr_flawless: "Untouchable", trd_flawless: "Win without losing a life",
    tr_phoenix: "Back from the dead", trd_phoenix: "Win after being brought back",
    tr_king1: "King for a night", trd_king1: "Win a night",
    tr_king5: "Dynasty", trd_king5: "Win 5 nights",
    tr_regular: "Saloon regular", trd_regular: "Play 10 nights",
    tr_hunter: "Bounty hunter", trd_hunter: "Win 25 rounds",
    tr_legend: "Legend of the West", trd_legend: "Win 100 rounds",
    rivalsTitle: "Rivalries",
    nemesis: "Nemesis", prey: "Prey",
    rivalCount_one: "ahead {n} night", rivalCount_many: "ahead {n} nights",
    preyCount_one: "beaten {n} night", preyCount_many: "beaten {n} nights",
    noRivalYet: "Not enough nights yet to name a rival.",
    shareCard: "Share the night card",
    shareSend: "Send the image",
    shareLoading: "Preparing the card…",
    potIn: "Potted", potMiss: "Missed", moreInfo: "Info", back: "Back",
    whichBalls: "Which ball(s)?", whichHint: "Tap the balls potted on this shot",
    potConfirm_one: "Confirm ({n} ball)", potConfirm_many: "Confirm ({n} balls)", potNoDetail: "No details", ballsLeftShort: "{n} on the table",
    livesLeft_one: "{n} life left", livesLeft_many: "{n} lives left",
    lastLife: "Last bullet!",
    tableTitle: "On the table", ballsLeft_one: "{n} ball on the table", ballsLeft_many: "{n} balls on the table",
    tableFull: "Full rack", rackN: "Rack {n}",
    eightOn: "The 8 is still on the table: a life to win", eightOff: "The 8 is down",
    rulesInPlay: "Rules in play", ballOnTable: "on the table", ballPottedBy: "potted by {name}",
    noBallRules: "No house rule mentions a ball yet.",
    ballN: "the {n}", ballsAnd: " and ",
    tPot: "{name} pots {balls}", tPotPlain: "{name} potted!", tEight: "{name} pots the 8: +1 life!",
    tRerack: "Table cleared: rack them all up again",
    ruleAlertTitle: "{name} pots {balls}", applyPlus: "+1 life", applyMinus: "−1 life", applySkip: "Skip a turn",
    tSkipSet: "{name} won't be drawn next turn", skipTag: "Skips a turn", tSkipped: "{name} skips this turn",
    uPot: "{name} pots {balls}", uMiss: "{name} misses", uSkip: "{name} skips a turn", dismiss: "OK",
    tableInfo: "Table info",
    optHouseRules: "House rules", optHouseRulesHint: "Add a rule at the end of a round, reminders during the game",
    optJokers: "Jokers", optJokersHint: "The round winner can draw a bonus or penalty joker",
    roundChoiceRule: "New rule", roundChoiceJoker: "Draw a joker",
    jokerDrawHint: "Bonus or penalty? Luck decides.", jokerDraw: "Draw",
    jokerBonus: "Bonus joker", jokerMalus: "Penalty joker",
    jokerKeptBy: "{name} keeps it for later", jokerGiveTo: "Give this penalty to:",
    jokerRandomTarget: "If nobody is picked, it goes to a random player",
    jokersTitle: "Jokers", useJoker: "Use", tJokerUsed: "{name} uses “{joker}”",
    tJokerGiven: "{name} gets the “{joker}” joker", uJoker: "{name} uses “{joker}”",
    bookTabRules: "Rules", bookTabJokers: "Jokers",
    jokersLead: "A round winner can try their luck: they draw a random joker, fifty-fifty bonus or penalty. Either way, it's theirs.",
    jokerMalusFor: "Bad luck: {name} takes it",
    jokerAdd: "Describe your joker", jokerMine: "Custom joker", jokersNone: "Jokers are turned off in Settings.",
    jk_b1: "Second chance", jkt_b1: "Missed? Retry the shot off a cushion, no life lost.",
    jk_b2: "Bulletproof vest", jkt_b2: "Your next lost life doesn't count.",
    jk_b3: "Sheriff's hand", jkt_b3: "Place the cue ball anywhere before you shoot.",
    jk_b4: "Take cover", jkt_b4: "Skip your next turn: no life at risk.",
    jk_m1: "Wrong hand", jkt_m1: "Your next shot is played with your weaker hand.",
    jk_m2: "Cushion only", jkt_m2: "Your next shot must go off a cushion.",
    jk_m3: "One hand", jkt_m3: "Play your next shot holding the cue with one hand.",
    jk_m4: "Price on your head", jkt_m4: "Miss your next shot and you lose 2 lives.",
    tShieldArmed: "{name} is protected: their next lost life doesn't count", tSecondArmed: "{name} retries off a cushion: this miss costs no life",
    tShieldUsed: "{joker}: {name} keeps their life", tBountyArmed: "{name}: their next miss costs 2 lives", tBountyHit: "Price on your head: {name} loses 2 lives",
    tagShield: "Protected", tagBounty: "Life ×2", jkNamePh: "Joker name", jkTextPh: "What it does", jkReset: "Original text", jokerAuto: "Automatic effect",
    tImageSaved: "Image saved ✓",
    resetAll: "Reset everything",
    resetQ: "Reset everything?",
    resetText: "Perfect to start fresh after some test games.",
    resetGone: "Erased: the Wall of Legends, rankings, every night, streaks, trophies, regular players and the current game.",
    resetKept: "Kept: the Rule Book and your settings. An automatic backup is made just before, just in case.",
    resetYes: "Erase all",
    tResetDone: "Everything is reset ✓",
    backupBeforeReset: "before reset",
    cardFooter: "{n} rounds played",
    settingsTitle: "Settings",
    install: "Install the app",
    installText: "In Safari: Share → “Add to Home Screen”. Then always open the app from its icon: it keeps its own data.",
    appearance: "Look",
    themeLounge: "Saloon", themeClassic: "Classic",
    language: "Language",
    comfort: "Comfort",
    sound: "Sounds", soundHint: "Gunshot on every card",
    haptics: "Vibration", hapticsHint: "Haptic feedback",
    wake: "Keep screen on", wakeHint: "During a game",
    myData: "My data",
    autoSaved: "Everything is saved automatically on this phone, after every action.",
    dataCounts: "{nights} · {rules} · {players} on the Wall",
    rules_one: "{n} rule", rules_many: "{n} rules",
    lastExport: "Last backup file",
    exportDue: "Export a backup file now and then: it protects you if the phone gets reset.",
    today: "today",
    daysAgo_one: "{n} day ago", daysAgo_many: "{n} days ago",
    durable: "Protected storage",
    yes: "yes", no: "no", unknown: "unknown",
    writeFail: "can't write",
    exportBtn: "Export a backup file",
    copyCode: "Copy code",
    importFile: "Import",
    pasteCode: "Paste a backup code",
    hide: "Hide",
    pasteHere: "Paste the copied code here",
    importCode: "Import this code",
    autoBackups: "Automatic backups",
    firstBackup: "The first one is made at the end of your next night.",
    restore: "Restore",
    regularsHint: "Names you use will show up here and can be added in one tap.",
    forgetX: "Forget {name}",
    version: "Killer v{v}",
    importQ: "Replace the data on this phone?",
    importText: "This backup contains {nights}, {rules} and {players} on the Wall{date}. A copy of your current data is kept in the automatic backups.",
    exportedOn: " (exported {d})",
    replace: "Replace",
    restoreQ: "Restore this backup?",
    restoreText: "Data from {d}. Your current data is set aside first.",
    restoredTitle: "Data restored",
    restoredText: "The main data was unreadable. We restored the automatic backup from {d}.",
    tShared: "Backup sent ✓", tDownloaded: "Backup file downloaded ✓", tCopied: "Backup code copied ✓",
    tExportFail: "Export isn't available in this browser", tCopyFail: "Couldn't copy: use the file export",
    tImported: "Backup imported ✓", tRestored: "Backup restored ✓", tRecovered: "Data recovered ✓",
    tLegacy: "V1 data imported ✓", tSaveFail: "Can't save: storage full or blocked",
    tMax: "Ten players max", tDup: "{name} is already in the game",
    tElim: "{name} is out", tBack: "{name} is back (1 life)",
    tLives_one: "{name}: {n} life", tLives_many: "{name}: {n} lives",
    errNotJson: "This text isn't a readable Killer backup.",
    errNotKiller: "This file doesn't look like a Killer backup.",
    errRead: "Couldn't read the file.",
    uLifeMinus: "{name} −1 life", uLifePlus: "{name} +1 life", uCard: "{name}'s card",
    uNextRound: "next round", uEndNight: "end of night",
    backupAuto: "auto", backupNight: "night", backupBeforeImport: "before import", backupBeforeRestore: "before restore"
  }
};

var ANIMAL_NAMES = {
  fr: { 1: "Chèvre", 2: "Renard", 3: "Panda", 4: "Lion", 5: "Cochon", 6: "Loup", 7: "Ours", 8: "Chat", 9: "Perroquet", 10: "Taureau" },
  en: { 1: "Goat", 2: "Fox", 3: "Panda", 4: "Lion", 5: "Pig", 6: "Wolf", 7: "Bear", 8: "Cat", 9: "Parrot", 10: "Bull" }
};

var RULE_PRESETS_EN = [
  "The 7: you skip your next turn",
  "The 12: next turn, place the cue ball anywhere",
  "Balls 10 to 15: the next player must bank it",
  "Middle pocket: a joker ball (7 or 12) that drops there goes back on the table",
  "2 balls in one shot: +2 lives"
];

function systemLang() {
  try { var l = (navigator.language || "fr").toLowerCase(); return l.indexOf("en") === 0 ? "en" : "fr"; } catch (e) { return "fr"; }
}
function lang() { var l = db && db.settings && db.settings.lang; return l === "en" || l === "fr" ? l : systemLang(); }
function locale() { return lang() === "en" ? "en-GB" : "fr-FR"; }

function t(key, vars) {
  var d = I18N[lang()] || I18N.fr;
  var s = d[key];
  if (s == null) s = I18N.fr[key];
  if (s == null) return key;
  if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
  return s;
}
// t pluriel : clé_one / clé_many, avec {n}
function tn(key, n, vars) {
  var v = Object.assign({ n: n }, vars || {});
  return t(key + (n > 1 || (lang() === "en" && n === 0) ? "_many" : "_one"), v);
}
function animalName(n) { return (ANIMAL_NAMES[lang()] || ANIMAL_NAMES.fr)[n] || ""; }
function rulePresets() {
  var base = (lang() === "en" ? RULE_PRESETS_EN : RULE_PRESETS).slice(), seen = {};
  RULE_PRESETS.concat(RULE_PRESETS_EN).forEach(function (r) { seen[r.toLowerCase()] = true; });
  (typeof rulebook !== "undefined" && rulebook ? rulebook : []).forEach(function (r) {
    var k = String(r.text || "").trim().toLowerCase();
    if (k && !seen[k]) { seen[k] = true; base.push(r.text); }
  });
  return base;
}

/* ================= SVG : icônes ================= */
function svgBall(number, size) {
  size = size || 44;
  var b = BALLS[number] || BALLS[1];
  var u = "n" + number;
  var gid = "shine-" + u, cid = "clip-" + u;
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 100 100" style="flex-shrink:0;display:block">' +
    '<defs><radialGradient id="' + gid + '" cx="34%" cy="28%" r="75%">' +
    '<stop offset="0%" stop-color="rgba(255,255,255,0.9)"/><stop offset="35%" stop-color="rgba(255,255,255,0.18)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient>' +
    '<clipPath id="' + cid + '"><circle cx="50" cy="50" r="47"/></clipPath></defs>' +
    '<g clip-path="url(#' + cid + ')"><rect x="0" y="0" width="100" height="100" fill="' + (b.stripe ? "#F2ECDC" : b.color) + '"/>' +
    (b.stripe ? '<rect x="0" y="32" width="100" height="36" fill="' + b.color + '"/>' : "") + '</g>' +
    '<circle cx="50" cy="50" r="47" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="2"/>' +
    '<circle cx="50" cy="50" r="17" fill="#F2ECDC" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>' +
    '<text x="50" y="57" text-anchor="middle" font-size="22" font-weight="700" fill="#20201c" font-family="Georgia, Times New Roman, serif">' + number + '</text>' +
    '<circle cx="50" cy="50" r="47" fill="url(#' + gid + ')"/></svg>';
}

function maneTriangles(cx, cy, rIn, rOut, count) {
  var s = "";
  for (var i = 0; i < count; i++) {
    var a0 = (i / count) * Math.PI * 2;
    var a1 = ((i + 0.5) / count) * Math.PI * 2;
    var a2 = ((i + 1) / count) * Math.PI * 2;
    var x0 = cx + rIn * Math.cos(a0), y0 = cy + rIn * Math.sin(a0);
    var xm = cx + rOut * Math.cos(a1), ym = cy + rOut * Math.sin(a1);
    var x2 = cx + rIn * Math.cos(a2), y2 = cy + rIn * Math.sin(a2);
    s += '<polygon points="' + x0.toFixed(2) + ',' + y0.toFixed(2) + ' ' + xm.toFixed(2) + ',' + ym.toFixed(2) + ' ' + x2.toFixed(2) + ',' + y2.toFixed(2) + '" fill="' + MANE + '"/>';
  }
  return s;
}

function svgAnimalIcon(number, size) {
  size = size || 44;
  var a = ANIMALS[number] || ANIMALS[1];
  var u = "n" + number;
  var gid = "ashine-" + u;
  var cx = 50, cy = 58, r = 24;
  var behind = "", front = '<circle cx="' + (cx - 9) + '" cy="' + (cy - 4) + '" r="3" fill="' + DARK + '"/><circle cx="' + (cx + 9) + '" cy="' + (cy - 4) + '" r="3" fill="' + DARK + '"/>';

  switch (Number(number)) {
    case 1:
      behind = '<path d="M' + (cx - 8) + ',' + (cy - 22) + ' Q' + (cx - 15) + ',' + (cy - 40) + ' ' + (cx - 5) + ',' + (cy - 48) + '" stroke="' + FACE + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<path d="M' + (cx + 8) + ',' + (cy - 22) + ' Q' + (cx + 15) + ',' + (cy - 40) + ' ' + (cx + 5) + ',' + (cy - 48) + '" stroke="' + FACE + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<polygon points="' + (cx - 20) + ',' + (cy - 8) + ' ' + (cx - 31) + ',' + (cy - 22) + ' ' + (cx - 13) + ',' + (cy - 15) + '" fill="' + FACE + '"/>' +
        '<polygon points="' + (cx + 20) + ',' + (cy - 8) + ' ' + (cx + 31) + ',' + (cy - 22) + ' ' + (cx + 13) + ',' + (cy - 15) + '" fill="' + FACE + '"/>';
      front = '<circle cx="' + (cx - 9) + '" cy="' + (cy - 4) + '" r="3" fill="' + DARK + '"/><circle cx="' + (cx + 9) + '" cy="' + (cy - 4) + '" r="3" fill="' + DARK + '"/>' +
        '<polygon points="' + (cx - 6) + ',' + (cy + 22) + ' ' + (cx + 6) + ',' + (cy + 22) + ' ' + cx + ',' + (cy + 33) + '" fill="' + FACE + '"/>';
      break;
    case 2:
      behind = '<polygon points="' + (cx - 16) + ',' + (cy - 14) + ' ' + (cx - 25) + ',' + (cy - 43) + ' ' + (cx - 2) + ',' + (cy - 20) + '" fill="' + FACE + '"/>' +
        '<polygon points="' + (cx + 16) + ',' + (cy - 14) + ' ' + (cx + 25) + ',' + (cy - 43) + ' ' + (cx + 2) + ',' + (cy - 20) + '" fill="' + FACE + '"/>';
      front = '<circle cx="' + (cx - 9) + '" cy="' + (cy - 6) + '" r="3" fill="' + DARK + '"/><circle cx="' + (cx + 9) + '" cy="' + (cy - 6) + '" r="3" fill="' + DARK + '"/>' +
        '<polygon points="' + (cx - 9) + ',' + (cy + 8) + ' ' + (cx + 9) + ',' + (cy + 8) + ' ' + cx + ',' + (cy + 27) + '" fill="' + FACE + '"/>';
      break;
    case 3:
      behind = '<circle cx="' + (cx - 22) + '" cy="' + (cy - 18) + '" r="11" fill="' + FACE + '"/><circle cx="' + (cx + 22) + '" cy="' + (cy - 18) + '" r="11" fill="' + FACE + '"/>';
      front = '<ellipse cx="' + (cx - 9) + '" cy="' + (cy - 4) + '" rx="7" ry="9" fill="' + DARK + '"/><ellipse cx="' + (cx + 9) + '" cy="' + (cy - 4) + '" rx="7" ry="9" fill="' + DARK + '"/>' +
        '<circle cx="' + (cx - 9) + '" cy="' + (cy - 3) + '" r="2.3" fill="' + FACE + '"/><circle cx="' + (cx + 9) + '" cy="' + (cy - 3) + '" r="2.3" fill="' + FACE + '"/>';
      break;
    case 4:
      behind = maneTriangles(cx, cy, 22, 35, 14);
      break;
    case 5:
      behind = '<polygon points="' + (cx - 18) + ',' + (cy - 12) + ' ' + (cx - 27) + ',' + (cy - 24) + ' ' + (cx - 12) + ',' + (cy - 20) + '" fill="' + FACE + '"/>' +
        '<polygon points="' + (cx + 18) + ',' + (cy - 12) + ' ' + (cx + 27) + ',' + (cy - 24) + ' ' + (cx + 12) + ',' + (cy - 20) + '" fill="' + FACE + '"/>';
      front = '<circle cx="' + (cx - 9) + '" cy="' + (cy - 6) + '" r="3" fill="' + DARK + '"/><circle cx="' + (cx + 9) + '" cy="' + (cy - 6) + '" r="3" fill="' + DARK + '"/>' +
        '<ellipse cx="' + cx + '" cy="' + (cy + 12) + '" rx="10" ry="8" fill="' + FACE + '" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>' +
        '<circle cx="' + (cx - 4) + '" cy="' + (cy + 12) + '" r="1.6" fill="' + DARK + '"/><circle cx="' + (cx + 4) + '" cy="' + (cy + 12) + '" r="1.6" fill="' + DARK + '"/>';
      break;
    case 6:
      behind = '<polygon points="' + (cx - 18) + ',' + (cy - 16) + ' ' + (cx - 24) + ',' + (cy - 44) + ' ' + (cx - 6) + ',' + (cy - 22) + '" fill="' + FACE + '"/>' +
        '<polygon points="' + (cx + 18) + ',' + (cy - 16) + ' ' + (cx + 24) + ',' + (cy - 44) + ' ' + (cx + 6) + ',' + (cy - 22) + '" fill="' + FACE + '"/>';
      front = '<circle cx="' + (cx - 9) + '" cy="' + (cy - 6) + '" r="3" fill="' + DARK + '"/><circle cx="' + (cx + 9) + '" cy="' + (cy - 6) + '" r="3" fill="' + DARK + '"/>' +
        '<rect x="' + (cx - 10) + '" y="' + (cy + 6) + '" width="20" height="15" rx="7" fill="' + FACE + '"/>';
      break;
    case 7:
      behind = '<circle cx="' + (cx - 23) + '" cy="' + (cy - 20) + '" r="9" fill="' + FACE + '"/><circle cx="' + (cx + 23) + '" cy="' + (cy - 20) + '" r="9" fill="' + FACE + '"/>';
      front = '<circle cx="' + (cx - 9) + '" cy="' + (cy - 4) + '" r="3" fill="' + DARK + '"/><circle cx="' + (cx + 9) + '" cy="' + (cy - 4) + '" r="3" fill="' + DARK + '"/>' +
        '<ellipse cx="' + cx + '" cy="' + (cy + 13) + '" rx="12" ry="9" fill="#FBF4E4"/><circle cx="' + cx + '" cy="' + (cy + 9) + '" r="2.4" fill="' + DARK + '"/>';
      break;
    case 8:
      behind = '<polygon points="' + (cx - 16) + ',' + (cy - 14) + ' ' + (cx - 22) + ',' + (cy - 38) + ' ' + (cx - 4) + ',' + (cy - 20) + '" fill="' + FACE + '"/>' +
        '<polygon points="' + (cx + 16) + ',' + (cy - 14) + ' ' + (cx + 22) + ',' + (cy - 38) + ' ' + (cx + 4) + ',' + (cy - 20) + '" fill="' + FACE + '"/>' +
        '<polygon points="' + (cx - 15) + ',' + (cy - 18) + ' ' + (cx - 18) + ',' + (cy - 32) + ' ' + (cx - 8) + ',' + (cy - 21) + '" fill="' + a.badge + '"/>' +
        '<polygon points="' + (cx + 15) + ',' + (cy - 18) + ' ' + (cx + 18) + ',' + (cy - 32) + ' ' + (cx + 8) + ',' + (cy - 21) + '" fill="' + a.badge + '"/>';
      front = '<circle cx="' + (cx - 9) + '" cy="' + (cy - 4) + '" r="3" fill="' + DARK + '"/><circle cx="' + (cx + 9) + '" cy="' + (cy - 4) + '" r="3" fill="' + DARK + '"/>' +
        '<line x1="' + (cx - 32) + '" y1="' + (cy + 6) + '" x2="' + (cx - 14) + '" y2="' + (cy + 4) + '" stroke="' + FACE + '" stroke-width="1.5"/>' +
        '<line x1="' + (cx - 32) + '" y1="' + (cy + 12) + '" x2="' + (cx - 14) + '" y2="' + (cy + 10) + '" stroke="' + FACE + '" stroke-width="1.5"/>' +
        '<line x1="' + (cx + 32) + '" y1="' + (cy + 6) + '" x2="' + (cx + 14) + '" y2="' + (cy + 4) + '" stroke="' + FACE + '" stroke-width="1.5"/>' +
        '<line x1="' + (cx + 32) + '" y1="' + (cy + 12) + '" x2="' + (cx + 14) + '" y2="' + (cy + 10) + '" stroke="' + FACE + '" stroke-width="1.5"/>';
      break;
    case 9:
      behind = '<polygon points="' + (cx - 4) + ',' + (cy - 24) + ' ' + (cx - 10) + ',' + (cy - 44) + ' ' + (cx + 2) + ',' + (cy - 26) + '" fill="#3E9E63"/>' +
        '<polygon points="' + (cx + 4) + ',' + (cy - 26) + ' ' + (cx + 4) + ',' + (cy - 46) + ' ' + (cx + 12) + ',' + (cy - 28) + '" fill="#2C7A4C"/>';
      front = '<circle cx="' + (cx - 8) + '" cy="' + (cy - 6) + '" r="3" fill="' + DARK + '"/>' +
        '<path d="M' + (cx + 6) + ',' + (cy - 2) + ' Q' + (cx + 26) + ',' + (cy + 2) + ' ' + (cx + 14) + ',' + (cy + 16) + ' Q' + (cx + 6) + ',' + (cy + 10) + ' ' + (cx + 6) + ',' + (cy - 2) + ' Z" fill="#D98A2E" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>';
      break;
    case 10:
      behind = '<path d="M' + (cx - 20) + ',' + (cy - 6) + ' Q' + (cx - 35) + ',' + (cy - 14) + ' ' + (cx - 30) + ',' + (cy - 27) + '" stroke="' + FACE + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<path d="M' + (cx + 20) + ',' + (cy - 6) + ' Q' + (cx + 35) + ',' + (cy - 14) + ' ' + (cx + 30) + ',' + (cy - 27) + '" stroke="' + FACE + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="' + (cx - 24) + '" cy="' + (cy - 2) + '" rx="6" ry="9" fill="' + FACE + '" transform="rotate(-25 ' + (cx - 24) + ' ' + (cy - 2) + ')"/>' +
        '<ellipse cx="' + (cx + 24) + '" cy="' + (cy - 2) + '" rx="6" ry="9" fill="' + FACE + '" transform="rotate(25 ' + (cx + 24) + ' ' + (cy - 2) + ')"/>';
      front = '<circle cx="' + (cx - 9) + '" cy="' + (cy - 6) + '" r="3" fill="' + DARK + '"/><circle cx="' + (cx + 9) + '" cy="' + (cy - 6) + '" r="3" fill="' + DARK + '"/>' +
        '<circle cx="' + cx + '" cy="' + (cy + 17) + '" r="5" fill="none" stroke="' + DARK + '" stroke-width="2.5"/>';
      break;
  }

  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 100 100" style="flex-shrink:0;display:block">' +
    '<defs><radialGradient id="' + gid + '" cx="34%" cy="28%" r="75%">' +
    '<stop offset="0%" stop-color="rgba(255,255,255,0.5)"/><stop offset="40%" stop-color="rgba(255,255,255,0.08)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient></defs>' +
    '<circle cx="50" cy="50" r="47" fill="' + a.badge + '" stroke="rgba(0,0,0,0.35)" stroke-width="2"/>' +
    behind +
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + FACE + '"/>' +
    front +
    '<circle cx="50" cy="50" r="47" fill="url(#' + gid + ')"/></svg>';
}

function svgCuesEmblem(size, opacity) {
  size = size || 56; opacity = opacity == null ? 1 : opacity;
  var h = size * (30 / 56);
  return '<svg width="' + size + '" height="' + h + '" viewBox="0 0 56 30" style="display:block;opacity:' + opacity + '" aria-hidden="true">' +
    '<line x1="4" y1="26" x2="52" y2="4" stroke="#C9A24A" stroke-width="2.2" stroke-linecap="round"/>' +
    '<line x1="4" y1="4" x2="52" y2="26" stroke="#C9A24A" stroke-width="2.2" stroke-linecap="round"/>' +
    '<circle cx="28" cy="15" r="4.5" fill="#C9A24A"/></svg>';
}
function svgHorseshoe(size, opacity) {
  size = size || 22; opacity = opacity == null ? 0.55 : opacity;
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" style="opacity:' + opacity + '" aria-hidden="true">' +
    '<path d="M6,19 L6,11 A6,6 0 0,1 18,11 L18,19" stroke="#C9A24A" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<circle cx="6" cy="19" r="1.4" fill="#C9A24A"/><circle cx="18" cy="19" r="1.4" fill="#C9A24A"/></svg>';
}
function svgStar(size, opacity, color) {
  size = size || 16; opacity = opacity == null ? 0.55 : opacity; color = color || "#C9A24A";
  var cx = 12, cy = 12, rOuter = 10, rInner = 4.3, points = 5;
  var d = "";
  for (var i = 0; i < points * 2; i++) {
    var r = i % 2 === 0 ? rOuter : rInner;
    var a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    var x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    d += (i === 0 ? "M" : "L") + x.toFixed(2) + "," + y.toFixed(2) + " ";
  }
  d += "Z";
  var rivets = "";
  for (var k = 0; k < points; k++) {
    var ak = (k / points) * Math.PI * 2 - Math.PI / 2;
    rivets += '<circle cx="' + (cx + (rOuter + 0.2) * Math.cos(ak)).toFixed(2) + '" cy="' + (cy + (rOuter + 0.2) * Math.sin(ak)).toFixed(2) + '" r="1" fill="' + color + '"/>';
  }
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" style="opacity:' + opacity + '" aria-hidden="true">' +
    '<path d="' + d + '" fill="' + color + '"/>' +
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + (rInner + 1.3) + '" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="0.7"/>' +
    rivets + '</svg>';
}
function cueBladePoints(x1, y1, x2, y2, wStart, wEnd) {
  var dx = x2 - x1, dy = y2 - y1;
  var len = Math.sqrt(dx * dx + dy * dy) || 1;
  var nx = (-dy / len) / 2, ny = (dx / len) / 2;
  var p1x = x1 + nx * wStart, p1y = y1 + ny * wStart;
  var p2x = x1 - nx * wStart, p2y = y1 - ny * wStart;
  var p3x = x2 - nx * wEnd, p3y = y2 - ny * wEnd;
  var p4x = x2 + nx * wEnd, p4y = y2 + ny * wEnd;
  return p1x.toFixed(2) + ',' + p1y.toFixed(2) + ' ' + p4x.toFixed(2) + ',' + p4y.toFixed(2) + ' ' + p3x.toFixed(2) + ',' + p3y.toFixed(2) + ' ' + p2x.toFixed(2) + ',' + p2y.toFixed(2);
}
function svgIconCues(size, color) {
  size = size || 22; color = color || "#C9A24A";
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" aria-hidden="true">' +
    '<polygon points="' + cueBladePoints(3, 21, 20.5, 3.5, 1.6, 0.35) + '" fill="' + color + '"/>' +
    '<polygon points="' + cueBladePoints(21, 21, 3.5, 3.5, 1.6, 0.35) + '" fill="' + color + '"/>' +
    '<circle cx="12" cy="12" r="2.4" fill="' + color + '"/></svg>';
}
function svgIconBook(size, color) {
  size = size || 22; color = color || "#C9A24A";
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M4 5.5 C7 4 10 4 12 5.5 C14 4 17 4 20 5.5 L20 19 C17 17.5 14 17.5 12 19 C10 17.5 7 17.5 4 19 Z" fill="none" stroke="' + color + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<line x1="12" y1="5.5" x2="12" y2="19" stroke="' + color + '" stroke-width="1.6"/></svg>';
}
function svgIconSearch(size, color) {
  size = size || 22; color = color || "#C9A24A";
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" aria-hidden="true">' +
    '<circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="' + color + '" stroke-width="2"/>' +
    '<line x1="15.3" y1="15.3" x2="21" y2="21" stroke="' + color + '" stroke-width="2.2" stroke-linecap="round"/></svg>';
}
function svgIconGear(size, color) {
  size = size || 22; color = color || "#C9A24A";
  var cx = 12, cy = 12, rInner = 6, toothLen = 3, toothW = 2.6;
  var teeth = "";
  for (var i = 0; i < 8; i++) {
    var a = (i / 8) * Math.PI * 2;
    var midR = rInner + toothLen / 2 - 0.5;
    var x = cx + midR * Math.cos(a);
    var y = cy + midR * Math.sin(a);
    var deg = (a * 180) / Math.PI + 90;
    teeth += '<rect x="' + (-toothW / 2) + '" y="' + (-toothLen / 2) + '" width="' + toothW + '" height="' + toothLen + '" rx="0.7" fill="' + color + '" transform="translate(' + x.toFixed(2) + ',' + y.toFixed(2) + ') rotate(' + deg.toFixed(1) + ')"/>';
  }
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" aria-hidden="true">' + teeth +
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + rInner + '" fill="none" stroke="' + color + '" stroke-width="2.2"/>' +
    '<circle cx="' + cx + '" cy="' + cy + '" r="1.8" fill="' + color + '"/></svg>';
}
function svgCornerFlourish(rotate) {
  return '<svg width="26" height="26" viewBox="0 0 26 26" class="cornerFlourish" style="transform:rotate(' + rotate + 'deg)" aria-hidden="true">' +
    '<path d="M2,20 L2,2 L20,2" stroke="#C9A24A" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>' +
    '<circle cx="2" cy="2" r="2.4" fill="#C9A24A" opacity="0.7"/></svg>';
}
function svgRackEmblem(color) {
  color = color || "#CC9E3F";
  return '<svg width="34" height="30" viewBox="0 0 34 30" style="display:block;margin:2px auto 0" aria-hidden="true">' +
    '<polygon points="17,2 31,26 3,26" fill="none" stroke="' + color + '" stroke-width="1.6"/>' +
    '<circle cx="17" cy="10" r="2.6" fill="' + color + '"/><circle cx="12" cy="18" r="2.6" fill="' + color + '"/><circle cx="22" cy="18" r="2.6" fill="' + color + '"/></svg>';
}


/* ================= Icônes d'interface (traits, currentColor) ================= */
var ICON_PATHS = {
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 010 11H11"/>',
  revive: '<path d="M3 12a9 9 0 0115.5-6.3L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 01-15.5 6.3L3 16"/><path d="M3 21v-5h5"/>',
  book: '<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 21V5"/><path d="M8 7h7M8 11h5"/>',
  share: '<path d="M12 15V3"/><path d="M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>',
  download: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/>',
  upload: '<path d="M12 15V3"/><path d="M7 8l5-5 5 5"/><path d="M5 21h14"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 012-2h9"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>',
  trash: '<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/>',
  flame: '<path d="M12 3c1 4 5 5.5 5 10a5 5 0 01-10 0c0-2.5 1.5-3.5 2.5-5 .5 1.5 1.5 2 2.5 2 0-2.5-1-4.5 0-7z"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  cards: '<rect x="3" y="6" width="11" height="15" rx="2"/><path d="M8 3h11a2 2 0 012 2v13"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  sparkle: '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>'
};
function icon(name, size, extraClass) {
  size = size || 20;
  return '<svg class="ico' + (extraClass ? " " + extraClass : "") + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON_PATHS[name] || "") + '</svg>';
}
function crownSvg(size, cls) {
  size = size || 16;
  return '<svg class="crown' + (cls ? " " + cls : "") + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M3 8l4.5 4L12 4l4.5 8L21 8l-2 11H5z" fill="#E2B64C" stroke="#7a4f12" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<circle cx="12" cy="4" r="1.6" fill="#f6e3a4"/><path d="M6 16h12" stroke="#7a4f12" stroke-width="1.2"/></svg>';
}
// Une cartouche = une vie
function bulletSvg(spent) {
  return '<svg class="bullet' + (spent ? " spent" : "") + '" width="9" height="20" viewBox="0 0 9 20" aria-hidden="true">' +
    '<path d="M4.5 0.6C2.3 2.4 1.2 4.6 1.2 7.2V8h6.6v-.8C7.8 4.6 6.7 2.4 4.5.6z" class="bTip"/>' +
    '<rect x="1" y="8.4" width="7" height="9.6" rx=".8" class="bCase"/><rect x=".5" y="17.6" width="8" height="1.9" rx=".6" class="bRim"/></svg>';
}
// Étoile de shérif
function sheriffStar(size, color) {
  size = size || 22; color = color || "currentColor";
  var pts = [], tips = [];
  for (var i = 0; i < 12; i++) {
    var r = i % 2 === 0 ? 11 : 5.2, a = -Math.PI / 2 + i * Math.PI / 6;
    pts.push((12 + r * Math.cos(a)).toFixed(2) + "," + (12 + r * Math.sin(a)).toFixed(2));
    if (i % 2 === 0) tips.push('<circle cx="' + (12 + 11.4 * Math.cos(a)).toFixed(2) + '" cy="' + (12 + 11.4 * Math.sin(a)).toFixed(2) + '" r="1.5" fill="' + color + '"/>');
  }
  return '<svg width="' + size + '" height="' + size + '" viewBox="-1 -1 26 26" aria-hidden="true"><polygon points="' + pts.join(" ") + '" fill="' + color + '"/>' + tips.join("") + '<circle cx="12" cy="12" r="3.2" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1.2"/></svg>';
}

/* ================= Cartes ================= */
function cardArtHtml(number, name, small) {
  var src = CHAR_IMAGES[number];
  var html = "";
  if (src) html += '<img src="' + src + '" alt="" class="charImg"/>';
  if (name) {
    html += '<div class="cardArtName' + (small ? " small" : "") + '"><span class="cardArtNameText' + (small ? " small" : "") + '">' + escapeHtml(name) + '</span></div>';
  }
  return html;
}
function avatarHtml(theme, number, size, uidStr) {
  return theme === "lounge"
    ? '<div class="charImgWrap" style="width:' + size + 'px;height:' + size + 'px;border-radius:10px;flex-shrink:0">' + cardArtHtml(number, null, false) + '</div>'
    : svgBall(number, size, uidStr);
}
// Les deux thèmes utilisent les persos (plus de boules de billard).
function cardFaceHtml(theme, ball, name) {
  return '<div class="cardArtWrap">' + cardArtHtml(ball, name, false) + '</div>';
}
function cardBackHtml(theme) {
  return '<div class="cardBackInner"><span class="cardBackMonogram">K</span></div>';
}
function cardSlotHtml(theme, id, players, up, isCurrent) {
  var player = null;
  for (var i = 0; i < players.length; i++) if (players[i].id === id) { player = players[i]; break; }
  return '<button class="cardSlotBtn" data-action="' + (up ? "" : "pick-card") + '" data-id="' + id + '" ' + (up ? "disabled" : "") + ' aria-label="' + (up && player ? escapeHtml(player.name) : "Carte face cachée, toucher pour révéler") + '">' +
    '<div class="cardPerspective"><div class="cardInner' + (up ? " up" : "") + '">' +
    '<div class="cardFaceBase cardBackFace">' + cardBackHtml(theme) + '</div>' +
    '<div class="cardFaceBase cardFrontFace">' + (player ? cardFaceHtml(theme, player.ball, player.name) : "") + '</div>' +
    '</div></div>' +
    (up && isCurrent ? '<span class="cardCurrentDot"></span>' : "") +
    '</button>';
}


/* ================= Audio & haptique ================= */
var _audioCtx = null;
function getAudioCtx() {
  try {
    if (!_audioCtx) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) _audioCtx = new Ctx();
    }
    if (_audioCtx && _audioCtx.state === "suspended" && _audioCtx.resume) _audioCtx.resume();
    return _audioCtx;
  } catch (e) { return null; }
}
function soundOn() { return !db || !db.settings || db.settings.sound !== false; }
function hapticsOn() { return !db || !db.settings || db.settings.haptics !== false; }

function playTone(freq, duration, type, volume, delay) {
  if (!soundOn()) return;
  var ctx = getAudioCtx();
  if (!ctx) return;
  try {
    var start = ctx.currentTime + (delay || 0);
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume || 0.15, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration);
  } catch (e) {}
}
// Coup de feu western : bruit blanc filtré dont la fréquence chute.
function playFlipSound() {
  if (!soundOn()) return;
  var ctx = getAudioCtx();
  if (!ctx) return;
  try {
    var now = ctx.currentTime;
    var duration = 0.16;
    var bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    var noise = ctx.createBufferSource();
    noise.buffer = buffer;
    var filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3400, now);
    filter.frequency.exponentialRampToValueAtTime(250, now + duration);
    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration);
  } catch (e) {}
}
function playWinSound() {
  playTone(880, 0.16, "sine", 0.12, 0);
  playTone(1318, 0.28, "sine", 0.12, 0.09);
}
function playUndoSound() { playTone(520, 0.09, "triangle", 0.09, 0); }
function vibrate(pattern) {
  if (!hapticsOn()) return;
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {}
}

/* ================= Stockage fiable, sauvegardes, export ================= */
var APP_VERSION = "3.5";
var DB_KEY = "killer_db_v2";
var BACKUPS_KEY = "killer_backups_v2";
var LEGACY_KEYS = { session: "killer_session_v3", stats: "killer_stats_v1", rulebook: "killer_rulebook_v1" };

function clone(o) { return JSON.parse(JSON.stringify(o)); }

function defaultDb() {
  return {
    v: 2,
    savedAt: 0,
    session: clone(initialState),
    stats: { roundWins: {}, cardPicks: {}, roundLog: [] },
    rulebook: [],
    jokerbook: [],
    jokerEdits: {},
    history: [],
    players: {},
    undo: [],
    settings: { sound: true, haptics: true, wakeLock: true, lastExportAt: 0, lastAutoBackupAt: 0, lang: null, lastBullet: true, rivalries: false, trophies: false, chrono: false, chronoSecs: 30 }
  };
}

function isPlainObject(o) { return o && typeof o === "object" && !Array.isArray(o); }

// Accepte n'importe quoi et renvoie une base valide (jamais d'exception).
function normalizeDb(o) {
  var d = defaultDb();
  if (!isPlainObject(o)) return d;
  d.session = Object.assign({}, initialState, isPlainObject(o.session) ? o.session : {});
  if (!Array.isArray(d.session.players)) d.session.players = [];
  if (!Array.isArray(d.session.rules)) d.session.rules = [];
  if (!Array.isArray(d.session.tourCards)) d.session.tourCards = [];
  if (!Array.isArray(d.session.dealingCards)) d.session.dealingCards = [];
  var st = isPlainObject(o.stats) ? o.stats : {};
  d.stats = { roundWins: isPlainObject(st.roundWins) ? st.roundWins : {}, cardPicks: isPlainObject(st.cardPicks) ? st.cardPicks : {}, roundLog: Array.isArray(st.roundLog) ? st.roundLog.filter(function (r) { return r && r.w; }) : [] };
  d.jokerEdits = isPlainObject(o.jokerEdits) ? o.jokerEdits : {};
  d.jokerbook = Array.isArray(o.jokerbook) ? o.jokerbook.filter(function (j) { return j && typeof j.text === "string" && (j.kind === "bonus" || j.kind === "malus"); }) : [];
  d.rulebook = Array.isArray(o.rulebook) ? o.rulebook.filter(function (r) { return r && typeof r.text === "string"; }).map(function (r) { return { id: r.id || uid(), text: r.text }; }) : [];
  d.history = Array.isArray(o.history) ? o.history.filter(function (h) { return h && h.id && Array.isArray(h.players); }) : [];
  d.players = isPlainObject(o.players) ? o.players : {};
  d.undo = Array.isArray(o.undo) ? o.undo.filter(function (u) { return u && u.session && u.stats; }).slice(-15) : [];
  d.settings = Object.assign(d.settings, isPlainObject(o.settings) ? o.settings : {});
  d.savedAt = Number(o.savedAt) || 0;
  return d;
}

// Répare une session restée coincée en pleine distribution, et donne un id aux anciennes soirées.
function repairSession(s) {
  if (s.phase === "dealing" && !s.dealingComplete) {
    var assigned = {};
    s.players.forEach(function (p) { if (p.ball) assigned[p.ball] = true; });
    var assignedCount = Object.keys(assigned).length;
    var stillToPick = s.players.length - assignedCount;
    if (stillToPick > 0 && (!s.dealingCards || s.dealingCards.length !== stillToPick)) {
      var available = BALL_NUMBERS.filter(function (n) { return !assigned[n]; });
      s.dealingCards = shuffle(available).map(function (number) { return { number: number, up: false }; });
      s.dealingIndex = assignedCount;
      s.dealingRevealNumber = null;
    }
  }
  if ((s.phase === "game" || s.phase === "roundEnd" || s.phase === "finished") && !s.soireeId) {
    s.soireeId = uid();
    s.startedAt = Date.now();
  }
  return s;
}

function quarantine(raw) {
  try {
    localStorage.setItem("killer_corrupt_" + Date.now(), raw);
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf("killer_corrupt_") === 0) keys.push(k); }
    keys.sort();
    while (keys.length > 3) localStorage.removeItem(keys.shift());
  } catch (e) {}
}

// Retourne { db, source, corrupt } ou null si rien n'est enregistré.
function loadFromLocal() {
  var raw = null;
  try { raw = localStorage.getItem(DB_KEY); } catch (e) {}
  if (raw) {
    try { return { db: normalizeDb(JSON.parse(raw)), source: "local" }; }
    catch (e) { quarantine(raw); return { db: null, source: "corrupt" }; }
  }
  // Migration depuis la V1 (on ne supprime jamais les anciennes clés).
  var legacy = {}, found = false;
  try {
    var s = localStorage.getItem(LEGACY_KEYS.session), t = localStorage.getItem(LEGACY_KEYS.stats), r = localStorage.getItem(LEGACY_KEYS.rulebook);
    if (s) { try { legacy.session = JSON.parse(s); found = true; } catch (e) { quarantine(s); } }
    if (t) { try { legacy.stats = JSON.parse(t); found = true; } catch (e) { quarantine(t); } }
    if (r) { try { legacy.rulebook = JSON.parse(r); found = true; } catch (e) { quarantine(r); } }
  } catch (e) {}
  if (found) return { db: normalizeDb(legacy), source: "legacy" };
  return null;
}

/* ---- IndexedDB : second exemplaire des données ---- */
var _idbPromise = null;
function idbOpen() {
  if (_idbPromise) return _idbPromise;
  _idbPromise = new Promise(function (resolve, reject) {
    try {
      if (!window.indexedDB) return reject(new Error("no idb"));
      var r = indexedDB.open("killer", 1);
      r.onupgradeneeded = function () { r.result.createObjectStore("kv"); };
      r.onsuccess = function () { resolve(r.result); };
      r.onerror = function () { reject(r.error); };
    } catch (e) { reject(e); }
  });
  return _idbPromise;
}
function idbSave(json) {
  idbOpen().then(function (d) { d.transaction("kv", "readwrite").objectStore("kv").put(json, "db"); }).catch(function () {});
}
function idbLoad() {
  return idbOpen().then(function (d) {
    return new Promise(function (resolve, reject) {
      var q = d.transaction("kv").objectStore("kv").get("db");
      q.onsuccess = function () { resolve(q.result || null); };
      q.onerror = function () { reject(q.error); };
    });
  });
}

/* ---- Enregistrement ---- */
var storageStatus = { localOk: true, persisted: null, usage: null, quota: null, lastSaveAt: 0 };

function persist() {
  try { upsertSoiree(); } catch (e) {}
  db.savedAt = Date.now();
  var json = JSON.stringify(db);
  try { localStorage.setItem(DB_KEY, json); storageStatus.localOk = true; storageStatus.lastSaveAt = db.savedAt; }
  catch (e) { if (storageStatus.localOk) toast(t("tSaveFail")); storageStatus.localOk = false; }
  idbSave(json);
}

function requestPersistentStorage() {
  try {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persisted().then(function (already) {
        if (already) return true;
        return navigator.storage.persist();
      }).then(function (ok) { storageStatus.persisted = !!ok; if (ui.activeTab === "settings") render(); }).catch(function () {});
    }
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(function (e) { storageStatus.usage = e.usage; storageStatus.quota = e.quota; }).catch(function () {});
    }
  } catch (e) {}
}

/* ---- Sauvegardes automatiques (5 dernières) ---- */
function readBackups() {
  try { var l = JSON.parse(localStorage.getItem(BACKUPS_KEY) || "[]"); return Array.isArray(l) ? l : []; } catch (e) { return []; }
}
function hasMeaningfulData() {
  return db.history.length > 0 || db.rulebook.length > 0 || Object.keys(db.stats.roundWins).length > 0;
}
function addBackup(reason) {
  if (!hasMeaningfulData()) return;
  var list = readBackups();
  var data = clone(db); delete data.undo;
  list.push({ at: Date.now(), reason: reason, data: data });
  while (list.length > 5) list.shift();
  try { localStorage.setItem(BACKUPS_KEY, JSON.stringify(list)); } catch (e) {
    // quota : on garde seulement la plus récente
    try { localStorage.setItem(BACKUPS_KEY, JSON.stringify(list.slice(-1))); } catch (e2) {}
  }
  db.settings.lastAutoBackupAt = Date.now();
}
function maybeAutoBackup() {
  if (hasMeaningfulData() && Date.now() - (db.settings.lastAutoBackupAt || 0) > 12 * 3600 * 1000) { addBackup("auto"); persist(); }
}
function backupReasonLabel(r) {
  var m = { auto: "backupAuto", night: "backupNight", "soirée": "backupNight", "import": "backupBeforeImport", "avant import": "backupBeforeImport", restore: "backupBeforeRestore", "avant restauration": "backupBeforeRestore", reset: "backupBeforeReset" };
  return m[r] ? t(m[r]) : (r || t("backupAuto"));
}
function restoreBackup(index) {
  var list = readBackups();
  var b = list[index];
  if (!b) return false;
  addBackup("restore");
  var keep = db.settings;
  db = normalizeDb(b.data);
  db.settings = Object.assign({}, db.settings, { sound: keep.sound, haptics: keep.haptics, wakeLock: keep.wakeLock, lastExportAt: keep.lastExportAt, lang: keep.lang });
  db.undo = [];
  bindDb();
  persist();
  return true;
}

/* ---- Export / import ---- */
function exportPayload() {
  var d = clone(db); delete d.undo;
  return { app: "killer", version: 2, exportedAt: new Date().toISOString(), data: d };
}
function pad2(n) { return (n < 10 ? "0" : "") + n; }
function exportFileName() {
  var d = new Date();
  return "killer-sauvegarde-" + d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()) + ".json";
}
function markExport() { db.settings.lastExportAt = Date.now(); persist(); }

// Renvoie "shared" | "downloaded" | "copied" | "cancelled" | "failed"
function exportData() {
  var text = JSON.stringify(exportPayload(), null, 2);
  var name = exportFileName();
  var file = null;
  try { file = new File([text], name, { type: "application/json" }); } catch (e) {}
  var downloadFallback = function () {
    try {
      var blob = new Blob([text], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = name; a.style.display = "none";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
      markExport();
      return "downloaded";
    } catch (e) { return "failed"; }
  };
  if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
    return navigator.share({ files: [file], title: "Sauvegarde Killer" }).then(function () { markExport(); return "shared"; })
      .catch(function (e) { if (e && e.name === "AbortError") return "cancelled"; return downloadFallback(); });
  }
  return Promise.resolve(downloadFallback());
}
function copyBackupText() {
  var text = JSON.stringify(exportPayload());
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(function () { markExport(); return true; }).catch(function () { return false; });
  }
  return Promise.resolve(false);
}

// Analyse un texte de sauvegarde ; renvoie { ok, summary, data } ou { ok:false, error }.
function parseBackupText(text) {
  var o;
  try { o = JSON.parse(String(text).trim()); } catch (e) { return { ok: false, error: t("errNotJson") }; }
  var data = o && o.app === "killer" && isPlainObject(o.data) ? o.data : (isPlainObject(o) && (o.history || o.stats || o.rulebook) ? o : null);
  if (!data) return { ok: false, error: t("errNotKiller") };
  var n = normalizeDb(data);
  return {
    ok: true,
    data: n,
    summary: {
      soirees: n.history.length,
      regles: n.rulebook.length,
      joueurs: Object.keys(n.stats.roundWins).length,
      date: o.exportedAt || null
    }
  };
}
function applyImport(parsed) {
  addBackup("import");
  var keep = db.settings;
  db = parsed.data;
  db.settings = Object.assign({}, db.settings, { sound: keep.sound, haptics: keep.haptics, wakeLock: keep.wakeLock, lastExportAt: keep.lastExportAt, lang: keep.lang });
  db.undo = [];
  db.session = repairSession(db.session);
  bindDb();
  persist();
}

/* ================= Patch du DOM (sans tout reconstruire) =================
   Les éléments existants sont conservés : le clavier ne se ferme plus pendant la saisie,
   le scroll ne saute plus, et les cartes se retournent vraiment (transition CSS). */
function morphAttrs(el, nel) {
  var i, a;
  for (i = el.attributes.length - 1; i >= 0; i--) {
    a = el.attributes[i];
    if (!nel.hasAttribute(a.name)) el.removeAttribute(a.name);
  }
  for (i = 0; i < nel.attributes.length; i++) {
    a = nel.attributes[i];
    if (el.getAttribute(a.name) !== a.value) el.setAttribute(a.name, a.value);
  }
}

function sameKind(a, b) {
  if (a.nodeType !== b.nodeType) return false;
  if (a.nodeType !== 1) return true;
  if (a.nodeName !== b.nodeName) return false;
  return (a.getAttribute("data-key") || "") === (b.getAttribute("data-key") || "");
}

function morphNode(el, nel) {
  if (el.nodeType === 3 || el.nodeType === 8) {
    if (el.nodeValue !== nel.nodeValue) el.nodeValue = nel.nodeValue;
    return;
  }
  morphAttrs(el, nel);
  var tag = el.nodeName;
  if (tag === "INPUT") {
    if (el.type !== "file") {
      var want = nel.getAttribute("value") || "";
      if (el.value !== want) el.value = want;
    }
    return;
  }
  if (tag === "TEXTAREA") {
    var wantT = nel.value;
    if (el.value !== wantT) el.value = wantT;
    return;
  }
  morphChildren(el, nel);
}

function morphChildren(parent, newParent) {
  var newKids = Array.prototype.slice.call(newParent.childNodes);
  var keyed = {};
  var i, n;
  for (i = 0; i < parent.childNodes.length; i++) {
    n = parent.childNodes[i];
    if (n.nodeType === 1 && n.hasAttribute("data-key")) keyed[n.getAttribute("data-key")] = n;
  }
  for (i = 0; i < newKids.length; i++) {
    var nn = newKids[i];
    var cur = parent.childNodes[i] || null;
    if (nn.nodeType === 1 && nn.hasAttribute("data-key")) {
      var k = nn.getAttribute("data-key");
      var found = keyed[k];
      if (found) {
        delete keyed[k];
        if (found !== cur) parent.insertBefore(found, cur);
        morphNode(found, nn);
      } else {
        parent.insertBefore(nn, cur);
      }
    } else if (cur && !(cur.nodeType === 1 && cur.hasAttribute("data-key")) && sameKind(cur, nn)) {
      morphNode(cur, nn);
    } else {
      parent.insertBefore(nn, cur);
    }
  }
  while (parent.childNodes.length > newKids.length) parent.removeChild(parent.lastChild);
}

function morphInto(host, html) {
  var t = document.createElement("template");
  t.innerHTML = html;
  morphChildren(host, t.content);
}

/* ================= État & actions ================= */
var initialState = {
  phase: "setup",
  theme: "lounge",
  players: [],
  rules: [],
  round: 1,
  tour: 1,
  tourCards: [],
  currentTurnId: null,
  roundWinnerId: null,
  dealingCards: [],
  dealingIndex: 0,
  dealingRevealNumber: null,
  dealingComplete: false,
  soireeId: null,
  startedAt: null,
  jokers: [],          // [{ id, key, kind, owner }] jokers en main pendant la soirée
  table: null          // { potted: { n: { by } }, rack } — boules rentrées dans ce râtelier
};

var db = null;       // toute la base (session, stats, livre, historique, réglages…)
var state = null;    // db.session
var stats = null;    // db.stats
var rulebook = null; // db.rulebook

var ui = {
  nameInput: "",
  ruleInput: "",
  bookInput: "",
  rulesOpen: false,
  activeTab: "play",
  legendsTab: "mur",
  expandedSoiree: null,
  confirmDeleteSoiree: null,
  editingRulebookId: null,
  editRulebookText: "",
  confirmingReset: false,
  presetOpen: null,
  shared: false,
  flash: null,
  modal: null,          // { kind:"import", parsed } | { kind:"restore", index }
  importText: "",
  importOpen: false,
  notice: null,
  spotlight: null,
  timer: null,          // chrono du joueur en cours      // { id } carte piochée mise en avant
  profile: null,        // nom du joueur dont la fiche est ouverte
  rankBy: "rounds",
  ruleAlert: null,      // { id, balls:[n], rules:[text] } rappel après une boule citée par une règle
  tableOpen: false,
  roundChoice: null,    // "rule" | "joker" en fin de manche
  jokerDraw: null,      // { key, kind, target }
  bookTab: "rules",
  jokerInput: "",
  jokerKind: "bonus",
  jkEdit: null,         // clé du joker en cours de modification
  jkEditName: "",
  jkEditText: ""
};

function bindDb() { state = db.session; stats = db.stats; rulebook = db.rulebook; }
function setState(partial) { state = Object.assign({}, state, partial); db.session = state; }
function update(partial) { setState(partial); persist(); }
function setStats(s) { stats = s; db.stats = s; }
function setRulebook(r) { rulebook = r; db.rulebook = r; }

/* ---- Historique des soirées (enregistré au fil de l'eau, jamais perdu) ---- */
function upsertSoiree() {
  var s = db.session;
  if (!s.soireeId) return;
  if (["game", "roundEnd", "finished"].indexOf(s.phase) < 0) return;
  var rounds = 0;
  s.players.forEach(function (p) { rounds += p.wins || 0; });
  var rec = {
    id: s.soireeId,
    startedAt: s.startedAt || Date.now(),
    updatedAt: Date.now(),
    finished: s.phase === "finished",
    rounds: rounds,
    players: s.players.map(function (p) { return { name: p.name, ball: p.ball, wins: p.wins || 0 }; }),
    rules: s.rules.map(function (r) { return { text: r.text, round: r.round }; })
  };
  for (var i = 0; i < db.history.length; i++) {
    if (db.history[i].id === rec.id) { db.history[i] = rec; return; }
  }
  db.history.push(rec);
}

/* ---- Annulation ---- */
function pushUndo(label) {
  db.undo.push({ label: label, at: Date.now(), session: clone(state), stats: clone(stats) });
  while (db.undo.length > 15) db.undo.shift();
}
function undoLast() {
  var u = db.undo.pop();
  if (!u) return;
  state = db.session = u.session;
  ui.spotlight = null; ui.timer = null; ui.jokerDraw = null; ui.roundChoice = null;
  setStats(u.stats);
  if (nextTourTimer) { clearTimeout(nextTourTimer); nextTourTimer = null; }
  persist();
  playUndoSound(); vibrate(10);
  toast(t("undone", { label: u.label }));
}

/* ---- Stats ---- */
function recordRoundWin(name, participants, extra) {
  var s = clone(stats);
  s.roundWins[name] = (s.roundWins[name] || 0) + 1;
  s.roundLog = (s.roundLog || []).concat([Object.assign({ at: Date.now(), sid: state.soireeId, w: name, p: participants || [] }, extra || {})]);
  if (s.roundLog.length > 3000) s.roundLog = s.roundLog.slice(-3000);
  setStats(s);
}
function recordCardPick(name, number) {
  var s = clone(stats);
  var forName = s.cardPicks[name] || {};
  forName[number] = (forName[number] || 0) + 1;
  s.cardPicks[name] = forName;
  setStats(s);
}
function resetStats() { setStats({ roundWins: {}, cardPicks: {}, roundLog: [] }); persist(); }
// Remise à zéro complète des légendes (le Grand Livre et les réglages sont gardés). Une sauvegarde auto est faite avant.
function fullReset() {
  addBackup("reset");
  setStats({ roundWins: {}, cardPicks: {}, roundLog: [] });
  db.history = [];
  db.players = {};
  db.undo = [];
  if (nextTourTimer) { clearTimeout(nextTourTimer); nextTourTimer = null; }
  state = db.session = Object.assign({}, clone(initialState), { theme: state.theme });
  ui.spotlight = null; ui.timer = null; ui.profile = null; ui.expandedSoiree = null;
  persist();
}

/* ---- Grand Livre ---- */
function addToRulebook(text) { setRulebook(rulebook.concat([{ id: uid(), text: text }])); }
function updateRulebookEntry(id, text) { setRulebook(rulebook.map(function (e) { return e.id === id ? { id: e.id, text: text } : e; })); persist(); }
function deleteRulebookEntry(id) { setRulebook(rulebook.filter(function (e) { return e.id !== id; })); persist(); }

/* ---- Préparation ---- */
function setTheme(theme) { update({ theme: theme }); }

function nameTaken(name) {
  var low = name.toLowerCase();
  return state.players.some(function (p) { return p.name.toLowerCase() === low; });
}
function addPlayerByName(raw) {
  var name = String(raw || "").trim().replace(/\s+/g, " ");
  if (!name) return false;
  if (state.players.length >= 10) { toast(t("tMax")); return false; }
  if (nameTaken(name)) { toast(t("tDup", { name: name })); return false; }
  update({ players: state.players.concat([{ id: uid(), name: name.slice(0, 20), ball: null, lives: 3, wins: 0 }]) });
  return true;
}
function addPlayersFromInput() {
  var parts = ui.nameInput.split(/[,;\n]+/);
  var added = false;
  parts.forEach(function (p) { if (addPlayerByName(p)) added = true; });
  if (added || !ui.nameInput.trim()) ui.nameInput = "";
  return added;
}
function removePlayer(id) { update({ players: state.players.filter(function (p) { return p.id !== id; }) }); }

function knownPlayerNames() {
  return Object.keys(db.players).sort(function (a, b) { return (db.players[b] - db.players[a]) || a.localeCompare(b); });
}

function startGame() {
  if (state.players.length < 2) return;
  state.players.forEach(function (p) { db.players[p.name] = (db.players[p.name] || 0) + 1; });
  // Dans les deux thèmes, chacun pioche sa carte à tour de rôle.
  var pool = shuffle(BALL_NUMBERS).map(function (number) { return { number: number, up: false }; });
  update({ phase: "dealing", dealingCards: pool, dealingIndex: 0, dealingRevealNumber: null, dealingComplete: false });
}
function pickDealingCard(number) {
  playFlipSound(); vibrate(15);
  update({
    dealingCards: state.dealingCards.map(function (c) { return c.number === number ? Object.assign({}, c, { up: true }) : c; }),
    dealingRevealNumber: number
  });
}
function confirmDealingPick() {
  var idx = state.dealingIndex;
  var picked = state.dealingRevealNumber;
  if (!picked) return;
  var pickingPlayer = state.players[idx];
  if (pickingPlayer) recordCardPick(pickingPlayer.name, picked);
  var players = state.players.map(function (p, i) { return i === idx ? Object.assign({}, p, { ball: picked, lives: 3, wins: 0 }) : p; });
  var dealingCards = state.dealingCards.filter(function (c) { return c.number !== picked; });
  var nextIndex = idx + 1;
  update({ players: players, dealingCards: dealingCards, dealingIndex: nextIndex, dealingRevealNumber: null, dealingComplete: nextIndex >= state.players.length });
}
function confirmDealt() {
  var tourCards = shuffle(state.players.map(function (p) { return p.id; })).map(function (id) { return { id: id, up: false }; });
  db.undo = [];
  update({ phase: "game", round: 1, tour: 1, tourCards: tourCards, currentTurnId: null, soireeId: uid(), startedAt: Date.now(), table: freshTable() });
}

/* ---- Jeu ---- */
function flashRow(id, kind) {
  ui.flash = { id: id, kind: kind };
  setTimeout(function () { if (ui.flash && ui.flash.id === id) { ui.flash = null; render(); } }, kind === "elim" ? 900 : 650);
}

/* ---- Jokers ---- */
var JOKER_KEYS = { bonus: ["b1", "b2", "b3", "b4"], malus: ["m1", "m2", "m3", "m4"] };
function jokerPool(kind) {
  return JOKER_KEYS[kind].concat((db.jokerbook || []).filter(function (j) { return j.kind === kind; }).map(function (j) { return "c:" + j.id; }));
}
function jokerInfo(key) {
  if (String(key).indexOf("c:") === 0) {
    var j = (db.jokerbook || []).filter(function (x) { return "c:" + x.id === key; })[0];
    return j ? { name: j.name || t("jokerMine"), text: j.text, kind: j.kind } : { name: t("jokerMine"), text: "", kind: "bonus" };
  }
  var ed = (db.jokerEdits || {})[key] || {};
  return { name: ed.name || t("jk_" + key), text: ed.text || t("jkt_" + key), kind: key.charAt(0) === "m" ? "malus" : "bonus", auto: ["b1", "b2", "b4", "m4"].indexOf(key) >= 0 };
}
function drawJoker() {
  var kind = Math.random() < 0.5 ? "bonus" : "malus";
  var pool = jokerPool(kind);
  ui.jokerDraw = { key: pool[Math.floor(Math.random() * pool.length)], kind: kind, target: null };
  playFlipSound(); vibrate([10, 30, 10]);
}
// Ajoute le joker pioché à la soirée (le bonus au gagnant, le malus au joueur choisi ou au hasard)
function commitJoker(players) {
  var jd = ui.jokerDraw;
  ui.jokerDraw = null; ui.roundChoice = null;
  if (!jd || !opt("jokers")) return state.jokers || [];
  var owner = state.roundWinnerId; // bonus ou malus : c'est pour le gagnant
  var who = playerById(owner);
  if (who) setTimeout(function () { toast(t("tJokerGiven", { name: who.name, joker: jokerInfo(jd.key).name })); }, 600);
  return (state.jokers || []).concat([{ id: uid(), key: jd.key, kind: jd.kind, owner: owner }]);
}
function useJoker(jid) {
  var j = (state.jokers || []).filter(function (x) { return x.id === jid; })[0];
  if (!j) return;
  var p = playerById(j.owner), info = jokerInfo(j.key);
  pushUndo(t("uJoker", { name: p ? p.name : "?", joker: info.name }));
  var eff = {}, msg = t("tJokerUsed", { name: p ? p.name : "?", joker: info.name });
  if (j.key === "b1") { eff = { shield: 1, shieldKey: "b1" }; msg = t("tSecondArmed", { name: p.name }); }
  else if (j.key === "b2") { eff = { shield: 1, shieldKey: "b2" }; msg = t("tShieldArmed", { name: p.name }); }
  else if (j.key === "b4") { eff = { skip: 1 }; msg = t("tSkipSet", { name: p.name }); }
  else if (j.key === "m4") { eff = { bounty: 1 }; msg = t("tBountyArmed", { name: p.name }); }
  update({ jokers: state.jokers.filter(function (x) { return x.id !== jid; }), players: state.players.map(function (x) { return x.id === j.owner ? Object.assign({}, x, eff) : x; }) });
  toast(msg, { undo: true });
  vibrate([10, 30, 10]);
}
function jokersOf(id) { return (state.jokers || []).filter(function (j) { return j.owner === id; }); }
function addBookJoker() {
  var text = ui.jokerInput.trim();
  if (!text) return;
  db.jokerbook = (db.jokerbook || []).concat([{ id: uid(), kind: ui.jokerKind === "malus" ? "malus" : "bonus", text: text.slice(0, 120) }]);
  ui.jokerInput = "";
  persist();
}
function jokerSvg(kind, size) {
  size = size || 24;
  var bonus = kind !== "malus";
  var fill = bonus ? "url(#jkGold)" : "url(#jkRed)", ink = bonus ? "#3a2206" : "#FFE9E2";
  return '<svg class="jkIco" width="' + Math.round(size * 0.78) + '" height="' + size + '" viewBox="0 0 40 52" aria-hidden="true">' +
    '<rect x="1.5" y="1.5" width="37" height="49" rx="6" fill="' + fill + '" stroke="' + (bonus ? "#7a4f12" : "#5c150e") + '" stroke-width="2"/>' +
    '<path d="M11 34 C11 26 9 21 5.5 24.5 C7.5 16.5 14 16 16.5 21.5 C17 14.5 18.6 10 20 8 C21.4 10 23 14.5 23.5 21.5 C26 16 32.5 16.5 34.5 24.5 C31 21 29 26 29 34 Z" fill="' + ink + '" opacity=".93"/>' +
    '<path d="M10 33.5 h20 a2 2 0 0 1 2 2 v1.5 a2 2 0 0 1 -2 2 h-20 a2 2 0 0 1 -2 -2 v-1.5 a2 2 0 0 1 2 -2z" fill="' + ink + '"/>' +
    '<circle cx="5.5" cy="25" r="2.8" fill="' + ink + '"/><circle cx="20" cy="7.5" r="2.8" fill="' + ink + '"/><circle cx="34.5" cy="25" r="2.8" fill="' + ink + '"/>' +
    '<circle cx="14" cy="36.2" r="1.1" fill="' + (bonus ? "#F8D987" : "#E25543") + '"/><circle cx="20" cy="36.2" r="1.1" fill="' + (bonus ? "#F8D987" : "#E25543") + '"/><circle cx="26" cy="36.2" r="1.1" fill="' + (bonus ? "#F8D987" : "#E25543") + '"/>' +
    '<text x="20" y="47" text-anchor="middle" font-size="8" font-weight="700" font-family="Barlow Condensed, sans-serif" fill="' + ink + '">' + (bonus ? "+" : "−") + '</text></svg>';
}

/* ---- Table : boules rentrées, règles qui citent une boule ---- */
var TABLE_BALLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
var POOL_COLORS = { 1: "#F2C230", 2: "#1F5FB8", 3: "#D23B2B", 4: "#6A3EA1", 5: "#E8772E", 6: "#1E8A4C", 7: "#8B2E2E", 8: "#151515" };
function freshTable() { return { potted: {}, rack: 1 }; }
function tableOf() { return state.table && state.table.potted ? state.table : freshTable(); }
function ballsOnTable() { var tb = tableOf(); return TABLE_BALLS.filter(function (n) { return !tb.potted[n]; }); }
function poolBall(n, size) {
  size = size || 28;
  var base = POOL_COLORS[n > 8 ? n - 8 : n], stripe = n > 8;
  var r = size / 2;
  return '<svg class="pBall" width="' + size + '" height="' + size + '" viewBox="0 0 40 40" aria-hidden="true">' +
    '<circle cx="20" cy="20" r="19" fill="' + (stripe ? "#F4EEDF" : base) + '"/>' +
    (stripe ? '<path d="M3.2 12h33.6a19 19 0 0 1 0 16H3.2a19 19 0 0 1 0-16z" fill="' + base + '"/>' : "") +
    '<circle cx="20" cy="20" r="8.6" fill="#FBF7EC"/>' +
    '<text x="20" y="24.2" text-anchor="middle" font-size="' + (n > 9 ? 10.5 : 12) + '" font-weight="700" font-family="Barlow, sans-serif" fill="#1d1a14">' + n + '</text>' +
    '<circle cx="20" cy="20" r="19" fill="url(#pbShine)" opacity=".9"/><circle cx="20" cy="20" r="19" fill="none" stroke="rgba(0,0,0,.35)"/></svg>';
}
// Numéros de boule cités dans une règle maison (« la 7 », « boule 12 », « (7 et 12) »)
function ballsInText(text) {
  var out = [], rg = /(1[0-5]|[1-9])\s*(?:à|a|-|–|to)\s*(1[0-5]|[1-9])(?!\d)/gi, mm;
  while ((mm = rg.exec(String(text)))) { for (var q = Number(mm[1]); q <= Number(mm[2]) && q <= 15; q++) if (out.indexOf(q) < 0) out.push(q); }
  var  re = /(?:\bla|\ble|\bboules?|\bthe|\bballs?|n°|#|\(|\bet|\bou|\band|\bor|,)\s*(1[0-5]|[1-9])(?![\d.,]?\d)/gi, m;
  while ((m = re.exec(String(text)))) { var n = Number(m[1]); if (out.indexOf(n) < 0) out.push(n); }
  return out.sort(function (a, b) { return a - b; });
}
function ballRules() {
  return state.rules.map(function (r) { return { text: r.text, balls: ballsInText(r.text) }; }).filter(function (r) { return r.balls.length; });
}
function ballListText(nums) {
  var parts = nums.map(function (n) { return t("ballN", { n: n }); });
  return parts.length > 1 ? parts.slice(0, -1).join(", ") + t("ballsAnd") + parts[parts.length - 1] : parts.join("");
}
function playerById(id) { var p = null; state.players.forEach(function (x) { if (x.id === id) p = x; }); return p; }

// Coup réussi : boules rentrées (liste éventuellement vide = sans préciser)
function potBalls(id, nums) {
  var p = playerById(id);
  if (!p) return;
  nums = (nums || []).filter(function (n) { return ballsOnTable().indexOf(n) >= 0; }).sort(function (a, b) { return a - b; });
  pushUndo(nums.length ? t("uPot", { name: p.name, balls: ballListText(nums) }) : t("tPotPlain", { name: p.name }));
  if (ui.timer && ui.timer.id === id) stopChrono();
  var tb = clone(tableOf());
  nums.forEach(function (n) { tb.potted[n] = { by: id }; });
  var eight = nums.indexOf(8) >= 0;
  var rerack = Object.keys(tb.potted).length >= TABLE_BALLS.length;
  if (rerack) tb = { potted: {}, rack: (tb.rack || 1) + 1 };
  var players = state.players.map(function (x) { return x.id === id ? Object.assign({}, x, { pots: (x.pots || 0) + Math.max(1, nums.length), lives: x.lives + (eight ? 1 : 0) }) : x; });
  update({ players: players, table: tb });
  playTone(660, 0.08, "triangle", 0.08, 0); playTone(990, 0.12, "triangle", 0.07, 0.07); vibrate(12);
  if (eight) { flashRow(id, "up"); toast(t("tEight", { name: p.name }), { undo: true }); }
  else toast(nums.length ? t("tPot", { name: p.name, balls: ballListText(nums) }) : t("tPotPlain", { name: p.name }), { undo: true });
  if (rerack) setTimeout(function () { toast(t("tRerack")); }, 1800);
  // Rappel des règles maison qui citent une boule rentrée
  var hits = ballRules().filter(function (r) { return r.balls.some(function (n) { return nums.indexOf(n) >= 0; }); });
  if (hits.length) {
    var cited = [];
    hits.forEach(function (r) { r.balls.forEach(function (n) { if (nums.indexOf(n) >= 0 && cited.indexOf(n) < 0) cited.push(n); }); });
    ui.ruleAlert = { id: id, balls: cited.sort(function (a, b) { return a - b; }), rules: hits.map(function (r) { return r.text; }) };
  }
}
function missShot(id) { changeLife(id, -1); }
function setSkipNext(id) {
  var p = playerById(id);
  if (!p) return;
  pushUndo(t("uSkip", { name: p.name }));
  update({ players: state.players.map(function (x) { return x.id === id ? Object.assign({}, x, { skip: 1 }) : x; }) });
  toast(t("tSkipSet", { name: p.name }), { undo: true });
}
// Nouveau tour : on retire une fois les joueurs marqués « passe son tour »
function tourIdsWithSkips() {
  var alive = state.players.filter(function (p) { return p.lives > 0; });
  var skipping = alive.filter(function (p) { return p.skip > 0; });
  var playing = alive.filter(function (p) { return !(p.skip > 0); });
  if (!skipping.length || !playing.length) return { ids: alive.map(function (p) { return p.id; }), skipped: [] };
  return { ids: playing.map(function (p) { return p.id; }), skipped: skipping };
}
function consumeSkips(skipped) {
  if (!skipped.length) return state.players;
  var ids = skipped.map(function (p) { return p.id; });
  setTimeout(function () { skipped.forEach(function (p, i) { setTimeout(function () { toast(t("tSkipped", { name: p.name })); }, i * 2200); }); }, 300);
  return state.players.map(function (x) { return ids.indexOf(x.id) >= 0 ? Object.assign({}, x, { skip: 0 }) : x; });
}

function changeLife(id, delta) {
  var p = null;
  state.players.forEach(function (x) { if (x.id === id) p = x; });
  if (!p) return;
  if (delta < 0 && p.lives > 0 && p.shield > 0) {
    // Gilet pare-balles ou Seconde chance : la vie est sauvée, une fois
    pushUndo(t("uLifeMinus", { name: p.name }));
    if (ui.timer && ui.timer.id === id) stopChrono();
    update({ players: state.players.map(function (x) { return x.id === id ? Object.assign({}, x, { shield: 0, shieldKey: null }) : x; }) });
    flashRow(id, "up"); vibrate([10, 30, 10]);
    toast(t("tShieldUsed", { name: p.name, joker: jokerInfo(p.shieldKey || "b2").name }), { undo: true });
    return;
  }
  if (delta < 0 && p.bounty > 0 && p.lives > 0) {
    // Tête mise à prix : le raté coûte 2 vies
    delta = -2;
    state.players = state.players.map(function (x) { return x.id === id ? Object.assign({}, x, { bounty: 0 }) : x; });
    p = playerById(id);
    setTimeout(function () { toast(t("tBountyHit", { name: p.name }), { undo: true }); }, 50);
  }
  var newLives = Math.max(0, p.lives + delta);
  if (newLives === p.lives) return;
  var wasEliminated = p.lives <= 0;
  pushUndo(t(delta > 0 ? "uLifePlus" : "uLifeMinus", { name: p.name }));
  if (ui.timer && ui.timer.id === id) stopChrono();
  var players = state.players.map(function (x) { return x.id === id ? Object.assign({}, x, { lives: newLives }, wasEliminated && delta > 0 ? { revived: true } : {}) : x; });
  var active = players.filter(function (x) { return x.lives > 0; });
  if (players.length > 1 && active.length === 1) {
    var winnerId = active[0].id;
    var withWin = players.map(function (x) { return x.id === winnerId ? Object.assign({}, x, { wins: x.wins + 1 }) : x; });
    var before = trophySnapshot([active[0].name]);
    recordRoundWin(active[0].name, players.map(function (x) { return x.name; }), { l: active[0].lives, rv: !!active[0].revived });
    ui.spotlight = null; stopChrono();
    playWinSound(); vibrate([20, 40, 20]);
    var tEl = document.getElementById("toast"); if (tEl) tEl.classList.remove("show");
    update({ players: withWin, phase: "roundEnd", roundWinnerId: winnerId, currentTurnId: null });
    announceTrophies(before);
    return;
  }
  var activeIds = {};
  active.forEach(function (x) { activeIds[x.id] = true; });
  var tourCards = state.tourCards.filter(function (c) { return c.up || activeIds[c.id]; });
  if (wasEliminated && delta > 0) {
    var present = tourCards.some(function (c) { return c.id === id; });
    if (!present) tourCards = tourCards.concat([{ id: id, up: false }]);
  }
  update({ players: players, tourCards: tourCards });
  flashRow(id, newLives === 0 ? "elim" : (delta > 0 ? "up" : "down"));
  vibrate(delta > 0 ? 12 : 22);
  if (newLives === 1 && delta < 0) playHeartbeat();
  if (newLives === 0) toast(t("tElim", { name: p.name }), { undo: true });
  else if (wasEliminated) toast(t("tBack", { name: p.name }), { undo: true });
  else toast(tn("tLives", newLives, { name: p.name }), { undo: true });
}

function pickCard(id) {
  var p = null;
  state.players.forEach(function (x) { if (x.id === id) p = x; });
  pushUndo(t("uCard", { name: p ? p.name : "?" }));
  playFlipSound(); vibrate(15);
  update({
    tourCards: state.tourCards.map(function (c) { return c.id === id ? Object.assign({}, c, { up: true }) : c; }),
    currentTurnId: id
  });
  ui.spotlight = { id: id, fresh: true };
  startChrono(id);
}

function addRule() {
  var text = ui.ruleInput.trim();
  if (!text) return;
  update({ rules: state.rules.concat([{ text: text, round: state.round }]) });
  addToRulebook(text);
  ui.ruleInput = "";
  persist();
}
function addBookRule() {
  var text = ui.bookInput.trim();
  if (!text) return;
  addToRulebook(text);
  ui.bookInput = "";
  persist();
}

function startNewTour() {
  if (state.phase !== "game") return;
  var activeIds = state.players.filter(function (p) { return p.lives > 0; }).map(function (p) { return p.id; });
  if (activeIds.length < 2) return;
  var ts = tourIdsWithSkips();
  update({ players: consumeSkips(ts.skipped), tourCards: shuffle(ts.ids).map(function (id) { return { id: id, up: false }; }), tour: state.tour + 1, currentTurnId: null });
}
function nextRound() {
  pushUndo(t("uNextRound"));
  stopChrono();
  var players = state.players.map(function (p) { return Object.assign({}, p, { lives: 3, revived: false, skip: 0, pots: 0 }); });
  var tourCards = shuffle(players.map(function (p) { return p.id; })).map(function (id) { return { id: id, up: false }; });
  ui.ruleAlert = null;
  var jokers = commitJoker(players);
  update({ jokers: jokers, players: players, phase: "game", round: state.round + 1, roundWinnerId: null, currentTurnId: null, tour: 1, tourCards: tourCards, table: freshTable() });
}
function endSession() {
  pushUndo(t("uEndNight"));
  stopChrono();
  var before = trophySnapshot(state.players.map(function (p) { return p.name; }));
  update({ phase: "finished" });
  announceTrophies(before);
  addBackup("night");
  persist();
}
function newGame() {
  db.undo = [];
  state = db.session = Object.assign({}, clone(initialState), { theme: state.theme });
  persist();
}

var nextTourTimer = null;
function checkTourProgress() {
  if (nextTourTimer) { clearTimeout(nextTourTimer); nextTourTimer = null; }
  if (state.phase !== "game") return;
  if (ui.spotlight && state.tourCards.length > 0) return; // on attend que la carte en grand soit fermée
  if (state.tourCards.length === 0) {
    var activeIds = state.players.filter(function (p) { return p.lives > 0; }).map(function (p) { return p.id; });
    if (activeIds.length >= 2) {
      update({ tourCards: shuffle(activeIds).map(function (id) { return { id: id, up: false }; }), currentTurnId: null });
      render();
    }
    return;
  }
  if (state.tourCards.every(function (c) { return c.up; })) {
    nextTourTimer = setTimeout(function () { startNewTour(); render(); }, 1100);
  }
}

/* ================= Stats : Roi, classements, fiches joueurs ================= */
// Tout le Mur et le Classement se calculent à partir des soirées enregistrées :
// supprimer une soirée dans « Soirées » la retire aussitôt du Mur, du Classement, des séries et des trophées.
function historyWins() {
  var m = {}, names = {};
  db.history.forEach(function (h) {
    h.players.forEach(function (p) {
      var k = String(p.name).toLowerCase();
      if (!names[k]) names[k] = p.name;
      m[names[k]] = (m[names[k]] || 0) + (p.wins || 0);
    });
  });
  return m;
}
function liveRoundLog() {
  var ids = {};
  db.history.forEach(function (h) { ids[h.id] = true; });
  return (stats.roundLog || []).filter(function (r) { return r.sid && ids[r.sid]; });
}
function wallEntries() {
  var hw = historyWins();
  return Object.keys(hw).map(function (k) { return { name: k, wins: hw[k] }; })
    .filter(function (e) { return e.wins > 0; })
    .sort(function (a, b) { return (b.wins - a.wins) || a.name.localeCompare(b.name); });
}
function kingName() {
  var e = wallEntries();
  if (!e.length) return null;
  if (e.length > 1 && e[1].wins === e[0].wins) return e[0].name; // égalité : le premier par ordre alpha garde la couronne
  return e[0].name;
}
function isKing(name) { var k = kingName(); return !!k && k.toLowerCase() === String(name).toLowerCase(); }

// Le(s) roi(s) d'une soirée : le plus de manches gagnées (égalité = co-rois)
function nightKings(h) {
  var max = 0;
  h.players.forEach(function (p) { if ((p.wins || 0) > max) max = p.wins; });
  if (max === 0) return [];
  return h.players.filter(function (p) { return p.wins === max; }).map(function (p) { return p.name; });
}

function sameName(a, b) { return String(a).toLowerCase() === String(b).toLowerCase(); }

function nightsRanking() {
  var map = {};
  db.history.forEach(function (h) {
    nightKings(h).forEach(function (n) { map[n] = (map[n] || 0) + 1; });
  });
  return Object.keys(map).map(function (k) { return { name: k, nights: map[k] }; })
    .sort(function (a, b) { return (b.nights - a.nights) || a.name.localeCompare(b.name); });
}

function streaksFor(name) {
  var log = liveRoundLog().filter(function (r) { return r.p && r.p.some(function (x) { return sameName(x, name); }); });
  var best = 0, run = 0;
  log.forEach(function (r) { if (sameName(r.w, name)) { run++; if (run > best) best = run; } else run = 0; });
  return { current: run, best: best, tracked: log.length };
}

function playerProfile(name) {
  var played = 0, kingOf = 0, roundsPlayed = 0, roundsWonHist = 0, last = 0;
  db.history.forEach(function (h) {
    var me = null;
    h.players.forEach(function (p) { if (sameName(p.name, name)) me = p; });
    if (!me) return;
    played++;
    roundsPlayed += h.rounds || 0;
    roundsWonHist += me.wins || 0;
    if (nightKings(h).some(function (k) { return sameName(k, name); })) kingOf++;
    if ((h.updatedAt || h.startedAt || 0) > last) last = h.updatedAt || h.startedAt;
  });
  var st = streaksFor(name);
  return {
    name: name,
    rounds: (function () { var hw = historyWins(), r = 0; Object.keys(hw).forEach(function (k) { if (sameName(k, name)) r = hw[k]; }); return r; })(),
    nights: played,
    kingOf: kingOf,
    rate: roundsPlayed > 0 ? Math.round(100 * roundsWonHist / roundsPlayed) : null,
    streak: st.current,
    best: st.best,
    tracked: st.tracked,
    last: last,
    fav: favoriteCardFor(name),
    king: isKing(name)
  };
}

function favoriteCardFor(name) {
  // Carte la plus souvent tirée, sur les soirées enregistrées seulement
  var picks = {};
  db.history.forEach(function (h) { h.players.forEach(function (p) { if (sameName(p.name, name) && p.ball) picks[p.ball] = (picks[p.ball] || 0) + 1; }); });
  var sp = Object.keys(picks).map(function (k) { return [Number(k), picks[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
  return sp.length ? sp[0][0] : null;
}

function allKnownStatNames() {
  var set = {};
  db.history.forEach(function (h) { h.players.forEach(function (p) { set[p.name] = 1; }); });
  return Object.keys(set);
}

/* ================= Options de jeu : trophées, rivalités, chrono, carte à partager ================= */
function opt(name) {
  var d = { lastBullet: true, rivalries: false, trophies: false, chrono: false, houseRules: true, jokers: true };
  var v = db && db.settings ? db.settings[name] : undefined;
  return v === undefined ? d[name] : !!v;
}
function chronoSecs() { var s = Number(db.settings.chronoSecs); return [15, 20, 30, 45, 60, 90].indexOf(s) >= 0 ? s : 30; }

/* ---- Trophées ---- */
var TROPHIES = [
  { id: "first", ic: "🎯", test: function (p, x) { return p.rounds >= 1; } },
  { id: "hat", ic: "🎩", test: function (p, x) { return p.best >= 3; } },
  { id: "streak5", ic: "🔥", test: function (p, x) { return p.best >= 5; } },
  { id: "survivor", ic: "🩸", test: function (p, x) { return x.survivor; } },
  { id: "flawless", ic: "🛡️", test: function (p, x) { return x.flawless; } },
  { id: "phoenix", ic: "⚰️", test: function (p, x) { return x.phoenix; } },
  { id: "king1", ic: "👑", test: function (p, x) { return p.kingOf >= 1; } },
  { id: "king5", ic: "🏰", test: function (p, x) { return p.kingOf >= 5; } },
  { id: "regular", ic: "🍺", test: function (p, x) { return p.nights >= 10; } },
  { id: "hunter", ic: "💰", test: function (p, x) { return p.rounds >= 25; } },
  { id: "legend", ic: "⭐", test: function (p, x) { return p.rounds >= 100; } }
];
function trophyFacts(name) {
  var x = { survivor: false, flawless: false, phoenix: false };
  liveRoundLog().forEach(function (r) {
    if (!sameName(r.w, name)) return;
    if (r.l === 1) x.survivor = true;
    if (r.l >= 3) x.flawless = true;
    if (r.rv) x.phoenix = true;
  });
  return x;
}
function trophiesFor(name) {
  var p = playerProfile(name), x = trophyFacts(name);
  return TROPHIES.filter(function (tr) { return tr.test(p, x); }).map(function (tr) { return tr.id; });
}
function trophySnapshot(names) {
  var m = {};
  names.forEach(function (n) { m[n] = trophiesFor(n); });
  return m;
}
// Annonce les trophées gagnés depuis le cliché « before »
function announceTrophies(before) {
  if (!opt("trophies")) return;
  var news = [];
  Object.keys(before).forEach(function (n) {
    trophiesFor(n).forEach(function (id) { if (before[n].indexOf(id) < 0) news.push({ name: n, id: id }); });
  });
  news.forEach(function (nw, i) {
    setTimeout(function () {
      var tr = TROPHIES.filter(function (x) { return x.id === nw.id; })[0];
      toast(tr.ic + " " + t("trophyUnlocked", { name: nw.name, trophy: t("tr_" + nw.id) }));
      vibrate([10, 30, 10]);
    }, 900 + i * 2600);
  });
}

/* ---- Rivalités (sur l'historique des soirées) ---- */
function rivalsFor(name) {
  var beatsMe = {}, iBeat = {};
  db.history.forEach(function (h) {
    var me = null;
    h.players.forEach(function (p) { if (sameName(p.name, name)) me = p; });
    if (!me) return;
    h.players.forEach(function (o) {
      if (sameName(o.name, name)) return;
      if ((o.wins || 0) > (me.wins || 0)) beatsMe[o.name] = (beatsMe[o.name] || 0) + 1;
      else if ((me.wins || 0) > (o.wins || 0)) iBeat[o.name] = (iBeat[o.name] || 0) + 1;
    });
  });
  var top = function (m) {
    var k = Object.keys(m).sort(function (a, b) { return (m[b] - m[a]) || a.localeCompare(b); });
    return k.length ? { name: k[0], n: m[k[0]] } : null;
  };
  return { nemesis: top(beatsMe), prey: top(iBeat) };
}

/* ---- Chrono ---- */
var chronoTimer = null;
function startChrono(id) {
  if (!opt("chrono")) { ui.timer = null; return; }
  var total = chronoSecs() * 1000;
  ui.timer = { id: id, total: total, endsAt: Date.now() + total, left: total, paused: false, lastSec: chronoSecs() };
  ensureChronoLoop();
}
function stopChrono() { ui.timer = null; }
function toggleChronoPause() {
  var tm = ui.timer;
  if (!tm) return;
  if (tm.paused) { tm.paused = false; tm.endsAt = Date.now() + tm.left; }
  else { tm.left = Math.max(0, tm.endsAt - Date.now()); tm.paused = true; }
}
function ensureChronoLoop() {
  if (chronoTimer) return;
  chronoTimer = setInterval(chronoTick, 200);
}
function chronoTick() {
  var tm = ui.timer;
  if (!tm || state.phase !== "game" || !opt("chrono")) { if (!tm || !opt("chrono")) { clearInterval(chronoTimer); chronoTimer = null; } return; }
  if (tm.paused) return;
  tm.left = Math.max(0, tm.endsAt - Date.now());
  var sec = Math.ceil(tm.left / 1000);
  var el = document.querySelector(".chrono");
  if (el) {
    el.style.setProperty("--p", (tm.left / tm.total).toFixed(3));
    var b = el.querySelector("b"); if (b) b.textContent = sec;
    el.classList.toggle("urgent", sec <= 5);
  }
  if (sec !== tm.lastSec) {
    tm.lastSec = sec;
    if (sec <= 5 && sec > 0) playTone(sec === 1 ? 1100 : 880, 0.06, "square", 0.05, 0);
  }
  if (tm.left <= 0) {
    var id = tm.id; ui.timer = null;
    var p = null; state.players.forEach(function (x) { if (x.id === id) p = x; });
    if (p && p.lives > 0) {
      playTone(180, 0.5, "sawtooth", 0.09, 0); vibrate([60, 40, 60]);
      ui.spotlight = null;
      changeLife(id, -1);
      if (state.phase === "game") toast(t("tTimeUp", { name: p.name }), { undo: true });
    }
    render();
  }
}
function chronoChipHtml() {
  var tm = ui.timer;
  if (!tm || !opt("chrono")) return "";
  var left = tm.paused ? tm.left : Math.max(0, tm.endsAt - Date.now());
  var sec = Math.ceil(left / 1000);
  return '<button class="chrono' + (sec <= 5 ? " urgent" : "") + (tm.paused ? " paused" : "") + '" data-key="chrono-' + tm.id + '" style="--p:' + (left / tm.total).toFixed(3) + '" ' + btnAttr("chrono-toggle", 'aria-label="' + esc(t(tm.paused ? "chronoResume" : "chronoPause")) + '"') + '>' +
    '<span class="chronoRing"></span><b>' + sec + '</b><span class="chronoState">' + esc(t(tm.paused ? "chronoPaused" : "chronoSec")) + '</span></button>';
}

/* ---- Battement de cœur quand il ne reste qu'une balle ---- */
function playHeartbeat() {
  if (!opt("lastBullet")) return;
  playTone(62, 0.16, "sine", 0.35, 0);
  playTone(58, 0.2, "sine", 0.28, 0.22);
}

/* ---- Carte de fin de soirée (image) ---- */
function loadImg(src) {
  return new Promise(function (res) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { res(null); }; i.src = src; });
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function fitText(ctx, text, maxW, font, size) {
  var s = size;
  do { ctx.font = font.replace("{s}", s); s -= 2; } while (ctx.measureText(text).width > maxW && s > 12);
}
function buildShareCard() {
  var W = 1080, H = 1350;
  var cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  var ctx = cv.getContext("2d");
  if (!ctx) return Promise.resolve(null);
  var sorted = state.players.slice().sort(function (a, b) { return b.wins - a.wins; });
  var top = sorted[0] && sorted[0].wins > 0 ? sorted[0] : null;
  var fontsReady = document.fonts && document.fonts.load ? Promise.all([
    document.fonts.load("100px Sancreek"), document.fonts.load("60px Rye"), document.fonts.load("700 40px 'Barlow Condensed'"), document.fonts.load("600 40px Barlow")
  ]).catch(function () {}) : Promise.resolve();
  return fontsReady.then(function () { return top ? loadImg(CHAR_IMAGES[top.ball]) : null; }).then(function (img) {
    // Fond bois + rayons
    var g = ctx.createRadialGradient(W / 2, 380, 50, W / 2, 520, 900);
    g.addColorStop(0, "#5a3415"); g.addColorStop(.5, "#26150a"); g.addColorStop(1, "#0e0703");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(W / 2, 560); ctx.fillStyle = "rgba(255,200,110,.05)";
    for (var i = 0; i < 28; i++) { ctx.rotate(Math.PI * 2 / 28); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-60, -1300); ctx.lineTo(60, -1300); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    // Titre
    ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    ctx.font = "130px Sancreek"; ctx.fillStyle = "#2a1406"; ctx.fillText("Killer", W / 2, 166);
    ctx.fillStyle = "#F4CF75"; ctx.fillText("Killer", W / 2, 158);
    ctx.font = "700 34px 'Barlow Condensed'"; ctx.fillStyle = "#D0BB90";
    ctx.fillText(fmtDate(state.startedAt || Date.now()).toUpperCase(), W / 2, 214);
    // Avis de recherche
    var px = 250, py = 255, pw = 580, ph = 750;
    ctx.save(); ctx.translate(W / 2, py + ph / 2); ctx.rotate(-0.025); ctx.translate(-W / 2, -(py + ph / 2));
    ctx.shadowColor = "rgba(0,0,0,.55)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
    var pg = ctx.createLinearGradient(px, py, px + pw, py + ph); pg.addColorStop(0, "#F0DFB3"); pg.addColorStop(1, "#D3B67A");
    ctx.fillStyle = pg; ctx.fillRect(px, py, pw, ph);
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "#3a1d0a"; ctx.lineWidth = 5; ctx.strokeRect(px + 14, py + 14, pw - 28, ph - 28);
    ctx.fillStyle = "#2a1408"; ctx.font = "112px Sancreek"; ctx.fillText(t("wanted").toUpperCase(), W / 2, py + 132);
    ctx.fillRect(px + 60, py + 152, pw - 120, 5);
    var ix = W / 2 - 170, iy = py + 178, iw = 340, ih = 330;
    ctx.fillStyle = "#2a1408"; ctx.fillRect(ix - 6, iy - 6, iw + 12, ih + 12);
    if (img) {
      var sc = Math.max(iw / img.width, ih / img.height), sw = iw / sc, sh = ih / sc;
      var sy = Math.max(0, Math.min(img.height * 0.06, img.height - sh));
      ctx.drawImage(img, (img.width - sw) / 2, sy, sw, Math.min(sh, img.height), ix, iy, iw, ih);
      ctx.fillStyle = "rgba(140,90,30,.18)"; ctx.fillRect(ix, iy, iw, ih);
    } else { ctx.fillStyle = "#EAD6A3"; ctx.font = "160px Sancreek"; ctx.fillText("?", W / 2, iy + 230); }
    ctx.fillStyle = "#2a1408";
    fitText(ctx, (top ? top.name : t("noWinner")).toUpperCase(), pw - 100, "{s}px Rye", 70);
    ctx.fillText((top ? top.name : t("noWinner")).toUpperCase(), W / 2, py + 586);
    ctx.font = "700 32px 'Barlow Condensed'"; ctx.fillStyle = "#4a2c12";
    ctx.fillText(t("kingOfNight").toUpperCase(), W / 2, py + 630);
    if (top) { ctx.font = "54px Rye"; ctx.fillStyle = "#8e1c12"; ctx.fillText(tn("roundsWon", top.wins).toUpperCase(), W / 2, py + 680); }
    ctx.restore();
    // Classement
    var rows = sorted.slice(top ? 1 : 0, top ? 5 : 5), y0 = 1090;
    rows.forEach(function (p, k) {
      var y = y0 + k * 54;
      ctx.textAlign = "left"; ctx.font = "700 40px 'Barlow Condensed'"; ctx.fillStyle = "#E0B252";
      ctx.fillText((sorted.indexOf(p) + 1) + ".", 250, y);
      ctx.font = "600 40px Barlow"; ctx.fillStyle = "#F6E8C9"; ctx.fillText(p.name, 310, y);
      ctx.textAlign = "right"; ctx.fillStyle = "#D0BB90"; ctx.fillText(tn("roundsWon", p.wins), 830, y);
    });
    ctx.textAlign = "center"; ctx.font = "600 28px 'Barlow Condensed'"; ctx.fillStyle = "#937E5A";
    var foot = t("cardFooter", { n: sorted.reduce(function (s, p) { return s + p.wins; }, 0) }) + (state.rules.length ? " · " + tn("rules", state.rules.length) : "");
    ctx.fillText(foot.toUpperCase(), W / 2, H - 34);
    return new Promise(function (res) {
      try {
        cv.toBlob(function (blob) { res({ url: cv.toDataURL("image/png"), blob: blob }); }, "image/png");
      } catch (e) { res({ url: cv.toDataURL("image/png"), blob: null }); }
    });
  });
}
function openShareCard() {
  ui.modal = { kind: "share", loading: true }; render();
  buildShareCard().then(function (r) {
    if (!ui.modal || ui.modal.kind !== "share") return;
    if (!r) { ui.modal = null; shareFinal(); return; }
    ui.modal = { kind: "share", url: r.url, blob: r.blob }; render();
  }).catch(function () { ui.modal = null; render(); shareFinal(); });
}
function sendShareCard() {
  var m = ui.modal;
  if (!m || !m.url) return;
  var name = "killer-" + new Date().toISOString().slice(0, 10) + ".png";
  var file = null;
  try { if (m.blob) file = new File([m.blob], name, { type: "image/png" }); } catch (e) {}
  if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({ files: [file], title: "Killer" }).catch(function () {});
    return;
  }
  try {
    var a = document.createElement("a"); a.href = m.url; a.download = name; a.style.display = "none";
    document.body.appendChild(a); a.click(); a.remove();
    toast(t("tImageSaved"));
  } catch (e) { shareFinal(); }
}

/* ================= Vues ================= */
function fmtDate(ts) {
  try { return new Date(ts).toLocaleDateString(locale(), { weekday: "short", day: "numeric", month: "short", year: "numeric" }); }
  catch (e) { return ""; }
}
function fmtShortDate(ts) {
  try { return new Date(ts).toLocaleDateString(locale(), { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return ""; }
}
function fmtDateTime(ts) {
  try { return new Date(ts).toLocaleDateString(locale(), { day: "numeric", month: "short" }) + " " + new Date(ts).toLocaleTimeString(locale(), { hour: "2-digit", minute: "2-digit" }); }
  catch (e) { return ""; }
}
function daysSince(ts) { return ts ? Math.floor((Date.now() - ts) / 86400000) : null; }
function isStandalone() {
  try { return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true; } catch (e) { return false; }
}
function exportDue() {
  if (!db.history.some(function (h) { return h.finished; }) && !db.rulebook.length) return false;
  var d = daysSince(db.settings.lastExportAt);
  return d === null || d >= 14;
}
function btnAttr(action, extra) { return 'data-action="' + action + '"' + (extra ? " " + extra : ""); }
function esc(s) { return escapeHtml(s); }

function cornerFlourish(rotate, pos) {
  return '<svg width="20" height="20" viewBox="0 0 26 26" class="cornerFlourish" style="' + pos + ';transform:rotate(' + rotate + 'deg)" aria-hidden="true">' +
    '<path d="M2,20 L2,2 L20,2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="2" cy="2" r="2.4" fill="currentColor"/></svg>';
}
function corners() {
  return cornerFlourish(0, "top:10px;left:10px") + cornerFlourish(90, "top:10px;right:10px") + cornerFlourish(180, "bottom:10px;right:10px") + cornerFlourish(270, "bottom:10px;left:10px");
}

function confettiHtml() {
  var colors = ["#E0B252", "#F4E6C6", "#C23B2A", "#F0C766", "#7C8A95"], s = "";
  for (var i = 0; i < 34; i++) {
    s += '<i style="left:' + ((i * 37) % 100) + '%;background:' + colors[i % 5] + ';animation-delay:' + ((i % 7) * 0.13).toFixed(2) + 's;animation-duration:' + (2.1 + (i % 5) * 0.3).toFixed(2) + 's;--r:' + ((i * 47) % 360) + 'deg"></i>';
  }
  return '<div class="confetti" aria-hidden="true">' + s + '</div>';
}

/* Avatar : perso (Saloon) ou boule (Classique), couronne si Roi */
function avatar(ball, size, name, extra) {
  var inner = ball != null
    ? cardArtHtml(ball, null, false)
    : '<span class="avInitial">' + esc(String(name || "?").charAt(0).toUpperCase()) + '</span>';
  var crown = name && isKing(name) ? '<span class="avCrown">' + crownSvg(Math.round(size * 0.42)) + '</span>' : "";
  return '<span class="av' + (extra ? " " + extra : "") + '" style="width:' + size + 'px;height:' + size + 'px">' + '<span class="avClip">' + inner + '</span>' + crown + '</span>';
}

/* ---- Barres d'en-tête ---- */
function topBar(title, left, right) {
  return '<header class="topBar" data-key="topbar"><div class="tbSide">' + (left || "") + '</div><h1 class="tbTitle">' + title + '</h1><div class="tbSide tbRight">' + (right || "") + '</div></header>';
}
function heroHeader() {
  return '<header class="hero" data-key="hero-head"><div class="heroBadge">' + sheriffStar(30, "currentColor") + '</div>' +
    '<h1 class="logo">Killer</h1><div class="logoSub"><span></span>' + esc(t("appSub")) + '<span></span></div></header>';
}
function kingRibbon() {
  var k = kingName();
  if (!k) return "";
  return '<button class="kingRibbon" data-key="king" ' + btnAttr("open-profile", 'data-name="' + esc(k) + '"') + '>' + crownSvg(18) +
    '<span class="krLabel">' + esc(t("kingOfPool")) + '</span><span class="krName">' + esc(k) + '</span><span class="krNum">' + (historyWins()[k] || 0) + '</span></button>';
}

/* ---- Jouer : préparation ---- */
function renderSetup() {
  var players = state.players;
  var rows = players.map(function (p, i) {
    return '<li class="pRow enter" data-key="pl-' + p.id + '" style="--d:' + Math.min(i, 8) * 30 + 'ms">' +
      '<span class="pIdx">' + (i + 1) + '</span><span class="pName">' + esc(p.name) + (isKing(p.name) ? crownSvg(16, "inline") : "") + '</span>' +
      '<button class="iconBtn" ' + btnAttr("remove-player", 'data-id="' + p.id + '" aria-label="' + esc(t("removeX", { name: p.name })) + '"') + '>' + icon("close", 18) + '</button></li>';
  }).join("");
  var taken = {};
  players.forEach(function (p) { taken[p.name.toLowerCase()] = true; });
  var chips = knownPlayerNames().filter(function (n) { return !taken[n.toLowerCase()]; }).slice(0, 12).map(function (n) {
    return '<button class="chip" data-key="chip-' + esc(n) + '" ' + btnAttr("add-known", 'data-name="' + esc(n) + '"') + (players.length >= 10 ? " disabled" : "") + '>' + icon("plus", 14) + esc(n) + '</button>';
  }).join("");
  var canStart = players.length >= 2;
  var hint = players.length === 0 ? t("noPlayers") : (players.length === 1 ? t("oneMore") : (players.length >= 10 ? t("maxPlayers") : ""));
  return kingRibbon() +
    '<section class="panel setupPanel">' +
    '<div class="panelHead"><h2 class="panelTitle">' + esc(t("newGame")) + '</h2>' + (players.length ? '<span class="countPill">' + esc(tn("playersCount", players.length)) + '</span>' : "") + '</div>' +
    '<div class="field"><input class="input" id="nameInputField" data-bind="nameInput" value="' + esc(ui.nameInput) + '" placeholder="' + esc(t("playerName")) + '" maxlength="60" enterkeyhint="done" autocapitalize="words" autocomplete="off" autocorrect="off" spellcheck="false"/>' +
    '<button class="addBtn" ' + btnAttr("add-player", 'aria-label="' + esc(t("add")) + '"') + (players.length >= 10 ? " disabled" : "") + '>' + icon("plus", 22) + '</button></div>' +
    (chips ? '<div class="label">' + esc(t("regulars")) + '</div><div class="chips">' + chips + '</div>' : "") +
    (rows ? '<ul class="pList">' + rows + '</ul>' : "") +
    (hint ? '<p class="hint">' + esc(hint) + '</p>' : "") +
    '</section>' +
    '<button class="btn btnPrimary btnLg" ' + btnAttr("start-game") + (canStart ? "" : " disabled") + '>' + esc(t("startGame")) + '</button>';
}

/* ---- Distribution ---- */
function dealCardBtn(c, i) {
  return '<button class="slot deal" data-key="dcard-' + c.number + '" style="--d:' + (i * 45) + 'ms" ' + btnAttr(c.up ? "noop" : "pick-dealing-card", 'data-number="' + c.number + '" aria-label="' + esc(t("hiddenCard")) + '"') + (c.up ? " disabled" : "") + '>' +
    '<div class="cardPerspective"><div class="cardInner' + (c.up ? " up" : "") + '">' +
    '<div class="cardFaceBase cardBackFace">' + cardBackHtml("lounge") + '</div>' +
    '<div class="cardFaceBase cardFrontFace"><div class="cardArtWrap">' + cardArtHtml(c.number, null, false) + '</div></div>' +
    '</div></div></button>';
}
function renderDealing() {
  if (state.dealingComplete) {
    var cards = state.players.map(function (p, i) {
      return '<div class="dealt pop" data-key="dl-' + p.id + '" style="animation-delay:' + (i * 0.09).toFixed(2) + 's">' +
        '<div class="dealtCard">' + cardFaceHtml(state.theme, p.ball, p.name) + '</div></div>';
    }).join("");
    return '<p class="lead center">' + esc(t("dealLeadDone")) + '</p><div class="dealGrid">' + cards + '</div>' +
      '<button class="btn btnPrimary btnLg" ' + btnAttr("confirm-dealt") + '>' + esc(t("letsGo")) + '</button>';
  }
  var cp = state.players[state.dealingIndex];
  var cardsHtml = (state.dealingCards || []).map(dealCardBtn).join("");
  var steps = state.players.map(function (p, i) { return '<span class="step' + (i < state.dealingIndex ? " done" : (i === state.dealingIndex ? " now" : "")) + '"></span>'; }).join("");
  return '<div class="dealHead"><div class="steps">' + steps + '</div><h2 class="dealWho" data-key="dealwho-' + state.dealingIndex + '">' + esc(t("dealTurn", { name: cp ? cp.name : "" })) + '</h2><p class="hint center">' + esc(t("dealHint")) + '</p></div>' +
    '<div class="cardGrid">' + cardsHtml + '</div>';
}
function renderDealHero() {
  var n = state.dealingRevealNumber;
  if (!(state.phase === "dealing" && n)) return "";
  var cp = state.players[state.dealingIndex];
  return '<div class="overlay heroOverlay" data-key="dealhero"><div class="rays" aria-hidden="true"></div>' +
    '<p class="spotKicker">' + esc(cp ? cp.name : "") + '</p>' +
    '<div class="bigCard zoomIn">' + cardArtHtml(n, animalName(n), false) + '</div>' +
    '<button class="btn btnPrimary heroBtn" ' + btnAttr("confirm-dealing-pick") + '>' + esc(t("continue")) + '</button></div>';
}

/* ---- Partie ---- */
function renderRulePresetPicker(owner) {
  var open = ui.presetOpen === owner;
  var list = open ? '<ul class="presetList">' + rulePresets().map(function (p, i) {
    return '<li><button type="button" class="presetItem" ' + btnAttr("pick-preset", 'data-preset-idx="' + i + '"') + '>' + esc(p) + '</button></li>';
  }).join("") + '</ul>' : "";
  return '<div class="presetWrap" data-key="preset-' + owner + '"><button type="button" class="presetToggle" ' + btnAttr("toggle-preset", 'data-owner="' + owner + '"') + '>' + icon("sparkle", 16) +
    esc(open ? t("closeIdeas") : t("pickIdea")) + '</button>' + list + '</div>';
}
function rulesListHtml(rules) {
  return '<ul class="ruleList">' + rules.map(function (r) {
    return '<li class="ruleItem"><span class="ruleTag">M' + r.round + '</span><span>' + esc(r.text) + '</span></li>';
  }).join("") + '</ul>';
}
function renderRulesSheet() {
  if (!ui.rulesOpen || ui.activeTab !== "play" || state.phase !== "game") return "";
  return '<div class="overlay sheetBg" data-key="rules-sheet" ' + btnAttr("toggle-rules", 'data-self="1"') + '><div class="sheet" data-stop="1">' +
    '<div class="sheetGrab"></div><div class="sheetHead"><h2 class="sheetTitle">' + esc(t("houseRules")) + '</h2>' +
    '<button class="iconBtn round" ' + btnAttr("toggle-rules", 'aria-label="' + esc(t("close")) + '"') + '>' + icon("close", 18) + '</button></div>' +
    (state.rules.length ? rulesListHtml(state.rules) : '<p class="hint">' + esc(t("noRulesYet")) + '</p>') +
    renderRulePresetPicker("panel") +
    '<div class="field"><input class="input" data-bind="ruleInput" value="' + esc(ui.ruleInput) + '" placeholder="' + esc(t("ruleExample")) + '" maxlength="120" enterkeyhint="done" autocomplete="off"/>' +
    '<button class="addBtn" ' + btnAttr("add-rule", 'aria-label="' + esc(t("add")) + '"') + '>' + icon("plus", 22) + '</button></div></div></div>';
}

function livesHtml(p) {
  var slots = Math.max(p.lives, 3), s = "";
  var just = ui.flash && ui.flash.id === p.id && (ui.flash.kind === "down" || ui.flash.kind === "elim");
  var gained = ui.flash && ui.flash.id === p.id && ui.flash.kind === "up";
  for (var i = 0; i < slots; i++) {
    var spent = i >= p.lives;
    var cls = "bSlot" + (spent ? " spent" : "") + (just && i === p.lives ? " just" : "") + (gained && i === p.lives - 1 ? " gain" : "");
    s += '<span class="' + cls + '" data-key="b' + i + '">' + bulletSvg(spent) + '</span>';
  }
  return '<span class="lives" data-key="lives">' + s + '</span>';
}

function renderUndoBar() {
  var last = db.undo[db.undo.length - 1];
  return '<div class="undoBar" data-key="undobar">' + (last ? '<button class="undoPill" ' + btnAttr("undo") + '>' + icon("undo", 15) + '<span>' + esc(t("undoX", { label: last.label })) + '</span></button>' : "") + '</div>';
}

function tourCardHtml(c, i) {
  var p = null;
  state.players.forEach(function (x) { if (x.id === c.id) p = x; });
  var isCur = c.up && c.id === state.currentTurnId;
  return '<button class="slot deal' + (isCur ? " current" : "") + '" data-key="tc-' + state.round + "-" + state.tour + "-" + c.id + '" style="--d:' + (i * 70) + 'ms" data-id="' + c.id + '" ' +
    btnAttr(c.up ? (isCur ? "show-spotlight" : "noop") : "pick-card") +
    ' aria-label="' + esc(c.up && p ? p.name : t("hiddenCard")) + '">' +
    '<div class="cardPerspective"><div class="cardInner' + (c.up ? " up" : "") + '">' +
    '<div class="cardFaceBase cardBackFace">' + cardBackHtml(state.theme) + '</div>' +
    '<div class="cardFaceBase cardFrontFace">' + (p ? cardFaceHtml(state.theme, p.ball, p.name) : "") + '</div>' +
    '</div></div></button>';
}

function renderGameScreen() {
  var players = state.players, cur = state.currentTurnId, ended = state.phase === "roundEnd";
  var rows = players.map(function (p) {
    var out = p.lives <= 0, isTurn = cur === p.id && !out;
    var fl = ui.flash && ui.flash.id === p.id ? " fx-" + ui.flash.kind : "";
    var controls = ended ? "" : (out
      ? '<button class="reviveBtn" ' + btnAttr("change-life", 'data-id="' + p.id + '" data-delta="1" aria-label="' + esc(t("reviveX", { name: p.name })) + '"') + '>' + icon("revive", 16) + '<span>' + esc(t("revive")) + '</span></button>'
      : '<div class="lifeBtns"><button class="lifeBtn minus" ' + btnAttr("change-life", 'data-id="' + p.id + '" data-delta="-1" aria-label="' + esc(t("loseLife", { name: p.name })) + '"') + '>' + icon("minus", 22) + '</button>' +
        '<button class="lifeBtn plus" ' + btnAttr("change-life", 'data-id="' + p.id + '" data-delta="1" aria-label="' + esc(t("gainLife", { name: p.name })) + '"') + '>' + icon("plus", 22) + '</button></div>');
    var last = !ended && p.lives === 1 && opt("lastBullet");
    return '<li class="gRow' + (out ? " out" : "") + (isTurn ? " turn" : "") + (last ? " last" : "") + fl + '" data-key="row-' + p.id + '">' +
      avatar(p.ball, 50, p.name, "gAv") +
      '<div class="gMid"><span class="gName">' + esc(p.name) + '</span><span class="gSub">' + livesHtml(p) + (isTurn ? '<span class="turnTag">' + esc(t("yourTurn")) + '</span>' : "") + (p.skip > 0 && !out ? '<span class="skipTag">' + esc(t("skipTag")) + '</span>' : "") + (p.shield > 0 && !out ? '<span class="skipTag shieldTag">' + esc(t("tagShield")) + '</span>' : "") + (p.bounty > 0 && !out ? '<span class="skipTag bountyTag">' + esc(t("tagBounty")) + '</span>' : "") + (opt("jokers") ? jokersOf(p.id).map(function (j) { return '<span class="jkMini ' + j.kind + '" title="' + esc(jokerInfo(j.key).name) + '">' + jokerSvg(j.kind, 16) + '</span>'; }).join("") : "") + '</span></div>' + controls +
      (out ? '<span class="stamp' + (ui.flash && ui.flash.id === p.id && ui.flash.kind === "elim" ? " stampIn" : "") + '" aria-hidden="true">' + esc(t("eliminated")) + '</span>' : "") +
      '</li>';
  }).join("");

  var left = state.tourCards.filter(function (c) { return !c.up; }).length;
  var allUp = state.tourCards.length > 0 && left === 0;
  var cp = null;
  players.forEach(function (p) { if (p.id === cur) cp = p; });
  var tour = ended ? "" : '<section class="tourSec" data-key="tour">' +
    '<div class="secHead"><span class="label">' + esc(t("tour", { n: state.tour })) + '</span><span class="secRight">' + esc(allUp ? t("newTourSoon") : tn("cardsLeft", left)) + '</span></div>' +
    '<div class="cardRow">' + state.tourCards.map(tourCardHtml).join("") + '</div>' +
    '<div class="turnWrap" data-key="turnwrap"><p class="turnLine">' + (cp ? esc(t("turnOf", { name: cp.name })) : esc(t("pickCard"))) + '</p>' + (cp && ui.timer && ui.timer.id === cp.id ? chronoChipHtml() : "") + '</div></section>';

  var sorted = players.slice().sort(function (a, b) { return b.wins - a.wins; });
  var board = sorted.some(function (p) { return p.wins > 0; })
    ? '<section class="board" data-key="board"><div class="label">' + esc(t("nightRanking")) + '</div><div class="boardRow">' +
      sorted.map(function (p, i) { return '<span class="boardItem' + (i === 0 && p.wins > 0 ? " lead" : "") + '">' + esc(p.name) + '<b>' + p.wins + '</b></span>'; }).join("") + '</div></section>' : "";

  return renderUndoBar() + (ended ? "" : tableStripHtml() + ruleAlertHtml()) + '<ul class="gList">' + rows + '</ul>' + tour + board +
    '<button class="btn btnText" ' + btnAttr("end-session") + '>' + esc(t("endNight")) + '</button>';
}

/* ---- Carte piochée en grand ---- */
function bigCardHtml(p) {
  return '<div class="bigCard" id="spotCard">' + cardArtHtml(p.ball, null, false) + '</div>';
}
function spotLivesHtml(p) {
  var s = "";
  for (var i = 0; i < Math.max(p.lives, 3); i++) s += '<span class="bSlot' + (i >= p.lives ? " spent" : "") + '">' + bulletSvg(i >= p.lives) + '</span>';
  return '<div class="spotLives"><span class="lives">' + s + '</span><span>' + esc(tn("livesLeft", p.lives)) + '</span>' + (p.shield > 0 ? '<span class="skipTag shieldTag">' + esc(t("tagShield")) + '</span>' : "") + (p.bounty > 0 ? '<span class="skipTag bountyTag">' + esc(t("tagBounty")) + '</span>' : "") + '</div>';
}
function tableBallsHtml(selectable) {
  var tb = tableOf(), sel = (ui.spotlight && ui.spotlight.sel) || [];
  return '<div class="ballGrid' + (selectable ? " pick" : "") + '">' + TABLE_BALLS.map(function (n) {
    var gone = !!tb.potted[n], on = sel.indexOf(n) >= 0;
    if (selectable) return '<button class="ballBtn' + (gone ? " gone" : "") + (on ? " on" : "") + '" data-key="bb' + n + '" ' + btnAttr(gone ? "noop" : "pot-toggle", 'data-n="' + n + '" aria-pressed="' + on + '"') + (gone ? " disabled" : "") + '>' + poolBall(n, 46) + '</button>';
    return '<span class="ballCell' + (gone ? " gone" : "") + '">' + poolBall(n, 34) + '</span>';
  }).join("") + '</div>';
}
function tableInfoHtml() {
  var tb = tableOf(), left = ballsOnTable();
  var rules = ballRules();
  var rulesHtml = rules.length ? '<ul class="ruleStatus">' + rules.map(function (r) {
    return '<li><span class="rsText">' + esc(r.text) + '</span><span class="rsBalls">' + r.balls.map(function (n) {
      var by = tb.potted[n] ? playerById(tb.potted[n].by) : null;
      return '<span class="rsBall' + (by ? " gone" : "") + '">' + poolBall(n, 22) + '<em>' + esc(by ? t("ballPottedBy", { name: by.name }) : (n > 15 ? "" : t("ballOnTable"))) + '</em></span>';
    }).join("") + '</span></li>';
  }).join("") + '</ul>' : '<p class="hint small">' + esc(t("noBallRules")) + '</p>';
  return '<div class="label">' + esc(t("tableTitle")) + '<span class="labelCount">' + esc(t("rackN", { n: tb.rack || 1 })) + '</span></div>' + tableBallsHtml(false) +
    '<p class="eightLine' + (tb.potted[8] ? " off" : "") + '">' + poolBall(8, 22) + esc(tb.potted[8] ? t("eightOff") : t("eightOn")) + '</p>' +
    '<div class="label">' + esc(t("rulesInPlay")) + '</div>' + rulesHtml +
    (state.rules.length > rules.length ? '<p class="hint small">' + esc(t("houseRules")) + ' : ' + state.rules.filter(function (r) { return !ballsInText(r.text).length; }).map(function (r) { return esc(r.text); }).join(" · ") + '</p>' : "");
}
function spotJokersHtml(p) {
  if (!opt("jokers")) return "";
  var js = jokersOf(p.id);
  if (!js.length) return "";
  return '<div class="spotJokers">' + js.map(function (j) {
    var info = jokerInfo(j.key);
    return '<button class="jkUse ' + j.kind + '" ' + btnAttr("use-joker", 'data-jid="' + j.id + '"') + '>' + jokerSvg(j.kind, 22) + '<span><b>' + esc(info.name) + '</b><small>' + esc(info.text) + '</small></span><em>' + esc(t("useJoker")) + '</em></button>';
  }).join("") + '</div>';
}
function renderSpotlight() {
  if (!ui.spotlight || ui.activeTab !== "play" || state.phase !== "game") return "";
  var p = playerById(ui.spotlight.id);
  if (!p) return "";
  var mode = ui.spotlight.mode || "", out = p.lives <= 0, last = p.lives === 1 && opt("lastBullet");
  var body;
  if (mode === "pot") {
    var sel = ui.spotlight.sel || [];
    body = '<div class="spotPanel" data-stop="1"><h2 class="panelH">' + esc(t("whichBalls")) + '</h2><p class="hint center">' + esc(t("whichHint")) + '</p>' + tableBallsHtml(true) +
      '<button class="btn btnPrimary btnLg" ' + btnAttr("pot-confirm") + (sel.length ? "" : " disabled") + '>' + icon("check", 20) + esc(tn("potConfirm", sel.length)) + '</button>' +
      '<div class="btnPair"><button class="btn btnSecondary" ' + btnAttr("spot-mode", 'data-mode=""') + '>' + esc(t("back")) + '</button><button class="btn btnSecondary" ' + btnAttr("pot-plain") + '>' + esc(t("potNoDetail")) + '</button></div></div>';
  } else if (mode === "info") {
    body = '<div class="spotPanel" data-stop="1"><div class="infoHead">' + avatar(p.ball, 64, p.name) + '<div><h2 class="panelH left">' + esc(p.name) + '</h2>' + spotLivesHtml(p) + '</div></div>' +
      (opt("jokers") && jokersOf(p.id).length ? '<div class="label">' + esc(t("jokersTitle")) + '</div>' + spotJokersHtml(p) : "") + tableInfoHtml() +
      '<button class="btn btnSecondary" ' + btnAttr("spot-mode", 'data-mode=""') + '>' + esc(t("back")) + '</button></div>';
  } else {
    body = '<p class="spotKicker">' + esc(t("tour", { n: state.tour })) + '</p>' +
      '<div class="bigWrap' + (last ? " lastLife" : "") + '">' + bigCardHtml(p) + (last ? '<span class="lastTag">' + esc(t("lastLife")) + '</span>' : "") + '</div>' +
      '<h2 class="spotName">' + esc(p.name) + (isKing(p.name) ? crownSvg(26, "inline") : "") + '</h2>' +
      (out ? "" : '<div class="spotTools" data-stop="1">' + spotLivesHtml(p) +
        '<div class="shotBtns"><button class="shotBtn miss" ' + btnAttr("shot-miss") + '>' + icon("close", 22) + '<span>' + esc(t("potMiss")) + '</span></button>' +
        '<button class="shotBtn hit" ' + btnAttr("spot-mode", 'data-mode="pot"') + '>' + icon("check", 22) + '<span>' + esc(t("potIn")) + '</span></button></div>' +
        spotJokersHtml(p) +
        '<button class="infoBtn" ' + btnAttr("spot-mode", 'data-mode="info"') + '>' + icon("target", 16) + esc(t("moreInfo")) + ' · ' + esc(tn("ballsLeft", ballsOnTable().length)) + '</button></div>') +
      '<p class="spotHint">' + esc(t("tapToClose")) + '</p>';
  }
  return '<div class="overlay spot' + (mode ? " panelMode" : "") + (ui.spotlight.closing ? " closing" : "") + '" data-key="spot" ' + btnAttr("close-spotlight", 'data-self="1"') + '>' +
    '<div class="rays" aria-hidden="true"></div>' + body + '</div>';
}

/* ---- Bandeau de la table + rappel des règles qui citent une boule ---- */
function tableStripHtml() {
  if (state.phase !== "game") return "";
  var left = ballsOnTable(), tb = tableOf();
  return '<button class="tableStrip" data-key="tablestrip" ' + btnAttr("table-open") + '><span class="tsBalls">' + TABLE_BALLS.map(function (n) {
    return '<span class="tsDot' + (tb.potted[n] ? " gone" : "") + (n === 8 ? " eight" : "") + '" style="--c:' + POOL_COLORS[n > 8 ? n - 8 : n] + '"' + (n > 8 ? ' data-s="1"' : "") + '></span>';
  }).join("") + '</span><span class="tsText">' + esc(t("ballsLeftShort", { n: left.length })) + '</span>' + icon("chevron", 14, "dim") + '</button>';
}
function ruleAlertHtml() {
  var a = ui.ruleAlert;
  if (!a || state.phase !== "game" || !opt("houseRules")) return "";
  var p = playerById(a.id);
  if (!p) return "";
  return '<section class="ruleAlert pop" data-key="rulealert"><div class="raHead">' + a.balls.map(function (n) { return poolBall(n, 30); }).join("") +
    '<b>' + esc(t("ruleAlertTitle", { name: p.name, balls: ballListText(a.balls) })) + '</b></div>' +
    a.rules.map(function (r) { return '<p class="raRule">« ' + esc(r) + ' »</p>'; }).join("") +
    '<div class="raBtns"><button class="raBtn" ' + btnAttr("rule-apply", 'data-do="plus"') + '>' + esc(t("applyPlus")) + '</button><button class="raBtn" ' + btnAttr("rule-apply", 'data-do="minus"') + '>' + esc(t("applyMinus")) + '</button>' +
    '<button class="raBtn" ' + btnAttr("rule-apply", 'data-do="skip"') + '>' + esc(t("applySkip")) + '</button><button class="raBtn ghost" ' + btnAttr("rule-dismiss") + '>' + esc(t("dismiss")) + '</button></div></section>';
}
function renderTableSheet() {
  if (!ui.tableOpen || ui.activeTab !== "play" || state.phase !== "game") return "";
  return '<div class="overlay sheetBg" data-key="table-sheet" ' + btnAttr("table-close", 'data-self="1"') + '><div class="sheet" data-stop="1"><div class="sheetGrab"></div>' +
    '<div class="sheetHead"><h2 class="sheetTitle">' + esc(t("tableInfo")) + '</h2><button class="iconBtn round" ' + btnAttr("table-close", 'aria-label="' + esc(t("close")) + '"') + '>' + icon("close", 18) + '</button></div>' +
    tableInfoHtml() + '</div></div>';
}

/* ---- Fin de manche ---- */
function renderRoundEnd() {
  if (state.phase !== "roundEnd" || ui.activeTab !== "play") return "";
  var w = null;
  state.players.forEach(function (p) { if (p.id === state.roundWinnerId) w = p; });
  if (!w) return "";
  return '<div class="overlay winBg" data-key="roundend">' + confettiHtml() +
    '<div class="winCard pop">' + corners() +
    '<button class="undoPill top" ' + btnAttr("undo") + '>' + icon("undo", 15) + '<span>' + esc(t("undoMistake")) + '</span></button>' +
    '<div class="winAvWrap"><div class="rays small" aria-hidden="true"></div>' + avatar(w.ball, 112, w.name, "winAv") + '</div>' +
    '<h2 class="winName">' + esc(w.name) + '</h2><p class="winSub">' + esc(t("winsRound", { n: state.round })) + '</p>' +
    roundChoiceHtml(w) +
    '<button class="btn btnPrimary btnLg" ' + btnAttr("next-round") + '>' + esc(t("nextRound")) + '</button>' +
    '<button class="btn btnText" ' + btnAttr("end-session-round") + '>' + esc(t("endNight")) + '</button></div></div>';
}

function roundChoiceHtml(w) {
  var rulesOn = opt("houseRules"), jokersOn = opt("jokers");
  if (!rulesOn && !jokersOn) return "";
  var choice = ui.roundChoice || (rulesOn ? "rule" : "joker");
  if (!rulesOn) choice = "joker"; if (!jokersOn) choice = "rule";
  var seg = rulesOn && jokersOn ? '<div class="seg small choiceSeg"><button class="segBtn' + (choice === "rule" ? " on" : "") + '" ' + btnAttr("round-choice", 'data-c="rule"') + '>' + icon("book", 15) + esc(t("roundChoiceRule")) + '</button>' +
    '<button class="segBtn' + (choice === "joker" ? " on" : "") + '" ' + btnAttr("round-choice", 'data-c="joker"') + '>' + jokerSvg("bonus", 18) + esc(t("roundChoiceJoker")) + '</button></div>' : "";
  if (choice === "rule") {
    return seg + '<p class="hint center">' + esc(t("addRuleQ")) + '</p>' + renderRulePresetPicker("roundend") +
      '<input class="input" data-bind="ruleInput" value="' + esc(ui.ruleInput) + '" placeholder="' + esc(t("ruleExample")) + '" maxlength="120" enterkeyhint="done" autocomplete="off"/>';
  }
  var jd = ui.jokerDraw;
  if (!jd) {
    return seg + '<button class="jkDeck" ' + btnAttr("draw-joker") + '><span class="jkBack">' + jokerSvg("bonus", 54) + '</span><span class="jkDeckTxt"><b>' + esc(t("jokerDraw")) + '</b><small>' + esc(t("jokerDrawHint")) + '</small></span></button>';
  }
  var info = jokerInfo(jd.key), malus = jd.kind === "malus";
  var others = state.players.filter(function (p) { return p.id !== w.id; });
  return seg + '<div class="jkCard ' + jd.kind + '" data-key="jk-' + jd.key + '">' + jokerSvg(jd.kind, 58) +
    '<div class="jkBody"><span class="jkKind">' + esc(malus ? t("jokerMalus") : t("jokerBonus")) + '</span><b class="jkName">' + esc(info.name) + '</b><p class="jkText">' + esc(info.text) + '</p></div></div>' +
    '<p class="hint center">' + esc(t(malus ? "jokerMalusFor" : "jokerKeptBy", { name: w.name })) + '</p>';
}

/* ---- Fin de soirée ---- */
function renderFinal() {
  var sorted = state.players.slice().sort(function (a, b) { return b.wins - a.wins; });
  var top = sorted[0] && sorted[0].wins > 0 ? sorted[0] : null;
  var rows = sorted.map(function (p, i) {
    return '<li class="rRow enter" data-key="fr-' + p.id + '" style="--d:' + (i * 60) + 'ms"><span class="rank r' + (i + 1) + '">' + (i + 1) + '</span>' + avatar(p.ball, 40, p.name) +
      '<span class="rName">' + esc(p.name) + '</span><span class="rVal">' + esc(tn("roundsWon", p.wins)) + '</span></li>';
  }).join("");
  return '<div class="savedPill">' + icon("check", 15) + esc(t("savedNight")) + '</div>' +
    (top ? '<section class="nightKing pop"><div class="rays small" aria-hidden="true"></div>' + avatar(top.ball, 104, top.name, "winAv") +
      '<span class="label gold">' + crownSvg(16, "inline") + esc(t("kingOfNight")) + '</span><h2 class="winName">' + esc(top.name) + '</h2></section>' : "") +
    '<div class="label">' + esc(t("finalRanking")) + '</div><ul class="rList">' + rows + '</ul>' +
    (state.rules.length ? '<section class="panel"><div class="label">' + esc(t("rulesTonight")) + '</div>' + rulesListHtml(state.rules) + '</section>' : "") +
    '<button class="btn btnPrimary btnLg" ' + btnAttr("new-game") + '>' + esc(t("newGame")) + '</button>' +
    '<button class="btn btnSecondary shareBig" ' + btnAttr("share-card") + '>' + icon("share", 18) + esc(t("shareCard")) + '</button>' +
    '<button class="btn btnText" ' + btnAttr("undo") + '>' + esc(t("resumeNight")) + '</button>' +
    '<button class="btn btnText" ' + btnAttr("export-data") + '>' + esc(t("saveFile")) + '</button>';
}

/* ---- Légendes ---- */
function renderPoster(rank, e) {
  var fav = favoriteCardFor(e.name);
  var tilt = [-2.2, 1.8, -1.2, 2.4][rank % 4];
  var portrait = fav != null ? cardArtHtml(fav, null, false) : '<span class="posterInitial">' + esc(e.name.charAt(0).toUpperCase()) + '</span>';
  return '<button class="poster enter" data-key="poster-' + esc(e.name) + '" style="--tilt:' + tilt + 'deg;--d:' + Math.min(rank, 10) * 50 + 'ms" ' + btnAttr("open-profile", 'data-name="' + esc(e.name) + '"') + '>' +
    '<span class="posterPin"></span>' + (rank === 1 ? '<span class="posterCrown">' + crownSvg(14, "inline") + esc(t("kingOfPool")) + '</span>' : "") +
    '<span class="posterHeading">' + esc(t("wanted")) + '</span><span class="posterRule"></span>' +
    '<span class="posterPortrait">' + portrait + '</span><span class="posterName">' + esc(e.name) + '</span>' +
    '<span class="posterBounty"><span class="pbLabel">' + esc(t("reward")) + '</span><span class="pbNum">' + e.wins + '</span><span class="pbLabel">' + esc(tn("roundsWonLabel", e.wins).replace(/^\d+\s*/, "")) + '</span></span></button>';
}
function renderWall() {
  var entries = wallEntries();
  if (!entries.length) return emptyState("star", t("nobodyYet"));
  var reset = '<button class="btn btnText danger" ' + btnAttr("ask-full-reset") + '>' + esc(t("resetAll")) + '</button>';
  return '<p class="lead center">' + esc(t("wallLead")) + '</p><div class="posterGrid">' + entries.map(function (e, i) { return renderPoster(i + 1, e); }).join("") + '</div>' + reset;
}
function emptyState(ic, text) {
  return '<div class="empty"><span class="emptyIco">' + (ic === "star" ? sheriffStar(40, "currentColor") : icon(ic, 34)) + '</span><p>' + esc(text) + '</p></div>';
}
function renderRanking() {
  var by = ui.rankBy === "nights" ? "nights" : "rounds";
  var list = by === "rounds" ? wallEntries().map(function (e) { return { name: e.name, v: e.wins, label: tn("roundsWon", e.wins) }; })
    : nightsRanking().map(function (e) { return { name: e.name, v: e.nights, label: tn("nights", e.nights) }; });
  var toggle = '<div class="seg small"><button class="segBtn' + (by === "rounds" ? " on" : "") + '" ' + btnAttr("set-rank-by", 'data-by="rounds"') + '>' + esc(t("byRounds")) + '</button>' +
    '<button class="segBtn' + (by === "nights" ? " on" : "") + '" ' + btnAttr("set-rank-by", 'data-by="nights"') + '>' + esc(t("byNights")) + '</button></div>';
  if (!list.length) return toggle + emptyState("star", t("nobodyYet"));
  var podium = "";
  if (list.length >= 2) {
    var order = [1, 0, 2].filter(function (i) { return list[i]; });
    podium = '<div class="podium">' + order.map(function (i) {
      var e = list[i];
      return '<button class="podStep p' + (i + 1) + ' enter" style="--d:' + (i * 90) + 'ms" ' + btnAttr("open-profile", 'data-name="' + esc(e.name) + '"') + '>' +
        avatar(favoriteCardFor(e.name), i === 0 ? 76 : 60, e.name) + '<span class="podName">' + esc(e.name) + '</span><span class="podBlock"><b>' + e.v + '</b><i>' + (i + 1) + '</i></span></button>';
    }).join("") + '</div>';
  }
  var rest = (list.length >= 2 ? list.slice(3) : list).map(function (e, j) {
    var rank = list.length >= 2 ? j + 4 : j + 1;
    return '<li><button class="rRow enter" data-key="rk-' + esc(e.name) + '" style="--d:' + j * 40 + 'ms" ' + btnAttr("open-profile", 'data-name="' + esc(e.name) + '"') + '><span class="rank">' + rank + '</span>' + avatar(favoriteCardFor(e.name), 40, e.name) +
      '<span class="rName">' + esc(e.name) + '</span><span class="rVal">' + esc(e.label) + '</span>' + icon("chevron", 16, "dim") + '</button></li>';
  }).join("");
  return toggle + '<p class="lead center">' + esc(by === "rounds" ? t("rankRoundsLead") : t("rankNightsLead")) + '</p>' + podium + (rest ? '<ul class="rList">' + rest + '</ul>' : "");
}
function renderNights() {
  var list = db.history.slice().sort(function (a, b) { return (b.startedAt || 0) - (a.startedAt || 0); });
  if (!list.length) return emptyState("calendar", t("noNights"));
  var totalRounds = 0;
  list.forEach(function (h) { totalRounds += h.rounds || 0; });
  var head = '<div class="tiles"><div class="tile"><b>' + list.length + '</b><span>' + esc(tn("nightsWord", list.length).replace(/^\d+\s*/, "")) + '</span></div><div class="tile"><b>' + totalRounds + '</b><span>' + esc(tn("roundsWord", totalRounds).replace(/^\d+\s*/, "")) + '</span></div></div>';
  var cards = list.map(function (h, idx) {
    var ranked = h.players.slice().sort(function (a, b) { return b.wins - a.wins; });
    var kings = nightKings(h);
    var live = h.id === state.soireeId && state.phase !== "finished" && state.phase !== "setup";
    var badge = live ? '<span class="badge live">' + esc(t("live")) + '</span>' : (!h.finished ? '<span class="badge">' + esc(t("unfinished")) + '</span>' : "");
    var open = ui.expandedSoiree === h.id;
    var detail = "";
    if (open) {
      detail = '<div class="nDetail"><ul class="rList">' + ranked.map(function (p, i) {
        return '<li class="rRow"><span class="rank">' + (i + 1) + '</span><span class="rName">' + esc(p.name) + (kings.indexOf(p.name) >= 0 ? crownSvg(15, "inline") : "") + '</span><span class="rVal">' + esc(tn("roundsWon", p.wins)) + '</span></li>';
      }).join("") + '</ul>' +
        (h.rules && h.rules.length ? '<div class="label">' + esc(t("nightRules")) + '</div>' + rulesListHtml(h.rules) : "") +
        (ui.confirmDeleteSoiree === h.id
          ? '<div class="confirm"><p class="hint">' + esc(t("deleteNightConfirm")) + '</p><div class="btnPair"><button class="btn btnDanger" ' + btnAttr("confirm-delete-soiree", 'data-id="' + h.id + '"') + '>' + esc(t("yesDelete")) + '</button><button class="btn btnSecondary" ' + btnAttr("cancel-delete-soiree") + '>' + esc(t("cancel")) + '</button></div></div>'
          : '<button class="btn btnText danger" ' + btnAttr("ask-delete-soiree", 'data-id="' + h.id + '"') + '>' + esc(t("deleteNight")) + '</button>') + '</div>';
    }
    return '<div class="nCard enter' + (open ? " open" : "") + '" data-key="soiree-' + h.id + '" style="--d:' + Math.min(idx, 8) * 40 + 'ms"><button class="nHead" ' + btnAttr("toggle-soiree", 'data-id="' + h.id + '"') + '>' +
      '<span class="nDate">' + esc(fmtDate(h.startedAt)) + badge + '</span>' +
      '<span class="nSub">' + esc(tn("playersCount", h.players.length)) + ' · ' + esc(tn("roundsWon", h.rounds || 0)) + '</span>' +
      '<span class="nWin">' + (kings.length ? crownSvg(16, "inline") + esc(kings.join(" & ")) + ' <b>' + ranked[0].wins + '</b>' : esc(t("noWinner"))) + '</span>' + icon("chevron", 16, "nChev") + '</button>' + detail + '</div>';
  }).join("");
  return head + '<div class="nList">' + cards + '</div>';
}
function renderLegends() {
  var tab = ui.legendsTab === "soirees" ? "soirees" : (ui.legendsTab === "rank" ? "rank" : "mur");
  var seg = '<div class="seg">' + [["mur", "segWall"], ["rank", "segRanking"], ["soirees", "segNights"]].map(function (x) {
    return '<button class="segBtn' + (tab === x[0] ? " on" : "") + '" ' + btnAttr("set-legends-tab", 'data-tab="' + x[0] + '"') + '>' + esc(t(x[1])) + '</button>';
  }).join("") + '</div>';
  return seg + '<div class="subScreen" data-key="legends-' + tab + '">' + (tab === "mur" ? renderWall() : tab === "rank" ? renderRanking() : renderNights()) + '</div>';
}

/* ---- Fiche joueur ---- */
function statTile(ic, label, value, accent) {
  var txt = typeof value === "string" && !/^[\d—%\s]+$/.test(value) && value.length > 3;
  return '<div class="sTile' + (accent ? " accent" : "") + (txt ? " txt" : "") + '"><span class="sIco">' + ic + '</span><b>' + value + '</b><span>' + esc(label) + '</span></div>';
}
function renderProfileSheet() {
  if (!ui.profile) return "";
  var pr = playerProfile(ui.profile);
  var fav = pr.fav;
  return '<div class="overlay sheetBg" data-key="profile" ' + btnAttr("close-profile", 'data-self="1"') + '><div class="sheet" data-stop="1">' +
    '<div class="sheetGrab"></div><button class="iconBtn round sheetX" ' + btnAttr("close-profile", 'aria-label="' + esc(t("close")) + '"') + '>' + icon("close", 18) + '</button>' +
    '<div class="profHead">' + avatar(fav, 84, pr.name, "profAv") + '<div><div class="label">' + esc(t("profile")) + '</div><h2 class="profName">' + esc(pr.name) + '</h2>' +
    (pr.king ? '<span class="kingTag">' + crownSvg(15, "inline") + esc(t("kingOfPool")) + '</span>' : "") + '</div></div>' +
    '<div class="sGrid">' +
    statTile(sheriffStar(18, "currentColor"), t("statRounds"), pr.rounds, true) +
    statTile(crownSvg(18), t("statKing"), pr.kingOf, true) +
    statTile(icon("calendar", 18), t("statNights"), pr.nights) +
    statTile(icon("target", 18), t("statRate"), pr.rate == null ? "—" : pr.rate + "%") +
    statTile(icon("flame", 18), t("statStreak"), pr.streak) +
    statTile(icon("sparkle", 18), t("statBest"), pr.best) +
    statTile(icon("cards", 18), t("statFav"), fav != null ? esc(animalName(fav)) : "—") +
    statTile(icon("check", 18), t("statLast"), pr.last ? esc(fmtShortDate(pr.last)) : esc(t("never"))) +
    '</div>' + profileExtras(pr.name) + '<p class="hint center small">' + esc(t("streakNote")) + '</p></div></div>';
}

function profileExtras(name) {
  var s = "";
  if (opt("rivalries")) {
    var rv = rivalsFor(name);
    s += '<div class="label">' + esc(t("rivalsTitle")) + '</div>' + (rv.nemesis || rv.prey
      ? '<div class="rivals">' +
        (rv.nemesis ? '<button class="rival nem" ' + btnAttr("open-profile", 'data-name="' + esc(rv.nemesis.name) + '"') + '>' + avatar(favoriteCardFor(rv.nemesis.name), 44, rv.nemesis.name) + '<span><i>' + esc(t("nemesis")) + '</i><b>' + esc(rv.nemesis.name) + '</b><small>' + esc(tn("nights", rv.nemesis.n)) + '</small></span></button>' : "") +
        (rv.prey ? '<button class="rival prey" ' + btnAttr("open-profile", 'data-name="' + esc(rv.prey.name) + '"') + '>' + avatar(favoriteCardFor(rv.prey.name), 44, rv.prey.name) + '<span><i>' + esc(t("prey")) + '</i><b>' + esc(rv.prey.name) + '</b><small>' + esc(tn("nights", rv.prey.n)) + '</small></span></button>' : "") + '</div>'
      : '<p class="hint small">' + esc(t("noRivalYet")) + '</p>');
  }
  if (opt("trophies")) {
    var got = trophiesFor(name);
    s += '<div class="label">' + esc(t("trophiesTitle")) + ' <span class="labelCount">' + got.length + '/' + TROPHIES.length + '</span></div><div class="trophies">' +
      TROPHIES.map(function (tr, i) {
        var on = got.indexOf(tr.id) >= 0;
        return '<div class="trophy' + (on ? " on" : "") + '" style="--d:' + i * 30 + 'ms"><span class="trIco">' + tr.ic + '</span><b>' + esc(t("tr_" + tr.id)) + '</b><small>' + esc(t("trd_" + tr.id)) + '</small></div>';
      }).join("") + '</div>';
  }
  return s;
}

/* ---- Livre ---- */
function renderBookJokers() {
  var kind = ui.jokerKind === "malus" ? "malus" : "bonus";
  var custom = (db.jokerbook || []).filter(function (j) { return j.kind === kind; });
  var row = function (key, cid) {
    var info = jokerInfo(key), ek = key;
    if (ui.jkEdit === ek) {
      return '<li class="jkRow editing ' + kind + '" data-key="jb-' + ek + '">' + jokerSvg(kind, 34) + '<div class="jkEditBox">' +
        '<input class="input" data-bind="jkEditName" value="' + esc(ui.jkEditName) + '" placeholder="' + esc(t("jkNamePh")) + '" maxlength="40" autocomplete="off"/>' +
        '<textarea class="input" data-bind="jkEditText" placeholder="' + esc(t("jkTextPh")) + '" maxlength="120">' + esc(ui.jkEditText) + '</textarea>' +
        '<div class="btnPair">' + (cid ? "" : '<button class="btn btnText" ' + btnAttr("joker-edit-reset", 'data-key="' + ek + '"') + '>' + esc(t("jkReset")) + '</button>') +
        '<button class="btn btnSecondary" ' + btnAttr("joker-edit-cancel") + '>' + esc(t("cancel")) + '</button><button class="btn btnPrimary" ' + btnAttr("joker-edit-save", 'data-key="' + ek + '"') + '>' + esc(t("ok")) + '</button></div></div></li>';
    }
    return '<li class="jkRow enter ' + kind + '" data-key="jb-' + ek + '">' + jokerSvg(kind, 34) + '<div class="jkRowBody"><b>' + esc(info.name) + '</b><span>' + esc(info.text) + '</span>' +
      (info.auto ? '<i class="jkAuto">' + esc(t("jokerAuto")) + '</i>' : "") + '</div>' +
      '<button class="iconBtn" ' + btnAttr("joker-edit", 'data-key="' + ek + '" aria-label="' + esc(t("edit")) + '"') + '>' + icon("edit", 18) + '</button>' +
      (cid ? '<button class="iconBtn" ' + btnAttr("delete-book-joker", 'data-id="' + cid + '" aria-label="' + esc(t("delete")) + '"') + '>' + icon("trash", 18) + '</button>' : "") + '</li>';
  };
  return '<p class="lead center">' + esc(t("jokersLead")) + '</p>' + (opt("jokers") ? "" : '<p class="hint center">' + esc(t("jokersNone")) + '</p>') +
    '<div class="seg small"><button class="segBtn' + (kind === "bonus" ? " on" : "") + '" ' + btnAttr("joker-kind", 'data-kind="bonus"') + '>' + esc(t("jokerBonus")) + '</button><button class="segBtn' + (kind === "malus" ? " on" : "") + '" ' + btnAttr("joker-kind", 'data-kind="malus"') + '>' + esc(t("jokerMalus")) + '</button></div>' +
    '<div class="subScreen" data-key="jk-' + kind + '"><ul class="jkList">' + JOKER_KEYS[kind].map(function (k) { return row(k); }).join("") + custom.map(function (j) { return row("c:" + j.id, j.id); }).join("") + '</ul>' +
    '<div class="field bookAdd jkAdd"><input class="input" data-bind="jokerInput" value="' + esc(ui.jokerInput) + '" placeholder="' + esc(t("jokerAdd")) + '" maxlength="120" enterkeyhint="done" autocomplete="off"/>' +
    '<button class="addBtn" ' + btnAttr("add-book-joker", 'aria-label="' + esc(t("add")) + '"') + '>' + icon("plus", 22) + '</button></div></div>';
}
function renderBook() {
  var tabs = '<div class="seg"><button class="segBtn' + (ui.bookTab !== "jokers" ? " on" : "") + '" ' + btnAttr("book-tab", 'data-tab="rules"') + '>' + esc(t("bookTabRules")) + '</button>' +
    '<button class="segBtn' + (ui.bookTab === "jokers" ? " on" : "") + '" ' + btnAttr("book-tab", 'data-tab="jokers"') + '>' + esc(t("bookTabJokers")) + '</button></div>';
  if (ui.bookTab === "jokers") return tabs + '<div class="subScreen" data-key="book-jokers">' + renderBookJokers() + '</div>';
  return tabs + '<div class="subScreen" data-key="book-rules">' + renderBookRules() + '</div>';
}
function renderBookRules() {
  var rows = rulebook.length === 0 ? emptyState("book", t("bookEmpty")) : '<ul class="bookList">' + rulebook.map(function (r, i) {
    if (ui.editingRulebookId === r.id) {
      return '<li class="bookRow editing" data-key="rb-' + r.id + '"><div class="field"><input class="input" data-bind="editRulebookText" value="' + esc(ui.editRulebookText) + '" maxlength="120" enterkeyhint="done" autocomplete="off"/>' +
        '<button class="addBtn" ' + btnAttr("save-rulebook-edit", 'data-id="' + r.id + '" aria-label="' + esc(t("ok")) + '"') + '>' + icon("check", 22) + '</button></div></li>';
    }
    return '<li class="bookRow enter" data-key="rb-' + r.id + '" style="--d:' + Math.min(i, 10) * 30 + 'ms"><span class="bookNum">' + (i + 1) + '</span><span class="bookText">' + esc(r.text) + '</span>' +
      '<button class="iconBtn" ' + btnAttr("edit-rulebook", 'data-id="' + r.id + '" aria-label="' + esc(t("edit")) + '"') + '>' + icon("edit", 18) + '</button>' +
      '<button class="iconBtn" ' + btnAttr("delete-rulebook", 'data-id="' + r.id + '" aria-label="' + esc(t("delete")) + '"') + '>' + icon("trash", 18) + '</button></li>';
  }).join("") + '</ul>';
  return '<p class="lead center">' + esc(t("bookLead")) + '</p>' +
    '<div class="field bookAdd"><input class="input" data-bind="bookInput" value="' + esc(ui.bookInput) + '" placeholder="' + esc(t("bookAdd")) + '" maxlength="120" enterkeyhint="done" autocomplete="off"/>' +
    '<button class="addBtn" ' + btnAttr("add-book-rule", 'aria-label="' + esc(t("add")) + '"') + '>' + icon("plus", 22) + '</button></div>' + rows;
}

/* ---- Aide ---- */
function renderHelp() {
  var s = "";
  for (var i = 1; i <= 8; i++) {
    s += '<section class="helpCard enter" style="--d:' + (i - 1) * 35 + 'ms"><span class="helpNum">' + i + '</span><div><h3 class="helpTitle">' + esc(t("h" + i + "t")) + '</h3><p class="helpText">' + esc(t("h" + i)) + '</p></div></section>';
  }
  return s;
}

/* ---- Réglages ---- */
function group(label, inner, extra) {
  return '<section class="group' + (extra ? " " + extra : "") + '"><div class="groupLabel">' + esc(label) + '</div><div class="groupCard">' + inner + '</div></section>';
}
function toggleRow(setting, label, hint) {
  var on = db.settings[setting] !== false;
  return '<div class="sRow"><div class="sText"><div class="sLabel">' + esc(label) + '</div>' + (hint ? '<div class="sHint">' + esc(hint) + '</div>' : "") + '</div>' +
    '<button class="toggle' + (on ? " on" : "") + '" role="switch" aria-checked="' + on + '" aria-label="' + esc(label) + '" ' + btnAttr("toggle-setting", 'data-setting="' + setting + '"') + '><span></span></button></div>';
}
function optRow(name, label, hint) {
  var on = opt(name);
  return '<div class="sRow"><div class="sText"><div class="sLabel">' + esc(label) + '</div><div class="sHint">' + esc(hint) + '</div></div>' +
    '<button class="toggle' + (on ? " on" : "") + '" role="switch" aria-checked="' + on + '" aria-label="' + esc(label) + '" ' + btnAttr("toggle-opt", 'data-opt="' + name + '"') + '><span></span></button></div>';
}
function renderSettings() {
  var d = daysSince(db.settings.lastExportAt);
  var exportLine = d === null ? t("never") : (d === 0 ? t("today") : tn("daysAgo", d));
  var persisted = storageStatus.persisted === true ? t("yes") : (storageStatus.persisted === false ? t("no") : t("unknown"));
  var backups = readBackups().map(function (b, i) { return { b: b, i: i }; }).reverse().map(function (x) {
    var dd = x.b.data || {};
    return '<div class="sRow"><div class="sText"><div class="sLabel">' + esc(fmtDateTime(x.b.at)) + ' · ' + esc(backupReasonLabel(x.b.reason)) + '</div><div class="sHint">' +
      esc(tn("nights", (dd.history || []).length)) + ' · ' + esc(tn("rules", (dd.rulebook || []).length)) + '</div></div>' +
      '<button class="btn btnSmall" ' + btnAttr("ask-restore", 'data-index="' + x.i + '"') + '>' + esc(t("restore")) + '</button></div>';
  }).join("");
  var known = knownPlayerNames();
  var knownHtml = known.length ? '<div class="sRow block"><div class="chips">' + known.map(function (n) {
    return '<span class="chip static" data-key="kn-' + esc(n) + '">' + esc(n) + '<button class="chipX" ' + btnAttr("forget-player", 'data-name="' + esc(n) + '" aria-label="' + esc(t("forgetX", { name: n })) + '"') + '>' + icon("close", 13) + '</button></span>';
  }).join("") + '</div></div>' : '<div class="sRow"><div class="sHint">' + esc(t("regularsHint")) + '</div></div>';
  var counts = t("dataCounts", { nights: tn("nights", db.history.length), rules: tn("rules", db.rulebook.length), players: tn("playersCount", wallEntries().length) });
  var seg = function (action, attr, cur, opts) {
    return '<div class="seg small inRow">' + opts.map(function (o) {
      return '<button class="segBtn' + (cur === o[0] ? " on" : "") + '" ' + btnAttr(action, attr + '="' + o[0] + '"') + '>' + esc(o[1]) + '</button>';
    }).join("") + '</div>';
  };
  return (!isStandalone() ? group(t("install"), '<div class="sRow"><div class="sHint">' + esc(t("installText")) + '</div></div>') : "") +
    group(t("appearance"), '<div class="sRow block">' + seg("set-theme", "data-theme-value", state.theme, [["lounge", t("themeLounge")], ["classic", t("themeClassic")]]) + '</div>') +
    group(t("language"), '<div class="sRow block">' + seg("set-lang", "data-lang", lang(), [["fr", "Français"], ["en", "English"]]) + '</div>') +
    group(t("comfort"), toggleRow("sound", t("sound"), t("soundHint")) + toggleRow("haptics", t("haptics"), t("hapticsHint")) + toggleRow("wakeLock", t("wake"), t("wakeHint"))) +
    group(t("gameOptions"), optRow("houseRules", t("optHouseRules"), t("optHouseRulesHint")) + optRow("jokers", t("optJokers"), t("optJokersHint")) + optRow("lastBullet", t("optLastBullet"), t("optLastBulletHint")) + optRow("rivalries", t("optRivalries"), t("optRivalriesHint")) +
      optRow("trophies", t("optTrophies"), t("optTrophiesHint")) + optRow("chrono", t("optChrono"), t("optChronoHint")) +
      (opt("chrono") ? '<div class="sRow block"><div class="sLabel small">' + esc(t("chronoLen")) + '</div>' + seg("set-chrono", "data-secs", String(chronoSecs()), [["15", "15 s"], ["20", "20 s"], ["30", "30 s"], ["45", "45 s"], ["60", "60 s"], ["90", "90 s"]]) + '</div>' : "") +
      '<div class="sRow"><div class="sHint">' + esc(t("gameOptionsHint")) + '</div></div>', "optGroup") +
    group(t("myData"),
      '<div class="sRow"><div class="sText"><div class="sLabel">' + icon("check", 16, "ok") + esc(t("autoSaved")) + '</div><div class="sHint">' + esc(counts) + '</div></div></div>' +
      '<div class="sRow"><div class="sLabel">' + esc(t("lastExport")) + '</div><div class="sValue' + (exportDue() ? " warn" : "") + '">' + esc(exportLine) + '</div></div>' +
      '<div class="sRow"><div class="sLabel">' + esc(t("durable")) + '</div><div class="sValue">' + esc(persisted) + (storageStatus.localOk ? "" : ' · <b class="bad">' + esc(t("writeFail")) + '</b>') + '</div></div>' +
      (exportDue() ? '<div class="sRow"><div class="sHint warnText">' + esc(t("exportDue")) + '</div></div>' : "") +
      '<div class="sRow block"><button class="btn btnPrimary" ' + btnAttr("export-data") + '>' + icon("download", 18) + esc(t("exportBtn")) + '</button>' +
      '<div class="btnPair"><button class="btn btnSecondary" ' + btnAttr("copy-backup") + '>' + icon("copy", 17) + esc(t("copyCode")) + '</button>' +
      '<label class="btn btnSecondary fileBtn">' + icon("upload", 17) + esc(t("importFile")) + '<input type="file" data-file-import accept=".json,application/json,text/plain"/></label></div>' +
      '<button class="btn btnText" ' + btnAttr("toggle-import-text") + '>' + esc(ui.importOpen ? t("hide") : t("pasteCode")) + '</button>' +
      (ui.importOpen ? '<textarea class="input importArea" data-bind="importText" placeholder="' + esc(t("pasteHere")) + '">' + esc(ui.importText) + '</textarea><button class="btn btnSecondary" ' + btnAttr("import-text") + '>' + esc(t("importCode")) + '</button>' : "") +
      (ui.notice ? '<p class="notice">' + esc(ui.notice) + '</p>' : "") + '</div>' +
      '<div class="sRow block"><button class="btn btnText danger" ' + btnAttr("ask-full-reset") + '>' + icon("trash", 16) + esc(t("resetAll")) + '</button></div>', "dataGroup") +
    group(t("autoBackups"), backups || '<div class="sRow"><div class="sHint">' + esc(t("firstBackup")) + '</div></div>') +
    group(t("regulars"), knownHtml) +
    '<p class="version">' + esc(t("version", { v: APP_VERSION })) + '</p>';
}

/* ---- Navigation ---- */
function renderBottomNav() {
  var items = [["play", "tabPlay", function (c) { return svgIconCues(24, c); }], ["wanted", "tabLegends", function (c) { return sheriffStar(24, c); }],
    ["rulebook", "tabBook", function (c) { return svgIconBook(24, c); }], ["howto", "tabHelp", function (c) { return svgIconSearch(24, c); }], ["settings", "tabSettings", function (c) { return svgIconGear(24, c); }]];
  return '<nav class="nav" data-key="nav">' + items.map(function (it) {
    var on = ui.activeTab === it[0];
    var dot = it[0] === "settings" && exportDue() ? '<span class="navDot"></span>' : "";
    return '<button class="navBtn' + (on ? " on" : "") + '" ' + btnAttr("set-tab", 'data-tab="' + it[0] + '"') + (on ? ' aria-current="page"' : "") + '><span class="navIco">' + it[2]("currentColor") + dot + '</span><span class="navLabel">' + esc(t(it[1])) + '</span></button>';
  }).join("") + '</nav>';
}

function renderModal() {
  var m = ui.modal;
  if (!m) return "";
  var inner = "";
  if (m.kind === "import") {
    var s = m.parsed.summary;
    inner = '<h3 class="modalTitle">' + esc(t("importQ")) + '</h3><p class="modalText">' + esc(t("importText", { nights: tn("nights", s.soirees), rules: tn("rules", s.regles), players: tn("playersCount", s.joueurs), date: s.date ? t("exportedOn", { d: fmtDate(s.date) }) : "" })) + '</p>' +
      '<div class="btnPair"><button class="btn btnSecondary" ' + btnAttr("close-modal") + '>' + esc(t("cancel")) + '</button><button class="btn btnPrimary" ' + btnAttr("confirm-import") + '>' + esc(t("replace")) + '</button></div>';
  } else if (m.kind === "restore") {
    var b = readBackups()[m.index];
    if (!b) return "";
    inner = '<h3 class="modalTitle">' + esc(t("restoreQ")) + '</h3><p class="modalText">' + esc(t("restoreText", { d: fmtDateTime(b.at) })) + '</p>' +
      '<div class="btnPair"><button class="btn btnSecondary" ' + btnAttr("close-modal") + '>' + esc(t("cancel")) + '</button><button class="btn btnPrimary" ' + btnAttr("confirm-restore", 'data-index="' + m.index + '"') + '>' + esc(t("restore")) + '</button></div>';
  } else if (m.kind === "reset") {
    inner = '<h3 class="modalTitle">' + esc(t("resetQ")) + '</h3><p class="modalText">' + esc(t("resetText")) + '</p>' +
      '<ul class="resetList"><li class="gone">' + esc(t("resetGone")) + '</li><li class="kept">' + esc(t("resetKept")) + '</li></ul>' +
      '<div class="btnPair"><button class="btn btnSecondary" ' + btnAttr("close-modal") + '>' + esc(t("cancel")) + '</button><button class="btn btnDanger" ' + btnAttr("confirm-full-reset") + '>' + esc(t("resetYes")) + '</button></div>';
  } else if (m.kind === "share") {
    inner = m.url ? '<img class="shareImg" src="' + m.url + '" alt=""/>' +
      '<div class="btnPair"><button class="btn btnSecondary" ' + btnAttr("close-modal") + '>' + esc(t("close")) + '</button><button class="btn btnPrimary" ' + btnAttr("share-card-send") + '>' + icon("share", 18) + esc(t("shareSend")) + '</button></div>'
      : '<p class="modalText center">' + esc(t("shareLoading")) + '</p>';
  } else if (m.kind === "message") {
    inner = '<h3 class="modalTitle">' + esc(m.title) + '</h3><p class="modalText">' + esc(m.text) + '</p><div class="btnPair"><button class="btn btnPrimary" ' + btnAttr("close-modal") + '>' + esc(t("ok")) + '</button></div>';
  }
  return '<div class="overlay modalBg" data-key="modal"><div class="modal pop">' + inner + '</div></div>';
}

function screenId() {
  if (ui.activeTab !== "play") return ui.activeTab;
  var ph = state.phase === "roundEnd" ? "game" : state.phase;
  return "play-" + ph;
}

function buildApp() {
  var tab = ui.activeTab, header = "", body = "";
  if (tab === "wanted") { header = topBar(esc(t("legendsTitle"))); body = renderLegends(); }
  else if (tab === "rulebook") { header = topBar(esc(t("bookTitle"))); body = renderBook(); }
  else if (tab === "howto") { header = topBar(esc(t("helpTitle"))); body = renderHelp(); }
  else if (tab === "settings") { header = topBar(esc(t("settingsTitle"))); body = renderSettings(); }
  else if (state.phase === "setup") { header = heroHeader(); body = renderSetup(); }
  else if (state.phase === "dealing") { header = topBar('<span class="tbLogo">Killer</span>'); body = renderDealing(); }
  else if (state.phase === "game" || state.phase === "roundEnd") {
    header = topBar('<span class="tbLogo">Killer</span>', '<span class="roundChip">' + esc(t("round", { n: state.round })) + '</span>',
      opt("houseRules") ? '<button class="rulesBtn" ' + btnAttr("toggle-rules", 'aria-label="' + esc(t("rules")) + '"') + '>' + icon("book", 19) + (state.rules.length ? '<span class="cnt">' + state.rules.length + '</span>' : "") + '</button>' : "");
    body = renderGameScreen();
  } else if (state.phase === "finished") { header = heroHeader(); body = renderFinal(); }

  var overlays = renderDealHero() + renderSpotlight() + renderTableSheet() + renderRoundEnd() + renderRulesSheet() + renderProfileSheet() + renderModal();
  return '<div class="shell" data-key="shell">' + header + '<main class="screen" data-key="screen-' + screenId() + '">' + body + '</main></div>' +
    renderBottomNav() + '<div class="overlays" data-key="overlays">' + overlays + '</div>' +
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true" data-key="pbdefs"><defs><linearGradient id="jkGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8D987"/><stop offset="1" stop-color="#C28C30"/></linearGradient><linearGradient id="jkRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E25543"/><stop offset="1" stop-color="#8E2016"/></linearGradient><radialGradient id="pbShine" cx="34%" cy="28%" r="72%"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient></defs></svg>';
}

/* ================= Rendu, événements, démarrage ================= */
var lastScreenId = null;
var toastTimer = null;
var corruptAtBoot = false;

function $(sel) { return document.querySelector(sel); }

function toast(msg, opts) {
  var el = document.getElementById("toast");
  if (!el) return;
  var withUndo = opts && opts.undo && db && db.undo.length > 0;
  el.innerHTML = "<span>" + escapeHtml(msg) + "</span>" + (withUndo ? '<button class="toastBtn" data-action="undo">' + escapeHtml(t("undo")) + '</button>' : "");
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove("show"); }, withUndo ? 5000 : 2800);
}

/* ---- Écran toujours allumé pendant une partie ---- */
var wakeLock = null, wakePending = false;
function syncWakeLock() {
  try {
    var want = db.settings.wakeLock !== false && ["dealing", "game", "roundEnd"].indexOf(state.phase) >= 0 && document.visibilityState === "visible";
    if (want && !wakeLock && !wakePending && navigator.wakeLock && navigator.wakeLock.request) {
      wakePending = true;
      navigator.wakeLock.request("screen").then(function (l) {
        wakePending = false; wakeLock = l;
        l.addEventListener("release", function () { wakeLock = null; });
      }).catch(function () { wakePending = false; });
    } else if (!want && wakeLock) {
      var l2 = wakeLock; wakeLock = null;
      l2.release().catch(function () {});
    }
  } catch (e) {}
}

function reducedMotion() { try { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } }

function render() {
  var host = document.getElementById("app");
  document.documentElement.setAttribute("data-theme", state.theme);
  document.documentElement.setAttribute("lang", lang());
  morphInto(host, buildApp());
  var sid = screenId();
  if (sid !== lastScreenId) { lastScreenId = sid; try { window.scrollTo(0, 0); } catch (e) {} }
  var ov = document.querySelector(".overlays");
  document.body.classList.toggle("noscroll", !!(ov && ov.children.length));
  animateSpotlightIn();
  checkTourProgress();
  syncWakeLock();
}

/* ---- Carte piochée : zoom depuis sa place, retour à sa place ---- */
function slotFor(id) { return document.querySelector('.slot[data-id="' + id + '"]'); }
function deltaTransform(from, to) {
  var a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
  if (!a.width || !b.width) return null;
  var dx = a.left + a.width / 2 - (b.left + b.width / 2), dy = a.top + a.height / 2 - (b.top + b.height / 2);
  return "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px) scale(" + (a.width / b.width).toFixed(3) + ")";
}
function animateSpotlightIn() {
  if (!ui.spotlight || !ui.spotlight.fresh) return;
  ui.spotlight.fresh = false;
  var card = document.getElementById("spotCard"), slot = slotFor(ui.spotlight.id);
  if (!card || !slot || !card.animate || reducedMotion()) return;
  var tr = deltaTransform(slot, card);
  if (!tr) return;
  try {
    card.animate([{ transform: tr, opacity: 0 }, { transform: tr, opacity: 1, offset: 0.08 }, { transform: "scale(1.04)", offset: 0.8 }, { transform: "none", opacity: 1 }],
      { duration: 620, delay: 420, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" });
  } catch (e) {}
}
var closingSpot = false;
function closeSpotlight() {
  if (!ui.spotlight || closingSpot) return;
  var card = document.getElementById("spotCard"), slot = slotFor(ui.spotlight.id);
  var done = function () { closingSpot = false; ui.spotlight = null; render(); };
  if (!card || !card.animate || reducedMotion()) { done(); return; }
  closingSpot = true;
  ui.spotlight.closing = true;
  var spot = document.querySelector(".spot");
  if (spot) spot.classList.add("closing");
  var tr = slot ? deltaTransform(slot, card) : null;
  try {
    var anim = card.animate([{ transform: "none", opacity: 1 }, { transform: tr || "scale(.6)", opacity: tr ? 1 : 0 }], { duration: 340, easing: "cubic-bezier(.4,0,.6,1)", fill: "forwards" });
    anim.onfinish = done;
    setTimeout(function () { if (closingSpot) done(); }, 600);
  } catch (e) { done(); }
}

function focusName() { var el = document.getElementById("nameInputField"); if (el) { try { el.focus(); } catch (e) {} } }

/* ---- Partage du résumé de soirée ---- */
function shareFinal() {
  var sorted = state.players.slice().sort(function (a, b) { return b.wins - a.wins; });
  var lines = sorted.map(function (p, i) { return (i + 1) + ". " + p.name + " — " + tn("roundsWon", p.wins); });
  var ruleLines = state.rules.map(function (r) { return "• " + r.text; });
  var text = t("shareTitle") + "\n\n" + lines.join("\n") + (ruleLines.length ? "\n\n" + t("shareRules") + "\n" + ruleLines.join("\n") : "");
  if (navigator.share) {
    navigator.share({ text: text, title: "Killer" }).catch(function () {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function () {
      ui.shared = true; render();
      setTimeout(function () { ui.shared = false; render(); }, 2000);
    }).catch(function () {});
  }
}

function handleExportResult(r) {
  if (r === "shared") toast(t("tShared"));
  else if (r === "downloaded") toast(t("tDownloaded"));
  else if (r === "copied") toast(t("tCopied"));
  else if (r === "failed") toast(t("tExportFail"));
  render();
}

function startImport(text) {
  var parsed = parseBackupText(text);
  if (!parsed.ok) { ui.notice = parsed.error; render(); return; }
  ui.notice = null;
  ui.modal = { kind: "import", parsed: parsed };
  render();
}

function onClick(e) {
  var el = e.target.closest ? e.target.closest("[data-action]") : null;
  if (!el) return;
  if (el.hasAttribute("data-self") && e.target.closest("[data-stop]")) return;
  var action = el.getAttribute("data-action");
  if (!action || action === "noop" || el.disabled) return;
  var id = el.getAttribute("data-id");
  switch (action) {
    case "set-tab":
      if (ui.activeTab !== el.getAttribute("data-tab")) vibrate(6);
      ui.activeTab = el.getAttribute("data-tab"); ui.confirmingReset = false; ui.notice = null; ui.profile = null; ui.spotlight = null; ui.tableOpen = false; break;
    case "set-lang": db.settings.lang = el.getAttribute("data-lang"); persist(); break;
    case "set-rank-by": ui.rankBy = el.getAttribute("data-by"); break;
    case "open-profile": ui.profile = el.getAttribute("data-name"); vibrate(8); break;
    case "close-profile": ui.profile = null; break;
    case "close-spotlight": closeSpotlight(); return;
    case "toggle-opt": var on = opt(el.getAttribute("data-opt")); db.settings[el.getAttribute("data-opt")] = !on; if (el.getAttribute("data-opt") === "chrono" && on) stopChrono(); persist(); vibrate(6); break;
    case "set-chrono": db.settings.chronoSecs = Number(el.getAttribute("data-secs")); if (ui.timer) startChrono(ui.timer.id); persist(); break;
    case "chrono-toggle": toggleChronoPause(); break;
    case "share-card": openShareCard(); return;
    case "ask-full-reset": ui.modal = { kind: "reset" }; break;
    case "confirm-full-reset": fullReset(); ui.modal = null; ui.activeTab = "play"; toast(t("tResetDone")); vibrate([20, 30, 20]); break;
    case "share-card-send": sendShareCard(); return;
    case "show-spotlight": ui.spotlight = { id: el.getAttribute("data-id"), fresh: true }; break;
    case "spot-mode": if (ui.spotlight) { ui.spotlight.mode = el.getAttribute("data-mode") || ""; ui.spotlight.sel = []; } vibrate(6); break;
    case "pot-toggle":
      if (ui.spotlight) { var nb = Number(el.getAttribute("data-n")), sl = ui.spotlight.sel || []; ui.spotlight.sel = sl.indexOf(nb) >= 0 ? sl.filter(function (x) { return x !== nb; }) : sl.concat([nb]); vibrate(6); }
      break;
    case "pot-confirm": if (ui.spotlight) { var pid = ui.spotlight.id, sel = ui.spotlight.sel || []; ui.spotlight = null; potBalls(pid, sel); } break;
    case "pot-plain": if (ui.spotlight) { var pid2 = ui.spotlight.id; ui.spotlight = null; potBalls(pid2, []); } break;
    case "shot-miss": if (ui.spotlight) { var pid3 = ui.spotlight.id; missShot(pid3); if (ui.spotlight) { render(); closeSpotlight(); return; } } break;
    case "table-open": ui.tableOpen = true; break;
    case "table-close": ui.tableOpen = false; break;
    case "rule-apply":
      if (ui.ruleAlert) {
        var ra = ui.ruleAlert, doIt = el.getAttribute("data-do"); ui.ruleAlert = null;
        if (doIt === "plus") changeLife(ra.id, 1); else if (doIt === "minus") changeLife(ra.id, -1); else if (doIt === "skip") setSkipNext(ra.id);
      }
      break;
    case "rule-dismiss": ui.ruleAlert = null; break;
    case "set-legends-tab": ui.legendsTab = el.getAttribute("data-tab"); break;
    case "set-theme": setTheme(el.getAttribute("data-theme-value")); break;
    case "toggle-rules": ui.rulesOpen = !ui.rulesOpen; break;
    case "add-player": addPlayersFromInput(); render(); focusName(); return;
    case "add-known": addPlayerByName(el.getAttribute("data-name")); break;
    case "remove-player": removePlayer(id); break;
    case "start-game": startGame(); break;
    case "pick-dealing-card": pickDealingCard(Number(el.getAttribute("data-number"))); break;
    case "confirm-dealing-pick": confirmDealingPick(); break;
    case "confirm-dealt": confirmDealt(); break;
    case "pick-card": pickCard(id); break;
    case "change-life": changeLife(id, Number(el.getAttribute("data-delta"))); break;
    case "add-rule": addRule(); break;
    case "add-book-rule": addBookRule(); break;
    case "next-round": if (opt("houseRules") && (ui.roundChoice || "rule") === "rule") addRule(); else ui.ruleInput = ""; nextRound(); break;
    case "end-session": endSession(); break;
    case "end-session-round": if (opt("houseRules") && (ui.roundChoice || "rule") === "rule") addRule(); ui.jokerDraw = null; ui.roundChoice = null; endSession(); break;
    case "round-choice": ui.roundChoice = el.getAttribute("data-c"); break;
    case "draw-joker": if (!ui.jokerDraw) drawJoker(); break;
    case "joker-target": if (ui.jokerDraw) ui.jokerDraw.target = id; break;
    case "use-joker": useJoker(el.getAttribute("data-jid")); break;
    case "book-tab": ui.bookTab = el.getAttribute("data-tab"); break;
    case "joker-kind": ui.jokerKind = el.getAttribute("data-kind"); ui.jkEdit = null; break;
    case "joker-edit": var jk = el.getAttribute("data-key"), ji = jokerInfo(jk); ui.jkEdit = jk; ui.jkEditName = ji.name; ui.jkEditText = ji.text; break;
    case "joker-edit-cancel": ui.jkEdit = null; break;
    case "joker-edit-save":
      var sk = el.getAttribute("data-key"), nm = ui.jkEditName.trim().slice(0, 40), tx = ui.jkEditText.trim().slice(0, 120);
      if (sk.indexOf("c:") === 0) db.jokerbook = (db.jokerbook || []).map(function (j) { return "c:" + j.id === sk ? Object.assign({}, j, { name: nm || null, text: tx || j.text }) : j; });
      else { db.jokerEdits = db.jokerEdits || {}; db.jokerEdits[sk] = { name: nm && nm !== t("jk_" + sk) ? nm : null, text: tx && tx !== t("jkt_" + sk) ? tx : null }; }
      ui.jkEdit = null; persist(); break;
    case "joker-edit-reset": if (db.jokerEdits) delete db.jokerEdits[el.getAttribute("data-key")]; ui.jkEdit = null; persist(); break;
    case "add-book-joker": addBookJoker(); break;
    case "delete-book-joker": db.jokerbook = (db.jokerbook || []).filter(function (j) { return j.id !== id; }); persist(); break;
    case "new-game": newGame(); break;
    case "undo": undoLast(); break;
    case "share-final": shareFinal(); return;
    case "export-data": exportData().then(handleExportResult); return;
    case "copy-backup": copyBackupText().then(function (ok) { toast(ok ? t("tCopied") : t("tCopyFail")); render(); }); return;
    case "toggle-import-text": ui.importOpen = !ui.importOpen; break;
    case "import-text": startImport(ui.importText); return;
    case "confirm-import":
      if (ui.modal && ui.modal.parsed) { applyImport(ui.modal.parsed); toast(t("tImported")); }
      ui.modal = null; ui.importText = ""; ui.importOpen = false; ui.notice = null; break;
    case "ask-restore": ui.modal = { kind: "restore", index: Number(el.getAttribute("data-index")) }; break;
    case "confirm-restore":
      if (restoreBackup(Number(el.getAttribute("data-index")))) toast(t("tRestored"));
      ui.modal = null; break;
    case "close-modal": ui.modal = null; break;
    case "toggle-setting": var k = el.getAttribute("data-setting"); db.settings[k] = db.settings[k] === false; persist(); break;
    case "forget-player": delete db.players[el.getAttribute("data-name")]; persist(); break;
    case "toggle-soiree": ui.expandedSoiree = ui.expandedSoiree === id ? null : id; ui.confirmDeleteSoiree = null; break;
    case "ask-delete-soiree": ui.confirmDeleteSoiree = id; break;
    case "cancel-delete-soiree": ui.confirmDeleteSoiree = null; break;
    case "confirm-delete-soiree":
      db.history = db.history.filter(function (h) { return h.id !== id; });
      ui.confirmDeleteSoiree = null; ui.expandedSoiree = null; persist(); toast(t("nightDeleted")); break;
    case "ask-reset-stats": ui.confirmingReset = true; break;
    case "cancel-reset-stats": ui.confirmingReset = false; break;
    case "confirm-reset-stats": resetStats(); ui.confirmingReset = false; break;
    case "edit-rulebook":
      ui.editingRulebookId = id;
      var entry = rulebook.filter(function (r) { return r.id === id; })[0];
      ui.editRulebookText = entry ? entry.text : "";
      break;
    case "save-rulebook-edit":
      if (ui.editRulebookText.trim()) updateRulebookEntry(id, ui.editRulebookText.trim());
      ui.editingRulebookId = null; break;
    case "delete-rulebook": deleteRulebookEntry(id); break;
    case "toggle-preset": var owner = el.getAttribute("data-owner"); ui.presetOpen = ui.presetOpen === owner ? null : owner; break;
    case "pick-preset": ui.ruleInput = rulePresets()[Number(el.getAttribute("data-preset-idx"))]; ui.presetOpen = null; break;
    default: return;
  }
  render();
}

// La saisie ne déclenche AUCUN rendu : le clavier reste ouvert et rien ne saute.
function onInput(e) {
  var el = e.target;
  var bind = el.getAttribute && el.getAttribute("data-bind");
  if (bind) ui[bind] = el.value;
}

function onKeydown(e) {
  if (e.key !== "Enter") return;
  var bind = e.target.getAttribute && e.target.getAttribute("data-bind");
  if (!bind) return;
  if (bind === "nameInput") { e.preventDefault(); addPlayersFromInput(); render(); focusName(); }
  else if (bind === "ruleInput") { e.preventDefault(); addRule(); render(); }
  else if (bind === "bookInput") { e.preventDefault(); addBookRule(); render(); }
  else if (bind === "jokerInput") { e.preventDefault(); addBookJoker(); render(); }
  else if (bind === "editRulebookText") {
    e.preventDefault();
    if (ui.editRulebookText.trim() && ui.editingRulebookId) updateRulebookEntry(ui.editingRulebookId, ui.editRulebookText.trim());
    ui.editingRulebookId = null; render();
  }
}

function onChange(e) {
  var el = e.target;
  if (el && el.hasAttribute && el.hasAttribute("data-file-import") && el.files && el.files[0]) {
    var f = el.files[0];
    var done = function (text) { el.value = ""; startImport(text); };
    if (f.text) f.text().then(done).catch(function () { ui.notice = t("errRead"); render(); });
    else { var r = new FileReader(); r.onload = function () { done(String(r.result)); }; r.readAsText(f); }
  }
}

/* ---- Démarrage ---- */
function adoptFromIdb() {
  idbLoad().then(function (json) {
    if (!json) {
      if (corruptAtBoot) restoreFromLatestBackup();
      return;
    }
    var cand;
    try { cand = normalizeDb(JSON.parse(json)); } catch (e) { if (corruptAtBoot) restoreFromLatestBackup(); return; }
    if (cand.savedAt > db.savedAt) {
      db = cand; db.session = repairSession(db.session); bindDb();
      render();
      toast(t("tRecovered"));
    }
  }).catch(function () { if (corruptAtBoot) restoreFromLatestBackup(); });
}
function restoreFromLatestBackup() {
  var list = readBackups();
  if (!list.length || hasMeaningfulData()) return;
  var b = list[list.length - 1];
  db = normalizeDb(b.data); db.session = repairSession(db.session); db.undo = []; bindDb(); persist(); render();
  ui.modal = { kind: "message", title: t("restoredTitle"), text: t("restoredText", { d: fmtDateTime(b.at) }) };
  render();
}

function boot() {
  var loaded = null;
  try { loaded = loadFromLocal(); } catch (e) { loaded = null; }
  db = loaded && loaded.db ? loaded.db : defaultDb();
  db.session = repairSession(db.session);
  bindDb();
  corruptAtBoot = !!(loaded && loaded.source === "corrupt");

  document.body.addEventListener("click", onClick);
  document.body.addEventListener("input", onInput);
  document.body.addEventListener("keydown", onKeydown);
  document.body.addEventListener("change", onChange);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") persist();
    syncWakeLock();
  });
  window.addEventListener("pagehide", function () { persist(); });

  if (loaded && loaded.source === "legacy") { persist(); setTimeout(function () { toast(t("tLegacy")); }, 400); }
  render();
  requestPersistentStorage();
  maybeAutoBackup();
  adoptFromIdb();

  try {
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      var hadController = !!navigator.serviceWorker.controller, pendingReload = false;
      navigator.serviceWorker.register("sw.js").then(function (reg) {
        document.addEventListener("visibilitychange", function () {
          if (document.visibilityState === "visible") { try { reg.update(); } catch (e) {} }
          else if (pendingReload) { persist(); location.reload(); }
        });
      }).catch(function () {});
      // Nouvelle version installée : on recharge tout de suite si on n'est pas en pleine partie, sinon dès que l'appli passe en arrière-plan.
      navigator.serviceWorker.addEventListener("controllerchange", function () {
        if (!hadController) { hadController = true; return; }
        if (["game", "roundEnd", "dealing"].indexOf(state.phase) >= 0) pendingReload = true;
        else { persist(); location.reload(); }
      });
    }
  } catch (e) {}
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();

})();
