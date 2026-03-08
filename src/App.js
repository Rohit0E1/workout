import { useState } from "react";

// Equipment icon map
const EQUIP_ICON = {
  barbell:    { icon:"🏋️", label:"Barbell",    bg:"#FFF3E0", color:"#E65100" },
  dumbbell:   { icon:"💪", label:"Dumbbell",   bg:"#E8F5E9", color:"#2E7D32" },
  cable:      { icon:"🔗", label:"Cable",      bg:"#E3F2FD", color:"#1565C0" },
  machine:    { icon:"⚙️", label:"Machine",    bg:"#F3E5F5", color:"#6A1B9A" },
  bodyweight: { icon:"🤸", label:"Bodyweight", bg:"#FCE4EC", color:"#880E4F" },
  ezbar:      { icon:"〰️", label:"EZ Bar",     bg:"#E0F7FA", color:"#006064" },
};

const DAYS = [
  { label:"MON", full:"MONDAY",    type:"PUSH", color:"#FF4D4D",
    groups:[
      { muscle:"CHEST", color:"#FF4D4D", exercises:[
        { name:"Barbell Bench Press",    equip:"barbell",    sets:"2",reps:"4–6",  rest:"2 min",tag:"Overall Mass",          note:"Heavy. 3 sec descent. Drive up explosively.",
          howto:["Lie flat on bench. Grip barbell slightly wider than shoulder width.","Lower the bar slowly to mid-chest over 3 seconds.","Drive the bar up explosively. Squeeze chest at the top."] },
        { name:"Incline Dumbbell Press", equip:"dumbbell",   sets:"2",reps:"8–10", rest:"90s",  tag:"Upper Chest",           note:"45° incline. Squeeze hard at the top.",
          howto:["Set bench to 45°. Hold a dumbbell in each hand at shoulder level.","Press both dumbbells up and slightly inward until they nearly touch.","Lower slowly with control. Feel the upper chest stretch."] },
        { name:"Low-to-High Cable Fly",  equip:"cable",      sets:"2",reps:"12–15",rest:"60s",  tag:"Upper Chest Isolation", note:"Constant tension. Most visible from front.",
          howto:["Set cables to the lowest pulley. Stand in the middle, step forward.","With a slight elbow bend, arc the handles upward and inward.","Squeeze at the top. Slowly return. Never let the tension drop."] },
      ]},
      { muscle:"SHOULDERS", color:"#FF8C00", exercises:[
        { name:"Overhead Barbell Press", equip:"barbell",    sets:"2",reps:"5–7",  rest:"2 min",tag:"Overall Mass",          note:"Standing. Strict. No leg drive.",
          howto:["Stand with bar on upper chest. Hands just outside shoulder width.","Brace your core hard. Press the bar straight up overhead.","Lock out at the top. Lower slowly back to the start."] },
        { name:"Lateral Raises",         equip:"dumbbell",   sets:"2",reps:"12–15",rest:"60s",  tag:"Width — Most Attractive",note:"Pinky up at top. Feel the burn.",
          howto:["Hold dumbbells at sides. Slight forward lean, slight elbow bend.","Raise arms out to the sides until parallel to the floor.","Pinky slightly higher than thumb at the top. Lower with control."] },
        { name:"Face Pulls",             equip:"cable",      sets:"2",reps:"15–20",rest:"45s",  tag:"Rear Delt + Health",    note:"High pulley. Essential for shoulder health.",
          howto:["Set cable to head height with a rope attachment.","Pull the rope toward your face, elbows flaring high and wide.","Externally rotate at the end — thumbs pointing back. Squeeze."] },
      ]},
      { muscle:"TRICEPS", color:"#FFB800", exercises:[
        { name:"Close Grip Bench Press", equip:"barbell",    sets:"2",reps:"6–8",  rest:"90s",  tag:"Overall Mass",          note:"Elbows tucked. Heaviest tricep compound.",
          howto:["Lie on flat bench. Grip barbell at shoulder width (not too narrow).","Lower the bar to lower chest keeping elbows tight to your sides.","Press up powerfully. Feel the triceps fully contract at the top."] },
        { name:"Rope Pushdown",          equip:"cable",      sets:"2",reps:"12–15",rest:"60s",  tag:"Lateral Head",          note:"Spread the rope at the bottom. Full extension.",
          howto:["High pulley with rope. Stand close. Elbows pinned to your sides.","Push the rope down until arms are fully extended.","Spread the rope apart at the bottom. Squeeze hard. Slow return."] },
        { name:"Overhead Cable Extension",equip:"cable",     sets:"2",reps:"12–15",rest:"60s",  tag:"Horseshoe Shape",       note:"Long head = the horseshoe visible from behind.",
          howto:["Face away from cable (set low). Hold rope overhead with both hands.","Extend arms forward and up overhead. Keep elbows close to head.","Lower slowly behind your head for maximum long head stretch."] },
      ]},
      { muscle:"ABS", color:"#22C55E", exercises:[
        { name:"Cable Crunch",           equip:"cable",      sets:"2",reps:"15–20",rest:"45s",  tag:"Upper Abs",             note:"Crunch the abs, not the hip flexors.",
          howto:["Kneel below a high pulley. Hold rope behind your neck.","Flex your waist — round your lower back. Pull elbows toward knees.","Pause at the bottom. Slowly return. The hips should NOT move."] },
        { name:"Hanging Leg Raise",      equip:"bodyweight", sets:"2",reps:"12–15",rest:"45s",  tag:"Lower Abs",             note:"Slow and controlled. No swinging.",
          howto:["Hang from a pull-up bar with full arm extension.","Raise your legs up keeping them as straight as possible.","Tuck the pelvis at the top. Lower slowly. Zero swinging."] },
      ]},
    ]
  },
  { label:"TUE", full:"TUESDAY",   type:"PULL", color:"#3D8EFF",
    groups:[
      { muscle:"BACK", color:"#3D8EFF", exercises:[
        { name:"Deadlift",               equip:"barbell",    sets:"2",reps:"4–6",  rest:"2.5 min",tag:"Full Back Thickness", note:"Brace hard. Drive the floor away.",
          howto:["Bar over mid-foot. Hip-width stance. Grip just outside legs.","Big breath, brace your core like a punch is coming. Chest up.","Drive the floor away — don't think 'pull up'. Lock hips at the top."] },
        { name:"Weighted Pull-Ups",      equip:"bodyweight", sets:"2",reps:"6–8",  rest:"2 min",  tag:"V-Taper Lats",       note:"Full hang at bottom. Chest to bar.",
          howto:["Hang from bar with wide overhand grip. Full dead hang.","Pull your chest to the bar — drive elbows down and back.","Pause at the top. Lower slowly all the way to a dead hang."] },
        { name:"Bent Over Barbell Row",  equip:"barbell",    sets:"2",reps:"6–8",  rest:"90s",    tag:"Mid + Upper Back",   note:"45° torso. Pull to belly button.",
          howto:["Hinge forward to 45°. Overhand grip slightly wider than shoulders.","Pull the bar to your belly button. Drive elbows back hard.","Squeeze lats and rhomboids at the top. Lower with control."] },
      ]},
      { muscle:"BICEPS", color:"#00C2FF", exercises:[
        { name:"Barbell Curl",           equip:"barbell",    sets:"2",reps:"6–8",  rest:"90s",  tag:"Overall Mass",         note:"Elbows pinned. No swinging.",
          howto:["Stand with barbell. Underhand grip shoulder-width. Elbows pinned.","Curl the bar upward in a smooth arc. Don't let elbows drift forward.","Squeeze hard at the top. Lower slowly over 3 seconds."] },
        { name:"Incline Dumbbell Curl",  equip:"dumbbell",   sets:"2",reps:"8–10", rest:"75s",  tag:"Long Head Peak",       note:"Full stretch at bottom. Peak squeeze.",
          howto:["Set bench to 60°. Sit back. Let arms hang straight down.","Curl both dumbbells up — the stretch at the bottom is the point.","Squeeze hard at the top. The long head stretch builds the peak."] },
        { name:"Hammer Curl",            equip:"dumbbell",   sets:"2",reps:"10–12",rest:"60s",  tag:"Brachialis Thickness", note:"Neutral grip. Adds arm thickness.",
          howto:["Hold dumbbells with palms facing each other (neutral grip).","Curl upward without rotating the wrist. Thumbs stay pointing up.","Squeeze at the top. This builds the brachialis for arm width."] },
      ]},
    ]
  },
  { label:"WED", full:"WEDNESDAY", type:"LEGS", color:"#FF8C00",
    groups:[
      { muscle:"QUADS", color:"#B44FFF", exercises:[
        { name:"Barbell Back Squat",     equip:"barbell",    sets:"2",reps:"4–6",  rest:"2.5 min",tag:"Overall Mass",       note:"Break parallel. Chest up. Knees track toes.",
          howto:["Bar on upper traps. Feet shoulder-width. Toes slightly out.","Sit back and down — break parallel. Chest stays up. Knees out.","Drive through your whole foot. Push the floor away to stand."] },
        { name:"Hack Squat",             equip:"machine",    sets:"2",reps:"8–10", rest:"90s",    tag:"Quads + Glutes",     note:"Feet low and narrow for quad focus.",
          howto:["Stand on hack squat platform. Feet low and narrow on the pad.","Lower until thighs are parallel. Let knees travel over toes.","Drive up through the quads. Don't lock knees completely at top."] },
        { name:"Leg Extension",          equip:"machine",    sets:"2",reps:"12–15",rest:"60s",    tag:"Teardrop — Most Visible", note:"Pause at top. Most visible in shorts.",
          howto:["Sit in machine. Pad just above ankles. Back flat against pad.","Extend legs fully. Pause 1 second at the top and squeeze the quad.","Lower slowly — 3 seconds down. This builds the teardrop muscle."] },
      ]},
      { muscle:"HAMSTRINGS", color:"#FF2D78", exercises:[
        { name:"Romanian Deadlift",      equip:"barbell",    sets:"2",reps:"8–10", rest:"90s",  tag:"Hamstrings + Glutes",  note:"Feel the stretch. Hinge don't squat.",
          howto:["Stand with bar. Soft bend in knees. Push hips back — not down.","Lower the bar along your legs until you feel the hamstring pull.","Drive hips forward to return. Squeeze glutes at the top."] },
        { name:"Seated Leg Curl",        equip:"machine",    sets:"2",reps:"10–12",rest:"60s",  tag:"Isolation",            note:"Pause at peak. Slow 3 sec eccentric.",
          howto:["Sit in machine. Pad just above ankles. Back flat, hips down.","Curl the pad down as far as possible. Pause and squeeze.","Return over 3 full seconds. The slow negative builds the muscle."] },
      ]},
      { muscle:"CALVES", color:"#00C896", exercises:[
        { name:"Standing Calf Raise",    equip:"machine",    sets:"2",reps:"15–20",rest:"60s",  tag:"Gastrocnemius",        note:"Full stretch at bottom. Pause at top.",
          howto:["Stand on calf raise machine. Ball of foot on the edge.","Lower all the way down — full deep stretch. Hold 1 second.","Rise all the way up on tiptoe. Pause 1 second. Lower slowly."] },
        { name:"Seated Calf Raise",      equip:"machine",    sets:"2",reps:"15–20",rest:"60s",  tag:"Soleus — Fullness",    note:"Gives calves that thick full look.",
          howto:["Sit in seated calf raise. Pads on lower thighs. Feet on plate.","Lower heels for a deep stretch. Hold 1 second at the bottom.","Rise up. Squeeze at top. Seated position targets the soleus."] },
      ]},
      { muscle:"ABS", color:"#22C55E", exercises:[
        { name:"Ab Wheel Rollout",       equip:"bodyweight", sets:"2",reps:"10–12",rest:"60s",  tag:"Full Core",            note:"Brace hard. Don't let lower back collapse.",
          howto:["Kneel. Hold ab wheel with both hands. Arms straight below chest.","Roll forward slowly as far as you can without your back collapsing.","Pull back using your core — not your arms. Brace the entire time."] },
        { name:"Weighted Plank",         equip:"bodyweight", sets:"2",reps:"45–60s",rest:"45s", tag:"Core Stability",       note:"Plate on back. Squeeze everything.",
          howto:["Get into forearm plank position. Body perfectly straight.","Have someone place a weight plate on your upper back.","Squeeze glutes, abs and quads simultaneously. Don't let hips sag."] },
      ]},
    ]
  },
  { label:"THU", full:"THURSDAY",  type:"PUSH", color:"#FF4D4D",
    groups:[
      { muscle:"CHEST", color:"#FF4D4D", exercises:[
        { name:"Incline Barbell Press",  equip:"barbell",    sets:"2",reps:"6–8",  rest:"90s",  tag:"Upper Chest Heavy",    note:"Slightly lighter than Monday. Upper focus.",
          howto:["Set bench to 30–45°. Grip barbell just wider than shoulders.","Lower to upper chest. Feel the upper pec stretch at the bottom.","Press up and slightly back. Squeeze upper chest at the top."] },
        { name:"Dumbbell Pullover",      equip:"dumbbell",   sets:"2",reps:"10–12",rest:"75s",  tag:"Full Stretch",         note:"Hits upper, middle, lower + serratus.",
          howto:["Lie perpendicular on bench — upper back on pad, hips low.","Hold one dumbbell with both hands overhead. Arms nearly straight.","Arc the weight back over your head. Feel the whole chest open."] },
        { name:"Pec Deck Machine",       equip:"machine",    sets:"2",reps:"12–15",rest:"60s",  tag:"Middle Chest Squeeze", note:"Slow. All feel. Full squeeze at peak.",
          howto:["Sit in pec deck. Back flat. Elbows on pads at chest height.","Bring pads together in a smooth arc. Squeeze chest hard at center.","Return slowly. Feel the chest stretch. Never slam the weight."] },
      ]},
      { muscle:"SHOULDERS", color:"#FF8C00", exercises:[
        { name:"Arnold Press",           equip:"dumbbell",   sets:"2",reps:"8–10", rest:"90s",  tag:"All 3 Heads",          note:"Rotate fully. Hits all 3 deltoid heads.",
          howto:["Start with dumbbells at chin, palms facing you.","As you press up, rotate palms outward so they face forward at top.","Reverse the rotation on the way down. Full range every rep."] },
        { name:"Reverse Pec Deck",       equip:"machine",    sets:"2",reps:"12–15",rest:"60s",  tag:"Rear Delt",            note:"Squeeze the rear delts. No momentum.",
          howto:["Sit facing the pec deck pad. Grip the handles with straight arms.","Pull handles back and out in a wide arc. Squeeze rear delts hard.","Return slowly. Never use momentum — the rear delt is small."] },
        { name:"Cable Lateral Raise",    equip:"cable",      sets:"2",reps:"12–15",rest:"60s",  tag:"Side Delt",            note:"Constant tension. Better peak contraction.",
          howto:["Low pulley to side. Hold handle with far hand across your body.","Raise arm out to the side until parallel to the floor.","Hold 1 sec at top. Lower slowly. Constant tension whole time."] },
      ]},
      { muscle:"TRICEPS", color:"#FFB800", exercises:[
        { name:"Skull Crushers",         equip:"ezbar",      sets:"2",reps:"8–10", rest:"75s",  tag:"Long + Medial Head",   note:"EZ bar. Lower slowly behind head for full stretch.",
          howto:["Lie on bench. Hold EZ bar with narrow grip, arms straight up.","Hinge ONLY at the elbows — lower the bar behind your head slowly.","Extend back up. The stretch behind the head is the whole point."] },
        { name:"Dips (Triceps)",         equip:"bodyweight", sets:"2",reps:"8–12", rest:"90s",  tag:"All 3 Heads",          note:"Upright torso. Elbows close. Drive up.",
          howto:["Grip parallel bars. Keep torso upright — don't lean forward.","Lower until elbows are at 90°. Keep elbows close to your body.","Drive straight up. Squeeze triceps hard at lockout at the top."] },
        { name:"Single DB Overhead Ext.",equip:"dumbbell",   sets:"2",reps:"10–12",rest:"60s",  tag:"Long Head Stretch",    note:"Both hands on one dumbbell. Full stretch.",
          howto:["Hold one dumbbell with both hands. Press overhead. Elbows in.","Lower the dumbbell behind your head by hinging at the elbows.","Extend back up. The overhead stretch targets the long head."] },
      ]},
    ]
  },
  { label:"FRI", full:"FRIDAY",    type:"PULL", color:"#3D8EFF",
    groups:[
      { muscle:"BACK", color:"#3D8EFF", exercises:[
        { name:"T-Bar Row",              equip:"barbell",    sets:"2",reps:"8–10", rest:"90s",  tag:"Overall Thickness",    note:"Best for back thickness across all regions.",
          howto:["Straddle the bar. Bend to 45°. Grip the close handles.","Pull the bar to your chest. Drive elbows back as far as possible.","Squeeze every muscle of the back at the top. Lower slowly."] },
        { name:"Wide Grip Lat Pulldown", equip:"cable",      sets:"2",reps:"10–12",rest:"75s",  tag:"Lat Width",            note:"Pull to upper chest. Full lat stretch at top.",
          howto:["Sit at pulldown. Wide overhand grip. Lean back 15° only.","Pull the bar to your upper chest — drive elbows down and back.","Return all the way up. Let lats fully stretch at the top."] },
        { name:"Seated Cable Row",       equip:"cable",      sets:"2",reps:"10–12",rest:"75s",  tag:"Mid Back + Rhomboids", note:"Elbows tight. Squeeze mid back hard.",
          howto:["Sit at cable row. Feet on pads. Slight knee bend. Back straight.","Pull handle to your belly button. Elbows stay close to your body.","Squeeze shoulder blades together hard. Return with full stretch."] },
        { name:"Chest Supported Row",    equip:"dumbbell",   sets:"2",reps:"10–12",rest:"75s",  tag:"Pure Back",            note:"No cheating. Chest on pad. All back.",
          howto:["Set incline bench to 30°. Lie face down with chest on pad.","Row dumbbells up with elbows flaring slightly out.","Chest stays on the pad the whole time — zero cheating possible."] },
      ]},
      { muscle:"BICEPS", color:"#00C2FF", exercises:[
        { name:"Spider Curl",            equip:"dumbbell",   sets:"2",reps:"10–12",rest:"60s",  tag:"Short Head Peak",      note:"Chest on incline bench. Elbow behind body.",
          howto:["Lie face-down on incline bench. Let arms hang straight down.","Curl dumbbells up fully. Elbow stays back behind the body.","This position crushes the short head — builds the bicep peak."] },
        { name:"Cable Curl",             equip:"cable",      sets:"2",reps:"12–15",rest:"45s",  tag:"Constant Tension",     note:"Squeeze 1 sec at top. Never loses tension.",
          howto:["Low pulley. Stand close. EZ bar or straight bar attachment.","Curl up keeping elbows pinned at your sides. Don't lean back.","Hold the squeeze 1 second. Cable keeps tension unlike dumbbells."] },
        { name:"Preacher Curl",          equip:"ezbar",      sets:"2",reps:"8–10", rest:"75s",  tag:"Short Head Mass",      note:"EZ bar. No momentum possible.",
          howto:["Sit at preacher bench. Upper arms flat on the angled pad.","Curl the EZ bar up fully. Squeeze hard at the top.","Lower very slowly — the negative on the preacher builds size fast."] },
      ]},
      { muscle:"ABS", color:"#22C55E", exercises:[
        { name:"Decline Sit-Up",         equip:"bodyweight", sets:"2",reps:"15–20",rest:"45s",  tag:"Upper Abs",            note:"Add a plate for extra resistance.",
          howto:["Hook feet on decline bench. Arms crossed or hold a weight plate.","Sit up fully — don't just crunch. Full range of motion.","Lower slowly. The decline adds extra resistance vs flat sit-up."] },
        { name:"Side Plank",             equip:"bodyweight", sets:"2",reps:"30–45s ea.",rest:"45s",tag:"Obliques",          note:"Don't let your hip drop.",
          howto:["Lie on side. Prop on forearm. Stack feet on top of each other.","Raise hips — body forms a straight line from head to feet.","Hold. Don't let hips drop or rotate. Switch sides after time."] },
        { name:"Dragon Flag",            equip:"bodyweight", sets:"2",reps:"8–10", rest:"60s",  tag:"Advanced Full Abs",    note:"Bruce Lee's favourite. Control the descent.",
          howto:["Lie on bench. Grip behind your head. Keep body rigid like a board.","Raise legs and hips — only shoulders stay on the bench.","Lower your entire body slowly. Don't let the lower back touch first."] },
      ]},
    ]
  },
  { label:"SAT", full:"SATURDAY",  type:"LEGS", color:"#FF8C00",
    groups:[
      { muscle:"QUADS", color:"#B44FFF", exercises:[
        { name:"Bulgarian Split Squat",  equip:"dumbbell",   sets:"2",reps:"10–12",rest:"90s",  tag:"Glutes + Balance",     note:"Most humbling exercise. Best glute-quad tie-in.",
          howto:["Rear foot elevated on bench. Front foot 2 steps ahead.","Lower your rear knee toward the floor. Keep front shin vertical.","Drive through your front heel. Squeeze glute at the top."] },
        { name:"Leg Press",              equip:"machine",    sets:"2",reps:"10–12",rest:"90s",  tag:"Quads + Glutes",       note:"High foot for glutes. Low foot for quads.",
          howto:["Sit in leg press. Feet shoulder width. Choose foot height.","Lower platform until knees are at 90°. Don't let lower back curl.","Drive through your whole foot. Don't lock knees at the top."] },
        { name:"Walking Lunges",         equip:"dumbbell",   sets:"2",reps:"12 each",rest:"75s",tag:"Glutes + Quads",      note:"Add dumbbells. Long stride. Knee near floor.",
          howto:["Hold dumbbells at sides. Stand tall. Take a long stride forward.","Lower your rear knee to just above the floor. Front shin vertical.","Push off front foot. Step through into the next lunge. No pause."] },
      ]},
      { muscle:"HAMSTRINGS", color:"#FF2D78", exercises:[
        { name:"Lying Leg Curl",         equip:"machine",    sets:"2",reps:"10–12",rest:"60s",  tag:"Isolation",            note:"Full range. Don't let hips rise.",
          howto:["Lie face down. Pad just above ankles. Hips flat on the pad.","Curl your heels toward your glutes as far as they'll go.","Squeeze at the top. Lower over 3 seconds. Hips stay down."] },
        { name:"Good Mornings",          equip:"barbell",    sets:"2",reps:"10–12",rest:"75s",  tag:"Hamstrings + Lower Back",note:"Light weight. Hip hinge with bar on back.",
          howto:["Light barbell on upper traps. Feet shoulder-width. Soft knees.","Push hips back and hinge forward — back stays straight. Not a squat.","Return by driving hips forward. Feel the hamstring stretch."] },
      ]},
      { muscle:"CALVES", color:"#00C896", exercises:[
        { name:"Donkey Calf Raise",      equip:"machine",    sets:"2",reps:"15–20",rest:"60s",  tag:"Full Stretch",         note:"Best calf stretch possible. Deep at bottom.",
          howto:["Use donkey calf raise or bend over with pads on hips.","Lower heels as far as possible — deepest stretch of any calf exercise.","Rise all the way up. Pause. The deep stretch is everything."] },
        { name:"Leg Press Calf Raise",   equip:"machine",    sets:"2",reps:"15–20",rest:"60s",  tag:"Heavy Overload",       note:"Safest way to load calves really heavy.",
          howto:["In leg press with legs extended. Ball of foot on the bottom edge.","Push the platform away using only your calf — ankles only move.","Full range both ways. Heaviest load possible for the calves."] },
      ]},
    ]
  },
];

