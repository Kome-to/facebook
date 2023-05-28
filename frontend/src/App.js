import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import CreatePostPopup from "./components/createPostPopup";
import ChatBox from "./components/header/chatList/chatBox";
import { postsReducer } from "./functions/reducers";
import Friends from "./pages/friends";
import Home from "./pages/home";
import Activate from "./pages/home/activate";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Reset from "./pages/reset";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";
import Cookies from "js-cookie";

const SocketWrapper = ({ children, setShowChatBox, countMessage }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  const getMessage = async (userId) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getMessage/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch({
        type: "CHAT",
        payload: {
          recipient: user.friends.find((friend) => friend._id === userId),
          messages: [...data],
        },
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (user?.socket) {
      user.socket.on("receiveMessage", (sender) => {
        getMessage(sender);
        countMessage();
        // setShowChatBox(true);
      });
    }
  }, [user?.socket]);

  useEffect(() => {
    if (user) {
      const socket = io("http://localhost:8000");
      socket.emit("joinUser", user);
      dispatch({
        type: "SOCKET",
        payload: socket,
      });
      return () => socket.close();
    }
  }, []);

  return children;
};

function App() {
  const [visible, setVisible] = useState(false);
  const { user, darkTheme } = useSelector((state) => ({ ...state }));
  const [showChatBox, setShowChatBox] = useState(false);
  const [{ loading, error, posts }, dispatch] = useReducer(postsReducer, {
    loading: false,
    posts: [],
    error: "",
  });
  const dispatchUser = useDispatch();

  const getMe = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/me`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatchUser({
        type: "UPDATE_USER",
        payload: { ...data },
      });
    } catch (error) {}
  };

  useEffect(() => {
    getAllPosts();
    getMe();
    countMessage();
  }, []);

  const getAllPosts = async () => {
    try {
      dispatch({
        type: "POSTS_REQUEST",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getAllposts`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch({
        type: "POSTS_SUCCESS",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "POSTS_ERROR",
        payload: error.response.data.message,
      });
    }
  };

  const countMessage = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/countUnRead`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatchUser({ type: "COUNT_MESSAGE", payload: Number(data) || 0 });
    } catch (error) {}
  };

  return (
    <SocketWrapper countMessage={countMessage} setShowChatBox={setShowChatBox}>
      <div className={darkTheme ? "dark" : ""}>
        {visible && (
          <CreatePostPopup
            user={user}
            setVisible={setVisible}
            posts={posts}
            dispatch={dispatch}
          />
        )}
        <Routes>
          <Route element={<LoggedInRoutes />}>
            <Route
              path="/profile"
              element={
                <Profile setVisible={setVisible} getAllPosts={getAllPosts} />
              }
              exact
            />
            <Route
              path="/profile/:username"
              element={
                <Profile setVisible={setVisible} getAllPosts={getAllPosts} />
              }
              exact
            />
            <Route
              path="/friends"
              element={
                <Friends setVisible={setVisible} getAllPosts={getAllPosts} />
              }
              exact
            />
            <Route
              path="/friends/:type"
              element={
                <Friends setVisible={setVisible} getAllPosts={getAllPosts} />
              }
              exact
            />
            <Route
              path="/"
              element={
                <Home
                  setVisible={setVisible}
                  posts={posts}
                  loading={loading}
                  getAllPosts={getAllPosts}
                  setShowChatBox={setShowChatBox}
                />
              }
              exact
            />
            <Route path="/activate/:token" element={<Activate />} exact />
          </Route>
          <Route element={<NotLoggedInRoutes />}>
            <Route path="/login" element={<Login />} exact />
          </Route>
          <Route path="/reset" element={<Reset />} />
        </Routes>
        {showChatBox && (
          <ChatBox
            countMessage={countMessage}
            setShowChatBox={setShowChatBox}
          />
        )}
      </div>
    </SocketWrapper>
  );
}

export default App;
