export const formatToIsoDate = (dateInit: string | number): string => {
  return new Date(dateInit).toISOString().slice(0, 10);
};

export const formatToIsoDateTime = (
  dateInit: string | number
): string => {
  return new Date(dateInit).toJSON().slice(0, 16).replace('T', ' ');
};
