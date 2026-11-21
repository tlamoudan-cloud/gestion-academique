import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, Users, GraduationCap, CalendarDays, ClipboardCheck,
  Search, X, Plus, Check, Clock3, TriangleAlert, Mail, Phone,
  BadgeCheck, BookOpen, Menu, FileCheck2
} from "lucide-react";

/* ---------------------------------------------------------
   STRUCTURE DE L'ÉCOLE : ENIAD Berkane (Université Mohammed Premier)
   Cycle préparatoire intégré (EPSI) : 2 ans
   Cycle ingénieur : 3 ans, 4 filières (IA, IRSI, ROC, GINF)
   => 5 années de formation au total
--------------------------------------------------------- */

const FILIERES = [
  { code: "EPSI", court: "Prépa (EPSI)", nom: "Cycle préparatoire intégré (EPSI)", cycle: "Préparatoire" },
  { code: "IA", court: "IA", nom: "Intelligence Artificielle", cycle: "Ingénieur" },
  { code: "GINF", court: "GINF", nom: "Génie Informatique", cycle: "Ingénieur" },
  { code: "IRSI", court: "IRSI", nom: "Ingénierie Réseaux et Sécurité Informatique", cycle: "Ingénieur" },
  { code: "ROC", court: "ROC", nom: "Robotique et Objets Connectés", cycle: "Ingénieur" },
  { code: "SID", court: "SID", nom: "Sciences et Ingénierie des Données", cycle: "Ingénieur" },
];
const CODES = FILIERES.map((f) => f.code);
const filiereDe = (code) => FILIERES.find((f) => f.code === code);

const NIVEAUX_PREPA = ["1ère année prépa", "2ème année prépa"];
const NIVEAUX_ING = ["1ère année ingénieur", "2ème année ingénieur", "3ème année ingénieur"];
// SID est une nouvelle filière : seule la 1ère année est ouverte en 2026/2027
const NIVEAUX_PAR_FILIERE = (code) =>
  code === "EPSI" ? NIVEAUX_PREPA : code === "SID" ? [NIVEAUX_ING[0]] : NIVEAUX_ING;

const PARCOURS = [
  { niveau: "1ère année prépa", annee: "Année 1", semestre: "S1", cycle: "Préparatoire" },
  { niveau: "2ème année prépa", annee: "Année 2", semestre: "S3", cycle: "Préparatoire" },
  { niveau: "1ère année ingénieur", annee: "Année 3", semestre: "S5", cycle: "Ingénieur" },
  { niveau: "2ème année ingénieur", annee: "Année 4", semestre: "S7", cycle: "Ingénieur" },
  { niveau: "3ème année ingénieur", annee: "Année 5", semestre: "S9", cycle: "Ingénieur" },
];

/* Modules du semestre d'automne 2026/2027, relevés dans les PDF d'emplois du temps de l'école */
const TRONC_ING1 = [
  "Programmation orientée objet en Java",
  "Statistiques descriptives, inférentielles et exploratoires",
  "Programmation orientée objet en Python",
  "Système d'exploitation et programmation système",
  "Développement d'applications web",
  "Ingénierie des bases de données avancée",
  "Comptabilité et calcul des coûts",
  "Anglais 1",
  "Français 1",
];
const FIN_ING2 = ["Gestion agile de projet informatique", "Management et marketing", "Anglais 3", "Français 3"];
const FIN_ING3 = ["Éthiques et droits", "Anglais 5", "Français 5"];

