import { useSelector } from "react-redux";

const NotifyList = ({ notifyList, getAllNotify }) => {
  const { user } = useSelector((user) => ({ ...user }));

  // useEffect(() => {
  //   getAllNotify();
  // }, []);

  return (
    <div className="chat-list notify-list">
      <div className="chat-list__header">
        <div className="chat-list__chat-text">Notifications</div>
      </div>
      {notifyList.map((chat) => {
        return (
          <div className="chat-list__message notify-list__item">
            <div>
              <img
                className="chat-list__picture"
                src={chat.user?.picture}
                alt="avatar"
              />
            </div>
            <div>
              <div>
                {chat.user.first_name} {chat.user.last_name}
              </div>
              <div>
                {chat.text}
                {chat.content && `: ${chat.content}`}
              </div>
            </div>
            {!chat.isRead && (
              <div className="notify-list__dot-wrapper">
                <div className="notify-list__dot"></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NotifyList;
