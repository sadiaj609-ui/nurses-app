import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════
   DATA BANK
══════════════════════════════════════════ */

const MCQ_BANK = [
  { id:1, q:"What is the normal adult resting heart rate?", opts:["40–60 bpm","60–100 bpm","100–120 bpm","120–160 bpm"], ans:1, explain:"Normal HR is 60–100 bpm. Below 60 = bradycardia, above 100 = tachycardia.", cat:"Cardiovascular" },
  { id:2, q:"Normal blood pressure in a healthy adult is:", opts:["90/60 mmHg","120/80 mmHg","140/90 mmHg","160/100 mmHg"], ans:1, explain:"120/80 mmHg is normal. ≥140/90 is hypertension; <90/60 is hypotension.", cat:"Cardiovascular" },
  { id:3, q:"Which vitamin is synthesized through sunlight?", opts:["Vitamin A","Vitamin B12","Vitamin C","Vitamin D"], ans:3, explain:"UV-B rays convert 7-dehydrocholesterol in skin to Vitamin D3.", cat:"Nutrition" },
  { id:4, q:"Normal respiratory rate for adults (breaths/min):", opts:["8–10","12–20","22–28","30–36"], ans:1, explain:"Normal RR: 12–20/min. <12 = bradypnea, >20 = tachypnea.", cat:"Respiratory" },
  { id:5, q:"Maximum score on the Glasgow Coma Scale:", opts:["10","12","15","18"], ans:2, explain:"GCS max = 15 (Eye 4 + Verbal 5 + Motor 6). Minimum = 3.", cat:"Neurological" },
  { id:6, q:"Normal oral body temperature:", opts:["35.5°C","36.1–37.2°C","38.0°C","39.0°C"], ans:1, explain:"Normal oral temp: 36.1–37.2°C. Above 38°C = fever.", cat:"Basic Nursing" },
  { id:7, q:"Which blood type is the universal donor?", opts:["A+","B+","O−","AB+"], ans:2, explain:"O− lacks A, B antigens and Rh factor — safe for all recipients.", cat:"Hematology" },
  { id:8, q:"Normal SpO₂ (oxygen saturation):", opts:["85–90%","90–94%","95–100%","100% only"], ans:2, explain:"Normal SpO₂: 95–100%. Below 90% requires immediate intervention.", cat:"Respiratory" },
  { id:9, q:"Which hormone primarily regulates blood glucose?", opts:["Cortisol","Insulin","Glucagon","Adrenaline"], ans:1, explain:"Insulin (from pancreatic beta cells) lowers blood glucose.", cat:"Endocrine" },
  { id:10, q:"Normal serum potassium level:", opts:["1.5–2.5 mEq/L","3.5–5.0 mEq/L","5.5–7.0 mEq/L","7.5–9.0 mEq/L"], ans:1, explain:"Normal K+: 3.5–5.0 mEq/L. <3.5 = hypokalemia, >5.0 = hyperkalemia.", cat:"Lab Values" },
];

const NCLEX_BANK = [
  {
    id:1, type:"SATA", category:"Cardiovascular",
    q:"A nurse is caring for a patient with heart failure. Which interventions should be included? (Select ALL that apply)",
    opts:["Weigh patient daily at same time","Encourage 3L fluid intake daily","Monitor for peripheral edema","Elevate head of bed 30–45°","Restrict sodium as ordered"],
    ans:[0,2,3,4],
    rationale:"Daily weights detect fluid retention. HOB elevation reduces dyspnea. Monitoring edema tracks status. Sodium restriction prevents fluid overload. Fluids are restricted, NOT encouraged in HF.",
  },
  {
    id:2, type:"Priority", category:"Emergency",
    q:"Which patient should the nurse assess FIRST?",
    opts:["Patient with COPD requesting pain meds","Post-op patient with SpO₂ of 88%","Patient asking for help to bathroom","Patient requesting discharge instructions"],
    ans:[1],
    rationale:"SpO₂ of 88% is critically low (normal 95–100%). This is life-threatening. Airway/breathing always takes priority per Maslow's hierarchy.",
  },
  {
    id:3, type:"Calculation", category:"Pharmacology",
    q:"Order: 500mg Amoxicillin. Available: 250mg/5mL. How many mL should the nurse give?",
    opts:["5 mL","10 mL","15 mL","20 mL"],
    ans:[1],
    rationale:"Formula: (Desired ÷ Have) × Volume = (500 ÷ 250) × 5 = 10 mL ✓",
  },
  {
    id:4, type:"SATA", category:"Neurological",
    q:"Which findings indicate increased intracranial pressure (ICP)? (Select ALL that apply)",
    opts:["Widening pulse pressure","Bradycardia","Irregular respirations","Pinpoint pupils","Morning headache worse when lying down"],
    ans:[0,1,2,4],
    rationale:"Cushing's Triad = widened pulse pressure + bradycardia + irregular breathing. Morning headache is classic ICP sign. Pinpoint pupils suggest opioid use or pontine damage, not ICP.",
  },
  {
    id:5, type:"Priority", category:"Delegation",
    q:"Which task is MOST appropriate to delegate to a nursing assistant (CNA)?",
    opts:["Assessing a new post-op patient","Administering oral medications","Measuring and recording urine output","Teaching patient about diabetes diet"],
    ans:[2],
    rationale:"CNAs can perform basic tasks: measuring I&O, vital signs, hygiene. Assessment, medication administration, and patient teaching require an RN.",
  },
  {
    id:6, type:"MCQ", category:"OB/GYN",
    q:"A patient is at 28 weeks gestation with BP 158/102, severe headache, and +3 proteinuria. The nurse suspects:",
    opts:["Gestational hypertension","Mild preeclampsia","Severe preeclampsia","HELLP syndrome"],
    ans:[2],
    rationale:"Severe preeclampsia: BP ≥160/110, severe headache, visual changes, and significant proteinuria (≥5g/24hr or ≥3+ dipstick). Immediate intervention required.",
  },
  {
    id:7, type:"SATA", category:"Pharmacology",
    q:"Patient teaching about Warfarin therapy. Which statements show correct understanding? (Select ALL that apply)",
    opts:["'I will get my INR checked regularly'","'I can take Aspirin for headaches'","'I'll eat consistent amounts of leafy greens'","'I'll report any unusual bruising or bleeding'","'I'll double dose if I miss one'"],
    ans:[0,2,3],
    rationale:"Regular INR monitoring is essential. Consistent Vitamin K intake prevents INR fluctuation. Report bleeding signs immediately. Aspirin increases bleed risk. NEVER double-dose — contact provider.",
  },
  {
    id:8, type:"MCQ", category:"Renal",
    q:"A patient in the oliguric phase of AKI has K+ of 6.5 mEq/L. The nurse's PRIORITY action is:",
    opts:["Encourage high-potassium foods","Notify the physician immediately","Document and reassess in 1 hour","Administer potassium supplement"],
    ans:[1],
    rationale:"K+ 6.5 mEq/L = dangerous hyperkalemia (normal 3.5–5.0). Risk of fatal cardiac arrhythmia. Notify physician IMMEDIATELY for intervention (Kayexalate, dialysis).",
  },
];

