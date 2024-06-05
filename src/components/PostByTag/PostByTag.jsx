import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchPostsByTag, fetchTags } from "../../redux/slices/posts";
import { Post } from "../Post";
import { TagsBlock } from "../TagsBlock";

import Grid from "@mui/material/Grid";
import { useMediaQuery } from "@mui/material";

const PostsByTag = () => {
  const { tag } = useParams();
  const dispatch = useDispatch();
  const { posts, tags } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);
  const isLoading = posts.status === "loading";
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    dispatch(fetchPostsByTag(tag));
    dispatch(fetchTags());
  }, [dispatch, tag]);

  const isTagsLoading = tags.status === "loading";

  return (
    <Grid container spacing={4}>
      {isSmallScreen && (
        <Grid item xs={12}>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
        </Grid>
      )}
      <Grid item xs={12} sm={8}>
        {(isLoading ? [...Array(5)] : posts.items).map((obj, index) =>
          isLoading ? (
            <Post key={index} isLoading={true} />
          ) : (
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
              commentsCount={obj.comments?.length || 0}
              tags={obj.tags}
              isLoading={false}
              isEditable={userData?._id === obj.user._id}
            />
          )
        )}
      </Grid>
      {!isSmallScreen && (
        <Grid item xs={12} sm={4}>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
        </Grid>
      )}
    </Grid>
  );
};

export default PostsByTag;
