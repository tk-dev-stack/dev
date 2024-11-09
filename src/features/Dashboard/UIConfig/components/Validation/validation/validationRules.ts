export const getValidationRules = (validationType:string) => {
  switch (validationType) {
    case "numeric":
      return [
        { required: true, message: "value is required." },
        { pattern: /^\d+$/, message: "value must be numeric." },
      ];
    case "alphabet":
      return [
        { required: true, message: "value is required." },
        {
          pattern: /^[A-Za-z]+$/,
          message: "value must contain only letters.",
        },
      ];
    case "alphanumeric":
      return [
        { required: true, message: "value is required." },
        {
          pattern: /^[A-Za-z0-9]+$/,
          message: "value must be alphanumeric.",
        },
      ];
    case "lowercase":
      return [
        { required: true, message: "value is required." },
        {
          pattern: /^[a-z]+$/,
          message: "value must be lowercase letters only.",
        },
      ];
    case "uppercase":
      return [
        { required: true, message: "value is required." },
        {
          pattern: /^[A-Z]+$/,
          message: "value must be uppercase letters only.",
        },
      ];
    case "capitalized":
      return [
        { required: true, message: "value is required." },
        {
          pattern: /^[A-Z][a-z]*$/,
          message:
            "value must start with a capital letter, followed by lowercase letters.",
        },
      ];
    default:
      return [{ required: true, message: "value is required." }];
  }
};

 export enum ValidationType {
  Numeric = "numeric",
  Alphabet = "alphabet",
  Alphanumeric = "alphanumeric",
  Lowercase = "lowercase",
  Uppercase = "uppercase",
  Capitalized = "capitalized",
}

export const validationOptions = Object.values(ValidationType).map((type) => ({
  label: type.charAt(0).toUpperCase() + type.slice(1),
  value: type,
}));
