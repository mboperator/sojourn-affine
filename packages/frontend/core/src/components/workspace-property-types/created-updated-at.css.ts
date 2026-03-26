import { cssVarV2 } from '@toeverything/theme/v2';
import { style } from '@vanilla-extract/css';

export const empty = style({
  color: cssVarV2.text.placeholder,
});

export const tooltip = style({
  display: 'inline-block',
  selectors: {
    '&::first-letter': {
      textTransform: 'uppercase',
    },
  },
});

export const mobileDateGroupHeader = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  height: '100%',
});

export const mobileDateGroupHeaderDate = style({
  fontSize: 11,
  lineHeight: '16px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: cssVarV2.text.secondary,
  fontWeight: 500,
});

export const mobileDateGroupHeaderDay = style({
  fontSize: 32,
  lineHeight: '40px',
  fontWeight: 700,
  color: cssVarV2.text.primary,
});

export const dateDocListInlineProperty = style({
  width: 60,
  textAlign: 'center',
  fontSize: 12,
  lineHeight: '20px',
  color: cssVarV2.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flexShrink: 0,
});
