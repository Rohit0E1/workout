"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import SyncStatus from "./SyncStatus";

// ── EQUIPMENT ─────────────────────────────────────────────────────────────
const EQ = {
  barbell:    { icon:"🏋️", label:"Barbell",    bg:"#FFF3E0", color:"#E65100" },
  dumbbell:   { icon:"💪", label:"Dumbbell",   bg:"#E8F5E9", color:"#2E7D32" },
  cable:      { icon:"🔗", label:"Cable",      bg:"#E3F2FD", color:"#1565C0" },
  machine:    { icon:"⚙️", label:"Machine",    bg:"#F3E5F5", color:"#6A1B9A" },
  bodyweight: { icon:"🤸", label:"Bodyweight", bg:"#FCE4EC", color:"#880E4F" },
  ezbar:      { icon:"〰️", label:"EZ Bar",     bg:"#E0F7FA", color:"#006064" },
};

// ── EXERCISE DATA ─────────────────────────────────────────────────────────
const DAYS = [
  { label:"MON", full:"MONDAY",    type:"PUSH", color:"#FF4D4D", groups:[
    { muscle:"CHEST", color:"#FF4D4D", exercises:[
      { name:"Barbell Bench Press",    equip:"barbell",    sets:"2",reps:"4–6",  rest:"2 min",tag:"Overall Mass",         howto:["Lie flat. Grip slightly wider than shoulders.","Lower bar to mid-chest over 3 seconds.","Drive up explosively. Squeeze chest at top."] },
      { name:"Incline Dumbbell Press", equip:"dumbbell",   sets:"2",reps:"8–10", rest:"90s",  tag:"Upper Chest",          howto:["Set bench to 45°. Dumbbells at shoulder level.","Press up and slightly inward. Arms nearly touch.","Lower slowly. Feel the upper chest stretch."] },
      { name:"Low-to-High Cable Fly",  equip:"cable",      sets:"2",reps:"12–15",rest:"60s",  tag:"Upper Chest Isolation",howto:["Cables at lowest setting. Step forward.","Arc handles upward and inward, slight elbow bend.","Squeeze at top. Return slow. Never drop tension."] },
    ]},
    { muscle:"SHOULDERS", color:"#FF8C00", exercises:[
      { name:"Overhead Barbell Press", equip:"barbell",    sets:"2",reps:"5–7",  rest:"2 min",tag:"Overall Mass",          howto:["Bar on upper chest. Hands just outside shoulders.","Brace core. Press straight up overhead.","Lock out. Lower slowly back to the start."] },
      { name:"Lateral Raises",         equip:"dumbbell",   sets:"2",reps:"12–15",rest:"60s",  tag:"Width — Most Attractive",howto:["Hold at sides. Slight forward lean, soft elbows.","Raise arms out to shoulder height.","Pinky higher than thumb at top. Lower slow."] },
      { name:"Face Pulls",             equip:"cable",      sets:"2",reps:"15–20",rest:"45s",  tag:"Rear Delt + Health",    howto:["Cable at head height with rope.","Pull to face. Elbows flare high and wide.","External rotation at end. Thumbs pointing back."] },
    ]},
    { muscle:"TRICEPS", color:"#FFB800", exercises:[
      { name:"Close Grip Bench Press",  equip:"barbell",   sets:"2",reps:"6–8",  rest:"90s",  tag:"Overall Mass",          howto:["Flat bench. Shoulder-width grip.","Lower to lower chest. Elbows tight to body.","Press up. Triceps fully contract at top."] },
      { name:"Rope Pushdown",           equip:"cable",     sets:"2",reps:"12–15",rest:"60s",  tag:"Lateral Head",          howto:["High pulley with rope. Elbows pinned to sides.","Push rope down until arms are fully extended.","Spread rope apart at bottom. Squeeze hard."] },
      { name:"Overhead Cable Extension",equip:"cable",     sets:"2",reps:"12–15",rest:"60s",  tag:"Horseshoe Shape",       howto:["Face away from low cable. Hold rope overhead.","Extend arms forward and overhead. Elbows close.","Lower behind head for maximum long head stretch."] },
    ]},
    { muscle:"ABS", color:"#22C55E", exercises:[
      { name:"Cable Crunch",            equip:"cable",     sets:"2",reps:"15–20",rest:"45s",  tag:"Upper Abs",             howto:["Kneel below high pulley. Rope behind neck.","Flex waist — round lower back. Elbows to knees.","Hips do NOT move. Pause at bottom."] },
      { name:"Hanging Leg Raise",       equip:"bodyweight",sets:"2",reps:"12–15",rest:"45s",  tag:"Lower Abs",             howto:["Hang from bar. Full arm extension.","Raise legs keeping them as straight as possible.","Tuck pelvis at top. Lower slow. Zero swinging."] },
    ]},
  ]},
  { label:"TUE", full:"TUESDAY",   type:"PULL", color:"#3D8EFF", groups:[
    { muscle:"BACK", color:"#3D8EFF", exercises:[
      { name:"Deadlift",               equip:"barbell",    sets:"2",reps:"4–6",  rest:"2.5 min",tag:"Full Back Thickness",howto:["Bar over mid-foot. Grip just outside legs.","Big breath. Brace hard. Chest up.","Drive floor away — don't think 'pull up'."] },
      { name:"Weighted Pull-Ups",      equip:"bodyweight", sets:"2",reps:"6–8",  rest:"2 min",  tag:"V-Taper Lats",      howto:["Wide overhand grip. Full dead hang.","Pull chest to bar. Drive elbows down and back.","Pause at top. Lower slowly to dead hang."] },
      { name:"Bent Over Barbell Row",  equip:"barbell",    sets:"2",reps:"6–8",  rest:"90s",    tag:"Mid + Upper Back",  howto:["Hinge to 45°. Overhand grip, wider than shoulders.","Pull bar to belly button. Elbows back hard.","Squeeze everything at the top. Lower slow."] },
    ]},
    { muscle:"BICEPS", color:"#00C2FF", exercises:[
      { name:"Barbell Curl",           equip:"barbell",    sets:"2",reps:"6–8",  rest:"90s",  tag:"Overall Mass",         howto:["Stand with barbell. Elbows pinned at sides.","Curl bar up in a smooth arc. Don't lean back.","Squeeze at top. Lower over 3 full seconds."] },
      { name:"Incline Dumbbell Curl",  equip:"dumbbell",   sets:"2",reps:"8–10", rest:"75s",  tag:"Long Head Peak",       howto:["60° bench. Sit back. Arms hang straight down.","Curl up. The dead-hang stretch is the whole point.","Squeeze hard at top. Builds bicep peak."] },
      { name:"Hammer Curl",            equip:"dumbbell",   sets:"2",reps:"10–12",rest:"60s",  tag:"Brachialis Thickness", howto:["Hold dumbbells. Palms face each other all the way.","Curl up without rotating the wrist at all.","Squeeze at top. Builds brachialis for width."] },
    ]},
  ]},
  { label:"WED", full:"WEDNESDAY", type:"LEGS", color:"#FF8C00", groups:[
    { muscle:"QUADS", color:"#B44FFF", exercises:[
      { name:"Barbell Back Squat",     equip:"barbell",    sets:"2",reps:"4–6",  rest:"2.5 min",tag:"Overall Mass",      howto:["Bar on traps. Feet shoulder-width. Toes out.","Sit back and down past parallel. Chest stays up.","Drive through whole foot. Push the floor away."] },
      { name:"Hack Squat",             equip:"machine",    sets:"2",reps:"8–10", rest:"90s",    tag:"Quads + Glutes",    howto:["Platform. Feet low and narrow.","Lower until thighs parallel. Knees over toes.","Drive up through quads. Don't lock knees."] },
      { name:"Leg Extension",          equip:"machine",    sets:"2",reps:"12–15",rest:"60s",    tag:"Teardrop — Most Visible",howto:["Pad just above ankles. Back flat.","Extend legs fully. Pause 1 sec and squeeze hard.","Lower over 3 seconds. Builds the teardrop muscle."] },
    ]},
    { muscle:"HAMSTRINGS", color:"#FF2D78", exercises:[
      { name:"Romanian Deadlift",      equip:"barbell",    sets:"2",reps:"8–10", rest:"90s",  tag:"Hamstrings + Glutes", howto:["Bar in hand. Soft knees. Push hips back.","Lower bar along legs until hamstring pull.","Drive hips forward to return. Squeeze glutes."] },
      { name:"Seated Leg Curl",        equip:"machine",    sets:"2",reps:"10–12",rest:"60s",  tag:"Isolation",           howto:["Sit in machine. Pad just above ankles.","Curl pad down fully. Pause and squeeze hard.","Return over 3 full seconds. Slow negative."] },
    ]},
    { muscle:"CALVES", color:"#00C896", exercises:[
      { name:"Standing Calf Raise",    equip:"machine",    sets:"2",reps:"15–20",rest:"60s",  tag:"Gastrocnemius",       howto:["Ball of foot on edge of platform.","Lower all the way down. Hold 1 sec stretch.","Rise all the way up. Pause 1 sec. Lower slow."] },
      { name:"Seated Calf Raise",      equip:"machine",    sets:"2",reps:"15–20",rest:"60s",  tag:"Soleus — Fullness",   howto:["Sit. Pads on lower thighs. Feet on plate.","Lower heels for deep stretch. Hold 1 sec.","Rise up. Squeeze. Seated targets the soleus."] },
    ]},
    { muscle:"ABS", color:"#22C55E", exercises:[
      { name:"Ab Wheel Rollout",       equip:"bodyweight", sets:"2",reps:"10–12",rest:"60s",  tag:"Full Core",           howto:["Kneel. Hold ab wheel. Arms straight below chest.","Roll forward slowly. Back must NOT collapse.","Pull back using core only. Brace whole time."] },
      { name:"Weighted Plank",         equip:"bodyweight", sets:"2",reps:"45–60s",rest:"45s", tag:"Core Stability",      howto:["Forearm plank. Body perfectly straight.","Have someone place plate on upper back.","Squeeze glutes, abs and quads simultaneously."] },
    ]},
  ]},
  { label:"THU", full:"THURSDAY",  type:"PUSH", color:"#FF4D4D", groups:[
    { muscle:"CHEST", color:"#FF4D4D", exercises:[
      { name:"Incline Barbell Press",  equip:"barbell",    sets:"2",reps:"6–8",  rest:"90s",  tag:"Upper Chest Heavy",   howto:["Set bench to 30–45°. Grip barbell just wider than shoulders.","Lower to upper chest. Feel the upper pec stretch.","Press up and slightly back. Squeeze upper chest."] },
      { name:"Dumbbell Pullover",      equip:"dumbbell",   sets:"2",reps:"10–12",rest:"75s",  tag:"Full Stretch",        howto:["Lie across bench. Both hands on one dumbbell.","Arc weight overhead — arms nearly straight.","Pull back up. Feel entire chest open and stretch."] },
      { name:"Pec Deck Machine",       equip:"machine",    sets:"2",reps:"12–15",rest:"60s",  tag:"Middle Chest Squeeze",howto:["Sit back. Elbows on pads at chest height.","Bring pads together in a smooth controlled arc.","Squeeze center hard. Return slowly. No slamming."] },
    ]},
    { muscle:"SHOULDERS", color:"#FF8C00", exercises:[
      { name:"Arnold Press",           equip:"dumbbell",   sets:"2",reps:"8–10", rest:"90s",  tag:"All 3 Heads",         howto:["Start with dumbbells at chin, palms facing you.","Rotate palms outward as you press overhead.","Reverse rotation on the way down. Full range."] },
      { name:"Reverse Pec Deck",       equip:"machine",    sets:"2",reps:"12–15",rest:"60s",  tag:"Rear Delt",           howto:["Sit facing pad. Arms out to sides on handles.","Pull handles back in a wide arc. Elbows soft.","Squeeze rear delts hard at the back."] },
      { name:"Cable Lateral Raise",    equip:"cable",      sets:"2",reps:"12–15",rest:"60s",  tag:"Side Delt",           howto:["Low pulley to your side. Reach across to grip.","Raise arm out to shoulder height.","1 sec hold at top. Lower slow. Constant tension."] },
    ]},
    { muscle:"TRICEPS", color:"#FFB800", exercises:[
      { name:"Skull Crushers",         equip:"ezbar",      sets:"2",reps:"8–10", rest:"75s",  tag:"Long + Medial Head",  howto:["Lie on bench. EZ bar straight up overhead.","Hinge ONLY at elbows. Lower bar behind head.","Extend back up. Stretch behind head is the point."] },
      { name:"Dips (Triceps)",         equip:"bodyweight", sets:"2",reps:"8–12", rest:"90s",  tag:"All 3 Heads",         howto:["Parallel bars. Keep torso completely upright.","Lower until elbows at 90°. Elbows close to body.","Drive straight up. Squeeze at lockout."] },
      { name:"Single DB Overhead Ext.",equip:"dumbbell",   sets:"2",reps:"10–12",rest:"60s",  tag:"Long Head Stretch",   howto:["Hold one dumbbell overhead with both hands.","Lower behind head by hinging at elbows only.","Extend back up. Overhead = long head stretch."] },
    ]},
  ]},
  { label:"FRI", full:"FRIDAY",    type:"PULL", color:"#3D8EFF", groups:[
    { muscle:"BACK", color:"#3D8EFF", exercises:[
      { name:"T-Bar Row",              equip:"barbell",    sets:"2",reps:"8–10", rest:"90s",  tag:"Overall Thickness",   howto:["Straddle bar. Bend to 45°. Close grip handles.","Pull to chest. Drive elbows back as far as possible.","Squeeze all back muscles at top. Lower slow."] },
      { name:"Wide Grip Lat Pulldown", equip:"cable",      sets:"2",reps:"10–12",rest:"75s",  tag:"Lat Width",           howto:["Wide overhand grip. Lean back 15°.","Pull bar to upper chest. Drive elbows down.","Return all the way up. Let lats fully stretch."] },
      { name:"Seated Cable Row",       equip:"cable",      sets:"2",reps:"10–12",rest:"75s",  tag:"Mid Back + Rhomboids",howto:["Sit at cable row. Back straight. Soft knees.","Pull to belly button. Elbows close to body.","Squeeze shoulder blades. Return with full stretch."] },
      { name:"Chest Supported Row",    equip:"dumbbell",   sets:"2",reps:"10–12",rest:"75s",  tag:"Pure Back",           howto:["Lie face down on incline bench. Chest on pad.","Row dumbbells up. Elbows slightly flared.","Chest stays on pad the entire set. Zero cheating."] },
    ]},
    { muscle:"BICEPS", color:"#00C2FF", exercises:[
      { name:"Spider Curl",            equip:"dumbbell",   sets:"2",reps:"10–12",rest:"60s",  tag:"Short Head Peak",     howto:["Face down on incline bench. Arms hang straight.","Curl dumbbells up. Elbow stays behind your body.","Builds short head — the visible peak from front."] },
      { name:"Cable Curl",             equip:"cable",      sets:"2",reps:"12–15",rest:"45s",  tag:"Constant Tension",    howto:["Low pulley. EZ bar or straight bar.","Curl up keeping elbows pinned at sides.","1 sec squeeze at top. Constant tension unlike DBs."] },
      { name:"Preacher Curl",          equip:"ezbar",      sets:"2",reps:"8–10", rest:"75s",  tag:"Short Head Mass",     howto:["Upper arms flat on angled preacher pad.","Curl EZ bar up fully. Squeeze hard at top.","Lower VERY slowly — negative builds size fast."] },
    ]},
    { muscle:"ABS", color:"#22C55E", exercises:[
      { name:"Decline Sit-Up",         equip:"bodyweight", sets:"2",reps:"15–20",rest:"45s",  tag:"Upper Abs",           howto:["Hook feet on decline. Arms crossed or hold plate.","Sit up fully — full range, not just a crunch.","Lower slowly. Decline adds resistance vs flat."] },
      { name:"Side Plank",             equip:"bodyweight", sets:"2",reps:"30–45s ea.",rest:"45s",tag:"Obliques",         howto:["Lie on side. Prop on forearm. Stack feet.","Raise hips. Body forms straight line head to feet.","Hold. Switch sides. Don't let hips rotate or drop."] },
      { name:"Dragon Flag",            equip:"bodyweight", sets:"2",reps:"8–10", rest:"60s",  tag:"Advanced Full Abs",   howto:["Lie on bench. Grip behind head. Body rigid.","Raise legs and hips — shoulders stay on bench.","Lower entire body slowly. Don't touch lower back first."] },
    ]},
  ]},
  { label:"SAT", full:"SATURDAY",  type:"LEGS", color:"#FF8C00", groups:[
    { muscle:"QUADS", color:"#B44FFF", exercises:[
      { name:"Bulgarian Split Squat",  equip:"dumbbell",   sets:"2",reps:"10–12",rest:"90s",  tag:"Glutes + Balance",    howto:["Rear foot on bench. Front foot 2 steps forward.","Lower rear knee toward floor. Front shin vertical.","Drive through front heel. Squeeze glute at top."] },
      { name:"Leg Press",              equip:"machine",    sets:"2",reps:"10–12",rest:"90s",  tag:"Quads + Glutes",      howto:["Feet shoulder-width. Choose foot height.","Lower platform until knees at 90°. Back flat.","Drive through whole foot. Don't lock knees."] },
      { name:"Walking Lunges",         equip:"dumbbell",   sets:"2",reps:"12 each",rest:"75s",tag:"Glutes + Quads",     howto:["Hold dumbbells at sides. Tall posture.","Take a long stride. Lower rear knee near floor.","Push off front foot. Step through into next lunge."] },
    ]},
    { muscle:"HAMSTRINGS", color:"#FF2D78", exercises:[
      { name:"Lying Leg Curl",         equip:"machine",    sets:"2",reps:"10–12",rest:"60s",  tag:"Isolation",           howto:["Lie face down. Pad just above ankles. Hips flat.","Curl heels toward glutes as far as they'll go.","Squeeze at the top. Lower over 3 seconds."] },
      { name:"Good Mornings",          equip:"barbell",    sets:"2",reps:"10–12",rest:"75s",  tag:"Hamstrings + Lower Back",howto:["Light bar on upper traps. Feet shoulder-width.","Push hips back. Hinge forward. Back stays straight.","Return by driving hips forward. Feel the stretch."] },
    ]},
    { muscle:"CALVES", color:"#00C896", exercises:[
      { name:"Donkey Calf Raise",      equip:"machine",    sets:"2",reps:"15–20",rest:"60s",  tag:"Full Stretch",        howto:["Bend over with pads on hips for resistance.","Lower heels as deep as possible. Hold stretch.","Rise all the way up. Deepest stretch possible."] },
      { name:"Leg Press Calf Raise",   equip:"machine",    sets:"2",reps:"15–20",rest:"60s",  tag:"Heavy Overload",      howto:["Legs extended in leg press. Ball of foot on edge.","Push using ONLY the ankle joint. Full range.","Heaviest possible load. Great for overloading."] },
    ]},
  ]},
];

