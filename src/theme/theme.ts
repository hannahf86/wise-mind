// Wise Mind Design System
// All colours, fonts, spacing and module colours in one place.
//
// Updated to the new brand kit (jade palette, Poppins headings, Atkinson body).
// Existing token NAMES are all preserved so screens that already import them keep
// working — only their VALUES have been retuned to the new brand. New semantic
// tokens (jade, softMint, canvas, etc.) are added below for the redesigned screens.

export const colours = {
  // Primary brand — jade
  // NOTE: `teal` is kept as the name older screens use; it now resolves to jade.
  teal: "#1E7158", // Jade primary
  tealDark: "#1C3830", // Forest dark
  tealLight: "#E7F4F0", // Soft mint

  // New brand primary tokens (preferred names going forward)
  jade: "#1E7158",
  jadeMid: "#1AA086",
  softMint: "#E7F4F0",
  mint50: "#F1FAF7",
  forestDark: "#1C3830",

  // Surfaces
  background: "#F5F3F1", // Warm off-white canvas
  canvas: "#EDECE9",
  card: "#FFFFFF",
  white: "#FFFFFF",

  // Warm neutrals (kept under the old "peach" names used by other screens)
  peach: "#EDE7E0",
  peachLight: "#F5E8E4",
  peachBorder: "#E8E1D9",
  peachText: "#6A6560",

  // Module colours (new brand)
  mindfulness: "#4A7B50", // Module 1 — green
  distressTolerance: "#4A7A94", // Module 2 — blue
  emotionRegulation: "#B06A50", // Module 3 — terracotta
  interpersonal: "#A74C30", // Module 4 — clay

  // Card backgrounds (soft tints)
  cardLearning: "#E7F4F0",
  cardSkills: "#F1FAF7",
  cardMood: "#F5F0EA",
  cardCommunity: "#F5E8E4",

  // Text
  textDark: "#1D2B25", // Text primary
  textBody: "#4A4740",
  textMid: "#6A6560", // Text secondary
  textLight: "#9A9590",
  textSecondary: "#6A6560",
  textPlaceholder: "#9A9590",

  // Borders
  borderLight: "#E8E1D9", // Card border
  borderMid: "#D1C8C0", // Input border
  borderCard: "#E8E1D9",
  borderInput: "#D1C8C0",

  // Status (no pure red anywhere — danger is a warm clay)
  success: "#4A9950",
  warning: "#C17B28",
  danger: "#9B3820",
  dangerLight: "#F5E8E4",

  // Accent
  favouriteGold: "#C49B30",

  // Neutral
  lightGrey: "#9A9590",
  mist: "#EDECE9",

  // Blues (kept for older screens; retuned to brand)
  skyLight: "#E7F4F0",
  skyText: "#1E7158",
};

// Fonts
// Headings: Poppins (loaded as weighted families so bold actually renders on Android).
// Body: Atkinson Hyperlegible (chosen for neurodivergent readability).
// `heading` and `body` are the names existing screens use.
export const fonts = {
  heading: "Poppins_600SemiBold",
  headingBold: "Poppins_700Bold",
  headingMedium: "Poppins_500Medium",
  headingRegular: "Poppins_400Regular",
  body: "AtkinsonHyperlegible",
  bodyBold: "AtkinsonHyperlegible_Bold",
};

// Type scale (new brand)
export const fontSizes = {
  xs: 11,
  sm: 12,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
};

// Spacing scale (new brand)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 32,
};

// Corner radius (new brand)
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const modules = {
  mindfulness: {
    name: "Mindfulness",
    colour: colours.mindfulness,
    cardColour: "#E7F4F0",
    textColour: "#4A7B50",
    number: 1,
  },
  distressTolerance: {
    name: "Distress Tolerance",
    colour: colours.distressTolerance,
    cardColour: "#E8F0F4",
    textColour: "#3C6377",
    number: 2,
  },
  emotionRegulation: {
    name: "Emotion Regulation",
    colour: colours.emotionRegulation,
    cardColour: "#F5E8E2",
    textColour: "#8F5340",
    number: 3,
  },
  interpersonal: {
    name: "Interpersonal Effectiveness",
    colour: colours.interpersonal,
    cardColour: "#F5E4DE",
    textColour: "#8A3E27",
    number: 4,
  },
};

// Touch target minimum — WCAG and neurodiversity requirement
export const minTouchTarget = 44;
