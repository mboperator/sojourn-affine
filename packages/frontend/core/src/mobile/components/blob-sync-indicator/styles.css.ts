import { bodyRegular } from '@toeverything/theme/typography';
import { cssVarV2 } from '@toeverything/theme/v2';
import { style } from '@vanilla-extract/css';

export const indicator = style([
  bodyRegular,
  {
    position: 'fixed',
    bottom: 80, // above AppTabs
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
    padding: '6px 16px',
    borderRadius: 20,
    fontSize: 13,
    lineHeight: '18px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    opacity: 0.92,

    selectors: {
      '&[data-variant="offline"]': {
        background: cssVarV2('layer/background/hoverOverlay'),
        color: cssVarV2('text/primary'),
      },
      '&[data-variant="syncing"]': {
        background: cssVarV2('layer/background/hoverOverlay'),
        color: cssVarV2('text/secondary'),
      },
      '&[data-variant="error"]': {
        background: cssVarV2('status/error'),
        color: cssVarV2('button/pureWhiteText'),
      },
    },
  },
]);

export const message = style({
  display: 'inline-block',
});
