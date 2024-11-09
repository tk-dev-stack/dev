export enum StringTypes {
    Uppercase = "uppercase",
    Lowercase = "lowercase ",
  Sentencecase = "sentenceCase",
}

export const StringTypeOptions = Object.entries(StringTypes).map(([key, value]) => ({
  value,
  label: key,
}));