// ── FULL LIBRARY ──────────────────────────────────────────────────────────
const LIBRARY = {
  CHEST:{ color:"#FF4D4D", exercises:[
    { name:"Barbell Bench Press",     equip:"barbell",    tag:"Overall Mass",          note:"Heavy. 3 sec descent. Drive up explosively.",        howto:["Lie flat. Grip slightly wider than shoulders.","Lower bar to mid-chest over 3 seconds.","Drive up explosively. Squeeze chest at top."] },
    { name:"Incline Dumbbell Press",  equip:"dumbbell",   tag:"Upper Chest",           note:"45° incline. Squeeze hard at the top.",              howto:["Set bench to 45°. Dumbbells at shoulder level.","Press up and slightly inward. Arms nearly touch.","Lower slowly. Feel the upper chest stretch."] },
    { name:"Decline Barbell Press",   equip:"barbell",    tag:"Lower Chest",           note:"Feel the lower pec stretch and contract.",           howto:["Lie on decline bench. Grip shoulder-width.","Lower bar to lower chest. Feel the lower pec.","Press up. Squeeze lower pec at lockout."] },
    { name:"Dumbbell Pullover",       equip:"dumbbell",   tag:"Full Stretch",          note:"Hits upper, middle, lower + serratus. Full arc.",    howto:["Lie across bench. Both hands on one dumbbell.","Arc weight overhead — arms nearly straight.","Pull back up. Feel entire chest open and stretch."] },
    { name:"Low-to-High Cable Fly",   equip:"cable",      tag:"Upper Chest Isolation", note:"Constant tension on upper pec. Most visible.",       howto:["Cables at lowest setting. Step forward.","Arc handles upward and inward, slight elbow bend.","Squeeze at top. Return slow. Never drop tension."] },
    { name:"Pec Deck Machine",        equip:"machine",    tag:"Middle Chest Squeeze",  note:"Slow and deliberate. Full squeeze at peak.",         howto:["Sit back. Elbows on pads at chest height.","Bring pads together in a smooth controlled arc.","Squeeze center hard. Return slowly. No slamming."] },
    { name:"Dips (Chest)",            equip:"bodyweight", tag:"Lower + Overall Mass",  note:"Lean forward. Let the chest stretch deep.",          howto:["Grip parallel bars. Lean forward 20–30°.","Lower until chest stretches. Elbows flare slightly.","Drive up. The forward lean means chest, not triceps."] },
  ]},
  SHOULDERS:{ color:"#FF8C00", exercises:[
    { name:"Overhead Barbell Press",  equip:"barbell",    tag:"Overall Mass",           note:"Standing. Strict. No leg drive. Core braced.",      howto:["Bar on upper chest. Hands just outside shoulders.","Brace core. Press straight up overhead.","Lock out. Lower slowly back to the start."] },
    { name:"Arnold Press",            equip:"dumbbell",   tag:"All 3 Heads",            note:"Rotate fully. Hits all 3 deltoid heads.",           howto:["Start with dumbbells at chin, palms facing you.","Rotate palms outward as you press overhead.","Reverse rotation on the way down. Full range."] },
    { name:"Lateral Raises",          equip:"dumbbell",   tag:"Width — Most Attractive",note:"Pinky up. Slight forward lean. Feel the burn.",     howto:["Hold at sides. Slight forward lean, soft elbows.","Raise arms out to shoulder height.","Pinky higher than thumb at top. Lower slow."] },
    { name:"Face Pulls",              equip:"cable",      tag:"Rear Delt + Health",     note:"High pulley. Essential for shoulder health.",       howto:["Cable at head height with rope.","Pull to face. Elbows flare high and wide.","External rotation at end. Thumbs pointing back."] },
    { name:"Reverse Pec Deck",        equip:"machine",    tag:"Rear Delt",              note:"Squeeze the rear delts. Don't use momentum.",      howto:["Sit facing pad. Arms out to sides on handles.","Pull handles back in a wide arc. Elbows soft.","Squeeze rear delts hard at the back."] },
    { name:"Cable Lateral Raise",     equip:"cable",      tag:"Side Delt",              note:"Constant tension vs dumbbells.",                   howto:["Low pulley to your side. Reach across to grip.","Raise arm out to shoulder height.","1 sec hold at top. Lower slow. Constant tension."] },
    { name:"Upright Row",             equip:"barbell",    tag:"Traps + Side Delt",      note:"Wide grip. Elbows flare out and up.",               howto:["Hold barbell with wide grip. Stand straight.","Pull bar up along body. Elbows flare high above bar.","Lower slowly. Wide grip protects the shoulder."] },
  ]},
  TRICEPS:{ color:"#FFB800", exercises:[
    { name:"Close Grip Bench Press",       equip:"barbell",    tag:"Overall Mass",        note:"Elbows tucked. Heaviest tricep compound.",          howto:["Flat bench. Shoulder-width grip (not too narrow).","Lower to lower chest. Elbows stay tight to body.","Press up. Triceps fully contract at top."] },
    { name:"Skull Crushers",               equip:"ezbar",      tag:"Long + Medial Head",  note:"EZ bar. Lower slowly behind head.",                 howto:["Lie on bench. EZ bar straight up overhead.","Hinge ONLY at elbows. Lower bar behind head.","Extend back up. Stretch behind head is the point."] },
    { name:"Rope Pushdown",                equip:"cable",      tag:"Lateral Head",        note:"Spread rope at the bottom. Full extension.",        howto:["High pulley with rope. Elbows pinned to sides.","Push rope down until arms are fully extended.","Spread rope apart at bottom. Squeeze hard."] },
    { name:"Overhead Cable Extension",     equip:"cable",      tag:"Horseshoe Shape",     note:"Long head = horseshoe visible from behind.",        howto:["Face away from low cable. Hold rope overhead.","Extend arms forward and overhead. Elbows close.","Lower behind head for maximum long head stretch."] },
    { name:"Dips (Triceps)",               equip:"bodyweight", tag:"All 3 Heads",         note:"Upright torso. Elbows close. Drive up.",            howto:["Parallel bars. Keep torso completely upright.","Lower until elbows at 90°. Elbows close to body.","Drive straight up. Squeeze at lockout."] },
    { name:"Single DB Overhead Extension", equip:"dumbbell",   tag:"Long Head Stretch",   note:"Both hands on one dumbbell. Full stretch.",         howto:["Hold one dumbbell overhead with both hands.","Lower behind head by hinging at elbows only.","Extend back up. Overhead = long head stretch."] },
    { name:"Kickbacks",                    equip:"dumbbell",   tag:"Lateral Head Squeeze",note:"Fully extend the arm. Squeeze hard at top.",        howto:["Hinge to 45°. Upper arm parallel to floor.","Extend forearm back until arm is fully straight.","Squeeze hard at full extension. Slow return."] },
  ]},
  BACK:{ color:"#3D8EFF", exercises:[
    { name:"Deadlift",                equip:"barbell",    tag:"Full Back Thickness",  note:"Brace hard. Drive the floor away.",                 howto:["Bar over mid-foot. Grip just outside legs.","Big breath. Brace hard. Chest up.","Drive floor away — don't think 'pull up'."] },
    { name:"Weighted Pull-Ups",       equip:"bodyweight", tag:"V-Taper Lats",         note:"Full hang at bottom. Chest to bar.",                howto:["Wide overhand grip. Full dead hang.","Pull chest to bar. Drive elbows down and back.","Pause at top. Lower slowly to dead hang."] },
    { name:"Bent Over Barbell Row",   equip:"barbell",    tag:"Mid + Upper Back",     note:"45° torso. Pull to belly button. Squeeze.",         howto:["Hinge to 45°. Overhand grip, wider than shoulders.","Pull bar to belly button. Elbows back hard.","Squeeze everything at the top. Lower slow."] },
    { name:"T-Bar Row",               equip:"barbell",    tag:"Overall Thickness",    note:"Best exercise for back thickness.",                 howto:["Straddle bar. Bend to 45°. Close grip handles.","Pull to chest. Drive elbows back as far as possible.","Squeeze all back muscles at top. Lower slow."] },
    { name:"Wide Grip Lat Pulldown",  equip:"cable",      tag:"Lat Width",            note:"Pull to upper chest. Full lat stretch at top.",     howto:["Wide overhand grip. Lean back 15°.","Pull bar to upper chest. Drive elbows down.","Return all the way up. Let lats fully stretch."] },
    { name:"Seated Cable Row",        equip:"cable",      tag:"Mid Back + Rhomboids", note:"Elbows tight. Squeeze mid back hard.",              howto:["Sit at cable row. Back straight. Soft knees.","Pull to belly button. Elbows close to body.","Squeeze shoulder blades. Return with full stretch."] },
    { name:"Single Arm DB Row",       equip:"dumbbell",   tag:"Full Lat Isolation",   note:"Let the lat fully stretch at the bottom.",          howto:["Brace on bench. One arm hangs straight down.","Row dumbbell to hip. Lead with elbow, not hand.","Let arm hang fully down. Stretch lat completely."] },
    { name:"Chest Supported Row",     equip:"dumbbell",   tag:"Pure Back",            note:"No cheating. Chest on pad. All back.",              howto:["Lie face down on incline bench. Chest on pad.","Row dumbbells up. Elbows slightly flared.","Chest stays on pad the entire set. Zero cheating."] },
  ]},
  BICEPS:{ color:"#00C2FF", exercises:[
    { name:"Barbell Curl",           equip:"barbell",    tag:"Overall Mass",         note:"Elbows pinned. No swinging.",                       howto:["Stand with barbell. Elbows pinned at sides.","Curl bar up in a smooth arc. Don't lean back.","Squeeze at top. Lower over 3 full seconds."] },
    { name:"Incline Dumbbell Curl",  equip:"dumbbell",   tag:"Long Head Peak",       note:"Full stretch at bottom. Peak squeeze.",             howto:["60° bench. Sit back. Arms hang straight down.","Curl up. The dead-hang stretch is the whole point.","Squeeze hard at top. Builds bicep peak."] },
    { name:"Hammer Curl",            equip:"dumbbell",   tag:"Brachialis Thickness", note:"Neutral grip. Adds arm thickness.",                 howto:["Hold dumbbells. Palms face each other all the way.","Curl up without rotating the wrist at all.","Squeeze at top. Builds brachialis for width."] },
    { name:"Spider Curl",            equip:"dumbbell",   tag:"Short Head Peak",      note:"Chest on incline bench. Elbow behind body.",        howto:["Face down on incline bench. Arms hang straight.","Curl dumbbells up. Elbow stays behind your body.","Builds short head — the visible peak from front."] },
    { name:"Cable Curl",             equip:"cable",      tag:"Constant Tension",     note:"Squeeze 1 sec at top. Never loses tension.",        howto:["Low pulley. EZ bar or straight bar.","Curl up keeping elbows pinned at sides.","1 sec squeeze at top. Constant tension unlike DBs."] },
    { name:"Concentration Curl",     equip:"dumbbell",   tag:"Peak Isolation",       note:"Elbow on inner thigh. Pure peak contraction.",      howto:["Sit. Elbow on inner thigh. Arm hangs down.","Curl dumbbell up fully. Twist pinky out at top.","Pure isolation. Best peak contraction possible."] },
    { name:"Preacher Curl",          equip:"ezbar",      tag:"Short Head Mass",      note:"EZ bar. No momentum possible.",                     howto:["Upper arms flat on angled preacher pad.","Curl EZ bar up fully. Squeeze hard at top.","Lower VERY slowly — negative builds size fast."] },
  ]},
  QUADS:{ color:"#B44FFF", exercises:[
    { name:"Barbell Back Squat",     equip:"barbell",    tag:"Overall Mass",           note:"Break parallel. Chest up. Knees track toes.",      howto:["Bar on traps. Feet shoulder-width. Toes out.","Sit back and down past parallel. Chest stays up.","Drive through whole foot. Push the floor away."] },
    { name:"Hack Squat",             equip:"machine",    tag:"Quads + Glutes",         note:"Feet low and narrow for more quad focus.",         howto:["Platform. Feet low and narrow.","Lower until thighs parallel. Knees over toes.","Drive up through quads. Don't lock knees."] },
    { name:"Leg Press",              equip:"machine",    tag:"Quads + Glutes",         note:"High foot for glutes. Low foot for quads.",        howto:["Feet shoulder-width. Choose foot height.","Lower platform until knees at 90°. Back flat.","Drive through whole foot. Don't lock knees."] },
    { name:"Leg Extension",          equip:"machine",    tag:"Teardrop — Most Visible",note:"Pause at top. Teardrop = most visible in shorts.", howto:["Pad just above ankles. Back flat.","Extend legs fully. Pause 1 sec and squeeze hard.","Lower over 3 seconds. Builds the teardrop muscle."] },
    { name:"Bulgarian Split Squat",  equip:"dumbbell",   tag:"Glutes + Balance",       note:"Most humbling exercise. Best glute-quad tie-in.", howto:["Rear foot on bench. Front foot 2 steps forward.","Lower rear knee toward floor. Front shin vertical.","Drive through front heel. Squeeze glute at top."] },
    { name:"Walking Lunges",         equip:"dumbbell",   tag:"Glutes + Quads",         note:"Long stride. Knee almost touches floor.",          howto:["Hold dumbbells at sides. Tall posture.","Take a long stride. Lower rear knee near floor.","Push off front foot. Step through into next lunge."] },
  ]},
  HAMSTRINGS:{ color:"#FF2D78", exercises:[
    { name:"Romanian Deadlift",      equip:"barbell",    tag:"Hamstrings + Glutes",    note:"Feel the stretch. Hinge don't squat.",             howto:["Bar in hand. Soft knees. Push hips back.","Lower bar along legs until hamstring pull.","Drive hips forward to return. Squeeze glutes."] },
    { name:"Seated Leg Curl",        equip:"machine",    tag:"Hamstring Isolation",    note:"Pause at peak contraction. Slow eccentric.",       howto:["Sit in machine. Pad just above ankles.","Curl pad down fully. Pause and squeeze hard.","Return over 3 full seconds. Slow negative."] },
    { name:"Lying Leg Curl",         equip:"machine",    tag:"Hamstring Isolation",    note:"Full range of motion. Don't let hips rise.",       howto:["Lie face down. Pad just above ankles.","Curl heels toward glutes as far as possible.","Squeeze at top. Lower over 3 seconds. Hips stay flat."] },
    { name:"Good Mornings",          equip:"barbell",    tag:"Hamstrings + Lower Back",note:"Light weight. Hip hinge with bar on back.",         howto:["Light bar on upper traps. Feet shoulder-width.","Push hips back. Hinge forward. Back stays straight.","Return by driving hips forward. Feel the stretch."] },
  ]},
  CALVES:{ color:"#00C896", exercises:[
    { name:"Standing Calf Raise",    equip:"machine",    tag:"Gastrocnemius — Upper",  note:"Full stretch at bottom. Pause 1 sec at top.",      howto:["Ball of foot on edge of platform.","Lower all the way down. Hold 1 sec stretch.","Rise all the way up. Pause 1 sec. Lower slow."] },
    { name:"Seated Calf Raise",      equip:"machine",    tag:"Soleus — Lower Fullness",note:"Gives calves that full thick look.",                howto:["Sit. Pads on lower thighs. Feet on plate.","Lower heels for deep stretch. Hold 1 sec.","Rise up. Squeeze. Seated targets the soleus."] },
    { name:"Donkey Calf Raise",      equip:"machine",    tag:"Full Stretch",           note:"Best calf stretch possible. Deep at bottom.",      howto:["Bend over with pads on hips for resistance.","Lower heels as deep as possible. Hold stretch.","Rise all the way up. Deepest stretch possible."] },
    { name:"Leg Press Calf Raise",   equip:"machine",    tag:"Heavy Overload",         note:"Safest way to load the calves really heavy.",      howto:["Legs extended in leg press. Ball of foot on edge.","Push using ONLY the ankle joint. Full range.","Heaviest possible load. Great for overloading."] },
  ]},
  ABS:{ color:"#22C55E", exercises:[
    { name:"Cable Crunch",           equip:"cable",      tag:"Upper Abs — Heavy",      note:"Crunch the abs, not the hip flexors.",             howto:["Kneel below high pulley. Rope behind neck.","Flex waist — round lower back. Elbows to knees.","Hips do NOT move. Pause at bottom. Slow return."] },
    { name:"Hanging Leg Raise",      equip:"bodyweight", tag:"Lower Abs",              note:"Slow and controlled. No swinging.",                howto:["Hang from bar. Full arm extension.","Raise legs keeping them as straight as possible.","Tuck pelvis at top. Lower slow. Zero swinging."] },
    { name:"Ab Wheel Rollout",       equip:"bodyweight", tag:"Full Core",              note:"Brace hard. Don't let lower back collapse.",       howto:["Kneel. Hold ab wheel. Arms straight below chest.","Roll forward slowly. Back must NOT collapse.","Pull back using core only. Brace whole time."] },
    { name:"Decline Sit-Up",         equip:"bodyweight", tag:"Upper Abs",              note:"Add a plate for extra resistance.",                 howto:["Hook feet on decline. Arms crossed or hold plate.","Sit up fully — full range, not just a crunch.","Lower slowly. Decline adds resistance vs flat."] },
    { name:"Side Plank",             equip:"bodyweight", tag:"Obliques",               note:"Don't let your hip drop.",                         howto:["Lie on side. Prop on forearm. Stack feet.","Raise hips. Body forms straight line head to feet.","Hold. Switch sides. Don't let hips rotate or drop."] },
    { name:"Weighted Plank",         equip:"bodyweight", tag:"Full Core Stability",    note:"Plate on back. Squeeze everything.",               howto:["Forearm plank. Body perfectly straight.","Have someone place plate on upper back.","Squeeze glutes, abs and quads simultaneously."] },
    { name:"Dragon Flag",            equip:"bodyweight", tag:"Advanced Full Abs",      note:"Bruce Lee's favourite. Control the descent.",      howto:["Lie on bench. Grip behind head. Body rigid.","Raise legs and hips — shoulders stay on bench.","Lower entire body slowly. Don't touch lower back first."] },
  ]},
};

