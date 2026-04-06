import { describe, expect, it } from 'vitest';
import { classNames } from './lib/classNames';

// @todo: Remove this later
describe('Vitest testing framework', () => {
  it('should test at least one app utility function', () => {
    const className = classNames(['hello', 'world']);

    expect(className).toBe('hello world');
  });
});
