// styles/globalStyles.ts

// Colors
export const COLORS = {
  // Primary Colors
  primary: '#F59E0B', // Orange (used in progress rings, buttons)
  secondary: '#10B981', // Green (used in progress rings, buttons)
  accent: '#9333EA', // Purple (used in buttons)

  // Grayscale
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F7FAFC',
  gray200: '#EDF2F7',
  gray300: '#E2E8F0',
  gray400: '#CBD5E0',
  gray500: '#A0AEC0',
  gray600: '#718096',
  gray700: '#4A5568',
  gray800: '#2D3748',
  gray900: '#1A202C',

  // Yellow Shades
  yellow50: '#FFFAF0',
  yellow100: '#FEEBC8',
  yellow400: '#F6E05E',
  yellow500: '#F59E0B', // Matches primary
  yellow600: '#D69E2E',
  yellow700: '#B7791F',
  yellow900: '#744210',

  // Purple Shades
  purple100: '#FAF5FF',
  purple400: '#B794F4',
  purple600: '#805AD5',
  purple700: '#6B46C1',
  purple900: '#553C9A',

  // Green Shades
  green100: '#F0FFF4',
  green400: '#68D391',
  green600: '#38A169',
  green900: '#2F855A',

  // Orange Shades
  orange100: '#FFFAF0',
  orange400: '#F6AD55',
  orange600: '#DD6B20',
  orange900: '#7B341E',

  // Red Shades
  red: '#EF4444',

  // Social Media Colors
  facebookHover: '#2563EB', // Blue-600
  linkedinHover: '#60A5FA', // Blue-400
  instagramHover: '#7C3AED', // Purple-600

  // Backgrounds
  lightBackground: '#F3E7FA',
  darkBackground: '#1A1A2E',
  slate: '#1A202C',
  bluegray: '#2D3748',
  offwhite: '#F7FAFC',
  lightgray: '#E2E8F0',
  softgray: '#CBD5E0',
};

// Fonts
export const FONT_SIZES = {
  xs: 'text-xs', // 12px
  sm: 'text-sm', // 14px
  base: 'text-base', // 16px
  lg: 'text-lg', // 18px
  xl: 'text-xl', // 20px
  '2xl': 'text-2xl', // 24px
  '3xl': 'text-3xl', // 30px
  '4xl': 'text-4xl', // 36px
  '5xl': 'text-5xl', // 48px
};

