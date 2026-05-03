export const batters = [
  {
    id: "power-chaser",
    playerName: "Marcus \"Mash\" Reyes",
    archetype: "Power Hitter",
    blurb: "Big swings. Big misses. Loves the long ball.",
    contact: 4, power: 9, discipline: 3, speed: 3,
    tendencies: [
      "Crushes mistakes over the heart of the plate",
      "Chases breaking balls off the outside corner",
      "Pulls the ball when he connects"
    ],
    weaknesses: [
      "Sliders down and away",
      "Talks himself into bad swings"
    ],
    zoneWeakness: "away",
    pullTendency: "pull",
    chaseRate: "high"
  },
  {
    id: "contact-machine",
    playerName: "Eli Tanaka",
    archetype: "Contact Specialist",
    blurb: "Almost never strikes out. Hits it where they ain't.",
    contact: 9, power: 3, discipline: 7, speed: 7,
    tendencies: [
      "Rarely strikes out",
      "Hits the ball where it's pitched",
      "Tougher to retire with two strikes"
    ],
    weaknesses: [
      "Hard fastballs up at the letters",
      "Rarely hits for extra bases"
    ],
    zoneWeakness: "high",
    pullTendency: "spray",
    chaseRate: "low"
  },
  {
    id: "disciplined-walker",
    playerName: "Walt Pemberton",
    archetype: "Patient Hitter",
    blurb: "Has the best eye in the league. Will take ball four every time.",
    contact: 7, power: 5, discipline: 10, speed: 5,
    tendencies: [
      "Takes ball four every chance he gets",
      "Battles deep into the count",
      "Forces you to throw strikes"
    ],
    weaknesses: [
      "Can fall behind 0-2 if you steal a strike early",
      "Sometimes too passive with runners on base"
    ],
    zoneWeakness: "low",
    pullTendency: "spray",
    chaseRate: "low"
  },
  {
    id: "aggressive-hacker",
    playerName: "Jake \"Hacks\" Donovan",
    archetype: "Aggressive Swinger",
    blurb: "Swings at the first decent pitch he sees.",
    contact: 6, power: 7, discipline: 2, speed: 5,
    tendencies: [
      "Swings at the first hittable pitch",
      "Rarely sees a third pitch",
      "Easy to get ahead of in the count"
    ],
    weaknesses: [
      "Off-speed after seeing fastballs",
      "Pitchers who work fast"
    ],
    zoneWeakness: "breaking",
    pullTendency: "pull",
    chaseRate: "high"
  },
  {
    id: "high-average",
    playerName: "Ricky Vargas",
    archetype: "Line-Drive Hitter",
    blurb: "Pure hitter. Sprays line drives gap to gap.",
    contact: 8, power: 6, discipline: 8, speed: 6,
    tendencies: [
      "Hits line drives to all fields",
      "Doesn't chase bad pitches",
      "Most dangerous when he's ahead in the count"
    ],
    weaknesses: [
      "Elevated fastballs when he's behind",
      "No glaring weakness — you have to mix pitches"
    ],
    zoneWeakness: "high",
    pullTendency: "spray",
    chaseRate: "low"
  },
  {
    id: "streaky-slugger",
    playerName: "Big Tony Russo",
    archetype: "All-or-Nothing Slugger",
    blurb: "Either hits it 450 feet or strikes out swinging.",
    contact: 4, power: 10, discipline: 4, speed: 3,
    tendencies: [
      "Home run or strikeout — not much in between",
      "Sells out for the pull side",
      "Most dangerous on hitter's counts (2-0, 3-1)"
    ],
    weaknesses: [
      "Breaking ball below the knees",
      "Soft stuff after a steady diet of fastballs"
    ],
    zoneWeakness: "low",
    pullTendency: "pull",
    chaseRate: "high"
  },
  {
    id: "slap-run",
    playerName: "Donny \"Speed\" Cole",
    archetype: "Speedster",
    blurb: "Slaps it on the ground and beats out throws.",
    contact: 8, power: 1, discipline: 6, speed: 10,
    tendencies: [
      "Tries to slap the ball past the infield",
      "Threat to bunt at any time",
      "Speed turns routine plays into hits"
    ],
    weaknesses: [
      "Hard fastballs in on his hands",
      "The shift takes away his soft single"
    ],
    zoneWeakness: "inside",
    pullTendency: "opposite",
    chaseRate: "medium"
  },
  {
    id: "dead-pull",
    playerName: "Hank Mathers",
    archetype: "Pull Hitter",
    blurb: "Yanks everything to the pull side. Predictable, but punishes mistakes.",
    contact: 6, power: 8, discipline: 5, speed: 4,
    tendencies: [
      "Hits everything to the pull side",
      "Predictable but hard to stop when locked in",
      "Loves pitches over the inner half"
    ],
    weaknesses: [
      "Soft stuff on the outer half",
      "Anything that breaks off the outside corner"
    ],
    zoneWeakness: "away",
    pullTendency: "pull",
    chaseRate: "medium"
  },
  {
    id: "patient-veteran",
    playerName: "Old Pete Bishop",
    archetype: "Veteran Hitter",
    blurb: "Shortens up with two strikes. Fouls off everything until he gets his pitch.",
    contact: 8, power: 5, discipline: 9, speed: 4,
    tendencies: [
      "Shortens his swing with two strikes",
      "Fouls off tough pitches",
      "Gets dangerous as the at-bat goes longer"
    ],
    weaknesses: [
      "Falling behind early at 0-2",
      "Loses some power when protecting the plate"
    ],
    zoneWeakness: "inside",
    pullTendency: "spray",
    chaseRate: "low"
  },
  {
    id: "free-swinger",
    playerName: "Wild Mike Carrera",
    archetype: "Free Swinger",
    blurb: "Will swing at almost anything. Pitchers love facing him.",
    contact: 5, power: 7, discipline: 2, speed: 5,
    tendencies: [
      "Swings at pitches in the dirt",
      "Swings at pitches above his shoulders",
      "Pitchers love facing him"
    ],
    weaknesses: [
      "Anything off the plate — he'll chase it",
      "Bouncing breaking balls"
    ],
    zoneWeakness: "low",
    pullTendency: "pull",
    chaseRate: "high"
  },
  {
    id: "gap-power",
    playerName: "Andre Whitfield",
    archetype: "Gap Hitter",
    blurb: "Doubles to the gaps. No platoon weakness. Dangerous in any count.",
    contact: 7, power: 7, discipline: 7, speed: 6,
    tendencies: [
      "Hits doubles to either gap",
      "No real platoon weakness",
      "Most dangerous on a 1-1 count"
    ],
    weaknesses: [
      "Elevated fastballs up and in",
      "No easy out — you have to locate every pitch"
    ],
    zoneWeakness: "high",
    pullTendency: "spray",
    chaseRate: "medium"
  },
  {
    id: "lefty-masher",
    playerName: "Lefty Dolan",
    archetype: "Platoon Slugger",
    blurb: "Wears out right-handed pitchers. Lefty breaking balls give him trouble.",
    contact: 7, power: 8, discipline: 6, speed: 5,
    tendencies: [
      "Destroys right-handed pitching",
      "Has trouble with breaking balls from lefties",
      "Pull-side power against righties"
    ],
    weaknesses: [
      "Breaking balls from same-side pitchers",
      "Sweeping curves that start at his body"
    ],
    zoneWeakness: "breaking",
    pullTendency: "pull",
    chaseRate: "medium"
  }
];
