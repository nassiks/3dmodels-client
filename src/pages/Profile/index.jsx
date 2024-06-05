import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";

import { selectIsAuth, selectUserData } from "../../redux/slices/auth";
import { updateUserProfile } from "../../redux/slices/users";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { Alert } from "@mui/material";

import styles from "./Profile.module.scss";

export const Profile = () => {
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      avatarUrl: "",
      password: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (userData) {
      setValue("username", userData.username);
      setValue("email", userData.email);
      setValue("avatarUrl", userData.avatarUrl);
    }
  }, [userData, setValue]);

  const onSubmit = async (values) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const data = await dispatch(updateUserProfile(values));

      if (data.payload && data.payload.errors) {
        const errorMessages = data.payload.errors
          .map((error) => error.msg)
          .join(", ");
        data.payload.errors.forEach(({ param, msg }) => {
          setError(param, { type: "server", message: msg });
        });
        setErrorMessage(errorMessages);
        return;
      }

      if (!data.payload) {
        setErrorMessage("Не удалось обновить профиль!");
        return;
      }

      setSuccessMessage("Профиль успешно обновлен!");

      if ("accessToken" in data.payload) {
        window.localStorage.setItem("accessToken", data.payload.accessToken);
      }
    } catch (error) {
      setErrorMessage(
        `Произошла ошибка при обновлении профиля: ${error.message}`
      );
    }
  };

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Изменение профиля
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} src={userData?.avatarUrl} />
      </div>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Полное имя"
          error={Boolean(errors.username?.message)}
          helperText={errors.username?.message}
          {...register("username", {
            required: "Укажите имя!",
            minLength: {
              value: 3,
              message: "Имя должно содержать минимум 3 символа",
            },
          })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", {
            required: "Укажите почту!",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Неверный формат почты",
            },
          })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          type="password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", {
            required: "Укажите пароль!",
            minLength: {
              value: 5,
              message: "Пароль должен быть минимум 5 символов",
            },
          })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="URL аватара"
          error={Boolean(errors.avatarUrl?.message)}
          helperText={errors.avatarUrl?.message}
          {...register("avatarUrl", {
            pattern: {
              value: /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp)$/,
              message: "Неверная ссылка на аватарку",
            },
          })}
          fullWidth
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Сохранить изменения
        </Button>
      </form>
      <div>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
      </div>
    </Paper>
  );
};
