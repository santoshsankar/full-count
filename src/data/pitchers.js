export const pitchers = [
  {
    id: "power-arm",
    name: "Power Arm, Lives Up In The Zone",
    shortName: "POWER ARM",
    arsenal: ["Fastball", "Slider", "Curveball"],
    velocity: "elite",
    control: 6,
    tendency: "Goes fastball first pitch, lives up in the zone",
    weakness: "Falls behind in count, has to come over the plate",
    countLogic: {
      ahead:  ["Fastball-high", "Slider-away", "Fastball-high"],
      behind: ["Fastball-middle", "Fastball-middle", "Slider"],
      even:   ["Fastball-high", "Slider", "Fastball-away"]
    }
  },
  {
    id: "ground-ball",
    name: "Ground Ball Machine, Sinker Heavy",
    shortName: "GROUND BALL",
    arsenal: ["Sinker", "Cutter", "Changeup"],
    velocity: "medium",
    control: 8,
    tendency: "Always working down in the zone, sinker away",
    weakness: "Elevated contact when misses up — no strikeout pitch",
    countLogic: {
      ahead:  ["Sinker-away", "Changeup", "Sinker-in"],
      behind: ["Sinker-middle", "Cutter", "Sinker-away"],
      even:   ["Sinker-away", "Sinker-in", "Cutter"]
    }
  },
  {
    id: "strikeout-artist",
    name: "Strikeout Artist, Swing And Miss Stuff",
    shortName: "K ARTIST",
    arsenal: ["Fastball", "Slider", "Changeup"],
    velocity: "high",
    control: 7,
    tendency: "Sets up fastball with offspeed, chases Ks above all",
    weakness: "Pitch count climbs — leaves something over middle late",
    countLogic: {
      ahead:  ["Slider-away", "Changeup", "Slider-low"],
      behind: ["Fastball-away", "Fastball-middle", "Slider"],
      even:   ["Fastball-away", "Slider", "Changeup"]
    }
  },
  {
    id: "finesse-lefty",
    name: "Finesse Lefty, Pinpoint Command",
    shortName: "FINESSE",
    arsenal: ["Changeup", "Curveball", "Fastball", "Cutter"],
    velocity: "low",
    control: 10,
    tendency: "Changes speeds constantly, never beats you twice the same way",
    weakness: "Power hitters sitting on offspeed can time him",
    countLogic: {
      ahead:  ["Changeup", "Curveball", "Cutter-away"],
      behind: ["Fastball-away", "Changeup", "Cutter"],
      even:   ["Changeup", "Fastball-away", "Curveball"]
    }
  },
  {
    id: "closer",
    name: "Closer Mentality, One Inning Max",
    shortName: "CLOSER",
    arsenal: ["Fastball", "Slider"],
    velocity: "elite",
    control: 7,
    tendency: "Fastball or slider, nothing else, pure aggression",
    weakness: "Gets into trouble once into the order a second time",
    countLogic: {
      ahead:  ["Slider-away", "Fastball-high", "Slider-low"],
      behind: ["Fastball-middle", "Fastball-away", "Slider"],
      even:   ["Fastball-away", "Slider", "Fastball-high"]
    }
  },
  {
    id: "crafty-veteran",
    name: "Crafty Veteran, Sequence Based",
    shortName: "CRAFTY VET",
    arsenal: ["Fastball", "Curveball", "Changeup", "Cutter"],
    velocity: "medium",
    control: 9,
    tendency: "Outsmarts hitters — sets up everything with the previous pitch",
    weakness: "Velocity gap gets exposed if sequence breaks down",
    countLogic: {
      ahead:  ["Curveball", "Changeup", "Cutter-away"],
      behind: ["Fastball-away", "Cutter", "Changeup"],
      even:   ["Fastball-away", "Curveball", "Cutter"]
    }
  },
  {
    id: "wild-thrower",
    name: "Hard Thrower, Wild Streak",
    shortName: "WILD STREAK",
    arsenal: ["Fastball", "Slider", "Fastball"],
    velocity: "elite",
    control: 3,
    tendency: "Throws hard, sometimes loses the zone entirely",
    weakness: "Walks pile up — gets into deep counts constantly",
    countLogic: {
      ahead:  ["Fastball-high", "Slider-away", "Fastball-away"],
      behind: ["Fastball-middle", "Fastball-middle", "Slider-middle"],
      even:   ["Fastball-away", "Slider", "Fastball-high"]
    }
  },
  {
    id: "offspeed-specialist",
    name: "Off-Speed Specialist, Rarely Throws Fastball",
    shortName: "OFFSPEED",
    arsenal: ["Changeup", "Curveball", "Slider", "Fastball"],
    velocity: "low",
    control: 8,
    tendency: "Changeup and curve 80% of the time, fastball only to reset timing",
    weakness: "Hitters who sit offspeed time him perfectly",
    countLogic: {
      ahead:  ["Changeup", "Curveball", "Slider-away"],
      behind: ["Changeup", "Fastball-away", "Curveball"],
      even:   ["Changeup", "Curveball", "Changeup"]
    }
  }
];