const MODULES = {
  EPSI: {
    "1ère année prépa": [
      "Algèbre 1", "Analyse 1", "Électrocinétique", "Mécanique du point",
      "Algorithmique et architecture des ordinateurs", "Méthodologie de travail universitaire",
      "Anglais 1", "Français 1",
    ],
    "2ème année prépa": [
      "Algèbre 3", "Analyse 3", "Systèmes d'information et bases de données",
      "Traitement du signal et systèmes numériques", "Algorithmique avancée et structure des données",
      "Programmation Python", "Anglais 3", "Français 3",
    ],
  },
  IA: {
    "1ère année ingénieur": TRONC_ING1,
    "2ème année ingénieur": [
      "Deep Learning", "Optimisation combinatoire et métaheuristiques", "Développement mobile multiplateforme",
      "Vision artificielle", "Réseaux de communication IoT", ...FIN_ING2,
    ],
    "3ème année ingénieur": [
      "Modèles de langage et traitement automatique du texte", "DevOps et MLOps", "Ingénierie Big Data",
      "Cloud computing et virtualisation", "Explainable AI", "Ateliers IA avancée", ...FIN_ING3,
    ],
  },
  GINF: {
    "1ère année ingénieur": TRONC_ING1,
    "2ème année ingénieur": [
      "Développement d'applications .NET", "Administration des systèmes", "Ingénierie JEE et applications distribuées",
      "Machine Learning", "Développement mobile multiplateforme", ...FIN_ING2,
    ],
    "3ème année ingénieur": [
      "Cloud computing et virtualisation", "Urbanisation des systèmes d'information",
      "Interconnexion réseaux et sécurité réseaux", "Ingénierie Big Data", "Atelier pentesting web",
      "Architecture logicielle et design patterns", ...FIN_ING3,
    ],
  },
  IRSI: {
    "1ère année ingénieur": TRONC_ING1.map((m) => (m === "Ingénierie des bases de données avancée" ? "Réseaux informatiques" : m)),
    "2ème année ingénieur": [
      "Cryptographie : protocoles et applications", "Administration et sécurité des services",
      "Interconnexion des réseaux avancée", "Machine Learning", "Réseaux de communication IoT", ...FIN_ING2,
    ],
    "3ème année ingénieur": [
      "Technologie blockchain", "Cybersécurité", "Atelier firewall", "Atelier ethical hacking",
      "Gouvernance de la sécurité et analyse des risques", "Atelier pentesting web", ...FIN_ING3,
    ],
  },
  ROC: {
    "1ère année ingénieur": [
      "Programmation orientée objet en Java", "Statistiques descriptives, inférentielles et exploratoires",
      "Perception et capteurs pour objets et robots connectés", "Système d'exploitation et programmation système",
      "Développement d'applications web", "Programmation embarquée", "Comptabilité et calcul des coûts",
      "Anglais 1", "Français 1",
    ],
    "2ème année ingénieur": [
      "Programmation en robotique et conception 3D", "Développement mobile multiplateforme", "Vision artificielle",
      "Réseaux de communication IoT", "Machine Learning", ...FIN_ING2,
    ],
    "3ème année ingénieur": [
      "Robot Operating System", "Atelier robotique avancée (cobotique, mobilité)", "Ingénierie Big Data",
      "Cloud computing et virtualisation", "Réalité virtuelle et réalité augmentée", "IA embarquée et Edge AI",
      ...FIN_ING3,
    ],
  },
  SID: {
    "1ère année ingénieur": TRONC_ING1,
  },
};
const modulesDe = (code, niveau) => (MODULES[code] && MODULES[code][niveau]) || [];

const CRENEAUX = ["08:15 – 09:45", "10:15 – 11:45", "13:30 – 15:00", "15:15 – 16:45"];
const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const PIECES_TOTAL = 6;

const PRENOMS = ["Yasmine","Ahmed","Salma","Youssef","Imane","Karim","Nour","Omar","Lina","Anas","Rania","Bilal","Meryem","Zakaria","Hind","Amine","Sara","Reda","Douae","Hamza"];
const NOMS = ["El Amrani","Bennis","Tazi","Chraibi","Idrissi","Fassi","Benjelloun","Alaoui","Sqalli","Berrada","Kabbaj","Guerraoui","Lahlou","Cherkaoui","Bakkali"];

function seedRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const rnd = seedRandom(42);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const round1 = (n) => Math.round(n * 10) / 10;

function genererEtudiants(n) {
  const list = [];
  for (let i = 0; i < n; i++) {
    const filiere = CODES[i % CODES.length];
    const prenom = pick(PRENOMS);
    const nom = pick(NOMS);
    const niveau = pick(NIVEAUX_PAR_FILIERE(filiere));
    const notes = {};
    modulesDe(filiere, niveau).forEach((c) => {
      notes[c] = { cc: round1(8 + rnd() * 12), examen: round1(6 + rnd() * 14), valide: rnd() > 0.4 };
    });
    const pieces = rnd() > 0.4 ? PIECES_TOTAL : Math.floor(rnd() * PIECES_TOTAL);
    list.push({
      id: `ENI-${1000 + i}`,
      prenom, nom, filiere, niveau,
      email: `${prenom}.${nom}`.toLowerCase().replace(/\s|'/g, "") + "@exemple.ma",
      tel: `06${Math.floor(10000000 + rnd() * 89999999)}`,
      notes,
      pieces,
      bourse: rnd() > 0.55,
      presenceTaux: Math.round(70 + rnd() * 30),
    });
  }
  return list;
}

const ETUDIANTS_INIT = genererEtudiants(30);

function moyenneCours(note) {
  return round1(note.cc * 0.4 + note.examen * 0.6);
}
function moyenneGenerale(etudiant) {
  const vals = Object.values(etudiant.notes).map(moyenneCours);
  if (!vals.length) return 0;
  return round1(vals.reduce((a, b) => a + b, 0) / vals.length);
}
function statutDossier(etudiant) {
  if (etudiant.pieces >= PIECES_TOTAL) return "Complet";
  if (etudiant.pieces > 0) return "Incomplet";
  return "Non déposé";
}

/* ---------------------------------------------------------
   COMPOSANTS VISUELS
--------------------------------------------------------- */

function Seal({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke="var(--gold)" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="var(--gold)" strokeWidth="1" strokeDasharray="2 3" />
      <path d="M50 24 L56 42 L75 42 L60 53 L65 71 L50 60 L35 71 L40 53 L25 42 L44 42 Z" fill="var(--gold)" />
    </svg>
  );
}

function StatusBadge({ status }) {
  const map = {
    "Complet": { bg: "rgba(79,111,82,0.12)", fg: "var(--sage)", icon: <Check size={12} /> },
    "Incomplet": { bg: "rgba(176,141,70,0.15)", fg: "var(--gold-dark)", icon: <Clock3 size={12} /> },
    "Non déposé": { bg: "rgba(140,47,57,0.12)", fg: "var(--crimson)", icon: <TriangleAlert size={12} /> },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium font-body whitespace-nowrap"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.icon}{status}
    </span>
  );
}

function FiliereTag({ code }) {
  const prepa = code === "EPSI";
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-mono font-medium"
      style={{
        background: prepa ? "rgba(198,160,92,0.18)" : "rgba(20,33,61,0.08)",
        color: prepa ? "var(--gold-dark)" : "var(--ink)",
      }}
    >
      {filiereDe(code).court}
    </span>
  );
}

