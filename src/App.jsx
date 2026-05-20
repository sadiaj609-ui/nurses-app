import { useState, useEffect, useRef } from "react";

const FontLink = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');`}</style>
);

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const MCQ_BANK = [
  { id:1, q:"What is the normal adult resting heart rate (bpm)?", opts:["40–60","60–100","100–120","120–160"], ans:1, explain:"Normal HR: 60-100 bpm. Below 60 = bradycardia, above 100 = tachycardia." },
  { id:2, q:"Normal blood pressure in adults is:", opts:["90/60 mmHg","120/80 mmHg","140/90 mmHg","160/100 mmHg"], ans:1, explain:"120/80 mmHg is considered normal. 140/90 or higher is hypertension." },
  { id:3, q:"Which vitamin is synthesized through sunlight exposure?", opts:["Vitamin A","Vitamin B12","Vitamin C","Vitamin D"], ans:3, explain:"UV-B rays convert 7-dehydrocholesterol in the skin to Vitamin D3." },
  { id:4, q:"Normal respiratory rate for adults (breaths/min):", opts:["8–10","12–20","22–28","30–36"], ans:1, explain:"Normal RR: 12-20/min. Below 12 = bradypnea, above 20 = tachypnea." },
  { id:5, q:"What is the maximum score on the Glasgow Coma Scale?", opts:["10","12","15","18"], ans:2, explain:"GCS max = 15 (Eye 4 + Verbal 5 + Motor 6). Minimum score = 3." },
  { id:6, q:"Normal oral body temperature in Celsius:", opts:["35.5°C","36.1–37.2°C","38.0°C","39.0°C"], ans:1, explain:"Normal oral temp: 36.1–37.2°C. Above 38°C is considered fever." },
  { id:7, q:"Which blood type is the universal donor?", opts:["A+","B+","O−","AB+"], ans:2, explain:"O negative lacks A, B antigens and Rh factor — safe for all recipients." },
  { id:8, q:"How many bones are in the adult human body?", opts:["186","196","206","216"], ans:2, explain:"Adults have 206 bones. Infants have ~270 which fuse over time." },
  { id:9, q:"Normal SpO₂ (oxygen saturation) level:", opts:["85–90%","90–94%","95–100%","100% only"], ans:2, explain:"Normal SpO₂: 95-100%. Below 90% requires immediate intervention." },
  { id:10, q:"Which hormone primarily regulates blood glucose?", opts:["Cortisol","Insulin","Glucagon","Adrenaline"], ans:1, explain:"Insulin (from beta cells of pancreas) lowers blood glucose levels." },
];

const NCLEX_BANK = [
  {
    id:1,
    type:"SATA",
    q:"A nurse is caring for a patient with heart failure. Which interventions should be included in the care plan? (Select all that apply)",
    opts:[
      "Weigh the patient daily at the same time",
      "Encourage fluid intake of 3L per day",
      "Monitor for peripheral edema",
      "Elevate the head of the bed 30–45 degrees",
      "Restrict sodium intake as ordered",
    ],
    ans:[0,2,3,4],
    explain:"In heart failure: daily weights detect fluid retention, monitoring edema assesses status, HOB elevation reduces dyspnea, and sodium restriction prevents fluid overload. Fluid intake is typically restricted, not encouraged.",
    category:"Cardiovascular",
  },
  {
    id:2,
    type:"Priority",
    q:"A nurse is working on a med-surgical unit. Which patient should be assessed FIRST?",
    opts:[
      "Patient with COPD requesting pain medication",
      "Patient post-op 4 hours ago with O₂ sat of 88%",
      "Patient asking for help getting to the bathroom",
      "Patient requesting information about discharge instructions",
    ],
    ans:[1],
    explain:"O₂ saturation of 88% is critically low (normal 95-100%). This is an immediate life-threatening emergency requiring priority assessment. Airway/breathing issues always take priority using Maslow's hierarchy.",
    category:"Priority Setting",
  },
  {
    id:3,
    type:"MCQ",
    q:"A patient is prescribed 500mg of Amoxicillin. The available stock is 250mg/5mL. How many mL should the nurse administer?",
    opts:["5 mL","10 mL","15 mL","20 mL"],
    ans:[1],
    explain:"Dose = (Desired/Have) × Volume = (500/250) × 5 = 10 mL. Always verify calculations with the five rights of medication administration.",
    category:"Pharmacology",
  },
  {
    id:4,
    type:"SATA",
    q:"Which findings indicate a patient is experiencing increased intracranial pressure (ICP)? (Select all that apply)",
    opts:[
      "Widening pulse pressure",
      "Bradycardia",
      "Tachypnea with irregular breathing",
      "Pinpoint pupils bilaterally",
      "Headache worse in the morning",
    ],
    ans:[0,1,2,4],
    explain:"Cushing's triad (increased ICP): hypertension with widened pulse pressure, bradycardia, and irregular respirations. Morning headache is also a sign. Pinpoint pupils indicate pontine damage or opioid use, not typical ICP.",
    category:"Neurological",
  },
  {
    id:5,
    type:"Priority",
    q:"A nurse receives a call from a patient's family. Which statement requires the MOST immediate action?",
    opts:[
      "'My mother hasn't eaten her lunch today'",
      "'My father's lips are turning blue and he's gasping'",
      "'My wife is asking for extra blankets'",
      "'My husband says the TV remote is not working'",
    ],
    ans:[1],
    explain:"Cyanosis and gasping indicate respiratory failure — an immediate life-threatening emergency. The nurse must respond immediately and call a rapid response team.",
    category:"Emergency",
  },
  {
    id:6,
    type:"MCQ",
    q:"A patient with Type 1 Diabetes has a blood glucose of 48 mg/dL and is conscious. What is the priority nursing action?",
    opts:[
      "Administer 1mg glucagon IM",
      "Give 15g of fast-acting carbohydrate orally",
      "Start IV dextrose 50%",
      "Call the physician immediately",
    ],
    ans:[1],
    explain:"The 15-15 rule: give 15g fast-acting carbs (e.g., 4oz juice), wait 15 min, recheck glucose. Since patient is conscious, oral treatment is preferred and safest.",
    category:"Endocrine",
  },
  {
    id:7,
    type:"SATA",
    q:"The nurse is teaching a patient about warfarin therapy. Which statements by the patient indicate correct understanding? (Select all that apply)",
    opts:[
      "'I will get my INR checked regularly'",
      "'I can take aspirin for my headaches'",
      "'I should eat consistent amounts of leafy green vegetables'",
      "'I will report any unusual bruising or bleeding'",
      "'I should take extra doses if I miss one'",
    ],
    ans:[0,2,3],
    explain:"Correct: Regular INR monitoring, consistent Vitamin K intake (leafy greens), and reporting bleeding. Incorrect: Aspirin increases bleeding risk; never double-dose warfarin — contact provider if a dose is missed.",
    category:"Pharmacology",
  },
  {
    id:8,
    type:"Priority",
    q:"Using SBAR, a nurse is reporting to the physician. Which component comes FIRST?",
    opts:["Background","Assessment","Recommendation","Situation"],
    ans:[3],
    explain:"SBAR = Situation, Background, Assessment, Recommendation. Always start with Situation: identify yourself, the patient, and the current problem concisely.",
    category:"Communication",
  },
  {
    id:9,
    type:"MCQ",
    q:"A patient is in the oliguric phase of acute kidney injury. Which lab value is MOST concerning?",
    opts:["Serum potassium 6.5 mEq/L","BUN 25 mg/dL","Creatinine 1.0 mg/dL","Sodium 138 mEq/L"],
    ans:[0],
    explain:"Potassium 6.5 mEq/L is dangerously high (hyperkalemia). In AKI, kidneys cannot excrete potassium, leading to life-threatening cardiac arrhythmias. Normal K+ = 3.5–5.0 mEq/L.",
    category:"Renal",
  },
  {
    id:10,
    type:"SATA",
    q:"Which nursing interventions are appropriate for a patient in Buck's traction? (Select all that apply)",
    opts:[
      "Ensure weights hang freely at all times",
      "Remove traction every 2 hours for skin assessment",
      "Maintain proper body alignment",
      "Assess neurovascular status every 2 hours",
      "Encourage the patient to turn side to side freely",
    ],
    ans:[0,2,3],
    explain:"Buck's traction: weights must hang freely (removing disrupts traction), maintain alignment to ensure effectiveness, assess neurovascular status (circulation, sensation, movement). Do not remove traction without order; turning is restricted.",
    category:"Musculoskeletal",
  },
];

