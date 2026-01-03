import type { FunctionComponent } from 'react';
import { usePairCards } from '../../hooks/usePairCardsStore';

export const DataPage: FunctionComponent = () => {
  const pairCards = usePairCards();

  return (
    <>
      <title>floats - Data</title>
      <p>Data Page</p>
      <pre>data = {JSON.stringify(pairCards, null, 2)}</pre>
    </>
  );
};
