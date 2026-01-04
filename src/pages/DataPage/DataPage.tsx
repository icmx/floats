import type { FunctionComponent } from 'react';
import { useCurrencies } from '../../api/client';
import { usePairCards } from '../../hooks/usePairCardsStore';

export const DataPage: FunctionComponent = () => {
  const report = useCurrencies();
  const pairCards = usePairCards();

  return (
    <>
      <title>floats - Data</title>
      <p>Data Page</p>
      <pre>{report}</pre>
      <pre>data = {JSON.stringify(pairCards, null, 2)}</pre>
    </>
  );
};