const NOTES = [
  {
    id:1, icon:"❤️", title:"Vital Signs", color:"#e63946", tag:"Basic Nursing",
    content:[
      {type:"h2", text:"Vital Signs — The Core 4"},
      {type:"section", icon:"🌡️", text:"Temperature"},
      {type:"bullet", text:"Normal oral: 36.1–37.2°C (97–99°F)"},
      {type:"bullet", text:"Fever: >38°C | Hypothermia: <35°C"},
      {type:"bullet", text:"Routes: oral, rectal (+0.5°C), axillary (−0.5°C), tympanic"},
      {type:"section", icon:"💓", text:"Heart Rate (Pulse)"},
      {type:"bullet", text:"Normal adult: 60–100 bpm"},
      {type:"bullet", text:"Bradycardia: <60 bpm | Tachycardia: >100 bpm"},
      {type:"bullet", text:"Assess: rate, rhythm, volume, and character"},
      {type:"section", icon:"🫁", text:"Respiratory Rate"},
      {type:"bullet", text:"Normal adult: 12–20 breaths/min"},
      {type:"bullet", text:"Count for full 60 seconds without telling patient"},
      {type:"bullet", text:"Bradypnea <12 | Tachypnea >20"},
      {type:"section", icon:"🩸", text:"Blood Pressure"},
      {type:"bullet", text:"Normal: 120/80 mmHg"},
      {type:"bullet", text:"Hypertension: ≥140/90 | Hypotension: <90/60"},
      {type:"bullet", text:"Systolic = heart contracting | Diastolic = heart relaxing"},
    ],
  },
  {
    id:2, icon:"💉", title:"IV Fluids", color:"#2196f3", tag:"Pharmacology",
    content:[
      {type:"h2", text:"IV Fluid Types & Clinical Uses"},
      {type:"section", icon:"💧", text:"Isotonic Solutions (~285 mOsm/L)"},
      {type:"bullet", text:"Normal Saline (0.9% NaCl) — volume expansion, dehydration"},
      {type:"bullet", text:"Lactated Ringer's — surgery, burns, trauma"},
      {type:"bullet", text:"D5W — free water replacement (isotonic in bag, hypotonic in body)"},
      {type:"section", icon:"📈", text:"Hypertonic Solutions (>285 mOsm/L)"},
      {type:"bullet", text:"3% NaCl — severe hyponatremia (ICU use only)"},
      {type:"bullet", text:"D10W, D50W — hypoglycemia treatment"},
      {type:"bullet", text:"Effect: pulls fluid OUT of cells → cells shrink"},
      {type:"section", icon:"📉", text:"Hypotonic Solutions (<285 mOsm/L)"},
      {type:"bullet", text:"0.45% NaCl (half-normal saline) — cellular rehydration"},
      {type:"bullet", text:"Effect: pushes fluid INTO cells → cells swell"},
      {type:"section", icon:"⚠️", text:"Nursing Considerations"},
      {type:"bullet", text:"Always check IV site for infiltration and phlebitis"},
      {type:"bullet", text:"Monitor for fluid overload: crackles, edema, dyspnea"},
      {type:"bullet", text:"Document intake and output accurately every shift"},
    ],
  },
  {
    id:3, icon:"🩹", title:"Wound Care", color:"#4caf50", tag:"Clinical Skills",
    content:[
      {type:"h2", text:"Wound Assessment & Management"},
      {type:"section", icon:"🔍", text:"Wound Assessment — TIME Framework"},
      {type:"bullet", text:"T — Tissue type (granulation, slough, necrotic)"},
      {type:"bullet", text:"I — Infection or Inflammation signs"},
      {type:"bullet", text:"M — Moisture balance (too wet or too dry)"},
      {type:"bullet", text:"E — Edge of wound (advancing vs non-advancing)"},
      {type:"section", icon:"🎨", text:"Wound Color Classification"},
      {type:"bullet", text:"🔴 Red = healthy granulation → protect it"},
      {type:"bullet", text:"🟡 Yellow = slough present → debride and clean"},
      {type:"bullet", text:"⚫ Black = necrotic tissue → surgical debridement"},
      {type:"bullet", text:"🩷 Pink = epithelialization → protect and keep moist"},
      {type:"section", icon:"🧴", text:"Dressing Selection"},
      {type:"bullet", text:"Hydrocolloid — low to moderate exudate wounds"},
      {type:"bullet", text:"Hydrogel — dry wounds, promotes autolytic debridement"},
      {type:"bullet", text:"Alginate — heavy exudate wounds"},
      {type:"bullet", text:"Foam — moderate to heavy exudate wounds"},
    ],
  },
  {
    id:4, icon:"💊", title:"Drug Calculations", color:"#ff9800", tag:"Pharmacology",
    content:[
      {type:"h2", text:"Medication Dose Calculations"},
      {type:"section", icon:"📐", text:"Basic Formula"},
      {type:"bullet", text:"Dose = (Desired Dose ÷ Dose on Hand) × Volume"},
      {type:"bullet", text:"Example: Order 500mg, have 250mg/5mL → (500÷250)×5 = 10 mL"},
      {type:"section", icon:"⏱️", text:"IV Drip Rate (drops/min)"},
      {type:"bullet", text:"Formula: (Volume mL × Drop Factor) ÷ Time in minutes"},
      {type:"bullet", text:"Macro drop factors: 10, 15, or 20 gtt/mL"},
      {type:"bullet", text:"Micro drip factor: 60 gtt/mL"},
      {type:"bullet", text:"Example: 1000mL over 8hrs, df=20 → (1000×20)÷480 = 42 gtt/min"},
      {type:"section", icon:"⚖️", text:"Weight-Based Dosing"},
      {type:"bullet", text:"Dose = mg/kg × Patient Weight in kg"},
      {type:"bullet", text:"Example: 5mg/kg for 60kg patient = 300mg"},
      {type:"section", icon:"🔑", text:"The 5 Rights of Medication Administration"},
      {type:"bullet", text:"Right Patient • Right Drug • Right Dose • Right Route • Right Time"},
    ],
  },
  {
    id:5, icon:"🦠", title:"Infection Control", color:"#9c27b0", tag:"Microbiology",
    content:[
      {type:"h2", text:"Infection Control Principles"},
      {type:"section", icon:"🧤", text:"Standard Precautions (ALL Patients)"},
      {type:"bullet", text:"Hand hygiene — single most important prevention measure"},
      {type:"bullet", text:"PPE: gloves, gown, mask, eye protection as indicated"},
      {type:"bullet", text:"Safe sharps disposal — never recap needles"},
      {type:"bullet", text:"Respiratory hygiene and cough etiquette"},
      {type:"section", icon:"🔒", text:"Transmission-Based Precautions"},
      {type:"bullet", text:"Contact (MRSA, VRE, C.diff) — gloves + gown on entry"},
      {type:"bullet", text:"Droplet (Flu, COVID, Mumps) — surgical mask within 1 meter"},
      {type:"bullet", text:"Airborne (TB, Measles, Varicella) — N95 + negative pressure room"},
      {type:"section", icon:"🙌", text:"WHO 5 Moments of Hand Hygiene"},
      {type:"bullet", text:"1. Before patient contact"},
      {type:"bullet", text:"2. Before aseptic procedure"},
      {type:"bullet", text:"3. After body fluid exposure"},
      {type:"bullet", text:"4. After patient contact"},
      {type:"bullet", text:"5. After contact with patient surroundings"},
    ],
  },
];

