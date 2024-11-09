export enum ComponentSizes {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export const SIZE = Object.entries(ComponentSizes).map(([key, value]) => ({
  value,
  label: key,
}));