const NOTES_DATA = [
  {
    id:1, emoji:"❤️", title:"Vital Signs", tag:"Basic Nursing", color:"#ef4444",
    sections:[
      { heading:"Normal Values", items:["Temperature: 36.1–37.2°C (oral)","Heart Rate: 60–100 bpm","Respiratory Rate: 12–20/min","Blood Pressure: 120/80 mmHg","SpO₂: 95–100%"] },
      { heading:"Temperature Routes", items:["Oral: standard baseline","Rectal: +0.5°C higher (most accurate)","Axillary: −0.5°C lower","Tympanic: close to core temp"] },
      { heading:"Abnormal Findings", items:["Fever: >38°C | Hypothermia: <35°C","Bradycardia: <60 bpm | Tachycardia: >100 bpm","Bradypnea: <12/min | Tachypnea: >20/min","Hypertension: ≥140/90 | Hypotension: <90/60"] },
    ],
  },
  {
    id:2, emoji:"💉", title:"IV Fluid Therapy", tag:"Pharmacology", color:"#3b82f6",
    sections:[
      { heading:"Isotonic Solutions (~285 mOsm/L)", items:["0.9% NaCl (Normal Saline) — volume expansion","Lactated Ringer's — surgery, burns, trauma","D5W — free water (isotonic in bag, hypotonic in body)"] },
      { heading:"Hypertonic (>285 mOsm/L)", items:["3% NaCl — severe hyponatremia (ICU only)","D10W, D50W — hypoglycemia","Effect: pulls fluid OUT of cells"] },
      { heading:"Hypotonic (<285 mOsm/L)", items:["0.45% NaCl — cellular rehydration","Effect: pushes fluid INTO cells","Caution: can cause cerebral edema"] },
      { heading:"Nursing Points", items:["Check IV site for infiltration q2h","Monitor: crackles, edema, dyspnea (fluid overload)","Document I&O every shift accurately"] },
    ],
  },
  {
    id:3, emoji:"🧠", title:"Neurological Assessment", tag:"Neuro Nursing", color:"#8b5cf6",
    sections:[
      { heading:"Glasgow Coma Scale (GCS)", items:["Eye Opening: Spontaneous=4, Voice=3, Pain=2, None=1","Verbal: Oriented=5, Confused=4, Words=3, Sounds=2, None=1","Motor: Obeys=6, Localizes=5, Withdraws=4, Flexion=3, Extension=2, None=1","Total: Max=15 (Normal) | Min=3 | Severe ≤8"] },
      { heading:"Cushing's Triad (↑ICP)", items:["Hypertension with widened pulse pressure","Bradycardia","Irregular (Cheyne-Stokes) breathing","= Medical emergency! Notify MD immediately"] },
      { heading:"Pupil Assessment", items:["PERRLA: Pupils Equal Round Reactive to Light & Accommodation","Unequal pupils (anisocoria) = brain herniation","Pinpoint pupils = opioids or pontine lesion","Blown (fixed dilated) pupil = herniation emergency"] },
    ],
  },
  {
    id:4, emoji:"💊", title:"Drug Calculations", tag:"Pharmacology", color:"#f59e0b",
    sections:[
      { heading:"Basic Dose Formula", items:["(Desired Dose ÷ Dose on Hand) × Volume","Example: Want 500mg, have 250mg/5mL","= (500 ÷ 250) × 5 = 10 mL ✓"] },
      { heading:"IV Drip Rate (gtt/min)", items:["(Volume mL × Drop Factor) ÷ Time in minutes","Macrodrip: 10, 15, or 20 gtt/mL","Microdrip: 60 gtt/mL","Example: 1000mL/8hr, df=20 → (1000×20)÷480 = 42 gtt/min"] },
      { heading:"Weight-Based Dose", items:["Dose = mg/kg × Patient Weight","Example: 5mg/kg for 60kg = 300mg total"] },
      { heading:"5 Rights of Medication", items:["✓ Right Patient","✓ Right Drug","✓ Right Dose","✓ Right Route","✓ Right Time"] },
    ],
  },
  {
    id:5, emoji:"🦠", title:"Infection Control", tag:"Microbiology", color:"#10b981",
    sections:[
      { heading:"Standard Precautions (ALL patients)", items:["Hand hygiene — #1 prevention measure","PPE: gloves, gown, mask, eye protection","Safe sharps disposal — never recap needles","Respiratory hygiene & cough etiquette"] },
      { heading:"Transmission-Based Precautions", items:["Contact (MRSA, VRE, C.diff): gloves + gown on entry","Droplet (Flu, COVID, Mumps): surgical mask, <1 meter","Airborne (TB, Measles, Varicella): N95 + negative pressure room"] },
      { heading:"WHO 5 Moments of Hand Hygiene", items:["1️⃣ Before patient contact","2️⃣ Before aseptic procedure","3️⃣ After body fluid exposure","4️⃣ After patient contact","5️⃣ After touching patient surroundings"] },
    ],
  },
  {
    id:6, emoji:"🩹", title:"Wound Care", tag:"Clinical Skills", color:"#ec4899",
    sections:[
      { heading:"TIME Framework for Assessment", items:["T — Tissue type (granulation/slough/necrotic)","I — Infection or Inflammation signs","M — Moisture balance (too wet or dry)","E — Edge (advancing = healing, non-advancing = stalled)"] },
      { heading:"Wound Colors", items:["🔴 Red = healthy granulation → protect it","🟡 Yellow = slough → debride & clean","⚫ Black = necrosis → surgical debridement","🩷 Pink = epithelialization → keep moist"] },
      { heading:"Dressing Types", items:["Hydrocolloid — low to moderate exudate","Hydrogel — dry wounds, autolytic debridement","Alginate — heavy exudate wounds","Foam — moderate to heavy exudate"] },
    ],
  },
];

