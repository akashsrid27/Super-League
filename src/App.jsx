import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Trophy, Hammer, Users, Search, Plus, RotateCcw, Wallet,
  Pencil, X, Check, ShieldCheck, ListRestart, ChevronRight, ChevronDown,
  Undo2, PlayCircle, Trash2, ArrowRightLeft, PartyPopper, AlertTriangle,
  Calendar, Shuffle, Layers
} from "lucide-react";

/* ============================================================
   SUPER LEAGUE — AUCTION HOUSE
   Design tokens
   bg:      #0A1F17  (pitch night)
   panel:   #122A20
   panel-2: #173428
   line:    #2E5744  (turf line / borders)
   chalk:   #F3F1E7  (primary text)
   gold:    #D8A657  (money / elite)
   live:    #E8542E  (live bid pulse)
   silver:  #9FB3A8  (muted text)
   ============================================================ */

const C = {
  bg: "#0A1F17",
  panel: "#12291F",
  panel2: "#173428",
  line: "#28503D",
  lineSoft: "#1C3A2C",
  chalk: "#F3F1E7",
  gold: "#D8A657",
  goldSoft: "#8A6F3E",
  live: "#E8542E",
  silver: "#9FB3A8",
  silverDim: "#5E7A6D",
};

/* ---------------- Player data ----------------
   Sourced directly from the uploaded SUPER_LEAGUE.xlsx workbook.
   Auction order follows the sheet order below (GK Set 1 first),
   using each sheet purely as an ordered list of players + positions —
   base prices are computed by our own rating tiers, not the sheet's
   BASE PRICE column. */
