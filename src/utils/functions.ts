export function toPascalCase(input: string): string {
  // Remove all spaces using regex and split by empty string to get each character
  const words = input.replace(/\s+/g, " ").trim().split(" ");

  // Capitalize the first letter of each word
  const pascalCaseWords = words.map((word) => {
    // Ensure word is not empty and capitalize first letter
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  // Join words to form PascalCase string
  return pascalCaseWords.join("");
}
