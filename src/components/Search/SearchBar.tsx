import { Input } from "antd";
import React from "react";

const SearchBar = () => {
  const [searchInput, setSearchInput] = React.useState("");
  return (
    <div>
      <Input.Search
        value={searchInput}
        placeholder="input search text"
        onChange={(e) => setSearchInput(e.target.value)}
        enterButton
      />
    </div>
  );
};

export default SearchBar;
