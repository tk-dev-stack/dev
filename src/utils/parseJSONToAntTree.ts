import _ from "lodash";

type AntTreeNode = {
  title: string;
  key: string;
  children?: AntTreeNode[];
};

/**
 * Parses JSON data into a format compatible with Ant Design's Tree component,
 * and collects values in a separate Map.
 * @param data - The JSON data to parse.
 * @param path - The current path or key for generating unique identifiers (defaults to '').
 * @returns An object containing the tree structure and a map of values.
 *
 *
 */

export default function parseJSONToAntTree(
  data: any,
  path: string = "root"
): { treeData: AntTreeNode[]; valuesMap: Map<string, any> } {
  const valuesMap = new Map<string, any>();

  const parseNode = (
    value: any,
    nodeKey: string,
    currentPath: string
  ): AntTreeNode => {
    let node: AntTreeNode;
    // let type = typeof value;
    let type;

    if (Array.isArray(value)) {
      type = "array";
    } else if (type === "object" && value !== null) {
      type = "object";
    }

    // Determine the new path, avoiding leading "." for the root
    const newPath = currentPath ? `${currentPath}.${nodeKey}` : nodeKey;

    if (Array.isArray(value)) {
      // Handle array nodes - only take the first element
      const firstItem = value[0];
      if (firstItem !== undefined) {
        valuesMap.set(newPath, firstItem); // Store the first item's value
      }
      const children =
        firstItem !== undefined ? [parseNode(firstItem, "[0]", newPath)] : [];
      node = {
        title: `${nodeKey} (Array)`,
        key: newPath,
        children,
      };
    } else if (typeof value === "object" && value !== null) {
      // Handle object nodes
      const children = Object.keys(value).map((childKey) =>
        parseNode(value[childKey], childKey, newPath)
      );
      node = {
        title: `${nodeKey} (Object)`,
        key: newPath,
        children,
      };
    } else {
      // Handle simple value nodes
      valuesMap.set(newPath, value); // Store simple values in the map
      node = {
        title: `${nodeKey} (${typeof value}): ${_.truncate(value, {
          length: 20,
        })}`,
        key: newPath,
      };
    }

    return node;
  };

  // For a root array, start by mapping only the first element
  const treeData = Array.isArray(data)
    ? data.length > 0
      ? [parseNode(data[0], "[0]", path)]
      : []
    : [parseNode(data, path, path)];

  return { treeData, valuesMap };
}
