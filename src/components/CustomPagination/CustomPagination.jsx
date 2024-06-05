import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import styles from "./CustomPagination.module.scss";

export const CustomPagination = ({ page, count, onChange }) => {
  return (
    <Stack spacing={2} className={styles["container"]}>
      <Pagination
        count={count}
        page={page}
        onChange={onChange}
        shape="rounded"
      />
    </Stack>
  );
};
