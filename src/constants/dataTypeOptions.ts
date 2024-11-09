export enum DataTypes {
  String = "string",
  Integer = "integer",
  Decimal = "decimal",
  Boolean = "boolean",
  Date = "date",
  Amount = "amount",
  Time = "time",
  Phone = "phone",
  ZipCode = "zipCode",
  Email = "email",
}

export const dataTypesOptions = Object.entries(DataTypes).map(
  ([key, value]) => ({
    value,
    label: key,
  })
);
