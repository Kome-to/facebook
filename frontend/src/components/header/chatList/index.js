import { useSelector } from "react-redux";
import { Search } from "../../../svg";

const ChatList = ({ setShowChatBox, setShowChat }) => {
  const { user } = useSelector((user) => ({ ...user }));
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
          />
        </div>
      </div>
      {[1, 2, 3, 4].map((chat) => {
        return (
          <div
            onClick={() => {
              setShowChatBox(true);
              setShowChat(false);
            }}
            className="chat-list__message"
          >
            <div>
              <img
                className="chat-list__picture"
                src={user?.picture}
                alt="avatar"
              />
            </div>
            <div>
              <div>Chu Duc Anh</div>
              <div>You: Haizz</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
