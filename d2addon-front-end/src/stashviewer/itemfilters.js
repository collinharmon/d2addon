/*shields (armor) can be larms or rarms, as well as tors, helm*/

export const itemFilters = [
  {
    id: 0,
    filterName: "Helm", //head
    subFilters: [
      {
        subFilterName: "Normal", 
        id: 0
      },
      {
        subFilterName: "Magic", 
        id: 1
      },
      {
        subFilterName: "Rare", 
        id: 2
      },
      {
        subFilterName: "Unique", 
        id: 3
      },
      {
        subFilterName: "Runeword", 
        id: 4
      },
      {
        subFilterName: "Set", 
        id: 5
      },
      {
        subFilterName: "Crafted", 
        id: 6
      },
      {
        subFilterName: "Socketed", 
        id: 7
      }
    ]
  },
  {
    id: 1,
    filterName: "Gloves", //glov
    subFilters: [
      {
        subFilterName: "Normal", 
        id: 0
      },
      {
        subFilterName: "Magic", 
        id: 1
      },
      {
        subFilterName: "Rare", 
        id: 2
      },
      {
        subFilterName: "Unique", 
        id: 3
      },
      {
        subFilterName: "Set", 
        id: 4
      },
      {
        subFilterName: "Crafted", 
        id: 5
      },
    ]
  },
  {
    id: 2,
    filterName: "Belt", //belt
    subFilters: [
      {
        subFilterName: "Normal", 
        id: 0
      },
      {
        subFilterName: "Magic", 
        id: 1
      },
      {
        subFilterName: "Rare", 
        id: 2
      },
      {
        subFilterName: "Unique", 
        id: 3
      },
      {
        subFilterName: "Set", 
        id: 4
      },
      {
        subFilterName: "Crafted", 
        id: 5
      },
    ]
  },
  {
    id: 3,
    filterName: "Boots", //feet
    subFilters: [
      {
        subFilterName: "Normal", 
        id: 0
      },
      {
        subFilterName: "Magic", 
        id: 1
      },
      {
        subFilterName: "Rare", 
        id: 2
      },
      {
        subFilterName: "Unique", 
        id: 3
      },
      {
        subFilterName: "Set", 
        id: 4
      },
      {
        subFilterName: "Crafted", 
        id: 5
      },
    ]
  },
  {
    id: 4,
    filterName: "Shield", //larm/rarm + itemCategory
    subFilters: [
      {
        subFilterName: "Normal", 
        id: 0
      },
      {
        subFilterName: "Magic", 
        id: 1
      },
      {
        subFilterName: "Rare", 
        id: 2
      },
      {
        subFilterName: "Unique", 
        id: 3
      },
      {
        subFilterName: "Runeword", 
        id: 4
      },
      {
        subFilterName: "Set", 
        id: 5
      },
      {
        subFilterName: "Crafted", 
        id: 6
      },
      {
        subFilterName: "Socketed", 
        id: 7
      }
    ]
  },
  {
    id: 5,
    filterName: "Weapon", //rarm/larm + itemCategory (misc for throwing potions?? what about generic javalins?)
    subFilters: [
      {
        subFilterName: "Normal", 
        id: 0
      },
      {
        subFilterName: "Magic", 
        id: 1
      },
      {
        subFilterName: "Rare", 
        id: 2
      },
      {
        subFilterName: "Unique", 
        id: 3
      },
      {
        subFilterName: "Runeword", 
        id: 4
      },
      {
        subFilterName: "Set", 
        id: 5
      },
      {
        subFilterName: "Crafted", 
        id: 6
      },
      {
        subFilterName: "Socketed", 
        id: 7
      }
    ]
  },
  {
    id: 6,
    filterName: "Body", //tors
    subFilters: [
      {
        subFilterName: "Normal", 
        id: 0
      },
      {
        subFilterName: "Magic", 
        id: 1
      },
      {
        subFilterName: "Rare", 
        id: 2
      },
      {
        subFilterName: "Unique", 
        id: 3
      },
      {
        subFilterName: "Runeword", 
        id: 4
      },
      {
        subFilterName: "Set", 
        id: 5
      },
      {
        subFilterName: "Crafted", 
        id: 6
      },
      {
        subFilterName: "Socketed", 
        id: 7
      }
    ]
  },
  {
    id: 7,
    filterName: "Amulet", //neck
    subFilters: [
      {
        subFilterName: "Magic", 
        id: 0
      },
      {
        subFilterName: "Rare", 
        id: 1
      },
      {
        subFilterName: "Unique", 
        id: 2
      },
      {
        subFilterName: "Set", 
        id: 3
      },
      {
        subFilterName: "Crafted", 
        id: 4
      }
    ]
  },
  {
    id: 8,
    filterName: "Ring", //rrin
    subFilters: [
      {
        subFilterName: "Magic", 
        id: 0
      },
      {
        subFilterName: "Rare", 
        id: 1
      },
      {
        subFilterName: "Unique", 
        id: 2
      },
      {
        subFilterName: "Set", 
        id: 3
      },
      {
        subFilterName: "Crafted", 
        id: 4
      }
    ]
  },
  {
    id: 9,
    filterName: "Misc", //keys, Keys of Terror/Hate/Destruction, scrolls, quest items, potions, tomes, etc
    subFilters: [
      {
        subFilterName: "Key of Terror", 
        id: 0 
      },
      {
        subFilterName: "Key of Hate", 
        id: 1
      },
      {
        subFilterName: "Key of Destruction", 
        id: 2
      },
      {
        subFilterName: "Wirt's Leg", 
        id: 3
      },
      {
        subFilterName: "Tome of Town Portals", 
        id: 4
      },
      {
        subFilterName: "Tome of Scroll of Identities", 
        id: 5
      },
      {
        subFilterName: "Full Rejuvenation potion", 
        id: 6
      },
      {
        subFilterName: "Rejuvenation Potion", 
        id: 7
      },
      {
        subFilterName: "Rest of Potions", 
        id: 8
      },
    ]
  },
  {
    id: 10,
    filterName: "Gem", 
    subFilters: [
      {
        subFilterName: "Chipped", 
        id: 0
      },
      {
        subFilterName: "Flawed", 
        id: 1
      },
      {
        subFilterName: "Regular", 
        id: 2
      },
      {
        subFilterName: "Flawless", 
        id: 3
      },
      {
        subFilterName: "Perfect", 
        id: 4
      },
      {
        subFilterName: "Ruby", 
        id: 5
      },
      {
        subFilterName: "Sapphire", 
        id: 6
      },
      {
        subFilterName: "Topaz", 
        id: 7
      },
      {
        subFilterName: "Emerald", 
        id: 8
      },
      {
        subFilterName: "Diamond", 
        id: 9
      },
      {
        subFilterName: "Amethyst", 
        id: 10
      },
      {
        subFilterName: "Skull", 
        id: 11
      }
    ]
  },
  {
    id: 11,
    filterName: "Charm",
    subFilters: [
      {
        subFilterName: "Small Charm", 
        id: 0
      },
      {
        subFilterName: "Large Charm", 
        id: 1
      },
      {
        subFilterName: "Grand Charm", 
        id: 2
      },
      {
        subFilterName: "Unique", 
        id: 3
      }
    ]
  },
  {
    id: 12,
    filterName: "Rune",
    subFilters: [
      {
        subFilterName: "Low Runes", 
        id: 0
      },
      {
        subFilterName: "Medium Runes", 
        id: 1
      },
      {
        subFilterName: "High Runes", 
        id: 2
      }
    ]
  }
];

export const defaultState = [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false
];

export const advancedStates = [
  [false, false, false, false, false, false, false, false], //helm
  [false, false, false, false, false, false], //gloves
  [false, false, false, false, false, false], //belt
  [false, false, false, false, false, false], //boots
  [false, false, false, false, false, false, false, false], //shield
  [false, false, false, false, false, false, false, false], //weapon
  [false, false, false, false, false, false, false, false], //armor
  [false, false, false, false, false], //ring
  [false, false, false, false, false], //ammy
  [false, false, false, false, false, false, false, false, false], //misc
  [false, false, false, false, false, false, false, false, false, false, false, false], //Gems
  [false, false, false, false], //charms
  [false, false, false], //runes

]
