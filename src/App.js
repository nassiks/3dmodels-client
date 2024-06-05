import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Container from "@mui/material/Container";
import { Header } from "./components";
import {
  Home,
  FullPost,
  Registration,
  AddPost,
  Login,
  Profile,
  Applications,
} from "./pages";
import { fetchLogin } from "./redux/slices/auth";
import PostsByTag from "./components/PostByTag/PostByTag";
import { CustomLoading } from "./components/Loading/Loading";

function App() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const accessToken = window.localStorage.getItem("accessToken");
    if (accessToken) {
      dispatch(fetchLogin()).then(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [dispatch]);

  if (isLoading || authStatus === "loading") {
    return <CustomLoading />;
  }

  return (
    <BrowserRouter>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tags/:tag" element={<PostsByTag />} />
          <Route path="/applications" element={<Applications />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
