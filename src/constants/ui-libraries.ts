const libraries = [
  { value: "antDesign", label: "Ant Design v5.21.3" },
  { value: "materialUI", label: "Material UI v6.1.6", disabled: false },
  { value: "chakraUI", label: "Chakra UI", disabled: true },
];

export enum Libraries {
  antDesign = "antDesign",
  materialUI = "materialUI",
  chakraUI = "chakraUI",
}

export default libraries;
