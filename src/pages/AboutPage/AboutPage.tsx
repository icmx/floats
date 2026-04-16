import { type FunctionComponent } from 'react';
import { BuildPlate } from '@/components/BuildPlate';

export const AboutPage: FunctionComponent = () => {
  return (
    <>
      <section>
        <h2>Floats</h2>
        <p>(WIP) Currency explorer app built with React.</p>
        <p>
          <BuildPlate />
        </p>
      </section>
    </>
  );
};
