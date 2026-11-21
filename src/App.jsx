import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, Users, GraduationCap, CalendarDays, Wallet,
  Search, X, Plus, Check, Clock3, TriangleAlert, ChevronRight,
  Mail, Phone, BadgeCheck, CircleDollarSign, BookOpen, Menu
} from "lucide-react";

/* ---------------------------------------------------------
   DONNÉES DE DÉMONSTRATION
--------------------------------------------------------- */

const FILIERES = ["Informatique", "Gestion & Commerce", "Génie Civil", "Architecture"];

const COURS_PAR_FILIERE = {
  "Informatique": ["Algorithmique", "Bases de données", "Réseaux", "Systèmes d'exploitation"],
  "Gestion & Commerce": ["Comptabilité", "Marketing", "Droit des affaires", "Économie"],
  "Génie Civil": ["Résistance des matériaux", "Topographie", "Béton armé", "Hydraulique"],
  "Architecture": ["Dessin technique", "Histoire de l'architecture", "Urbanisme", "Structures"],
};

const CRENEAUX = ["08:30 – 10:00", "10:15 – 11:45", "13:00 – 14:30", "14:45 – 16:15"];
const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

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
    const filiere = FILIERES[i % FILIERES.length];
    const prenom = pick(PRENOMS);
    const nom = pick(NOMS);
    const annee = pick(["1ère année", "2ème année", "3ème année"]);
    const cours = COURS_PAR_FILIERE[filiere];
    const notes = {};
    cours.forEach((c) => {
      notes[c] = { cc: round1(8 + rnd() * 12), examen: round1(6 + rnd() * 14), valide: rnd() > 0.4 };
    });
    const fraisTotal = 28000;
    const montantPaye = Math.round((rnd() > 0.25 ? fraisTotal : fraisTotal * (0.2 + rnd() * 0.6)) / 500) * 500;
    const presenceTaux = Math.round(70 + rnd() * 30);
    list.push({
      id: `ET-${String(1000 + i)}`,
      prenom, nom, filiere, annee,
      email: `${prenom}.${nom}`.toLowerCase().replace(/\s|'/g, "") + "@campus.ac.ma",
      tel: `06${Math.floor(10000000 + rnd() * 89999999)}`,
      notes,
      fraisTotal,
      montantPaye: Math.min(montantPaye, fraisTotal),
      presenceTaux,
    });
  }
  return list;
}

const ETUDIANTS_INIT = genererEtudiants(18);

