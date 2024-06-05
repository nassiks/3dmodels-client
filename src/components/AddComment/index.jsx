import React from "react";
import { useSelector } from "react-redux";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

export const Index = ({ value, onChange, onSubmit }) => {
  const user = useSelector((state) => state.auth.data);

  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src={user?.avatarUrl} />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            value={value}
            onChange={onChange}
          />
          <Button variant="contained" onClick={onSubmit} disabled={!user}>
            Отправить
          </Button>
        </div>
      </div>
    </>
  );
};
