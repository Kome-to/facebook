import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ChatBox = ({ setShowChatBox, countMessage }) => {
  const { user } = useSelector((user) => ({ ...user }));
  const [chat, setChat] = useState();
  const scrollEnd = useRef(null);
  const dispatch = useDispatch();

  const handleChat = async () => {
    await createMessage();
    setChat("");
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getMessage/${user.chat.recipient._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch({
        type: "CHAT",
        payload: { recipient: user.chat.recipient, messages: [...data] },
      });
      countMessage();
    } catch (error) {}
    user.socket.emit("sendMessage", { user: user.chat.recipient._id });
  };

  useEffect(() => {
    const end = scrollEnd.current;
    if (end) {
      end.scrollIntoView({ block: "end", inline: "nearest" });
    }
  }, [user.chat]);

  const createMessage = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/createMessage`,
        {
          recipient: user?.chat.recipient._id,
          msg: chat,
          media: null,
          call: null,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
    } catch (error) {}
  };
  return user && user?.chat ? (
    <div className="chat-box">
      <div className="chat-box__header">
        <div className="chat-box__user">
          <img
            className="chat-box__picture"
            src={user?.chat.recipient.picture}
            alt="avatar"
          />
          <div>
            <div className="chat-box__name">
              {user?.chat.recipient.first_name} {user?.chat.recipient.last_name}
            </div>
          </div>
        </div>
        <div className="chat-box__actions">
          <i
            onClick={() => {
              setShowChatBox(false);
            }}
            style={{ cursor: "pointer" }}
            className="exit_icon"
          ></i>
        </div>
      </div>
      <div className="chat-box__content">
        <div className="chat-box__welcome">
          <img
            className="chat-box__welcome-picture"
            src={user?.chat.recipient.picture}
            alt="avatar"
          />
          <div>
            <div className="chat-box__welcome-name">
              {user?.chat.recipient.first_name} {user?.chat.recipient.last_name}
            </div>
          </div>
        </div>
        {user?.chat.messages.map((chat, i) => {
          return chat.sender !== user.id ? (
            <div key={i} className="chat-box__content-item">
              <div className="chat-box__content-item-wrapper ">
                <img
                  className="chat-box__picture-inside"
                  src={user?.chat.recipient.picture}
                  alt="avatar"
                />
                <div className="chat-box__message ">{chat.text}</div>
              </div>
            </div>
          ) : (
            <div
              key={i}
              className="chat-box__content-item chat-box__content-item--right"
            >
              <div className="chat-box__content-item-wrapper chat-box__content-item-wrapper--right">
                <div className="chat-box__message chat-box__message--right">
                  {chat.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>
      <div className="chat-box__chatting">
        <div className="chat-box__input">
          <input
            type="chat"
            //   ref={"textRef"}
            value={chat}
            placeholder="Comment..."
            //   onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleChat();
              }
            }}
            onChange={(e) => {
              setChat(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default ChatBox;
