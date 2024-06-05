import React from "react";

import styles from "./Loading.module.scss";
export const CustomLoading = () => {
  return (
    <div className={styles.container}>
      <span className={styles.loader}></span>
    </div>
  );
};