const MUSCLE_KEYS = ["CHEST","SHOULDERS","TRICEPS","BACK","BICEPS","QUADS","HAMSTRINGS","CALVES","ABS"];

// ── HELPERS ───────────────────────────────────────────────────────────────
function parseRepRange(repsStr) {
  const m = repsStr.match(/(\d+)[–-](\d+)/);
  if (m) return [parseInt(m[1]), parseInt(m[2])];
  const n = repsStr.match(/(\d+)/);
  if (n) return [parseInt(n[1]), parseInt(n[1])];
  return [10, 12];
}

function suggestWeight(history, repsStr) {
  if (!history || history.length === 0) return null;
  const last = history[history.length - 1];
  const [, top] = parseRepRange(repsStr);
  if (last.reps >= top) return (parseFloat(last.weight) + 2.5).toFixed(1);
  if (last.reps < parseRepRange(repsStr)[0]) return Math.max(0, parseFloat(last.weight) - 2.5).toFixed(1);
  return parseFloat(last.weight).toFixed(1);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function fmtDate(d) {
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-GB", { day:"numeric", month:"short" });
}

// ── DB HELPERS (direct API calls) ─────────────────────────────────────────
async function dbLoad() {
  try {
    const r = await fetch("/api/load");
    if (!r.ok) throw new Error(r.status);
    const data = await r.json();
    return data.logs || {};
  } catch { return {}; }
}

async function dbSave(logs) {
  try {
    await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logs }),
    });
    return true;
  } catch { return false; }
}

