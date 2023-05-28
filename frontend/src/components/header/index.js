import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useClickOutside from "../../helpers/clickOutside";
import {
  ArrowDown,
  Friends,
  FriendsActive,
  Gaming,
  Home,
  HomeActive,
  Logo,
  Market,
  Messenger,
  Notifications,
  Search,
  Watch,
} from "../../svg";
import SearchMenu from "./SearchMenu";
import ChatList from "./chatList";
import NotifyList from "./notifyList";
import "./style.css";
import UserMenu from "./userMenu";
import axios from "axios";
export default function Header({ page, getAllPosts, setShowChatBox }) {
  const { user } = useSelector((user) => ({ ...user }));
  const color = "#65676b";
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const allmenu = useRef(null);
  const usermenu = useRef(null);
  const notify = useRef(null);
  const chat = useRef(null);
  const dispatch = useDispatch();
  useClickOutside(allmenu, () => {
    setShowAllMenu(false);
  });
  useClickOutside(usermenu, () => {
    setShowUserMenu(false);
  });
  useClickOutside(chat, () => {
    setShowChat(false);
  });
  useClickOutside(notify, () => {
    setShowNotify(false);
  });

  const readAllMessage = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/readAll`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch({
        type: "COUNT_MESSAGE",
        payload: user.countMessage === 0 ? 0 : user.countMessage - 1 || 0,
      });
    } catch (error) {}
  };

  const [notifyList, setNotifyList] = useState([]);

  const readAll = async () => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/isReadNotify`,
        { ids: [...notifyList.map((item) => item._id)] },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
    } catch (error) {}
  };

  const getAllNotify = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/notifies`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setNotifyList([...data.notifies]);
    } catch (error) {}
  };

  useEffect(() => {
    getAllNotify();
  }, []);

  useEffect(() => {
    getAllNotify();
  }, [showNotify]);

  return (
    <header>
      <div className="header_left">
        <Link to="/" className="header_logo">
          <div className="circle">
            <Logo />
          </div>
        </Link>
        <div
          className="search search1"
          onClick={() => {
            setShowSearchMenu(true);
          }}
        >
          <Search color={color} />
          <input
            type="text"
            placeholder="Search Facebook"
            className="hide_input"
          />
        </div>
      </div>
      {showSearchMenu && (
        <SearchMenu
          color={color}
          setShowSearchMenu={setShowSearchMenu}
          token={user.token}
        />
      )}
      <div className="header_middle">
        <Link
          to="/"
          className={`middle_icon ${page === "home" ? "active" : "hover1"}`}
          onClick={() => getAllPosts()}
        >
          {page === "home" ? <HomeActive /> : <Home color={color} />}
        </Link>
        <Link
          to="/friends"
          className={`middle_icon ${page === "friends" ? "active" : "hover1"}`}
        >
          {page === "friends" ? <FriendsActive /> : <Friends color={color} />}
        </Link>
        {/* <Link to="/" className="middle_icon hover1">
          <Watch color={color} />
          <div className="middle_notification">9+</div>
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Market color={color} />
        </Link>
        <Link to="/" className="middle_icon hover1 ">
          <Gaming color={color} />
        </Link> */}
      </div>
      <div className="header_right">
        <Link
          to="/profile"
          className={`profile_link hover1 ${
            page === "profile" ? "active_link" : ""
          }`}
        >
          <img src={user?.picture} alt="" />
          <span>{user?.first_name}</span>
        </Link>
        {/* <div
          className={`circle_icon hover1 ${showAllMenu && "active_header"}`}
          ref={allmenu}
        >
          <div
            onClick={() => {
              setShowAllMenu((prev) => !prev);
            }}
          >
            <div style={{ transform: "translateY(2px)" }}>
              <Menu />
            </div>
          </div>

          {showAllMenu && <AllMenu />}
        </div> */}
        <div className="circle_icon hover1" ref={chat}>
          <div
            onClick={() => {
              setShowChat((prev) => !prev);
            }}
            className=""
            style={{ transform: "translateY(2px)" }}
          >
            <Messenger />
          </div>
          {user.countMessage ? (
            <div
              style={{ transform: "translateY(2px)" }}
              className="right_notification"
            >
              {user.countMessage}
            </div>
          ) : null}
          {showChat && (
            <ChatList
              setShowChat={setShowChat}
              setShowChatBox={setShowChatBox}
              readAllMessage={readAllMessage}
            />
          )}
        </div>
        <div className="circle_icon hover1" ref={notify}>
          <div
            onClick={async () => {
              if (!showNotify) {
                await readAll();
              }
              setShowNotify((prev) => !prev);
            }}
          >
            <div style={{ transform: "translateY(2px)" }}>
              <Notifications />
            </div>
            {notifyList.filter((notify) => !notify.isRead).length !== 0 && (
              <div
                style={{ transform: "translateY(2px)" }}
                className="right_notification"
              >
                {notifyList.filter((notify) => !notify.isRead).length}
              </div>
            )}
          </div>
          {showNotify && (
            <NotifyList
              setShowChatBox={setShowChatBox}
              getAllNotify={getAllNotify}
              notifyList={notifyList}
            />
          )}
        </div>
        <div
          className={`circle_icon hover1 ${showUserMenu && "active_header"}`}
          ref={usermenu}
        >
          <div
            onClick={() => {
              setShowUserMenu((prev) => !prev);
            }}
          >
            <div style={{ transform: "translateY(2px)" }}>
              <ArrowDown />
            </div>
          </div>

          {showUserMenu && <UserMenu user={user} />}
        </div>
      </div>
    </header>
  );
}