// [name, rating, pos]
const SET_DATA = [
  { set: "GK Set 1", players: [
    ["Gianluigi Donnarumma",89,"GK"],
    ["Alisson",89,"GK"],
    ["Thibaut Courtois",89,"GK"],
    ["Jan Oblak",88,"GK"],
    ["Yann Sommer",87,"GK"],
    ["Mike Maignan",87,"GK"],
    ["David Raya",87,"GK"],
    ["Marc-André ter Stegen",86,"GK"],
    ["Gregor Kobel",86,"GK"],
    ["Ederson",85,"GK"],
  ]},
  { set: "Marquee Player List", players: [
    ["Mohamed Salah",91,"RM"],
    ["Kylian Mbappé",91,"ST"],
    ["Ousmane Dembélé",90,"ST"],
    ["Rodri",90,"CDM"],
    ["Virgil van Dijk",90,"CB"],
    ["Jude Bellingham",90,"CAM"],
    ["Erling Haaland",90,"ST"],
    ["Raphinha",89,"LM"],
    ["Achraf Hakimi",89,"RB"],
    ["Lamine Yamal",89,"RM"],
    ["Vitinha",89,"CM"],
    ["Pedri",89,"CM"],
    ["Joshua Kimmich",89,"CDM"],
    ["Harry Kane",89,"ST"],
    ["Federico Valverde",89,"CM"],
    ["Vini Jr.",89,"LW"],
    ["Florian Wirtz",89,"CAM"],
  ]},
  { set: "Defenders Set 1", players: [
    ["Gabriel",88,"CB"],
    ["Marquinhos",87,"CB"],
    ["Alessandro Bastoni",87,"CB"],
    ["William Saliba",87,"CB"],
    ["Jonathan Tah",87,"CB"],
    ["Rúben Dias",86,"CB"],
    ["Ibrahima Konaté",86,"CB"],
    ["Willian Pacho",86,"CB"],
    ["Antonio Rüdiger",86,"CB"],
    ["Bremer",85,"CB"],
    ["Iñigo Martínez",85,"CB"],
    ["Nico Schlotterbeck",85,"CB"],
    ["Dayot Upamecano",85,"CB"],
  ]},
  { set: "Strikers Set 1", players: [
    ["Alexander Isak",88,"ST"],
    ["Robert Lewandowski",88,"ST"],
    ["Lautaro Martínez",88,"ST"],
    ["Julián Alvarez",87,"ST"],
    ["Serhou Guirassy",87,"ST"],
    ["Viktor Gyökeres",87,"ST"],
    ["Victor Osimhen",87,"ST"],
    ["Karim Benzema",85,"ST"],
    ["Cristiano Ronaldo",85,"ST"],
    ["Antoine Griezmann",85,"ST"],
    ["Patrik Schick",85,"ST"],
    ["Marcus Thuram",85,"ST"],
  ]},
  { set: "Wingbacks & Fullbacks Set 1", players: [
    ["Jules Koundé",87,"RB"],
    ["Trent Alexander-Arnold",86,"RB"],
    ["Nuno Mendes",86,"LB"],
    ["Carvajal",85,"RB"],
    ["Federico Dimarco",85,"LB"],
    ["João Cancelo",84,"RB"],
    ["Marc Cucurella",84,"LB"],
    ["Alphonso Davies",84,"LB"],
    ["Denzel Dumfries",84,"RB"],
    ["Joško Gvardiol",84,"LB"],
    ["Theo Hernández",84,"LB"],
    ["Marcos Llorente",84,"RB"],
    ["Balde",83,"LB"],
    ["Giovanni Di Lorenzo",83,"RB"],
    ["Jeremie Frimpong",83,"RB"],
    ["Benjamin White",83,"RB"],
  ]},
  { set: "MidFielders Set 1", players: [
    ["Jamal Musiala",88,"CAM"],
    ["Nicolò Barella",87,"CM"],
    ["Bruno Fernandes",87,"CAM"],
    ["Moisés Caicedo",87,"CDM"],
    ["Kevin De Bruyne",87,"CM"],
    ["Frenkie de Jong",87,"CM"],
    ["Alexis Mac Allister",87,"CM"],
    ["Martin Ødegaard",87,"CM"],
    ["Cole Palmer",87,"CAM"],
    ["Declan Rice",87,"CDM"],
    ["Hakan Çalhanoğlu",86,"CDM"],
    ["Paulo Dybala",86,"CAM"],
    ["Bruno Guimarães",86,"CM"],
    ["Michael Olise",86,"RM"],
    ["Tijjani Reijnders",86,"CM"],
    ["Sandro Tonali",86,"CDM"],
    ["Nico Williams",86,"LM"],
    ["Luis Díaz",85,"LM"],
    ["João Neves",85,"CM"],
    ["Ryan Gravenberch",85,"CDM"],
    ["N'Golo Kanté",85,"CDM"],
    ["Scott McTominay",85,"CM"],
    ["Dani Olmo",85,"CAM"],
    ["Fabián Ruiz",85,"CM"],
    ["Youri Tielemans",85,"CM"],
    ["Granit Xhaka",85,"CDM"],
  ]},
  { set: "Wingers Set 1", players: [
    ["Bukayo Saka",88,"RW"],
    ["Khvicha Kvaratskhelia",87,"LW"],
    ["Lionel Messi",86,"RW"],
    ["Désiré Doué",85,"RW"],
    ["Phil Foden",85,"RW"],
    ["Bryan Mbeumo",85,"RW"],
    ["Rodrygo",85,"RW"],
    ["Heung Min Son",85,"LW"],
    ["Bradley Barcola",84,"LW"],
    ["Rafael Leão",84,"LW"],
    ["Christian Pulisic",84,"RW"],
    ["Iago Aspas",83,"RW"],
    ["Anthony Gordon",83,"LW"],
    ["Ferran Torres",83,"LW"],
    ["Leandro Trossard",83,"LW"],
  ]},
  { set: "Defenders Set 2", players: [
    ["Francesco Acerbi",84,"CB"],
    ["Stefan de Vrij",84,"CB"],
    ["Willi Orban",84,"CB"],
    ["Benjamin Pavard",84,"CB"],
    ["Éder Militão",84,"CB"],
    ["Vivian",84,"CB"],
    ["José María Giménez",83,"CB"],
    ["Gianluca Mancini",83,"CB"],
    ["Nathan Aké",83,"CB"],
    ["Piero Hincapié",83,"CB"],
    ["Robin Le Normand",83,"CB"],
    ["Nikola Milenković",83,"CB"],
    ["Amir Rrahmani",83,"CB"],
    ["Murillo",83,"CB"],
    ["Dávid Hancko",83,"CB"],
    ["Ronald Araujo",83,"CB"],
    ["Matthias Ginter",82,"CB"],
    ["Waldemar Anton",82,"CB"],
    ["Alessandro Buongiorno",82,"CB"],
    ["Pau Cubarsí",82,"CB"],
    ["Ezri Konsa",82,"CB"],
    ["Alessio Romagnoli",82,"CB"],
    ["Fabian Schär",82,"CB"],
    ["John Stones",82,"CB"],
    ["Sven Botman",82,"CB"],
    ["Marc Guéhi",82,"CB"],
    ["Ibañez",82,"CB"],
    ["Kim Min Jae",82,"CB"],
    ["Robin Koch",82,"CB"],
    ["Aymeric Laporte",82,"CB"],
    ["Nicolás Otamendi",82,"CB"],
    ["Cristian Romero",82,"CB"],
    ["Manuel Akanji",82,"CB"],
    ["David Alaba",82,"CB"],
    ["Emre Can",82,"CB"],
    ["Matthijs de Ligt",82,"CB"],
    ["Nacho Fernández",82,"CB"],
    ["Dean Huijsen",82,"CB"],
    ["Kalidou Koulibaly",82,"CB"],
    ["Davinson Sánchez",82,"CB"],
    ["Micky van de Ven",82,"CB"],
  ]},
  { set: "Strikers Set 2", players: [
    ["Ademola Lookman",84,"ST"],
    ["Romelu Lukaku",84,"ST"],
    ["Omar Marmoush",84,"ST"],
    ["Alexander Sørloth",84,"ST"],
    ["Ollie Watkins",84,"ST"],
    ["Artem Dovbyk",83,"ST"],
    ["Hugo Ekitiké",83,"ST"],
    ["Moise Kean",83,"ST"],
    ["Loïs Openda",83,"ST"],
    ["Ayoze",83,"ST"],
    ["Mateo Retegui",83,"ST"],
    ["Ante Budimir",82,"ST"],
    ["Jonathan Burkardt",82,"ST"],
    ["Jonathan David",82,"ST"],
    ["Youssef En-Nesyri",82,"ST"],
    ["Kai Havertz",82,"ST"],
    ["Jean-Philippe Mateta",82,"ST"],
    ["Oyarzabal",82,"ST"],
    ["Vangelis Pavlidis",82,"ST"],
    ["Dušan Vlahović",82,"ST"],
    ["Yoane Wissa",82,"ST"],
    ["Chris Wood",82,"ST"],
    ["Duván Zapata",82,"ST"],
  ]},
  { set: "Wingbacks & Fullbacks Set 2", players: [
    ["Milos Kerkez",82,"LB"],
    ["Konrad Laimer",82,"RB"],
    ["Maximilian Mittelstädt",82,"LB"],
    ["Pedro Porro",82,"RB"],
    ["David Raum",82,"LB"],
    ["Andrew Robertson",82,"LB"],
    ["Antonee Robinson",82,"LB"],
    ["Jurriën Timber",82,"RB"],
    ["Rayan Aït-Nouri",81,"LB"],
    ["Matteo Darmian",81,"RB"],
    ["Gayà",81,"LB"],
    ["Miguel Gutiérrez",81,"LB"],
    ["Reece James",81,"RB"],
    ["Ferland Mendy",81,"LB"],
    ["Daniel Muñoz",81,"RB"],
    ["Carlos Augusto",81,"LB"],
    ["Ola Aina",80,"RB"],
    ["Jonathan Clauss",80,"RB"],
    ["Maxim De Cuyper",80,"LB"],
    ["Lucas Digne",80,"LB"],
    ["Álvaro Carreras",80,"LB"],
    ["Javi Galán",80,"LB"],
    ["Robin Gosens",80,"LB"],
    ["Raphaël Guerreiro",80,"LB"],
    ["Lewis Hall",80,"LB"],
    ["Benjamin Henrichs",80,"RB"],
    ["Tino Livramento",80,"RB"],
    ["Noussair Mazraoui",80,"RB"],
    ["Mingueza",80,"RB"],
    ["Kieran Trippier",80,"RB"],
    ["Destiny Udogie",80,"LB"],
    ["Aaron Wan-Bissaka",80,"RB"],
  ]},
  { set: "MidFielders Set 2", players: [
    ["Isco",84,"CAM"],
    ["Álex Baena",84,"LM"],
    ["Bernardo Silva",84,"CM"],
    ["Rúben Neves",84,"CDM"],
    ["Rodrigo De Paul",84,"CM"],
    ["Moussa Diaby",84,"RM"],
    ["Enzo Fernández",84,"CM"],
    ["Cody Gakpo",84,"LM"],
    ["Grimaldo",84,"LM"],
    ["Manuel Locatelli",84,"CDM"],
    ["James Maddison",84,"CM"],
    ["Riyad Mahrez",84,"RM"],
    ["Sergej Milinković-Savić",84,"CM"],
    ["Exequiel Palacios",84,"CM"],
    ["Sancet",84,"CAM"],
    ["Xavi Simons",84,"CAM"],
    ["Aurélien Tchouaméni",84,"CDM"],
    ["Mattia Zaccagni",84,"LM"],
    ["Jarrod Bowen",83,"RM"],
    ["Julian Brandt",83,"CAM"],
    ["Eduardo Camavinga",83,"CM"],
    ["Matheus Cunha",83,"CAM"],
    ["Kingsley Coman",83,"LM"],
    ["Eberechi Eze",83,"CAM"],
    ["Aleix García",83,"CM"],
    ["İlkay Gündoğan",83,"CM"],
    ["Morten Hjulmand",83,"CDM"],
    ["Boubacar Kamara",83,"CDM"],
    ["Mateo Kovačić",83,"CM"],
    ["Dejan Kulusevski",83,"CM"],
    ["Stanislav Lobotka",83,"CM"],
    ["Sadio Mané",83,"LM"],
    ["Mikel Merino",83,"CM"],
    ["Henrikh Mkhitaryan",83,"CM"],
    ["Luka Modrić",83,"CM"],
    ["Gavi",83,"CM"],
    ["Palhinha",83,"CDM"],
    ["Thomas Partey",83,"CDM"],
    ["Pedro Gonçalves",83,"CAM"],
    ["Adrien Rabiot",83,"CAM"],
    ["Angelo Stiller",83,"CDM"],
    ["Dominik Szoboszlai",83,"CAM"],
    ["Lucas Torreira",83,"CDM"],
    ["Iñaki Williams",83,"RM"],
    ["Zubimendi",83,"CDM"],
    ["Salem Al Dawsari",82,"LM"],
    ["Joelinton",82,"CM"],
    ["Pablo Barrios",82,"CM"],
    ["Álex Berenguer",82,"LM"],
    ["Otávio",82,"CAM"],
    ["Charles De Ketelaere",82,"CAM"],
    ["Brahim",82,"RM"],
    ["Ritsu Doan",82,"RM"],
    ["Éderson",82,"CM"],
    ["Rafa",82,"CAM"],
    ["Morgan Gibbs-White",82,"CAM"],
    ["Serge Gnabry",82,"LM"],
    ["Leon Goretzka",82,"CM"],
    ["Mario Götze",82,"CM"],
    ["Mason Greenwood",82,"RM"],
    ["Mattéo Guendouzi",82,"CDM"],
    ["Fabinho",82,"CDM"],
    ["Pierre-Emile Højbjerg",82,"CDM"],
    ["Orkun Kökçü",82,"CM"],
    ["Takefusa Kubo",82,"RM"],
    ["Giovani Lo Celso",82,"CAM"],
    ["Dodi Lukébakio",82,"RM"],
    ["Kaoru Mitoma",82,"LM"],
    ["Felix Nmecha",82,"CDM"],
    ["Riccardo Orsolini",82,"RM"],
    ["Parejo",82,"CM"],
    ["Morgan Rogers",82,"CAM"],
    ["Leroy Sané",82,"RM"],
    ["Malcom",82,"CAM"],
    ["Malik Tillman",82,"CAM"],
    ["Trincão",82,"CAM"],
    ["Denis Zakaria",82,"CDM"],
    ["André-Franck Zambo Anguissa",82,"CM"],
    ["Karim Adeyemi",81,"RM"],
    ["Nadiem Amiri",81,"CM"],
    ["Robert Andrich",81,"CDM"],
    ["Carlos Baleba",81,"CDM"],
    ["Marcelo Brozović",81,"CDM"],
    ["Dani Ceballos",81,"CM"],
    ["Federico Chiesa",81,"RM"],
    ["Ricardo Horta",81,"CAM"],
    ["Sergi Darder",81,"LM"],
    ["Marten de Roon",81,"CM"],
    ["Johnny Cardoso",81,"CDM"],
    ["Youssouf Fofana",81,"CDM"],
    ["Davide Frattesi",81,"CM"],
    ["Remo Freuler",81,"CDM"],
    ["Conor Gallagher",81,"CM"],
    ["Arda Güler",81,"RM"],
    ["Yangel Herrera",81,"CM"],
    ["Teun Koopmeiners",81,"CAM"],
    ["Filip Kostić",81,"LM"],
    ["Andrej Kramarić",81,"CAM"],
    ["John McGinn",81,"LM"],
    ["Brais Méndez",81,"CM"],
    ["Galeno",81,"LM"],
    ["Christopher Nkunku",81,"CAM"],
    ["Isi",81,"CAM"],
    ["Koke",81,"CM"],
    ["Giuliano Simeone",81,"RM"],
    ["Anderson Talisca",81,"CAM"],
    ["Khéphren Thuram",81,"CM"],
    ["Corentin Tolisso",81,"CM"],
    ["Maghnes Akliouche",80,"RM"],
    ["Elliot Anderson",80,"CDM"],
    ["Benjamin André",80,"CDM"],
    ["Mauro Arambarri",80,"CM"],
    ["Fredrik Aursnes",80,"CM"],
    ["Igor Paixão",80,"LM"],
    ["Ismaël Bennacer",80,"CDM"],
    ["Rodrigo Bentancur",80,"CDM"],
    ["Steven Bergwijn",80,"LM"],
    ["Sergio Busquets",80,"CDM"],
    ["Lucas Paquetá",80,"CM"],
    ["Bryan Cristante",80,"CM"],
    ["Mikkel Damsgaard",80,"CAM"],
    ["Fred",80,"CM"],
    ["Konstantinos Fortounis",80,"CAM"],
    ["Álvaro García",80,"LM"],
    ["Gabriel Sara",80,"CM"],
    ["Vincenzo Grifo",80,"LM"],
    ["Pascal Groß",80,"CDM"],
    ["Franck Honorat",80,"RM"],
    ["Alex Iwobi",80,"LM"],
    ["Curtis Jones",80,"CAM"],
    ["Franck Yannick Kessié",80,"CDM"],
    ["Ruben Loftus-Cheek",80,"CM"],
    ["Pedro Neto",80,"RM"],
    ["Fermín",80,"CAM"],
    ["Florentino",80,"CDM"],
    ["Thomas Müller",80,"CAM"],
    ["Andrey Santos",80,"CM"],
    ["Christian Nørgaard",80,"CDM"],
    ["Mario Pašalić",80,"CM"],
    ["Lorenzo Pellegrini",80,"CAM"],
    ["Nicolas Pépé",80,"RM"],
    ["Yeremy Pino",80,"RM"],
    ["Riqui Puig",80,"CM"],
    ["Marcus Rashford",80,"LM"],
    ["Ruiz de Galarreta",80,"CDM"],
    ["Marcel Sabitzer",80,"CDM"],
    ["Xaver Schlager",80,"CDM"],
    ["Jerdy Schouten",80,"CDM"],
    ["Antoine Semenyo",80,"RM"],
    ["Ellyes Skhiri",80,"CDM"],
    ["Douglas Luiz",80,"CM"],
    ["Georgiy Sudakov",80,"CAM"],
    ["Quinten Timber",80,"CM"],
    ["Christos Tzolis",80,"LM"],
    ["Hans Vanaken",80,"CAM"],
    ["Casemiro",80,"CDM"],
    ["Barış Alper Yılmaz",80,"LM"],
    ["Warren Zaïre-Emery",80,"CM"],
    ["Piotr Zieliński",80,"CM"],
  ]},
  { set: "Wingers Set 2", players: [
    ["Domenico Berardi",82,"RW"],
    ["Ángel Di María",82,"RW"],
    ["Savinho",82,"RW"],
    ["Yannick Carrasco",81,"LW"],
    ["Rayan Cherki",81,"RW"],
    ["Anthony Elanga",81,"RW"],
    ["Gabriel Martinelli",81,"LW"],
    ["Antony",81,"RW"],
    ["Jacob Murphy",81,"RW"],
    ["David Neres",81,"LW"],
    ["Ivan Perišić",81,"RW"],
    ["Matteo Politano",81,"RW"],
    ["Kerem Aktürkoğlu",80,"LW"],
    ["Marco Asensio",80,"RW"],
    ["Harvey Barnes",80,"LW"],
    ["Samuel Chukwueze",80,"RW"],
    ["Jérémy Doku",80,"LW"],
    ["Jack Grealish",80,"LW"],
    ["Mohammed Kudus",80,"RW"],
    ["Noa Lang",80,"LW"],
    ["Armand Laurienté",80,"LW"],
    ["Noni Madueke",80,"RW"],
    ["Jadon Sancho",80,"LW"],
  ]},
  { set: "GK Set 2", players: [
    ["Emiliano Martínez",85,"GK"],
    ["Unai Simón",85,"GK"],
    ["Péter Gulácsi",85,"GK"],
    ["De Gea",85,"GK"],
    ["Jordan Pickford",84,"GK"],
    ["Wojciech Szczęsny",84,"GK"],
    ["Giorgi Mamardashvili",84,"GK"],
    ["Manuel Neuer",84,"GK"],
    ["Diogo Costa",84,"GK"],
    ["Marco Carnesecchi",84,"GK"],
    ["Joan García",83,"GK"],
  ]},
];
function baseFor(rating) {
  if (rating >= 87) return 2000000;
  if (rating >= 84) return 1000000;
  return 500000;
}
function tierFor(rating) {
  if (rating >= 87) return "Elite";
  if (rating >= 84) return "Gold";
  return "Squad";
}

