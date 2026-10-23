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
  "La 7 fait passer son tour au joueur suivant",
  "La 12 permet de replacer la blanche où tu veux",
  "Rentrer deux boules d'un coup fait gagner deux vies",
  "Les boules jokers (7 et 12) reviennent en jeu à chaque nouvelle manche",
  "Toucher une boule d'un adversaire fait perdre une vie",
  "Un carreau (contact direct bille sur bille) fait gagner une vie",
  "Manquer la 8 fait perdre deux vies d'un coup",
  "Celui qui casse sans rien rentrer a droit à un second essai",
  "Rentrer la même couleur deux fois de suite fait gagner une vie",
  "Le joueur éliminé choisit qui pioche au tour suivant",
  "Toute faute (la blanche touchée deux fois) fait perdre une vie",
  "La dernière manche se joue avec la main opposée",
  "Un massé réussi rapporte une vie bonus",
  "Rentrer la 1 ou la 2 en même temps que la 8 fait gagner la manche",
  "Le premier éliminé doit inventer la moitié de la prochaine règle"
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
function cardFaceHtml(theme, ball, name) {
  if (theme === "lounge") {
    return '<div class="cardArtWrap">' + cardArtHtml(ball, name, false) + '</div>';
  }
  return '<div class="cardFrontInner">' + svgBall(ball, 30) + '<span class="cardFrontName">' + escapeHtml(name) + '</span></div>';
}
function cardBackHtml(theme) {
  return '<div class="cardBackInner">' + (theme === "lounge"
    ? '<span class="cardBackMonogram">K</span>'
    : '<span class="cardBackEmoji">🎱</span>') + '</div>';
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
var APP_VERSION = "2.0";
var DB_KEY = "killer_db_v2";
var BACKUPS_KEY = "killer_backups_v2";
var LEGACY_KEYS = { session: "killer_session_v3", stats: "killer_stats_v1", rulebook: "killer_rulebook_v1" };

function clone(o) { return JSON.parse(JSON.stringify(o)); }

function defaultDb() {
  return {
    v: 2,
    savedAt: 0,
    session: clone(initialState),
    stats: { roundWins: {}, cardPicks: {} },
    rulebook: [],
    history: [],
    players: {},
    undo: [],
    settings: { sound: true, haptics: true, wakeLock: true, lastExportAt: 0, lastAutoBackupAt: 0 }
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
  d.stats = { roundWins: isPlainObject(st.roundWins) ? st.roundWins : {}, cardPicks: isPlainObject(st.cardPicks) ? st.cardPicks : {} };
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
  if (s.phase === "dealing" && s.theme === "lounge" && !s.dealingComplete) {
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
  catch (e) { if (storageStatus.localOk) toast("Enregistrement impossible : stockage plein ou bloqué"); storageStatus.localOk = false; }
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
function restoreBackup(index) {
  var list = readBackups();
  var b = list[index];
  if (!b) return false;
  addBackup("avant restauration");
  var keep = db.settings;
  db = normalizeDb(b.data);
  db.settings = Object.assign({}, db.settings, { sound: keep.sound, haptics: keep.haptics, wakeLock: keep.wakeLock, lastExportAt: keep.lastExportAt });
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
  try { o = JSON.parse(String(text).trim()); } catch (e) { return { ok: false, error: "Ce texte n'est pas une sauvegarde Killer lisible." }; }
  var data = o && o.app === "killer" && isPlainObject(o.data) ? o.data : (isPlainObject(o) && (o.history || o.stats || o.rulebook) ? o : null);
  if (!data) return { ok: false, error: "Ce fichier ne ressemble pas à une sauvegarde Killer." };
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
  addBackup("avant import");
  var keep = db.settings;
  db = parsed.data;
  db.settings = Object.assign({}, db.settings, { sound: keep.sound, haptics: keep.haptics, wakeLock: keep.wakeLock, lastExportAt: keep.lastExportAt });
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
  startedAt: null
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
  notice: null
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
  setStats(u.stats);
  if (nextTourTimer) { clearTimeout(nextTourTimer); nextTourTimer = null; }
  persist();
  playUndoSound(); vibrate(10);
  toast("Annulé : " + u.label);
}

/* ---- Stats ---- */
function recordRoundWin(name) {
  var s = clone(stats);
  s.roundWins[name] = (s.roundWins[name] || 0) + 1;
  setStats(s);
}
function recordCardPick(name, number) {
  var s = clone(stats);
  var forName = s.cardPicks[name] || {};
  forName[number] = (forName[number] || 0) + 1;
  s.cardPicks[name] = forName;
  setStats(s);
}
function resetStats() { setStats({ roundWins: {}, cardPicks: {} }); persist(); }

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
  if (state.players.length >= 10) { toast("Dix joueurs maximum"); return false; }
  if (nameTaken(name)) { toast(name + " est déjà dans la partie"); return false; }
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
  if (state.theme === "lounge") {
    var pool = shuffle(BALL_NUMBERS).map(function (number) { return { number: number, up: false }; });
    update({ phase: "dealing", dealingCards: pool, dealingIndex: 0, dealingRevealNumber: null, dealingComplete: false });
  } else {
    var balls = shuffle(BALL_NUMBERS).slice(0, state.players.length);
    var players = state.players.map(function (p, i) { return Object.assign({}, p, { ball: balls[i], lives: 3, wins: 0 }); });
    update({ players: players, phase: "dealing" });
  }
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
  update({ phase: "game", round: 1, tour: 1, tourCards: tourCards, currentTurnId: null, soireeId: uid(), startedAt: Date.now() });
}

/* ---- Jeu ---- */
function flashRow(id, kind) {
  ui.flash = { id: id, kind: kind };
  setTimeout(function () { if (ui.flash && ui.flash.id === id) { ui.flash = null; render(); } }, 650);
}

function changeLife(id, delta) {
  var p = null;
  state.players.forEach(function (x) { if (x.id === id) p = x; });
  if (!p) return;
  var newLives = Math.max(0, p.lives + delta);
  if (newLives === p.lives) return;
  var wasEliminated = p.lives <= 0;
  pushUndo(p.name + (delta > 0 ? " +1 vie" : " −1 vie"));
  var players = state.players.map(function (x) { return x.id === id ? Object.assign({}, x, { lives: newLives }) : x; });
  var active = players.filter(function (x) { return x.lives > 0; });
  if (players.length > 1 && active.length === 1) {
    var winnerId = active[0].id;
    var withWin = players.map(function (x) { return x.id === winnerId ? Object.assign({}, x, { wins: x.wins + 1 }) : x; });
    recordRoundWin(active[0].name);
    playWinSound(); vibrate([20, 40, 20]);
    var tEl = document.getElementById("toast"); if (tEl) tEl.classList.remove("show");
    update({ players: withWin, phase: "roundEnd", roundWinnerId: winnerId, currentTurnId: null });
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
  flashRow(id, delta > 0 ? "up" : "down");
  vibrate(delta > 0 ? 12 : 22);
  if (newLives === 0) toast(p.name + " est éliminé", { undo: true });
  else if (wasEliminated) toast(p.name + " est de retour (1 vie)", { undo: true });
  else toast(p.name + " : " + newLives + (newLives > 1 ? " vies" : " vie"), { undo: true });
}

function pickCard(id) {
  var p = null;
  state.players.forEach(function (x) { if (x.id === id) p = x; });
  pushUndo("Carte de " + (p ? p.name : "joueur"));
  playFlipSound(); vibrate(15);
  update({
    tourCards: state.tourCards.map(function (c) { return c.id === id ? Object.assign({}, c, { up: true }) : c; }),
    currentTurnId: id
  });
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
  update({ tourCards: shuffle(activeIds).map(function (id) { return { id: id, up: false }; }), tour: state.tour + 1, currentTurnId: null });
}
function nextRound() {
  pushUndo("Manche suivante");
  var players = state.players.map(function (p) { return Object.assign({}, p, { lives: 3 }); });
  var tourCards = shuffle(players.map(function (p) { return p.id; })).map(function (id) { return { id: id, up: false }; });
  update({ players: players, phase: "game", round: state.round + 1, roundWinnerId: null, currentTurnId: null, tour: 1, tourCards: tourCards });
}
function endSession() {
  pushUndo("Fin de soirée");
  update({ phase: "finished" });
  addBackup("soirée");
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

/* ================= Vues ================= */
function fmtDate(ts) {
  try { return new Date(ts).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" }); }
  catch (e) { return ""; }
}
function fmtDateTime(ts) {
  try { return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) + " " + new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); }
  catch (e) { return ""; }
}
function daysSince(ts) { return ts ? Math.floor((Date.now() - ts) / 86400000) : null; }
function plural(n, one, many) { return n + " " + (n > 1 ? many : one); }
function isStandalone() {
  try { return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true; } catch (e) { return false; }
}

function btnAttr(action, extra) { return 'data-action="' + action + '"' + (extra ? " " + extra : ""); }

function svgCornerFlourishFixed(rotate, posStyle, size) {
  size = size || 26;
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 26 26" class="cornerFlourish" style="' + posStyle + ';transform:rotate(' + rotate + 'deg)" aria-hidden="true">' +
    '<path d="M2,20 L2,2 L20,2" stroke="#C9A24A" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>' +
    '<circle cx="2" cy="2" r="2.4" fill="#C9A24A" opacity="0.7"/></svg>';
}

function confettiHtml() {
  var colors = ["#C9A24A", "#EFE3C6", "#B34A3A", "#E8C34A", "#7C8A95"], s = "";
  for (var i = 0; i < 30; i++) {
    s += '<i style="left:' + ((i * 37) % 100) + '%;background:' + colors[i % 5] + ';animation-delay:' + ((i % 7) * 0.11).toFixed(2) + 's;animation-duration:' + (1.9 + (i % 5) * 0.28).toFixed(2) + 's;transform:rotate(' + (i * 29) % 360 + 'deg)"></i>';
  }
  return '<div class="confetti" aria-hidden="true">' + s + '</div>';
}

/* ---- En-tête ---- */
function renderHeader(kingName) {
  var isLounge = state.theme === "lounge";
  var kingBtn = kingName && ui.activeTab === "play"
    ? '<button class="kingBanner" ' + btnAttr("set-tab", 'data-tab="wanted"') + '>' + (isLounge ? "★ " : "") + 'Roi du Billard : ' + escapeHtml(kingName) + '</button>' : "";
  var headerRight = "";
  if (ui.activeTab === "play" && (state.phase === "game" || state.phase === "roundEnd")) {
    headerRight = '<div class="headerRight"><span class="roundBadge">Manche ' + state.round + '</span>' +
      '<button class="ghostBtn" ' + btnAttr("toggle-rules") + '>Règles' + (state.rules.length > 0 ? " (" + state.rules.length + ")" : "") + '</button></div>';
  }
  if (isLounge) {
    return '<header class="header" data-key="header"><div class="headerRule"></div><h1 class="title">Killer</h1>' + svgCuesEmblem() +
      '<p class="titleSub">Billard entre amis</p>' + kingBtn + '<div class="headerRule"></div>' + headerRight + '</header>';
  }
  return '<header class="header" data-key="header-classic"><h1 class="title">Killer</h1>' + svgRackEmblem() + kingBtn + headerRight + '</header>';
}

/* ---- Jouer : préparation ---- */
function backupReminderHtml() {
  if (!hasMeaningfulData()) return "";
  var d = daysSince(db.settings.lastExportAt);
  if (d !== null && d < 14) return "";
  return '<div class="banner" data-key="backup-banner"><span>' + (d === null ? "Tes données ne sont encore sauvegardées dans aucun fichier." : "Dernière sauvegarde fichier il y a " + plural(d, "jour", "jours") + ".") + '</span>' +
    '<button class="bannerBtn" ' + btnAttr("set-tab", 'data-tab="settings"') + '>Sauvegarder</button></div>';
}

function renderSetup() {
  var players = state.players;
  var rows = players.map(function (p, i) {
    return '<li class="playerRow" data-key="pl-' + p.id + '"><span class="playerRowIndex">' + (i + 1) + '</span>' +
      '<span class="playerRowName">' + escapeHtml(p.name) + '</span>' +
      '<button class="removeBtn" ' + btnAttr("remove-player", 'data-id="' + p.id + '" aria-label="Retirer ' + escapeHtml(p.name) + '"') + '>✕</button></li>';
  }).join("");
  var taken = {};
  players.forEach(function (p) { taken[p.name.toLowerCase()] = true; });
  var chips = knownPlayerNames().filter(function (n) { return !taken[n.toLowerCase()]; }).slice(0, 12).map(function (n) {
    return '<button class="chip" data-key="chip-' + escapeHtml(n) + '" ' + btnAttr("add-known", 'data-name="' + escapeHtml(n) + '"') + (players.length >= 10 ? " disabled" : "") + '>+ ' + escapeHtml(n) + '</button>';
  }).join("");
  var canStart = players.length >= 2;
  return backupReminderHtml() +
    '<p class="lead">Ajoutez les joueurs de la soirée, puis lancez la partie.</p>' +
    '<div class="inputRow"><input class="input" id="nameInputField" data-bind="nameInput" value="' + escapeHtml(ui.nameInput) + '" placeholder="Nom du joueur" maxlength="60" enterkeyhint="done" autocapitalize="words" autocomplete="off" autocorrect="off" spellcheck="false"/>' +
    '<button class="primaryBtnSmall" ' + btnAttr("add-player") + (players.length >= 10 ? " disabled" : "") + '>Ajouter</button></div>' +
    (chips ? '<div class="chipsLabel">Joueurs habituels</div><div class="chips">' + chips + '</div>' : "") +
    (players.length === 0 ? '<p class="hint">Aucun joueur pour l\'instant. Il en faut au moins deux.</p>' : "") +
    '<ul class="playerList">' + rows + '</ul>' +
    '<button class="primaryBtn startBtn" ' + btnAttr("start-game") + (canStart ? "" : " disabled") + '>Lancer la partie</button>' +
    (players.length === 1 ? '<p class="hint">Encore au moins un joueur pour commencer.</p>' : "") +
    (players.length >= 10 ? '<p class="hint">Dix joueurs maximum — une carte chacun.</p>' : "");
}

function renderDealingClassic() {
  var cards = state.players.map(function (p, i) {
    return '<div class="staticCardWrap pop" data-key="dc-' + p.id + '" style="animation-delay:' + (i * 0.12).toFixed(2) + 's">' + cardFaceHtml(state.theme, p.ball, p.name) + '</div>';
  }).join("");
  return '<p class="lead">Chacun reçoit sa carte. Elle vous identifie pour toute la partie et servira à tirer qui joue.</p>' +
    '<div class="dealGrid">' + cards + '</div>' +
    '<button class="primaryBtn" style="margin-top:26px" ' + btnAttr("confirm-dealt") + '>C\'est parti</button>';
}

function renderDealingLounge() {
  if (state.dealingComplete) {
    var cards = state.players.map(function (p, i) {
      return '<div class="cardArtSmallWrap pop" data-key="dl-' + p.id + '" style="animation-delay:' + (i * 0.12).toFixed(2) + 's">' + cardArtHtml(p.ball, p.name, true) + '</div>';
    }).join("");
    return '<p class="lead">Chacun a sa carte pour toute la soirée.</p><div class="dealGrid">' + cards + '</div>' +
      '<button class="primaryBtn" style="margin-top:26px" ' + btnAttr("confirm-dealt") + '>C\'est parti</button>';
  }
  var currentPlayer = state.players[state.dealingIndex];
  var revealNum = state.dealingRevealNumber;
  var revealedAnimal = revealNum ? ANIMALS[revealNum] : null;
  var cardsHtml = (state.dealingCards || []).map(function (c) {
    return '<button class="cardSlotBtn" data-key="dcard-' + c.number + '" ' + btnAttr(c.up ? "noop" : "pick-dealing-card", 'data-number="' + c.number + '" aria-label="Carte face cachée"') + (c.up ? " disabled" : "") + '>' +
      '<div class="cardPerspective"><div class="cardInner' + (c.up ? " up" : "") + '">' +
      '<div class="cardFaceBase cardBackFace">' + cardBackHtml("lounge") + '</div>' +
      '<div class="cardFaceBase cardFrontFace"><div class="cardArtWrap">' + cardArtHtml(c.number, null, false) + '</div></div>' +
      '</div></div></button>';
  }).join("");
  var hero = "";
  if (revealNum) {
    hero = '<div class="heroOverlay" data-key="hero"><p class="heroPlayerAbove">' + escapeHtml(currentPlayer ? currentPlayer.name : "") + '</p>' +
      '<div class="heroCardArt">' + cardArtHtml(revealNum, revealedAnimal ? revealedAnimal.name : "", false) + '</div>' +
      '<button class="primaryBtn" style="width:220px;margin-top:20px" ' + btnAttr("confirm-dealing-pick") + '>Continuer</button></div>';
  }
  return '<p class="lead">Au tour de <strong>' + escapeHtml(currentPlayer ? currentPlayer.name : "") + '</strong> de choisir sa carte.</p>' +
    '<div class="tourRow">' + cardsHtml + '</div>' + hero;
}

/* ---- Jouer : partie ---- */
function renderRulePresetPicker(owner) {
  var open = ui.presetOpen === owner;
  var list = open ? '<ul class="presetList">' + RULE_PRESETS.map(function (p, i) {
    return '<li><button type="button" class="presetItem" ' + btnAttr("pick-preset", 'data-preset-idx="' + i + '"') + '>' + escapeHtml(p) + '</button></li>';
  }).join("") + '</ul>' : "";
  return '<div class="presetWrap" data-key="preset-' + owner + '"><button type="button" class="presetToggleBtn" ' + btnAttr("toggle-preset", 'data-owner="' + owner + '"') + '>' +
    (open ? "Fermer les idées" : "Piocher une idée de règle") + '</button>' + list + '</div>';
}

function renderRulesPanel() {
  var list = state.rules.length === 0
    ? '<p class="hint">Aucune règle ajoutée pour l\'instant.</p>'
    : '<ul class="rulesList">' + state.rules.map(function (r) {
        return '<li class="rulesListItem"><span class="ruleRoundTag">M' + r.round + '</span> ' + escapeHtml(r.text) + '</li>';
      }).join("") + '</ul>';
  return '<div class="rulesPanel" data-key="rules-panel"><div class="rulesPanelHeader"><span class="rulesPanelTitle">Règles maison</span>' +
    '<button class="closeBtn" ' + btnAttr("toggle-rules", 'aria-label="Fermer"') + '>✕</button></div>' + list +
    renderRulePresetPicker("panel") +
    '<div class="inputRow"><input class="input" data-bind="ruleInput" value="' + escapeHtml(ui.ruleInput) + '" placeholder="Ex : la 7 fait passer son tour" maxlength="120" enterkeyhint="done" autocomplete="off"/>' +
    '<button class="primaryBtnSmall" ' + btnAttr("add-rule") + '>Ajouter</button></div></div>';
}

function renderLifePips(lives) {
  var shown = Math.min(lives, 6), pips = "";
  for (var i = 0; i < shown; i++) pips += '<span class="pip"></span>';
  return '<span class="pipsWrap">' + pips + (lives > 6 ? '<span class="pipExtra">+' + (lives - 6) + '</span>' : "") + '</span>';
}

function renderLeaderboard(players) {
  var sorted = players.slice().sort(function (a, b) { return b.wins - a.wins; });
  if (!sorted.some(function (p) { return p.wins > 0; })) return "";
  return '<div class="leaderboard" data-key="leaderboard"><span class="leaderboardLabel">Classement de la soirée</span><div class="leaderboardRow">' +
    sorted.map(function (p) { return '<span class="leaderboardItem">' + escapeHtml(p.name) + ' <strong>' + p.wins + '</strong></span>'; }).join("") + '</div></div>';
}

function renderUndoBar() {
  var last = db.undo[db.undo.length - 1];
  if (!last) return '<div class="undoBar" data-key="undobar"></div>';
  return '<div class="undoBar" data-key="undobar"><button class="undoBtn" ' + btnAttr("undo") + '>↶ Annuler : ' + escapeHtml(last.label) + '</button></div>';
}

function renderGameScreen(disabled) {
  var theme = state.theme, players = state.players, currentTurnId = state.currentTurnId;
  var rows = players.map(function (p) {
    var eliminated = p.lives <= 0, isTurn = currentTurnId === p.id;
    var fl = ui.flash && ui.flash.id === p.id ? " flash-" + ui.flash.kind : "";
    var controls = "";
    if (!disabled) {
      controls = eliminated
        ? '<div class="lifeBtns"><button class="reviveBtn" ' + btnAttr("change-life", 'data-id="' + p.id + '" data-delta="1" aria-label="Réintégrer ' + escapeHtml(p.name) + '"') + '>↺ Réintégrer</button></div>'
        : '<div class="lifeBtns"><button class="lifeBtn" ' + btnAttr("change-life", 'data-id="' + p.id + '" data-delta="-1" aria-label="' + escapeHtml(p.name) + ' perd une vie"') + '>−</button>' +
          '<button class="lifeBtn" ' + btnAttr("change-life", 'data-id="' + p.id + '" data-delta="1" aria-label="' + escapeHtml(p.name) + ' gagne une vie"') + '>+</button></div>';
    }
    return '<li class="gameRow' + (eliminated ? " eliminated" : "") + (isTurn ? " isTurn" : "") + fl + '" data-key="row-' + p.id + '">' +
      avatarHtml(theme, p.ball, 38) +
      '<div class="gameRowMid"><span class="gameRowName">' + escapeHtml(p.name) + '</span>' +
      (eliminated ? '<span class="eliminatedTag">Éliminé</span>' : renderLifePips(p.lives)) + '</div>' + controls + '</li>';
  }).join("");

  var tourSection = "";
  if (!disabled) {
    var cardsHtml = state.tourCards.map(function (c) { return cardSlotHtml(theme, c.id, players, c.up, c.id === currentTurnId); }).join("");
    var cp = null;
    players.forEach(function (p) { if (p.id === currentTurnId) cp = p; });
    tourSection = '<p class="tourHeader">Tour ' + state.tour + ' — touchez une carte pour savoir qui joue</p>' +
      '<div class="tourRow">' + cardsHtml + '</div>' +
      (cp ? '<p class="turnBanner">C\'est à <strong>' + escapeHtml(cp.name) + '</strong> de jouer</p>' : "");
  }
  return renderUndoBar() + '<ul class="gameList">' + rows + '</ul>' + tourSection + renderLeaderboard(players) +
    '<button class="linkBtn" ' + btnAttr("end-session") + '>Terminer la soirée</button>';
}

function renderRoundEndOverlay() {
  var winner = null;
  state.players.forEach(function (p) { if (p.id === state.roundWinnerId) winner = p; });
  if (!winner) return "";
  var theme = state.theme;
  var fl = theme === "lounge"
    ? svgCornerFlourishFixed(0, "top:8px;left:8px", 20) + svgCornerFlourishFixed(90, "top:8px;right:8px", 20) + svgCornerFlourishFixed(180, "bottom:8px;right:8px", 20) + svgCornerFlourishFixed(270, "bottom:8px;left:8px", 20) : "";
  return '<div class="overlayBg" data-key="roundend">' + confettiHtml() + '<div class="overlayCard pop">' + fl +
    '<button class="undoLink" ' + btnAttr("undo") + '>↶ Annuler (fausse manœuvre)</button>' +
    avatarHtml(theme, winner.ball, 64) +
    '<h2 class="overlayTitle">' + escapeHtml(winner.name) + ' remporte la manche ' + state.round + '</h2>' +
    '<p class="lead">Envie d\'ajouter une règle pour la prochaine manche ? (facultatif)</p>' +
    renderRulePresetPicker("roundend") +
    '<input class="input" style="width:100%" data-bind="ruleInput" value="' + escapeHtml(ui.ruleInput) + '" placeholder="Ex : la 7 fait passer son tour" maxlength="120" enterkeyhint="done" autocomplete="off"/>' +
    '<button class="primaryBtn" style="margin-top:16px" ' + btnAttr("next-round") + '>Manche suivante</button>' +
    '<button class="linkBtn" ' + btnAttr("end-session-round") + '>Terminer la soirée</button></div></div>';
}

function renderFinalScreen() {
  var theme = state.theme;
  var sorted = state.players.slice().sort(function (a, b) { return b.wins - a.wins; });
  var rows = sorted.map(function (p, i) {
    return '<li class="finalRow" data-key="fr-' + p.id + '"><span class="finalRank">' + (i + 1) + '</span>' + avatarHtml(theme, p.ball, 34) +
      '<span class="gameRowName">' + escapeHtml(p.name) + '</span><span class="finalWins">' + plural(p.wins, "manche", "manches") + '</span></li>';
  }).join("");
  var rulesBlock = state.rules.length > 0
    ? '<div class="rulesPanel" style="margin-top:18px"><span class="rulesPanelTitle">Règles inventées ce soir</span><ul class="rulesList">' +
      state.rules.map(function (r) { return '<li class="rulesListItem"><span class="ruleRoundTag">M' + r.round + '</span> ' + escapeHtml(r.text) + '</li>'; }).join("") + '</ul></div>' : "";
  return '<div class="savedNote">✓ Soirée enregistrée dans « Les soirées »</div>' +
    '<h2 class="overlayTitle">Classement final</h2><ul class="finalList">' + rows + '</ul>' + rulesBlock +
    '<button class="primaryBtn" style="margin-top:22px" ' + btnAttr("share-final") + '>' + (ui.shared ? "Copié !" : "Partager le résumé") + '</button>' +
    '<button class="secondaryBtn" ' + btnAttr("export-data") + '>Sauvegarder toutes mes données (fichier)</button>' +
    '<button class="secondaryBtn" ' + btnAttr("undo") + '>↶ Reprendre la soirée</button>' +
    '<button class="primaryBtnSmall" style="margin-top:10px;width:100%" ' + btnAttr("new-game") + '>Nouvelle partie</button>';
}

/* ---- Légendes ---- */
function favoriteCardFor(name) {
  var picks = stats.cardPicks[name];
  if (!picks) return null;
  var sp = Object.keys(picks).map(function (k) { return [Number(k), picks[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
  return sp.length ? sp[0][0] : null;
}

function renderWantedPoster(rank, name, wins, favNumber, theme) {
  var tilt = rank % 2 === 0 ? -2 : 2;
  var crown = rank === 1 ? '<span class="posterCrown">★ Roi du Billard</span>' : "";
  var portrait = theme === "lounge"
    ? (favNumber != null ? cardArtHtml(favNumber, null, false) : "")
    : (favNumber != null ? '<div class="posterBall">' + svgBall(favNumber, 58) + '</div>' : "");
  return '<div class="posterCard" data-key="poster-' + escapeHtml(name) + '" style="transform:rotate(' + tilt + 'deg)"><span class="posterPin"></span>' + crown +
    '<div class="posterRule"></div><p class="posterHeading">Wanted</p><div class="posterRule"></div>' +
    '<div class="posterPortrait">' + portrait + '</div><p class="posterName">' + escapeHtml(name) + '</p>' +
    '<div class="posterBounty"><span class="posterBountyNum">' + wins + '</span><span class="posterBountyLabel">manche' + (wins > 1 ? "s" : "") + ' gagnée' + (wins > 1 ? "s" : "") + '</span></div></div>';
}

function renderMur() {
  var entries = Object.keys(stats.roundWins || {}).map(function (k) { return [k, stats.roundWins[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
  var body = entries.length === 0
    ? '<p class="hint">Personne n\'a encore gagné de manche. Reviens après une soirée !</p>'
    : '<div class="posterGrid">' + entries.map(function (e, i) { return renderWantedPoster(i + 1, e[0], e[1], favoriteCardFor(e[0]), state.theme); }).join("") + '</div>';
  var reset = "";
  if (entries.length > 0) {
    reset = ui.confirmingReset
      ? '<div class="confirmRow"><p class="hint">Effacer tout le classement ? Cette action est définitive (l\'historique des soirées est conservé).</p>' +
        '<div class="rowBtns"><button class="dangerBtn" ' + btnAttr("confirm-reset-stats") + '>Oui, effacer</button><button class="ghostBtn" ' + btnAttr("cancel-reset-stats") + '>Annuler</button></div></div>'
      : '<button class="linkBtn" ' + btnAttr("ask-reset-stats") + '>Réinitialiser le classement</button>';
  }
  return body + reset;
}

function renderSoirees() {
  var list = db.history.slice().sort(function (a, b) { return (b.startedAt || 0) - (a.startedAt || 0); });
  if (!list.length) return '<p class="hint">Aucune soirée enregistrée pour l\'instant. Chaque soirée jouée apparaîtra ici automatiquement, même si tu oublies de la terminer.</p>';
  var totalRounds = 0;
  list.forEach(function (h) { totalRounds += h.rounds || 0; });
  var head = '<div class="statTiles"><div class="statTile"><b>' + list.length + '</b><span>soirée' + (list.length > 1 ? "s" : "") + '</span></div><div class="statTile"><b>' + totalRounds + '</b><span>manche' + (totalRounds > 1 ? "s" : "") + '</span></div></div>';
  var cards = list.map(function (h) {
    var ranked = h.players.slice().sort(function (a, b) { return b.wins - a.wins; });
    var top = ranked[0] && ranked[0].wins > 0 ? ranked[0] : null;
    var live = h.id === state.soireeId && state.phase !== "finished" && state.phase !== "setup";
    var badge = live ? '<span class="badge live">En cours</span>' : (!h.finished ? '<span class="badge">Non terminée</span>' : "");
    var open = ui.expandedSoiree === h.id;
    var detail = "";
    if (open) {
      detail = '<div class="soireeDetail"><ul class="finalList">' + ranked.map(function (p, i) {
        return '<li class="finalRow"><span class="finalRank">' + (i + 1) + '</span><span class="gameRowName">' + escapeHtml(p.name) + '</span><span class="finalWins">' + plural(p.wins, "manche", "manches") + '</span></li>';
      }).join("") + '</ul>' +
        (h.rules && h.rules.length ? '<p class="miniTitle">Règles de la soirée</p><ul class="rulesList">' + h.rules.map(function (r) { return '<li class="rulesListItem"><span class="ruleRoundTag">M' + r.round + '</span> ' + escapeHtml(r.text) + '</li>'; }).join("") + '</ul>' : "") +
        (ui.confirmDeleteSoiree === h.id
          ? '<div class="confirmRow"><p class="hint">Supprimer cette soirée de l\'historique ? Le Mur des Légendes ne change pas.</p><div class="rowBtns"><button class="dangerBtn" ' + btnAttr("confirm-delete-soiree", 'data-id="' + h.id + '"') + '>Oui, supprimer</button><button class="ghostBtn" ' + btnAttr("cancel-delete-soiree") + '>Annuler</button></div></div>'
          : '<button class="linkBtn" ' + btnAttr("ask-delete-soiree", 'data-id="' + h.id + '"') + '>Supprimer cette soirée</button>') + '</div>';
    }
    return '<div class="soireeCard' + (open ? " open" : "") + '" data-key="soiree-' + h.id + '"><button class="soireeHead" ' + btnAttr("toggle-soiree", 'data-id="' + h.id + '"') + '>' +
      '<span class="soireeDate">' + escapeHtml(fmtDate(h.startedAt)) + badge + '</span>' +
      '<span class="soireeSub">' + plural(h.players.length, "joueur", "joueurs") + ' · ' + plural(h.rounds || 0, "manche", "manches") + '</span>' +
      '<span class="soireeWinner">' + (top ? "♛ " + escapeHtml(top.name) + " · " + top.wins : "Pas de vainqueur") + '</span></button>' + detail + '</div>';
  }).join("");
  return head + '<div class="soireeList">' + cards + '</div>';
}

function renderWantedScreen() {
  return '<h2 class="pageTitle">Le Mur des Légendes</h2>' +
    '<div class="seg"><button class="segBtn' + (ui.legendsTab === "mur" ? " active" : "") + '" ' + btnAttr("set-legends-tab", 'data-tab="mur"') + '>Le Mur</button>' +
    '<button class="segBtn' + (ui.legendsTab === "soirees" ? " active" : "") + '" ' + btnAttr("set-legends-tab", 'data-tab="soirees"') + '>Les soirées</button></div>' +
    (ui.legendsTab === "mur" ? '<p class="lead">Le classement cumulé sur toutes vos soirées.</p>' + renderMur() : renderSoirees());
}

/* ---- Livre, aide, réglages ---- */
function renderRulebookScreen() {
  var rows;
  if (rulebook.length === 0) rows = '<p class="hint">Aucune règle enregistrée pour l\'instant.</p>';
  else rows = '<ul class="rulesList">' + rulebook.map(function (r) {
    if (ui.editingRulebookId === r.id) {
      return '<li class="rulebookRow" data-key="rb-' + r.id + '" style="flex-direction:column;align-items:stretch"><div class="inputRow"><input class="input" data-bind="editRulebookText" value="' + escapeHtml(ui.editRulebookText) + '" maxlength="120" enterkeyhint="done" autocomplete="off"/>' +
        '<button class="primaryBtnSmall" ' + btnAttr("save-rulebook-edit", 'data-id="' + r.id + '"') + '>OK</button></div></li>';
    }
    return '<li class="rulebookRow" data-key="rb-' + r.id + '"><span class="rulebookText">' + escapeHtml(r.text) + '</span><div class="rulebookActions">' +
      '<button class="iconBtn" ' + btnAttr("edit-rulebook", 'data-id="' + r.id + '" aria-label="Modifier"') + '>✎</button>' +
      '<button class="iconBtn" ' + btnAttr("delete-rulebook", 'data-id="' + r.id + '" aria-label="Supprimer"') + '>✕</button></div></li>';
  }).join("") + '</ul>';
  return '<h2 class="pageTitle">Le Grand Livre des Règles</h2><p class="lead">Toutes les règles maison inventées depuis le début, soirée après soirée.</p>' +
    '<div class="inputRow bookAdd"><input class="input" data-bind="bookInput" value="' + escapeHtml(ui.bookInput) + '" placeholder="Ajouter une règle au livre" maxlength="120" enterkeyhint="done" autocomplete="off"/>' +
    '<button class="primaryBtnSmall" ' + btnAttr("add-book-rule") + '>Ajouter</button></div>' + rows;
}

function howToSection(title, text) {
  return '<div class="howToSection"><h3 class="howToHeading">' + title + '</h3><p class="howToText">' + text + '</p></div>';
}
function renderHowToScreen() {
  return '<h2 class="pageTitle">Comment jouer au Killer</h2>' +
    howToSection("Pour commencer", "Entrez les joueurs, puis chacun reçoit une carte qui l'identifie pour toute la soirée. Tout le monde démarre chaque manche avec 3 vies.") +
    howToSection("Qui joue ?", "Les cartes déterminent l'ordre : on en tire une au hasard parmi celles encore face cachée, et c'est à cette personne de jouer. Chacun passe une fois par tour ; une fois que tout le monde a joué, un nouveau tour commence et on peut retomber sur soi-même juste après.") +
    howToSection("La règle du jeu", "Peu importe les couleurs, les rayées ou les numéros : le seul objectif est de rentrer au moins une boule à son tour. Si vous n'en rentrez aucune, vous perdez une vie.") +
    howToSection("La casse", "Le premier joueur tiré casse. S'il ne rentre aucune boule sur la casse, il a le droit de rejouer immédiatement.") +
    howToSection("La boule 8", "Rentrer la 8 fait gagner une vie bonus. Si toutes les boules sont rentrées avant qu'il y ait un vainqueur, on remet les boules en place avec une nouvelle 8 en jeu, et la manche continue.") +
    howToSection("Fin de la manche", "Un joueur à 0 vie est éliminé pour le reste de la manche. Dès qu'il ne reste qu'un seul joueur avec des vies, il remporte la manche.") +
    howToSection("Les règles maison", "Le gagnant de la manche peut inventer une nouvelle règle, qui s'applique à partir de la manche suivante et reste valable pour le reste de la soirée. Toutes les vies repassent à 3 pour la nouvelle manche, mais les cartes et les règles restent les mêmes jusqu'à la fin de la soirée.") +
    howToSection("Une erreur ?", "Le bouton « Annuler » remet la partie comme avant le dernier geste (vie, carte, fin de manche, fin de soirée). Un joueur éliminé par erreur peut aussi être réintégré avec 1 vie, et il rejoint le tirage des cartes.");
}

function toggleHtml(setting, label, hint) {
  var on = db.settings[setting] !== false;
  return '<div class="setRow"><div><div class="setLabel">' + label + '</div>' + (hint ? '<div class="setHint">' + hint + '</div>' : "") + '</div>' +
    '<button class="toggle' + (on ? " on" : "") + '" role="switch" aria-checked="' + on + '" ' + btnAttr("toggle-setting", 'data-setting="' + setting + '"') + '><span></span></button></div>';
}

function renderSettingsScreen() {
  var d = daysSince(db.settings.lastExportAt);
  var exportLine = d === null ? "jamais" : (d === 0 ? "aujourd'hui" : "il y a " + plural(d, "jour", "jours"));
  var persisted = storageStatus.persisted === true ? "oui" : (storageStatus.persisted === false ? "non demandé par le navigateur" : "inconnu");
  var backups = readBackups().map(function (b, i) { return { b: b, i: i }; }).reverse().map(function (x) {
    var dd = x.b.data || {};
    return '<div class="setRow"><div><div class="setLabel">' + escapeHtml(fmtDateTime(x.b.at)) + ' · ' + escapeHtml(x.b.reason || "auto") + '</div><div class="setHint">' +
      plural((dd.history || []).length, "soirée", "soirées") + ' · ' + plural((dd.rulebook || []).length, "règle", "règles") + '</div></div>' +
      '<button class="ghostBtn" ' + btnAttr("ask-restore", 'data-index="' + x.i + '"') + '>Restaurer</button></div>';
  }).join("");
  var known = knownPlayerNames();
  var knownHtml = known.length ? '<div class="chips">' + known.map(function (n) {
    return '<span class="chip static" data-key="kn-' + escapeHtml(n) + '">' + escapeHtml(n) + ' <button class="chipX" ' + btnAttr("forget-player", 'data-name="' + escapeHtml(n) + '" aria-label="Oublier ' + escapeHtml(n) + '"') + '>✕</button></span>';
  }).join("") + '</div>' : '<p class="setHint">Les prénoms que tu utilises apparaîtront ici et s\'ajouteront en un tap.</p>';
  var counts = plural(db.history.length, "soirée", "soirées") + ' · ' + plural(db.rulebook.length, "règle", "règles") + ' · ' + plural(Object.keys(stats.roundWins).length, "joueur", "joueurs") + ' au Mur';
  var install = !isStandalone()
    ? '<div class="howToSection"><h3 class="howToHeading">Installer l\'appli</h3><p class="howToText">Safari → bouton Partager → « Sur l\'écran d\'accueil ». Ouvre ensuite toujours l\'appli par son icône : elle garde ses propres données, séparées de celles de Safari.</p></div>' : "";
  return '<h2 class="pageTitle">Réglages</h2>' + install +
    '<div class="howToSection"><h3 class="howToHeading">Confort</h3>' + toggleHtml("sound", "Sons", "Coup de feu à chaque carte") + toggleHtml("haptics", "Vibrations", "Retour tactile") + toggleHtml("wakeLock", "Écran toujours allumé", "Pendant une partie") + '</div>' +
    '<div class="howToSection"><h3 class="howToHeading">Mes données</h3>' +
    '<p class="howToText">Tout est enregistré automatiquement sur cet appareil : ' + counts + '.</p>' +
    '<p class="setHint">Dernier fichier de sauvegarde : <b>' + exportLine + '</b> · Stockage durable : ' + persisted + (storageStatus.localOk ? "" : ' · <b class="bad">écriture impossible</b>') + '</p>' +
    '<button class="primaryBtn" style="margin-top:12px" ' + btnAttr("export-data") + '>Exporter une sauvegarde (fichier)</button>' +
    '<div class="rowBtns two"><button class="secondaryBtn" ' + btnAttr("copy-backup") + '>Copier le code</button>' +
    '<label class="secondaryBtn fileBtn">Importer un fichier<input type="file" data-file-import accept=".json,application/json,text/plain"/></label></div>' +
    '<button class="linkBtn" ' + btnAttr("toggle-import-text") + '>' + (ui.importOpen ? "Masquer" : "Coller un code de sauvegarde") + '</button>' +
    (ui.importOpen ? '<textarea class="input importArea" data-bind="importText" placeholder="Colle ici le code copié">' + escapeHtml(ui.importText) + '</textarea><button class="secondaryBtn" ' + btnAttr("import-text") + '>Importer ce code</button>' : "") +
    (ui.notice ? '<p class="notice">' + escapeHtml(ui.notice) + '</p>' : "") + '</div>' +
    '<div class="howToSection"><h3 class="howToHeading">Sauvegardes automatiques</h3>' + (backups || '<p class="setHint">La première sera créée à la fin de ta prochaine soirée.</p>') + '</div>' +
    '<div class="howToSection"><h3 class="howToHeading">Joueurs habituels</h3>' + knownHtml + '</div>' +
    '<div class="howToSection"><h3 class="howToHeading">Langue</h3><div class="rowBtns"><button class="themeToggleBtn active">Français</button><button class="themeToggleBtn" style="opacity:.4" disabled>English (bientôt)</button></div></div>' +
    '<p class="hint center">Killer v' + APP_VERSION + '</p>';
}

/* ---- Navigation & assemblage ---- */
function renderBottomNav() {
  var items = [["play", "Jouer", svgIconCues], ["wanted", "Légendes", null], ["rulebook", "Le Livre", svgIconBook], ["howto", "Aide", svgIconSearch], ["settings", "Réglages", svgIconGear]];
  return '<nav class="bottomNav" data-key="nav">' + items.map(function (it) {
    var active = ui.activeTab === it[0];
    var color = active ? "#C9A24A" : "#C9B98F";
    if (state.theme === "classic") color = active ? "#CC9E3F" : "#CFC3A6";
    var icon = it[0] === "wanted" ? svgStar(20, 1, color) : it[2](20, color);
    return '<button class="bottomNavBtn' + (active ? " active" : "") + '" ' + btnAttr("set-tab", 'data-tab="' + it[0] + '"') + '>' + icon + '<span class="bottomNavLabel">' + it[1] + '</span></button>';
  }).join("") + '</nav>';
}

function renderModal() {
  var m = ui.modal;
  if (!m) return "";
  var inner = "";
  if (m.kind === "import") {
    var s = m.parsed.summary;
    inner = '<h3 class="modalTitle">Remplacer les données de cet appareil ?</h3><p class="howToText">Cette sauvegarde contient ' + plural(s.soirees, "soirée", "soirées") + ', ' + plural(s.regles, "règle", "règles") + ' et ' + plural(s.joueurs, "joueur", "joueurs") + ' au Mur' +
      (s.date ? " (exportée le " + escapeHtml(fmtDate(s.date)) + ")" : "") + '. Une copie de tes données actuelles est gardée dans les sauvegardes automatiques.</p>' +
      '<div class="rowBtns"><button class="primaryBtnSmall" ' + btnAttr("confirm-import") + '>Remplacer</button><button class="ghostBtn" ' + btnAttr("close-modal") + '>Annuler</button></div>';
  } else if (m.kind === "restore") {
    var b = readBackups()[m.index];
    if (!b) return "";
    inner = '<h3 class="modalTitle">Restaurer cette sauvegarde ?</h3><p class="howToText">Données du ' + escapeHtml(fmtDateTime(b.at)) + '. Tes données actuelles sont d\'abord mises de côté.</p>' +
      '<div class="rowBtns"><button class="primaryBtnSmall" ' + btnAttr("confirm-restore", 'data-index="' + m.index + '"') + '>Restaurer</button><button class="ghostBtn" ' + btnAttr("close-modal") + '>Annuler</button></div>';
  } else if (m.kind === "message") {
    inner = '<h3 class="modalTitle">' + escapeHtml(m.title) + '</h3><p class="howToText">' + escapeHtml(m.text) + '</p><div class="rowBtns"><button class="primaryBtnSmall" ' + btnAttr("close-modal") + '>OK</button></div>';
  }
  return '<div class="overlayBg modalBg" data-key="modal"><div class="overlayCard pop">' + inner + '</div></div>';
}

function screenId() {
  if (ui.activeTab !== "play") return ui.activeTab + (ui.activeTab === "wanted" ? "-" + ui.legendsTab : "");
  var ph = state.phase === "roundEnd" ? "game" : state.phase;
  return "play-" + ph;
}

function buildApp() {
  var isLounge = state.theme === "lounge";
  var kingEntries = Object.keys(stats.roundWins || {}).map(function (k) { return [k, stats.roundWins[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
  var kingName = kingEntries.length > 0 ? kingEntries[0][0] : null;

  var body = "";
  if (ui.activeTab === "wanted") body = renderWantedScreen();
  else if (ui.activeTab === "rulebook") body = renderRulebookScreen();
  else if (ui.activeTab === "howto") body = renderHowToScreen();
  else if (ui.activeTab === "settings") body = renderSettingsScreen();
  else {
    if (state.phase === "setup") body = renderSetup();
    else if (state.phase === "dealing") body = isLounge ? renderDealingLounge() : renderDealingClassic();
    else if (state.phase === "game" || state.phase === "roundEnd") {
      body = (ui.rulesOpen ? renderRulesPanel() : "") + renderGameScreen(state.phase === "roundEnd") + (state.phase === "roundEnd" ? renderRoundEndOverlay() : "");
    } else if (state.phase === "finished") body = renderFinalScreen();
  }

  var corners = isLounge ? '<div data-key="corners">' + svgCornerFlourishFixed(0, "top:6px;left:6px") + svgCornerFlourishFixed(90, "top:6px;right:6px") + svgCornerFlourishFixed(180, "bottom:6px;right:6px") + svgCornerFlourishFixed(270, "bottom:6px;left:6px") + '</div>' : "";
  var themeToggle = ui.activeTab === "play"
    ? '<div class="themeToggleRow" data-key="themes"><button class="themeToggleBtn' + (isLounge ? " active" : "") + '" ' + btnAttr("set-theme", 'data-theme-value="lounge"') + '>Salon</button>' +
      '<button class="themeToggleBtn' + (!isLounge ? " active" : "") + '" ' + btnAttr("set-theme", 'data-theme-value="classic"') + '>Classique</button></div>' : "";
  var footer = isLounge && ui.activeTab === "play" && state.phase !== "dealing"
    ? '<div class="westernFooter" data-key="footer"><div class="westernFooterRule"></div><div class="westernFooterRow">' + svgHorseshoe() + svgStar() + svgCuesEmblem(30, 0.55) + svgStar() + svgHorseshoe() + '</div></div>' : "";
  var rail = !isLounge ? '<div class="rail" data-key="rail-top"></div>' : "";
  var railB = !isLounge ? '<div class="rail" data-key="rail-bottom"></div>' : "";

  return rail + '<div class="felt" data-key="felt">' + corners + themeToggle + renderHeader(kingName) +
    '<main class="screen" data-key="screen-' + screenId() + '">' + body + '</main>' + footer + '</div>' + renderBottomNav() + railB + renderModal();
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
  el.innerHTML = "<span>" + escapeHtml(msg) + "</span>" + (withUndo ? '<button class="toastBtn" data-action="undo">Annuler</button>' : "");
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

function render() {
  var host = document.getElementById("app");
  document.documentElement.setAttribute("data-theme", state.theme);
  morphInto(host, buildApp());
  var sid = screenId();
  if (sid !== lastScreenId) { lastScreenId = sid; try { window.scrollTo(0, 0); } catch (e) {} }
  var overlay = ui.modal || (ui.activeTab === "play" && (state.phase === "roundEnd" || (state.phase === "dealing" && state.dealingRevealNumber)));
  document.body.classList.toggle("noscroll", !!overlay);
  checkTourProgress();
  syncWakeLock();
}

function focusName() { var el = document.getElementById("nameInputField"); if (el) { try { el.focus(); } catch (e) {} } }

/* ---- Partage du résumé de soirée ---- */
function shareFinal() {
  var sorted = state.players.slice().sort(function (a, b) { return b.wins - a.wins; });
  var lines = sorted.map(function (p, i) { return (i + 1) + ". " + p.name + " — " + p.wins + " manche" + (p.wins > 1 ? "s" : ""); });
  var ruleLines = state.rules.map(function (r) { return "• " + r.text; });
  var text = "Killer — résultats de la soirée\n\n" + lines.join("\n") + (ruleLines.length ? "\n\nRègles inventées :\n" + ruleLines.join("\n") : "");
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
  if (r === "shared") toast("Sauvegarde envoyée ✓");
  else if (r === "downloaded") toast("Fichier de sauvegarde téléchargé ✓");
  else if (r === "copied") toast("Code de sauvegarde copié ✓");
  else if (r === "failed") toast("Export impossible sur ce navigateur");
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
  var action = el.getAttribute("data-action");
  if (!action || action === "noop" || el.disabled) return;
  var id = el.getAttribute("data-id");
  switch (action) {
    case "set-tab": ui.activeTab = el.getAttribute("data-tab"); ui.confirmingReset = false; ui.notice = null; break;
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
    case "next-round": addRule(); nextRound(); break;
    case "end-session": endSession(); break;
    case "end-session-round": addRule(); endSession(); break;
    case "new-game": newGame(); break;
    case "undo": undoLast(); break;
    case "share-final": shareFinal(); return;
    case "export-data": exportData().then(handleExportResult); return;
    case "copy-backup": copyBackupText().then(function (ok) { toast(ok ? "Code de sauvegarde copié ✓" : "Copie impossible : utilise l'export fichier"); render(); }); return;
    case "toggle-import-text": ui.importOpen = !ui.importOpen; break;
    case "import-text": startImport(ui.importText); return;
    case "confirm-import":
      if (ui.modal && ui.modal.parsed) { applyImport(ui.modal.parsed); toast("Sauvegarde importée ✓"); }
      ui.modal = null; ui.importText = ""; ui.importOpen = false; ui.notice = null; break;
    case "ask-restore": ui.modal = { kind: "restore", index: Number(el.getAttribute("data-index")) }; break;
    case "confirm-restore":
      if (restoreBackup(Number(el.getAttribute("data-index")))) toast("Sauvegarde restaurée ✓");
      ui.modal = null; break;
    case "close-modal": ui.modal = null; break;
    case "toggle-setting": var k = el.getAttribute("data-setting"); db.settings[k] = db.settings[k] === false; persist(); break;
    case "forget-player": delete db.players[el.getAttribute("data-name")]; persist(); break;
    case "toggle-soiree": ui.expandedSoiree = ui.expandedSoiree === id ? null : id; ui.confirmDeleteSoiree = null; break;
    case "ask-delete-soiree": ui.confirmDeleteSoiree = id; break;
    case "cancel-delete-soiree": ui.confirmDeleteSoiree = null; break;
    case "confirm-delete-soiree":
      db.history = db.history.filter(function (h) { return h.id !== id; });
      ui.confirmDeleteSoiree = null; ui.expandedSoiree = null; persist(); toast("Soirée supprimée"); break;
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
    case "pick-preset": ui.ruleInput = RULE_PRESETS[Number(el.getAttribute("data-preset-idx"))]; ui.presetOpen = null; break;
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
    if (f.text) f.text().then(done).catch(function () { ui.notice = "Lecture du fichier impossible."; render(); });
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
      toast("Données récupérées ✓");
    }
  }).catch(function () { if (corruptAtBoot) restoreFromLatestBackup(); });
}
function restoreFromLatestBackup() {
  var list = readBackups();
  if (!list.length || hasMeaningfulData()) return;
  var b = list[list.length - 1];
  db = normalizeDb(b.data); db.session = repairSession(db.session); db.undo = []; bindDb(); persist(); render();
  ui.modal = { kind: "message", title: "Données restaurées", text: "Le fichier principal était illisible. On a restauré la sauvegarde automatique du " + fmtDateTime(b.at) + "." };
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

  if (loaded && loaded.source === "legacy") { persist(); setTimeout(function () { toast("Données de la V1 reprises ✓"); }, 400); }
  render();
  requestPersistentStorage();
  maybeAutoBackup();
  adoptFromIdb();

  try {
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    }
  } catch (e) {}
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();

})();
