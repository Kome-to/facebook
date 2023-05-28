import Cookies from "js-cookie";

export function userReducer(
  state = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,

  action
) {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      return null;
    case "UPDATEPICTURE":
      return { ...state, picture: action.payload };
    case "VERIFY":
      return { ...state, verified: action.payload };
    case "SOCKET":
      return { ...state, socket: action.payload };
    case "CHAT":
      return { ...state, chat: action.payload };
    case "UPDATE_USER":
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.picture = action.payload.picture;
      state.first_name = action.payload.first_name;
      state.last_name = action.payload.last_name;
      state.token = action.payload.token;
      state.verified = action.payload.verified;
      state.friends = action.payload.friends;
      return { ...state };
    case "COUNT_MESSAGE":
      return { ...state, countMessage: action.payload };

    default:
      return state;
  }
}
