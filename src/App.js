import { useState } from "react";

// ── SCHEDULE ──────────────────────────────────────────────
const DAYS = [
  {
    label:"MON", full:"MONDAY", type:"PUSH", color:"#FF4D4D",
    groups:[
      { muscle:"CHEST", color:"#FF4D4D", exercises:[
        {name:"Barbell Bench Press",    sets:"2",reps:"4–6",  rest:"2 min",tag:"Overall Mass",        note:"Heavy. 3 sec descent. Drive up explosively."},
        {name:"Incline Dumbbell Press", sets:"2",reps:"8–10", rest:"90s",  tag:"Upper Chest",         note:"45° incline. Squeeze hard at the top."},
        {name:"Low-to-High Cable Fly",  sets:"2",reps:"12–15",rest:"60s",  tag:"Upper Chest Isolation",note:"Constant tension. Most visible from front."},
      ]},
      { muscle:"SHOULDERS", color:"#FF8C00", exercises:[
        {name:"Overhead Barbell Press", sets:"2",reps:"5–7",  rest:"2 min",tag:"Overall Mass",        note:"Standing. Strict. No leg drive."},
        {name:"Lateral Raises",         sets:"2",reps:"12–15",rest:"60s",  tag:"Width — Most Attractive",note:"Pinky up at top. Feel the burn."},
        {name:"Face Pulls",             sets:"2",reps:"15–20",rest:"45s",  tag:"Rear Delt + Health",  note:"High pulley. Essential for shoulder health."},
      ]},
      { muscle:"TRICEPS", color:"#FFB800", exercises:[
        {name:"Close Grip Bench Press", sets:"2",reps:"6–8",  rest:"90s",  tag:"Overall Mass",        note:"Elbows tucked. Heaviest tricep compound."},
        {name:"Rope Pushdown",          sets:"2",reps:"12–15",rest:"60s",  tag:"Lateral Head",        note:"Spread the rope at the bottom. Full extension."},
        {name:"Overhead Cable Extension",sets:"2",reps:"12–15",rest:"60s", tag:"Horseshoe Shape",     note:"Long head = the horseshoe visible from behind."},
      ]},
      { muscle:"ABS", color:"#22C55E", exercises:[
        {name:"Cable Crunch",           sets:"2",reps:"15–20",rest:"45s",  tag:"Upper Abs",           note:"Crunch the abs, not the hip flexors."},
        {name:"Hanging Leg Raise",      sets:"2",reps:"12–15",rest:"45s",  tag:"Lower Abs",           note:"Slow and controlled. No swinging."},
      ]},
    ]
  },
  {
    label:"TUE", full:"TUESDAY", type:"PULL", color:"#3D8EFF",
    groups:[
      { muscle:"BACK", color:"#3D8EFF", exercises:[
        {name:"Deadlift",               sets:"2",reps:"4–6",  rest:"2.5 min",tag:"Full Back Thickness",note:"Brace hard. Drive the floor away."},
        {name:"Weighted Pull-Ups",      sets:"2",reps:"6–8",  rest:"2 min",  tag:"V-Taper Lats",      note:"Full hang at bottom. Chest to bar."},
        {name:"Bent Over Barbell Row",  sets:"2",reps:"6–8",  rest:"90s",    tag:"Mid + Upper Back",  note:"45° torso. Pull to belly button."},
      ]},
      { muscle:"BICEPS", color:"#00C2FF", exercises:[
        {name:"Barbell Curl",           sets:"2",reps:"6–8",  rest:"90s",  tag:"Overall Mass",        note:"Elbows pinned. No swinging."},
        {name:"Incline Dumbbell Curl",  sets:"2",reps:"8–10", rest:"75s",  tag:"Long Head Peak",      note:"Full stretch at bottom. Peak squeeze."},
        {name:"Hammer Curl",            sets:"2",reps:"10–12",rest:"60s",  tag:"Brachialis Thickness",note:"Neutral grip. Adds arm thickness."},
      ]},
    ]
  },
  {
    label:"WED", full:"WEDNESDAY", type:"LEGS", color:"#FF8C00",
    groups:[
      { muscle:"QUADS", color:"#B44FFF", exercises:[
        {name:"Barbell Back Squat",     sets:"2",reps:"4–6",  rest:"2.5 min",tag:"Overall Mass",       note:"Break parallel. Chest up. Knees track toes."},
        {name:"Hack Squat",             sets:"2",reps:"8–10", rest:"90s",    tag:"Quads + Glutes",     note:"Feet low and narrow for quad focus."},
        {name:"Leg Extension",          sets:"2",reps:"12–15",rest:"60s",    tag:"Teardrop — Most Visible",note:"Pause at top. Most visible in shorts."},
      ]},
      { muscle:"HAMSTRINGS", color:"#FF2D78", exercises:[
        {name:"Romanian Deadlift",      sets:"2",reps:"8–10", rest:"90s",  tag:"Hamstrings + Glutes", note:"Feel the stretch. Hinge don't squat."},
        {name:"Seated Leg Curl",        sets:"2",reps:"10–12",rest:"60s",  tag:"Isolation",           note:"Pause at peak. Slow 3 sec eccentric."},
      ]},
      { muscle:"CALVES", color:"#00C896", exercises:[
        {name:"Standing Calf Raise",    sets:"2",reps:"15–20",rest:"60s",  tag:"Gastrocnemius",       note:"Full stretch at bottom. Pause at top."},
        {name:"Seated Calf Raise",      sets:"2",reps:"15–20",rest:"60s",  tag:"Soleus — Fullness",   note:"Gives calves that thick full look."},
      ]},
      { muscle:"ABS", color:"#22C55E", exercises:[
        {name:"Ab Wheel Rollout",       sets:"2",reps:"10–12",rest:"60s",  tag:"Full Core",           note:"Brace hard. Don't let lower back collapse."},
        {name:"Weighted Plank",         sets:"2",reps:"45–60s",rest:"45s", tag:"Core Stability",      note:"Plate on back. Squeeze everything."},
      ]},
    ]
  },
  {
    label:"THU", full:"THURSDAY", type:"PUSH", color:"#FF4D4D",
    groups:[
      { muscle:"CHEST", color:"#FF4D4D", exercises:[
        {name:"Incline Barbell Press",  sets:"2",reps:"6–8",  rest:"90s",  tag:"Upper Chest Heavy",   note:"Slightly lighter than Monday. Upper focus."},
        {name:"Dumbbell Pullover",      sets:"2",reps:"10–12",rest:"75s",  tag:"Full Stretch",        note:"Hits upper, middle, lower + serratus."},
        {name:"Pec Deck Machine",       sets:"2",reps:"12–15",rest:"60s",  tag:"Middle Chest Squeeze",note:"Slow. All feel. Full squeeze at peak."},
      ]},
      { muscle:"SHOULDERS", color:"#FF8C00", exercises:[
        {name:"Arnold Press",           sets:"2",reps:"8–10", rest:"90s",  tag:"All 3 Heads",         note:"Rotate fully. Hits all 3 deltoid heads."},
        {name:"Reverse Pec Deck",       sets:"2",reps:"12–15",rest:"60s",  tag:"Rear Delt",           note:"Squeeze the rear delts. No momentum."},
        {name:"Cable Lateral Raise",    sets:"2",reps:"12–15",rest:"60s",  tag:"Side Delt",           note:"Constant tension. Better peak contraction."},
      ]},
      { muscle:"TRICEPS", color:"#FFB800", exercises:[
        {name:"Skull Crushers",         sets:"2",reps:"8–10", rest:"75s",  tag:"Long + Medial Head",  note:"EZ bar. Lower slowly behind head for full stretch."},
        {name:"Dips (Triceps)",         sets:"2",reps:"8–12", rest:"90s",  tag:"All 3 Heads",         note:"Upright torso. Elbows close. Drive up."},
        {name:"Single DB Overhead Ext.",sets:"2",reps:"10–12",rest:"60s",  tag:"Long Head Stretch",   note:"Both hands on one dumbbell. Full stretch."},
      ]},
    ]
  },
  {
    label:"FRI", full:"FRIDAY", type:"PULL", color:"#3D8EFF",
    groups:[
      { muscle:"BACK", color:"#3D8EFF", exercises:[
        {name:"T-Bar Row",              sets:"2",reps:"8–10", rest:"90s",  tag:"Overall Thickness",   note:"Best for back thickness across all regions."},
        {name:"Wide Grip Lat Pulldown", sets:"2",reps:"10–12",rest:"75s",  tag:"Lat Width",           note:"Pull to upper chest. Full lat stretch at top."},
        {name:"Seated Cable Row",       sets:"2",reps:"10–12",rest:"75s",  tag:"Mid Back + Rhomboids",note:"Elbows tight. Squeeze mid back hard."},
        {name:"Chest Supported Row",    sets:"2",reps:"10–12",rest:"75s",  tag:"Pure Back",           note:"No cheating. Chest on pad. All back."},
      ]},
      { muscle:"BICEPS", color:"#00C2FF", exercises:[
        {name:"Spider Curl",            sets:"2",reps:"10–12",rest:"60s",  tag:"Short Head Peak",     note:"Chest on incline bench. Elbow behind body."},
        {name:"Cable Curl",             sets:"2",reps:"12–15",rest:"45s",  tag:"Constant Tension",    note:"Squeeze 1 sec at top. Never loses tension."},
        {name:"Preacher Curl",          sets:"2",reps:"8–10", rest:"75s",  tag:"Short Head Mass",     note:"EZ bar. No momentum possible."},
      ]},
      { muscle:"ABS", color:"#22C55E", exercises:[
        {name:"Decline Sit-Up",         sets:"2",reps:"15–20",rest:"45s",  tag:"Upper Abs",           note:"Add a plate for extra resistance."},
        {name:"Side Plank",             sets:"2",reps:"30–45s ea.",rest:"45s",tag:"Obliques",          note:"Don't let your hip drop."},
        {name:"Dragon Flag",            sets:"2",reps:"8–10", rest:"60s",  tag:"Advanced Full Abs",   note:"Bruce Lee's favourite. Control the descent."},
      ]},
    ]
  },
  {
    label:"SAT", full:"SATURDAY", type:"LEGS", color:"#FF8C00",
    groups:[
      { muscle:"QUADS", color:"#B44FFF", exercises:[
        {name:"Bulgarian Split Squat",  sets:"2",reps:"10–12",rest:"90s",  tag:"Glutes + Balance",    note:"Most humbling exercise. Best glute-quad tie-in."},
        {name:"Leg Press",              sets:"2",reps:"10–12",rest:"90s",  tag:"Quads + Glutes",      note:"High foot for glutes. Low foot for quads."},
        {name:"Walking Lunges",         sets:"2",reps:"12 each",rest:"75s",tag:"Glutes + Quads",      note:"Add dumbbells. Long stride. Knee near floor."},
      ]},
      { muscle:"HAMSTRINGS", color:"#FF2D78", exercises:[
        {name:"Lying Leg Curl",         sets:"2",reps:"10–12",rest:"60s",  tag:"Isolation",           note:"Full range. Don't let hips rise."},
        {name:"Good Mornings",          sets:"2",reps:"10–12",rest:"75s",  tag:"Hamstrings + Lower Back",note:"Light weight. Hip hinge with bar on back."},
      ]},
      { muscle:"CALVES", color:"#00C896", exercises:[
        {name:"Donkey Calf Raise",      sets:"2",reps:"15–20",rest:"60s",  tag:"Full Stretch",        note:"Best calf stretch possible. Deep at bottom."},
        {name:"Leg Press Calf Raise",   sets:"2",reps:"15–20",rest:"60s",  tag:"Heavy Overload",      note:"Safest way to load calves really heavy."},
      ]},
    ]
  },
];

