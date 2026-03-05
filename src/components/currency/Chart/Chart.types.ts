export type Series = {
  name: string;
  data: [number, number][];
}[];

export type ChartProps = {
  series: Series;
};
