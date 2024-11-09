export enum InputTypes {
  Number = "number",
  Text = "text",
  Checkbox = "checkbox",
  Dropdown = "dropdown",
  Date = "date",
  Textarea = "textarea",
  Password = "password",
  Email="email",
  ZipCode="zipcode"
}
export const inputTypeOptions = Object.entries(InputTypes).map(
  ([key, value]) => ({
    value,
    label: key,
  })
);
