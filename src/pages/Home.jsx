import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { Alert, useMediaQuery } from "@mui/material";

import { Post, TagsBlock, SearchPanel, CustomPagination } from "../components";
import { fetchPosts, fetchTags, fetchLikePost } from "../redux/slices/posts";

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const totalPages = posts.totalPages;

  const query = new URLSearchParams(location.search);
  const initialSortType = query.get("sort") || "new";
  const initialPage = parseInt(query.get("page"), 10) || 1;

  const [sortType, setSortType] = useState(initialSortType);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState(query.get("search") || "");

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  const isSmallScreen = useMediaQuery("(max-width: 899px)");

  useEffect(() => {
    dispatch(fetchPosts({ sortType, page: currentPage, search: searchTerm }));
    dispatch(fetchTags());
  }, [dispatch, sortType, currentPage, searchTerm]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("sort", sortType);
    params.set("page", currentPage);
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    navigate({ search: params.toString() });
  }, [sortType, currentPage, searchTerm, navigate]);

  const handleTabChange = (event, newValue) => {
    setSortType(newValue === 0 ? "new" : "popular");
    setCurrentPage(1);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleLike = async (id) => {
    if (!userData?._id) {
      alert("Вы должны быть авторизованы для того чтобы поставить лайк!");
      return;
    }

    try {
      await dispatch(fetchLikePost(id));
    } catch (error) {
      alert("Ошибка!")
    }
  };

  const currentPosts = Array.isArray(posts.items) ? posts.items : [];

  return (
    <>
      <SearchPanel onSearch={handleSearch} />
      <Tabs
        style={{ marginBottom: 15 }}
        value={sortType === "new" ? 0 : 1}
        onChange={handleTabChange}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        {isSmallScreen && (
          <Grid item xs={12}>
            <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          </Grid>
        )}
        <Grid xs={12} md={8} item>
          {isPostsLoading ? (
            [...Array(5)].map((_, index) => (
              <Post key={index} isLoading={true} />
            ))
          ) : currentPosts.length > 0 ? (
            <>
              {currentPosts.map((obj) => (
                <Post
                  id={obj._id}
                  key={obj._id}
                  title={obj.title}
                  imageUrl={
                    obj.imageUrl ? `http://localhost:5000${obj.imageUrl}` : ""
                  }
                  user={obj.user}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewsCount}
                  likes={obj.likes}
                  likeCount={obj.likeCount}
                  commentsCount={obj.commentsCount}
                  tags={obj.tags}
                  isLoading={false}
                  isEditable={userData?._id === obj.user._id}
                  onLike={() => handleLike(obj._id)}
                />
              ))}
              <CustomPagination
                page={currentPage}
                count={totalPages}
                onChange={handlePageChange}
              />
            </>
          ) : (
            <Alert variant="filled" severity="info">
              Статей не найдено
            </Alert>
          )}
        </Grid>
        {!isSmallScreen && (
          <Grid item xs={12} md={4}>
            <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          </Grid>
        )}
      </Grid>
    </>
  );
};
