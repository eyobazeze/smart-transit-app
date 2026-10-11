// Design tokens pulled directly from the Figma file
export const colors = {
  primary800: '#2a86ff',
  primary50: '#f3faff',
  grey600: '#4d5461',
  grey400: '#9ea2ae',
  grey300: '#d2d5db',
  grey200: '#e5e7ea',
  red500: '#ee443f',
  black: '#000000',
  white: '#ffffff',
};

export const typography = {
  h4: { fontFamily: 'Inter_600SemiBold', fontSize: 28, lineHeight: 34 },
  s1: { fontFamily: 'Inter_500Medium', fontSize: 18, lineHeight: 30 },
  s2: { fontFamily: 'Inter_600SemiBold', fontSize: 16, lineHeight: 24 },
  b1: { fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 24 },
  b2: { fontFamily: 'Inter_500Medium', fontSize: 16, lineHeight: 24 },
  b3: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
  b4: { fontFamily: 'Inter_500Medium', fontSize: 14, lineHeight: 20 },
  c2: { fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 16 },
};

// ---- Extended tokens (added in the UI pass; the original keys above are unchanged) ----
Object.assign(colors, {
  primary900: '#1658d6',
  primary700: '#4a9bff',
  primary100: '#e3f0ff',
  bg: '#f4f8fd',
  ink: '#0f1a2b',
  success: '#17a673',
  successSoft: '#e4f7ef',
  warn: '#f5a623',
  warnSoft: '#fff3dc',
  redSoft: '#fdebea',
});

export const gradients = {
  primary: ['#4aa0ff', '#2a86ff', '#1a63e6'],
  hero: ['#2f8bff', '#1a63e6', '#1553c4'],
  soft: ['#ffffff', '#f4f8fd'],
};

export const radius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 };
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const shadow = {
  card: {
    shadowColor: '#10306b', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 3,
  },
  float: {
    shadowColor: '#10306b', shadowOpacity: 0.16, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 10,
  },
  button: {
    shadowColor: '#1a63e6', shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
};

typography.display = { fontFamily: 'Inter_700Bold', fontSize: 30, lineHeight: 36 };
typography.h5 = { fontFamily: 'Inter_700Bold', fontSize: 20, lineHeight: 26 };
typography.label = { fontFamily: 'Inter_600SemiBold', fontSize: 12, lineHeight: 16, letterSpacing: 0.4 };