const ENGLISH_DATA = [
  {
    id:1, icon:"🔤", title:"Medical Terminology", level:"Beginner",
    words:[
      {term:"Tachycardia", def:"Abnormally fast heart rate (>100 bpm)"},
      {term:"Bradycardia", def:"Abnormally slow heart rate (<60 bpm)"},
      {term:"Dyspnea", def:"Difficulty or labored breathing"},
      {term:"Edema", def:"Swelling from excess fluid in tissues"},
      {term:"Febrile", def:"Having a fever; elevated body temperature"},
      {term:"Diaphoresis", def:"Profuse sweating, often from illness"},
      {term:"Pallor", def:"Abnormal paleness of skin"},
      {term:"Cyanosis", def:"Bluish discoloration due to low oxygen"},
    ],
    sentence:"The patient presents febrile at 39.1°C with diaphoresis and dyspnea on exertion.",
  },
  {
    id:2, icon:"💬", title:"Patient Communication", level:"Intermediate",
    words:[
      {term:"Chief complaint", def:"Primary reason patient is seeking care"},
      {term:"Onset", def:"When symptoms first began"},
      {term:"Severity", def:"Intensity rated 0–10 on pain scale"},
      {term:"Alleviating factors", def:"What makes symptoms better"},
      {term:"Aggravating factors", def:"What makes symptoms worse"},
      {term:"Radiating pain", def:"Pain spreading from one area to another"},
      {term:"Informed consent", def:"Voluntary agreement after being fully informed"},
      {term:"Therapeutic communication", def:"Purposeful interaction to support wellbeing"},
    ],
    sentence:"Can you describe your chief complaint? Does the pain radiate anywhere, and what alleviates it?",
  },
  {
    id:3, icon:"📋", title:"Clinical Documentation", level:"Advanced",
    words:[
      {term:"SOAP note", def:"Subjective, Objective, Assessment, Plan format"},
      {term:"SBAR", def:"Situation, Background, Assessment, Recommendation"},
      {term:"PRN", def:"Pro re nata — administer as needed"},
      {term:"NPO", def:"Nil per os — nothing by mouth"},
      {term:"ADL", def:"Activities of Daily Living"},
      {term:"Critical value", def:"Lab result needing immediate MD notification"},
      {term:"Incident report", def:"Documentation of unexpected clinical events"},
      {term:"Care plan", def:"Individualized nursing interventions for patient goals"},
    ],
    sentence:"Patient is NPO for surgery. SBAR report given to oncoming nurse. PRN analgesics administered with documented pain reassessment.",
  },
  {
    id:4, icon:"🚨", title:"Emergency Phrases", level:"Intermediate",
    words:[
      {term:"Code Blue", def:"Cardiac or respiratory arrest — call resuscitation team"},
      {term:"Rapid Response", def:"Early intervention before full cardiac arrest"},
      {term:"Stat", def:"Immediately, without delay"},
      {term:"DNR / DNI", def:"Do Not Resuscitate / Do Not Intubate"},
      {term:"Triage", def:"Prioritizing patients by urgency of need"},
      {term:"ABCs", def:"Airway, Breathing, Circulation — primary survey"},
      {term:"Crash cart", def:"Emergency equipment trolley for resuscitation"},
      {term:"Bolus", def:"Rapid IV fluid or medication administration"},
    ],
    sentence:"Stat! Call a Code Blue — patient is unresponsive and pulseless. Bring the crash cart immediately!",
  },
];

const PDF_DATA = [
  { id:1, icon:"📘", title:"NCLEX-RN Complete Study Guide 2024", pages:280, size:"14.2 MB", tag:"NCLEX", free:true },
  { id:2, icon:"📗", title:"NCLEX-PN Exam Preparation", pages:195, size:"10.1 MB", tag:"NCLEX", free:false },
  { id:3, icon:"💊", title:"Pharmacology for Nurses — Full Notes", pages:85, size:"5.1 MB", tag:"Pharmacology", free:false },
  { id:4, icon:"🫀", title:"Anatomy & Physiology Quick Review", pages:60, size:"4.3 MB", tag:"Anatomy", free:true },
  { id:5, icon:"🏥", title:"Medical-Surgical Nursing Comprehensive", pages:200, size:"12.8 MB", tag:"Clinical", free:false },
  { id:6, icon:"👶", title:"Pediatric Nursing Complete Notes", pages:75, size:"4.9 MB", tag:"Pediatrics", free:true },
  { id:7, icon:"🤰", title:"Obstetric & Maternity Nursing Guide", pages:110, size:"7.6 MB", tag:"OB/GYN", free:false },
  { id:8, icon:"🧠", title:"Psychiatric & Mental Health Nursing", pages:90, size:"5.8 MB", tag:"Psych", free:true },
  { id:9, icon:"📝", title:"NCLEX Alternate Format Questions (SATA)", pages:150, size:"8.4 MB", tag:"NCLEX", free:false },
  { id:10, icon:"🔬", title:"Lab Values Quick Reference Card", pages:20, size:"1.2 MB", tag:"Lab Values", free:true },
];

const FLASHCARDS = [
  { front:"What is Cushing's Triad?", back:"Hypertension + Bradycardia + Irregular breathing = Sign of ↑ICP" },
  { front:"Normal INR range for patient on Warfarin?", back:"Therapeutic INR: 2.0–3.0 (or 2.5–3.5 for mechanical valves)" },
  { front:"What does SBAR stand for?", back:"Situation → Background → Assessment → Recommendation" },
  { front:"Signs of Pulmonary Embolism?", back:"Sudden dyspnea, tachycardia, pleuritic chest pain, hemoptysis" },
  { front:"What is the RACE acronym in fire safety?", back:"Rescue → Alarm → Contain → Extinguish/Evacuate" },
  { front:"Normal urine output per hour?", back:"≥0.5 mL/kg/hr. Below = oliguria, possible kidney issue" },
  { front:"What does NPO mean and when is it used?", back:"Nothing by mouth — used before surgery or procedures" },
  { front:"What are the 5 Rights of Medication?", back:"Right Patient, Drug, Dose, Route, Time" },
];

