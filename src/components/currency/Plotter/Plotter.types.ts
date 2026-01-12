export type Series = {
  name: string;
  data: [number, number][];
}[];

export type PlotterProps = {
  series: Series;
};