const POS_GROUP = { GK: "GK", LB: "DEF", CB: "DEF", RB: "DEF", CDM: "MID", CM: "MID", CAM: "MID", LM: "MID", RM: "MID", LW: "FWD", RW: "FWD", ST: "FWD", CF: "FWD" };
const SET_ORDER = SET_DATA.map(s => s.set);

function buildPool() {
  const out = [];
  let order = 0;
  SET_DATA.forEach(({ set, players }) => {
    players.forEach(([name, rating, pos]) => {
      out.push({
        id: "p" + order,
        name, rating, pos, set,
        order: order,
        base: baseFor(rating),
        tier: tierFor(rating),
        status: "available", // available | sold | unsold
        ownerId: null,
        price: null,
      });
      order++;
    });
  });
  return out;
}

function nextIncrement(current) {
  if (current < 5000000) return 500000;
  if (current < 15000000) return 1000000;
  return 2000000;
}

function fmt(n) {
  if (n == null) return "—";
  const m = n / 1000000;
  return "$" + (Number.isInteger(m) ? m : m.toFixed(1)) + "M";
}

const MANAGER_COLORS = ["#D8A657","#6FA98C","#C97B63","#7BA0C9","#B98AC9","#C9B25B","#63B0A8","#C97BA0","#8FBF6B","#A88FD8"];

/* ---------------- Round-robin schedule generator ----------------
   Standard circle method: n managers (even) -> n-1 rounds where every
   pair meets once. Mirrored with home/away swapped for the second leg,
   giving 2*(n-1) gameweeks total where every pair meets home & away. */
function generateSchedule(managerIds) {
  const ids = [...managerIds];
  // Fisher-Yates shuffle for randomness
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  const n = ids.length;
  const rounds = [];
  const fixed = ids[0];
  let rotating = ids.slice(1);

  for (let r = 0; r < n - 1; r++) {
    const roundIds = [fixed, ...rotating];
    const matches = [];
    for (let i = 0; i < n / 2; i++) {
      const a = roundIds[i];
      const b = roundIds[n - 1 - i];
      // alternate home/away by round parity so it's not always the same side
      const home = r % 2 === 0 ? a : b;
      const away = r % 2 === 0 ? b : a;
      matches.push({ id: "gw" + r + "m" + i, homeId: home, awayId: away, hg: null, ag: null });
    }
    rounds.push(matches);
    rotating = [rotating[rotating.length - 1], ...rotating.slice(0, rotating.length - 1)];
  }

  // second leg: mirror with home/away reversed
  const secondLeg = rounds.map((round, r) => round.map((m, i) => ({
    id: "gw" + (r + n - 1) + "m" + i, homeId: m.awayId, awayId: m.homeId, hg: null, ag: null,
  })));

  return [...rounds, ...secondLeg];
}

function buildInitial() {
  return {
    players: buildPool(),
    managers: Array.from({ length: 10 }, (_, i) => ({
      id: "m" + i,
      name: "Manager " + (i + 1),
      purse: 100000000,
      squad: [],
      color: MANAGER_COLORS[i],
    })),
    currentPlayerId: null,
    currentBid: null,
    currentBidderId: null,
    log: [],
    history: [], // for undo of sold/pass actions
    schedule: null, // array of gameweeks, each an array of matches
    started: false,
  };
}

/* ---------------- Backend persistence (Netlify Function + Blobs) ----------------
   Replaces the Claude-artifact-only window.storage API with calls to a real
   serverless endpoint, so every device sees the same shared auction state. */
const API_URL = "/api/storage";

async function apiGetState() {
  const res = await fetch(API_URL);
  if (!res.ok) return null;
  const json = await res.json();
  return json && Object.keys(json).length ? json : null;
}
async function apiSetState(next) {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(next),
  });
}

