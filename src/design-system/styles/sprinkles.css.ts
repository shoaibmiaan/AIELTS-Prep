// src/design-system/styles/sprinkles.css.ts
import { createSprinkles, defineProperties, defineShorthandProperties } from '@vanilla-extract/sprinkles';

const properties = defineProperties({
  spacing: ['4px', '8px', '16px', '32px'],
  color: ['#0ea5e9', '#0369a1', '#ffffff', '#0f172a'],
});

export const sprinkles = createSprinkles(properties);
