const scenarios = [
  // ─── PITCHING (8) ───────────────────────────────────────────────
  {
    id: "p01",
    difficulty: "rookie",
    type: "pitching",
    situation: {
      inning: 3,
      half: "top",
      outs: 1,
      runners: { first: true, second: false, third: false },
      score: { home: 2, away: 1 },
      count: { balls: 1, strikes: 1 },
    },
    archetypes: { batter: "Contact Hitter", pitcher: "Power Arm", runner: "Speed Threat", fielder: null },
    prompt:
      "1-1 count, Contact Hitter who rarely strikes out but doesn't pull the ball. Runner on first with speed. You're up one run. Do you attack the zone or pitch to contact?",
    choices: [
      { id: "a", text: "Elevate a fastball at the letters to get a swing and miss" },
      { id: "b", text: "Throw a sinker down and away — induce a ground ball double play" },
      { id: "c", text: "Bounce a curveball in the dirt and hope he chases" },
      { id: "d", text: "Intentional ball to get to your put-away count of 1-2" },
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    runsImpactCorrect: 1.2,
    runsImpactWrong: -0.8,
    explanationCorrect:
      "Contact hitters put the ball in play. A sinker down and away is their nightmare — weak grounders to the right side or a 4-6-3 double play kills the inning. Pitching to their tendency is elite sequencing.",
    explanationWrong:
      "Contact hitters rarely chase out of the zone, so trick pitches and elevated heat play right into their strength. The sinker ground ball is the correct play — turn their contact skill against them.",
  },
  {
    id: "p02",
    difficulty: "pro",
    type: "pitching",
    situation: {
      inning: 7,
      half: "top",
      outs: 1,
      runners: { first: false, second: true, third: false },
      score: { home: 3, away: 3 },
      count: { balls: 2, strikes: 2 },
    },
    archetypes: { batter: "Power Hitter", pitcher: "Crafty Lefty", runner: "Average Runner", fielder: null },
    prompt:
      "Full count, 7th inning, tie game. Power Hitter who crushes fastballs but chases breaking balls away. Runner on second. What do you throw?",
    choices: [
      { id: "a", text: "Four-seam fastball up and in — challenge him" },
      { id: "b", text: "Slider off the plate away — make him chase" },
      { id: "c", text: "Changeup low in the zone — surprise him with the speed change" },
      { id: "d", text: "Intentional walk to set up the double play" },
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -6,
    runsImpactCorrect: 1.5,
    runsImpactWrong: -1.8,
    explanationCorrect:
      "You've been told he chases breaking balls away. Full count, tie game — this is the moment to execute on that scouting. Slider off the edge, let him expand the zone. The setup all game was for this pitch.",
    explanationWrong:
      "Power hitters live for a fastball in a hitter's count. Up and in is one mistake from gone. The changeup can work but the slider away is his documented weakness. Use the scouting report.",
  },
  {
    id: "p03",
    difficulty: "rookie",
    type: "pitching",
    situation: {
      inning: 5,
      half: "bottom",
      outs: 2,
      runners: { first: false, second: false, third: false },
      score: { home: 4, away: 2 },
      count: { balls: 0, strikes: 0 },
    },
    archetypes: { batter: "Slap Hitter", pitcher: "Ground Ball Machine", runner: null, fielder: null },
    prompt:
      "First pitch of the at-bat. Slap hitter, no baserunners, 2 outs. You're up two. What's your approach?",
    choices: [
      { id: "a", text: "Throw a fastball right down the middle — challenge him early" },
      { id: "b", text: "Start with a sinker away — establish the outer third" },
      { id: "c", text: "Drop in a first-pitch curveball for an early strike" },
      { id: "d", text: "Waste a pitch to see what his eye looks like" },
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    runsImpactCorrect: 0.6,
    runsImpactWrong: -0.4,
    explanationCorrect:
      "Against a slap hitter, establish the outer third early. A sinker away forces weak contact to the pull side. Even if he makes contact, it's manageable. Control the at-bat from pitch one.",
    explanationWrong:
      "Middle-middle is a gift to any hitter. Slap hitters spray the ball — give them a lane away. Wasting a pitch puts you behind immediately. The outer edge sinker is disciplined pitching.",
  },
  {
    id: "p04",
    difficulty: "allstar",
    type: "pitching",
    situation: {
      inning: 9,
      half: "top",
      outs: 0,
      runners: { first: true, second: true, third: false },
      score: { home: 5, away: 4 },
      count: { balls: 1, strikes: 0 },
    },
    archetypes: { batter: "Cleanup Hitter", pitcher: "Closer", runner: "Tying Run", fielder: null },
    prompt:
      "9th inning, one-run lead, runners at first and second, nobody out. Cleanup hitter up in a 1-0 count. The tying run scores on any single. Your closer has elite command. What's the sequence?",
    choices: [
      { id: "a", text: "Four-seam up — try to get a fly ball and hope it's not a three-run shot" },
      { id: "b", text: "Work down in the zone aggressively — induce a ground ball double play" },
      { id: "c", text: "Issue the intentional walk, load the bases, set up the force at any base" },
      { id: "d", text: "Throw a high leg-kick slide step to freeze runners, then go inside fastball" },
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -6,
    runsImpactCorrect: 2.0,
    runsImpactWrong: -3.0,
    explanationCorrect:
      "9th inning, nobody out, two on — you need outs in bunches. Working down in the zone with a sinker or cutter sets up a ground ball double play. That's two outs with the force in place. Elite closers live in this moment.",
    explanationWrong:
      "Elevating to a cleanup hitter with runners on and a one-run lead is a game-losing mistake. The walk loads the bases but adds another threat. The double play ball down in the zone is the correct high-leverage call.",
  },
  {
    id: "p05",
    difficulty: "pro",
    type: "pitching",
    situation: {
      inning: 6,
      half: "top",
      outs: 0,
      runners: { first: false, second: false, third: false },
      score: { home: 2, away: 2 },
      count: { balls: 3, strikes: 2 },
    },
    archetypes: { batter: "Patient Walker", pitcher: "Strikeout Artist", runner: null, fielder: null },
    prompt:
      "Full count, tie game, Patient Walker who works every count deep. No runners. Do you risk a walk throwing your best pitch, or hit the corner and live with contact?",
    choices: [
      { id: "a", text: "Throw your best fastball — let him hit it, trust your defense" },
      { id: "b", text: "Back-door slider at the knee on the outer edge" },
      { id: "c", text: "Throw ball four — he's earned it, reset with the next hitter" },
      { id: "d", text: "High fastball — get a pop-up or swing through" },
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -6,
    runsImpactCorrect: 1.0,
    runsImpactWrong: -0.7,
    explanationCorrect:
      "The back-door slider hits the zone at the last moment — a patient hitter who's taken pitches all at-bat has to commit early and can be frozen. It's the strikeout pitch that looks like a ball and ends up a strike.",
    explanationWrong:
      "The Patient Walker is a trap. He wants you to groove something in a hitter's count. The back-door breaker fools the eye. Intentional walk in a tie game with nobody on is unnecessary gift.",
  },
  {
    id: "p06",
    difficulty: "allstar",
    type: "pitching",
    situation: {
      inning: 8,
      half: "bottom",
      outs: 2,
      runners: { first: false, second: true, third: false },
      score: { home: 1, away: 3 },
      count: { balls: 2, strikes: 1 },
    },
    archetypes: { batter: "Switch Hitter", pitcher: "Setup Man", runner: "Pinch Runner", fielder: null },
    prompt:
      "Down two in the 8th. Switch hitter, weaker from the right side. You're pitching left-handed. Runner on second, 2-1 count. Does handedness change your approach here?",
    choices: [
      { id: "a", text: "Attack inside — your lefty angle is toughest for right-handed batters" },
      { id: "b", text: "Go away exclusively — he can't turn on it from the right side" },
      { id: "c", text: "Treat it like any hitter — don't overweight the handedness" },
      { id: "d", text: "Get a ground ball to third — close off the scoring chance" },
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -6,
    runsImpactCorrect: 1.3,
    runsImpactWrong: -0.9,
    explanationCorrect:
      "Attacking inside against a weaker-side switch hitter exploits both the handedness mismatch and your arm angle. The inside pitch forces him to pull and makes his shorter side even shorter. That's two advantages stacked.",
    explanationWrong:
      "Going away is fine but doesn't maximize the lefty angle. The inside fastball with the natural ride from a southpaw is the toughest combination for a righty who's already weaker from that side.",
  },
  {
    id: "p07",
    difficulty: "rookie",
    type: "pitching",
    situation: {
      inning: 2,
      half: "top",
      outs: 1,
      runners: { first: false, second: false, third: false },
      score: { home: 0, away: 0 },
      count: { balls: 0, strikes: 2 },
    },
    archetypes: { batter: "Free Swinger", pitcher: "Veteran Starter", runner: null, fielder: null },
    prompt:
      "0-2 count, Free Swinger who expands the zone. What do you throw for the put-away pitch?",
    choices: [
      { id: "a", text: "Fastball right at the knees — get a called strike three" },
      { id: "b", text: "Waste pitch outside the zone, then put-away slider" },
      { id: "c", text: "Curveball in the dirt — make him fish" },
      { id: "d", text: "Back him off with an inside fastball then come back away" },
    ],
    correctAnswerId: "c",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    runsImpactCorrect: 0.5,
    runsImpactWrong: -0.3,
    explanationCorrect:
      "Free swingers chase pitches below the zone. A curveball buried in the dirt — especially 0-2 — is the textbook put-away pitch. He's already geared up for a fastball. The big break gets him every time.",
    explanationWrong:
      "Don't give away the free-swinger advantage by throwing anything catchable on 0-2. The bounce curve in the dirt is his exact weakness. Use it.",
  },
  {
    id: "p08",
    difficulty: "pro",
    type: "pitching",
    situation: {
      inning: 7,
      half: "bottom",
      outs: 1,
      runners: { first: true, second: false, third: false },
      score: { home: 4, away: 4 },
      count: { balls: 1, strikes: 1 },
    },
    archetypes: { batter: "Pull Hitter", pitcher: "Sinker-Slider", runner: "Basestealer", fielder: null },
    prompt:
      "Tie game, 7th. Pull hitter who sells out for the inside pitch. Runner on first is a base-stealing threat. Do you pitch from the stretch differently knowing he might go?",
    choices: [
      { id: "a", text: "Quick pitch with a slide step — kill the running game first" },
      { id: "b", text: "Throw a slider away — make the pull hitter reach, ignore the runner" },
      { id: "c", text: "Hold the runner with a pick-off look, then go away with the sinker" },
      { id: "d", text: "Pitch from the windup to throw off his timing — accept the stolen base risk" },
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -6,
    runsImpactCorrect: 1.4,
    runsImpactWrong: -1.1,
    explanationCorrect:
      "The pull hitter's weakness is the outer third. Throwing away forces him to reach and hit weak contact the other way. A stolen base puts him on second, but a middle-middle pitch trying to quick-pitch could land in the seats. Attack the batter first.",
    explanationWrong:
      "Quick pitching and windups distract you from the hitter. The slider away exploits the pull hitter's tendency. If he steals, he's on second with one out — still manageable. Don't let the runner steal the at-bat from you.",
  },

  // ─── BATTING (8) ────────────────────────────────────────────────
  {
    id: "b01",
    difficulty: "rookie",
    type: "batting",
    situation: {
      inning: 4,
      half: "bottom",
      outs: 1,
      runners: { first: false, second: true, third: false },
      score: { home: 1, away: 2 },
      count: { balls: 1, strikes: 0 },
    },
    archetypes: { batter: "Gap Hitter", pitcher: "Two-Pitch Arm", runner: "Slow Runner", fielder: null },
    prompt:
      "Runner on second, one out, down one run. Two-Pitch Arm who lives with fastball/slider. You're a Gap Hitter. 1-0 count. What's your plan?",
    choices: [
      { id: "a", text: "Sit fastball, drive it up the middle — score the runner" },
      { id: "b", text: "Take a pitch — work toward a walk and bring up a better hitter" },
      { id: "c", text: "Look away — expect the fastball away and drive it to right center" },
      { id: "d", text: "Bunt the runner to third and let the next hitter do it" },
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    runsImpactCorrect: 1.1,
    runsImpactWrong: -0.5,
    explanationCorrect:
      "1-0 count against a two-pitch arm means fastball is coming. Gap hitters shine in hitter's counts. Sit dead red, look middle-away, and drive the ball up the middle. The runner scores and you've turned the game around.",
    explanationWrong:
      "This is a premium hitter's count. Taking a pitch or bunting wastes leverage. Trust the fastball is coming and make solid contact. Gap hitters are built for this moment.",
  },
  {
    id: "b02",
    difficulty: "pro",
    type: "batting",
    situation: {
      inning: 6,
      half: "top",
      outs: 0,
      runners: { first: false, second: false, third: false },
      score: { home: 3, away: 3 },
      count: { balls: 0, strikes: 0 },
    },
    archetypes: { batter: "Leadoff Hitter", pitcher: "Crafty Veteran", runner: null, fielder: null },
    prompt:
      "Leadoff man leading off the 6th, tie game. Crafty Veteran who always works backwards — starts lefties off-speed, righties with cutters in. You're right-handed. What's your first-pitch approach?",
    choices: [
      { id: "a", text: "Take — he'll start with the cutter in, see how it reads" },
      { id: "b", text: "Attack first pitch — he knows you're patient, catch him off guard" },
      { id: "c", text: "Look inside and foul it off — don't commit to swinging early" },
      { id: "d", text: "Fake a bunt to draw the infield in, then look to drive the first fastball" },
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -6,
    runsImpactCorrect: 0.8,
    runsImpactWrong: -0.5,
    explanationCorrect:
      "You have scouting: cutters in against righties to start. Take the first pitch — see it, confirm the tendency. If it's a called strike, you're now ahead on information. Leading off the 6th means working the count matters more than free swinging.",
    explanationWrong:
      "Attacking blindly on first pitch goes against the scouting report. A cutter in jammed you. The take confirms the information and puts you in control of the at-bat from pitch two.",
  },
  {
    id: "b03",
    difficulty: "allstar",
    type: "batting",
    situation: {
      inning: 9,
      half: "bottom",
      outs: 2,
      runners: { first: false, second: false, third: true },
      score: { home: 2, away: 3 },
      count: { balls: 3, strikes: 2 },
    },
    archetypes: { batter: "Clutch Hitter", pitcher: "Hard Thrower", runner: "Tying Run", fielder: null },
    prompt:
      "Full count, 2 outs, 9th inning. Tying run on third. Hard Thrower who won't give in. He's thrown you three fastballs this at-bat. What do you look for?",
    choices: [
      { id: "a", text: "Sit heater — he's gone four-seam all at-bat, trust the pattern" },
      { id: "b", text: "Look breaking ball — he'll finally go off-speed in the biggest moment" },
      { id: "c", text: "No plan — just see ball, hit ball and react with quick hands" },
      { id: "d", text: "Look to go the other way and make contact — the run scores on a single anywhere" },
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -6,
    runsImpactCorrect: 2.0,
    runsImpactWrong: -2.0,
    explanationCorrect:
      "Hard Throwers go with their best pitch in 9th inning full-count situations. He's thrown three fastballs. He trusts it. The pattern is the pattern. Sit fastball, short compact swing, tie the game.",
    explanationWrong:
      "Breaking ball on a full count with a Hard Thrower in the 9th is a panic pitch. He challenges you with his best. Three fastballs already told you the story. React to what the data shows, not what fear suggests.",
  },
  {
    id: "b04",
    difficulty: "rookie",
    type: "batting",
    situation: {
      inning: 3,
      half: "bottom",
      outs: 0,
      runners: { first: true, second: false, third: false },
      score: { home: 0, away: 1 },
      count: { balls: 0, strikes: 0 },
    },
    archetypes: { batter: "Number Two Hitter", pitcher: "Fly Ball Pitcher", runner: "Speed Threat", fielder: null },
    prompt:
      "Runner on first, nobody out. Fly Ball Pitcher who gives up lots of pop-ups. You're hitting second. Down one. What's the right approach?",
    choices: [
      { id: "a", text: "Bunt the runner to second — standard number two hitter move" },
      { id: "b", text: "Hit-and-run — put the ball in play and move the runner" },
      { id: "c", text: "Look for a pitch to drive — he allows fly balls, stay up the middle" },
      { id: "d", text: "Work a walk — get two on for the middle of the order" },
    ],
    correctAnswerId: "d",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    runsImpactCorrect: 0.9,
    runsImpactWrong: -0.4,
    explanationCorrect:
      "Fly Ball Pitcher with nobody out means a sacrifice bunt is risky — a pop-up kills the runner. Working a walk puts two on with nobody out for the heart of the order. Let the pitcher's tendency work against him.",
    explanationWrong:
      "A bunt against a fly ball pitcher is doubly dangerous — pop-ups on bunt attempts are a nightmare. The walk and hit-and-run make sense, but loading the bases for the middle of the order is the highest-value play here.",
  },
  {
    id: "b05",
    difficulty: "pro",
    type: "batting",
    situation: {
      inning: 5,
      half: "top",
      outs: 2,
      runners: { first: false, second: false, third: false },
      score: { home: 2, away: 2 },
      count: { balls: 2, strikes: 1 },
    },
    archetypes: { batter: "Low-Ball Hitter", pitcher: "Filthy Curveball", runner: null, fielder: null },
    prompt:
      "2-1 count, tie game. Pitcher's best pitch is a 12-6 curveball that drops off the table. You're a Low-Ball Hitter. Does that matchup information change how you approach this count?",
    choices: [
      { id: "a", text: "Look fastball only — don't expand to the curveball even if it starts in the zone" },
      { id: "b", text: "Look for the curve early — catch it at the top of its arc before it drops" },
      { id: "c", text: "Take a pitch — force him to 3-1 and get into a fastball count" },
      { id: "d", text: "Expand to the low curve — you're a low-ball hitter, lean into it" },
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -6,
    runsImpactCorrect: 1.0,
    runsImpactWrong: -0.7,
    explanationCorrect:
      "Low-ball hitters are dangerous when they catch the curve at the top of its break before it dives. You have the swing for it. Don't sit pure fastball and let a hittable curveball go by when you've got the bat for it.",
    explanationWrong:
      "Taking to a 3-1 count works in theory but wastes your advantage. A low-ball hitter who catches the curveball before the drop is lethal. The breaking ball at the top of the arc is actually more hittable than a fastball for your type.",
  },
  {
    id: "b06",
    difficulty: "allstar",
    type: "batting",
    situation: {
      inning: 8,
      half: "top",
      outs: 1,
      runners: { first: true, second: true, third: false },
      score: { home: 4, away: 3 },
      count: { balls: 1, strikes: 2 },
    },
    archetypes: { batter: "Power Bat", pitcher: "Setup Man", runner: "Base Runners", fielder: null },
    prompt:
      "1-2 count, 8th inning, down one. Two on. Setup Man has elite slider that he throws 70% on two-strike counts. Do you look slider or protect the plate?",
    choices: [
      { id: "a", text: "Protect the plate — fight off anything close, wait for a mistake" },
      { id: "b", text: "Commit to the slider — catch it early and drive it" },
      { id: "c", text: "Shorten your swing, look for a fastball and adjust to off-speed" },
      { id: "d", text: "Look away only — his slider works in, not out" },
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -6,
    runsImpactCorrect: 1.8,
    runsImpactWrong: -1.2,
    explanationCorrect:
      "70% slider on two-strike counts is a known tendency — commit to it. Protecting the plate against an elite slider usually ends with a strikeout or weak contact. You know it's coming, use the information.",
    explanationWrong:
      "Protecting the plate is the reactive, defensive approach. You have concrete data: 70% slider in this situation. Elite hitters use data to look for the pitch rather than react to everything. Lock in on the slider.",
  },
  {
    id: "b07",
    difficulty: "pro",
    type: "batting",
    situation: {
      inning: 4,
      half: "bottom",
      outs: 2,
      runners: { first: false, second: false, third: false },
      score: { home: 1, away: 1 },
      count: { balls: 0, strikes: 1 },
    },
    archetypes: { batter: "Eight Hitter", pitcher: "Command Specialist", runner: null, fielder: null },
    prompt:
      "0-1 count, 8 hitter. Command Specialist who hits his spots. You're the rally killer spot. What's the approach for the rest of the at-bat?",
    choices: [
      { id: "a", text: "Look for one pitch in one zone, swing only if it's there" },
      { id: "b", text: "Take every close pitch — make him earn it with perfect execution" },
      { id: "c", text: "Be aggressive — shorten the at-bat before he carves you up further" },
      { id: "d", text: "Go up the middle on anything close — put the ball in play" },
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -6,
    runsImpactCorrect: 0.6,
    runsImpactWrong: -0.5,
    explanationCorrect:
      "Against a Command Specialist, discipline wins. Pick your pitch, pick your zone, and only swing if it's there. He'll paint corners, but even elite command means he misses sometimes. Being selective forces him to be perfect.",
    explanationWrong:
      "Taking every pitch gives him called strikes. Being aggressive plays into his game — he commands every pitch. Zone discipline at one specific area forces him to miss eventually.",
  },
  {
    id: "b08",
    difficulty: "rookie",
    type: "batting",
    situation: {
      inning: 1,
      half: "top",
      outs: 0,
      runners: { first: false, second: false, third: false },
      score: { home: 0, away: 0 },
      count: { balls: 0, strikes: 0 },
    },
    archetypes: { batter: "Leadoff Hitter", pitcher: "Unknown Arm", runner: null, fielder: null },
    prompt:
      "First at-bat of the game. Unknown pitcher — no scouting report. First pitch. What do you do?",
    choices: [
      { id: "a", text: "Swing at anything in the zone — set the aggressive tone" },
      { id: "b", text: "Take the first pitch no matter what — get information" },
      { id: "c", text: "Look for a fastball belt-high and middle — take anything else" },
      { id: "d", text: "Bunt for a hit — catch the defense off guard" },
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    runsImpactCorrect: 0.4,
    runsImpactWrong: -0.2,
    explanationCorrect:
      "No scouting report means take the first pitch. See the arm slot, the spin on his fastball, the movement. You're getting information that the entire lineup will use. One pitch seen is a gift to your team.",
    explanationWrong:
      "Swinging early against an unknown arm is guessing. The first pitch is free information — velocity, movement, angle. Take it, absorb it, and compete smarter from pitch two.",
  },

  // ─── DEFENSE (5) ────────────────────────────────────────────────
  {
    id: "d01",
    difficulty: "rookie",
    type: "defense",
    situation: {
      inning: 7,
      half: "top",
      outs: 1,
      runners: { first: false, second: true, third: false },
      score: { home: 3, away: 3 },
      count: { balls: 0, strikes: 0 },
    },
    archetypes: { batter: "Ground Ball Machine", pitcher: "Sinker Specialist", runner: "Average Runner", fielder: "Third Baseman" },
    prompt:
      "Runner on second, one out, tie game. Ground ball hitter, sinker pitcher. Where does the third baseman play?",
    choices: [
      { id: "a", text: "Normal depth — defend the line and allow for range" },
      { id: "b", text: "In on the grass — concede the extra base hit, take the run away" },
      { id: "c", text: "Deep in the hole — maximum range on slow rollers" },
      { id: "d", text: "Shade toward second — anticipate a ball hit up the middle" },
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    runsImpactCorrect: 1.0,
    runsImpactWrong: -0.8,
    explanationCorrect:
      "Tie game, runner on second, one out. Coming in on the grass means a slow grounder gets fielded and the throw to first beats the run scoring. It's a concede-and-win play — trade the extra base hit risk for the out at first.",
    explanationWrong:
      "Normal depth doesn't take the run away on a slow roller in the infield. Coming in on the grass is the correct move — get the out at first before the run scores from second.",
  },
  {
    id: "d02",
    difficulty: "pro",
    type: "defense",
    situation: {
      inning: 8,
      half: "top",
      outs: 0,
      runners: { first: true, second: false, third: false },
      score: { home: 5, away: 4 },
      count: { balls: 0, strikes: 0 },
    },
    archetypes: { batter: "Speed Threat", pitcher: "Starter", runner: "Speed Threat", fielder: "First Baseman" },
    prompt:
      "Runner on first, nobody out, up one. Speed Threat at the plate. First baseman, where do you hold?",
    choices: [
      { id: "a", text: "Hold the runner on first — stay right on the bag" },
      { id: "b", text: "Play off the bag in normal depth — extra base coverage" },
      { id: "c", text: "Cheat toward the hole — speed threats pull the ball" },
      { id: "d", text: "Hold until the windup, then break to normal depth" },
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -6,
    runsImpactCorrect: 1.2,
    runsImpactWrong: -0.9,
    explanationCorrect:
      "Speed threat on first with nobody out and a one-run lead — hold him. If he's on second with nobody out, a sac fly ties the game. Holding takes away the easy steal. Give up some range, keep the runner honest.",
    explanationWrong:
      "Playing off the bag with a speed threat is a guaranteed stolen base. That puts the tying run in scoring position with nobody out. The range you lose is worth it. Hold the bag.",
  },
  {
    id: "d03",
    difficulty: "allstar",
    type: "defense",
    situation: {
      inning: 9,
      half: "top",
      outs: 2,
      runners: { first: false, second: false, third: true },
      score: { home: 2, away: 2 },
      count: { balls: 0, strikes: 0 },
    },
    archetypes: { batter: "Contact Hitter", pitcher: "Closer", runner: "Tying Run", fielder: "Outfield" },
    prompt:
      "Two outs, runner on third, tie game in the 9th. Contact hitter up. Outfield alignment — how do you play?",
    choices: [
      { id: "a", text: "Standard depth — normal positioning for the hitter" },
      { id: "b", text: "Shallow — cut off a shallow fly ball that might score the runner" },
      { id: "c", text: "Deep — maximize range on well-struck balls, run doesn't matter" },
      { id: "d", text: "Shift left — contact hitter goes the other way in big spots" },
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -6,
    runsImpactCorrect: 1.5,
    runsImpactWrong: -1.5,
    explanationCorrect:
      "Two outs, tie game, runner scores easily on any fly ball from deep. Shallow outfield takes away the shallow sac fly. If he hits it over your head, the inning is over anyway. Contest the base hit, not the homer.",
    explanationWrong:
      "Deep outfield gives up shallow fly balls that score the runner. Deep positioning only makes sense when a home run would put the game out of reach — here it's the opposite situation. Play shallow.",
  },
  {
    id: "d04",
    difficulty: "pro",
    type: "defense",
    situation: {
      inning: 5,
      half: "bottom",
      outs: 1,
      runners: { first: true, second: true, third: false },
      score: { home: 2, away: 2 },
      count: { balls: 0, strikes: 0 },
    },
    archetypes: { batter: "Contact Hitter", pitcher: "Sinker Specialist", runner: "Slow Runner", fielder: "Infield" },
    prompt:
      "Runners on first and second, one out. Infield plays: do you look for the double play or go for the sure out at first?",
    choices: [
      { id: "a", text: "Double play depth — take the two-for-one if it's there" },
      { id: "b", text: "Normal depth — take what's given, don't overplay the DP" },
      { id: "c", text: "In on the grass — get the lead runner if the ball is slow enough" },
      { id: "d", text: "Play the corners in, middle IF normal" },
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -6,
    runsImpactCorrect: 1.3,
    runsImpactWrong: -0.8,
    explanationCorrect:
      "Sinker pitcher, contact hitter, one out. The double play is absolutely in play. Get back to double play depth — you need two outs, not one. The sinker induces exactly the ground ball that turns this inning around.",
    explanationWrong:
      "Playing in surrenders the double play opportunity. With a sinker specialist on the mound against a contact hitter, the double play is the smart defensive call. Two outs are worth the risk.",
  },
  {
    id: "d05",
    difficulty: "rookie",
    type: "defense",
    situation: {
      inning: 6,
      half: "top",
      outs: 0,
      runners: { first: false, second: false, third: false },
      score: { home: 3, away: 2 },
      count: { balls: 0, strikes: 0 },
    },
    archetypes: { batter: "Pull Hitter", pitcher: "Fly Ball Pitcher", runner: null, fielder: "Outfield" },
    prompt:
      "Pull hitter, fly ball pitcher, nobody on. Up one. How does the right fielder adjust?",
    choices: [
      { id: "a", text: "Shade toward the line — pull hitters go down the line" },
      { id: "b", text: "Shade toward center — pull hitters hook the ball middle-left" },
      { id: "c", text: "Play standard depth — don't overshift based on one tendency" },
      { id: "d", text: "Play shallow — fly ball pitcher means shorter flies" },
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    runsImpactCorrect: 0.5,
    runsImpactWrong: -0.3,
    explanationCorrect:
      "A right-handed pull hitter sends the ball to left-center. The right fielder shading toward center covers the gap. The line is less likely than the gap — don't overplay the obvious.",
    explanationWrong:
      "Pull hitters hook it to center gap, not down the right field line. Shading toward the line leaves the gap exposed. Shade toward center and cover where the ball actually goes.",
  },

  // ─── BASERUNNING (4) ────────────────────────────────────────────
  {
    id: "br01",
    difficulty: "rookie",
    type: "baserunning",
    situation: {
      inning: 6,
      half: "top",
      outs: 1,
      runners: { first: false, second: true, third: false },
      score: { home: 3, away: 3 },
      count: { balls: 0, strikes: 0 },
    },
    archetypes: { batter: "Contact Hitter", pitcher: "Sinker Specialist", runner: "Average Runner", fielder: "Right Fielder" },
    prompt:
      "Runner on second, one out, tie game. Contact hitter hits a single to right. Right fielder is charging. Do you wave the runner in or hold at third?",
    choices: [
      { id: "a", text: "Wave him in — the RF is charging, the angle is bad" },
      { id: "b", text: "Hold at third — one run doesn't win it, don't risk the out" },
      { id: "c", text: "Send him and hope for a throw — force the defense to make a play" },
      { id: "d", text: "Hold until the RF fields it cleanly, then decide in real time" },
    ],
    correctAnswerId: "d",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    runsImpactCorrect: 0.9,
    runsImpactWrong: -0.7,
    explanationCorrect:
      "The third base coach reads the play as it develops. When the RF charges hard, the throw angle to home is difficult. Waiting to see if the catch is clean gives you the real-time read you need before committing the runner.",
    explanationWrong:
      "Waving in blind without reading the fielder's momentum is guessing. The decision must be made watching the play. Smart baserunning means reading the throw angle before the ball is fielded.",
  },
  {
    id: "br02",
    difficulty: "pro",
    type: "baserunning",
    situation: {
      inning: 7,
      half: "bottom",
      outs: 0,
      runners: { first: true, second: false, third: false },
      score: { home: 2, away: 3 },
      count: { balls: 1, strikes: 1 },
    },
    archetypes: { batter: "Power Hitter", pitcher: "Soft Tosser", runner: "Speed Threat", fielder: null },
    prompt:
      "Speed Threat on first, Power Hitter at the plate, down one in the 7th. Soft Tosser on the mound. Do you run?",
    choices: [
      { id: "a", text: "Run on 1-1 — the soft tosser's slow delivery gives you the extra step" },
      { id: "b", text: "Hold — power hitter at the plate, don't kill a potential rally" },
      { id: "c", text: "Run on 3-1 if you get there — maximize the fastball count window" },
      { id: "d", text: "Hit-and-run — the soft tosser can't throw through a gap" },
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -6,
    runsImpactCorrect: 1.2,
    runsImpactWrong: -1.0,
    explanationCorrect:
      "Power hitter at the plate in a run-scoring situation — don't run. A home run scores from first. A stolen base attempt that gets the runner thrown out erases the best bat in the lineup from the RBI count. Hold.",
    explanationWrong:
      "Running with a Power Hitter at the plate is a cardinal baserunning sin. If he hits it out, the runner scores anyway. If he's thrown out, the Power Hitter loses his RBI shot. Let the big bat work.",
  },
  {
    id: "br03",
    difficulty: "allstar",
    type: "baserunning",
    situation: {
      inning: 9,
      half: "bottom",
      outs: 1,
      runners: { first: false, second: false, third: false },
      score: { home: 1, away: 2 },
      count: { balls: 0, strikes: 0 },
    },
    archetypes: { batter: "Speed Threat", pitcher: "Closer", runner: null, fielder: null },
    prompt:
      "Down one, 9th inning. Speed Threat leads off. Closer with a big leg kick. Do you have a baserunning directive for when Speed Threat reaches?",
    choices: [
      { id: "a", text: "Run on first move — the leg kick is exploitable" },
      { id: "b", text: "Take the extra base on any hit to the outfield gap" },
      { id: "c", text: "Wait for an explicit green light from the bench" },
      { id: "d", text: "Look to go first to third on any base hit to right" },
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -6,
    runsImpactCorrect: 1.4,
    runsImpactWrong: -1.0,
    explanationCorrect:
      "A big leg kick means a long delivery time to the plate. That's a steal opportunity — run on first move, get a jump, and the catcher doesn't have time. Exploiting a mechanical tell is elite baserunning IQ.",
    explanationWrong:
      "Waiting for a green light or playing it conservative with a big leg kick on the mound is wasted intelligence. When a pitcher gives you a tell, you take it. That stolen base changes the game.",
  },
  {
    id: "br04",
    difficulty: "pro",
    type: "baserunning",
    situation: {
      inning: 5,
      half: "top",
      outs: 2,
      runners: { first: false, second: true, third: false },
      score: { home: 2, away: 2 },
      count: { balls: 0, strikes: 0 },
    },
    archetypes: { batter: "Contact Hitter", pitcher: "Sinker Specialist", runner: "Average Runner", fielder: "Shortstop" },
    prompt:
      "Runner on second, two outs, tie game. Contact hitter up. Two outs — do you have the runner running on contact?",
    choices: [
      { id: "a", text: "Runner runs on contact — two outs, you have to go" },
      { id: "b", text: "Hold — wait to see if the ball gets through the infield" },
      { id: "c", text: "Only run if the ball is hit to the right side" },
      { id: "d", text: "Run only if the shortstop cheats toward the bag" },
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -6,
    runsImpactCorrect: 1.0,
    runsImpactWrong: -0.8,
    explanationCorrect:
      "Two outs means the runner goes on contact every time — no hesitation. If you hold and the ball gets through, the runner might not score. Running on contact eliminates the read and maximizes scoring chances.",
    explanationWrong:
      "Holding with two outs is a fundamental mistake. Two outs means full sprint on contact. By the time you read if it gets through, you've lost your scoring chance. Go on contact.",
  },
];

export default scenarios;