export default function App() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("auction");
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef(null);
  const savingRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const existing = await apiGetState();
        if (existing) {
          setData(existing);
        } else {
          const init = buildInitial();
          setData(init);
          await apiSetState(init);
        }
      } catch (e) {
        const init = buildInitial();
        setData(init);
        try { await apiSetState(init); } catch (e2) {}
      }
      setLoaded(true);
    })();
  }, []);

  const persist = useCallback((next) => {
    setData(next);
    clearTimeout(saveTimer.current);
    savingRef.current = true;
    saveTimer.current = setTimeout(async () => {
      try { await apiSetState(next); } catch (e) {}
      savingRef.current = false;
    }, 150);
  }, []);

  // Light polling so other devices (spectators, other managers) pick up
  // changes the moderator makes without needing a manual refresh.
  useEffect(() => {
    if (!loaded) return;
    const interval = setInterval(async () => {
      if (savingRef.current) return; // don't clobber an in-flight local save
      try {
        const latest = await apiGetState();
        if (latest) {
          setData(prev => JSON.stringify(prev) === JSON.stringify(latest) ? prev : latest);
        }
      } catch (e) {}
    }, 4000);
    return () => clearInterval(interval);
  }, [loaded]);

  if (!loaded || !data) {
    return (
      <div style={{ background: C.bg, color: C.chalk, minHeight: 500, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: C.gold, margin: "0 auto 12px", animation: "pulse 1.2s infinite" }} />
          Loading auction room…
        </div>
      </div>
    );
  }

  const [role, setRole] = useState(null); // null | "admin" | "user"

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sl-auction-role");
      if (saved === "admin" || saved === "user") setRole(saved);
    } catch (e) {}
  }, []);

  const handleLogin = (code) => {
    let r = null;
    if (code === "2703") r = "admin";
    else if (code === "0000") r = "user";
    if (r) {
      setRole(r);
      try { localStorage.setItem("sl-auction-role", r); } catch (e) {}
    }
    return r !== null;
  };

  const handleLogout = () => {
    setRole(null);
    try { localStorage.removeItem("sl-auction-role"); } catch (e) {}
  };

  if (role === null) {
    return (
      <div style={{ background: C.bg, minHeight: "100vh", color: C.chalk, fontFamily: "Inter, system-ui, sans-serif" }}>
        <GlobalStyle />
        <CodeGate onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.chalk, fontFamily: "Inter, system-ui, sans-serif" }}>
      <GlobalStyle />
      <TopBar tab={tab} setTab={setTab} data={data} persist={persist} role={role} onLogout={handleLogout} />
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 16px 60px" }}>
        {tab === "auction" && <AuctionRoom data={data} persist={persist} role={role} />}
        {tab === "squads" && <Squads data={data} />}
        {tab === "pool" && <PlayerPool data={data} persist={persist} role={role} />}
        {tab === "table" && <TournamentTable data={data} persist={persist} role={role} />}
      </div>
    </div>
  );
}

