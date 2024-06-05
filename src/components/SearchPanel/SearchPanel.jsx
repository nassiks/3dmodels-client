import React, { useState } from "react";

import { TextField, Box, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import styles from "./SearchBar.module.scss";
export const SearchPanel = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box display="flex" alignItems="center">
      <TextField
        className={styles["search"]}
        variant="outlined"
        placeholder="Поиск..."
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        size="small"
        sx={{ width: "100%" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon
                onClick={handleSearch}
                style={{ cursor: "pointer" }}
              />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};
