import React from "react";
import { useSelector } from "react-redux";

import { SideBlock } from "./SideBlock";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";

export const CommentsBlock = ({
  items,
  children,
  isLoading = true,
  onDelete,
}) => {
  const userId = useSelector((state) => state.auth.data?._id);
  return (
    <SideBlock title="Комментарии">
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt={obj.user.username} src={obj.user.avatarUrl} />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <ListItemText
                  primary={obj.user.username}
                  secondary={obj.text}
                />
              )}
              {!isLoading && obj.user._id === userId && (
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDelete(obj._id)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
