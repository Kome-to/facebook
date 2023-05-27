import { useSelector } from "react-redux";

const ChatBox = ({ setShowChatBox }) => {
  const { user } = useSelector((user) => ({ ...user }));
  return (
    <div className="chat-box">
      <div className="chat-box__header">
        <div className="chat-box__user">
          <img className="chat-box__picture" src={user?.picture} alt="avatar" />
          <div>
            <div className="chat-box__name">Chu Duc Anh</div>
          </div>
        </div>
        <div className="chat-box__actions">
          <i
            onClick={() => {
              setShowChatBox(false);
            }}
            className="exit_icon"
          ></i>
        </div>
      </div>
      <div className="chat-box__content">
        {[1, 2, 3, 4, 5, 6, 7, 8, 11].map((chat, i) => {
          return i % 2 === 0 ? (
            <div key={i} className="chat-box__content-item">
              <div className="chat-box__content-item-wrapper ">
                <img
                  className="chat-box__picture-inside"
                  src={user?.picture}
                  alt="avatar"
                />
                <div className="chat-box__message ">
                  Lorem issLorem issLorem issLorem issLorem issLorem issLorem
                  issLorem iss
                </div>
              </div>
            </div>
          ) : (
            <div
              key={i}
              className="chat-box__content-item chat-box__content-item--right"
            >
              <div className="chat-box__content-item-wrapper chat-box__content-item-wrapper--right">
                <div className="chat-box__message chat-box__message--right">
                  Lorem issLorem issLorem issLorem issLorem issLorem issLorem
                  issLorem iss
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="chat-box__chatting">
        <div className="chat-box__input">
          <input
            type="text"
            //   ref={"textRef"}
            //   value={"text"}
            placeholder="Comment..."
            //   onChange={(e) => setText(e.target.value)}
            onKeyUp={"handleComment"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
