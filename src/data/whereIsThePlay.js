// 30 Where's The Play situations
// Existing 15: 5 rookie + 6 pro + 4 allstar
// New 15: 5 rookie + 6 pro + 4 allstar (matches the original mix)

export const whereIsThePlay = [
  // ── ROOKIE (5) ──────────────────────────────────────────────

  {
    id: "wtp-r1",
    difficulty: "rookie",
    type: "defense",
    runnerRequirements: { first: true },
    situation: "Runner on first base. The batter hits a fly ball to right field. The right fielder catches it for the first out.",
    prompt: "The runner on first takes off. Where does the right fielder throw?",
    choices: [
      { id: "a", text: "Throw to second base to hold the runner" },
      { id: "b", text: "Throw to first base" },
      { id: "c", text: "Throw directly home" },
      { id: "d", text: "Hold the ball — the out is already recorded" }
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    explanationCorrect: "The runner tagged and is heading to second. Your right fielder throws to second to try to throw him out, or at least keep him from advancing further. First base is empty and home is not threatened — second is the right target.",
    explanationWrong: "When a runner tags and tries to advance after a caught fly ball, throw to the base they're running to. The runner is heading to second, so that's your throw. Throwing home or to first wastes the play."
  },

  {
    id: "wtp-r2",
    difficulty: "rookie",
    type: "baserunning",
    runnerRequirements: { third: true },
    situation: "You're on third base with one out. The batter hits a deep fly ball to left field. The left fielder is drifting back to catch it.",
    prompt: "Do you tag up and try to score after the catch?",
    choices: [
      { id: "a", text: "Yes — tag up and run home after the catch" },
      { id: "b", text: "No — stay on third, it's too risky" },
      { id: "c", text: "Run as soon as the ball is hit, don't wait for the catch" },
      { id: "d", text: "Tag up but only go halfway, then return to third" }
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    explanationCorrect: "Tag up and go! A deep fly to left gives you time to score after the catch. With one out, a run on the board is worth the chance. Tag with your foot on third the moment the ball hits the fielder's glove, then run.",
    explanationWrong: "A deep fly ball to the outfield is almost always a tag-up opportunity from third. You don't need a perfect throw — the fielder has to catch it, set, and throw all the way home. With one out, you can't afford to strand a runner at third."
  },

  {
    id: "wtp-r3",
    difficulty: "rookie",
    type: "defense",
    runnerRequirements: { anyRunner: true },
    situation: "Bases loaded, one out. The batter hits a sharp ground ball right to the shortstop.",
    prompt: "What's the easiest out the shortstop should go for?",
    choices: [
      { id: "a", text: "Throw home to get the runner scoring from third" },
      { id: "b", text: "Throw to second for the double play" },
      { id: "c", text: "Throw to first for the sure out" },
      { id: "d", text: "Tag second, then throw to first for two" }
    ],
    correctAnswerId: "c",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    explanationCorrect: "With the bases loaded, the runner from third will score no matter what — they're already moving. The sure out here is first base. Don't gamble on a force at home; take the guaranteed out and limit the damage.",
    explanationWrong: "The runner from third is going to score on this play — there's no stopping it with a slow shortstop throw home. The goal is to get an out, not give up extra outs chasing a runner who's already scoring. First base is always the safe play on a ground ball."
  },

  {
    id: "wtp-r4",
    difficulty: "rookie",
    type: "baserunning",
    runnerRequirements: { first: true },
    situation: "You're on first base. The batter hits a ground ball to the second baseman.",
    prompt: "What do you do?",
    choices: [
      { id: "a", text: "Run hard to second — force the fielder to make a play" },
      { id: "b", text: "Slow down and see what happens" },
      { id: "c", text: "Stop between first and second" },
      { id: "d", text: "Run back to first to avoid the double play" }
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    explanationCorrect: "Run hard! On a ground ball with a force play, you HAVE to run. You're already forced off first base because the batter is running to first. Running hard forces the fielder to make two throws quickly — you might break up the double play, or cause an error.",
    explanationWrong: "On any ground ball with a force play, you have no choice but to run. The batter's running to first means you're forced off. Slowing down or stopping actually makes the double play easier — the second baseman has all the time in the world to step on second and throw to first."
  },

  {
    id: "wtp-r5",
    difficulty: "rookie",
    type: "defense",
    runnerRequirements: { second: true },
    situation: "Runner on second base. The batter hits a single to center field. The runner on second is running hard and rounds third.",
    prompt: "The center fielder has the ball. The runner is deciding whether to score. What should the center fielder do?",
    choices: [
      { id: "a", text: "Throw directly home as hard as possible" },
      { id: "b", text: "Throw to the cutoff man (the shortstop)" },
      { id: "c", text: "Throw to second to hold the batter at first" },
      { id: "d", text: "Hold the ball and see what the runner does" }
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    explanationCorrect: "Hit the cutoff man. The shortstop is positioned between center field and home plate to relay the throw. A throw directly home from deep center often sails wide or up the line. The relay man can redirect a perfect throw to the catcher much faster and more accurately.",
    explanationWrong: "Throwing directly home from deep center is usually a mistake. The distance is too far and throws go wild. That's why teams use a relay man — the shortstop stands in between and redirects the throw to give the catcher the best chance to make the tag."
  },

  // ── PRO (6) ──────────────────────────────────────────────────

  {
    id: "wtp-p1",
    difficulty: "pro",
    type: "defense",
    runnerRequirements: { first: true },
    situation: "Runner on first, two outs. The batter hits a rocket into the right-center gap. The runner on first is off with the pitch and running hard.",
    prompt: "The right fielder runs it down in the gap. The runner will easily score — you're trying to limit damage. Where does the right fielder throw?",
    choices: [
      { id: "a", text: "Throw to the relay man cutting off in shallow right" },
      { id: "b", text: "Try to gun down the runner at the plate directly" },
      { id: "c", text: "Throw to second base" },
      { id: "d", text: "Throw to third to hold the batter at second" }
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 6,
    iqDeltaWrong: -4,
    explanationCorrect: "With two outs and the runner already home, the goal is to hold the batter to a double. A relay throw — outfielder to cutoff man to the bag — is more accurate and faster than a direct heave from the gap. The cutoff intercepts and redirects the throw to maximize control.",
    explanationWrong: "Two outs, run already scores — now it's about limiting the batter. Direct throws from the gap with two outs almost always sail wide. Use the relay man to keep the throw on a string and hold the batter at second. Don't chase the run that's already gone."
  },

  {
    id: "wtp-p2",
    difficulty: "pro",
    type: "baserunning",
    runnerRequirements: { third: true },
    situation: "First and third, one out. A fly ball is hit to shallow right field. The right fielder is charging hard and will barely catch it.",
    prompt: "You're the runner on third. Do you tag and try to score?",
    choices: [
      { id: "a", text: "Yes — shallow fly to right, go on the catch" },
      { id: "b", text: "No — shallow right is too close, the throw will get you" },
      { id: "c", text: "Bluff halfway and see if the right fielder throws to second" },
      { id: "d", text: "Only go if the right fielder bobbles it" }
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 6,
    iqDeltaWrong: -4,
    explanationCorrect: "Stay put. A shallow fly to right is the one fly ball you DON'T tag on from third — the right fielder is already positioned close, facing home plate, and has momentum going forward. Their throw home will be short and accurate. Wait for a deeper ball.",
    explanationWrong: "Most fly balls let you tag from third, but shallow right field is the exception. The right fielder catches it moving toward home with a short throw. You'll be out by 20 feet. This is a great IQ play: knowing when NOT to run is just as important as knowing when to go."
  },

  {
    id: "wtp-p3",
    difficulty: "pro",
    type: "baserunning",
    runnerRequirements: { second: true },
    situation: "You're on second base, one out. The batter hits a ground ball to the first baseman who is playing behind the bag.",
    prompt: "The first baseman fields it cleanly. Do you advance to third?",
    choices: [
      { id: "a", text: "Yes — go to third, the first baseman is moving away from you" },
      { id: "b", text: "No — hold at second, it's a routine play" },
      { id: "c", text: "Wait to see if the first baseman throws to the pitcher covering" },
      { id: "d", text: "Only go if the first baseman takes time setting his feet" }
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 6,
    iqDeltaWrong: -4,
    explanationCorrect: "Go to third! When the first baseman fields a ground ball, they must throw to the pitcher covering first. During that exchange, they can't pivot and throw to third. You break the moment the ball passes second base. The pitcher covering first has no chance to get you.",
    explanationWrong: "The first baseman fielding a ball behind the bag creates a perfect opportunity to take third. They must throw to the pitcher covering first — and neither of them can then throw to third in time. This is a 'free base' if you read it correctly and get a good jump."
  },

  {
    id: "wtp-p4",
    difficulty: "pro",
    type: "defense",
    runnerRequirements: { second: true },
    situation: "Runner on second, two outs. The batter hits a sharp single to right field. The runner on second rounds third and the third base coach waves him home.",
    prompt: "Right fielder has the ball 150 feet from home plate. Strong-armed outfielder. What's the play?",
    choices: [
      { id: "a", text: "Throw directly home — strong arm, good angle, go for it" },
      { id: "b", text: "Hit the cutoff, let the relay man decide" },
      { id: "c", text: "Throw behind the runner to second to hold the batter" },
      { id: "d", text: "Check the speed of the runner and then decide" }
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 6,
    iqDeltaWrong: -4,
    explanationCorrect: "This is one of the few times you bypass the cutoff. Strong arm, short right field line angle (throw is on a direct path to home), two outs — you need the out. A clean, one-hop throw home beats the relay by a half-second. Trust the arm and make the throw.",
    explanationWrong: "Context matters here. Right field to home with a strong arm and a direct line is a makeable throw. Using the relay adds a catch-and-transfer that costs time. With two outs and a runner scoring the go-ahead run, trust a great arm and throw directly home."
  },

  {
    id: "wtp-p5",
    difficulty: "pro",
    type: "baserunning",
    runnerRequirements: { first: true },
    situation: "You're the runner on first with nobody out. The batter hits a double-play ground ball — right at the shortstop, who fields it perfectly and is about to flip to second.",
    prompt: "You're running hard to second. The second baseman is about to catch the flip. What do you do?",
    choices: [
      { id: "a", text: "Slide hard into second base to break up the double play" },
      { id: "b", text: "Slow down and accept the double play" },
      { id: "c", text: "Slide wide around the bag to avoid the tag" },
      { id: "d", text: "Peel off and get in a rundown to buy time" }
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 6,
    iqDeltaWrong: -4,
    explanationCorrect: "Slide hard, but legally — make contact with the bag and don't go out of the baseline to hit the fielder. A hard legitimate slide forces the second baseman to rush their throw, potentially sailing it wide of first. Even if you're out, breaking up the relay is worth the try.",
    explanationWrong: "Never give in on a double play if you can make the fielder rush. A hard legal slide makes the second baseman alter their footwork and their throw. You'll be out, but your job is to give the batter a chance. Slowing down or stopping hands the other team two easy outs."
  },

  {
    id: "wtp-p6",
    difficulty: "pro",
    type: "defense",
    runnerRequirements: { anyRunner: true },
    situation: "Bases loaded, one out. The infield is playing back (regular depth). The batter hits a medium-pace ground ball to the third baseman.",
    prompt: "Third baseman fields it cleanly. Where's the play?",
    choices: [
      { id: "a", text: "Step on third and throw to first for the double play" },
      { id: "b", text: "Throw home to cut off the run scoring from third" },
      { id: "c", text: "Throw to second and let the second baseman decide" },
      { id: "d", text: "Take the sure out at first" }
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 6,
    iqDeltaWrong: -4,
    explanationCorrect: "Third baseman steps on third (force out), then fires to first for the double play — that's 5-3. It's the fastest double play in baseball. The runner from third scores but you get two outs for one. Take two outs every time over stopping one run.",
    explanationWrong: "The 5-3 double play (third to first) is the cleanest out in baseball with the bases loaded. Throwing home only gets one out and keeps the bases loaded with the same number of outs. Two outs for one run is always the trade you make when you can get it."
  },

  // ── ALL-STAR (4) ──────────────────────────────────────────────

  {
    id: "wtp-a1",
    difficulty: "allstar",
    type: "defense",
    runnerRequirements: { third: true },
    situation: "Tie game, bottom of the 9th. Runner on third, one out. Infield drawn in. The batter hits a slow chopper directly at the pitcher, who fields it 45 feet from home.",
    prompt: "Pitcher has the ball. Runner on third is breaking home. What's the play?",
    choices: [
      { id: "a", text: "Throw home — you have time, it's a 45-foot throw" },
      { id: "b", text: "Take the sure out at first — don't risk a wild throw home" },
      { id: "c", text: "Fake home, then throw to first" },
      { id: "d", text: "Eat the ball — one out to play for" }
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -5,
    explanationCorrect: "Throw home. With the infield in and the pitcher only 45 feet away, you have a clear look at the catcher's glove. A slow chopper like this means the pitcher has time to set and throw. Taking the out at first lets the run score and loses you the game. In a tie game, the run prevention is the entire point of drawing the infield in.",
    explanationWrong: "This is exactly what drawing the infield in is for — to have a play at the plate on slow grounders. Taking first base is the 'safe' choice that actually loses you the game. With 45 feet to throw and a stationary catcher as your target, a composed pitcher makes this throw cleanly. The risk is worth it."
  },

  {
    id: "wtp-a2",
    difficulty: "allstar",
    type: "defense",
    runnerRequirements: { first: true },
    situation: "Runner on first, nobody out. The batter hits a rocket into the left-center gap — clearly a double. The runner on first is fast and rounds second. Your left fielder hits the cutoff man (second baseman) in shallow left-center.",
    prompt: "Cutoff man has the ball. Runner from first is at third and stopping. Batter rounds first and takes a turn. What's the call?",
    choices: [
      { id: "a", text: "Hold the ball — no play exists" },
      { id: "b", text: "Throw to third to try to get the aggressive runner" },
      { id: "c", text: "Throw to second to get the batter trying to stretch" },
      { id: "d", text: "Fake to third, then turn and throw to second" }
    ],
    correctAnswerId: "d",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -5,
    explanationCorrect: "Fake to third, throw to second. The runner at third is already safe. But the batter took a big turn and is still moving. A pump-fake freezes the runner at third AND draws the batter into not retreating — now you've got them doubled off second. This is elite baseball IQ: creating a play that didn't exist by using deception.",
    explanationWrong: "The fake is the key. Throwing hard to third when the runner is already safe gives up your chance at the batter. Throwing directly to second without the fake tips off the batter to retreat. The pump-fake to third holds the lead runner AND creates the out at second on a batter who's now caught in no-man's-land."
  },

  {
    id: "wtp-a3",
    difficulty: "allstar",
    type: "baserunning",
    runnerRequirements: { third: true },
    situation: "Bottom of the 8th, tied game. You're on third base with one out. The batter squares to bunt — it's a suicide squeeze. The pitcher sees it early and bounces the pitch in the dirt two feet in front of the plate.",
    prompt: "You broke from third the moment the pitcher started his motion. The ball is in the dirt. Do you go?",
    choices: [
      { id: "a", text: "Yes — you committed to this when you broke, keep going" },
      { id: "b", text: "No — stop and retreat to third" },
      { id: "c", text: "Hesitate and read whether the catcher fields it cleanly" },
      { id: "d", text: "Only go if the batter makes contact on the bunt" }
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -5,
    explanationCorrect: "Keep going. The suicide squeeze means you go no matter what happens to the pitch. You broke when the pitcher committed — you're 60 feet down the line and the catcher has to control a ball in the dirt AND apply a tag. The catcher needs a perfect pick, a pivot, and a firm tag in a split second. More often than not, you score. Stopping is the one thing that guarantees you're out.",
    explanationWrong: "On a suicide squeeze, the word 'suicide' is there for a reason — you're committed the moment you break. Stopping or hesitating means you're caught in a rundown with no safe base to return to. The catcher still has to field the ball cleanly. Trust the design of the play and run through the bag."
  },

  {
    id: "wtp-a4",
    difficulty: "allstar",
    type: "baserunning",
    runnerRequirements: { first: true, second: true },
    situation: "Two outs, runners on first and second. Full count on the batter. Both runners are going on the pitch — it's a 'full count, two outs' situation where you run automatically.",
    prompt: "The pitcher delivers. The batter takes the pitch. The home plate umpire calls... ball four. Walk. What do you do as the runner on second?",
    choices: [
      { id: "a", text: "Advance to third only — a walk forces you only one base" },
      { id: "b", text: "Keep running all the way to home — you were running on the pitch" },
      { id: "c", text: "Stop at third and wait to see if the catcher throws down" },
      { id: "d", text: "Stop at third — you were running on a steal read, not a force" }
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -5,
    explanationCorrect: "Score! On a 3-2 count with two outs, both runners go on the pitch automatically. When ball four is called, the batter is awarded first base — but you were already running with the pitch. The force play doesn't apply to YOUR run; you were stealing. The catcher has to throw to third to get you, and there's no reason to stop. Run through third and score.",
    explanationWrong: "This is one of the most misunderstood rules in baseball. Yes, a walk normally forces runners only one base. But you broke on the pitch — you were running with the delivery on a two-out, full count. You're not advancing on the walk, you were stealing. The walk just means the catcher won't throw down. There's nobody to stop you from scoring."
  },

  // ── NEW SCENARIOS (15) ──────────────────────────────────────────

  {
    id: "wtp-r6",
    difficulty: "rookie",
    type: "defense",
    runnerRequirements: { anyRunner: true },
    situation: "Runner on second base. The batter hits a slow ground ball to the third baseman. The third baseman charges and fields it near the foul line.",
    prompt: "The runner on second is already at third and may try to score. Where does the third baseman throw?",
    choices: [
      { id: "a", text: "Throw home to try to get the runner scoring" },
      { id: "b", text: "Throw to first base for the sure out" },
      { id: "c", text: "Run toward home and try to tag the runner" },
      { id: "d", text: "Hold the ball — no play is available" }
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    explanationCorrect: "Take the sure out at first. The runner from second was already moving and will score — there's nothing you can do about that. A throw home from the third base line is a difficult angle and likely arrives too late. Take the guaranteed out at first and keep the inning manageable.",
    explanationWrong: "When a runner is already past third and heading home on a slow grounder, the throw home is almost always too late. The third baseman has to field, set, and throw a long distance at a tough angle. The sure play is always first base. A guaranteed out is better than no outs."
  },
  {
    id: "wtp-r7",
    difficulty: "rookie",
    type: "baserunning",
    runnerRequirements: { second: true },
    situation: "You're on second base with two outs. The batter hits a ground ball right at the shortstop. The shortstop fields it cleanly.",
    prompt: "Do you run to third?",
    choices: [
      { id: "a", text: "Yes — run hard, maybe you beat the throw" },
      { id: "b", text: "No — hold at second, the shortstop can easily throw to third" },
      { id: "c", text: "Run halfway and see what the shortstop does" },
      { id: "d", text: "Run only if the shortstop bobbles the ball" }
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    explanationCorrect: "Hold at second. The shortstop fielded it cleanly and is already facing your direction — a throw to third is short and easy. With two outs, you'd be thrown out to end the inning. Stay put and let the batter try to get a hit.",
    explanationWrong: "Running on a cleanly fielded ball to the left side with two outs is one of the most common baserunning mistakes. The shortstop is already facing third base — it's a 30-foot throw. You'd be out by a mile and end the inning. With two outs, your job is to stay alive and let the batter work."
  },
  {
    id: "wtp-r8",
    difficulty: "rookie",
    type: "defense",
    runnerRequirements: { first: true },
    situation: "Runner on first base, nobody out. The batter hits a high pop-up in foul territory near first base. The first baseman catches it for the first out.",
    prompt: "The runner on first tagged up and is trying to advance to second. What does the first baseman do?",
    choices: [
      { id: "a", text: "Throw to second base immediately after the catch" },
      { id: "b", text: "Hold the ball — no throw is needed" },
      { id: "c", text: "Throw to the pitcher" },
      { id: "d", text: "Run toward the runner to make a tag" }
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    explanationCorrect: "Hold the ball. Technically a runner can tag up after any caught fly ball — but advancing on a foul pop-up right next to the first baseman is never worth it. Smart runners don't try this. No throw needed — hold the ball and get ready for the next pitch.",
    explanationWrong: "This is a trick situation. A runner can technically tag up after a foul pop, but no smart runner on first is going anywhere when the first baseman caught it just a few feet away. There's no play to make. Throwing creates the risk of a wild throw giving the runner a free base."
  },
  {
    id: "wtp-r9",
    difficulty: "rookie",
    type: "baserunning",
    runnerRequirements: { first: true },
    situation: "You're on first base, one out. The batter hits a line drive right at the second baseman. The second baseman catches it in the air.",
    prompt: "You were running when the ball was hit. What do you do?",
    choices: [
      { id: "a", text: "Keep running to second — you're already halfway there" },
      { id: "b", text: "Stop and go back to first as fast as you can" },
      { id: "c", text: "Stop between the bases and wait" },
      { id: "d", text: "Slide into second" }
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    explanationCorrect: "Get back to first immediately! The second baseman caught the ball in the air for an out. If you're not touching first base, they can throw to first and double you off for the second out. Sprint back as fast as you can.",
    explanationWrong: "When a line drive is caught, any runner who left their base is in danger of being doubled off. If you keep running to second, the second baseman just throws to first — you're doubled off for an easy double play. Always get back to your base when a line drive is caught in the air."
  },
  {
    id: "wtp-r10",
    difficulty: "rookie",
    type: "defense",
    runnerRequirements: { third: true },
    situation: "Runner on third, two outs. The batter hits a weak ground ball to the pitcher on the mound.",
    prompt: "The runner on third breaks for home. What does the pitcher do?",
    choices: [
      { id: "a", text: "Throw home to get the runner" },
      { id: "b", text: "Throw to first base for the sure out" },
      { id: "c", text: "Run at the runner to get them in a rundown" },
      { id: "d", text: "Throw to third base" }
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 5,
    iqDeltaWrong: -3,
    explanationCorrect: "Throw to first. Two outs means getting the batter out ends the inning — the run doesn't count if the third out is made before the runner touches home. Throw to first, get the easy out, inning over. No run scores.",
    explanationWrong: "With two outs, the run only counts if it scores BEFORE the third out is recorded. If the pitcher gets the batter at first, the inning ends and the runner's score doesn't count. Always take the sure out at first with two outs. The run is irrelevant if you get the out."
  },
  {
    id: "wtp-p7",
    difficulty: "pro",
    type: "baserunning",
    runnerRequirements: { first: true },
    situation: "Runner on first, nobody out. The batter hits a sharp single to left field. You're rounding second at full speed. The left fielder fields the ball cleanly on one hop.",
    prompt: "Third base coach is waving you through. Left fielder has a below-average arm. Do you try to score?",
    choices: [
      { id: "a", text: "Yes — below-average arm, go for it" },
      { id: "b", text: "No — stop at third, nobody out is too valuable to risk" },
      { id: "c", text: "Hesitate at third and only go if the throw is offline" },
      { id: "d", text: "Go only if you have elite speed" }
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 6,
    iqDeltaWrong: -4,
    explanationCorrect: "Stop at third. Nobody out with a runner on third is an excellent position — you'll likely score on a fly ball, ground ball, or wild pitch. A below-average arm doesn't guarantee a score, and getting thrown out at home with nobody out kills a big inning. Take the gift of third base.",
    explanationWrong: "A below-average arm is tempting, but with nobody out, getting thrown out at home ends a big inning opportunity. Third base with nobody out scores on almost any contact. Smart baserunning is knowing when NOT to be aggressive — the risk-reward doesn't justify it here."
  },
  {
    id: "wtp-p8",
    difficulty: "pro",
    type: "defense",
    runnerRequirements: { second: true },
    situation: "Runner on second, nobody out. The batter bunts toward the first base line. The pitcher charges and fields it near the line, 20 feet from home.",
    prompt: "The runner from second is already rounding third. Pitcher fields it cleanly. Where's the throw?",
    choices: [
      { id: "a", text: "Throw to first — take the sure out" },
      { id: "b", text: "Throw home — you're only 20 feet away, you have a play" },
      { id: "c", text: "Fake home and throw to third to trap the runner" },
      { id: "d", text: "Throw to second to hold the batter at first" }
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 6,
    iqDeltaWrong: -4,
    explanationCorrect: "Throw home. The whole point of the sacrifice bunt is to trade an out for an advanced runner — but if the pitcher is only 20 feet away and the runner is still moving, you have a real play at the plate. A short accurate throw home turns the bunt into a failed play. Take the aggressive call.",
    explanationWrong: "This is exactly the situation where you challenge the bunt. The runner gave up their lead rounding third, and you're only 20 feet from home — not a full 60-foot throw. Taking first gives the other team exactly what they wanted. If you have the play, make it."
  },
  {
    id: "wtp-p9",
    difficulty: "pro",
    type: "baserunning",
    runnerRequirements: { second: true },
    situation: "Runner on second, two outs, down by one in the 8th inning. The batter hits a single to right field. The right fielder has an above-average arm and fields it on one hop.",
    prompt: "You're the runner on second. Third base coach is holding you. Do you go?",
    choices: [
      { id: "a", text: "Hold — trust the coach, strong arm in right" },
      { id: "b", text: "Go — you need to score, you're down by one" },
      { id: "c", text: "Go — two outs means you run on contact automatically" },
      { id: "d", text: "Go only if you had a big lead off second" }
    ],
    correctAnswerId: "c",
    iqDeltaCorrect: 6,
    iqDeltaWrong: -4,
    explanationCorrect: "Go — two outs means you run on contact automatically. With two outs you don't wait for the coach's signal; you run the moment the ball is hit. You should already be at full speed rounding third. The right fielder's arm doesn't matter if you got a good jump on contact.",
    explanationWrong: "Two outs changes everything in baserunning. With two outs you run on any hit — you don't wait for the coach. There's no 'setting up' for the next batter when two outs means the at-bat ends on the next out anyway. Two outs means you're moving. This is one of the most important baserunning rules in baseball."
  },
  {
    id: "wtp-p10",
    difficulty: "pro",
    type: "defense",
    runnerRequirements: { anyRunner: true },
    situation: "Runners on first and third, one out. The batter hits a sharp grounder to the second baseman. The runner on third breaks on contact.",
    prompt: "Second baseman has a clean field. Can start a 4-6-3 double play OR throw home. What's the right call?",
    choices: [
      { id: "a", text: "Throw home — cut off the run scoring from third" },
      { id: "b", text: "Turn the 4-6-3 double play — take two outs" },
      { id: "c", text: "Throw to second only, don't risk the relay" },
      { id: "d", text: "Throw to first for one sure out" }
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 6,
    iqDeltaWrong: -4,
    explanationCorrect: "Turn the double play. Two outs for one run is the trade you always make. The run scores either way — the runner on third is going no matter what. But getting two outs ends the inning before any more damage. A double play is the most valuable play in baseball. Take it every time you can get it.",
    explanationWrong: "Throwing home only gets one out and leaves runners on base with two outs instead of ending the inning. The run scores whether you throw home or complete the double play — the runner was already going. Two outs ends the threat entirely. Always take the double play when you have it."
  },
  {
    id: "wtp-p11",
    difficulty: "pro",
    type: "baserunning",
    runnerRequirements: { first: true },
    situation: "Runner on first, one out. The batter hits a sinking line drive to left-center. You break on contact. The ball drops in for a hit — left fielder picks it up. You're rounding second hard.",
    prompt: "Third base coach puts up the stop sign. Do you respect it?",
    choices: [
      { id: "a", text: "Yes — stop at second, trust the coach" },
      { id: "b", text: "No — the outfielder had to run hard, keep going to third" },
      { id: "c", text: "Stop at second and see if the outfielder throws" },
      { id: "d", text: "Try to score — the outfielder is off balance" }
    ],
    correctAnswerId: "a",
    iqDeltaCorrect: 6,
    iqDeltaWrong: -4,
    explanationCorrect: "Respect the hold. The third base coach has the angle on the outfielder that you don't have while running blind. If he's holding you, the fielder recovered faster than it looked. Trust your coach and take second — you're in scoring position with one out.",
    explanationWrong: "The third base coach is the one set of eyes watching the fielder while you're running with your back to the play. Ignoring the hold sends you into a throw you can't see. A runner thrown out ignoring the stop sign is an embarrassing, preventable out that kills the inning."
  },
  {
    id: "wtp-p12",
    difficulty: "pro",
    type: "defense",
    runnerRequirements: { third: true },
    situation: "Runner on third, one out. Infield at normal depth. The batter hits a routine medium-pace ground ball to the third baseman.",
    prompt: "Runner on third breaks for home on contact. Third baseman fields it cleanly. What's the right play?",
    choices: [
      { id: "a", text: "Throw home — you have time from third base" },
      { id: "b", text: "Throw to first — take the sure out, run scores" },
      { id: "c", text: "Pump fake home then throw to first" },
      { id: "d", text: "Run at the runner to get them in a rundown" }
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 6,
    iqDeltaWrong: -4,
    explanationCorrect: "Take the sure out at first. The infield is at normal depth — that trade-off is already accepted: a run scores but you get the out. The throw home from normal third base depth arrives too late and risks a wild throw for extra damage. Take first, get the out, accept the run.",
    explanationWrong: "When the infield plays at normal depth with a runner on third, a ground ball scores the run — that's the accepted trade. Trying to throw home from regular depth usually arrives late and risks a wild throw that allows more damage. Take the sure out. One run to escape the inning is a good trade."
  },
  {
    id: "wtp-a5",
    difficulty: "allstar",
    type: "defense",
    runnerRequirements: { first: true },
    situation: "Runner on first, nobody out, tie game 7th inning. Left-handed batter. First baseman holding the runner on. The batter hits a sharp one-hopper right back to the pitcher.",
    prompt: "Pitcher fields it cleanly. Runner on first breaks immediately. What's the highest-IQ play?",
    choices: [
      { id: "a", text: "Throw to second for the force out" },
      { id: "b", text: "Throw to first — easy 1-3 putout" },
      { id: "c", text: "Throw to second, start the 1-6-3 double play" },
      { id: "d", text: "Step toward third to freeze the runner, then throw to first" }
    ],
    correctAnswerId: "c",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -5,
    explanationCorrect: "1-6-3 double play — pitcher to shortstop covering second, relay to first. The runner held on first has almost no lead because the first baseman was holding him on. A sharp comebacker to the pitcher with a held runner is the best double play opportunity in baseball. Elite pitchers turn this automatically. Two outs, inning controlled.",
    explanationWrong: "A sharp comebacker with a runner held on and nobody out is a double play ball — don't waste it. The runner had no lead because he was held on. Throwing to first for one out leaves a runner on base in a tie game when you could have ended the inning. The 1-6-3 is the play. Take two every time."
  },
  {
    id: "wtp-a6",
    difficulty: "allstar",
    type: "baserunning",
    runnerRequirements: { second: true },
    situation: "Runner on second, nobody out, down by one in the 9th. Infield at normal depth. The batter squares to bunt — the third baseman charges hard.",
    prompt: "The batter pulls back the bunt — it's a fake. Third baseman is now 20 feet in front of his bag. The pitch is called a ball. What do you do as the runner on second?",
    choices: [
      { id: "a", text: "Stay at second — it was a ball, nothing happened" },
      { id: "b", text: "Break for third immediately — third base is unoccupied" },
      { id: "c", text: "Break only if the catcher doesn't look at you" },
      { id: "d", text: "Wait to see if the batter calls time" }
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -5,
    explanationCorrect: "Break for third right now. The third baseman charged and is 20 feet in front of the bag — there is nobody covering third. The catcher has to throw 127 feet to a moving, empty bag. This is a designed play called a bunt-and-steal and it works because fielders forget to recover. Down a run in the 9th, third with nobody out is a potential game-tying run on any contact.",
    explanationWrong: "When the third baseman charges hard on a bunt fake and the pitch isn't put in play, third base is empty. This is one of baseball's great heads-up plays — the defense gave you a free base. Down one in the 9th with nobody out, third base scores on a fly ball, wild pitch, passed ball, or sac fly. Don't miss this."
  },
  {
    id: "wtp-a7",
    difficulty: "allstar",
    type: "defense",
    runnerRequirements: { second: true },
    situation: "Runner on second, one out, tie game 8th inning. Slow-footed runner. The batter hits a routine fly ball to medium-depth center field. Runner tags at second.",
    prompt: "Center fielder catches it. Strong arm, medium depth. Runner tags and heads to third. Do you throw to third?",
    choices: [
      { id: "a", text: "Yes — strong arm, medium depth, make the throw" },
      { id: "b", text: "No — let him have third, protect against a wild throw" },
      { id: "c", text: "Bluff the throw to third then hold the ball" },
      { id: "d", text: "Throw to second to hold the batter at first" }
    ],
    correctAnswerId: "b",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -5,
    explanationCorrect: "Let him take third and hold the ball. A slow runner tagging from second on a medium fly to center barely makes third — meaning a throw has almost no chance of getting there in time. More importantly, a throw that tails wide goes into the corner and scores him. In a tie game in the 8th, a wild throw loses the game. The risk of giving up the go-ahead run on a bad throw far outweighs the small chance of a putout.",
    explanationWrong: "Strong arm is tempting — but slow runner plus medium-depth center means the runner barely makes third. Any throw that's not perfect goes into the corner and scores him in a tie game. This is elite defensive IQ: knowing when NOT to throw. Let him have third and pitch to the next situation with the lead still tied."
  },
  {
    id: "wtp-a8",
    difficulty: "allstar",
    type: "baserunning",
    runnerRequirements: { first: true },
    situation: "Runners on first and second, nobody out, tie game 6th inning. You're the runner on first. The batter hits a sharp line drive directly at the shortstop — caught for out number one. Shortstop looks to second to double off the runner there.",
    prompt: "You were running on the pitch. What's the highest-IQ play for you as the runner on first?",
    choices: [
      { id: "a", text: "Sprint back to first — get back before any throw comes" },
      { id: "b", text: "Keep running to second — the shortstop is looking away" },
      { id: "c", text: "Stop between first and second and get in a rundown intentionally" },
      { id: "d", text: "Dive back to first" }
    ],
    correctAnswerId: "c",
    iqDeltaCorrect: 8,
    iqDeltaWrong: -5,
    explanationCorrect: "Get in a rundown — intentionally. The shortstop is throwing to second to double off that runner. If you stop between the bases, the shortstop can't throw to second AND chase you at the same time. You become a decoy: the shortstop must deal with you first, giving the runner on second time to retreat safely. You'll be out, but you've traded yourself to save the other runner. One out for one out — net zero, inning still alive.",
    explanationWrong: "Sprinting back to first seems right but here's the problem: the shortstop throws to second (two outs), the second baseman fires to first to get you returning (three outs, inning over on a line drive). The smart play is creating a rundown that occupies the shortstop long enough for the runner on second to get back. Sacrifice yourself to save the other runner and keep the inning alive."
  }
];
