import { useEffect, type FunctionComponent } from 'react';
import { ErrorCallout } from '../../components/currency/ErrorCallout';
import { Plotter } from '../../components/currency/Plotter';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useSymbolsFromQueryParam } from '../../hooks/useSymbolsFromQueryParam';
import { usePageStore } from './ChartPage.store';

export const ChartPage: FunctionComponent = () => {
  const { symbols, error: paramError } = useSymbolsFromQueryParam();

  const { error: storeError, data } = usePageStore();
  const load = usePageStore((state) => state.load);

  const error = paramError || storeError || null;

  useEffect(() => {
    load(symbols);
  }, [load, symbols]);

  return (
    <>
      <SymbolChips />

      {error && <ErrorCallout error={error} />}

      <Plotter series={data.series} />
    </>
  );
};