function KpiCard({ label, value, sub, icon }) {
  return (
    <div className="bg-card rounded-lg p-5 flex items-start justify-between border-hair">
      <div>
        <p className="text-xs uppercase tracking-wider font-body" style={{ color: "var(--text-muted)" }}>{label}</p>
        <p className="font-display text-3xl mt-2" style={{ color: "var(--ink)" }}>{value}</p>
        {sub && <p className="text-xs font-body mt-1" style={{ color: "var(--text-muted)" }}>{sub}</p>}
      </div>
      <div className="p-2.5 rounded-md" style={{ background: "var(--ink)" }}>
        {icon}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   APP PRINCIPALE
--------------------------------------------------------- */

const NAV = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "etudiants", label: "Étudiants", icon: Users },
  { key: "notes", label: "Notes", icon: GraduationCap },
  { key: "emploi", label: "Emploi du temps", icon: CalendarDays },
  { key: "dossiers", label: "Dossiers & bourses", icon: ClipboardCheck },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [etudiants, setEtudiants] = useState(ETUDIANTS_INIT);
  const [search, setSearch] = useState("");
  const [filiereFiltre, setFiliereFiltre] = useState("Toutes");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notesCours, setNotesCours] = useState({ filiere: "EPSI", niveau: NIVEAUX_PREPA[0], cours: modulesDe("EPSI", NIVEAUX_PREPA[0])[0] });
  const [presenceJour, setPresenceJour] = useState({ jour: "Lundi", creneau: CRENEAUX[0], filiere: "EPSI", niveau: NIVEAUX_PREPA[0] });
  const [presenceState, setPresenceState] = useState({});

  const filtered = useMemo(() => {
    return etudiants.filter((e) => {
      const matchSearch = `${e.prenom} ${e.nom} ${e.id}`.toLowerCase().includes(search.toLowerCase());
      const matchFiliere = filiereFiltre === "Toutes" || e.filiere === filiereFiltre;
      return matchSearch && matchFiliere;
    });
  }, [etudiants, search, filiereFiltre]);

  const kpis = useMemo(() => {
    const total = etudiants.length;
    const moyGen = round1(etudiants.reduce((a, e) => a + moyenneGenerale(e), 0) / (total || 1));
    const presenceMoy = Math.round(etudiants.reduce((a, e) => a + e.presenceTaux, 0) / (total || 1));
    const complets = etudiants.filter((e) => statutDossier(e) === "Complet").length;
    return { total, moyGen, presenceMoy, complets, pctComplets: Math.round((complets / (total || 1)) * 100) };
  }, [etudiants]);

  const parFiliere = FILIERES.map((f) => ({
    ...f,
    count: etudiants.filter((e) => e.filiere === f.code).length,
  }));
  const maxCount = Math.max(...parFiliere.map((d) => d.count), 1);

  function updateNote(id, cours, champ, valeur) {
    setEtudiants((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        return { ...e, notes: { ...e.notes, [cours]: { ...e.notes[cours], [champ]: valeur } } };
      })
    );
  }

  function toggleValide(id, cours) {
    setEtudiants((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        return { ...e, notes: { ...e.notes, [cours]: { ...e.notes[cours], valide: !e.notes[cours].valide } } };
      })
    );
  }

  function recevoirPiece(id) {
    setEtudiants((prev) =>
      prev.map((e) => (e.id === id ? { ...e, pieces: Math.min(PIECES_TOTAL, e.pieces + 1) } : e))
    );
  }

  function ajouterEtudiant(data) {
    const notes = {};
    modulesDe(data.filiere, data.niveau).forEach((c) => (notes[c] = { cc: 0, examen: 0, valide: false }));
    const nouvel = {
      id: `ENI-${1000 + etudiants.length + Math.floor(rnd() * 900)}`,
      prenom: data.prenom, nom: data.nom, filiere: data.filiere, niveau: data.niveau,
      email: data.email, tel: data.tel,
      notes, pieces: 0, bourse: false, presenceTaux: 100,
    };
    setEtudiants((prev) => [nouvel, ...prev]);
    setShowAdd(false);
  }

  const etudiantsFiliereCourante = etudiants.filter((e) => e.filiere === notesCours.filiere && e.niveau === notesCours.niveau);
  const etudiantsPresence = etudiants.filter((e) => e.filiere === presenceJour.filiere && e.niveau === presenceJour.niveau);

  function togglePresence(id) {
    const key = `${presenceJour.jour}-${presenceJour.creneau}-${id}`;
    setPresenceState((prev) => {
      const current = prev[key] || "present";
      const next = current === "present" ? "absent" : current === "absent" ? "retard" : "present";
      return { ...prev, [key]: next };
    });
  }

  function onSearch(value) {
    setSearch(value);
    if (value && tab !== "etudiants") setTab("etudiants");
  }

  return (
    <div className="w-full min-h-full font-body" style={{ background: "var(--bg-page)", color: "var(--text-primary)" }}>
      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className={`bg-ink fixed lg:static z-30 h-full lg:h-auto lg:min-h-screen w-64 flex-shrink-0 transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          <div className="flex items-center gap-3 px-5 py-6">
            <Seal size={36} />
            <div>
              <p className="font-display text-lg leading-tight" style={{ color: "#F4F0E6" }}>ENIAD Berkane</p>
              <p className="text-[11px] tracking-wide font-body" style={{ color: "var(--gold)" }}>Université Mohammed Premier</p>
            </div>
          </div>
          <nav className="mt-2 px-3 space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = tab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => { setTab(item.key); setSidebarOpen(false); }}
                  className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-body ${active ? "active" : ""}`}
                  style={{ color: active ? "var(--gold)" : "#C9CFDD" }}
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 px-5 py-5 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <p className="text-xs font-body" style={{ color: "#8A93AC" }}>Année universitaire</p>
            <p className="font-mono text-sm" style={{ color: "#E7E9ED" }}>2026 – 2027</p>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* CONTENU */}
        <main className="flex-1 min-w-0">
          {/* TOP BAR */}
          <div className="bg-card border-hair px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu size={22} style={{ color: "var(--ink)" }} />
              </button>
              <p className="font-display text-xl lg:text-2xl" style={{ color: "var(--ink)" }}>
                {NAV.find((n) => n.key === tab)?.label}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-page rounded-md px-3 py-2 border-hair">
              <Search size={15} className="text-muted" />
              <input
                type="text"
                placeholder="Rechercher un étudiant…"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                className="bg-transparent outline-none text-sm w-48"
              />
            </div>
          </div>

          <div className="p-4 lg:p-8">
            {/* ---------------- DASHBOARD ---------------- */}
            {tab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <KpiCard label="Étudiants inscrits" value={kpis.total} sub="Prépa et cycle ingénieur" icon={<Users size={18} color="#F4F0E6" />} />
                  <KpiCard label="Moyenne générale" value={`${kpis.moyGen}/20`} sub="Toutes matières" icon={<GraduationCap size={18} color="#F4F0E6" />} />
                  <KpiCard label="Taux de présence" value={`${kpis.presenceMoy}%`} sub="Moyenne du semestre" icon={<CalendarDays size={18} color="#F4F0E6" />} />
                  <KpiCard label="Dossiers complets" value={`${kpis.pctComplets}%`} sub={`${kpis.complets} sur ${kpis.total} étudiants`} icon={<FileCheck2 size={18} color="#F4F0E6" />} />
                </div>

                {/* PARCOURS EN 5 ANS */}
                <div className="bg-card rounded-lg p-6 border-hair">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                    <p className="font-display text-lg" style={{ color: "var(--ink)" }}>Parcours de formation en 5 ans</p>
                    <p className="text-xs font-body text-muted">2 ans de cycle préparatoire + 3 ans de cycle ingénieur · 5 filières ingénieur</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {PARCOURS.map((p) => {
                      const count = etudiants.filter((e) => e.niveau === p.niveau).length;
                      const prepa = p.cycle === "Préparatoire";
                      return (
                        <div
                          key={p.niveau}
                          className="rounded-md p-4"
                          style={{
                            background: prepa ? "rgba(198,160,92,0.14)" : "rgba(20,33,61,0.06)",
                            borderTop: `3px solid ${prepa ? "var(--gold)" : "var(--ink)"}`,
                          }}
                        >
                          <p className="font-mono text-xs text-muted">{p.annee} · {p.semestre}</p>
                          <p className="font-body text-sm font-medium mt-1" style={{ color: "var(--ink)" }}>{p.niveau}</p>
                          <p className="font-display text-2xl mt-2" style={{ color: "var(--ink)" }}>{count}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  <div className="bg-card rounded-lg p-6 border-hair lg:col-span-3">
                    <p className="font-display text-lg mb-4" style={{ color: "var(--ink)" }}>Répartition par filière</p>
                    <div className="space-y-4">
                      {parFiliere.map((d) => (
                        <div key={d.code}>
                          <div className="flex justify-between text-sm font-body mb-1">
                            <span style={{ color: "var(--text-primary)" }}>
                              <span className="font-mono text-xs text-muted mr-2">{d.court}</span>{d.nom}
                            </span>
                            <span className="font-mono text-muted">{d.count}</span>
                          </div>
                          <div className="w-full h-2 rounded-full" style={{ background: "var(--bg-page)" }}>
                            <div
                              className="h-2 rounded-full"
                              style={{ width: `${(d.count / maxCount) * 100}%`, background: d.code === "EPSI" ? "var(--gold)" : "var(--ink)" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-6 border-hair lg:col-span-2">
                    <p className="font-display text-lg mb-4" style={{ color: "var(--ink)" }}>Statut des dossiers</p>
                    <div className="space-y-3">
                      {["Complet", "Incomplet", "Non déposé"].map((s) => {
                        const count = etudiants.filter((e) => statutDossier(e) === s).length;
                        return (
                          <div key={s} className="flex items-center justify-between ledger-row pb-3">
                            <StatusBadge status={s} />
                            <span className="font-mono text-sm text-muted">{count} étudiant{count > 1 ? "s" : ""}</span>
                          </div>
                        );
                      })}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-sm font-body">Boursiers</span>
                        <span className="font-mono text-sm text-muted">{etudiants.filter((e) => e.bourse).length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- ETUDIANTS ---------------- */}
            {tab === "etudiants" && (
              <div>
                <div className="sm:hidden flex items-center gap-2 bg-card rounded-md px-3 py-2 border-hair mb-4">
                  <Search size={15} className="text-muted" />
                  <input
                    type="text"
                    placeholder="Rechercher un étudiant…"
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    className="bg-transparent outline-none text-sm w-full"
                  />
                </div>
                <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
                  <div className="flex flex-wrap gap-2">
                    {[{ code: "Toutes", court: `Toutes (${etudiants.length})` }, ...FILIERES].map((f) => (
                      <button
                        key={f.code}
                        onClick={() => setFiliereFiltre(f.code)}
                        className="px-3 py-1.5 rounded-full text-sm font-body border-hair"
                        style={{ background: filiereFiltre === f.code ? "var(--ink)" : "var(--bg-card)", color: filiereFiltre === f.code ? "#fff" : "var(--text-primary)" }}
                      >
                        {f.court}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-body font-medium"
                    style={{ background: "var(--gold)", color: "var(--ink)" }}
                  >
                    <Plus size={16} /> Nouvel étudiant
                  </button>
                </div>

                <div className="bg-card rounded-lg border-hair overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="ledger-row text-left">
                        <th className="px-4 py-3 font-body font-medium text-muted">ID</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Nom</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Filière</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Niveau</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Moyenne</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Présence</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Dossier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((e) => (
                        <tr key={e.id} className="ledger-row cursor-pointer hover:bg-page/40" onClick={() => setSelected(e)}>
                          <td className="px-4 py-3 font-mono text-xs text-muted">{e.id}</td>
                          <td className="px-4 py-3 font-body font-medium whitespace-nowrap">{e.prenom} {e.nom}</td>
                          <td className="px-4 py-3"><FiliereTag code={e.filiere} /></td>
                          <td className="px-4 py-3 font-body text-muted whitespace-nowrap">{e.niveau}</td>
                          <td className="px-4 py-3 font-mono">{moyenneGenerale(e)}/20</td>
                          <td className="px-4 py-3 font-mono">{e.presenceTaux}%</td>
                          <td className="px-4 py-3"><StatusBadge status={statutDossier(e)} /></td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr><td colSpan={7} className="px-4 py-8 text-center text-muted font-body">Aucun étudiant ne correspond à la recherche.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ---------------- NOTES ---------------- */}
            {tab === "notes" && (
              <div>
                <div className="flex flex-wrap gap-3 mb-5">
                  <select
                    value={notesCours.filiere}
                    onChange={(e) => {
                      const f = e.target.value;
                      const n = NIVEAUX_PAR_FILIERE(f)[0];
                      setNotesCours({ filiere: f, niveau: n, cours: modulesDe(f, n)[0] });
                    }}
                    className="bg-card border-hair rounded-md px-3 py-2 text-sm"
                  >
                    {FILIERES.map((f) => <option key={f.code} value={f.code}>{f.code === "EPSI" ? f.nom : `${f.code} — ${f.nom}`}</option>)}
                  </select>
                  <select
                    value={notesCours.niveau}
                    onChange={(e) => setNotesCours({ ...notesCours, niveau: e.target.value, cours: modulesDe(notesCours.filiere, e.target.value)[0] })}
                    className="bg-card border-hair rounded-md px-3 py-2 text-sm"
                  >
                    {NIVEAUX_PAR_FILIERE(notesCours.filiere).map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <select
                    value={notesCours.cours}
                    onChange={(e) => setNotesCours({ ...notesCours, cours: e.target.value })}
                    className="bg-card border-hair rounded-md px-3 py-2 text-sm"
                  >
                    {modulesDe(notesCours.filiere, notesCours.niveau).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="bg-card rounded-lg border-hair overflow-x-auto">
                  <div className="px-5 py-4 flex items-center gap-2 ledger-row">
                    <BookOpen size={16} className="text-gold" />
                    <p className="font-display text-lg" style={{ color: "var(--ink)" }}>{notesCours.cours}</p>
                    <span className="text-xs font-mono text-muted ml-2">{etudiantsFiliereCourante.length} étudiants</span>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="ledger-row text-left">
                        <th className="px-4 py-3 font-body font-medium text-muted">Étudiant</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Niveau</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Contrôle continu (/20)</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Examen (/20)</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Moyenne</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Validation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {etudiantsFiliereCourante.map((e) => {
                        const note = e.notes[notesCours.cours];
                        if (!note) return null;
                        return (
                          <tr key={e.id} className="ledger-row">
                            <td className="px-4 py-3 font-body font-medium whitespace-nowrap">{e.prenom} {e.nom}</td>
                            <td className="px-4 py-3 font-body text-muted whitespace-nowrap">{e.niveau}</td>
                            <td className="px-4 py-3">
                              <input
                                type="number" min={0} max={20} step={0.5}
                                value={note.cc}
                                onChange={(ev) => updateNote(e.id, notesCours.cours, "cc", Math.min(20, Math.max(0, Number(ev.target.value))))}
                                className="w-20 font-mono border-hair rounded px-2 py-1"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number" min={0} max={20} step={0.5}
                                value={note.examen}
                                onChange={(ev) => updateNote(e.id, notesCours.cours, "examen", Math.min(20, Math.max(0, Number(ev.target.value))))}
                                className="w-20 font-mono border-hair rounded px-2 py-1"
                              />
                            </td>
                            <td className="px-4 py-3 font-mono font-medium">{moyenneCours(note)}/20</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => toggleValide(e.id, notesCours.cours)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-body font-medium whitespace-nowrap"
                                style={{
                                  background: note.valide ? "rgba(79,111,82,0.12)" : "var(--bg-page)",
                                  color: note.valide ? "var(--sage)" : "var(--text-muted)",
                                }}
                              >
                                <BadgeCheck size={14} /> {note.valide ? "Validé" : "En attente"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ---------------- EMPLOI DU TEMPS ---------------- */}
            {tab === "emploi" && (
              <div className="space-y-6">
                <div className="bg-card rounded-lg border-hair overflow-x-auto">
                  <div className="px-5 py-4 ledger-row flex flex-wrap gap-3 items-center justify-between">
                    <p className="font-display text-lg" style={{ color: "var(--ink)" }}>
                      Grille hebdomadaire — {filiereDe(presenceJour.filiere).court}
                      <span className="text-xs font-mono text-muted ml-2">exemple de répartition des modules</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <select
                        value={presenceJour.filiere}
                        onChange={(e) => setPresenceJour({ ...presenceJour, filiere: e.target.value, niveau: NIVEAUX_PAR_FILIERE(e.target.value)[0] })}
                        className="bg-page border-hair rounded-md px-3 py-1.5 text-sm"
                      >
                        {FILIERES.map((f) => <option key={f.code} value={f.code}>{f.code === "EPSI" ? f.nom : `${f.code} — ${f.nom}`}</option>)}
                      </select>
                      <select
                        value={presenceJour.niveau}
                        onChange={(e) => setPresenceJour({ ...presenceJour, niveau: e.target.value })}
                        className="bg-page border-hair rounded-md px-3 py-1.5 text-sm"
                      >
                        {NIVEAUX_PAR_FILIERE(presenceJour.filiere).map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="ledger-row">
                        <th className="px-4 py-3 text-left font-body font-medium text-muted">Créneau</th>
                        {JOURS.map((j) => (
                          <th key={j} className="px-4 py-3 text-left font-body font-medium text-muted">{j}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {CRENEAUX.map((c, ci) => (
                        <tr key={c} className="ledger-row">
                          <td className="px-4 py-3 font-mono text-xs text-muted whitespace-nowrap">{c}</td>
                          {JOURS.map((j, ji) => {
                            const liste = modulesDe(presenceJour.filiere, presenceJour.niveau);
                            const cours = liste[(ci + ji) % liste.length];
                            const actif = presenceJour.jour === j && presenceJour.creneau === c;
                            return (
                              <td key={j} className="px-4 py-3">
                                <button
                                  onClick={() => setPresenceJour({ ...presenceJour, jour: j, creneau: c })}
                                  className="text-left w-full px-2.5 py-2 rounded-md text-xs font-body"
                                  style={{
                                    background: actif ? "rgba(198,160,92,0.18)" : "var(--bg-page)",
                                    color: "var(--text-primary)",
                                    border: actif ? "1px solid var(--gold)" : "1px solid transparent",
                                  }}
                                >
                                  {cours}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-card rounded-lg border-hair overflow-x-auto">
                  <div className="px-5 py-4 ledger-row">
                    <p className="font-display text-lg" style={{ color: "var(--ink)" }}>
                      Feuille de présence — {presenceJour.jour}, {presenceJour.creneau}
                    </p>
                    <p className="text-xs font-body text-muted mt-1">Touchez un statut pour le faire tourner : présent → absent → retard</p>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="ledger-row text-left">
                        <th className="px-4 py-3 font-body font-medium text-muted">Étudiant</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Niveau</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {etudiantsPresence.map((e) => {
                        const key = `${presenceJour.jour}-${presenceJour.creneau}-${e.id}`;
                        const statut = presenceState[key] || "present";
                        const cfg = {
                          present: { label: "Présent", bg: "rgba(79,111,82,0.12)", fg: "var(--sage)", icon: <Check size={14} /> },
                          absent: { label: "Absent", bg: "rgba(140,47,57,0.12)", fg: "var(--crimson)", icon: <X size={14} /> },
                          retard: { label: "Retard", bg: "rgba(198,160,92,0.18)", fg: "var(--gold-dark)", icon: <Clock3 size={14} /> },
                        }[statut];
                        return (
                          <tr key={e.id} className="ledger-row">
                            <td className="px-4 py-3 font-body font-medium whitespace-nowrap">{e.prenom} {e.nom}</td>
                            <td className="px-4 py-3 font-body text-muted whitespace-nowrap">{e.niveau}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => togglePresence(e.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-body font-medium"
                                style={{ background: cfg.bg, color: cfg.fg }}
                              >
                                {cfg.icon} {cfg.label}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ---------------- DOSSIERS & BOURSES ---------------- */}
            {tab === "dossiers" && (
              <div>
                <p className="text-sm font-body text-muted mb-4">
                  École publique : suivi des pièces du dossier d'inscription administrative et des bourses.
                </p>
                <div className="bg-card rounded-lg border-hair overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="ledger-row text-left">
                        <th className="px-4 py-3 font-body font-medium text-muted">Étudiant</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Niveau</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Pièces reçues</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Bourse</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Statut</th>
                        <th className="px-4 py-3 font-body font-medium text-muted"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {etudiants.map((e) => (
                        <tr key={e.id} className="ledger-row">
                          <td className="px-4 py-3 font-body font-medium whitespace-nowrap">{e.prenom} {e.nom}
                            <span className="block font-mono text-xs text-muted">{e.id}</span>
                          </td>
                          <td className="px-4 py-3 font-body text-muted whitespace-nowrap">{e.niveau}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 rounded-full" style={{ background: "var(--bg-page)" }}>
                                <div
                                  className="h-2 rounded-full"
                                  style={{ width: `${(e.pieces / PIECES_TOTAL) * 100}%`, background: e.pieces >= PIECES_TOTAL ? "var(--sage)" : "var(--gold)" }}
                                />
                              </div>
                              <span className="font-mono text-xs text-muted">{e.pieces}/{PIECES_TOTAL}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-body">{e.bourse ? "Oui" : "Non"}</td>
                          <td className="px-4 py-3"><StatusBadge status={statutDossier(e)} /></td>
                          <td className="px-4 py-3">
                            {e.pieces < PIECES_TOTAL && (
                              <button
                                onClick={() => recevoirPiece(e.id)}
                                className="px-3 py-1.5 rounded-md text-xs font-body font-medium whitespace-nowrap"
                                style={{ background: "var(--gold)", color: "var(--ink)" }}
                              >
                                + Pièce reçue
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* DRAWER DOSSIER ÉTUDIANT */}
      {selected && (
        <div className="fixed inset-0 z-40 flex justify-end" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-card w-full max-w-md h-full overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="font-display text-2xl" style={{ color: "var(--ink)" }}>{selected.prenom} {selected.nom}</p>
                <p className="font-mono text-xs text-muted mt-1">{selected.id}</p>
              </div>
              <button onClick={() => setSelected(null)}><X size={20} className="text-muted" /></button>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <Seal size={44} />
              <div>
                <p className="text-sm font-body font-medium">{filiereDe(selected.filiere).nom}</p>
                <p className="text-xs font-body text-muted">{selected.niveau}</p>
              </div>
            </div>

            <div className="space-y-2 mb-6 text-sm font-body">
              <p className="flex items-center gap-2 text-muted"><Mail size={14} /> {selected.email}</p>
              <p className="flex items-center gap-2 text-muted"><Phone size={14} /> {selected.tel}</p>
            </div>

            <p className="font-display text-lg mb-2" style={{ color: "var(--ink)" }}>Relevé de notes</p>
            <div className="border-hair rounded-lg overflow-hidden mb-6">
              {Object.entries(selected.notes).map(([cours, note]) => (
                <div key={cours} className="ledger-row flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="font-body">{cours}</span>
                  <span className="font-mono font-medium">{moyenneCours(note)}/20</span>
                </div>
              ))}
            </div>

            <p className="font-display text-lg mb-2" style={{ color: "var(--ink)" }}>Statut administratif</p>
            <div className="border-hair rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-body">Présence semestrielle</p>
                  <p className="font-mono text-lg">{selected.presenceTaux}%</p>
                </div>
                <StatusBadge status={statutDossier(selected)} />
              </div>
              <div className="flex items-center justify-between text-sm font-body">
                <span>Pièces reçues</span>
                <span className="font-mono">{selected.pieces}/{PIECES_TOTAL}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-body">
                <span>Bourse</span>
                <span className="font-mono">{selected.bourse ? "Oui" : "Non"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAdd && <AddStudentModal onClose={() => setShowAdd(false)} onSubmit={ajouterEtudiant} />}
    </div>
  );
}

function AddStudentModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ prenom: "", nom: "", filiere: "EPSI", niveau: NIVEAUX_PREPA[0], email: "", tel: "" });
  const update = (k, v) => setForm({ ...form, [k]: v });
  function changeFiliere(code) {
    setForm({ ...form, filiere: code, niveau: NIVEAUX_PAR_FILIERE(code)[0] });
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-card rounded-lg w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <p className="font-display text-xl" style={{ color: "var(--ink)" }}>Nouvel étudiant</p>
          <button onClick={onClose}><X size={20} className="text-muted" /></button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Prénom" value={form.prenom} onChange={(e) => update("prenom", e.target.value)} className="border-hair rounded-md px-3 py-2 text-sm" />
            <input placeholder="Nom" value={form.nom} onChange={(e) => update("nom", e.target.value)} className="border-hair rounded-md px-3 py-2 text-sm" />
          </div>
          <select value={form.filiere} onChange={(e) => changeFiliere(e.target.value)} className="w-full border-hair rounded-md px-3 py-2 text-sm">
            {FILIERES.map((f) => <option key={f.code} value={f.code}>{f.code === "EPSI" ? f.nom : `${f.code} — ${f.nom}`}</option>)}
          </select>
          <select value={form.niveau} onChange={(e) => update("niveau", e.target.value)} className="w-full border-hair rounded-md px-3 py-2 text-sm">
            {NIVEAUX_PAR_FILIERE(form.filiere).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <input placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full border-hair rounded-md px-3 py-2 text-sm" />
          <input placeholder="Téléphone" value={form.tel} onChange={(e) => update("tel", e.target.value)} className="w-full border-hair rounded-md px-3 py-2 text-sm" />
        </div>
        <button
          onClick={() => form.prenom && form.nom && onSubmit(form)}
          className="w-full mt-5 py-2.5 rounded-md text-sm font-body font-medium"
          style={{ background: "var(--gold)", color: "var(--ink)" }}
        >
          Inscrire l'étudiant
        </button>
      </div>
    </div>
  );
}
