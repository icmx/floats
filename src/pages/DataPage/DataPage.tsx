import type { FunctionComponent } from 'react';
import { useCurrencies } from '../../api/client';
import { useSymbolCards } from '../../hooks/useSymbolCardsStore';

export const DataPage: FunctionComponent = () => {
  const report = useCurrencies();
  const symbolCards = useSymbolCards();

  return (
    <>
      <title>floats - Data</title>
      <p>Data Page</p>
      <pre>{report}</pre>
      <pre>data = {JSON.stringify(symbolCards, null, 2)}</pre>
    </>
  );
};