/* ══════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════ */
const PAGES = [
  { id:"home",       icon:"🏠",  label:"Home" },
  { id:"mcq",        icon:"📝",  label:"Daily MCQ" },
  { id:"nclex",      icon:"🎓",  label:"NCLEX Prep" },
  { id:"notes",      icon:"📖",  label:"Nursing Notes" },
  { id:"quiz",       icon:"⏱️",  label:"Quiz Test" },
  { id:"english",    icon:"🌐",  label:"English" },
  { id:"flashcards", icon:"🃏",  label:"Flashcards" },
  { id:"pdf",        icon:"📄",  label:"PDF Corner" },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const go = (p) => { setPage(p); setSidebarOpen(false); };

  return (
    <>
      <style>{CSS}</style>
      <div className="shell">
        {/* Sidebar */}
        <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
          <div className="sb-logo">
            <span className="sb-logo-icon">🩺</span>
            <div>
              <div className="sb-logo-name">Nurses.com</div>
              <div className="sb-logo-sub">Bangladesh</div>
            </div>
          </div>
          <nav className="sb-nav">
            {PAGES.map(p => (
              <button key={p.id} className={`sb-link${page === p.id ? " active" : ""}`} onClick={() => go(p.id)}>
                <span className="sb-link-icon">{p.icon}</span>
                <span>{p.label}</span>
                {p.id === "nclex" && <span className="sb-badge">HOT</span>}
                {p.id === "flashcards" && <span className="sb-badge new">NEW</span>}
              </button>
            ))}
          </nav>
          <div className="sb-pro">
            <div className="sb-pro-icon">⭐</div>
            <div>
              <div className="sb-pro-title">Go Premium</div>
              <div className="sb-pro-sub">Unlock everything</div>
            </div>
          </div>
        </aside>

        {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

        {/* Main */}
        <div className="main">
          <header className="topbar">
            <div className="topbar-left">
              <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>☰</button>
              <div>
                <div className="topbar-title">{PAGES.find(p => p.id === page)?.label}</div>
                <div className="topbar-sub">Nurses.com BD</div>
              </div>
            </div>
            <div className="topbar-right">
              <div className="streak">🔥 7 days</div>
              <div className="avatar">NS</div>
            </div>
          </header>

          <div className="body">
            {page === "home"       && <HomePage go={go} />}
            {page === "mcq"        && <MCQPage />}
            {page === "nclex"      && <NclexPage />}
            {page === "notes"      && <NotesPage />}
            {page === "quiz"       && <QuizPage />}
            {page === "english"    && <EnglishPage />}
            {page === "flashcards" && <FlashcardsPage />}
            {page === "pdf"        && <PDFPage />}
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   HOME
══════════════════════════════════════════ */
function HomePage({ go }) {
  return (
    <div className="page-wrap">
      {/* Hero */}
      <div className="hero">
        <div>
          <div className="hero-chip">🎯 Your Daily Study Hub</div>
          <h1 className="hero-h1">Master Nursing.<br/>Pass Every Exam.</h1>
          <p className="hero-p">MCQ, NCLEX, Notes, Flashcards & more — all free.</p>
          <div className="hero-btns">
            <button className="btn-hero" onClick={() => go("mcq")}>Start MCQ →</button>
            <button className="btn-hero-ghost" onClick={() => go("nclex")}>NCLEX Prep</button>
          </div>
        </div>
        <div className="hero-emoji">🩺</div>
      </div>

      {/* Stats */}
      <div className="stats">
        {[
          { icon:"🔥", val:"7",   label:"Day Streak" },
          { icon:"✅", val:"142", label:"MCQ Done" },
          { icon:"🏆", val:"#23", label:"Rank" },
          { icon:"📚", val:"8",   label:"Topics" },
        ].map(s => (
          <div key={s.label} className="stat-box">
            <div className="stat-ico">{s.icon}</div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Section Cards */}
      <div className="grid-label">All Sections</div>
      <div className="section-grid">
        {[
          { id:"mcq",        icon:"📝", label:"Daily MCQ",      desc:"10 questions/day",      color:"#ef4444" },
          { id:"nclex",      icon:"🎓", label:"NCLEX Prep",     desc:"SATA, Priority, Calc",  color:"#3b82f6", badge:"HOT" },
          { id:"notes",      icon:"📖", label:"Nursing Notes",  desc:"6 detailed topics",     color:"#8b5cf6" },
          { id:"quiz",       icon:"⏱️", label:"Timed Quiz",     desc:"Beat the clock!",       color:"#f59e0b" },
          { id:"english",    icon:"🌐", label:"Medical English","desc":"4 lesson modules",    color:"#10b981" },
          { id:"flashcards", icon:"🃏", label:"Flashcards",     desc:"8 cards to master",     color:"#ec4899", badge:"NEW" },
          { id:"pdf",        icon:"📄", label:"PDF Corner",     desc:"10 free PDFs",          color:"#06b6d4" },
        ].map(c => (
          <button key={c.id} className="sec-card" style={{"--ac": c.color}} onClick={() => go(c.id)}>
            <div className="sec-card-icon">{c.icon}</div>
            {c.badge && <span className="sec-badge">{c.badge}</span>}
            <div className="sec-card-label">{c.label}</div>
            <div className="sec-card-desc">{c.desc}</div>
          </button>
        ))}
      </div>

      {/* Today's tip */}
      <div className="tip-box">
        <div className="tip-title">💡 Nursing Tip of the Day</div>
        <div className="tip-text">Always assess your patient's <strong>ABCs</strong> first — Airway, Breathing, Circulation. This is the foundation of every emergency response and NCLEX priority question.</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MCQ
══════════════════════════════════════════ */
function MCQPage() {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [shown, setShown] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = MCQ_BANK[idx];
  const pick = i => {
    if (shown) return;
    setSel(i); setShown(true);
    if (i === q.ans) setScore(s => s + 1);
  };
  const next = () => {
    if (idx + 1 >= MCQ_BANK.length) { setDone(true); return; }
    setSel(null); setShown(false); setIdx(i => i + 1);
  };
  const reset = () => { setSel(null); setShown(false); setIdx(0); setScore(0); setDone(false); };

  if (done) return <ResultScreen score={score} total={MCQ_BANK.length} onReset={reset} />;

  return (
    <div className="page-wrap">
      <div className="q-header">
        <Tag color="#10b981">Daily MCQ</Tag>
        <span className="q-counter">Q{idx + 1} / {MCQ_BANK.length}</span>
        <Tag color="#3b82f6">Score: {score}</Tag>
      </div>
      <ProgressBar value={(idx + 1) / MCQ_BANK.length} color="#10b981" />
      <div className="category-chip">{q.cat}</div>
      <div className="q-box"><div className="q-text">{q.q}</div></div>
      <div className="opts-list">
        {q.opts.map((o, i) => (
          <button key={i} className={`opt${shown ? (i === q.ans ? " correct" : i === sel ? " wrong" : "") : sel === i ? " picked" : ""}`} onClick={() => pick(i)}>
            <span className="opt-ltr">{String.fromCharCode(65 + i)}</span>
            <span>{o}</span>
            {shown && i === q.ans && <span className="opt-mark right">✓</span>}
            {shown && i === sel && i !== q.ans && <span className="opt-mark wrong-mark">✗</span>}
          </button>
        ))}
      </div>
      {shown && <div className="explain"><span className="explain-ico">💡</span> {q.explain}</div>}
      {shown && <button className="btn-next" onClick={next}>{idx + 1 < MCQ_BANK.length ? "Next Question →" : "See Results 🏁"}</button>}
    </div>
  );
}

/* ══════════════════════════════════════════
   NCLEX
══════════════════════════════════════════ */
function NclexPage() {
  const [filter, setFilter] = useState("All");
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState([]);
  const [shown, setShown] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const types = ["All", "MCQ", "SATA", "Priority", "Calculation"];
  const bank = filter === "All" ? NCLEX_BANK : NCLEX_BANK.filter(q => q.type === filter);
  const q = bank[idx] || NCLEX_BANK[0];
  const isMulti = q.type === "SATA";

  const toggle = i => {
    if (shown) return;
    if (isMulti) setSel(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i]);
    else setSel([i]);
  };
  const submit = () => {
    if (!sel.length) return;
    setShown(true);
    const correct = isMulti
      ? q.ans.length === sel.length && q.ans.every(a => sel.includes(a))
      : sel[0] === q.ans[0];
    if (correct) setScore(s => s + 1);
  };
  const next = () => {
    if (idx + 1 >= bank.length) { setDone(true); return; }
    setSel([]); setShown(false); setIdx(i => i + 1);
  };
  const reset = () => { setSel([]); setShown(false); setIdx(0); setScore(0); setDone(false); };

  if (done) return <ResultScreen score={score} total={bank.length} onReset={reset} label="NCLEX" />;

  const typeColor = { MCQ:"#10b981", SATA:"#f59e0b", Priority:"#ef4444", Calculation:"#3b82f6" };

  return (
    <div className="page-wrap">
      <div className="filter-row">
        {types.map(t => (
          <button key={t} className={`filter-btn${filter === t ? " on" : ""}`}
            onClick={() => { setFilter(t); setIdx(0); setSel([]); setShown(false); setScore(0); setDone(false); }}>
            {t}
          </button>
        ))}
      </div>

      <div className="q-header" style={{marginTop:12}}>
        <Tag color={typeColor[q.type] || "#3b82f6"}>{q.type}</Tag>
        <span className="q-counter">{idx + 1}/{bank.length}</span>
        <Tag color="#8b5cf6">{q.category}</Tag>
      </div>
      <ProgressBar value={(idx + 1) / bank.length} color="#3b82f6" />

      {isMulti && !shown && (
        <div className="sata-note">☑ Select ALL correct answers, then click Submit</div>
      )}

      <div className="q-box"><div className="q-text">{q.q}</div></div>

      <div className="opts-list">
        {q.opts.map((o, i) => (
          <button key={i}
            className={`opt${shown ? (q.ans.includes(i) ? " correct" : sel.includes(i) ? " wrong" : "") : sel.includes(i) ? " picked" : ""}`}
            onClick={() => toggle(i)}>
            <span className="opt-ltr">{isMulti ? (sel.includes(i) || (shown && q.ans.includes(i)) ? "☑" : "☐") : String.fromCharCode(65 + i)}</span>
            <span>{o}</span>
            {shown && q.ans.includes(i) && <span className="opt-mark right">✓</span>}
            {shown && sel.includes(i) && !q.ans.includes(i) && <span className="opt-mark wrong-mark">✗</span>}
          </button>
        ))}
      </div>

      {!shown && <button className="btn-next" style={{opacity: sel.length ? 1 : 0.45}} onClick={submit}>Submit Answer</button>}
      {shown && <div className="explain"><span className="explain-ico">📚</span> {q.rationale}</div>}
      {shown && <button className="btn-next" onClick={next}>{idx + 1 < bank.length ? "Next Question →" : "See Results 🏁"}</button>}
    </div>
  );
}

/* ══════════════════════════════════════════
   NOTES
══════════════════════════════════════════ */
function NotesPage() {
  const [open, setOpen] = useState(null);

  if (open !== null) {
    const n = NOTES_DATA[open];
    return (
      <div className="page-wrap">
        <button className="back-btn" onClick={() => setOpen(null)}>← Back</button>
        <div className="note-hero" style={{"--nc": n.color}}>
          <span style={{fontSize:36}}>{n.emoji}</span>
          <div>
            <div className="note-hero-title">{n.title}</div>
            <Tag color={n.color}>{n.tag}</Tag>
          </div>
        </div>
        {n.sections.map((s, si) => (
          <div key={si} className="note-section">
            <div className="note-section-heading">{s.heading}</div>
            {s.items.map((item, ii) => (
              <div key={ii} className="note-item">• {item}</div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="grid-label">Study Topics ({NOTES_DATA.length})</div>
      <div className="notes-list">
        {NOTES_DATA.map((n, i) => (
          <button key={n.id} className="note-card" style={{"--nc": n.color}} onClick={() => setOpen(i)}>
            <span className="note-card-emoji">{n.emoji}</span>
            <div className="note-card-body">
              <div className="note-card-title">{n.title}</div>
              <Tag color={n.color}>{n.tag}</Tag>
            </div>
            <span className="note-card-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   QUIZ (TIMED)
══════════════════════════════════════════ */
function QuizPage() {
  const [started, setStarted] = useState(false);
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [time, setTime] = useState(15);
  const ref = useRef(null);

  useEffect(() => {
    if (!started || done || sel !== null) return;
    setTime(15);
    ref.current = setInterval(() => {
      setTime(t => {
        if (t <= 1) { clearInterval(ref.current); advance(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [qi, started, done]);

  const advance = () => setQi(q => {
    const n = q + 1;
    if (n >= MCQ_BANK.length) setDone(true);
    else setSel(null);
    return n;
  });
  const pick = i => {
    if (sel !== null) return;
    clearInterval(ref.current);
    setSel(i);
    if (i === MCQ_BANK[qi]?.ans) setScore(s => s + 1);
    setTimeout(advance, 900);
  };
  const reset = () => { setStarted(false); setQi(0); setSel(null); setScore(0); setDone(false); };

  if (!started) return (
    <div className="page-wrap center-wrap">
      <div style={{fontSize:64}}>⏱️</div>
      <div className="result-title">Timed Quiz</div>
      <div className="result-sub">{MCQ_BANK.length} questions · 15 seconds each<br/>Auto-advances when time runs out!</div>
      <button className="btn-next" style={{maxWidth:220, marginTop:24}} onClick={() => setStarted(true)}>Start Quiz 🚀</button>
    </div>
  );

  if (done) return <ResultScreen score={score} total={MCQ_BANK.length} onReset={reset} label="Quiz" />;

  const q = MCQ_BANK[qi];
  const pct = time / 15;
  return (
    <div className="page-wrap">
      <div className="q-header">
        <Tag color="#f59e0b">Timed Quiz</Tag>
        <span className="q-counter">{qi + 1}/{MCQ_BANK.length}</span>
        <span className={`timer-tag${time <= 5 ? " red" : ""}`}>⏱ {time}s</span>
      </div>
      <ProgressBar value={pct} color={time <= 5 ? "#ef4444" : "#f59e0b"} />
      <div className="q-box"><div className="q-text">{q.q}</div></div>
      <div className="opts-list">
        {q.opts.map((o, i) => (
          <button key={i} className={`opt${sel !== null ? (i === q.ans ? " correct" : i === sel ? " wrong" : "") : ""}`} onClick={() => pick(i)}>
            <span className="opt-ltr">{String.fromCharCode(65 + i)}</span>
            <span>{o}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   ENGLISH
══════════════════════════════════════════ */
function EnglishPage() {
  const [open, setOpen] = useState(null);
  const lvlColor = { Beginner:"#10b981", Intermediate:"#f59e0b", Advanced:"#ef4444" };

  if (open !== null) {
    const l = ENGLISH_DATA[open];
    return (
      <div className="page-wrap">
        <button className="back-btn" onClick={() => setOpen(null)}>← Back</button>
        <div className="eng-hero">
          <span style={{fontSize:36}}>{l.icon}</span>
          <div>
            <div className="note-hero-title">{l.title}</div>
            <Tag color={lvlColor[l.level]}>{l.level}</Tag>
          </div>
        </div>
        <div className="grid-label" style={{marginTop:20}}>Vocabulary ({l.words.length} terms)</div>
        <div className="vocab-grid">
          {l.words.map(w => (
            <div key={w.term} className="vocab-card">
              <div className="vocab-term">{w.term}</div>
              <div className="vocab-def">{w.def}</div>
            </div>
          ))}
        </div>
        <div className="grid-label" style={{marginTop:20}}>Example Sentence</div>
        <div className="example-box">"{l.sentence}"</div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="grid-label">Lessons ({ENGLISH_DATA.length})</div>
      <div className="notes-list">
        {ENGLISH_DATA.map((l, i) => (
          <button key={l.id} className="note-card" style={{"--nc": lvlColor[l.level]}} onClick={() => setOpen(i)}>
            <span className="note-card-emoji">{l.icon}</span>
            <div className="note-card-body">
              <div className="note-card-title">{l.title}</div>
              <Tag color={lvlColor[l.level]}>{l.level}</Tag>
            </div>
            <span className="note-card-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   FLASHCARDS
══════════════════════════════════════════ */
function FlashcardsPage() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);

  const card = FLASHCARDS[idx];
  const mark = (yes) => {
    if (yes) setKnown(k => [...k, idx]);
    const next = idx + 1;
    if (next >= FLASHCARDS.length) return;
    setIdx(next);
    setFlipped(false);
  };

  if (idx >= FLASHCARDS.length) return (
    <div className="page-wrap center-wrap">
      <div style={{fontSize:64}}>🎉</div>
      <div className="result-title">All Done!</div>
      <div className="result-sub">You knew {known.length} out of {FLASHCARDS.length} cards</div>
      <button className="btn-next" style={{maxWidth:200,marginTop:20}} onClick={() => { setIdx(0); setFlipped(false); setKnown([]); }}>Restart</button>
    </div>
  );

  return (
    <div className="page-wrap">
      <div className="q-header">
        <Tag color="#ec4899">Flashcards</Tag>
        <span className="q-counter">{idx + 1}/{FLASHCARDS.length}</span>
        <Tag color="#10b981">✓ {known.length} Known</Tag>
      </div>
      <ProgressBar value={(idx + 1) / FLASHCARDS.length} color="#ec4899" />

      <div className={`flashcard${flipped ? " flipped" : ""}`} onClick={() => setFlipped(f => !f)}>
        <div className="fc-inner">
          <div className="fc-front">
            <div className="fc-label">Question</div>
            <div className="fc-text">{card.front}</div>
            <div className="fc-hint">Tap to reveal answer</div>
          </div>
          <div className="fc-back">
            <div className="fc-label">Answer</div>
            <div className="fc-text">{card.back}</div>
          </div>
        </div>
      </div>

      {flipped && (
        <div className="fc-btns">
          <button className="fc-btn-no" onClick={() => mark(false)}>✗ Still Learning</button>
          <button className="fc-btn-yes" onClick={() => mark(true)}>✓ Got It!</button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   PDF
══════════════════════════════════════════ */
function PDFPage() {
  const [filter, setFilter] = useState("All");
  const tags = ["All", "NCLEX", "Pharmacology", "Anatomy", "Clinical", "Pediatrics", "OB/GYN", "Psych", "Lab Values"];
  const list = filter === "All" ? PDF_DATA : PDF_DATA.filter(p => p.tag === filter);

  return (
    <div className="page-wrap">
      <div className="filter-row">
        {tags.map(t => (
          <button key={t} className={`filter-btn${filter === t ? " on" : ""}`} onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>
      <div className="grid-label" style={{marginTop:16}}>{list.length} Files</div>
      <div className="pdf-list">
        {list.map(p => (
          <div key={p.id} className="pdf-row">
            <div className="pdf-ico">{p.icon}</div>
            <div className="pdf-info">
              <div className="pdf-title">{p.title}</div>
              <div className="pdf-meta">{p.pages} pages · {p.size} · <Tag color="#6b7280" style={{fontSize:10}}>{p.tag}</Tag></div>
            </div>
            <button className={`dl-btn${p.free ? "" : " locked"}`}>
              {p.free ? "⬇ Free" : "🔒 Pro"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════ */
function ResultScreen({ score, total, onReset, label = "MCQ" }) {
  const pct = Math.round((score / total) * 100);
  return (
    <div className="page-wrap center-wrap">
      <div style={{fontSize:72}}>{pct >= 80 ? "🏆" : pct >= 50 ? "🎉" : "📚"}</div>
      <div className="result-title">{label} Complete!</div>
      <div className="result-score">{score}<span style={{fontSize:24,color:"#94a3b8"}}>/{total}</span></div>
      <div className="result-pct">{pct}%</div>
      <div className="result-sub">{pct >= 80 ? "Excellent! You're ready!" : pct >= 50 ? "Good job! Keep practicing!" : "Keep studying — you'll get there!"}</div>
      <button className="btn-next" style={{maxWidth:200,marginTop:24}} onClick={onReset}>Try Again</button>
    </div>
  );
}

function ProgressBar({ value, color }) {
  return (
    <div className="prog-track">
      <div className="prog-fill" style={{width:`${Math.min(value * 100, 100)}%`, background: color}} />
    </div>
  );
}

function Tag({ color, children }) {
  return (
    <span className="tag" style={{background: color + "20", color}}>{children}</span>
  );
}

/* ══════════════════════════════════════════
   CSS
══════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:#0d1117;font-family:'Plus Jakarta Sans',sans-serif;}

.shell{display:flex;min-height:100vh;}

/* ─ Sidebar ─ */
.sidebar{width:230px;background:#111827;display:flex;flex-direction:column;padding:20px 0;position:sticky;top:0;height:100vh;flex-shrink:0;z-index:200;transition:transform .25s;}
.sb-logo{display:flex;align-items:center;gap:10px;padding:0 18px 22px;border-bottom:1px solid #1f2937;}
.sb-logo-icon{font-size:26px;}
.sb-logo-name{font-size:17px;font-weight:900;color:#f9fafb;letter-spacing:-.5px;}
.sb-logo-sub{font-size:10px;color:#22d3ee;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
.sb-nav{display:flex;flex-direction:column;gap:2px;padding:16px 10px;flex:1;overflow-y:auto;}
.sb-link{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;border:none;background:transparent;color:#9ca3af;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;text-align:left;position:relative;}
.sb-link:hover{background:#1f2937;color:#f3f4f6;}
.sb-link.active{background:#1e3a5f;color:#60a5fa;}
.sb-link-icon{font-size:16px;width:20px;text-align:center;flex-shrink:0;}
.sb-badge{margin-left:auto;padding:2px 6px;border-radius:6px;font-size:9px;font-weight:800;background:#ef4444;color:#fff;}
.sb-badge.new{background:#8b5cf6;}
.sb-pro{margin:10px;background:linear-gradient(135deg,#1e3a5f,#1e1b4b);border:1px solid #2563eb33;border-radius:12px;padding:12px;display:flex;gap:10px;align-items:center;}
.sb-pro-icon{font-size:20px;}
.sb-pro-title{font-size:12px;font-weight:800;color:#f9fafb;}
.sb-pro-sub{font-size:10px;color:#6b7280;}

/* ─ Main ─ */
.main{flex:1;display:flex;flex-direction:column;min-width:0;background:#f8fafc;}
.topbar{background:#fff;border-bottom:1px solid #e2e8f0;padding:14px 24px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:10;}
.topbar-left{display:flex;align-items:center;gap:12px;}
.topbar-title{font-size:17px;font-weight:800;color:#0f172a;}
.topbar-sub{font-size:10px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:.5px;}
.topbar-right{display:flex;align-items:center;gap:10px;}
.streak{background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;padding:5px 13px;border-radius:20px;font-size:12px;font-weight:700;}
.avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;}
.hamburger{display:none;background:none;border:none;font-size:20px;cursor:pointer;color:#374151;padding:2px 6px;}
.overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;}

.body{flex:1;padding:24px;overflow-y:auto;}
.page-wrap{max-width:720px;}
.center-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:55vh;text-align:center;margin:0 auto;}

/* ─ Hero ─ */
.hero{background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);border-radius:22px;padding:32px;margin-bottom:22px;display:flex;justify-content:space-between;align-items:center;gap:16px;}
.hero-chip{display:inline-block;background:rgba(34,211,238,.15);color:#22d3ee;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;margin-bottom:10px;}
.hero-h1{font-size:24px;font-weight:900;color:#f9fafb;line-height:1.25;margin-bottom:8px;}
.hero-p{font-size:13px;color:rgba(249,250,251,.6);margin-bottom:18px;}
.hero-btns{display:flex;gap:10px;flex-wrap:wrap;}
.btn-hero{background:#22d3ee;color:#0f172a;border:none;border-radius:30px;padding:9px 22px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;transition:transform .15s;}
.btn-hero:hover{transform:translateY(-2px);}
.btn-hero-ghost{background:transparent;color:#f9fafb;border:2px solid rgba(255,255,255,.25);border-radius:30px;padding:9px 22px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;}
.hero-emoji{font-size:72px;flex-shrink:0;}

/* ─ Stats ─ */
.stats{display:flex;gap:12px;margin-bottom:24px;}
.stat-box{flex:1;background:#fff;border-radius:14px;padding:14px;text-align:center;box-shadow:0 1px 8px rgba(0,0,0,.06);}
.stat-ico{font-size:20px;margin-bottom:4px;}
.stat-val{font-size:20px;font-weight:900;color:#0f172a;}
.stat-lbl{font-size:10px;color:#94a3b8;margin-top:2px;font-weight:600;}

/* ─ Section Grid ─ */
.grid-label{font-size:11px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px;}
.section-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:12px;margin-bottom:22px;}
.sec-card{background:#fff;border-radius:16px;padding:18px 14px;border:none;cursor:pointer;text-align:left;box-shadow:0 1px 8px rgba(0,0,0,.06);border-top:3px solid var(--ac);transition:transform .2s,box-shadow .2s;font-family:inherit;position:relative;}
.sec-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.1);}
.sec-card-icon{font-size:26px;margin-bottom:8px;}
.sec-badge{position:absolute;top:10px;right:10px;background:var(--ac);color:#fff;font-size:9px;font-weight:800;padding:2px 6px;border-radius:6px;}
.sec-card-label{font-size:13px;font-weight:800;color:#0f172a;margin-bottom:3px;}
.sec-card-desc{font-size:11px;color:#94a3b8;}

/* ─ Tip Box ─ */
.tip-box{background:linear-gradient(135deg,#ecfdf5,#f0fdf4);border:1px solid #bbf7d0;border-radius:14px;padding:16px 18px;}
.tip-title{font-size:13px;font-weight:800;color:#15803d;margin-bottom:6px;}
.tip-text{font-size:13px;color:#166534;line-height:1.6;}

/* ─ Q&A ─ */
.q-header{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;}
.q-counter{font-size:13px;font-weight:700;color:#94a3b8;flex:1;}
.prog-track{height:5px;background:#e2e8f0;border-radius:10px;margin-bottom:18px;overflow:hidden;}
.prog-fill{height:100%;border-radius:10px;transition:width .4s;}
.category-chip{display:inline-block;background:#f1f5f9;color:#475569;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;margin-bottom:12px;}
.q-box{background:#fff;border-radius:16px;padding:20px;margin-bottom:14px;box-shadow:0 1px 8px rgba(0,0,0,.07);}
.q-text{font-size:15px;font-weight:700;color:#0f172a;line-height:1.6;}
.opts-list{display:flex;flex-direction:column;gap:9px;margin-bottom:14px;}
.opt{display:flex;align-items:center;gap:12px;padding:13px 15px;border-radius:12px;background:#fff;border:1.5px solid #e2e8f0;cursor:pointer;font-family:inherit;font-size:13px;color:#374151;text-align:left;transition:all .15s;box-shadow:0 1px 4px rgba(0,0,0,.04);}
.opt:hover{border-color:#3b82f6;background:#eff6ff;}
.opt.picked{border-color:#3b82f6;background:#eff6ff;}
.opt.correct{border-color:#10b981;background:#ecfdf5;color:#065f46;font-weight:700;}
.opt.wrong{border-color:#ef4444;background:#fef2f2;color:#991b1b;}
.opt-ltr{width:26px;height:26px;border-radius:8px;background:#f1f5f9;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#64748b;}
.opt-mark{margin-left:auto;font-size:16px;font-weight:900;flex-shrink:0;}
.opt-mark.right{color:#10b981;}
.opt-mark.wrong-mark{color:#ef4444;}
.explain{background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:13px 15px;font-size:13px;color:#78350f;margin-bottom:14px;line-height:1.6;display:flex;gap:8px;}
.explain-ico{flex-shrink:0;font-size:15px;}
.sata-note{background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:10px 14px;font-size:12px;color:#1d4ed8;font-weight:600;margin-bottom:12px;}
.btn-next{width:100%;background:linear-gradient(135deg,#1e3a5f,#2563eb);color:#fff;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:transform .15s;}
.btn-next:hover{transform:translateY(-2px);}
.timer-tag{padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;background:#fef3c7;color:#b45309;}
.timer-tag.red{background:#fee2e2;color:#dc2626;}

/* ─ Notes ─ */
.notes-list{display:flex;flex-direction:column;gap:10px;}
.note-card{background:#fff;border-radius:14px;padding:15px 16px;display:flex;align-items:center;gap:13px;border:none;cursor:pointer;text-align:left;box-shadow:0 1px 8px rgba(0,0,0,.06);border-left:4px solid var(--nc);transition:transform .15s;font-family:inherit;width:100%;}
.note-card:hover{transform:translateX(4px);}
.note-card-emoji{font-size:26px;flex-shrink:0;}
.note-card-body{flex:1;}
.note-card-title{font-size:14px;font-weight:800;color:#0f172a;margin-bottom:5px;}
.note-card-arrow{font-size:18px;color:#cbd5e1;flex-shrink:0;}
.note-hero{display:flex;align-items:center;gap:14px;background:#fff;border-radius:16px;padding:18px;margin-bottom:20px;border-left:5px solid var(--nc);box-shadow:0 1px 8px rgba(0,0,0,.06);}
.note-hero-title{font-size:18px;font-weight:900;color:#0f172a;margin-bottom:6px;}
.note-section{background:#fff;border-radius:14px;padding:16px 18px;margin-bottom:12px;box-shadow:0 1px 6px rgba(0,0,0,.05);}
.note-section-heading{font-size:13px;font-weight:800;color:#0f172a;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #f1f5f9;}
.note-item{font-size:13px;color:#475569;padding:4px 0 4px 6px;line-height:1.6;}

/* ─ English ─ */
.eng-hero{display:flex;align-items:center;gap:14px;background:#fff;border-radius:16px;padding:18px;margin-bottom:8px;box-shadow:0 1px 8px rgba(0,0,0,.06);}
.vocab-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.vocab-card{background:#fff;border-radius:12px;padding:13px 14px;box-shadow:0 1px 6px rgba(0,0,0,.05);}
.vocab-term{font-size:13px;font-weight:800;color:#2563eb;margin-bottom:4px;}
.vocab-def{font-size:12px;color:#64748b;line-height:1.5;}
.example-box{background:linear-gradient(135deg,#eff6ff,#f5f3ff);border:1px solid #c7d2fe;border-radius:14px;padding:16px 18px;font-size:14px;font-style:italic;color:#312e81;border-left:4px solid #6366f1;line-height:1.7;}

/* ─ Flashcards ─ */
.flashcard{width:100%;min-height:220px;cursor:pointer;perspective:1000px;margin-bottom:20px;}
.fc-inner{position:relative;width:100%;height:220px;transform-style:preserve-3d;transition:transform .5s;}
.flashcard.flipped .fc-inner{transform:rotateY(180deg);}
.fc-front,.fc-back{position:absolute;inset:0;backface-visibility:hidden;border-radius:20px;padding:28px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.1);}
.fc-front{background:linear-gradient(135deg,#1e3a5f,#312e81);color:#fff;}
.fc-back{background:linear-gradient(135deg,#065f46,#1e3a5f);color:#fff;transform:rotateY(180deg);}
.fc-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;opacity:.6;margin-bottom:12px;}
.fc-text{font-size:16px;font-weight:700;line-height:1.5;}
.fc-hint{font-size:11px;opacity:.5;margin-top:14px;}
.fc-btns{display:flex;gap:12px;}
.fc-btn-no{flex:1;padding:12px;border-radius:12px;border:2px solid #fca5a5;background:#fff;color:#ef4444;font-weight:800;font-size:14px;cursor:pointer;font-family:inherit;}
.fc-btn-yes{flex:1;padding:12px;border-radius:12px;border:none;background:#10b981;color:#fff;font-weight:800;font-size:14px;cursor:pointer;font-family:inherit;}

/* ─ PDF ─ */
.pdf-list{display:flex;flex-direction:column;gap:10px;}
.pdf-row{background:#fff;border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:13px;box-shadow:0 1px 8px rgba(0,0,0,.06);}
.pdf-ico{font-size:30px;flex-shrink:0;}
.pdf-info{flex:1;}
.pdf-title{font-size:13px;font-weight:700;color:#0f172a;margin-bottom:4px;}
.pdf-meta{font-size:11px;color:#94a3b8;display:flex;align-items:center;gap:6px;}
.dl-btn{padding:7px 15px;border-radius:20px;border:none;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;background:#10b981;color:#fff;flex-shrink:0;transition:transform .15s;}
.dl-btn:hover{transform:scale(1.05);}
.dl-btn.locked{background:#f1f5f9;color:#94a3b8;}

/* ─ Filter ─ */
.filter-row{display:flex;gap:8px;flex-wrap:wrap;}
.filter-btn{background:#fff;border:1.5px solid #e2e8f0;border-radius:20px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;color:#64748b;transition:all .15s;}
.filter-btn:hover{border-color:#3b82f6;color:#3b82f6;}
.filter-btn.on{background:#0f172a;color:#fff;border-color:#0f172a;}

/* ─ Shared ─ */
.tag{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;}
.back-btn{background:none;border:1.5px solid #e2e8f0;border-radius:10px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;color:#64748b;margin-bottom:18px;font-family:inherit;transition:all .15s;}
.back-btn:hover{border-color:#3b82f6;color:#3b82f6;}
.result-title{font-size:22px;font-weight:900;color:#0f172a;margin:12px 0 6px;}
.result-score{font-size:52px;font-weight:900;color:#2563eb;line-height:1;}
.result-pct{font-size:20px;font-weight:800;color:#10b981;margin:4px 0 8px;}
.result-sub{font-size:13px;color:#94a3b8;line-height:1.5;max-width:280px;}

/* ─ Responsive ─ */
@media(max-width:768px){
  .sidebar{position:fixed;left:0;top:0;height:100%;transform:translateX(-100%);}
  .sidebar.open{transform:translateX(0);}
  .overlay{display:block;}
  .hamburger{display:block;}
  .body{padding:14px;}
  .hero{flex-direction:column;padding:22px 18px;}
  .hero-emoji{font-size:48px;}
  .stats{gap:8px;}
  .stat-box{padding:10px 8px;}
  .section-grid{grid-template-columns:repeat(2,1fr);}
  .vocab-grid{grid-template-columns:1fr;}
  .topbar{padding:12px 14px;}
  .streak{display:none;}
}
`;
