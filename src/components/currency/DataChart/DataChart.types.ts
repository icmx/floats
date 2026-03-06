export type Series = {
  name: string;
  data: [number, number][];
}[];

export type DataChartProps = {
  series: Series;
};
