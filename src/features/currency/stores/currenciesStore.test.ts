import {
  type Mock,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { renderHook } from '@testing-library/react';
import { type Results } from '@/types/results';
import { getCurrencies } from '../api/client';
import { createCurrency } from '../lib/currency';
import { type Currency } from '../types';
import {
  loadCurrenciesStore,
  useCurrencies,
  useCurrenciesStore,
} from './currenciesStore';

vi.mock('../api/client');

const getCurrenciesMock = getCurrencies as Mock;

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

describe('loadCurrenciesStore', () => {
  it('should set symbols before fetch resolves', async () => {
    const { promise, resolve } =
      Promise.withResolvers<Results<Currency, unknown>>();

    getCurrenciesMock.mockReturnValue(promise);

    const loadPromise = loadCurrenciesStore(['EURUSD', 'USDJPY']);

    const before = useCurrenciesStore.getState();

    expect(before.activeSymbols).toEqual(['EURUSD', 'USDJPY']);
    expect(before.loadingSymbols).toEqual({
      EURUSD: true,
      USDJPY: true,
    });
    expect(before.currencies).toEqual({});

    resolve([
      { success: true, data: createCurrency('EUR', 'USD', []) },
      { success: true, data: createCurrency('USD', 'JPY', []) },
    ]);

    await loadPromise;

    const after = useCurrenciesStore.getState();

    expect(after.loadingSymbols['EURUSD']).toBe(false);
    expect(after.loadingSymbols['USDJPY']).toBe(false);
    expect(after.currencies['EURUSD']).toBeDefined();
    expect(after.currencies['USDJPY']).toBeDefined();
  });

  it('should store currencies on successful fetch', async () => {
    const currency = createCurrency('EUR', 'USD', []);

    getCurrenciesMock.mockResolvedValue([
      { success: true, data: currency },
    ]);

    await loadCurrenciesStore(['EURUSD']);

    const state = useCurrenciesStore.getState();

    expect(state.currencies['EURUSD']).toEqual(currency);
    expect(state.errorsBySymbol['EURUSD']).toBeUndefined();
    expect(state.loadingSymbols['EURUSD']).toBe(false);
  });

  it('should store errors on failed fetch', async () => {
    const error = new Error('Error mock');

    getCurrenciesMock.mockResolvedValue([{ success: false, error }]);

    await loadCurrenciesStore(['GBPUSD']);

    const state = useCurrenciesStore.getState();

    expect(state.currencies['GBPUSD']).toBeUndefined();
    expect(state.errorsBySymbol['GBPUSD']).toBe(error);
    expect(state.loadingSymbols['GBPUSD']).toBe(false);
  });

  it('should handle mixed success and failure fetches', async () => {
    const data = createCurrency('EUR', 'USD', []);
    const error = new Error('fail');

    getCurrenciesMock.mockResolvedValue([
      { success: true, data },
      { success: false, error },
    ]);

    await loadCurrenciesStore(['EURUSD', 'GBPJPY']);

    const state = useCurrenciesStore.getState();

    expect(state.currencies['EURUSD']).toEqual(data);
    expect(state.errorsBySymbol['GBPJPY']).toBe(error);
  });

  it('should not re-fetch symbols that already loaded', async () => {
    const currency = createCurrency('EUR', 'USD', []);

    useCurrenciesStore.setState({
      currencies: { ['EURUSD']: currency },
    });

    getCurrenciesMock.mockResolvedValue([
      { success: true, data: createCurrency('USD', 'JPY', []) },
    ]);

    await loadCurrenciesStore(['EURUSD', 'USDJPY']);

    expect(getCurrenciesMock).toHaveBeenCalledTimes(1);
    expect(getCurrenciesMock).toHaveBeenCalledWith(['USDJPY']);
  });

  it('should not re-fetch symbols that currently loading', async () => {
    const { promise } =
      Promise.withResolvers<Results<Currency, unknown>>();

    getCurrenciesMock.mockReturnValue(promise);

    loadCurrenciesStore(['EURUSD']);

    getCurrenciesMock.mockResolvedValue([]);

    await loadCurrenciesStore(['EURUSD']);

    expect(getCurrenciesMock).toHaveBeenCalledTimes(1);
  });

  it('should skip fetching when all symbols are already cached', async () => {
    useCurrenciesStore.setState({
      currencies: {
        ['EURUSD']: createCurrency('EUR', 'USD', []),
      },
    });

    await loadCurrenciesStore(['EURUSD']);

    expect(getCurrenciesMock).not.toHaveBeenCalled();
    expect(useCurrenciesStore.getState().activeSymbols).toEqual([
      'EURUSD',
    ]);
  });

  it('should update activeSymbols when no fetch is needed', async () => {
    useCurrenciesStore.setState({
      currencies: {
        ['EURUSD']: createCurrency('EUR', 'USD', []),
        ['USDJPY']: createCurrency('USD', 'JPY', []),
      },
      activeSymbols: ['EURUSD'],
    });

    await loadCurrenciesStore(['EURUSD', 'USDJPY']);

    expect(useCurrenciesStore.getState().activeSymbols).toEqual([
      'EURUSD',
      'USDJPY',
    ]);
  });

  it('should clear previous error when re-fetching succeeds', async () => {
    useCurrenciesStore.setState({
      errorsBySymbol: {
        ['EURUSD']: new Error('Error mock'),
      },
    });

    getCurrenciesMock.mockResolvedValue([
      { success: true, data: createCurrency('EUR', 'USD', []) },
    ]);

    await loadCurrenciesStore(['EURUSD']);

    const state = useCurrenciesStore.getState();

    expect(state.errorsBySymbol['EURUSD']).toBeUndefined();
    expect(state.currencies['EURUSD']).toBeDefined();
  });
});

describe('useCurrencies', () => {
  it('returns empty state initially', () => {
    const { result } = renderHook(() => useCurrencies());

    expect(result.current.entries).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.errors).toEqual([]);
  });
});
