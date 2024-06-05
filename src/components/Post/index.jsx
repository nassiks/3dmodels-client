import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";

import { fetchRemovePost, fetchLikePost } from "../../redux/slices/posts";
import { PostSkeleton } from "./Skeleton";
import { UserInfo } from "../UserInfo";
import ModelViewer from "../ModelViewer/ModelViewer";
import { selectIsAuth, selectUserData } from "../../redux/slices/auth";
import { formatDate } from "../../utils/formatDate";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";

import styles from "./Post.module.scss";

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  modelUrl,
  user,
  viewsCount,
  commentsCount,
  likeCount,
  likes = [],
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
  onLike,
}) => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const currentUser = useSelector(selectUserData);

  if (isLoading) {
    return <PostSkeleton />;
  }

  const onClickRemove = () => {
    if (window.confirm("Вы действительно хотите удалить статью?")) {
      dispatch(fetchRemovePost(id));
    }
  };

  const hasLiked = likes.includes(currentUser?._id);

  const handleLike = () => {
    if (!isAuth) {
      alert("Вы должны быть авторизованы для того чтобы поставить лайк!");
      return;
    }

    if (onLike) {
      onLike(id);
    } else {
      dispatch(fetchLikePost(id));
    }
  };

  const formattedDate = formatDate(createdAt);

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      {modelUrl && (
        <div>
          <ModelViewer modelUrl={modelUrl} />
        </div>
      )}
      <div className={styles.wrapper}>
        <UserInfo
          avatarUrl={user.avatarUrl}
          fullName={user.username}
          additionalText={formattedDate}
        />
        <div className={styles.indention}>
          <h2
            className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
          >
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {tags.map((name) => (
              <li key={name}>
                <Link to={`/tags/${name}`}>#{name}</Link>
              </li>
            ))}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
            <li onClick={handleLike}>
              {hasLiked ? (
                <FavoriteOutlinedIcon />
              ) : (
                <FavoriteBorderOutlinedIcon />
              )}
              <span>{likeCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
