import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axios";
import { Post, CommentsBlock, Index as AddCommentForm } from "../components";
import ModelViewer from "../components/ModelViewer/ModelViewer";
import {
  fetchLikePost,
  fetchComments,
  addComment,
  deleteComment,
} from "../redux/slices/posts";
import Button from "@mui/material/Button";
import { Alert } from "@mui/material";

export const FullPost = () => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [downloadError, setDownloadError] = useState(null);
  const params = useParams();

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.data?._id);
  const userRole = useSelector((state) => state.auth.data?.role);
  const comments = useSelector((state) => state.posts.comments.items || []);
  const commentsStatus = useSelector((state) => state.posts.comments.status);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/posts/${params.id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        alert("Ошибка при получении статьи");
        setLoading(false);
      });

    dispatch(fetchComments(params.id));
  }, [params.id, dispatch]);

  const handleLike = async () => {
    if (!userId) {
      alert("Вы должны быть авторизованы для того чтобы поставить лайк!");
      return;
    }

    try {
      const response = await dispatch(fetchLikePost(data._id)).unwrap();
      setData(response);
    } catch (error) {
      alert("Ошибка!")
    }
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleAddComment = async () => {
    if (commentText.trim()) {
      try {
        await dispatch(addComment({ id: data._id, text: commentText }));
        setCommentText("");
      } catch (error) {
        alert("Ошибка!")
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await dispatch(deleteComment(commentId));
    } catch (error) {
      alert("Ошибка!")
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000${data.modelUrl}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = data.modelUrl.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadError(null);
    } catch (error) {
      setDownloadError("Файл не найден!");
    }
  };

  if (isLoading) {
    return <Post isLoading={isLoading} />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:5000${data.imageUrl}` : ""}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={comments?.length || 0}
        likeCount={data.likeCount}
        likes={data.likes}
        tags={data.tags}
        onLike={handleLike}
        isFullPost
      >
        {data.modelUrl && (
          <div>
            <ModelViewer
              modelUrl={`http://localhost:5000${data.modelUrl}`}
              textureUrl={
                data.textureUrl
                  ? `http://localhost:5000${data.textureUrl}`
                  : null
              }
            />
            {userId && userRole !== "user" && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  style={{ marginTop: "10px" }}
                  onClick={handleDownload}
                >
                  Скачать модель
                </Button>
                {downloadError && (
                  <Alert severity="error" style={{ marginTop: "10px" }}>
                    {downloadError}
                  </Alert>
                )}
              </>
            )}
          </div>
        )}
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={comments || []}
        isLoading={commentsStatus === "loading"}
        onDelete={handleDeleteComment}
      >
        <AddCommentForm
          value={commentText}
          onChange={handleCommentChange}
          onSubmit={handleAddComment}
        />
      </CommentsBlock>
    </>
  );
};
