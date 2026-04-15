import { describe, expect, it } from 'vitest';
import { type RenderResult, render } from '@testing-library/react';
import { YSpacingRow } from './YSpacingRow';

const renderToTable = (ui: React.ReactElement): RenderResult => {
  return render(
    <table>
      <tbody>{ui}</tbody>
    </table>
  );
};

describe('YSpacingRow', () => {
  it('should render a row with the given height', () => {
    const { container } = renderToTable(
      <YSpacingRow colSpan={5} height={200} />
    );

    const tr = container.querySelector('tr');

    expect(tr?.style.height).toBe('200px');
  });

  it('should render a single cell with the correct colSpan', () => {
    const { container } = renderToTable(
      <YSpacingRow colSpan={5} height={100} />
    );

    const td = container.querySelector('td')!;

    expect(td?.colSpan).toBe(5);
  });
});
