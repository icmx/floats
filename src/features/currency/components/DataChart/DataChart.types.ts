import { type Ref } from 'react';

export type Series = {
  name: string;
  data: [number, number | null][];
};

export type DataChartHandle = {
  scrollToRecent: () => void;
};

export type DataChartProps = {
  series: Series[];
  ref?: Ref<DataChartHandle>;
};