const MUSCLE_KEYS = ["CHEST","SHOULDERS","TRICEPS","BACK","BICEPS","QUADS","HAMSTRINGS","CALVES","ABS"];

export default function App() {
  const [view,    setView]    = useState("day");
  const [dayIdx,  setDayIdx]  = useState(0);
  const [musKey,  setMusKey]  = useState("CHEST");
  const [expanded, setExpanded] = useState(null);

  const day = DAYS[dayIdx];
  const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

  const ExCard = ({ ex, color, id }) => {
    const eq = EQUIP_ICON[ex.equip] || EQUIP_ICON.barbell;
    const isOpen = expanded === id;
    return (
      <div
        onClick={() => toggleExpand(id)}
        style={{
          background:"#FFFFFF", border:`1px solid ${isOpen ? color+"66" : "#EAEAF2"}`,
          borderLeft:`3px solid ${isOpen ? color : color+"44"}`,
          borderRadius:12, overflow:"hidden",
          boxShadow: isOpen ? `0 4px 20px ${color}18` : "none",
          cursor:"pointer", transition:"all 0.2s",
          marginBottom: 2,
        }}
      >
        {/* Main row */}
        <div style={{
          padding:"14px 16px",
          display:"grid", gridTemplateColumns:"44px 1fr 56px 80px 56px 28px",
          gap:10, alignItems:"center",
        }}>
          {/* Equipment badge */}
          <div style={{
            background: eq.bg, borderRadius:10,
            width:44, height:44,
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            fontSize:20, gap:1,
          }}>
            <span>{eq.icon}</span>
          </div>

          {/* Name + tag */}
          <div>
            <div style={{fontWeight:900, fontSize:13, color:"#111", marginBottom:3}}>{ex.name}</div>
            <div style={{display:"flex", alignItems:"center", gap:6, flexWrap:"wrap"}}>
              <span style={{background:color+"16",color:color,fontSize:8,fontWeight:900,letterSpacing:1.5,padding:"2px 7px",borderRadius:4}}>{ex.tag}</span>
              <span style={{background:eq.bg,color:eq.color,fontSize:8,fontWeight:800,letterSpacing:1,padding:"2px 7px",borderRadius:4}}>{eq.label}</span>
            </div>
          </div>

          <div style={{textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:900,color:color,lineHeight:1}}>{ex.sets}</div>
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

          {/* Expand arrow */}
          <div style={{
            fontSize:12, color: isOpen ? color : "#CCCCDD",
            transition:"transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            textAlign:"center", fontWeight:900,
          }}>▼</div>
        </div>

        {/* Expanded HOW TO */}
        {isOpen && (
          <div style={{
            borderTop:`1px solid ${color}22`,
            background:`${color}06`,
            padding:"14px 16px",
          }}>
            <div style={{fontSize:9,fontWeight:900,letterSpacing:3,color:color,marginBottom:10}}>HOW TO DO IT</div>
            <div style={{display:"flex", flexDirection:"column", gap:8}}>
              {ex.howto.map((step, i) => (
                <div key={i} style={{display:"flex", gap:10, alignItems:"flex-start"}}>
                  <div style={{
                    minWidth:22, height:22, borderRadius:"50%",
                    background:color, color:"#fff",
                    fontSize:10, fontWeight:900,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    marginTop:1,
                  }}>{i+1}</div>
                  <div style={{fontSize:12, color:"#444", lineHeight:1.6, fontWeight:500}}>{step}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:10, fontSize:11, color:"#AAA", fontStyle:"italic"}}>{ex.note}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{minHeight:"100vh", background:"#F2F2F7", color:"#111", fontFamily:"'Segoe UI',sans-serif"}}>

      {/* ── HEADER ── */}
      <div style={{background:"#FFFFFF", borderBottom:"1px solid #E0E0EA", padding:"0 18px"}}>
        <div style={{maxWidth:960, margin:"0 auto"}}>

          {/* DAY TABS */}
          <div style={{display:"flex",alignItems:"flex-end",gap:0,paddingTop:16,borderBottom:"1px solid #E0E0EA",overflowX:"auto"}}>
            <div style={{fontSize:9,color:"#BBBBCC",fontWeight:900,letterSpacing:3,paddingBottom:12,paddingRight:14,whiteSpace:"nowrap"}}>BY DAY</div>
            {DAYS.map((d,i)=>{
              const on = view==="day" && dayIdx===i;
              return(
                <button key={i} onClick={()=>{setView("day");setDayIdx(i);setExpanded(null);}} style={{
                  background: on ? d.color : "transparent",
                  color: on ? "#fff" : "#AAAABC",
                  border: on ? "none" : "1px solid #E0E0EA",
                  borderBottom: on ? "none" : "1px solid #E0E0EA",
                  padding:"9px 20px 11px", borderRadius:"8px 8px 0 0",
                  cursor:"pointer",fontWeight:900,fontSize:12,letterSpacing:2,
                  transition:"all 0.2s",whiteSpace:"nowrap",
                  marginBottom: on ? "-1px" : 0,
                }}>{d.label}</button>
              );
            })}
            <div style={{marginLeft:"auto",fontSize:9,color:"#DDDDEE",fontWeight:900,letterSpacing:2,paddingBottom:12,whiteSpace:"nowrap"}}>SUN · REST</div>
          </div>

          {/* MUSCLE TABS */}
          <div style={{display:"flex",alignItems:"flex-end",gap:0,paddingTop:10,borderBottom:"1px solid #E0E0EA",overflowX:"auto"}}>
            <div style={{fontSize:9,color:"#BBBBCC",fontWeight:900,letterSpacing:3,paddingBottom:10,paddingRight:14,whiteSpace:"nowrap"}}>BY MUSCLE</div>
            {MUSCLE_KEYS.map((m)=>{
              const mc = LIBRARY[m].color;
              const on = view==="muscle" && musKey===m;
              return(
                <button key={m} onClick={()=>{setView("muscle");setMusKey(m);setExpanded(null);}} style={{
                  background: on ? mc+"18" : "transparent",
                  color: on ? mc : "#AAAABC",
                  border: `1px solid ${on ? mc+"66" : "#E0E0EA"}`,
                  borderBottom: on ? `1px solid #F2F2F7` : `1px solid #E0E0EA`,
                  padding:"7px 14px 9px", borderRadius:"8px 8px 0 0",
                  cursor:"pointer",fontWeight:900,fontSize:10,letterSpacing:2,
                  transition:"all 0.2s",whiteSpace:"nowrap",marginRight:3,
                  marginBottom: on ? "-1px" : 0,
                }}>{m}</button>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{maxWidth:960, margin:"0 auto", padding:"24px 18px 52px"}}>

        {/* DAY VIEW */}
        {view==="day" && (
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <span style={{background:day.color,color:"#fff",fontSize:9,fontWeight:900,letterSpacing:3,padding:"3px 10px",borderRadius:4}}>{day.type}</span>
              <span style={{fontSize:22,fontWeight:900,color:"#111",letterSpacing:-0.5}}>{day.full}</span>
              <span style={{color:"#BBBBCC",fontSize:11,fontWeight:700}}>· 2 SETS · TAP TO SEE HOW</span>
            </div>

            {day.groups.map((g,gi)=>(
              <div key={gi} style={{marginBottom:22}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{width:3,height:20,background:g.color,borderRadius:2}}/>
                  <span style={{fontSize:10,fontWeight:900,letterSpacing:3,color:g.color}}>{g.muscle}</span>
                  <div style={{flex:1,height:1,background:"#E8E8F0"}}/>
                </div>
                {g.exercises.map((ex,ei) => (
                  <ExCard key={ei} ex={ex} color={g.color} id={`day-${gi}-${ei}`} />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* MUSCLE LIBRARY VIEW */}
        {view==="muscle" && (()=>{
          const lib = LIBRARY[musKey];
          return(
            <div>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
                <div style={{width:4,height:36,background:lib.color,borderRadius:2}}/>
                <div>
                  <div style={{fontSize:9,color:"#BBBBCC",fontWeight:900,letterSpacing:3}}>EXERCISE LIBRARY</div>
                  <div style={{fontSize:22,fontWeight:900,color:"#111",letterSpacing:-0.5}}>
                    {musKey} <span style={{color:lib.color,fontSize:12,fontWeight:700,letterSpacing:1}}>— {lib.exercises.length} EXERCISES · TAP TO SEE HOW</span>
                  </div>
                </div>
              </div>
              {lib.exercises.map((ex,i) => (
                <ExCard key={i} ex={{...ex,sets:"2",reps:"—",rest:"—"}} color={lib.color} id={`lib-${i}`} />
              ))}
            </div>
          );
        })()}

        {/* Footer */}
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