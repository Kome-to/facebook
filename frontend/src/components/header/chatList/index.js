import axios from "axios";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "../../../svg";

const ChatItem = ({ handleShow, recipient }) => {
  const { user } = useSelector((user) => ({ ...user }));
  const [message, setMessage] = useState([]);
  const dispatch = useDispatch();

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

      setMessage([...data]);
    } catch (error) {}
  };

  useEffect(() => {
    if (user?.socket) {
      user.socket.on("receiveMessage", (sender) => {
        getMessage(recipient._id);
        // countMessage();
      });
    }
  }, [user?.socket]);

  useEffect(() => {
    getMessage(recipient._id);
  }, []);

  const lastMessage = () => {
    if (!message.length) {
      return null;
    }
    const isRead = message[message.length - 1].isRead;
    return (
      <div
        className={
          !isRead && message[message.length - 1].sender !== user.id
            ? "chat-list__new-message"
            : ""
        }
      >
        {message[message.length - 1].sender === user.id
          ? `You: ${message[message.length - 1].text}`
          : `${recipient.first_name} ${recipient.last_name}: ${
              message[message.length - 1].text
            }`}
      </div>
    );
  };
  return (
    <div
      onClick={async () => {
        handleShow();
        dispatch({
          type: "CHAT",
          payload: { recipient, messages: [...message] },
        });
      }}
      className="chat-list__message"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          className="chat-list__picture"
          src={recipient.picture}
          alt="avatar"
        />
      </div>
      <div className="chat-list__item-content">
        <div className="chat-list__item-name">
          {recipient.first_name} {recipient.last_name}
        </div>
        {lastMessage()}
      </div>
      {message.length ? (
        <Moment className="chat-list__date" fromNow interval={30}>
          {message[message.length - 1].createdAt}
        </Moment>
      ) : null}
    </div>
  );
};

const ChatList = ({ setShowChatBox, setShowChat, readAllMessage }) => {
  const { user } = useSelector((user) => ({ ...user }));
  const [filterCon, setFilterCon] = useState("");

  return (
    <div className="chat-list">
      <div className="chat-list__header">
        <div className="chat-list__chat-text">Chat</div>
        <div className="search search1" onClick={() => {}}>
          <Search color="#65676b" />
          <input
            type="text"
            placeholder="Search Messager"
            className="hide_input"
            onChange={(e) => {
              setFilterCon(e.target.value);
            }}
          />
        </div>
      </div>
      {user.friends &&
        user.friends
          .filter((friend) =>
            filterCon
              ? friend.first_name
                  .toLowerCase()
                  .includes(filterCon.toLowerCase()) ||
                friend.last_name.toLowerCase().includes(filterCon.toLowerCase())
              : true
          )
          .map((chat, i) => {
            return (
              <ChatItem
                recipient={chat}
                handleShow={async () => {
                  await readAllMessage(chat._id);
                  setShowChatBox(true);
                  setShowChat(false);
                }}
                key={i}
                chat={chat}
              />
            );
          })}
    </div>
  );
};

export default ChatList;