// ── FULL EXERCISE LIBRARY ─────────────────────────────────
const LIBRARY = {
  CHEST:{color:"#FF4D4D",exercises:[
    {name:"Barbell Bench Press",     tag:"Overall Mass",         note:"Heavy. 3 sec descent. Drive up explosively."},
    {name:"Incline Dumbbell Press",  tag:"Upper Chest",          note:"45° incline. Squeeze hard at the top."},
    {name:"Decline Barbell Press",   tag:"Lower Chest",          note:"Feel the lower pec stretch and contract."},
    {name:"Dumbbell Pullover",       tag:"Full Stretch",         note:"Hits upper, middle, lower + serratus. Full arc."},
    {name:"Low-to-High Cable Fly",   tag:"Upper Chest Isolation",note:"Constant tension on upper pec. Most visible from front."},
    {name:"Pec Deck Machine",        tag:"Middle Chest Squeeze", note:"Slow and deliberate. Full squeeze at peak."},
    {name:"Dips (Chest)",            tag:"Lower + Overall Mass", note:"Lean forward. Let the chest stretch deep."},
    {name:"Incline Barbell Press",   tag:"Upper Chest Heavy",    note:"Barbell version of incline. Great for overload."},
  ]},
  SHOULDERS:{color:"#FF8C00",exercises:[
    {name:"Overhead Barbell Press",  tag:"Overall Mass",           note:"Standing. Strict. No leg drive. Core braced."},
    {name:"Arnold Press",            tag:"All 3 Heads",            note:"Rotate fully. Hits front, side and rear delt."},
    {name:"Lateral Raises",          tag:"Width — Most Attractive",note:"Pinky up at top. Slight forward lean."},
    {name:"Face Pulls",              tag:"Rear Delt + Health",     note:"High pulley. Essential for shoulder health."},
    {name:"Reverse Pec Deck",        tag:"Rear Delt",              note:"Squeeze rear delts. No momentum."},
    {name:"Cable Lateral Raise",     tag:"Side Delt",              note:"Constant tension vs dumbbells."},
    {name:"Upright Row",             tag:"Traps + Side Delt",      note:"Wide grip. Elbows flare out and up."},
  ]},
  TRICEPS:{color:"#FFB800",exercises:[
    {name:"Close Grip Bench Press",       tag:"Overall Mass",        note:"Elbows tucked. Heaviest tricep compound."},
    {name:"Skull Crushers",               tag:"Long + Medial Head",  note:"EZ bar. Lower slowly behind head."},
    {name:"Rope Pushdown",                tag:"Lateral Head",        note:"Spread the rope at the bottom."},
    {name:"Overhead Cable Extension",     tag:"Horseshoe Shape",     note:"Long head = horseshoe visible from behind."},
    {name:"Dips (Triceps)",               tag:"All 3 Heads",         note:"Upright torso. Elbows close."},
    {name:"Single DB Overhead Extension", tag:"Long Head Stretch",   note:"Both hands on one dumbbell."},
    {name:"Kickbacks",                    tag:"Lateral Head Squeeze",note:"Fully extend. Squeeze hard at top."},
  ]},
  BACK:{color:"#3D8EFF",exercises:[
    {name:"Deadlift",               tag:"Full Back Thickness", note:"Brace hard. Drive the floor away."},
    {name:"Weighted Pull-Ups",      tag:"V-Taper Lats",        note:"Full hang. Chest to bar. Wide grip."},
    {name:"Bent Over Barbell Row",  tag:"Mid + Upper Back",    note:"45° torso. Pull to belly button."},
    {name:"T-Bar Row",              tag:"Overall Thickness",   note:"Best for back thickness across all regions."},
    {name:"Wide Grip Lat Pulldown", tag:"Lat Width",           note:"Pull to upper chest. Full stretch at top."},
    {name:"Seated Cable Row",       tag:"Mid Back + Rhomboids",note:"Elbows tight. Squeeze mid back."},
    {name:"Single Arm DB Row",      tag:"Full Lat Isolation",  note:"Let the lat fully stretch at bottom."},
    {name:"Chest Supported Row",    tag:"Pure Back",           note:"No cheating. Chest on pad."},
  ]},
  BICEPS:{color:"#00C2FF",exercises:[
    {name:"Barbell Curl",          tag:"Overall Mass",         note:"Elbows pinned. No swinging."},
    {name:"Incline Dumbbell Curl", tag:"Long Head Peak",       note:"Full stretch at bottom. Peak squeeze."},
    {name:"Hammer Curl",           tag:"Brachialis Thickness", note:"Neutral grip. Adds arm thickness."},
    {name:"Spider Curl",           tag:"Short Head Peak",      note:"Chest on incline. Elbow behind body."},
    {name:"Cable Curl",            tag:"Constant Tension",     note:"Squeeze 1 sec at top."},
    {name:"Concentration Curl",    tag:"Peak Isolation",       note:"Elbow on inner thigh. Pure peak."},
    {name:"Preacher Curl",         tag:"Short Head Mass",      note:"EZ bar. No momentum possible."},
  ]},
  QUADS:{color:"#B44FFF",exercises:[
    {name:"Barbell Back Squat",    tag:"Overall Mass",              note:"Break parallel. Chest up. Knees track toes."},
    {name:"Hack Squat",            tag:"Quads + Glutes",            note:"Feet low and narrow for quad focus."},
    {name:"Leg Press",             tag:"Quads + Glutes",            note:"High foot glutes. Low foot quads."},
    {name:"Leg Extension",         tag:"Teardrop — Most Visible",   note:"Pause at top. Most visible in shorts."},
    {name:"Bulgarian Split Squat", tag:"Glutes + Balance",          note:"Best glute-quad tie-in exercise."},
    {name:"Walking Lunges",        tag:"Glutes + Quads",            note:"Add dumbbells. Long stride."},
  ]},
  HAMSTRINGS:{color:"#FF2D78",exercises:[
    {name:"Romanian Deadlift",tag:"Hamstrings + Glutes",    note:"Feel the stretch. Hinge don't squat."},
    {name:"Seated Leg Curl",   tag:"Isolation",              note:"Pause at peak. Slow 3 sec eccentric."},
    {name:"Lying Leg Curl",    tag:"Isolation",              note:"Full range. Don't let hips rise."},
    {name:"Good Mornings",     tag:"Hamstrings + Lower Back",note:"Light weight. Hip hinge with bar."},
  ]},
  CALVES:{color:"#00C896",exercises:[
    {name:"Standing Calf Raise", tag:"Gastrocnemius — Upper",  note:"Full stretch at bottom. Pause at top."},
    {name:"Seated Calf Raise",   tag:"Soleus — Lower Fullness",note:"Gives calves that full thick look."},
    {name:"Donkey Calf Raise",   tag:"Full Stretch",           note:"Best calf stretch possible."},
    {name:"Leg Press Calf Raise",tag:"Heavy Overload",         note:"Safest way to load calves heavy."},
  ]},
  ABS:{color:"#22C55E",exercises:[
    {name:"Cable Crunch",      tag:"Upper Abs — Heavy",  note:"Crunch the abs, not the hip flexors."},
    {name:"Hanging Leg Raise", tag:"Lower Abs",          note:"Slow and controlled. No swinging."},
    {name:"Ab Wheel Rollout",  tag:"Full Core",          note:"Brace hard. Don't let lower back collapse."},
    {name:"Decline Sit-Up",    tag:"Upper Abs",          note:"Add a plate for extra resistance."},
    {name:"Side Plank",        tag:"Obliques",           note:"Don't let your hip drop."},
    {name:"Weighted Plank",    tag:"Full Core Stability",note:"Plate on back. Squeeze everything."},
    {name:"Dragon Flag",       tag:"Advanced Full Abs",  note:"Bruce Lee's favourite. Control the descent."},
  ]},
};