export const FONT_WEIGHTS = {
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

// Sizes
export const SIZES = {
  // Padding
  p4: 'p-4', // 16px
  p6: 'p-6', // 24px
  p8: 'p-8', // 32px
  px3: 'px-3', // 12px
  px4: 'px-4', // 16px
  px6: 'px-6', // 24px
  px8: 'px-8', // 32px
  py2: 'py-2', // 8px
  py3: 'py-3', // 12px
  py8: 'py-8', // 32px
  py16: 'py-16', // 64px
  py20: 'py-20', // 80px
  py32: 'py-32', // 128px

  // Margins
  mb1: 'mb-1', // 4px
  mb2: 'mb-2', // 8px
  mb3: 'mb-3', // 12px
  mb4: 'mb-4', // 16px
  mb6: 'mb-6', // 24px
  mb8: 'mb-8', // 32px
  mb12: 'mb-12', // 48px
  mt2: 'mt-2', // 8px
  mt4: 'mt-4', // 16px
  mt10: 'mt-10', // 40px

  // Widths and Heights
  w8: 'w-8', // 32px
  w12: 'w-12', // 48px
  w14: 'w-14', // 56px
  w16: 'w-16', // 64px
  w20: 'w-20', // 80px
  w40: 'w-40', // 160px
  w48: 'w-48', // 192px
  wFull: 'w-full', // 100%
  h2: 'h-2', // 8px
  h8: 'w-8', // 32px
  h12: 'h-12', // 48px
  h14: 'h-14', // 56px
  h16: 'h-16', // 64px
  h20: 'h-20', // 80px
  h40: 'h-40', // 160px

  // Gaps
  gap2: 'gap-2', // 8px
  gap3: 'gap-3', // 12px
  gap4: 'gap-4', // 16px
  gap6: 'gap-6', // 24px
  gap8: 'gap-8', // 32px

  // Container Widths
  maxW2xl: 'max-w-2xl', // 672px
  maxW3xl: 'max-w-3xl', // 768px
  maxW5xl: 'max-w-5xl', // 1280px
  maxWmd: 'max-w-md', // 448px
};

// Layouts
export const LAYOUTS = {
  container: 'container mx-auto',
  flex: 'flex',
  flexCol: 'flex flex-col',
  flexRow: 'flex flex-row',
  itemsCenter: 'items-center',
  justifyBetween: 'justify-between',
  justifyCenter: 'justify-center',
  textCenter: 'text-center',
  grid1: 'grid grid-cols-1',
  grid2: 'grid grid-cols-1 md:grid-cols-2',
  grid3: 'grid grid-cols-1 md:grid-cols-3',
  grid4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  stickyHeader: 'sticky top-0 z-50',
  absolute: 'absolute',
  relative: 'relative',
  fixedFull: 'fixed inset-0',
  overflowHidden: 'overflow-hidden',
  overflowXAuto: 'overflow-x-auto',
  shadowMd: 'shadow-md',
  shadowLg: 'shadow-lg',
  shadowXl: 'shadow-xl',
  roundedMd: 'rounded-md',
  roundedLg: 'rounded-lg',
  roundedXl: 'rounded-xl',
  roundedFull: 'rounded-full',
  border: 'border',
  borderT: 'border-t',
  borderB: 'border-b',
  borderB2: 'border-b-2',
  borderL4: 'border-l-4',
  transitionAll: 'transition-all duration-300',
  transitionColors: 'transition-colors duration-300',
  transitionOpacity: 'transition-opacity',
  transitionShadow: 'transition-shadow',
  animateSpin: 'animate-spin',
  minHScreen: 'min-h-screen',
};

// Component-Specific Styles
export const COMPONENT_STYLES = {
  // Buttons
  primaryButton: `bg-[${COLORS.yellow600}] hover:bg-[${COLORS.yellow700}] text-[${COLORS.white}] ${SIZES.px6} ${SIZES.py2} ${LAYOUTS.roundedMd} ${FONT_WEIGHTS.medium}`,
  secondaryButton: `bg-[${COLORS.white}] hover:bg-[${COLORS.gray100}] text-[${COLORS.yellow600}] ${SIZES.px6} ${SIZES.py2} ${LAYOUTS.roundedMd} ${FONT_WEIGHTS.medium}`,
  disabledButton: `bg-[${COLORS.gray200}] text-[${COLORS.gray500}] ${SIZES.py2} ${LAYOUTS.roundedMd} ${FONT_WEIGHTS.medium} opacity-75 cursor-not-allowed`,
  socialButton: `border-[${COLORS.gray300}] dark:border-[${COLORS.gray600}] bg-[${COLORS.white}] dark:bg-[${COLORS.gray700}] text-[${COLORS.gray500}] dark:text-[${COLORS.gray300}] ${SIZES.py2} ${SIZES.px4} ${LAYOUTS.roundedMd} shadow-sm hover:bg-[${COLORS.gray50}] dark:hover:bg-[${COLORS.gray600}]`,

  // Progress Rings
  progressRingBackground: '#e2e8f0',
  progressRingOverall: '#f59e0b',
  progressRingTarget: '#10b981',
  progressRingListening: '#8b5cf6',
  progressRingReading: '#3b82f6',

  // Feature Cards
  featureCard: `bg-[${COLORS.white}] dark:bg-[${COLORS.gray800}] ${SIZES.p6} ${LAYOUTS.roundedXl} ${LAYOUTS.shadowMd} border-[${COLORS.gray100}] dark:border-[${COLORS.gray800}] ${LAYOUTS.transitionAll}`,
};

// Font Awesome Icons
export const ICONS = {
  edit: 'fas fa-edit',
  microphone: 'fas fa-microphone-alt',
  clock: 'fas fa-clock',
  chartLine: 'fas fa-chart-line',
  users: 'fas fa-users',
  star: 'fas fa-star',
  checkCircle: 'fas fa-check-circle',
  exclamationCircle: 'fas fa-exclamation-circle',
  spinner: 'fas fa-spinner fa-spin',
  commentAlt: 'far fa-comment-alt',
  fire: 'fas fa-fire',
  check: 'fas fa-check',
  times: 'fas fa-times',
  chevronRight: 'fas fa-chevron-right',
  clipboardList: 'fas fa-clipboard-list',
};