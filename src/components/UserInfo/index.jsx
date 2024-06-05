import React from "react";

import Avatar from "@mui/material/Avatar";

import styles from "./UserInfo.module.scss";
export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
  return (
    <div className={styles.root}>
      <Avatar alt={fullName} src={avatarUrl} />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