function moyenneCours(note) {
  return round1(note.cc * 0.4 + note.examen * 0.6);
}
function moyenneGenerale(etudiant) {
  const vals = Object.values(etudiant.notes).map(moyenneCours);
  if (!vals.length) return 0;
  return round1(vals.reduce((a, b) => a + b, 0) / vals.length);
}
function statutPaiement(etudiant) {
  if (etudiant.montantPaye >= etudiant.fraisTotal) return "Payé";
  if (etudiant.montantPaye > 0) return "Partiel";
  return "Impayé";
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
    "Payé": { bg: "rgba(79,111,82,0.12)", fg: "var(--sage)", icon: <Check size={12} /> },
    "Partiel": { bg: "rgba(176,141,70,0.15)", fg: "var(--gold-dark)", icon: <Clock3 size={12} /> },
    "Impayé": { bg: "rgba(140,47,57,0.12)", fg: "var(--crimson)", icon: <TriangleAlert size={12} /> },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium font-body"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.icon}{status}
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
  { key: "paiements", label: "Paiements", icon: Wallet },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [etudiants, setEtudiants] = useState(ETUDIANTS_INIT);
  const [search, setSearch] = useState("");
  const [filiereFiltre, setFiliereFiltre] = useState("Toutes");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showPay, setShowPay] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notesCours, setNotesCours] = useState({ filiere: FILIERES[0], cours: COURS_PAR_FILIERE[FILIERES[0]][0] });
  const [presenceJour, setPresenceJour] = useState({ jour: "Lundi", creneau: CRENEAUX[0], filiere: FILIERES[0] });
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
    const revenus = etudiants.reduce((a, e) => a + e.montantPaye, 0);
    return { total, moyGen, presenceMoy, revenus };
  }, [etudiants]);

  const parFiliere = FILIERES.map((f) => ({
    filiere: f,
    count: etudiants.filter((e) => e.filiere === f).length,
  }));
  const maxCount = Math.max(...parFiliere.map((d) => d.count), 1);

  function updateNote(id, cours, champ, valeur) {
    setEtudiants((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const notes = { ...e.notes, [cours]: { ...e.notes[cours], [champ]: valeur } };
        return { ...e, notes };
      })
    );
  }

  function toggleValide(id, cours) {
    setEtudiants((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const notes = { ...e.notes, [cours]: { ...e.notes[cours], valide: !e.notes[cours].valide } };
        return { ...e, notes };
      })
    );
  }

  function enregistrerPaiement(id, montant) {
    setEtudiants((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, montantPaye: Math.min(e.fraisTotal, e.montantPaye + montant) } : e
      )
    );
    setShowPay(null);
  }

  function ajouterEtudiant(data) {
    const filiere = data.filiere;
    const cours = COURS_PAR_FILIERE[filiere];
    const notes = {};
    cours.forEach((c) => (notes[c] = { cc: 0, examen: 0, valide: false }));
    const nouvel = {
      id: `ET-${1000 + etudiants.length + Math.floor(rnd() * 900)}`,
      prenom: data.prenom, nom: data.nom, filiere, annee: data.annee,
      email: data.email, tel: data.tel,
      notes, fraisTotal: 28000, montantPaye: 0, presenceTaux: 100,
    };
    setEtudiants((prev) => [nouvel, ...prev]);
    setShowAdd(false);
  }

  const etudiantsFiliereCourante = etudiants.filter((e) => e.filiere === notesCours.filiere);
  const etudiantsPresence = etudiants.filter((e) => e.filiere === presenceJour.filiere);

  function togglePresence(id) {
    const key = `${presenceJour.jour}-${presenceJour.creneau}-${id}`;
    setPresenceState((prev) => {
      const current = prev[key] || "present";
      const next = current === "present" ? "absent" : current === "absent" ? "retard" : "present";
      return { ...prev, [key]: next };
    });
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
              <p className="font-display text-lg leading-tight" style={{ color: "#F4F0E6" }}>Institut Al Ma'arifa</p>
              <p className="text-[11px] tracking-wide font-body" style={{ color: "var(--gold)" }}>Registre académique</p>
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
            <p className="font-mono text-sm" style={{ color: "#E7E9ED" }}>2025 – 2026</p>
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
              <div>
                <p className="font-display text-xl lg:text-2xl" style={{ color: "var(--ink)" }}>
                  {NAV.find((n) => n.key === tab)?.label}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-page rounded-md px-3 py-2 border-hair">
              <Search size={15} className="text-muted" />
              <input
                type="text"
                placeholder="Rechercher un étudiant…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm w-48"
              />
            </div>
          </div>

          <div className="p-4 lg:p-8">
            {/* ---------------- DASHBOARD ---------------- */}
            {tab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <KpiCard label="Étudiants inscrits" value={kpis.total} sub="Toutes filières confondues" icon={<Users size={18} color="#F4F0E6" />} />
                  <KpiCard label="Moyenne générale" value={`${kpis.moyGen}/20`} sub="Toutes matières" icon={<GraduationCap size={18} color="#F4F0E6" />} />
                  <KpiCard label="Taux de présence" value={`${kpis.presenceMoy}%`} sub="Moyenne du semestre" icon={<CalendarDays size={18} color="#F4F0E6" />} />
                  <KpiCard label="Revenus encaissés" value={`${kpis.revenus.toLocaleString("fr-FR")} MAD`} sub="Frais de scolarité" icon={<CircleDollarSign size={18} color="#F4F0E6" />} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  <div className="bg-card rounded-lg p-6 border-hair lg:col-span-3">
                    <p className="font-display text-lg mb-4" style={{ color: "var(--ink)" }}>Répartition par filière</p>
                    <div className="space-y-4">
                      {parFiliere.map((d) => (
                        <div key={d.filiere}>
                          <div className="flex justify-between text-sm font-body mb-1">
                            <span style={{ color: "var(--text-primary)" }}>{d.filiere}</span>
                            <span className="font-mono text-muted">{d.count}</span>
                          </div>
                          <div className="w-full h-2 rounded-full" style={{ background: "var(--bg-page)" }}>
                            <div
                              className="h-2 rounded-full"
                              style={{ width: `${(d.count / maxCount) * 100}%`, background: "var(--gold)" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-6 border-hair lg:col-span-2">
                    <p className="font-display text-lg mb-4" style={{ color: "var(--ink)" }}>Statut des paiements</p>
                    <div className="space-y-3">
                      {["Payé", "Partiel", "Impayé"].map((s) => {
                        const count = etudiants.filter((e) => statutPaiement(e) === s).length;
                        return (
                          <div key={s} className="flex items-center justify-between ledger-row pb-3">
                            <StatusBadge status={s} />
                            <span className="font-mono text-sm text-muted">{count} étudiant{count > 1 ? "s" : ""}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- ETUDIANTS ---------------- */}
            {tab === "etudiants" && (
              <div>
                <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFiliereFiltre("Toutes")}
                      className="px-3 py-1.5 rounded-full text-sm font-body border-hair"
                      style={{ background: filiereFiltre === "Toutes" ? "var(--ink)" : "var(--bg-card)", color: filiereFiltre === "Toutes" ? "#fff" : "var(--text-primary)" }}
                    >
                      Toutes ({etudiants.length})
                    </button>
                    {FILIERES.map((f) => (
                      <button
                        key={f}
                        onClick={() => setFiliereFiltre(f)}
                        className="px-3 py-1.5 rounded-full text-sm font-body border-hair"
                        style={{ background: filiereFiltre === f ? "var(--ink)" : "var(--bg-card)", color: filiereFiltre === f ? "#fff" : "var(--text-primary)" }}
                      >
                        {f}
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
                        <th className="px-4 py-3 font-body font-medium text-muted">Année</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Moyenne</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Présence</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Paiement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((e) => (
                        <tr
                          key={e.id}
                          className="ledger-row cursor-pointer hover:bg-page/40"
                          onClick={() => setSelected(e)}
                        >
                          <td className="px-4 py-3 font-mono text-xs text-muted">{e.id}</td>
                          <td className="px-4 py-3 font-body font-medium">{e.prenom} {e.nom}</td>
                          <td className="px-4 py-3 font-body">{e.filiere}</td>
                          <td className="px-4 py-3 font-body text-muted">{e.annee}</td>
                          <td className="px-4 py-3 font-mono">{moyenneGenerale(e)}/20</td>
                          <td className="px-4 py-3 font-mono">{e.presenceTaux}%</td>
                          <td className="px-4 py-3"><StatusBadge status={statutPaiement(e)} /></td>
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
                    onChange={(e) => setNotesCours({ filiere: e.target.value, cours: COURS_PAR_FILIERE[e.target.value][0] })}
                    className="bg-card border-hair rounded-md px-3 py-2 text-sm"
                  >
                    {FILIERES.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <select
                    value={notesCours.cours}
                    onChange={(e) => setNotesCours({ ...notesCours, cours: e.target.value })}
                    className="bg-card border-hair rounded-md px-3 py-2 text-sm"
                  >
                    {COURS_PAR_FILIERE[notesCours.filiere].map((c) => <option key={c} value={c}>{c}</option>)}
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
                        <th className="px-4 py-3 font-body font-medium text-muted">Contrôle continu (/20)</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Examen (/20)</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Moyenne</th>
                        <th className="px-4 py-3 font-body font-medium text-muted">Validation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {etudiantsFiliereCourante.map((e) => {
                        const note = e.notes[notesCours.cours];
                        return (
                          <tr key={e.id} className="ledger-row">
                            <td className="px-4 py-3 font-body font-medium">{e.prenom} {e.nom}</td>
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
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-body font-medium"
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
                  <div className="px-5 py-4 ledger-row flex items-center justify-between">
                    <p className="font-display text-lg" style={{ color: "var(--ink)" }}>Grille hebdomadaire — {presenceJour.filiere}</p>
                    <select
                      value={presenceJour.filiere}
                      onChange={(e) => setPresenceJour({ ...presenceJour, filiere: e.target.value })}
                      className="bg-page border-hair rounded-md px-3 py-1.5 text-sm"
                    >
                      {FILIERES.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
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
                            const cours = COURS_PAR_FILIERE[presenceJour.filiere][(ci + ji) % COURS_PAR_FILIERE[presenceJour.filiere].length];
                            return (
                              <td key={j} className="px-4 py-3">
                                <button
                                  onClick={() => setPresenceJour({ jour: j, creneau: c, filiere: presenceJour.filiere })}
                                  className="text-left w-full px-2.5 py-2 rounded-md text-xs font-body"
                                  style={{
                                    background: presenceJour.jour === j && presenceJour.creneau === c ? "rgba(198,160,92,0.18)" : "var(--bg-page)",
                                    color: "var(--text-primary)",
                                    border: presenceJour.jour === j && presenceJour.creneau === c ? "1px solid var(--gold)" : "1px solid transparent",
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
                    <p className="text-xs font-body text-muted mt-1">Cliquez sur un statut pour le faire tourner : présent → absent → retard</p>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="ledger-row text-left">
                        <th className="px-4 py-3 font-body font-medium text-muted">Étudiant</th>
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
                            <td className="px-4 py-3 font-body font-medium">{e.prenom} {e.nom}</td>
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

            {/* ---------------- PAIEMENTS ---------------- */}
            {tab === "paiements" && (
              <div className="bg-card rounded-lg border-hair overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="ledger-row text-left">
                      <th className="px-4 py-3 font-body font-medium text-muted">Étudiant</th>
                      <th className="px-4 py-3 font-body font-medium text-muted">Frais total</th>
                      <th className="px-4 py-3 font-body font-medium text-muted">Payé</th>
                      <th className="px-4 py-3 font-body font-medium text-muted">Solde</th>
                      <th className="px-4 py-3 font-body font-medium text-muted">Statut</th>
                      <th className="px-4 py-3 font-body font-medium text-muted"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {etudiants.map((e) => {
                      const solde = e.fraisTotal - e.montantPaye;
                      return (
                        <tr key={e.id} className="ledger-row">
                          <td className="px-4 py-3 font-body font-medium">{e.prenom} {e.nom}
                            <span className="block font-mono text-xs text-muted">{e.id}</span>
                          </td>
                          <td className="px-4 py-3 font-mono">{e.fraisTotal.toLocaleString("fr-FR")} MAD</td>
                          <td className="px-4 py-3 font-mono">{e.montantPaye.toLocaleString("fr-FR")} MAD</td>
                          <td className="px-4 py-3 font-mono" style={{ color: solde > 0 ? "var(--crimson)" : "var(--sage)" }}>
                            {solde.toLocaleString("fr-FR")} MAD
                          </td>
                          <td className="px-4 py-3"><StatusBadge status={statutPaiement(e)} /></td>
                          <td className="px-4 py-3">
                            {solde > 0 && (
                              <button
                                onClick={() => setShowPay(e)}
                                className="px-3 py-1.5 rounded-md text-xs font-body font-medium"
                                style={{ background: "var(--gold)", color: "var(--ink)" }}
                              >
                                Encaisser
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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

            <div className="flex items-center gap-2 mb-5">
              <Seal size={44} />
              <div>
                <p className="text-sm font-body font-medium">{selected.filiere}</p>
                <p className="text-xs font-body text-muted">{selected.annee}</p>
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
            <div className="border-hair rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-body">Présence semestrielle</p>
                <p className="font-mono text-lg">{selected.presenceTaux}%</p>
              </div>
              <StatusBadge status={statutPaiement(selected)} />
            </div>
          </div>
        </div>
      )}

      {/* MODAL AJOUT ÉTUDIANT */}
      {showAdd && (
        <AddStudentModal onClose={() => setShowAdd(false)} onSubmit={ajouterEtudiant} />
      )}

      {/* MODAL PAIEMENT */}
      {showPay && (
        <PayModal etudiant={showPay} onClose={() => setShowPay(null)} onSubmit={enregistrerPaiement} />
      )}
    </div>
  );
}

function AddStudentModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ prenom: "", nom: "", filiere: FILIERES[0], annee: "1ère année", email: "", tel: "" });
  const update = (k, v) => setForm({ ...form, [k]: v });
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
          <select value={form.filiere} onChange={(e) => update("filiere", e.target.value)} className="w-full border-hair rounded-md px-3 py-2 text-sm">
            {FILIERES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <select value={form.annee} onChange={(e) => update("annee", e.target.value)} className="w-full border-hair rounded-md px-3 py-2 text-sm">
            {["1ère année", "2ème année", "3ème année"].map((a) => <option key={a} value={a}>{a}</option>)}
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

function PayModal({ etudiant, onClose, onSubmit }) {
  const solde = etudiant.fraisTotal - etudiant.montantPaye;
  const [montant, setMontant] = useState(solde);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-card rounded-lg w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <p className="font-display text-xl" style={{ color: "var(--ink)" }}>Encaisser un paiement</p>
          <button onClick={onClose}><X size={20} className="text-muted" /></button>
        </div>
        <p className="text-sm font-body mb-1">{etudiant.prenom} {etudiant.nom}</p>
        <p className="text-xs font-mono text-muted mb-4">Solde restant : {solde.toLocaleString("fr-FR")} MAD</p>
        <input
          type="number" min={0} max={solde}
          value={montant}
          onChange={(e) => setMontant(Math.min(solde, Math.max(0, Number(e.target.value))))}
          className="w-full border-hair rounded-md px-3 py-2 text-sm font-mono mb-4"
        />
        <button
          onClick={() => onSubmit(etudiant.id, montant)}
          className="w-full py-2.5 rounded-md text-sm font-body font-medium"
          style={{ background: "var(--gold)", color: "var(--ink)" }}
        >
          Confirmer l'encaissement
        </button>
      </div>
    </div>
  );
}
