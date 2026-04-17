import { type FunctionComponent } from 'react';
import { BuildPlate } from '@/components/BuildPlate';

export const AboutPage: FunctionComponent = () => {
  return (
    <>
      <section>
        <h2>Floats</h2>
        <p>
          Currency analysis tool for exploring exchange rates, comparing
          multiple pairs, and viewing historical trends over time.
        </p>
        <p>
          <BuildPlate />
        </p>
      </section>
    </>
  );
};
