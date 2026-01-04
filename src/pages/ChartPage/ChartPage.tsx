import type { FunctionComponent } from 'react';
import { useCurrencies } from '../../api/client';
import { useSymbolCards } from '../../hooks/useSymbolCardsStore';

export const ChartPage: FunctionComponent = () => {
  const report = useCurrencies();
  const symbolCards = useSymbolCards();

  return (
    <>
      <title>floats - Chart</title>
      <p>Chart Page</p>
      <pre>{report}</pre>
      <pre>data = {JSON.stringify(symbolCards, null, 2)}</pre>
    </>
  );
};
