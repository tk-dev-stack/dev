// import React, { useEffect, useState } from "react";
// import { Table } from "antd";
// import axios from "axios";
// import { extractUniqueKeys, formatDataForDisplay } from "../../../utils/helper"; 
// interface ApiTableProps {
//   apiUrl: string;
// }

// const ApiTable: React.FC<ApiTableProps> = ({ apiUrl }) => {
//   const [data, setData] = useState<any[]>([]);
//   const [columns, setColumns] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(apiUrl);
//         const responseData = response.data;

//         if (Array.isArray(responseData)) {
//           // Extract unique keys from the response data
//           const uniqueKeys = extractUniqueKeys(responseData);

//           // Set columns for the Ant Design table
//           const tableColumns = uniqueKeys.map((key) => ({
//             title: key, // Display key as table column header
//             dataIndex: key, // Corresponding key in the data object
//             key: key,
//             render: (text: string) => <span>{text}</span>, // Optional rendering function for each cell
//           }));

//           setColumns(tableColumns);

//           // Format the data for table display
//           const formattedData = formatDataForDisplay(responseData, uniqueKeys);
//           setData(formattedData);
//         } else {
//           throw new Error("Expected an array response");
//         }

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [apiUrl]);

//   return (
//     <div>
//       <h3>Data Table</h3>
//       <Table
//         columns={columns}
//         dataSource={data}
//         loading={loading}
//         rowKey={(record) => JSON.stringify(record)} // A unique identifier for each row
//         bordered
//       />
//     </div>
//   );
// };

// export default ApiTable;
