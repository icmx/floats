export type Series = {
  name: string;
  data: [number, number | null][];
}[];

export type DataChartProps = {
  series: Series;
};
