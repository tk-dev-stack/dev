export const recalculateLayout = (data: any[], columnCount: number) => {
  let currentRow = 1;
  let currentColumn = 1;

  // Iterate over each field item to adjust row and column based on the span
  return data.map((field) => {
    if (field.hidden) {
      // Skip hidden fields in layout calculation
      return { ...field, row: 0, column: 0, span:0 };
    }
    // Check if the current column position can accommodate the span
    if (currentColumn + field.span - 1 > columnCount) {
      // Move to the next row if the current row doesn't have enough space
      currentRow += 1;
      currentColumn = 1; // Reset to the first column in the new row
    }

    // Update the field with calculated row and column values
    const updatedField = {
      ...field,
      row: currentRow,
      column: currentColumn,
    };

    // Increment column position by the span for the next item
    currentColumn += field.span;

    return updatedField;
  });
};


// export const recalculateLayout = (data: any[], columnCount: number) => {
//   let currentRow = 1;
//   let currentColumn = 1;

//   return data.map((field) => {
//     if (field.hidden) {
//       // Skip hidden fields in layout calculation
//       return { ...field, row: 0, column: 0, span: 0 };
//     }

//     // Ensure field.span is a valid number and has a default value if not
//     const span =
//       typeof field.span === "number" && field.span > 0 ? field.span : 1;

//     // Check if the current column position can accommodate the span
//     if (currentColumn + span - 1 > columnCount) {
//       // Move to the next row if the current row doesn't have enough space
//       currentRow += 1;
//       currentColumn = 1; // Reset to the first column in the new row
//     }

//     // Update the field with calculated row and column values
//     const updatedField = {
//       ...field,
//       row: currentRow,
//       column: currentColumn,
//     };

//     // Increment column position by the span for the next item
//     currentColumn += span;

//     return updatedField;
//   });
// };