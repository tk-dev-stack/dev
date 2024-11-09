import React, { useState } from "react";
import { Input } from "antd";
// import { useDispatch } from "react-redux";
// import { fetchData } from "src/Redux/Apislice/api.actions";
// import { AppDispatch } from "src/Redux/store";

const { Search } = Input;

interface ApiFormProps {
  fetchData: (url: string) => void;
  sampleApi:string;
}

const ApiForm: React.FC<ApiFormProps> = ({ fetchData, sampleApi }) => {
  const [error, setError] = useState<string | null>(null);
  // const dispatch = useDispatch<AppDispatch>();
  // Validate URL
  const isValidUrl = (url: string) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!urlPattern.test(url);
  };

  // onSearch function to fetch data
  const onSearch = async (value: string) => {
    if (!isValidUrl(value)) {
      setError("Invalid API URL");
      return;
    }

    setError(null);

    try {
      fetchData(value);
    } catch (err) {
      setError("Error fetching data");
    }
  };

  return (
    <div>
      <Search
        size="large"
        addonBefore="GET"
        defaultValue={sampleApi}
        placeholder="Enter REST API URL"
        allowClear
        enterButton="Send"
        onSearch={onSearch}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ApiForm;
