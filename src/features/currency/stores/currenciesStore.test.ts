import {
  type Mock,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
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
  it('should return empty state initially', () => {
    const { result } = renderHook(() => useCurrencies());

    expect(result.current.entries).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.errors).toEqual([]);
  });

  it('should return entries matching activeSymbols', () => {
    const eurUsd = createCurrency('EUR', 'USD', []);
    const usdJpy = createCurrency('USD', 'JPY', []);

    useCurrenciesStore.setState({
      currencies: {
        ['EURUSD']: eurUsd,
        ['USDJPY']: usdJpy,
      },
      activeSymbols: ['EURUSD', 'USDJPY'],
    });

    const { result } = renderHook(() => useCurrencies());

    expect(result.current.entries).toEqual([eurUsd, usdJpy]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.errors).toEqual([]);
  });

  it('should return isLoading when any active symbol is loading', () => {
    useCurrenciesStore.setState({
      activeSymbols: ['EURUSD', 'USDJPY'],
      loadingSymbols: {
        ['EURUSD']: false,
        ['USDJPY']: true,
      },
    });

    const { result } = renderHook(() => useCurrencies());

    expect(result.current.isLoading).toBe(true);
  });

  it('should set isLoading to false when no active symbol is loading', () => {
    useCurrenciesStore.setState({
      activeSymbols: ['EURUSD'],
      loadingSymbols: {
        ['EURUSD']: false,
      },
    });

    const { result } = renderHook(() => useCurrencies());

    expect(result.current.isLoading).toBe(false);
  });

  it('should return errors for active symbols only', () => {
    const error1 = new Error('Error mock 1');
    const error2 = new Error('Error mock 2');

    useCurrenciesStore.setState({
      activeSymbols: ['EURUSD', 'GBPUSD'],
      errorsBySymbol: {
        ['EURUSD']: error1,
        ['GBPUSD']: error2,
        ['USDJPY']: new Error('Error mock 3'), // should ignore inactive symbol
      },
    });

    const { result } = renderHook(() => useCurrencies());

    expect(result.current.errors).toEqual([error1, error2]);
  });

  it('should exclude symbols from entries which are not yet loaded', () => {
    const currency = createCurrency('EUR', 'USD', []);

    useCurrenciesStore.setState({
      currencies: { ['EURUSD']: currency },
      activeSymbols: ['EURUSD', 'USDJPY'],
      loadingSymbols: { ['USDJPY']: true },
    });

    const { result } = renderHook(() => useCurrencies());

    expect(result.current.entries).toEqual([currency]);
    expect(result.current.isLoading).toBe(true);
  });

  it('should react on store changes', async () => {
    const { result } = renderHook(() => useCurrencies());

    expect(result.current.entries).toEqual([]);

    const currency = createCurrency('EUR', 'USD', []);

    useCurrenciesStore.setState({
      currencies: { ['EURUSD']: currency },
      activeSymbols: ['EURUSD'],
      loadingSymbols: { ['EURUSD']: false },
    });

    // slowdown here for await
    await waitFor(() => {
      expect(result.current.entries).toEqual([currency]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should keep entry order based on activeSymbols', () => {
    const eurUsd = createCurrency('EUR', 'USD', []);
    const usdJpy = createCurrency('USD', 'JPY', []);
    const gbpUsd = createCurrency('GBP', 'USD', []);

    useCurrenciesStore.setState({
      currencies: {
        ['EURUSD']: eurUsd,
        ['USDJPY']: usdJpy,
        ['GBPUSD']: gbpUsd,
      },
      activeSymbols: ['GBPUSD', 'USDJPY', 'EURUSD'],
    });

    const { result } = renderHook(() => useCurrencies());

    expect(result.current.entries).toEqual([gbpUsd, usdJpy, eurUsd]);
  });
});
