import type { FunctionComponent } from 'react';
import { usePairCards } from '../../hooks/usePairCardsStore';

export const ChartPage: FunctionComponent = () => {
  const pairCards = usePairCards();

  return (
    <>
      <title>floats - Chart</title>
      <p>Chart Page</p>
      <pre>data = {JSON.stringify(pairCards, null, 2)}</pre>
    </>
  );
};