function CodeGate({ onLogin }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    const ok = onLogin(code.trim());
    if (!ok) { setError(true); setCode(""); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div className="popIn" style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: 30, maxWidth: 340, width: "100%", textAlign: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${C.gold}, #9c7a3a)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <Hammer size={20} color={C.bg} />
        </div>
        <div className="disp" style={{ fontSize: 17, marginBottom: 4 }}>SUPER LEAGUE AUCTION</div>
        <div style={{ fontSize: 12, color: C.silverDim, marginBottom: 20 }}>Enter your access code to continue</div>
        <input
          type="password"
          inputMode="numeric"
          value={code}
          onChange={e => { setCode(e.target.value); setError(false); }}
          onKeyDown={e => { if (e.key === "Enter") submit(); }}
          placeholder="Access code"
          autoFocus
          style={{
            width: "100%", textAlign: "center", letterSpacing: "0.3em", fontSize: 18,
            background: C.panel2, border: `1px solid ${error ? C.live : C.line}`, borderRadius: 8,
            padding: "12px 10px", color: C.chalk, marginBottom: 10,
          }}
        />
        {error && <div style={{ fontSize: 12, color: C.live, marginBottom: 10 }}>Code not recognized — try again.</div>}
        <button onClick={submit} style={{ width: "100%", background: C.gold, color: C.bg, border: "none", padding: "11px 16px", borderRadius: 8, fontWeight: 800, fontSize: 14 }}>
          Enter
        </button>
      </div>
    </div>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
      * { box-sizing: border-box; }
      .disp { font-family: 'Archivo Black', Inter, sans-serif; letter-spacing: 0.01em; }
      .mono { font-family: 'JetBrains Mono', monospace; }
      @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
      @keyframes tick { 0% { transform: translateY(4px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
      @keyframes popIn { 0% { transform: scale(0.85); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      @keyframes confettiFall {
        0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(340px) rotate(560deg); opacity: 0; }
      }
      @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
      .tickIn { animation: tick 0.22s ease-out; }
      .popIn { animation: popIn 0.28s cubic-bezier(.2,.9,.3,1.2); }
      .fadeIn { animation: fadeIn 0.18s ease-out; }
      button { font-family: inherit; cursor: pointer; }
      button:disabled { cursor: not-allowed; }
      ::-webkit-scrollbar { height: 8px; width: 8px; }
      ::-webkit-scrollbar-thumb { background: ${C.line}; border-radius: 8px; }
      input, select { font-family: inherit; }
      input:focus, select:focus, button:focus-visible { outline: 2px solid ${C.gold}; outline-offset: 1px; }
    `}</style>
  );
}

/* ---------------- Reset (2-step confirm modal) ---------------- */
function resetAuctionState(data) {
  return {
    ...data,
    players: data.players.map(p => ({ ...p, status: "available", ownerId: null, price: null })),
    managers: data.managers.map(m => ({ ...m, purse: 100000000, squad: [] })),
    currentPlayerId: null,
    currentBid: null,
    currentBidderId: null,
    log: [],
    history: [],
    started: false,
  };
}

function ResetModal({ step, onCancel, onNext, onConfirm }) {
  return (
    <div className="fadeIn" style={{ position: "fixed", inset: 0, background: "rgba(5,12,9,0.72)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div className="popIn" style={{ background: C.panel, border: `1px solid ${C.live}`, borderRadius: 14, padding: 26, maxWidth: 420, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <AlertTriangle size={22} color={C.live} />
          <div className="disp" style={{ fontSize: 16, color: C.live }}>
            {step === 1 ? "RESET THE AUCTION?" : "ARE YOU ABSOLUTELY SURE?"}
          </div>
        </div>
        {step === 1 ? (
          <p style={{ fontSize: 14, color: C.silver, lineHeight: 1.5, marginBottom: 20 }}>
            This will clear every sold player, refund all purses to $100M, and <strong style={{ color: C.chalk }}>erase every manager's squad</strong>. Team sheets built so far will be gone.
          </p>
        ) : (
          <p style={{ fontSize: 14, color: C.silver, lineHeight: 1.5, marginBottom: 20 }}>
            Last check — this cannot be undone. All 10 managers' rosters will be wiped and the auction queue restarts from the first set. Manager names and the league schedule are kept.
          </p>
        )}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ background: "transparent", border: `1px solid ${C.line}`, color: C.silver, padding: "10px 16px", borderRadius: 8, fontWeight: 600, fontSize: 13 }}>Cancel</button>
          <button onClick={step === 1 ? onNext : onConfirm} style={{ background: C.live, border: "none", color: "#fff", padding: "10px 16px", borderRadius: 8, fontWeight: 800, fontSize: 13 }}>
            {step === 1 ? "Continue" : "Yes, reset everything"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Top bar ---------------- */
function TopBar({ tab, setTab, data, persist, role, onLogout }) {
  const tabs = [
    { id: "auction", label: "Auction Room", icon: Hammer },
    { id: "squads", label: "Squads", icon: Users },
    { id: "pool", label: "Player Pool", icon: Search },
    { id: "table", label: "League Table", icon: Trophy },
  ];
  const soldCount = data.players.filter(p => p.status === "sold").length;
  const [resetStep, setResetStep] = useState(0); // 0 = closed, 1 = first warning, 2 = final warning
  const isAdmin = role === "admin";

  const doConfirmedReset = () => {
    persist(resetAuctionState(data));
    setResetStep(0);
  };

  return (
    <div style={{ borderBottom: `1px solid ${C.line}`, background: C.panel, position: "sticky", top: 0, zIndex: 20 }}>
      {resetStep > 0 && (
        <ResetModal
          step={resetStep}
          onCancel={() => setResetStep(0)}
          onNext={() => setResetStep(2)}
          onConfirm={doConfirmedReset}
        />
      )}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: `linear-gradient(135deg, ${C.gold}, #9c7a3a)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Hammer size={18} color={C.bg} />
            </div>
            <div>
              <div className="disp" style={{ fontSize: 17, lineHeight: 1 }}>SUPER LEAGUE AUCTION</div>
              <div style={{ fontSize: 11, color: C.silverDim, marginTop: 3, letterSpacing: "0.04em" }}>10 MANAGERS · $100M PURSE · 16-MAN SQUADS</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="mono" style={{ fontSize: 12, color: C.gold, background: C.panel2, border: `1px solid ${C.line}`, padding: "6px 10px", borderRadius: 6 }}>
              {soldCount} / {data.players.length} PLAYERS SOLD
            </div>
            <div style={{ fontSize: 11, color: C.silverDim, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: isAdmin ? C.gold : C.silver, fontWeight: 700 }}>{isAdmin ? "Admin" : "Manager"}</span>
              <button onClick={onLogout} style={{ background: "transparent", border: "none", color: C.silverDim, textDecoration: "underline", fontSize: 11, padding: 0 }}>log out</button>
            </div>
            {isAdmin && (
              <button onClick={() => setResetStep(1)} title="Reset all sold players, purses, and squads"
                style={{
                  display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700,
                  color: C.live, background: "transparent", border: `1px solid ${C.live}`, padding: "7px 12px", borderRadius: 6,
                }}>
                <RotateCcw size={13} /> Restart auction
              </button>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {tabs.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 14px", background: active ? C.bg : "transparent",
                  color: active ? C.gold : C.silver,
                  border: "none", borderBottom: active ? `2px solid ${C.gold}` : "2px solid transparent",
                  fontSize: 13, fontWeight: 600, borderRadius: "6px 6px 0 0",
                }}>
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Confetti ---------------- */
function Confetti() {
  const pieces = useRef(Array.from({ length: 36 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    duration: 1.1 + Math.random() * 0.9,
    color: [C.gold, "#6FA98C", "#C97B63", "#7BA0C9", "#F3F1E7"][i % 5],
    size: 5 + Math.random() * 5,
    rotate: Math.random() * 360,
  }))).current;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", borderRadius: 14 }}>
      {pieces.map((p, i) => (
        <div key={i} style={{
          position: "absolute", top: 0, left: p.left + "%", width: p.size, height: p.size * 0.6,
          background: p.color, borderRadius: 2,
          animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
          transform: `rotate(${p.rotate}deg)`,
        }} />
      ))}
    </div>
  );
}

/* ---------------- Sold celebration popup ---------------- */
function SoldCelebration({ player, manager, price, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4200);
    return () => clearTimeout(t);
  }, [onClose]);

  const squadPlayers = manager._squadPlayers || [];

  return (
    <div className="fadeIn" style={{ position: "fixed", inset: 0, background: "rgba(5,12,9,0.78)", zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div className="popIn" style={{ position: "relative", background: `linear-gradient(180deg, ${C.panel2}, ${C.panel})`, border: `1px solid ${C.gold}`, borderRadius: 16, padding: 28, maxWidth: 440, width: "100%", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
        <Confetti />
        <div style={{ position: "relative", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
            <PartyPopper size={26} color={C.gold} />
          </div>
          <div className="disp" style={{ fontSize: 24, color: C.gold, marginBottom: 4 }}>SOLD!</div>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 2 }}>{player.name}</div>
          <div style={{ fontSize: 12, color: C.silverDim, marginBottom: 12 }}>{player.rating} OVR · {player.pos}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ width: 9, height: 9, borderRadius: 999, background: manager.color }} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>{manager.name}</span>
          </div>
          <div className="mono" style={{ fontSize: 20, color: C.chalk, fontWeight: 700, marginBottom: 16 }}>{fmt(price)}</div>

          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: 12, textAlign: "left" }}>
            <div style={{ fontSize: 11, color: C.silverDim, fontWeight: 700, letterSpacing: "0.05em", marginBottom: 8 }}>
              {manager.name.toUpperCase()}'S SQUAD — {squadPlayers.length}/16
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 120, overflowY: "auto" }}>
              {squadPlayers.map(p => (
                <div key={p.id} style={{ background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 6, padding: "4px 8px", fontSize: 11, display: "flex", gap: 5, alignItems: "center" }}>
                  <span className="mono" style={{ color: C.gold, fontWeight: 700 }}>{p.rating}</span>
                  <span>{p.name}</span>
                  <span style={{ color: C.silverDim }}>{p.pos}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={onClose} style={{ marginTop: 16, background: C.gold, color: C.bg, border: "none", padding: "9px 20px", borderRadius: 8, fontWeight: 800, fontSize: 13 }}>
            Continue auction
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Auction Room ---------------- */
function AuctionRoom({ data, persist, role }) {
  const isAdmin = role === "admin";
  const [celebration, setCelebration] = useState(null);
  const available = data.players.filter(p => p.status === "available").sort((a, b) => a.order - b.order);
  const current = data.currentPlayerId ? data.players.find(p => p.id === data.currentPlayerId) : null;

  const currentSetIdx = current ? SET_ORDER.indexOf(current.set) : -1;
  const nextSetName = currentSetIdx >= 0 ? SET_ORDER[currentSetIdx + 1] : SET_ORDER[0];
  const setSoldCount = current ? data.players.filter(p => p.set === current.set && p.status !== "available").length : 0;
  const setTotalCount = current ? data.players.filter(p => p.set === current.set).length : 0;

  const startNext = () => {
    if (!isAdmin) return;
    if (!available.length) return;
    const next = available[0];
    persist({ ...data, currentPlayerId: next.id, currentBid: next.base, currentBidderId: null, started: true });
  };

  const placeBid = (managerId) => {
    if (!current) return;
    const mgr = data.managers.find(m => m.id === managerId);
    const isFirstBid = data.currentBidderId === null;
    const amount = isFirstBid ? data.currentBid : data.currentBid + nextIncrement(data.currentBid);
    if (mgr.purse < amount) return;
    if (data.currentBidderId === managerId) return;
    const log = [{ ts: Date.now(), text: `${mgr.name} bids ${fmt(amount)} for ${current.name}` }, ...data.log].slice(0, 60);
    persist({ ...data, currentBid: amount, currentBidderId: managerId, log });
  };

  const finalize = (result) => {
    if (!isAdmin) return;
    if (!current) return;
    const snapshot = JSON.parse(JSON.stringify(data));
    let players = data.players.map(p => p.id === current.id
      ? { ...p, status: result === "sold" ? "sold" : "unsold", ownerId: result === "sold" ? data.currentBidderId : null, price: result === "sold" ? data.currentBid : null }
      : p);
    let managers = data.managers;
    let log = data.log;
    let winMgr = null;
    if (result === "sold") {
      const mgr = data.managers.find(m => m.id === data.currentBidderId);
      managers = data.managers.map(m => m.id === mgr.id
        ? { ...m, purse: m.purse - data.currentBid, squad: [...m.squad, current.id] }
        : m);
      log = [{ ts: Date.now(), text: `SOLD — ${current.name} to ${mgr.name} for ${fmt(data.currentBid)}` }, ...log].slice(0, 60);
      winMgr = managers.find(m => m.id === mgr.id);
    } else {
      log = [{ ts: Date.now(), text: `UNSOLD — ${current.name} (no bids)` }, ...log].slice(0, 60);
    }
    const remaining = players.filter(p => p.status === "available").sort((a, b) => a.order - b.order);
    const nextPlayer = remaining[0] || null;
    const finalPrice = data.currentBid;
    const soldPlayerSnapshot = current;
    persist({
      ...data, players, managers, log,
      history: [snapshot, ...data.history].slice(0, 10),
      currentPlayerId: nextPlayer ? nextPlayer.id : null,
      currentBid: nextPlayer ? nextPlayer.base : null,
      currentBidderId: null,
    });
    if (result === "sold" && winMgr) {
      const squadPlayers = winMgr.squad.map(id => players.find(p => p.id === id)).filter(Boolean).sort((a,b) => b.rating - a.rating);
      setCelebration({ player: soldPlayerSnapshot, manager: { ...winMgr, _squadPlayers: squadPlayers }, price: finalPrice });
    }
  };

  const undo = () => {
    if (!isAdmin) return;
    if (!data.history.length) return;
    const [last, ...rest] = data.history;
    persist({ ...last, history: rest });
  };

  const highBidder = data.currentBidderId ? data.managers.find(m => m.id === data.currentBidderId) : null;

  return (
    <div>
      {celebration && (
        <SoldCelebration player={celebration.player} manager={celebration.manager} price={celebration.price} onClose={() => setCelebration(null)} />
      )}

      {/* Set banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Layers size={14} color={C.gold} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.gold }}>
            {current ? current.set : (SET_ORDER[0] || "")}
          </span>
          {current && <span className="mono" style={{ fontSize: 11, color: C.silverDim }}>({setSoldCount}/{setTotalCount} through this set)</span>}
        </div>
        {nextSetName && (
          <div style={{ fontSize: 11, color: C.silverDim, display: "flex", alignItems: "center", gap: 4 }}>
            Next set: <span style={{ color: C.silver, fontWeight: 600 }}>{nextSetName}</span>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 230px", gap: 20, alignItems: "start" }}>
        <div>
          {/* Jumbotron */}
          <div style={{
            background: `radial-gradient(ellipse at 50% -10%, ${C.panel2}, ${C.panel} 60%)`,
            border: `1px solid ${C.line}`, borderRadius: 14, padding: 28, position: "relative", overflow: "hidden", marginBottom: 20,
          }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 78px, ${C.lineSoft} 78px, ${C.lineSoft} 79px)`, opacity: 0.5 }} />
            {!current ? (
              <div style={{ position: "relative", textAlign: "center", padding: "30px 0" }}>
                <div className="disp" style={{ fontSize: 22, color: C.gold, marginBottom: 8 }}>
                  {data.players.every(p => p.status !== "available") ? "AUCTION COMPLETE" : "READY TO KICK OFF"}
                </div>
                <div style={{ color: C.silver, fontSize: 13, marginBottom: 20 }}>
                  {data.players.every(p => p.status !== "available")
                    ? "Every card has gone under the hammer."
                    : `${available.length} players still on the board, in auction order.`}
                </div>
                {available.length > 0 && (
                  isAdmin ? (
                    <button onClick={startNext} style={{
                      display: "inline-flex", alignItems: "center", gap: 8, background: C.gold, color: C.bg,
                      border: "none", padding: "12px 22px", borderRadius: 8, fontWeight: 800, fontSize: 14,
                    }}>
                      <PlayCircle size={18} /> Bring up {available[0].name}
                    </button>
                  ) : (
                    <div style={{ fontSize: 12, color: C.silverDim }}>Waiting for the admin to bring up the next player…</div>
                  )
                )}
              </div>
            ) : (
              <div key={current.id} className="tickIn" style={{ position: "relative", display: "flex", gap: 26, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{
                  width: 92, height: 108, borderRadius: 10, flexShrink: 0,
                  background: `linear-gradient(160deg, ${current.tier === "Elite" ? C.gold : current.tier === "Gold" ? "#B7C9BE" : "#6E8A7C"}, ${C.panel2})`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  border: `1px solid ${C.line}`,
                }}>
                  <div className="disp" style={{ fontSize: 30, color: C.bg }}>{current.rating}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.bg, marginTop: 2 }}>{current.pos}</div>
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 999, background: C.live, animation: "pulse 1s infinite" }} />
                    <span style={{ fontSize: 11, letterSpacing: "0.08em", color: C.live, fontWeight: 700 }}>ON THE BLOCK</span>
                    <span style={{ fontSize: 11, color: C.silverDim, marginLeft: 4 }}>{current.tier} tier · base {fmt(current.base)}</span>
                  </div>
                  <div className="disp" style={{ fontSize: 26 }}>{current.name}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: C.silverDim, marginBottom: 2 }}>{highBidder ? "CURRENT BID" : "STARTING BID"}</div>
                  <div className="mono" style={{ fontSize: 30, color: C.gold, fontWeight: 700 }}>{fmt(data.currentBid)}</div>
                  <div style={{ fontSize: 12, color: highBidder ? C.chalk : C.silverDim, marginTop: 2 }}>
                    {highBidder ? `held by ${highBidder.name}` : "no bids yet"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {current && (
            <>
              {/* Manager paddles */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 10, marginBottom: 16 }}>
                {data.managers.map(m => {
                  const isHigh = data.currentBidderId === m.id;
                  const isFirstBid = data.currentBidderId === null;
                  const bidAmount = isFirstBid ? data.currentBid : data.currentBid + nextIncrement(data.currentBid);
                  const canAfford = m.purse >= bidAmount;
                  const disabled = isHigh || !canAfford;
                  return (
                    <button key={m.id} disabled={disabled} onClick={() => placeBid(m.id)}
                      style={{
                        textAlign: "left", padding: "12px 14px", borderRadius: 10,
                        border: `1px solid ${isHigh ? C.gold : C.line}`,
                        background: isHigh ? "rgba(216,166,87,0.12)" : C.panel,
                        opacity: disabled && !isHigh ? 0.4 : 1,
                      }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 999, background: m.color }} />
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{m.name}</span>
                      </div>
                      <div className="mono" style={{ fontSize: 11, color: C.silverDim, marginBottom: 6 }}>
                        purse {fmt(m.purse)} · {m.squad.length}/16
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isHigh ? C.gold : canAfford ? C.chalk : C.silverDim }}>
                        {isHigh ? "Highest bidder" : canAfford ? `Bid ${fmt(bidAmount)}` : "Can't afford"}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Controls */}
              {isAdmin ? (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                  <button onClick={() => finalize("sold")} disabled={!data.currentBidderId}
                    style={{ flex: "1 1 200px", background: data.currentBidderId ? C.gold : C.lineSoft, color: data.currentBidderId ? C.bg : C.silverDim, border: "none", padding: "13px 16px", borderRadius: 8, fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <ShieldCheck size={16} /> SOLD — confirm {fmt(data.currentBid)}
                  </button>
                  <button onClick={() => finalize("unsold")}
                    style={{ background: "transparent", color: C.silver, border: `1px solid ${C.line}`, padding: "13px 16px", borderRadius: 8, fontWeight: 600, fontSize: 13 }}>
                    Pass (no bids)
                  </button>
                  <button onClick={undo} disabled={!data.history.length}
                    style={{ background: "transparent", color: data.history.length ? C.silver : C.silverDim, border: `1px solid ${C.line}`, padding: "13px 16px", borderRadius: 8, fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                    <Undo2 size={14} /> Undo last
                  </button>
                </div>
              ) : (
                <div style={{ marginBottom: 20, fontSize: 12, color: C.silverDim }}>
                  Only the admin can confirm a sale, pass, or undo a bid.
                </div>
              )}
            </>
          )}

          {/* Log */}
          <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.silverDim, letterSpacing: "0.06em", marginBottom: 10 }}>AUCTION LOG</div>
            {data.log.length === 0 ? (
              <div style={{ color: C.silverDim, fontSize: 13 }}>Bids will appear here as the auction runs.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 220, overflowY: "auto" }}>
                {data.log.map((l, i) => (
                  <div key={i} className="mono" style={{ fontSize: 12, color: i === 0 ? C.chalk : C.silverDim }}>{l.text}</div>
                ))}
              </div>
            )}
          </div>

          {/* Up next preview */}
          {available.length > 1 && current && (
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.silverDim }}>
              <ChevronRight size={14} />
              Up next: {available.filter(p => p.id !== current.id).slice(0, 4).map(p => `${p.name} (${p.rating})`).join(" · ")}
            </div>
          )}
        </div>

        {/* Manager summary sidebar */}
        <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, position: "sticky", top: 140 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.silverDim, letterSpacing: "0.05em", marginBottom: 10 }}>MANAGERS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.managers.map(m => (
              <div key={m.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 999, background: m.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 11, color: C.silverDim, flexShrink: 0 }}>{m.squad.length}/16</span>
                </div>
                <div style={{ height: 5, background: C.lineSoft, borderRadius: 4, overflow: "hidden", marginBottom: 2 }}>
                  <div style={{ height: "100%", width: `${(m.squad.length / 16) * 100}%`, background: m.color }} />
                </div>
                <div className="mono" style={{ fontSize: 10.5, color: C.silverDim }}>{fmt(m.purse)} left</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Squads ---------------- */
const SLOTS_433 = [
  { key: "GK", label: "GK" },
  { key: "DEF", label: "LB" }, { key: "DEF", label: "CB" }, { key: "DEF", label: "CB" }, { key: "DEF", label: "RB" },
  { key: "MID", label: "CM" }, { key: "MID", label: "CDM" }, { key: "MID", label: "CM" },
  { key: "FWD", label: "LW" }, { key: "FWD", label: "ST" }, { key: "FWD", label: "RW" },
];

const SLOT_FALLBACKS = {
  GK: ["GK"],
  LB: ["LB", "CB"],
  RB: ["RB", "CB"],
  CB: ["CB", "LB", "RB"],
  CDM: ["CDM", "CM"],
  CM: ["CM", "CDM", "CAM"],
  CAM: ["CAM", "CM"],
  LM: ["LM", "LW", "CM"],
  RM: ["RM", "RW", "CM"],
  LW: ["LW", "LM", "RW"],
  RW: ["RW", "RM", "LW"],
  ST: ["ST", "LW", "RW"],
};

function assignFormation(players) {
  const pool = [...players].sort((a, b) => b.rating - a.rating);
  const used = new Set();
  const starters = SLOTS_433.map(slot => ({ slot: slot.label, player: null }));

  starters.forEach((s, i) => {
    const candidate = pool.find(p => !used.has(p.id) && p.pos === s.slot);
    if (candidate) { starters[i].player = candidate; used.add(candidate.id); }
  });

  starters.forEach((s, i) => {
    if (s.player) return;
    const slotLabel = SLOTS_433[i].label;
    const fallbacks = SLOT_FALLBACKS[slotLabel] || [POS_GROUP[slotLabel]];
    for (const wantPos of fallbacks) {
      const candidate = pool.find(p => !used.has(p.id) && p.pos === wantPos);
      if (candidate) { starters[i].player = candidate; used.add(candidate.id); break; }
    }
  });

  starters.forEach((s, i) => {
    if (s.player) return;
    const slotLabel = SLOTS_433[i].label;
    const group = POS_GROUP[slotLabel];
    const candidate = pool.find(p => !used.has(p.id) && POS_GROUP[p.pos] === group);
    if (candidate) { starters[i].player = candidate; used.add(candidate.id); }
  });

  const bench = players.filter(p => !used.has(p.id)).sort((a, b) => b.rating - a.rating);
  return { starters, bench };
}

function Squads({ data }) {
  const [sel, setSel] = useState(data.managers[0]?.id);
  const mgr = data.managers.find(m => m.id === sel) || data.managers[0];
  const squadPlayers = mgr.squad.map(id => data.players.find(p => p.id === id)).filter(Boolean);
  const { starters, bench } = assignFormation(squadPlayers);
  const spent = 100000000 - mgr.purse;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {data.managers.map(m => (
          <button key={m.id} onClick={() => setSel(m.id)}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8,
              border: `1px solid ${sel === m.id ? C.gold : C.line}`,
              background: sel === m.id ? "rgba(216,166,87,0.12)" : C.panel,
              color: sel === m.id ? C.gold : C.silver, fontSize: 13, fontWeight: 600,
            }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: m.color }} />
            {m.name} <span className="mono" style={{ color: C.silverDim, fontSize: 11 }}>({m.squad.length}/16)</span>
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 1.3fr) minmax(240px, 1fr)", gap: 20 }}>
        <div>
          <div style={{
            background: `linear-gradient(180deg, #1D4433, #12291F)`, border: `1px solid ${C.line}`, borderRadius: 14,
            padding: "26px 16px", position: "relative", minHeight: 460,
            backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.02) 40px, transparent 40px, transparent 80px)",
          }}>
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 90, height: 90, border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%" }} />
            {["FWD", "MID", "DEF", "GK"].map(row => (
              <div key={row} style={{ display: "flex", justifyContent: "space-evenly", marginBottom: row === "GK" ? 0 : 40, position: "relative", zIndex: 2 }}>
                {starters.filter(s => (SLOTS_433.find(sl => sl.label === s.slot)?.key) === row).map((s, i) => (
                  <PitchChip key={row + i} slot={s.slot} player={s.player} />
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.silverDim, marginBottom: 10, letterSpacing: "0.05em" }}>BENCH ({bench.length})</div>
            {bench.length === 0 ? (
              <div style={{ color: C.silverDim, fontSize: 13 }}>No substitutes yet.</div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {bench.map(p => (
                  <div key={p.id} style={{ background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 8, padding: "6px 10px", fontSize: 12, display: "flex", gap: 6, alignItems: "center" }}>
                    <span className="mono" style={{ color: C.gold, fontWeight: 700 }}>{p.rating}</span>
                    <span>{p.name}</span>
                    <span style={{ color: C.silverDim }}>{p.pos}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, padding: 16, marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: C.silverDim, marginBottom: 4 }}>PURSE REMAINING</div>
            <div className="mono" style={{ fontSize: 24, color: C.gold, fontWeight: 700 }}>{fmt(mgr.purse)}</div>
            <div style={{ fontSize: 12, color: C.silverDim, marginTop: 4 }}>spent {fmt(spent)} of $100M</div>
            <div style={{ height: 6, background: C.lineSoft, borderRadius: 4, marginTop: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(spent / 100000000) * 100}%`, background: C.gold }} />
            </div>
          </div>
          <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.silverDim, marginBottom: 10, letterSpacing: "0.05em" }}>FULL SQUAD</div>
            {squadPlayers.length === 0 ? (
              <div style={{ color: C.silverDim, fontSize: 13 }}>No players won yet — head to the Auction Room.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[...squadPlayers].sort((a, b) => b.rating - a.rating).map(p => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderBottom: `1px solid ${C.lineSoft}`, paddingBottom: 6 }}>
                    <span><span className="mono" style={{ color: C.gold, marginRight: 8 }}>{p.rating}</span>{p.name} <span style={{ color: C.silverDim }}>{p.pos}</span></span>
                    <span className="mono" style={{ color: C.silver }}>{fmt(p.price)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PitchChip({ slot, player }) {
  return (
    <div style={{ textAlign: "center", minWidth: 64 }}>
      <div style={{
        width: 46, height: 46, borderRadius: "50%", margin: "0 auto 4px",
        background: player ? `linear-gradient(160deg, ${C.gold}, #8a6f3e)` : "rgba(255,255,255,0.06)",
        border: `1px solid ${player ? C.gold : C.line}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: 13, color: player ? C.bg : C.silverDim,
      }}>
        {player ? player.rating : slot}
      </div>
      <div style={{ fontSize: 11, color: player ? C.chalk : C.silverDim, maxWidth: 72, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {player ? player.name.split(" ").slice(-1)[0] : "empty"}
      </div>
    </div>
  );
}

/* ---------------- Player Pool ---------------- */
function PlayerPool({ data, persist, role }) {
  const isAdmin = role === "admin";
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [setFilter, setSetFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 75, pos: "ST" });

  const filtered = data.players.filter(p => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (setFilter !== "all" && p.set !== setFilter) return false;
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }).sort((a, b) => a.order - b.order);

  const addPlayer = () => {
    if (!isAdmin) return;
    if (!form.name.trim()) return;
    const rating = Math.max(40, Math.min(99, Number(form.rating) || 75));
    const id = "custom_" + Date.now();
    const maxOrder = Math.max(0, ...data.players.map(p => p.order || 0));
    const newPlayer = { id, name: form.name.trim(), rating, pos: form.pos, set: "Custom Additions", order: maxOrder + 1, base: baseFor(rating), tier: tierFor(rating), status: "available", ownerId: null, price: null };
    persist({ ...data, players: [...data.players, newPlayer] });
    setForm({ name: "", rating: 75, pos: "ST" });
    setShowAdd(false);
  };

  const reopen = (id) => {
    if (!isAdmin) return;
    persist({ ...data, players: data.players.map(p => p.id === id ? { ...p, status: "available" } : p) });
  };
  const removePlayer = (id) => {
    if (!isAdmin) return;
    persist({ ...data, players: data.players.filter(p => p.id !== id) });
  };

  const setNames = [...new Set(data.players.map(p => p.set))];

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {setNames.map(sn => (
          <div key={sn} className="mono" style={{ fontSize: 10.5, color: C.silverDim, background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 999, padding: "3px 9px" }}>
            {sn} · {data.players.filter(p => p.set === sn).length}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 220px" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 11, color: C.silverDim }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search players…"
            style={{ width: "100%", background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 10px 9px 30px", color: C.chalk, fontSize: 13 }} />
        </div>
        <select value={setFilter} onChange={e => setSetFilter(e.target.value)}
          style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 10px", color: C.chalk, fontSize: 13 }}>
          <option value="all">All sets</option>
          {setNames.map(sn => <option key={sn} value={sn}>{sn}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 10px", color: C.chalk, fontSize: 13 }}>
          <option value="all">All statuses</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="unsold">Unsold</option>
        </select>
        <button onClick={() => setShowAdd(s => !s)} style={{ display: "flex", alignItems: "center", gap: 6, background: C.gold, color: C.bg, border: "none", padding: "9px 14px", borderRadius: 8, fontWeight: 700, fontSize: 13, visibility: isAdmin ? "visible" : "hidden" }}>
          <Plus size={14} /> Add player
        </button>
      </div>

      {showAdd && isAdmin && (
        <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 11, color: C.silverDim, marginBottom: 4 }}>Name</div>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 9px", color: C.chalk, fontSize: 13 }} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.silverDim, marginBottom: 4 }}>Rating</div>
            <input type="number" min={40} max={99} value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} style={{ width: 70, background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 9px", color: C.chalk, fontSize: 13 }} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.silverDim, marginBottom: 4 }}>Position</div>
            <select value={form.pos} onChange={e => setForm({ ...form, pos: e.target.value })} style={{ background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 9px", color: C.chalk, fontSize: 13 }}>
              {Object.keys(POS_GROUP).filter(p => p !== "CF").map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <button onClick={addPlayer} style={{ background: C.gold, color: C.bg, border: "none", padding: "8px 14px", borderRadius: 6, fontWeight: 700, fontSize: 13 }}>Add to pool</button>
        </div>
      )}

      <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 130px 55px 55px 80px 110px 80px", padding: "10px 14px", fontSize: 11, color: C.silverDim, borderBottom: `1px solid ${C.line}`, fontWeight: 700, letterSpacing: "0.04em" }}>
          <div>PLAYER</div><div>SET</div><div>RTG</div><div>POS</div><div>BASE</div><div>STATUS</div><div></div>
        </div>
        <div style={{ maxHeight: 520, overflowY: "auto" }}>
          {filtered.map(p => {
            const owner = p.ownerId ? data.managers.find(m => m.id === p.ownerId) : null;
            return (
              <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr 130px 55px 55px 80px 110px 80px", padding: "9px 14px", fontSize: 13, borderBottom: `1px solid ${C.lineSoft}`, alignItems: "center" }}>
                <div>{p.name}</div>
                <div style={{ fontSize: 11, color: C.silverDim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.set}</div>
                <div className="mono" style={{ color: C.gold }}>{p.rating}</div>
                <div style={{ color: C.silver }}>{p.pos}</div>
                <div className="mono" style={{ color: C.silver }}>{fmt(p.base)}</div>
                <div style={{ fontSize: 12 }}>
                  {p.status === "available" && <span style={{ color: C.silverDim }}>Available</span>}
                  {p.status === "sold" && <span style={{ color: C.gold }}>Sold → {owner?.name} ({fmt(p.price)})</span>}
                  {p.status === "unsold" && <span style={{ color: C.live }}>Unsold</span>}
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  {isAdmin && p.status === "unsold" && (
                    <button onClick={() => reopen(p.id)} title="Reopen for bidding" style={{ background: "transparent", border: "none", color: C.silver }}><ListRestart size={15} /></button>
                  )}
                  {isAdmin && p.status === "available" && (
                    <button onClick={() => removePlayer(p.id)} title="Remove from pool" style={{ background: "transparent", border: "none", color: C.silverDim }}><Trash2 size={15} /></button>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <div style={{ padding: 20, color: C.silverDim, fontSize: 13 }}>No players match.</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- League Table + Schedule ---------------- */
function ManagerNameEditor({ data, persist, role }) {
  const isAdmin = role === "admin";
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");

  const startEdit = (m) => { if (!isAdmin) return; setEditing(m.id); setDraft(m.name); };
  const save = () => {
    const name = draft.trim();
    if (!name) { setEditing(null); return; }
    persist({ ...data, managers: data.managers.map(m => m.id === editing ? { ...m, name } : m) });
    setEditing(null);
  };

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.silverDim, marginBottom: 10, letterSpacing: "0.05em" }}>
        MANAGERS{isAdmin ? " — CLICK TO RENAME" : ""}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
        {data.managers.map(m => (
          <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 10px" }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: m.color, flexShrink: 0 }} />
            {editing === m.id ? (
              <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(null); }}
                onBlur={save}
                style={{ flex: 1, background: "transparent", border: `1px solid ${C.gold}`, borderRadius: 4, color: C.chalk, fontSize: 13, padding: "2px 6px", minWidth: 0 }} />
            ) : isAdmin ? (
              <button onClick={() => startEdit(m)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", color: C.chalk, fontSize: 13, fontWeight: 600, padding: 0, minWidth: 0 }}>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</span>
                <Pencil size={12} color={C.silverDim} style={{ flexShrink: 0, marginLeft: 6 }} />
              </button>
            ) : (
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TournamentTable({ data, persist, role }) {
  const isAdmin = role === "admin";
  const [gw, setGw] = useState(0);
  const [confirmRegen, setConfirmRegen] = useState(false);

  const doGenerate = () => {
    if (!isAdmin) return;
    const schedule = generateSchedule(data.managers.map(m => m.id));
    persist({ ...data, schedule });
    setGw(0);
    setConfirmRegen(false);
  };

  const hasScores = data.schedule && data.schedule.some(round => round.some(m => m.hg !== null || m.ag !== null));

  const updateScore = (roundIdx, matchId, field, value) => {
    if (!isAdmin) return;
    const v = value === "" ? null : Math.max(0, Number(value) || 0);
    const schedule = data.schedule.map((round, ri) => ri !== roundIdx ? round : round.map(m => m.id === matchId ? { ...m, [field]: v } : m));
    persist({ ...data, schedule });
  };

  const table = data.managers.map(m => ({ id: m.id, name: m.name, color: m.color, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }));
  const rowOf = (id) => table.find(r => r.id === id);
  if (data.schedule) {
    data.schedule.forEach(round => round.forEach(m => {
      if (m.hg === null || m.ag === null) return;
      const h = rowOf(m.homeId), a = rowOf(m.awayId);
      if (!h || !a) return;
      h.p++; a.p++; h.gf += m.hg; h.ga += m.ag; a.gf += m.ag; a.ga += m.hg;
      if (m.hg > m.ag) { h.w++; a.l++; h.pts += 3; }
      else if (m.hg < m.ag) { a.w++; h.l++; a.pts += 3; }
      else { h.d++; a.d++; h.pts++; a.pts++; }
    }));
  }
  table.sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf);

  return (
    <div>
      <ManagerNameEditor data={data} persist={persist} role={role} />

      <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "34px 1fr 44px 44px 44px 44px 60px 60px 50px", padding: "10px 14px", fontSize: 11, color: C.silverDim, borderBottom: `1px solid ${C.line}`, fontWeight: 700 }}>
          <div>#</div><div>MANAGER</div><div>P</div><div>W</div><div>D</div><div>L</div><div>GF-GA</div><div>GD</div><div>PTS</div>
        </div>
        {table.map((r, i) => (
          <div key={r.id} style={{ display: "grid", gridTemplateColumns: "34px 1fr 44px 44px 44px 44px 60px 60px 50px", padding: "9px 14px", fontSize: 13, borderBottom: `1px solid ${C.lineSoft}`, alignItems: "center" }}>
            <div className="mono" style={{ color: C.silverDim }}>{i + 1}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 7, height: 7, borderRadius: 999, background: r.color }} />{r.name}</div>
            <div>{r.p}</div><div>{r.w}</div><div>{r.d}</div><div>{r.l}</div>
            <div className="mono">{r.gf}-{r.ga}</div>
            <div className="mono">{r.gf - r.ga > 0 ? "+" : ""}{r.gf - r.ga}</div>
            <div className="mono" style={{ color: C.gold, fontWeight: 700 }}>{r.pts}</div>
          </div>
        ))}
      </div>

      {/* Schedule */}
      <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar size={15} color={C.gold} />
            <div style={{ fontSize: 13, fontWeight: 700 }}>Season Schedule</div>
          </div>
          {data.schedule ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <select value={gw} onChange={e => setGw(Number(e.target.value))}
                style={{ background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 6, padding: "7px 9px", color: C.chalk, fontSize: 13 }}>
                {data.schedule.map((_, i) => <option key={i} value={i}>Gameweek {i + 1}</option>)}
              </select>
              {isAdmin && (!confirmRegen ? (
                <button onClick={() => setConfirmRegen(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: `1px solid ${C.line}`, color: C.silver, padding: "7px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                  <Shuffle size={12} /> Regenerate
                </button>
              ) : (
                <>
                  <span style={{ fontSize: 11, color: C.live }}>{hasScores ? "This will erase entered scores!" : "Sure?"}</span>
                  <button onClick={doGenerate} style={{ background: C.live, border: "none", color: "#fff", padding: "7px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>Yes, regenerate</button>
                  <button onClick={() => setConfirmRegen(false)} style={{ background: "transparent", border: `1px solid ${C.line}`, color: C.silver, padding: "7px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Cancel</button>
                </>
              ))}
            </div>
          ) : isAdmin ? (
            <button onClick={doGenerate} style={{ display: "flex", alignItems: "center", gap: 8, background: C.gold, color: C.bg, border: "none", padding: "9px 16px", borderRadius: 8, fontWeight: 700, fontSize: 13 }}>
              <Shuffle size={14} /> Generate double round-robin schedule
            </button>
          ) : (
            <div style={{ fontSize: 12, color: C.silverDim }}>Waiting for the admin to generate the schedule…</div>
          )}
        </div>

        {!data.schedule ? (
          <div style={{ color: C.silverDim, fontSize: 13 }}>No schedule yet — the admin needs to generate one so every manager faces every other manager home and away.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.schedule[gw].map(m => {
              const h = data.managers.find(x => x.id === m.homeId), a = data.managers.find(x => x.id === m.awayId);
              return (
                <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 8, padding: "10px 12px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 120, justifyContent: "flex-end" }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{h?.name}</span>
                    <span style={{ width: 7, height: 7, borderRadius: 999, background: h?.color }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {isAdmin ? (
                      <>
                        <input type="number" min={0} value={m.hg === null ? "" : m.hg} placeholder="-"
                          onChange={e => updateScore(gw, m.id, "hg", e.target.value)}
                          style={{ width: 42, textAlign: "center", background: C.bg, border: `1px solid ${C.line}`, borderRadius: 6, padding: "6px 4px", color: C.chalk, fontSize: 13 }} />
                        <span style={{ color: C.silverDim, fontSize: 12 }}>–</span>
                        <input type="number" min={0} value={m.ag === null ? "" : m.ag} placeholder="-"
                          onChange={e => updateScore(gw, m.id, "ag", e.target.value)}
                          style={{ width: 42, textAlign: "center", background: C.bg, border: `1px solid ${C.line}`, borderRadius: 6, padding: "6px 4px", color: C.chalk, fontSize: 13 }} />
                      </>
                    ) : (
                      <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: (m.hg !== null && m.ag !== null) ? C.chalk : C.silverDim }}>
                        {m.hg === null ? "–" : m.hg} : {m.ag === null ? "–" : m.ag}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 120 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 999, background: a?.color }} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{a?.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