async function dbClear() {
  try {
    await fetch("/api/clear", { method: "DELETE" });
    return true;
  } catch { return false; }
}

// ── SPARKLINE CHART ───────────────────────────────────────────────────────
function Sparkline({ data, color }) {
  if (!data || data.length < 2) return null;
  const vals = data.map(d => parseFloat(d.weight));
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const W = 200, H = 50, pad = 6;
  const pts = vals.map((v, i) => {
    const x = pad + (i / (vals.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  const lastPt = pts.split(" ").pop().split(",");
  return (
    <svg width={W} height={H} style={{overflow:"visible"}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {vals.map((v, i) => {
        const x = pad + (i / (vals.length - 1)) * (W - pad * 2);
        const y = H - pad - ((v - min) / range) * (H - pad * 2);
        return <circle key={i} cx={x} cy={y} r={i === vals.length-1 ? 4 : 2.5} fill={color} />;
      })}
      <text x={parseFloat(lastPt[0])+6} y={parseFloat(lastPt[1])+4} fontSize="10" fontWeight="900" fill={color}>{vals[vals.length-1]}kg</text>
    </svg>
  );
}

// ── EXERCISE CARD ─────────────────────────────────────────────────────────
function ExCard({ ex, color, cardId, logs, onLog }) {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [saved, setSaved] = useState(false);

  const history = logs[ex.name] || [];
  const lastEntry = history.length > 0 ? history[history.length - 1] : null;
  const suggested = suggestWeight(history, ex.reps);
  const doneToday = lastEntry && lastEntry.date === todayStr();
  const eq = EQ[ex.equip] || EQ.barbell;

  const handleLog = () => {
    if (!weight) return;
    const entry = { date: todayStr(), weight: parseFloat(weight), reps: parseInt(reps) || 0 };
    onLog(ex.name, entry);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setWeight("");
    setReps("");
  };

  useEffect(() => {
    if (suggested && !weight) setWeight(suggested);
  }, [suggested]);

  return (
    <div style={{
      background:"#FFFFFF",
      border:`1px solid ${open ? color+"55" : doneToday ? color+"33" : "#EAEAF2"}`,
      borderLeft:`3px solid ${doneToday ? color : open ? color : color+"33"}`,
      borderRadius:12, overflow:"hidden",
      boxShadow: open ? `0 4px 20px ${color}15` : "none",
      marginBottom:6, transition:"all 0.2s",
    }}>
      {/* Main Row */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{ padding:"13px 16px", display:"grid", gridTemplateColumns:"44px 1fr 56px 82px 56px 30px", gap:10, alignItems:"center", cursor:"pointer" }}
      >
        {/* Equipment Icon */}
        <div style={{ background:eq.bg, borderRadius:10, width:44, height:44, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontSize:20 }}>
          {eq.icon}
        </div>

        {/* Name + tags */}
        <div>
          <div style={{ fontWeight:900, fontSize:13, color:"#111", marginBottom:3 }}>{ex.name}</div>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ background:color+"16", color:color, fontSize:8, fontWeight:900, letterSpacing:1.5, padding:"2px 6px", borderRadius:4 }}>{ex.tag}</span>
            <span style={{ background:eq.bg, color:eq.color, fontSize:8, fontWeight:800, padding:"2px 6px", borderRadius:4 }}>{eq.label}</span>
            {doneToday && <span style={{ background:"#D1FAE5", color:"#059669", fontSize:8, fontWeight:900, padding:"2px 6px", borderRadius:4 }}>✓ LOGGED</span>}
          </div>
        </div>

        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:20, fontWeight:900, color:color, lineHeight:1 }}>{ex.sets}</div>
          <div style={{ fontSize:7, color:"#CCCCDD", letterSpacing:2, marginTop:2, fontWeight:900 }}>SETS</div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:12, fontWeight:800, color:"#555" }}>{ex.reps}</div>
          <div style={{ fontSize:7, color:"#CCCCDD", letterSpacing:2, marginTop:2, fontWeight:900 }}>REPS</div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#AAA" }}>{ex.rest}</div>
          <div style={{ fontSize:7, color:"#CCCCDD", letterSpacing:2, marginTop:2, fontWeight:900 }}>REST</div>
        </div>

        <div style={{ fontSize:11, color: open ? color : "#CCCCDD", transition:"transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", textAlign:"center", fontWeight:900 }}>▼</div>
      </div>

      {/* Expanded Panel */}
      {open && (
        <div style={{ borderTop:`1px solid ${color}18` }}>

          {/* HOW TO */}
          <div style={{ padding:"14px 16px", background:`${color}05` }}>
            <div style={{ fontSize:9, fontWeight:900, letterSpacing:3, color:color, marginBottom:10 }}>HOW TO DO IT</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {ex.howto.map((step, i) => (
                <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <div style={{ minWidth:22, height:22, borderRadius:"50%", background:color, color:"#fff", fontSize:10, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>{i+1}</div>
                  <div style={{ fontSize:12, color:"#444", lineHeight:1.6 }}>{step}</div>
                </div>
              ))}
            </div>
          </div>

          {/* LOG SECTION */}
          <div style={{ padding:"14px 16px", background:"#FAFAFA", borderTop:`1px solid ${color}18` }}>
            <div style={{ fontSize:9, fontWeight:900, letterSpacing:3, color:color, marginBottom:12 }}>LOG THIS SET</div>

            {/* Last session info */}
            {lastEntry && (
              <div style={{ display:"flex", gap:16, marginBottom:12, flexWrap:"wrap" }}>
                <div style={{ background:"#F0F0F8", borderRadius:8, padding:"8px 12px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:"#888", fontWeight:700 }}>LAST SESSION</div>
                  <div style={{ fontSize:16, fontWeight:900, color:"#333" }}>{lastEntry.weight}kg</div>
                  <div style={{ fontSize:10, color:"#AAA" }}>{lastEntry.reps} reps · {fmtDate(lastEntry.date)}</div>
                </div>
                {suggested && (
                  <div style={{ background:color+"12", border:`1px solid ${color}33`, borderRadius:8, padding:"8px 12px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:color, fontWeight:700 }}>SUGGESTED TODAY</div>
                    <div style={{ fontSize:16, fontWeight:900, color:color }}>{suggested}kg</div>
                    <div style={{ fontSize:10, color:color+"99" }}>
                      {parseFloat(suggested) > parseFloat(lastEntry.weight) ? "▲ +2.5kg (you hit top of range!)" :
                       parseFloat(suggested) < parseFloat(lastEntry.weight) ? "▼ −2.5kg (missed range)" : "= Same weight"}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Input row */}
            <div style={{ display:"flex", gap:8, alignItems:"flex-end", flexWrap:"wrap" }}>
              <div>
                <div style={{ fontSize:9, color:"#AAA", fontWeight:800, letterSpacing:1, marginBottom:4 }}>WEIGHT (KG)</div>
                <input
                  type="number" placeholder="e.g. 80"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  onClick={e => e.stopPropagation()}
                  style={{ width:90, padding:"10px 12px", border:`2px solid ${color}44`, borderRadius:8, fontSize:14, fontWeight:800, color:"#111", outline:"none", background:"#fff" }}
                />
              </div>
              <div>
                <div style={{ fontSize:9, color:"#AAA", fontWeight:800, letterSpacing:1, marginBottom:4 }}>REPS DONE</div>
                <input
                  type="number" placeholder="e.g. 6"
                  value={reps}
                  onChange={e => setReps(e.target.value)}
                  onClick={e => e.stopPropagation()}
                  style={{ width:80, padding:"10px 12px", border:`2px solid ${color}44`, borderRadius:8, fontSize:14, fontWeight:800, color:"#111", outline:"none", background:"#fff" }}
                />
              </div>
              <button
                onClick={e => { e.stopPropagation(); handleLog(); }}
                style={{ padding:"10px 20px", background: saved ? "#10B981" : color, color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:900, cursor:"pointer", letterSpacing:1, transition:"background 0.3s" }}
              >{saved ? "✓ SAVED!" : "LOG SET"}</button>
            </div>

            {/* Mini history */}
            {history.length > 0 && (
              <div style={{ marginTop:14 }}>
                <div style={{ fontSize:9, color:"#AAA", fontWeight:800, letterSpacing:2, marginBottom:8 }}>RECENT HISTORY</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {history.slice(-5).reverse().map((h, i) => (
                    <div key={i} style={{ background: i===0 ? color+"16" : "#F0F0F8", border:`1px solid ${i===0 ? color+"44" : "#E8E8F0"}`, borderRadius:8, padding:"6px 10px", textAlign:"center" }}>
                      <div style={{ fontSize:13, fontWeight:900, color: i===0 ? color : "#555" }}>{h.weight}kg</div>
                      <div style={{ fontSize:9, color:"#AAA" }}>{h.reps}r · {fmtDate(h.date)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── HISTORY TAB ───────────────────────────────────────────────────────────
// Build a lookup: exercise name → { dayLabel, dayFull, dayType, dayColor, muscleColor }
const EX_DAY_MAP = {};
for (const day of DAYS) {
  for (const g of day.groups) {
    for (const ex of g.exercises) {
      if (!EX_DAY_MAP[ex.name]) {
        EX_DAY_MAP[ex.name] = { dayLabel: day.label, dayFull: day.full, dayType: day.type, dayColor: day.color, muscleColor: g.color, muscle: g.muscle };
      }
    }
  }
}

function HistoryTab({ logs, onClear, onExport }) {
  const [selected, setSelected] = useState(null);

  const allExercises = Object.keys(logs).filter(k => logs[k].length > 0);

  if (allExercises.length === 0) {
    return (
      <div style={{ textAlign:"center", padding:"60px 20px", color:"#CCC" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>📊</div>
        <div style={{ fontSize:16, fontWeight:900, color:"#BBB", marginBottom:8 }}>No logs yet</div>
        <div style={{ fontSize:13, color:"#CCC" }}>Start logging your sets — your progress will appear here</div>
      </div>
    );
  }

  // Group exercises by day
  const byDay = {};
  for (const name of allExercises) {
    const info = EX_DAY_MAP[name] || { dayLabel: "?", dayFull: "OTHER", dayType: "?", dayColor: "#888", muscleColor: "#888", muscle: "?" };
    const key = info.dayLabel;
    if (!byDay[key]) byDay[key] = { ...info, exercises: [] };
    byDay[key].exercises.push(name);
  }

  // Order days: MON, TUE, WED, THU, FRI, SAT
  const dayOrder = ["MON","TUE","WED","THU","FRI","SAT"];
  const sortedDays = dayOrder.filter(d => byDay[d]).map(d => ({ key: d, ...byDay[d] }));
  // Add any that don't match known days
  for (const k of Object.keys(byDay)) {
    if (!dayOrder.includes(k)) sortedDays.push({ key: k, ...byDay[k] });
  }

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:8 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:900, color:"#111" }}>My Progress</div>
          <div style={{ fontSize:12, color:"#AAA" }}>{allExercises.length} exercises tracked</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={onExport} style={{ background:"#EEF2FF", color:"#6366F1", border:"1px solid #C7D2FE", borderRadius:8, padding:"7px 14px", fontSize:11, fontWeight:800, cursor:"pointer", letterSpacing:1 }}>📥 EXPORT JSON</button>
          <button onClick={onClear} style={{ background:"#FEE2E2", color:"#EF4444", border:"1px solid #FCA5A5", borderRadius:8, padding:"7px 14px", fontSize:11, fontWeight:800, cursor:"pointer", letterSpacing:1 }}>CLEAR ALL</button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
        {[
          { label:"Total Sessions", value: Object.values(logs).reduce((s,v) => s + v.length, 0) },
          { label:"Exercises Tracked", value: allExercises.length },
          { label:"Last Workout", value: (() => { const all = Object.values(logs).flat(); if(!all.length) return "—"; const d = all.sort((a,b)=>b.date.localeCompare(a.date))[0].date; return fmtDate(d); })() },
          { label:"Most Logged", value: allExercises.sort((a,b)=>(logs[b]?.length||0)-(logs[a]?.length||0))[0]?.split(" ").slice(0,2).join(" ") || "—" },
        ].map((s,i) => (
          <div key={i} style={{ background:"#FFFFFF", border:"1px solid #EAEAF2", borderRadius:12, padding:"14px 16px" }}>
            <div style={{ fontSize:9, color:"#BBBBCC", fontWeight:900, letterSpacing:2, marginBottom:4 }}>{s.label.toUpperCase()}</div>
            <div style={{ fontSize:18, fontWeight:900, color:"#111" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Exercises grouped by day */}
      {sortedDays.map(dayGroup => (
        <div key={dayGroup.key} style={{ marginBottom:20 }}>
          {/* Day header */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div style={{ width:3, height:24, background:dayGroup.dayColor, borderRadius:2 }} />
            <span style={{ background:dayGroup.dayColor, color:"#fff", fontSize:9, fontWeight:900, letterSpacing:2, padding:"3px 8px", borderRadius:4 }}>{dayGroup.dayType}</span>
            <span style={{ fontSize:14, fontWeight:900, color:"#111", letterSpacing:0.5 }}>{dayGroup.dayFull}</span>
            <span style={{ fontSize:10, color:"#BBBBCC", fontWeight:700 }}>{dayGroup.key}</span>
            <div style={{ flex:1, height:1, background:"#E8E8F0" }} />
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {dayGroup.exercises.map(name => {
              const hist = logs[name];
              const info = EX_DAY_MAP[name] || {};
              const col = info.muscleColor || "#888";
              const last = hist[hist.length-1];
              const first = hist[0];
              const gain = (parseFloat(last.weight) - parseFloat(first.weight)).toFixed(1);
              const isOpen = selected === name;
              return (
                <div key={name} style={{ background:"#FFFFFF", border:`1px solid ${isOpen ? col+"55" : "#EAEAF2"}`, borderLeft:`3px solid ${isOpen ? col : col+"33"}`, borderRadius:12, overflow:"hidden", cursor:"pointer", transition:"all 0.2s" }} onClick={() => setSelected(isOpen ? null : name)}>
                  <div style={{ padding:"13px 16px", display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                        <span style={{ fontWeight:900, fontSize:13, color:"#111" }}>{name}</span>
                        <span style={{ background:col+"16", color:col, fontSize:7, fontWeight:900, letterSpacing:1, padding:"1px 5px", borderRadius:3 }}>{info.muscle}</span>
                      </div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        <span style={{ fontSize:10, color:"#888" }}>{hist.length} sessions</span>
                        <span style={{ fontSize:10, color:"#888" }}>Last: {last.weight}kg × {last.reps}r</span>
                        {hist.length > 1 && parseFloat(gain) > 0 && <span style={{ fontSize:10, color:"#10B981", fontWeight:800 }}>▲ +{gain}kg total</span>}
                      </div>
                    </div>
                    {hist.length >= 2 && <Sparkline data={hist.slice(-8)} color={col} />}
                    <div style={{ fontSize:11, color: isOpen ? col : "#CCCCDD", transform: isOpen ? "rotate(180deg)" : "none", transition:"transform 0.2s", fontWeight:900 }}>▼</div>
                  </div>
                  {isOpen && (
                    <div style={{ borderTop:`1px solid ${col}18`, padding:"14px 16px", background:`${col}05` }}>
                      <div style={{ fontSize:9, fontWeight:900, letterSpacing:3, color:col, marginBottom:10 }}>FULL HISTORY</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                        {hist.slice().reverse().map((h, i) => (
                          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderBottom:"1px solid #F0F0F8" }}>
                            <div style={{ width:72, fontSize:11, color:"#AAA", fontWeight:700 }}>{fmtDate(h.date)}</div>
                            <div style={{ fontSize:15, fontWeight:900, color:col }}>{h.weight}kg</div>
                            <div style={{ fontSize:12, color:"#888" }}>× {h.reps} reps</div>
                            {i === 0 && <span style={{ background:col+"16", color:col, fontSize:8, fontWeight:900, letterSpacing:1, padding:"2px 6px", borderRadius:4 }}>LATEST</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────
export default function WorkoutApp() {
  const [view,       setView]       = useState("day");
  const [dayIdx,     setDayIdx]     = useState(0);
  const [musKey,     setMusKey]     = useState("CHEST");
  const [logs,       setLogs]       = useState({});
  const [loading,    setLoading]    = useState(true);
  const [syncStatus, setSyncStatus] = useState("idle");

  const logsRef = useRef(logs);
  logsRef.current = logs;

  const day = DAYS[dayIdx];

  // ── Load from DB on mount ───────────────────────────────────────────────
  useEffect(() => {
    setSyncStatus("syncing");
    dbLoad().then(l => {
      setLogs(l);
      setSyncStatus("synced");
      setLoading(false);
    }).catch(() => {
      setSyncStatus("error");
      setLoading(false);
    });
  }, []);

  // ── Periodic sync: every 60 min + midnight + beforeunload ───────────────
  useEffect(() => {
    // Hourly background save
    const hourly = setInterval(() => {
      setSyncStatus("syncing");
      dbSave(logsRef.current).then(ok => setSyncStatus(ok ? "synced" : "error"));
    }, 60 * 60 * 1000);

    // Midnight sync
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msToMidnight = midnight - now;
    const midnightTimer = setTimeout(() => {
      dbSave(logsRef.current);
    }, msToMidnight);

    // Before page close — use sendBeacon for reliability
    const onUnload = () => {
      const blob = new Blob([JSON.stringify({ logs: logsRef.current })], { type: "application/json" });
      navigator.sendBeacon("/api/sync", blob);
    };
    window.addEventListener("beforeunload", onUnload);

    return () => {
      clearInterval(hourly);
      clearTimeout(midnightTimer);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, []);

  // ── Log handler: optimistic UI + DB save ─────────────────────────────────
  const saveTimer = useRef(null);

  const handleLog = useCallback((exName, entry) => {
    setLogs(prev => {
      const updated = { ...prev, [exName]: [...(prev[exName] || []), entry] };

      // Debounced DB save (300ms) — avoids hammering DB on rapid logs
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        setSyncStatus("syncing");
        dbSave(updated).then(ok => setSyncStatus(ok ? "synced" : "error"));
      }, 300);

      return updated;
    });
  }, []);

  const handleClear = async () => {
    if (window.confirm("Clear ALL workout logs? This cannot be undone.")) {
      setLogs({});
      setSyncStatus("syncing");
      const ok = await dbClear();
      setSyncStatus(ok ? "synced" : "error");
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workout-logs-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#F2F2F7", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:12 }}>⏳</div>
        <div style={{ fontSize:14, color:"#AAA", fontWeight:700 }}>Loading your logs…</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#F2F2F7", color:"#111", fontFamily:"'Segoe UI',sans-serif" }}>

      {/* ── HEADER ── */}
      <div style={{ background:"#FFFFFF", borderBottom:"1px solid #E0E0EA", padding:"0 18px" }}>
        <div style={{ maxWidth:960, margin:"0 auto" }}>

          {/* SYNC STATUS BAR */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:10, paddingBottom:4 }}>
            <div style={{ fontSize:14, fontWeight:900, color:"#111", letterSpacing:-0.3 }}>💪 PPL TRACKER</div>
            <SyncStatus status={syncStatus} />
          </div>

          {/* DAY TABS */}
          <div style={{ display:"flex", alignItems:"flex-end", gap:0, paddingTop:8, borderBottom:"1px solid #E0E0EA", overflowX:"auto" }}>
            <div style={{ fontSize:9, color:"#BBBBCC", fontWeight:900, letterSpacing:3, paddingBottom:12, paddingRight:14, whiteSpace:"nowrap" }}>BY DAY</div>
            {DAYS.map((d, i) => {
              const on = view==="day" && dayIdx===i;
              return (
                <button key={i} onClick={() => { setView("day"); setDayIdx(i); }} style={{
                  background: on ? d.color : "transparent", color: on ? "#fff" : "#AAAABC",
                  border: on ? "none" : "1px solid #E0E0EA", borderBottom: on ? "none" : "1px solid #E0E0EA",
                  padding:"9px 20px 11px", borderRadius:"8px 8px 0 0",
                  cursor:"pointer", fontWeight:900, fontSize:12, letterSpacing:2, transition:"all 0.2s", whiteSpace:"nowrap",
                  marginBottom: on ? "-1px" : 0,
                }}>
                  {d.label}
                </button>
              );
            })}
            {/* MY LOG tab */}
            <button onClick={() => setView("log")} style={{
              background: view==="log" ? "#6366F1" : "transparent", color: view==="log" ? "#fff" : "#AAAABC",
              border: view==="log" ? "none" : "1px solid #E0E0EA", borderBottom: view==="log" ? "none" : "1px solid #E0E0EA",
              padding:"9px 20px 11px", borderRadius:"8px 8px 0 0",
              cursor:"pointer", fontWeight:900, fontSize:12, letterSpacing:2, transition:"all 0.2s", whiteSpace:"nowrap",
              marginBottom: view==="log" ? "-1px" : 0, marginLeft:6,
            }}>📊 MY LOG</button>
            <div style={{ marginLeft:"auto", fontSize:9, color:"#DDDDEE", fontWeight:900, letterSpacing:2, paddingBottom:12, whiteSpace:"nowrap" }}>SUN · REST</div>
          </div>

          {/* MUSCLE TABS (hidden on log view) */}
          {view !== "log" && (
            <div style={{ display:"flex", alignItems:"flex-end", gap:0, paddingTop:10, borderBottom:"1px solid #E0E0EA", overflowX:"auto" }}>
              <div style={{ fontSize:9, color:"#BBBBCC", fontWeight:900, letterSpacing:3, paddingBottom:10, paddingRight:14, whiteSpace:"nowrap" }}>BY MUSCLE</div>
              {MUSCLE_KEYS.map(m => {
                const on = view==="muscle" && musKey===m;
                // find color
                let col = "#888";
                for (const day of DAYS) for (const g of day.groups) if (g.muscle === m) { col = g.color; break; }
                return (
                  <button key={m} onClick={() => { setView("muscle"); setMusKey(m); }} style={{
                    background: on ? col+"18" : "transparent", color: on ? col : "#AAAABC",
                    border: `1px solid ${on ? col+"66" : "#E0E0EA"}`, borderBottom: on ? `1px solid #F2F2F7` : `1px solid #E0E0EA`,
                    padding:"7px 14px 9px", borderRadius:"8px 8px 0 0",
                    cursor:"pointer", fontWeight:900, fontSize:10, letterSpacing:2, transition:"all 0.2s", whiteSpace:"nowrap", marginRight:3,
                    marginBottom: on ? "-1px" : 0,
                  }}>{m}</button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth:960, margin:"0 auto", padding:"24px 18px 52px" }}>

        {/* DAY VIEW */}
        {view === "day" && (
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <span style={{ background:day.color, color:"#fff", fontSize:9, fontWeight:900, letterSpacing:3, padding:"3px 10px", borderRadius:4 }}>{day.type}</span>
              <span style={{ fontSize:22, fontWeight:900, color:"#111", letterSpacing:-0.5 }}>{day.full}</span>
              <span style={{ color:"#BBBBCC", fontSize:11, fontWeight:700 }}>· TAP CARD TO LOG</span>
            </div>

            {day.groups.map((g, gi) => (
              <div key={gi} style={{ marginBottom:22 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <div style={{ width:3, height:20, background:g.color, borderRadius:2 }} />
                  <span style={{ fontSize:10, fontWeight:900, letterSpacing:3, color:g.color }}>{g.muscle}</span>
                  <div style={{ flex:1, height:1, background:"#E8E8F0" }} />
                </div>
                {g.exercises.map((ex, ei) => (
                  <ExCard key={ei} ex={ex} color={g.color} cardId={`${gi}-${ei}`} logs={logs} onLog={handleLog} />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* MUSCLE VIEW */}
        {view === "muscle" && (() => {
          let col = "#888";
          let exercises = [];
          for (const d of DAYS) for (const g of d.groups) if (g.muscle === musKey) { col = g.color; exercises = [...exercises, ...g.exercises]; break; }
          const unique = exercises.filter((e, i, a) => a.findIndex(x => x.name === e.name) === i);
          return (
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <div style={{ width:4, height:36, background:col, borderRadius:2 }} />
                <div>
                  <div style={{ fontSize:9, color:"#BBBBCC", fontWeight:900, letterSpacing:3 }}>EXERCISE LIBRARY</div>
                  <div style={{ fontSize:22, fontWeight:900, color:"#111", letterSpacing:-0.5 }}>{musKey} <span style={{ color:col, fontSize:12, fontWeight:700 }}>— TAP TO LOG</span></div>
                </div>
              </div>
              {unique.map((ex, i) => (
                <ExCard key={i} ex={ex} color={col} cardId={`lib-${i}`} logs={logs} onLog={handleLog} />
              ))}
            </div>
          );
        })()}

        {/* LOG VIEW */}
        {view === "log" && <HistoryTab logs={logs} onClear={handleClear} onExport={handleExport} />}

        {/* Footer */}
        {view !== "log" && (
          <div style={{ marginTop:28, background:"#FFFFFF", border:"1px solid #E8E8F0", borderRadius:12, padding:"14px 20px", display:"flex", gap:20, flexWrap:"wrap", justifyContent:"center" }}>
            {[
              { i:"💀", t:"2 Hard Sets — both close to failure" },
              { i:"📈", t:"Add weight or reps every single week" },
              { i:"🔥", t:"5–10 min warm-up before every session" },
              { i:"😴", t:"Sleep 8 hrs — growth happens at rest" },
            ].map((r, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ fontSize:14 }}>{r.i}</span>
                <span style={{ fontSize:11, color:"#888", fontWeight:700 }}>{r.t}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
