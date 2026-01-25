import { useEffect, type FunctionComponent } from 'react';
import { ErrorCallout } from '../../components/currency/ErrorCallout';
import { Plotter } from '../../components/currency/Plotter';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useQueryParams } from '../../hooks/useQueryParams';
import { usePageStore } from './ChartPage.store';

export const ChartPage: FunctionComponent = () => {
  const { by: symbols } = useQueryParams();

  const { error, data } = usePageStore();
  const load = usePageStore((state) => state.load);

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
