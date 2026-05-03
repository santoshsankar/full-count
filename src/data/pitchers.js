export const pitchers = [
  {
    id: "power-arm",
    playerName: "Buck Hammond",
    archetype: "Power Arm",
    blurb: "Throws gas. Lives up at the top of the zone.",
    arsenal: ["Fastball", "Slider", "Curveball"],
    velocity: "elite",
    control: 6,
    tendency: "Goes fastball first pitch and lives up in the zone.",
    weakness: "Falls behind in the count, then has to come over the plate.",
    countLogic: {
      ahead:  ["Fastball-high", "Slider-away", "Fastball-high"],
      behind: ["Fastball-middle", "Fastball-middle", "Slider"],
      even:   ["Fastball-high", "Slider", "Fastball-away"]
    }
  },
  {
    id: "ground-ball",
    playerName: "Sully Mendez",
    archetype: "Sinkerballer",
    blurb: "Heavy sinker. Wants every ball on the ground.",
    arsenal: ["Sinker", "Cutter", "Changeup"],
    velocity: "medium",
    control: 8,
    tendency: "Always works down in the zone — sinker on the outside corner.",
    weakness: "When he misses up, hitters drive the ball — he has no swing-and-miss pitch.",
    countLogic: {
      ahead:  ["Sinker-away", "Changeup", "Sinker-in"],
      behind: ["Sinker-middle", "Cutter", "Sinker-away"],
      even:   ["Sinker-away", "Sinker-in", "Cutter"]
    }
  },
  {
    id: "strikeout-artist",
    playerName: "Cole \"K\" Brennan",
    archetype: "Strikeout Pitcher",
    blurb: "Sets up his off-speed stuff with the fastball. Chases punchouts.",
    arsenal: ["Fastball", "Slider", "Changeup"],
    velocity: "high",
    control: 7,
    tendency: "Sets up off-speed with the fastball — chases strikeouts above all.",
    weakness: "Pitch count climbs fast and he leaves something over the middle late in the game.",
    countLogic: {
      ahead:  ["Slider-away", "Changeup", "Slider-low"],
      behind: ["Fastball-away", "Fastball-middle", "Slider"],
      even:   ["Fastball-away", "Slider", "Changeup"]
    }
  },
  {
    id: "finesse-lefty",
    playerName: "Dizzy Hayworth",
    archetype: "Finesse Lefty",
    blurb: "Pinpoint command. Changes speeds constantly.",
    arsenal: ["Changeup", "Curveball", "Fastball", "Cutter"],
    velocity: "low",
    control: 10,
    tendency: "Changes speeds constantly. Never beats you twice the same way.",
    weakness: "Power hitters who sit on his off-speed can square it up.",
    countLogic: {
      ahead:  ["Changeup", "Curveball", "Cutter-away"],
      behind: ["Fastball-away", "Changeup", "Cutter"],
      even:   ["Changeup", "Fastball-away", "Curveball"]
    }
  },
  {
    id: "closer",
    playerName: "Reno Vasquez",
    archetype: "Closer",
    blurb: "Two pitches. Pure aggression. One inning at a time.",
    arsenal: ["Fastball", "Slider"],
    velocity: "elite",
    control: 7,
    tendency: "Fastball or slider, nothing else — just challenges the hitter.",
    weakness: "Gets in trouble when hitters see him a second time through the order.",
    countLogic: {
      ahead:  ["Slider-away", "Fastball-high", "Slider-low"],
      behind: ["Fastball-middle", "Fastball-away", "Slider"],
      even:   ["Fastball-away", "Slider", "Fastball-high"]
    }
  },
  {
    id: "crafty-veteran",
    playerName: "Pop Kowalski",
    archetype: "Crafty Veteran",
    blurb: "Outsmarts hitters. Sets up every pitch with the one before.",
    arsenal: ["Fastball", "Curveball", "Changeup", "Cutter"],
    velocity: "medium",
    control: 9,
    tendency: "Outsmarts hitters — every pitch is set up by the one before it.",
    weakness: "If the sequence breaks down, the velocity gap shows up fast.",
    countLogic: {
      ahead:  ["Curveball", "Changeup", "Cutter-away"],
      behind: ["Fastball-away", "Cutter", "Changeup"],
      even:   ["Fastball-away", "Curveball", "Cutter"]
    }
  },
  {
    id: "wild-thrower",
    playerName: "Tank Brody",
    archetype: "Hard Thrower",
    blurb: "Throws hard. Sometimes loses the strike zone entirely.",
    arsenal: ["Fastball", "Slider", "Fastball"],
    velocity: "elite",
    control: 3,
    tendency: "Throws hard — sometimes loses the strike zone entirely.",
    weakness: "Walks pile up and he gets stuck in deep counts.",
    countLogic: {
      ahead:  ["Fastball-high", "Slider-away", "Fastball-away"],
      behind: ["Fastball-middle", "Fastball-middle", "Slider-middle"],
      even:   ["Fastball-away", "Slider", "Fastball-high"]
    }
  },
  {
    id: "offspeed-specialist",
    playerName: "Slim Patel",
    archetype: "Off-Speed Specialist",
    blurb: "Lives off the changeup and curve. Rarely throws a fastball.",
    arsenal: ["Changeup", "Curveball", "Slider", "Fastball"],
    velocity: "low",
    control: 8,
    tendency: "Changeup and curve about 80% of the time. Fastball just to reset the hitter's timing.",
    weakness: "Hitters who sit on off-speed can time him perfectly.",
    countLogic: {
      ahead:  ["Changeup", "Curveball", "Slider-away"],
      behind: ["Changeup", "Fastball-away", "Curveball"],
      even:   ["Changeup", "Curveball", "Changeup"]
    }
  }
];
