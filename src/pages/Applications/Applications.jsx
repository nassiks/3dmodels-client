import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import {
  fetchApplications,
  updateApplicationStatus,
  fetchResearchers,
  updateUserRole,
  removeResearcher,
} from "../../redux/slices/applications";
import { selectIsAuth, selectUserData } from "../../redux/slices/auth";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

import styles from "./Applications.module.scss";

export const Applications = () => {
  const dispatch = useDispatch();
  const applications = useSelector((state) => state.applications.items);
  const researchers = useSelector((state) => state.applications.researchers);
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector(selectUserData);

  useEffect(() => {
    dispatch(fetchApplications());
    dispatch(fetchResearchers());
  }, [dispatch]);

  if (!isAuth || userData.role !== "admin") {
    return <Navigate to="/" />;
  }

  const handleApprove = (id) => {
    dispatch(
      updateApplicationStatus({ applicationId: id, status: "approved" })
    );
  };

  const handleReject = (id) => {
    dispatch(
      updateApplicationStatus({ applicationId: id, status: "rejected" })
    );
  };

  const handleRemoveResearcher = (id) => {
    dispatch(updateUserRole({ userId: id, role: "user" })).then(() => {
      dispatch(removeResearcher(id));
    });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Заявки на исследователей
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <List className={styles.applicationsList}>
            {applications.map((application) => (
              <React.Fragment key={application._id}>
                <ListItem>
                  <Grid item xs={9} container>
                    <ListItemAvatar>
                      <Avatar
                        alt={application.userId.username}
                        src={application.userId.avatarUrl}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={application.userId.username}
                      secondary={application.userId.email}
                    />
                  </Grid>
                  <Grid xs={3} item className={styles.buttons}>
                    {application.status === "pending" ? (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleApprove(application._id)}
                        >
                          Подтвердить
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleReject(application._id)}
                        >
                          Отклонить
                        </Button>
                      </>
                    ) : (
                      <Typography variant="body2">
                        {application.status === "approved" ? (
                          <DoneIcon />
                        ) : (
                          <CloseIcon />
                        )}
                      </Typography>
                    )}
                  </Grid>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Список исследователей
          </Typography>
          <List className={styles.researchersList}>
            {researchers.map((researcher) => (
              <React.Fragment key={researcher._id}>
                <ListItem>
                  <Grid item xs={10} container>
                    <ListItemAvatar>
                      <Avatar
                        alt={researcher.username}
                        src={researcher.avatarUrl}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={researcher.username}
                      secondary={researcher.email}
                    />
                  </Grid>
                  <Grid xs={2} item className={styles.buttons}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleRemoveResearcher(researcher._id)}
                    >
                      Удалить
                    </Button>
                  </Grid>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
};