const ENGLISH_LESSONS = [
  {
    id:1, title:"Medical Terminology Basics", level:"Basic", icon:"🔤",
    vocab:[
      { word:"Tachycardia", meaning:"Abnormally fast heart rate (>100 bpm)" },
      { word:"Bradycardia", meaning:"Abnormally slow heart rate (<60 bpm)" },
      { word:"Dyspnea", meaning:"Difficulty or labored breathing" },
      { word:"Edema", meaning:"Swelling caused by excess fluid in tissue" },
      { word:"Febrile", meaning:"Having or relating to a fever" },
      { word:"Afebrile", meaning:"Without fever; normal body temperature" },
      { word:"Diaphoresis", meaning:"Excessive sweating, often associated with illness" },
      { word:"Pallor", meaning:"Paleness of skin, often indicating anemia or shock" },
    ],
    phrase:"The patient is febrile at 38.9°C, diaphoretic, and presenting with dyspnea on exertion.",
  },
  {
    id:2, title:"Patient Communication", level:"Intermediate", icon:"💬",
    vocab:[
      { word:"Chief complaint", meaning:"Primary reason the patient is seeking care" },
      { word:"Onset", meaning:"When the symptom first began" },
      { word:"Severity", meaning:"Intensity of the symptom (0–10 pain scale)" },
      { word:"Alleviating factors", meaning:"What makes the symptom better" },
      { word:"Aggravating factors", meaning:"What makes the symptom worse" },
      { word:"Radiating pain", meaning:"Pain that spreads from one area to another" },
      { word:"Informed consent", meaning:"Patient's voluntary agreement after being informed" },
      { word:"Therapeutic communication", meaning:"Purposeful interaction to support patient wellbeing" },
    ],
    phrase:"Can you describe your chief complaint? On a scale of 0 to 10, how severe is your pain, and does it radiate anywhere?",
  },
  {
    id:3, title:"Nursing Documentation", level:"Advanced", icon:"📋",
    vocab:[
      { word:"SOAP note", meaning:"Subjective, Objective, Assessment, Plan format" },
      { word:"PRN", meaning:"Pro re nata — administer as needed" },
      { word:"NPO", meaning:"Nil per os — nothing by mouth" },
      { word:"ADL", meaning:"Activities of Daily Living (bathing, eating, dressing)" },
      { word:"SBAR", meaning:"Situation, Background, Assessment, Recommendation" },
      { word:"Incident report", meaning:"Documentation of any unexpected clinical event" },
      { word:"Critical value", meaning:"Lab result requiring immediate physician notification" },
      { word:"Variance", meaning:"Deviation from expected clinical pathway or outcome" },
    ],
    phrase:"Patient is NPO post-midnight for scheduled surgery. SBAR report communicated to oncoming nurse. PRN analgesics administered per order with documented response.",
  },
];

const PDFS = [
  { id:1, title:"NCLEX-RN Complete Review Guide", pages:280, size:"14.2 MB", free:true, icon:"📘", tag:"NCLEX" },
  { id:2, title:"NCLEX-PN Exam Prep 2024", pages:195, size:"10.1 MB", free:false, icon:"📗", tag:"NCLEX" },
  { id:3, title:"Pharmacology for Nurses", pages:85, size:"5.1 MB", free:false, icon:"💊", tag:"Pharmacology" },
  { id:4, title:"Anatomy Quick Revision", pages:60, size:"4.3 MB", free:true, icon:"🫀", tag:"Anatomy" },
  { id:5, title:"Medical-Surgical Nursing", pages:200, size:"12.8 MB", free:false, icon:"🏥", tag:"Clinical" },
  { id:6, title:"Pediatric Nursing Notes", pages:75, size:"4.9 MB", free:true, icon:"👶", tag:"Pediatrics" },
  { id:7, title:"NCLEX Alternate Format Questions", pages:150, size:"8.4 MB", free:false, icon:"📝", tag:"NCLEX" },
  { id:8, title:"Obstetric Nursing Full Guide", pages:110, size:"7.6 MB", free:false, icon:"🤰", tag:"OB/GYN" },
];

