import type { FunctionComponent } from 'react';
import { useCurrencies } from '../../api/client';
import { usePairCards } from '../../hooks/usePairCardsStore';

export const ChartPage: FunctionComponent = () => {
  const report = useCurrencies();
  const pairCards = usePairCards();

  return (
    <>
      <title>floats - Chart</title>
      <p>Chart Page</p>
      <pre>{report}</pre>
      <pre>data = {JSON.stringify(pairCards, null, 2)}</pre>
    </>
  );
};
