import { Platform, StyleSheet } from 'react-native';

const baseUnit = 8;

export const Sizing = {
  baseUnit,
  
  // ============================================
  // SPACING - 8pt Grid System
  // ============================================
  spacing: {
    none: 0,
    xxs: baseUnit * 0.25,  // 2px
    xs: baseUnit * 0.5,    // 4px
    s: baseUnit,           // 8px
    m: baseUnit * 1.5,     // 12px
    l: baseUnit * 2,       // 16px
    xl: baseUnit * 3,      // 24px
    xxl: baseUnit * 4,     // 32px
    xxxl: baseUnit * 6,    // 48px
  },

  padding: {
    none: 0,
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
    xxxl: baseUnit * 6,
  },

  margin: {
    none: 0,
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
    xxxl: baseUnit * 6,
  },

  gap: {
    none: 0,
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
    xxxl: baseUnit * 6,
  },

  // ============================================
  // TYPOGRAPHY
  // ============================================
  typography: {
    fontSize: {
      xxs: 10,
      xs: 12,
      s: 14,
      m: 16,
      l: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
      wider: 1,
      widest: 2,
    },
  },

  // ============================================
  // BORDER RADIUS
  // ============================================
  borderRadius: {
    none: 0,
    xxs: 2,
    xs: 4,
    s: 6,
    m: 8,
    l: 12,
    xl: 16,
    xxl: 24,
    small: 7,
    large: 13,
    round: 9999,
  },

  // ============================================
  // BORDER WIDTH
  // ============================================
  borderWidth: {
    none: 0,
    hairline: 1,
    xs: 0.5,
    s: 1,
    m: 1.5,
    l: 2,
    xl: 3,
    xxl: 4,
  },

  // ============================================
  // WIDTH & HEIGHT
  // ============================================
  width: {
    xxs: 20,
    xs: 32,
    s: 48,
    m: 64,
    l: 80,
    xl: 120,
    xxl: 160,
    xxxl: 240,
    full: '100%',
    half: '50%',
    third: '33.333%',
    quarter: '25%',
    auto: 'auto',
  },

  height: {
    xxs: 20,
    xs: 32,
    s: 48,
    m: 64,
    l: 80,
    xl: 120,
    xxl: 160,
    xxxl: 240,
    full: '100%',
    half: '50%',
    third: '33.333%',
    quarter: '25%',
    auto: 'auto',
  },

  minWidth: {
    xxs: 20,
    xs: 40,
    s: 60,
    m: 80,
    l: 120,
    xl: 200,
    xxl: 300,
  },

  maxWidth: {
    xs: 200,
    s: 300,
    m: 400,
    l: 500,
    xl: 600,
    xxl: 800,
    xxxl: 1200,
  },

  minHeight: {
    xxs: 20,
    xs: 32,
    s: 40,
    m: 56,
    l: 64,
    xl: 80,
    xxl: 120,
  },

  maxHeight: {
    xs: 200,
    s: 300,
    m: 400,
    l: 500,
    xl: 600,
    xxl: 800,
    xxxl: 1200,
  },

  // ============================================
  // ICON SIZES
  // ============================================
  icon: {
    xxs: 12,
    xs: 16,
    s: 20,
    m: 24,
    l: 32,
    xl: 40,
    xxl: 48,
    xxxl: 64,
  },

  // ============================================
  // AVATAR SIZES
  // ============================================
  avatar: {
    xxs: 20,
    xs: 24,
    s: 32,
    m: 40,
    l: 48,
    xl: 64,
    xxl: 80,
    xxxl: 120,
  },

  // ============================================
  // BUTTON SIZES
  // ============================================
  button: {
    height: {
      xxs: 28,
      xs: 32,
      small: 36,
      medium: 44,
      large: 52,
      xl: 60,
    },
    width: {
      auto: 'auto',
      full: '100%',
      small: 80,
      medium: 120,
      large: 160,
    },
    padding: {
      horizontal: {
        xxs: 8,
        xs: 12,
        small: 16,
        medium: 24,
        large: 32,
        xl: 40,
      },
      vertical: {
        xxs: 4,
        xs: 6,
        small: 8,
        medium: 12,
        large: 16,
        xl: 20,
      },
    },
    fontSize: {
      xxs: 10,
      xs: 12,
      small: 14,
      medium: 16,
      large: 18,
      xl: 20,
    },
    borderRadius: {
      xs: 4,
      s: 6,
      m: 8,
      l: 12,
      xl: 16,
      round: 9999,
    },
  },

  // ============================================
  // INPUT FIELD SIZES
  // ============================================
  input: {
    height: {
      xxs: 32,
      xs: 36,
      small: 40,
      medium: 56,
      large: 64,
      xl: 72,
    },
    width: {
      auto: 'auto',
      full: '100%',
      small: 120,
      medium: 200,
      large: 300,
    },
    padding: {
      horizontal: {
        xs: 8,
        s: 12,
        m: 16,
        l: 20,
      },
      vertical: {
        xs: 8,
        s: 10,
        m: 12,
        l: 16,
      },
    },
    borderRadius: {
      xs: 4,
      s: 6,
      m: 8,
      l: 12,
    },
    borderWidth: {
      s: 1,
      m: 1.5,
      l: 2,
    },
    fontSize: {
      xs: 12,
      s: 14,
      m: 16,
      l: 18,
    },
    minHeight: {
      xs: 40,
      s: 56,
      m: 80,
      l: 120,
    },
  },

  // ============================================
  // CARD SIZES
  // ============================================
  card: {
    padding: {
      xxs: 8,
      xs: 12,
      small: 12,
      medium: 16,
      large: 20,
      xl: 24,
      xxl: 32,
    },
    borderRadius: {
      xs: 4,
      s: 8,
      m: 12,
      l: 16,
      xl: 20,
      xxl: 24,
    },
    gap: {
      xs: 4,
      s: 8,
      m: 12,
      l: 16,
      xl: 24,
    },
    width: {
      full: '100%',
      half: '50%',
      third: '33.333%',
      auto: 'auto',
      small: '85%',
      medium: '92%',
      large: '100%',
    },
    minHeight: {
      xs: 80,
      s: 120,
      m: 160,
      l: 200,
      small: 120,
      medium: 160,
      large: 200,
    },
  },

  // ============================================
  // MODAL & DIALOG SIZES
  // ============================================
  modal: {
    width: {
      small: '80%',
      medium: '90%',
      large: '95%',
      full: '100%',
    },
    maxWidth: {
      xs: 280,
      small: 300,
      medium: 400,
      large: 500,
      xl: 600,
      xxl: 800,
    },
    maxHeight: {
      xs: 250,
      small: 300,
      medium: 400,
      large: 600,
      xl: 800,
    },
    minWidth: {
      xs: 200,
      s: 250,
      m: 300,
      l: 400,
    },
    padding: {
      xs: 12,
      s: 16,
      m: 20,
      l: 24,
      xl: 32,
    },
    borderRadius: {
      s: 12,
      m: 16,
      l: 20,
      xl: 24,
    },
    backdropOpacity: {
      light: 0.3,
      medium: 0.5,
      dark: 0.7,
    },
  },

  // ============================================
  // SNACKBAR SIZES
  // ============================================
  snackbar: {
    minHeight: {
      xs: 48,
      s: 56,
      m: 60,
      l: 72,
    },
    padding: {
      horizontal: {
        xs: 12,
        s: 14,
        m: 16,
        l: 20,
      },
      vertical: {
        xs: 10,
        s: 12,
        m: 14,
        l: 16,
      },
    },
    borderRadius: {
      xs: 8,
      s: 10,
      m: 12,
      l: 16,
    },
    iconSize: {
      xs: 24,
      s: 28,
      m: 36,
      l: 40,
    },
    actionButton: {
      paddingHorizontal: {
        xs: 8,
        s: 10,
        m: 12,
        l: 16,
      },
      paddingVertical: {
        xs: 4,
        s: 6,
        m: 8,
        l: 10,
      },
    },
    closeButton: {
      size: {
        xs: 24,
        s: 28,
        m: 32,
        l: 36,
      },
    },
  },

  // ============================================
  // TOUCH TARGET SIZES
  // ============================================
  touchTarget: {
    minimum: 44,
    recommended: 48,
    comfortable: 56,
    large: 64,
  },

  // ============================================
  // SCREEN DIMENSIONS & BREAKPOINTS
  // ============================================
  breakpoints: {
    phone: {
      xxs: 280,
      xs: 320,
      small: 320,
      medium: 375,
      large: 414,
      xl: 480,
    },
    tablet: {
      small: 768,
      medium: 834,
      large: 1024,
      xl: 1280,
    },
    desktop: {
      small: 1280,
      medium: 1440,
      large: 1920,
      xl: 2560,
    },
  },

  // ============================================
  // Z-INDEX LAYERS
  // ============================================
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
    snackbar: 99999,
  },

  // ============================================
  // HEADER SIZES
  // ============================================
  header: {
    height: {
      compact: 44,
      normal: 56,
      large: 64,
      xl: 72,
    },
    padding: {
      horizontal: {
        xs: 12,
        s: 14,
        m: 16,
        l: 20,
      },
      vertical: {
        xs: 8,
        s: 10,
        m: 12,
        l: 16,
      },
    },
    iconSize: {
      xs: 24,
      s: 28,
      m: 32,
      l: 36,
    },
    backButtonSize: {
      xs: 28,
      s: 30,
      m: 32,
      l: 36,
    },
  },

  // ============================================
  // LIST ITEM SIZES
  // ============================================
  listItem: {
    height: {
      xxs: 40,
      xs: 44,
      small: 48,
      medium: 56,
      large: 64,
      xl: 72,
    },
    padding: {
      horizontal: {
        xs: 12,
        s: 14,
        m: 16,
        l: 20,
      },
      vertical: {
        xs: 8,
        s: 10,
        m: 12,
        l: 16,
      },
    },
    iconSize: {
      xs: 20,
      s: 22,
      m: 24,
      l: 28,
    },
    avatarSize: {
      xs: 32,
      s: 36,
      m: 40,
      l: 48,
    },
  },

  // ============================================
  // BADGE SIZES
  // ============================================
  badge: {
    height: {
      xxs: 14,
      xs: 16,
      small: 16,
      medium: 20,
      large: 24,
      xl: 28,
    },
    padding: {
      horizontal: {
        xxs: 2,
        xs: 4,
        small: 4,
        medium: 6,
        large: 8,
        xl: 12,
      },
    },
    borderRadius: {
      small: 7,
      large: 13,
    },
    fontSize: {
      xxs: 8,
      xs: 10,
      small: 10,
      medium: 12,
      large: 14,
    },
  },

  // ============================================
  // DIVIDER SIZES
  // ============================================
  divider: {
    height: {
      hairline: 1,
      thin: 1,
      medium: 2,
      thick: 4,
    },
    margin: {
      vertical: {
        xs: 4,
        s: 6,
        m: 8,
        l: 12,
      },
      horizontal: {
        xs: 8,
        s: 12,
        m: 16,
        l: 24,
      },
    },
    hidden: {
      width: 0,
      height: 0,
      opacity: 0,
    },
    invisible: {
      width: 0,
      height: 0,
      opacity: 0,
    },
  },

  // ============================================
  // TAB BAR SIZES
  // ============================================
  tabBar: {
    height: {
      compact: 48,
      normal: 56,
      large: 64,
    },
    iconSize: {
      xs: 20,
      s: 22,
      m: 24,
      l: 28,
    },
    labelFontSize: {
      xs: 10,
      s: 11,
      m: 12,
      l: 14,
    },
    padding: {
      vertical: {
        xs: 4,
        s: 6,
        m: 8,
        l: 12,
      },
    },
  },

  // ============================================
  // PARALLAX HEADER SIZES
  // ============================================
  parallax: {
    headerHeight: {
      small: 200,
      medium: 250,
      large: 300,
      xl: 400,
    },
    padding: {
      xs: 16,
      s: 20,
      m: 32,
      l: 40,
    },
  },

  // ============================================
  // ASPECT RATIO
  // ============================================
  aspectRatio: {
    square: 1,
    portrait: 0.75,
    landscape: 1.33,
    wide: 1.77,
    ultrawide: 2.35,
    golden: 1.618,
  },

  // ============================================
  // OPACITY
  // ============================================
  opacity: {
    transparent: 0,
    invisible: 0.1,
    disabled: 0.3,
    xs: 0.3,
    s: 0.5,
    hover: 0.7,
    m: 0.6,
    l: 0.7,
    active: 0.8,
    xl: 0.8,
    xxl: 0.9,
    normal: 1,
    full: 1,
  },

  // ============================================
  // SPACER
  // ============================================
  spacer: {
    none: 0,
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
    xxxl: baseUnit * 6,
  },

  // ============================================
  // GRID
  // ============================================
  grid: {
    columns: {
      phone: 2,
      tablet: 3,
      desktop: 4,
    },
    gap: {
      xs: 4,
      s: 8,
      m: 12,
      l: 16,
      xl: 24,
    },
  },

  // ============================================
  // SAFE AREA
  // ============================================
  safeArea: {
    top: Platform.OS === 'ios' ? 44 : 0,
    bottom: Platform.OS === 'ios' ? 34 : 0,
    left: 0,
    right: 0,
  },

  // ============================================
  // ANIMATION
  // ============================================
  animation: {
    duration: {
      instant: 0,
      fast: 200,
      normal: 300,
      slow: 500,
      verySlow: 1000,
    },
    delay: {
      none: 0,
      short: 100,
      medium: 200,
      long: 500,
    },
  },

  // ============================================
  // DIRECTIONAL SPACING (RTL AWARE)
  // ============================================
  paddingStart: {
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
    xxxl: baseUnit * 6,
  },

  paddingEnd: {
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
    xxxl: baseUnit * 6,
  },

  paddingTop: {
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
    xxxl: baseUnit * 6,
  },

  paddingBottom: {
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
    xxxl: baseUnit * 6,
  },

  paddingLeft: {
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
    xxxl: baseUnit * 6,
  },

  paddingRight: {
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
    xxxl: baseUnit * 6,
  },

  marginStart: {
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
    xxxl: baseUnit * 6,
  },

  marginEnd: {
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
    xxxl: baseUnit * 6,
  },

  marginTop: {
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
    xxxl: baseUnit * 6,
  },

  marginBottom: {
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
    xxxl: baseUnit * 6,
  },

  marginLeft: {
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
    xxxl: baseUnit * 6,
  },

  marginRight: {
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
    xxxl: baseUnit * 6,
  },

  rowGap: {
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
    xxxl: baseUnit * 6,
  },

  columnGap: {
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
    xxxl: baseUnit * 6,
  },

  inset: {
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
  },

  offset: {
    xxs: baseUnit * 0.25,
    xs: baseUnit * 0.5,
    s: baseUnit,
    m: baseUnit * 1.5,
    l: baseUnit * 2,
    xl: baseUnit * 3,
    xxl: baseUnit * 4,
  },

  // ============================================
  // FLEX LAYOUT (removed - using flexNumber instead)
  // ============================================

  flexGrow: {
    none: 0,
    small: 0.5,
    normal: 1,
    large: 2,
  },

  flexShrink: {
    none: 0,
    small: 0.5,
    normal: 1,
    large: 2,
  },

  flexBasis: {
    auto: 'auto',
    zero: 0,
    full: '100%',
    half: '50%',
  },

  // ============================================
  // POSITION
  // ============================================
  position: {
    top: {
      xxs: baseUnit * 0.25,
      xs: baseUnit * 0.5,
      s: baseUnit,
      m: baseUnit * 1.5,
      l: baseUnit * 2,
      xl: baseUnit * 3,
      xxl: baseUnit * 4,
    },
    bottom: {
      xxs: baseUnit * 0.25,
      xs: baseUnit * 0.5,
      s: baseUnit,
      m: baseUnit * 1.5,
      l: baseUnit * 2,
      xl: baseUnit * 3,
      xxl: baseUnit * 4,
    },
    left: {
      xxs: baseUnit * 0.25,
      xs: baseUnit * 0.5,
      s: baseUnit,
      m: baseUnit * 1.5,
      l: baseUnit * 2,
      xl: baseUnit * 3,
      xxl: baseUnit * 4,
    },
    right: {
      xxs: baseUnit * 0.25,
      xs: baseUnit * 0.5,
      s: baseUnit,
      m: baseUnit * 1.5,
      l: baseUnit * 2,
      xl: baseUnit * 3,
      xxl: baseUnit * 4,
    },
  },

  // ============================================
  // RESPONSIVE UNITS
  // ============================================
  units: {
    vw: {
      quarter: '25vw',
      third: '33.333vw',
      half: '50vw',
      twoThirds: '66.666vw',
      threeQuarters: '75vw',
      full: '100vw',
    },
    vh: {
      quarter: '25vh',
      third: '33.333vh',
      half: '50vh',
      twoThirds: '66.666vh',
      threeQuarters: '75vh',
      full: '100vh',
    },
    percent: {
      quarter: '25%',
      third: '33.333%',
      half: '50%',
      twoThirds: '66.666%',
      threeQuarters: '75%',
      full: '100%',
    },
    rem: {
      xs: '0.5rem',
      s: '0.75rem',
      m: '1rem',
      l: '1.5rem',
      xl: '2rem',
    },
    em: {
      xs: '0.5em',
      s: '0.75em',
      m: '1em',
      l: '1.5em',
      xl: '2em',
    },
  },

  // ============================================
  // SCREEN & DEVICE MEASUREMENTS
  // ============================================
  screen: {
    width: {
      phone: { min: 320, max: 480 },
      tablet: { min: 768, max: 1024 },
      desktop: { min: 1280, max: 1920 },
    },
    height: {
      phone: { min: 568, max: 896 },
      tablet: { min: 1024, max: 1366 },
      desktop: { min: 720, max: 1080 },
    },
    statusBarHeight: {
      ios: 44,
      android: 24,
      default: 24,
    },
    navigationBarHeight: {
      ios: 0,
      android: 48,
      default: 48,
    },
    keyboardHeight: {
      small: 216,
      medium: 260,
      large: 300,
      extraLarge: 350,
    },
  },

  // ============================================
  // HIT SLOP
  // ============================================
  hitSlop: {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
    xxl: 24,
  },

  // ============================================
  // BORDER WIDTH PER-EDGE
  // ============================================
  borderWidthTop: {
    none: 0,
    hairline: 1,
    s: 1,
    m: 1.5,
    l: 2,
    xl: 3,
  },

  borderWidthBottom: {
    none: 0,
    hairline: 1,
    s: 1,
    m: 1.5,
    l: 2,
    xl: 3,
  },

  borderWidthLeft: {
    none: 0,
    hairline: 1,
    s: 1,
    m: 1.5,
    l: 2,
    xl: 3,
  },

  borderWidthRight: {
    none: 0,
    hairline: 1,
    s: 1,
    m: 1.5,
    l: 2,
    xl: 3,
  },

  // ============================================
  // BORDER RADIUS PER-EDGE (RTL AWARE)
  // ============================================
  borderRadiusTopStart: {
    none: 0,
    xs: 2,
    s: 4,
    m: 8,
    l: 12,
    xl: 16,
  },

  borderRadiusTopEnd: {
    none: 0,
    xs: 2,
    s: 4,
    m: 8,
    l: 12,
    xl: 16,
  },

  borderRadiusBottomStart: {
    none: 0,
    xs: 2,
    s: 4,
    m: 8,
    l: 12,
    xl: 16,
  },

  borderRadiusBottomEnd: {
    none: 0,
    xs: 2,
    s: 4,
    m: 8,
    l: 12,
    xl: 16,
  },

  // ============================================
  // ELEVATION (SHADOW DEPTH)
  // ============================================
  elevation: {
    none: 0,
    xs: 1,
    s: 2,
    m: 3,
    l: 4,
    xl: 5,
    xxl: 8,
    xxxl: 12,
  },

  // ============================================
  // SHADOW OPACITY
  // ============================================
  shadowOpacity: {
    none: 0,
    xs: 0.05,
    s: 0.08,
    m: 0.1,
    l: 0.15,
    xl: 0.2,
    xxl: 0.25,
    xxxl: 0.3,
  },

  // ============================================
  // FLEX VALUES
  // ============================================
  flex: {
    none: 0,
    auto: 'auto' as const,
    full: 1,
    half: 0.5,
    third: 0.33,
    quarter: 0.25,
  },
  flexNumber: {
    none: 0,
    full: 1,
    half: 0.5,
    third: 0.33,
    quarter: 0.25,
  },

  // ============================================
  // LAYOUT PROPERTIES
  // ============================================
  layout: {
    flexDirection: {
      row: 'row',
      column: 'column',
      rowReverse: 'row-reverse',
      columnReverse: 'column-reverse',
    },
    justifyContent: {
      flexStart: 'flex-start',
      flexEnd: 'flex-end',
      center: 'center',
      spaceBetween: 'space-between',
      spaceAround: 'space-around',
      spaceEvenly: 'space-evenly',
    },
    alignItems: {
      flexStart: 'flex-start',
      flexEnd: 'flex-end',
      center: 'center',
      stretch: 'stretch',
      baseline: 'baseline',
    },
    alignSelf: {
      auto: 'auto',
      flexStart: 'flex-start',
      flexEnd: 'flex-end',
      center: 'center',
      stretch: 'stretch',
      baseline: 'baseline',
    },
    textAlign: {
      left: 'left',
      center: 'center',
      right: 'right',
      justify: 'justify',
    },
    overflow: {
      visible: 'visible',
      hidden: 'hidden',
      scroll: 'scroll',
    },
  },


  // ============================================
  // SCROLL & LIST SIZING
  // ============================================
  scroll: {
    padding: {
      xxs: baseUnit * 0.25,
      xs: baseUnit * 0.5,
      s: baseUnit,
      m: baseUnit * 1.5,
      l: baseUnit * 2,
      xl: baseUnit * 3,
      xxl: baseUnit * 4,
    },
    margin: {
      xxs: baseUnit * 0.25,
      xs: baseUnit * 0.5,
      s: baseUnit,
      m: baseUnit * 1.5,
      l: baseUnit * 2,
      xl: baseUnit * 3,
      xxl: baseUnit * 4,
    },
  },

  list: {
    itemSeparatorHeight: {
      none: 0,
      hairline: 1,
      xs: 1,
      s: 2,
      m: 4,
      l: 8,
    },
    sectionGap: {
      xxs: baseUnit * 0.25,
      xs: baseUnit * 0.5,
      s: baseUnit,
      m: baseUnit * 1.5,
      l: baseUnit * 2,
      xl: baseUnit * 3,
      xxl: baseUnit * 4,
      xxxl: baseUnit * 6,
    },
  },
} as const;

