import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCurrenciesStore } from './currenciesStore';

beforeEach(() => {
  useCurrenciesStore.setState({
    currencies: {},
    activeSymbols: [],
    loadingSymbols: {},
    errorsBySymbol: {},
  });

  vi.clearAllMocks();
});

describe('useCurrenciesStore initial value', () => {
  it('should have empty defaults', () => {
    const state = useCurrenciesStore.getState();

    expect(state.currencies).toEqual({});
    expect(state.activeSymbols).toEqual([]);
    expect(state.loadingSymbols).toEqual({});
    expect(state.errorsBySymbol).toEqual({});
  });
});