const MUSCLE_KEYS = ["CHEST","SHOULDERS","TRICEPS","BACK","BICEPS","QUADS","HAMSTRINGS","CALVES","ABS"];

export default function App() {
  const [view,    setView]    = useState("day");   // "day" | "muscle"
  const [dayIdx,  setDayIdx]  = useState(0);
  const [musKey,  setMusKey]  = useState("CHEST");

  const day = DAYS[dayIdx];

  return (
    <div style={{minHeight:"100vh",background:"#F2F2F7",color:"#111",fontFamily:"'Segoe UI',sans-serif"}}>

      {/* ══════════ HEADER ══════════ */}
      <div style={{background:"#FFFFFF",borderBottom:"1px solid #E0E0EA",padding:"0 18px"}}>
        <div style={{maxWidth:960,margin:"0 auto"}}>

          {/* ── ROW 1: DAY TABS ── */}
          <div style={{display:"flex",alignItems:"flex-end",gap:0,paddingTop:16,borderBottom:"1px solid #E0E0EA",overflowX:"auto"}}>
            <div style={{fontSize:9,color:"#BBBBCC",fontWeight:900,letterSpacing:3,paddingBottom:12,paddingRight:14,whiteSpace:"nowrap"}}>BY DAY</div>
            {DAYS.map((d,i)=>{
              const on = view==="day" && dayIdx===i;
              return(
                <button key={i} onClick={()=>{setView("day");setDayIdx(i);}} style={{
                  background: on ? d.color : "transparent",
                  color: on ? "#fff" : "#AAAABC",
                  border: on ? "none" : "1px solid #E0E0EA",
                  borderBottom: on ? "none" : "1px solid #E0E0EA",
                  padding:"9px 20px 11px",
                  borderRadius:"8px 8px 0 0",
                  cursor:"pointer",fontWeight:900,fontSize:12,letterSpacing:2,
                  transition:"all 0.2s",whiteSpace:"nowrap",
                  marginBottom: on ? "-1px" : 0,
                }}>{d.label}</button>
              );
            })}
            <div style={{marginLeft:"auto",fontSize:9,color:"#DDDDEE",fontWeight:900,letterSpacing:2,paddingBottom:12}}>SUN · REST</div>
          </div>

          {/* ── ROW 2: MUSCLE TABS ── */}
          <div style={{display:"flex",alignItems:"flex-end",gap:0,paddingTop:10,borderBottom:"1px solid #E0E0EA",overflowX:"auto"}}>
            <div style={{fontSize:9,color:"#BBBBCC",fontWeight:900,letterSpacing:3,paddingBottom:10,paddingRight:14,whiteSpace:"nowrap"}}>BY MUSCLE</div>
            {MUSCLE_KEYS.map((m)=>{
              const mc = LIBRARY[m].color;
              const on = view==="muscle" && musKey===m;
              return(
                <button key={m} onClick={()=>{setView("muscle");setMusKey(m);}} style={{
                  background: on ? mc+"18" : "transparent",
                  color: on ? mc : "#AAAABC",
                  border: `1px solid ${on ? mc+"66" : "#E0E0EA"}`,
                  borderBottom: on ? `1px solid #F2F2F7` : `1px solid #E0E0EA`,
                  padding:"7px 14px 9px",
                  borderRadius:"8px 8px 0 0",
                  cursor:"pointer",fontWeight:900,fontSize:10,letterSpacing:2,
                  transition:"all 0.2s",whiteSpace:"nowrap",marginRight:3,
                  marginBottom: on ? "-1px" : 0,
                }}>{m}</button>
              );
            })}
          </div>

        </div>
      </div>

      {/* ══════════ CONTENT ══════════ */}
      <div style={{maxWidth:960,margin:"0 auto",padding:"28px 18px 52px"}}>

        {/* ── DAY VIEW ── */}
        {view==="day" && (
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
              <span style={{background:day.color,color:"#fff",fontSize:9,fontWeight:900,letterSpacing:3,padding:"3px 10px",borderRadius:4}}>{day.type}</span>
              <span style={{fontSize:22,fontWeight:900,color:"#111",letterSpacing:-0.5}}>{day.full}</span>
              <span style={{color:"#BBBBCC",fontSize:11,fontWeight:700,letterSpacing:1}}>· 2 SETS · HIGH INTENSITY</span>
            </div>

            {day.groups.map((g,gi)=>(
              <div key={gi} style={{marginBottom:24}}>
                {/* Muscle group header */}
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{width:3,height:20,background:g.color,borderRadius:2}}/>
                  <span style={{fontSize:10,fontWeight:900,letterSpacing:3,color:g.color}}>{g.muscle}</span>
                  <div style={{flex:1,height:1,background:"#E8E8F0"}}/>
                </div>

                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {g.exercises.map((ex,ei)=>(
                    <div key={ei}
                      style={{
                        background:"#FFFFFF",border:"1px solid #EAEAF2",
                        borderLeft:`3px solid ${g.color}40`,borderRadius:10,
                        padding:"13px 18px",
                        display:"grid",gridTemplateColumns:"1fr 60px 88px 60px",
                        gap:12,alignItems:"center",transition:"all 0.15s",
                      }}
                      onMouseEnter={e=>{e.currentTarget.style.borderLeftColor=g.color;e.currentTarget.style.background="#F8F8FF";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderLeftColor=g.color+"40";e.currentTarget.style.background="#FFFFFF";}}
                    >
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                          <span style={{fontWeight:900,fontSize:13,color:"#111"}}>{ex.name}</span>
                          <span style={{background:g.color+"16",color:g.color,fontSize:8,fontWeight:900,letterSpacing:1.5,padding:"2px 7px",borderRadius:4}}>{ex.tag}</span>
                        </div>
                        <div style={{fontSize:11,color:"#AAAABC",fontStyle:"italic"}}>{ex.note}</div>
                      </div>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontSize:20,fontWeight:900,color:g.color,lineHeight:1}}>{ex.sets}</div>
                        <div style={{fontSize:7,color:"#CCCCDD",letterSpacing:2,marginTop:2,fontWeight:900}}>SETS</div>
                      </div>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontSize:12,fontWeight:800,color:"#555"}}>{ex.reps}</div>
                        <div style={{fontSize:7,color:"#CCCCDD",letterSpacing:2,marginTop:2,fontWeight:900}}>REPS</div>
                      </div>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontSize:11,fontWeight:700,color:"#AAA"}}>{ex.rest}</div>
                        <div style={{fontSize:7,color:"#CCCCDD",letterSpacing:2,marginTop:2,fontWeight:900}}>REST</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── MUSCLE LIBRARY VIEW ── */}
        {view==="muscle" && (()=>{
          const lib = LIBRARY[musKey];
          return(
            <div>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
                <div style={{width:4,height:36,background:lib.color,borderRadius:2}}/>
                <div>
                  <div style={{fontSize:9,color:"#BBBBCC",fontWeight:900,letterSpacing:3}}>EXERCISE LIBRARY</div>
                  <div style={{fontSize:22,fontWeight:900,color:"#111",letterSpacing:-0.5}}>
                    {musKey} <span style={{color:lib.color,fontSize:12,fontWeight:700,letterSpacing:1}}>— {lib.exercises.length} EXERCISES</span>
                  </div>
                </div>
                <div style={{marginLeft:"auto",background:lib.color+"14",border:`1px solid ${lib.color}33`,borderRadius:8,padding:"8px 14px",textAlign:"center"}}>
                  <div style={{fontSize:9,color:lib.color,fontWeight:900,letterSpacing:2}}>PICK ANY</div>
                  <div style={{fontSize:11,color:"#777",fontWeight:700}}>2 sets each</div>
                </div>
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:"48vh",overflowY:"auto",paddingRight:4,scrollbarWidth:"thin",scrollbarColor:`${lib.color}33 transparent`}}>
                {lib.exercises.map((ex,i)=>(
                  <div key={i}
                    style={{
                      background:"#FFFFFF",border:"1px solid #EAEAF2",
                      borderLeft:`3px solid ${lib.color}40`,borderRadius:10,
                      padding:"14px 20px",
                      display:"grid",gridTemplateColumns:"40px 1fr",
                      gap:14,alignItems:"center",transition:"all 0.15s",
                    }}
                    onMouseEnter={e=>{e.currentTarget.style.borderLeftColor=lib.color;e.currentTarget.style.background="#F8F8FF";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderLeftColor=lib.color+"40";e.currentTarget.style.background="#FFFFFF";}}
                  >
                    <div style={{fontSize:20,fontWeight:900,color:lib.color+"44",textAlign:"center",fontStyle:"italic"}}>{i+1}</div>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                        <span style={{fontWeight:900,fontSize:14,color:"#111"}}>{ex.name}</span>
                        <span style={{background:lib.color+"16",color:lib.color,fontSize:9,fontWeight:900,letterSpacing:1.5,padding:"2px 8px",borderRadius:4}}>{ex.tag}</span>
                      </div>
                      <div style={{fontSize:11,color:"#AAAABC",fontStyle:"italic",lineHeight:1.5}}>{ex.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Footer rules */}
        <div style={{marginTop:28,background:"#FFFFFF",border:"1px solid #E8E8F0",borderRadius:12,padding:"14px 20px",display:"flex",gap:20,flexWrap:"wrap",justifyContent:"center"}}>
          {[
            {i:"💀",t:"2 Hard Sets — both close to failure"},
            {i:"📈",t:"Add weight or reps every single week"},
            {i:"🔥",t:"5–10 min warm-up before every session"},
            {i:"😴",t:"Sleep 8 hrs — growth happens at rest"},
          ].map((r,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:7}}>
              <span style={{fontSize:14}}>{r.i}</span>
              <span style={{fontSize:11,color:"#888",fontWeight:700}}>{r.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}