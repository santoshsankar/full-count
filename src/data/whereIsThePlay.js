// 15 Where's The Play situations — 5 rookie, 6 pro, 4 allstar

export const whereIsThePlay = [
  // ── ROOKIE (5) ──────────────────────────────────────────────

  {
    id: "wtp-r1",
    difficulty: "rookie",
    type: "defense",
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
  }
];
