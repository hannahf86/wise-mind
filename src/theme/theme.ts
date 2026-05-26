// Wise Mind Design System
// All colours, fonts, spacing and module colours in one place

export const colours = {
  // Primary brand
  teal: "#5b7d74",
  tealDark: "#3d5c56",
  tealLight: "#f0f5f4",

  // Background
  background: "#faf8f6",
  white: "#ffffff",

  // Peach — warm accent
  peach: "#e7d8ca",
  peachLight: "#fdefd8",
  peachBorder: "#d9c5b2",
  peachText: "#5a3e2b",

  // Module colours
  mindfulness: "#9cbacf", // Module 1 — blue
  distressTolerance: "#dda98b", // Module 2 — terracotta
  emotionRegulation: "#b59ab8", // Module 3 — lilac
  interpersonal: "#ddc88b", // Module 4 — gold

  // Card backgrounds
  cardLearning: "#c9bdd4", // lilac
  cardSkills: "#c8dbd6", // sage
  cardMood: "#fdefd8", // warm peach
  cardCommunity: "#f5dfc8", // apricot

  // Text
  textDark: "#222222",
  textMid: "#6b6b6b",
  textLight: "#9b9b9b",
  textPlaceholder: "#c4c4c4",

  // Borders
  borderLight: "#e0d5cc",
  borderMid: "#d9c5b2",

  // Status
  success: "#5b7d74",
  warning: "#dda98b",
  danger: "#c04040",
  dangerLight: "#f0c4c4",

  // Neutral
  lightGrey: "#c4c4c4",
  mist: "#dce5e1",
};

export const fonts = {
  heading: "AtkinsonHyperlegible",
  body: "Inter",
};

export const fontSizes = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
};

export const spacing = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 28,
  full: 9999,
};

export const modules = {
  mindfulness: {
    name: "Mindfulness",
    colour: colours.mindfulness,
    cardColour: "#d6e8f5",
    textColour: "#4a7a94",
    number: 1,
  },
  distressTolerance: {
    name: "Distress Tolerance",
    colour: colours.distressTolerance,
    cardColour: "#fdefd8",
    textColour: "#a05c35",
    number: 2,
  },
  emotionRegulation: {
    name: "Emotion Regulation",
    colour: colours.emotionRegulation,
    cardColour: "#f0ebf4",
    textColour: "#7a5a7d",
    number: 3,
  },
  interpersonal: {
    name: "Interpersonal Effectiveness",
    colour: colours.interpersonal,
    cardColour: "#fdf6e3",
    textColour: "#9a7c2a",
    number: 4,
  },
};

// Touch target minimum — WCAG and neurodiversity requirement
export const minTouchTarget = 44;
