import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import ArrowIcon from '../meetingSelector/ArrowIcon.vue';

describe('ArrowIcon', () => {
  it.each(['up', 'down', 'left', 'right'] as const)(
    'renders correct class for direction "%s"',
    (direction) => {
      render(ArrowIcon, {
        props: { direction },
      });
      const icon = screen.getByRole('img');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('meeting-selector__icon');
      expect(icon).toHaveClass(`meeting-selector__icon-${direction}`);
    },
  );
});
