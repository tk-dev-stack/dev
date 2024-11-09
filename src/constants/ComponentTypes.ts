export enum ComponentTypes {
  LINE = "line",
  CARD = "card",
  EDITABLE_CARD = "editable-card",
}

export const NAVBAR_TYPES = Object.entries(ComponentTypes).map(
  ([key, value]) => ({
    value,
    label: key,
  })
);
