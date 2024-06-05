import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout, selectIsAuth, selectUserData } from "../../redux/slices/auth";
import { createApplication } from "../../redux/slices/applications";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {
  Popover,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemButton from "@mui/material/ListItemButton";

import styles from "./Header.module.scss";

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector(selectUserData);

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const onClickLogout = () => {
    if (window.confirm("Вы действительно хотите выйти?")) {
      dispatch(logout());
    }
  };

  const onRequestResearcher = (event) => {
    dispatch(createApplication());
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const list = (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {isAuth ? (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/profile">
                <Avatar alt={userData.username} src={userData.avatarUrl} />
              </ListItemButton>
            </ListItem>
            {userData.role === "admin" && (
              <>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/add-post">
                    <ListItemText primary="Написать статью" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/applications">
                    <ListItemText primary="Заявки" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
            {userData.role === "user" && (
              <ListItem disablePadding>
                <ListItemButton onClick={onRequestResearcher}>
                  <ListItemText primary="Стать исследователем" />
                </ListItemButton>
              </ListItem>
            )}
            {userData.role === "researcher" && (
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText primary="Исследователь" />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton onClick={onClickLogout}>
                <ListItemText primary="Выйти" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/login">
                <ListItemText primary="Войти" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/register">
                <ListItemText primary="Создать аккаунт" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </div>
  );

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>3D MODELS</div>
          </Link>
          <div className={styles.menuButton}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/profile">
                  <Avatar alt={userData.username} src={userData.avatarUrl} />
                </Link>
                {userData.role === "admin" && (
                  <div>
                    <Link to="/add-post">
                      <Button variant="contained">Написать статью</Button>
                    </Link>
                    <Link to="/applications">
                      <Button variant="contained">Заявки</Button>
                    </Link>
                  </div>
                )}
                {userData.role === "user" && (
                  <Button variant="contained" onClick={onRequestResearcher}>
                    Стать исследователем
                  </Button>
                )}
                {userData.role === "researcher" && (
                  <div className={styles.researcher}>Исследователь</div>
                )}
                <Button
                  onClick={onClickLogout}
                  variant="contained"
                  color="error"
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>

      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Typography sx={{ p: 2 }}>Ваша заявка успешно отправлена!</Typography>
      </Popover>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {list}
      </Drawer>
    </div>
  );
};