const NAV = [
  { id:"home",    icon:"🏠", label:"Home" },
  { id:"mcq",     icon:"📝", label:"Daily MCQ" },
  { id:"nclex",   icon:"🎓", label:"NCLEX Prep" },
  { id:"notes",   icon:"📖", label:"Notes" },
  { id:"quiz",    icon:"🧠", label:"Quiz" },
  { id:"english", icon:"🌐", label:"English" },
  { id:"pdf",     icon:"📄", label:"PDF Corner" },
];

/* ═══════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <FontLink />
      <style>{GLOBAL_CSS}</style>
      <div className="app">
        <Sidebar page={page} setPage={(p)=>{ setPage(p); setMenuOpen(false); }} menuOpen={menuOpen} />
        <div className="main">
          <TopBar page={page} onMenu={()=>setMenuOpen(o=>!o)} />
          <div className="content-area">
            {page==="home"    && <HomePage setPage={setPage} />}
            {page==="mcq"     && <MCQPage />}
            {page==="nclex"   && <NclexPage />}
            {page==="notes"   && <NotesPage />}
            {page==="quiz"    && <QuizPage />}
            {page==="english" && <EnglishPage />}
            {page==="pdf"     && <PDFPage />}
          </div>
        </div>
        {menuOpen && <div className="overlay" onClick={()=>setMenuOpen(false)} />}
      </div>
    </>
  );
}

/* ─── Sidebar ─── */
function Sidebar({ page, setPage, menuOpen }) {
  return (
    <aside className={`sidebar ${menuOpen?"open":""}`}>
      <div className="logo">
        <span className="logo-icon">🩺</span>
        <div>
          <div className="logo-name">Nurses</div>
          <div className="logo-dot">.com BD</div>
        </div>
      </div>
      <nav className="nav">
        {NAV.map(n=>(
          <button key={n.id} className={`nav-item ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
            <span className="nav-icon">{n.icon}</span>
            <span className="nav-label">{n.label}</span>
            {n.id==="nclex" && <span className="nav-new">NEW</span>}
            {page===n.id && <span className="nav-dot" />}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="footer-card">
          <div style={{fontSize:22}}>⭐</div>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:"#fff"}}>Go Premium</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.55)"}}>Unlock all content</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ─── TopBar ─── */
function TopBar({ page, onMenu }) {
  const titles = { home:"Welcome Back 👋", mcq:"Daily MCQ", nclex:"NCLEX Prep", notes:"Nursing Notes", quiz:"Quiz Test", english:"English for Nurses", pdf:"PDF Corner" };
  return (
    <div className="topbar">
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button className="menu-btn" onClick={onMenu}>☰</button>
        <div>
          <div className="topbar-title">{titles[page]}</div>
          <div className="topbar-sub">Nurses.com BD — Nursing Excellence</div>
        </div>
      </div>
      <div className="topbar-right">
        <div className="streak-badge">🔥 7-day streak</div>
        <div className="avatar">NS</div>
      </div>
    </div>
  );
}

/* ─── HOME ─── */
function HomePage({ setPage }) {
  const cards = [
    { id:"mcq",     icon:"📝", label:"Daily MCQ",      desc:"10 questions daily",  color:"#e63946" },
    { id:"nclex",   icon:"🎓", label:"NCLEX Prep",     desc:"SATA, Priority & more", color:"#00b4d8", badge:"NEW" },
    { id:"notes",   icon:"📖", label:"Nursing Notes",  desc:"Detailed study notes", color:"#2196f3" },
    { id:"quiz",    icon:"🧠", label:"Quiz Test",       desc:"Timed quiz challenge", color:"#ff9800" },
    { id:"english", icon:"🌐", label:"English",         desc:"Medical terminology",  color:"#4caf50" },
    { id:"pdf",     icon:"📄", label:"PDF Corner",      desc:"Free PDF downloads",   color:"#9c27b0" },
  ];
  return (
    <div className="home-wrap">
      <div className="hero">
        <div className="hero-text">
          <div className="hero-tag">🎯 Today's Goal</div>
          <h1 className="hero-h1">Ace Your<br/>Nursing Exams</h1>
          <p className="hero-p">MCQ, NCLEX, Notes & more — all in one place</p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button className="hero-btn" onClick={()=>setPage("mcq")}>Start MCQ →</button>
            <button className="hero-btn-outline" onClick={()=>setPage("nclex")}>NCLEX Prep</button>
          </div>
        </div>
        <div className="hero-visual">🩺</div>
      </div>
      <div className="stats-row">
        {[
          {icon:"🔥",val:"7",label:"Day Streak"},
          {icon:"✅",val:"142",label:"MCQ Solved"},
          {icon:"🏆",val:"#23",label:"Leaderboard"},
          {icon:"📚",val:"5",label:"Topics Done"},
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="section-title">All Sections</div>
      <div className="cards-grid">
        {cards.map(c=>(
          <button key={c.id} className="feature-card" style={{"--accent":c.color}} onClick={()=>setPage(c.id)}>
            <div className="fc-icon">{c.icon}</div>
            {c.badge && <span className="fc-badge">{c.badge}</span>}
            <div className="fc-label">{c.label}</div>
            <div className="fc-desc">{c.desc}</div>
            <div className="fc-arrow">→</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── MCQ PAGE ─── */
function MCQPage() {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const pick = (i) => {
    if (revealed) return;
    setSel(i);
    setRevealed(true);
    if (i === MCQ_BANK[idx].ans) setScore(s=>s+1);
  };
  const next = () => {
    if (idx+1 >= MCQ_BANK.length) { setDone(true); return; }
    setSel(null); setRevealed(false); setIdx(i=>i+1);
  };
  const restart = () => { setSel(null); setRevealed(false); setIdx(0); setScore(0); setDone(false); };

  if (done) return (
    <ResultBox score={score} total={MCQ_BANK.length} onRestart={restart} />
  );

  const q = MCQ_BANK[idx];
  return (
    <div className="mcq-wrap">
      <div className="mcq-meta">
        <span className="pill teal">Daily MCQ</span>
        <span className="mcq-progress-txt">Question {idx+1} of {MCQ_BANK.length}</span>
        <span className="pill green">Score: {score}</span>
      </div>
      <div className="progress-track"><div className="progress-fill" style={{width:`${((idx+1)/MCQ_BANK.length)*100}%`}} /></div>
      <div className="q-card">
        <div className="q-number">Q{idx+1}</div>
        <div className="q-text">{q.q}</div>
      </div>
      <div className="opts">
        {q.opts.map((o,i)=>{
          let cls="opt";
          if (revealed){ if(i===q.ans) cls+=" correct"; else if(i===sel) cls+=" wrong"; }
          else if(sel===i) cls+=" selected";
          return (
            <button key={i} className={cls} onClick={()=>pick(i)}>
              <span className="opt-letter">{String.fromCharCode(65+i)}</span>{o}
              {revealed && i===q.ans && <span className="opt-check">✓</span>}
              {revealed && i===sel && i!==q.ans && <span className="opt-x">✗</span>}
            </button>
          );
        })}
      </div>
      {revealed && <div className="explain-box"><strong>💡 Explanation:</strong> {q.explain}</div>}
      {revealed && (
        <button className="btn-primary" onClick={next}>
          {idx+1<MCQ_BANK.length ? "Next Question →" : "View Results 🏁"}
        </button>
      )}
    </div>
  );
}

/* ─── NCLEX PAGE ─── */
function NclexPage() {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [filter, setFilter] = useState("All");

  const types = ["All","MCQ","SATA","Priority"];
  const filtered = filter==="All" ? NCLEX_BANK : NCLEX_BANK.filter(q=>q.type===filter);
  const q = filtered[idx] || NCLEX_BANK[0];
  const isSATA = q.type==="SATA";

  const toggleSel = (i) => {
    if (revealed) return;
    if (isSATA) setSel(s=>s.includes(i)?s.filter(x=>x!==i):[...s,i]);
    else setSel([i]);
  };

  const submit = () => {
    if (sel.length===0) return;
    setRevealed(true);
    const correct = q.ans;
    const isCorrect = isSATA
      ? correct.length===sel.length && correct.every(a=>sel.includes(a))
      : sel[0]===correct[0];
    if (isCorrect) setScore(s=>s+1);
  };

  const next = () => {
    if (idx+1>=filtered.length){ setDone(true); return; }
    setSel([]); setRevealed(false); setIdx(i=>i+1);
  };

  const restart = () => { setSel([]); setRevealed(false); setIdx(0); setScore(0); setDone(false); };

  if (done) return <ResultBox score={score} total={filtered.length} onRestart={restart} label="NCLEX" />;

  return (
    <div className="mcq-wrap">
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,flexWrap:"wrap"}}>
        <span className="pill" style={{background:"#00b4d822",color:"#007a9c",fontWeight:800}}>🎓 NCLEX Prep</span>
        <span className={`nclex-type-badge ${q.type.toLowerCase()}`}>{q.type}</span>
        <span className="pill" style={{background:"#f0f0f8",color:"#666",fontSize:10}}>{q.category}</span>
        <span className="mcq-progress-txt">{idx+1}/{filtered.length}</span>
      </div>

      {/* Filter */}
      <div className="filter-row" style={{marginBottom:14}}>
        {types.map(t=>(
          <button key={t} className={`filter-btn ${filter===t?"active":""}`}
            onClick={()=>{ setFilter(t); setIdx(0); setSel([]); setRevealed(false); setScore(0); setDone(false); }}>
            {t}
          </button>
        ))}
      </div>

      <div className="progress-track"><div className="progress-fill nclex-fill" style={{width:`${((idx+1)/filtered.length)*100}%`}} /></div>

      {/* SATA hint */}
      {isSATA && !revealed && (
        <div className="sata-hint">☑ Select ALL that apply — choose all correct answers, then click Submit</div>
      )}

      <div className="q-card">
        <div className="q-number">Q{idx+1} — {q.type}</div>
        <div className="q-text">{q.q}</div>
      </div>

      <div className="opts">
        {q.opts.map((o,i)=>{
          let cls="opt";
          if (revealed){
            if(q.ans.includes(i)) cls+=" correct";
            else if(sel.includes(i)&&!q.ans.includes(i)) cls+=" wrong";
          } else if(sel.includes(i)) cls+=" selected";
          return (
            <button key={i} className={cls} onClick={()=>toggleSel(i)}>
              <span className={isSATA?"opt-checkbox":"opt-letter"}>
                {isSATA ? (sel.includes(i)||( revealed&&q.ans.includes(i)) ? "☑":"☐") : String.fromCharCode(65+i)}
              </span>
              {o}
              {revealed && q.ans.includes(i) && <span className="opt-check">✓</span>}
              {revealed && sel.includes(i) && !q.ans.includes(i) && <span className="opt-x">✗</span>}
            </button>
          );
        })}
      </div>

      {!revealed && (
        <button className="btn-primary" onClick={submit} disabled={sel.length===0}
          style={{opacity:sel.length===0?0.5:1}}>
          Submit Answer
        </button>
      )}

      {revealed && <div className="explain-box"><strong>💡 Rationale:</strong> {q.explain}</div>}
      {revealed && (
        <button className="btn-primary" onClick={next}>
          {idx+1<filtered.length ? "Next Question →" : "View Results 🏁"}
        </button>
      )}
    </div>
  );
}

/* ─── RESULT BOX ─── */
function ResultBox({ score, total, onRestart, label="MCQ" }) {
  const pct = Math.round((score/total)*100);
  return (
    <div className="result-box">
      <div className="result-emoji">{pct>=80?"🏆":pct>=50?"😊":"📚"}</div>
      <div className="result-title">{label} Complete!</div>
      <div className="result-score">{score} / {total}</div>
      <div className="result-pct">{pct}%</div>
      <div className="result-msg">{pct>=80?"Excellent! You're ready!":pct>=50?"Good job! Keep practicing!":"Keep studying, you'll get there!"}</div>
      <button className="btn-primary" style={{marginTop:20,maxWidth:240}} onClick={onRestart}>Try Again</button>
    </div>
  );
}

/* ─── NOTES PAGE ─── */
function NotesPage() {
  const [open, setOpen] = useState(null);
  if (open!==null) {
    const n = NOTES[open];
    return (
      <div className="note-detail">
        <button className="back-btn" onClick={()=>setOpen(null)}>← Back to Notes</button>
        <div className="note-detail-header" style={{"--nc":n.color}}>
          <span style={{fontSize:36}}>{n.icon}</span>
          <div>
            <div className="note-detail-title">{n.title}</div>
            <span className="pill" style={{background:n.color+"22",color:n.color,fontSize:10}}>{n.tag}</span>
          </div>
        </div>
        <div className="note-detail-content">
          {n.content.map((item,i)=>{
            if(item.type==="h2") return <h2 key={i} className="note-h2">{item.text}</h2>;
            if(item.type==="section") return <div key={i} className="note-section-head">{item.icon} <strong>{item.text}</strong></div>;
            if(item.type==="bullet") return <div key={i} className="note-bullet">• {item.text}</div>;
            return null;
          })}
        </div>
      </div>
    );
  }
  return (
    <div className="notes-wrap">
      <div className="section-title">Study Topics</div>
      <div className="notes-grid">
        {NOTES.map((n,i)=>(
          <button key={n.id} className="note-card" style={{"--nc":n.color}} onClick={()=>setOpen(i)}>
            <div className="nc-icon">{n.icon}</div>
            <div className="nc-body">
              <div className="nc-title">{n.title}</div>
              <span className="pill" style={{background:n.color+"22",color:n.color,fontSize:10}}>{n.tag}</span>
            </div>
            <div className="nc-arrow" style={{color:n.color}}>→</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── QUIZ PAGE ─── */
function QuizPage() {
  const [started, setStarted] = useState(false);
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [time, setTime] = useState(15);
  const timerRef = useRef(null);

  useEffect(()=>{
    if (!started||done||sel!==null) return;
    setTime(15);
    timerRef.current = setInterval(()=>{
      setTime(t=>{ if(t<=1){ clearInterval(timerRef.current); setSel(-1); setTimeout(advance,900); return 0; } return t-1; });
    },1000);
    return ()=>clearInterval(timerRef.current);
  },[qi,started,done]);

  const advance = () => setQi(q=>{ const next=q+1; if(next>=MCQ_BANK.length){setDone(true);} else{setSel(null);} return next; });
  const pick = (i) => {
    if(sel!==null) return;
    clearInterval(timerRef.current);
    setSel(i);
    if(i===MCQ_BANK[qi].ans) setScore(s=>s+1);
    setTimeout(advance,1000);
  };
  const restart = () => { setStarted(false); setQi(0); setSel(null); setScore(0); setDone(false); };

  if (!started) return (
    <div className="result-box">
      <div className="result-emoji">🧠</div>
      <div className="result-title">Quiz Mode</div>
      <div className="result-msg" style={{textAlign:"center",maxWidth:300}}>
        {MCQ_BANK.length} questions · 15 seconds each · Auto-advances when time runs out!
      </div>
      <button className="btn-primary" style={{marginTop:20,maxWidth:220}} onClick={()=>setStarted(true)}>Start Quiz 🚀</button>
    </div>
  );
  if (done) return <ResultBox score={score} total={MCQ_BANK.length} onRestart={restart} label="Quiz" />;

  const q = MCQ_BANK[qi];
  return (
    <div className="mcq-wrap">
      <div className="mcq-meta">
        <span className="pill orange">Quiz Mode</span>
        <span className="mcq-progress-txt">{qi+1}/{MCQ_BANK.length}</span>
        <span className={`timer-badge ${time<=5?"danger":""}`}>⏱ {time}s</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{width:`${(time/15)*100}%`,background:time<=5?"#e63946":"#ff9800",transition:"width 1s linear"}} />
      </div>
      <div className="q-card"><div className="q-number">Q{qi+1}</div><div className="q-text">{q.q}</div></div>
      <div className="opts">
        {q.opts.map((o,i)=>{
          let cls="opt";
          if(sel!==null){ if(i===q.ans) cls+=" correct"; else if(i===sel) cls+=" wrong"; }
          return <button key={i} className={cls} onClick={()=>pick(i)}><span className="opt-letter">{String.fromCharCode(65+i)}</span>{o}</button>;
        })}
      </div>
    </div>
  );
}

/* ─── ENGLISH PAGE ─── */
function EnglishPage() {
  const [open, setOpen] = useState(null);
  if (open!==null) {
    const l = ENGLISH_LESSONS[open];
    return (
      <div className="note-detail">
        <button className="back-btn" onClick={()=>setOpen(null)}>← Back to Lessons</button>
        <div className="eng-header">
          <span style={{fontSize:32}}>{l.icon}</span>
          <div>
            <div className="note-detail-title">{l.title}</div>
            <span className={`level-badge ${l.level.toLowerCase()}`}>{l.level}</span>
          </div>
        </div>
        <div className="section-title" style={{margin:"20px 0 12px"}}>Vocabulary</div>
        <div className="vocab-grid">
          {l.vocab.map(v=>(
            <div key={v.word} className="vocab-card">
              <div className="vocab-word">{v.word}</div>
              <div className="vocab-meaning">{v.meaning}</div>
            </div>
          ))}
        </div>
        <div className="section-title" style={{margin:"24px 0 12px"}}>Example Sentence</div>
        <div className="example-box">"{l.phrase}"</div>
      </div>
    );
  }
  return (
    <div className="notes-wrap">
      <div className="section-title">Lessons</div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {ENGLISH_LESSONS.map((l,i)=>(
          <button key={l.id} className="eng-card" onClick={()=>setOpen(i)}>
            <span style={{fontSize:28}}>{l.icon}</span>
            <div style={{flex:1,textAlign:"left"}}>
              <div className="nc-title">{l.title}</div>
              <span className={`level-badge ${l.level.toLowerCase()}`}>{l.level}</span>
            </div>
            <span style={{fontSize:18,color:"#aaa"}}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── PDF PAGE ─── */
function PDFPage() {
  const [filter, setFilter] = useState("All");
  const tags = ["All","NCLEX","Pharmacology","Anatomy","Clinical","Pediatrics","OB/GYN"];
  const filtered = filter==="All" ? PDFS : PDFS.filter(p=>p.tag===filter);
  return (
    <div className="notes-wrap">
      <div className="filter-row">
        {tags.map(t=>(
          <button key={t} className={`filter-btn ${filter===t?"active":""}`} onClick={()=>setFilter(t)}>{t}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:16}}>
        {filtered.map(p=>(
          <div key={p.id} className="pdf-card">
            <div className="pdf-icon">{p.icon}</div>
            <div className="pdf-info">
              <div className="pdf-title">{p.title}</div>
              <div className="pdf-meta">{p.pages} pages · {p.size}</div>
              <span className="pill" style={{fontSize:10,background:"#f0f0f5",color:"#666",marginTop:4}}>{p.tag}</span>
            </div>
            <button className={`dl-btn ${p.free?"free":"premium"}`}>
              {p.free ? "⬇ Free" : "🔒 Premium"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CSS
═══════════════════════════════════════════ */
const GLOBAL_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:#0f0f1a;}
.app{display:flex;min-height:100vh;font-family:'Sora',sans-serif;background:#f4f5fb;color:#1a1a2e;}
.sidebar{width:220px;min-height:100vh;background:linear-gradient(180deg,#1a1a2e 0%,#16213e 100%);display:flex;flex-direction:column;padding:24px 0;position:sticky;top:0;height:100vh;flex-shrink:0;z-index:100;transition:transform 0.3s;}
.logo{display:flex;align-items:center;gap:10px;padding:0 20px 28px;border-bottom:1px solid rgba(255,255,255,0.07);}
.logo-icon{font-size:28px;}
.logo-name{font-size:18px;font-weight:900;color:#fff;letter-spacing:-0.5px;line-height:1;}
.logo-dot{font-size:11px;color:#00d4aa;font-weight:700;}
.nav{display:flex;flex-direction:column;gap:4px;padding:20px 12px;flex:1;}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;border:none;background:none;color:rgba(255,255,255,0.55);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;text-align:left;position:relative;}
.nav-item:hover{background:rgba(255,255,255,0.06);color:#fff;}
.nav-item.active{background:rgba(0,212,170,0.15);color:#00d4aa;}
.nav-icon{font-size:17px;flex-shrink:0;}
.nav-new{background:#00b4d8;color:#fff;font-size:9px;font-weight:800;padding:2px 6px;border-radius:8px;margin-left:auto;}
.nav-dot{position:absolute;right:10px;width:6px;height:6px;border-radius:50%;background:#00d4aa;}
.sidebar-footer{padding:16px 12px 0;}
.footer-card{background:linear-gradient(135deg,#00d4aa22,#0081cf22);border:1px solid rgba(0,212,170,0.2);border-radius:14px;padding:12px;display:flex;gap:10px;align-items:center;}
.main{flex:1;display:flex;flex-direction:column;min-width:0;}
.topbar{background:#fff;border-bottom:1px solid #eee;padding:16px 28px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:10;}
.topbar-title{font-size:18px;font-weight:800;color:#1a1a2e;}
.topbar-sub{font-size:11px;color:#aaa;margin-top:2px;}
.topbar-right{display:flex;align-items:center;gap:12px;}
.streak-badge{background:linear-gradient(135deg,#ff9800,#e63946);color:#fff;padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700;}
.avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#1a1a2e,#0081cf);color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;}
.menu-btn{display:none;background:none;border:none;font-size:20px;cursor:pointer;color:#333;padding:4px 8px;}
.content-area{flex:1;padding:24px 28px;overflow-y:auto;}
.overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99;}
.home-wrap{max-width:900px;}
.hero{background:linear-gradient(135deg,#1a1a2e 0%,#0081cf 100%);border-radius:24px;padding:32px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;overflow:hidden;position:relative;}
.hero::before{content:'';position:absolute;top:-40px;right:120px;width:180px;height:180px;border-radius:50%;background:rgba(0,212,170,0.08);}
.hero-tag{background:rgba(0,212,170,0.2);color:#00d4aa;display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;margin-bottom:12px;}
.hero-h1{font-size:26px;font-weight:900;color:#fff;line-height:1.25;margin-bottom:8px;}
.hero-p{font-size:13px;color:rgba(255,255,255,0.65);margin-bottom:20px;}
.hero-btn{background:#00d4aa;color:#0f0f1a;border:none;border-radius:30px;padding:10px 24px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;transition:transform 0.15s;}
.hero-btn:hover{transform:translateY(-2px);}
.hero-btn-outline{background:transparent;color:#fff;border:2px solid rgba(255,255,255,0.4);border-radius:30px;padding:10px 24px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.15s;}
.hero-btn-outline:hover{background:rgba(255,255,255,0.1);}
.hero-visual{font-size:80px;opacity:0.9;flex-shrink:0;}
.stats-row{display:flex;gap:14px;margin-bottom:28px;}
.stat-card{flex:1;background:#fff;border-radius:16px;padding:16px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);}
.stat-icon{font-size:22px;margin-bottom:6px;}
.stat-val{font-size:20px;font-weight:900;color:#1a1a2e;}
.stat-label{font-size:11px;color:#888;margin-top:2px;}
.section-title{font-size:13px;font-weight:800;color:#888;margin-bottom:14px;text-transform:uppercase;letter-spacing:0.8px;}
.cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:14px;}
.feature-card{background:#fff;border-radius:18px;padding:20px 16px;border:none;cursor:pointer;text-align:left;box-shadow:0 2px 12px rgba(0,0,0,0.06);border-top:3px solid var(--accent);transition:transform 0.2s,box-shadow 0.2s;font-family:inherit;position:relative;}
.feature-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.1);}
.fc-icon{font-size:28px;margin-bottom:10px;}
.fc-badge{position:absolute;top:12px;right:12px;background:#00b4d8;color:#fff;font-size:9px;font-weight:800;padding:2px 7px;border-radius:8px;}
.fc-label{font-size:13px;font-weight:800;color:#1a1a2e;margin-bottom:4px;}
.fc-desc{font-size:11px;color:#888;}
.fc-arrow{font-size:18px;color:var(--accent);margin-top:10px;}
.mcq-wrap{max-width:680px;}
.mcq-meta{display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap;}
.mcq-progress-txt{font-size:13px;font-weight:700;color:#888;flex:1;}
.progress-track{height:6px;background:#eee;border-radius:10px;margin-bottom:20px;overflow:hidden;}
.progress-fill{height:100%;background:linear-gradient(90deg,#00d4aa,#0081cf);border-radius:10px;transition:width 0.4s;}
.nclex-fill{background:linear-gradient(90deg,#00b4d8,#0077b6)!important;}
.q-card{background:#fff;border-radius:18px;padding:22px;margin-bottom:16px;box-shadow:0 2px 14px rgba(0,0,0,0.07);}
.q-number{font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;margin-bottom:8px;}
.q-text{font-size:15px;font-weight:700;color:#1a1a2e;line-height:1.6;}
.opts{display:flex;flex-direction:column;gap:10px;margin-bottom:16px;}
.opt{display:flex;align-items:center;gap:12px;padding:13px 16px;border-radius:14px;background:#fff;border:1.5px solid #e8e8f0;cursor:pointer;font-family:inherit;font-size:13px;color:#333;text-align:left;transition:all 0.15s;box-shadow:0 1px 6px rgba(0,0,0,0.04);}
.opt:hover{border-color:#0081cf;background:#f0f8ff;}
.opt.selected{border-color:#0081cf;background:#e8f4ff;}
.opt.correct{border-color:#00c97a;background:#e6fff4;color:#006b42;}
.opt.wrong{border-color:#e63946;background:#ffe6e8;color:#b00020;}
.opt-letter{width:26px;height:26px;border-radius:50%;background:rgba(0,0,0,0.06);font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.opt-checkbox{font-size:18px;flex-shrink:0;color:#0081cf;}
.opt-check{margin-left:auto;color:#00c97a;font-size:16px;font-weight:900;}
.opt-x{margin-left:auto;color:#e63946;font-size:16px;font-weight:900;}
.explain-box{background:#fff9e6;border:1px solid #ffd97d;border-radius:12px;padding:14px;font-size:13px;color:#5a4000;margin-bottom:16px;line-height:1.6;}
.sata-hint{background:#e8f4ff;border:1px solid #90caf9;border-radius:12px;padding:12px 14px;font-size:12px;color:#0055a5;margin-bottom:14px;font-weight:600;}
.nclex-type-badge{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800;}
.nclex-type-badge.sata{background:#fff3e0;color:#e67000;}
.nclex-type-badge.priority{background:#fce4ec;color:#c62828;}
.nclex-type-badge.mcq{background:#e8f5e9;color:#2e7d32;}
.btn-primary{background:linear-gradient(135deg,#1a1a2e,#0081cf);color:#fff;border:none;border-radius:14px;padding:13px 28px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;transition:transform 0.15s;}
.btn-primary:hover{transform:translateY(-2px);}
.result-box{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50vh;text-align:center;max-width:380px;margin:0 auto;}
.result-emoji{font-size:72px;margin-bottom:16px;}
.result-title{font-size:24px;font-weight:900;color:#1a1a2e;margin-bottom:8px;}
.result-score{font-size:48px;font-weight:900;color:#0081cf;margin-bottom:4px;}
.result-pct{font-size:18px;font-weight:700;color:#00d4aa;margin-bottom:8px;}
.result-msg{font-size:14px;color:#888;margin-bottom:8px;}
.timer-badge{padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;background:#fff3e0;color:#ff9800;}
.timer-badge.danger{background:#ffe6e8;color:#e63946;}
.notes-wrap{max-width:800px;}
.notes-grid{display:flex;flex-direction:column;gap:12px;}
.note-card{background:#fff;border-radius:16px;padding:16px 18px;display:flex;align-items:center;gap:14px;border:none;cursor:pointer;text-align:left;box-shadow:0 2px 10px rgba(0,0,0,0.06);border-left:4px solid var(--nc);transition:transform 0.15s;font-family:inherit;}
.note-card:hover{transform:translateX(4px);}
.nc-icon{font-size:28px;flex-shrink:0;}
.nc-body{flex:1;}
.nc-title{font-size:14px;font-weight:800;color:#1a1a2e;margin-bottom:4px;}
.nc-arrow{font-size:18px;}
.note-detail{max-width:680px;}
.back-btn{background:none;border:1.5px solid #e0e0e8;border-radius:10px;padding:7px 16px;font-size:13px;font-weight:700;cursor:pointer;color:#555;margin-bottom:20px;font-family:inherit;}
.note-detail-header{display:flex;align-items:center;gap:14px;background:#fff;border-radius:18px;padding:20px;margin-bottom:20px;border-left:4px solid var(--nc);box-shadow:0 2px 12px rgba(0,0,0,0.06);}
.note-detail-title{font-size:18px;font-weight:800;color:#1a1a2e;margin-bottom:6px;}
.note-detail-content{background:#fff;border-radius:18px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.06);line-height:1.7;}
.note-h2{font-size:16px;font-weight:900;color:#1a1a2e;margin:0 0 16px;padding-bottom:8px;border-bottom:2px solid #f0f0f8;}
.note-section-head{font-size:14px;font-weight:700;color:#1a1a2e;margin:16px 0 6px;}
.note-bullet{font-size:13px;color:#444;padding:3px 0 3px 10px;line-height:1.6;}
.eng-card{background:#fff;border-radius:16px;padding:16px 18px;display:flex;align-items:center;gap:14px;border:none;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,0.06);transition:transform 0.15s;font-family:inherit;width:100%;}
.eng-card:hover{transform:translateY(-2px);}
.eng-header{display:flex;align-items:center;gap:14px;background:#fff;border-radius:18px;padding:20px;margin-bottom:4px;box-shadow:0 2px 12px rgba(0,0,0,0.06);}
.level-badge{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;}
.level-badge.basic{background:#e6fff4;color:#00a07a;}
.level-badge.intermediate{background:#fff3e0;color:#e67000;}
.level-badge.advanced{background:#f0eaff;color:#6a1be3;}
.vocab-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.vocab-card{background:#f7f7fb;border-radius:12px;padding:12px 14px;}
.vocab-word{font-size:13px;font-weight:800;color:#0081cf;margin-bottom:4px;}
.vocab-meaning{font-size:12px;color:#555;}
.example-box{background:linear-gradient(135deg,#e8f4ff,#f0eaff);border-radius:14px;padding:16px 18px;font-size:14px;font-style:italic;color:#333;border-left:4px solid #0081cf;line-height:1.6;}
.filter-row{display:flex;gap:8px;flex-wrap:wrap;}
.filter-btn{background:#fff;border:1.5px solid #e0e0e8;border-radius:20px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;color:#666;transition:all 0.15s;}
.filter-btn:hover{border-color:#0081cf;color:#0081cf;}
.filter-btn.active{background:#1a1a2e;color:#fff;border-color:#1a1a2e;}
.pdf-card{background:#fff;border-radius:16px;padding:16px 18px;display:flex;align-items:center;gap:14px;box-shadow:0 2px 10px rgba(0,0,0,0.06);}
.pdf-icon{font-size:32px;flex-shrink:0;}
.pdf-info{flex:1;}
.pdf-title{font-size:14px;font-weight:700;color:#1a1a2e;margin-bottom:3px;}
.pdf-meta{font-size:11px;color:#888;}
.dl-btn{padding:7px 16px;border-radius:20px;border:none;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;flex-shrink:0;transition:transform 0.15s;}
.dl-btn:hover{transform:scale(1.05);}
.dl-btn.free{background:#00c97a;color:#fff;}
.dl-btn.premium{background:#ff9800;color:#fff;}
.pill{display:inline-block;padding:3px 11px;border-radius:20px;font-size:11px;font-weight:700;}
.pill.teal{background:#e6fff9;color:#00a07a;}
.pill.green{background:#e6fff4;color:#00a07a;}
.pill.orange{background:#fff3e0;color:#e67000;}
@media(max-width:768px){
  .sidebar{position:fixed;left:0;top:0;height:100vh;transform:translateX(-100%);}
  .sidebar.open{transform:translateX(0);}
  .overlay{display:block;}
  .menu-btn{display:block;}
  .content-area{padding:16px;}
  .topbar{padding:12px 16px;}
  .hero{flex-direction:column;gap:16px;padding:24px 20px;}
  .hero-visual{font-size:50px;}
  .stats-row{gap:8px;}
  .cards-grid{grid-template-columns:1fr 1fr;}
  .vocab-grid{grid-template-columns:1fr;}
  .topbar-title{font-size:15px;}
  .streak-badge{display:none;}
}
`;
