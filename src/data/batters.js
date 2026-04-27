export const batters = [
  {
    id: "power-chaser",
    name: "Power Bat, Chases Away",
    shortName: "POWER BAT",
    contact: 4, power: 9, discipline: 3, speed: 3,
    tendencies: [
      "Crushes mistakes middle-middle",
      "Chases breaking balls off the plate",
      "Pull hitter, hits it hard when he connects"
    ],
    weaknesses: [
      "Slider low and away",
      "Gets himself out"
    ],
    zoneWeakness: "away",
    pullTendency: "pull",
    chaseRate: "high"
  },
  {
    id: "contact-machine",
    name: "Contact Machine, Sprays It Everywhere",
    shortName: "CONTACT MACHINE",
    contact: 9, power: 3, discipline: 7, speed: 7,
    tendencies: [
      "Rarely strikes out",
      "Hits it where it's pitched",
      "Dangerous with two strikes"
    ],
    weaknesses: [
      "Power pitching up in the zone",
      "Rarely hits for extra bases"
    ],
    zoneWeakness: "high",
    pullTendency: "spray",
    chaseRate: "low"
  },
  {
    id: "disciplined-walker",
    name: "Disciplined Walker, Works The Count",
    shortName: "PATIENT EYE",
    contact: 7, power: 5, discipline: 10, speed: 5,
    tendencies: [
      "Will take ball four every time",
      "Battles deep into counts",
      "Makes you throw strikes"
    ],
    weaknesses: [
      "Gets behind 0-2 early",
      "Can be too passive with runners on"
    ],
    zoneWeakness: "low",
    pullTendency: "spray",
    chaseRate: "low"
  },
  {
    id: "aggressive-hacker",
    name: "Aggressive Hacker, First Pitch Swinger",
    shortName: "FIRST HACKER",
    contact: 6, power: 7, discipline: 2, speed: 5,
    tendencies: [
      "Swings at the first hittable pitch",
      "Rarely sees pitch three",
      "Easy to get ahead of in the count"
    ],
    weaknesses: [
      "Anything off-speed after a fastball",
      "Pitchers who work fast"
    ],
    zoneWeakness: "breaking",
    pullTendency: "pull",
    chaseRate: "high"
  },
  {
    id: "high-average",
    name: "High Average, Line Drive Hitter",
    shortName: "LINE DRIVE",
    contact: 8, power: 6, discipline: 8, speed: 6,
    tendencies: [
      "Hits line drives to all fields",
      "Rarely chases bad pitches",
      "Most dangerous in hitter's counts"
    ],
    weaknesses: [
      "Elevated fastball when behind in count",
      "No obvious weakness — must mix well"
    ],
    zoneWeakness: "high",
    pullTendency: "spray",
    chaseRate: "low"
  },
  {
    id: "streaky-slugger",
    name: "Streaky Slugger, All Or Nothing",
    shortName: "SLUGGER",
    contact: 4, power: 10, discipline: 4, speed: 3,
    tendencies: [
      "Either hits it 450 feet or strikes out",
      "Sells out for the pull side",
      "Counts matter — dangerous 2-0 and 3-1"
    ],
    weaknesses: [
      "Breaking ball down",
      "Soft stuff after hard stuff"
    ],
    zoneWeakness: "low",
    pullTendency: "pull",
    chaseRate: "high"
  },
  {
    id: "slap-run",
    name: "Slap And Run, Bunts For Hits",
    shortName: "SLAP HITTER",
    contact: 8, power: 1, discipline: 6, speed: 10,
    tendencies: [
      "Tries to slap it past the infield",
      "Threat to bunt any time",
      "Speed makes routine plays into hits"
    ],
    weaknesses: [
      "Hard stuff in, can't pull it",
      "Shift takes away his lane"
    ],
    zoneWeakness: "inside",
    pullTendency: "opposite",
    chaseRate: "medium"
  },
  {
    id: "dead-pull",
    name: "Dead Pull Hitter, Shift Magnet",
    shortName: "PULL HITTER",
    contact: 6, power: 8, discipline: 5, speed: 4,
    tendencies: [
      "Everything goes to the pull side",
      "Predictable but hard to stop",
      "Loves middle-in pitches"
    ],
    weaknesses: [
      "Soft stuff away",
      "Anything that breaks off the plate outside"
    ],
    zoneWeakness: "away",
    pullTendency: "pull",
    chaseRate: "medium"
  },
  {
    id: "patient-veteran",
    name: "Patient Veteran, Two-Strike Approach",
    shortName: "VETERAN",
    contact: 8, power: 5, discipline: 9, speed: 4,
    tendencies: [
      "Shortens swing with two strikes",
      "Fouls off tough pitches",
      "Gets better as the at-bat goes longer"
    ],
    weaknesses: [
      "Jump ahead 0-2 early",
      "Loses some power protecting the plate"
    ],
    zoneWeakness: "inside",
    pullTendency: "spray",
    chaseRate: "low"
  },
  {
    id: "free-swinger",
    name: "Free Swinger, Expanding Zone",
    shortName: "FREE SWINGER",
    contact: 5, power: 7, discipline: 2, speed: 5,
    tendencies: [
      "Swings at pitches in the dirt",
      "Swings at pitches above the letters",
      "Pitchers love to face him"
    ],
    weaknesses: [
      "Anything off the plate",
      "Bouncing breaking balls"
    ],
    zoneWeakness: "low",
    pullTendency: "pull",
    chaseRate: "high"
  },
  {
    id: "gap-power",
    name: "Gap Power, Uses The Whole Field",
    shortName: "GAP HITTER",
    contact: 7, power: 7, discipline: 7, speed: 6,
    tendencies: [
      "Extra base hits to all fields",
      "No platoon weakness",
      "Most dangerous pitcher's count is 1-1"
    ],
    weaknesses: [
      "Elevated fastball up and in",
      "No easy pitch — must locate perfectly"
    ],
    zoneWeakness: "high",
    pullTendency: "spray",
    chaseRate: "medium"
  },
  {
    id: "lefty-masher",
    name: "Lefty Masher, Struggles Same Side",
    shortName: "LEFTY MASHER",
    contact: 7, power: 8, discipline: 6, speed: 5,
    tendencies: [
      "Destroys right-handed pitching",
      "Breaking balls from lefties give him trouble",
      "Pull power against righties"
    ],
    weaknesses: [
      "Breaking ball from same-side pitcher",
      "Sweeping curves that start at the body"
    ],
    zoneWeakness: "breaking",
    pullTendency: "pull",
    chaseRate: "medium"
  }
];
