import axios from "axios";
import config from "~/key/config";
const endpoint = config.endpoint;

export default {
  namespaced: true,

  state: () => {
    return {
      isLoggedIn: false,
      id: -1,
      provider: "forum",
      nickname: "",
      identifier: "",
    };
  },
  mutations: {
    setState(state, payload) {
      const { id, provider, identifier, displayName } = payload;
      state.isLoggedIn = true;
      state.provider = provider;
      state.id = id;
      state.nickname = displayName;
      state.identifier = identifier;
    },
    resetState(state) {
      state.id = -1;
      state.nickname = "";
      state.provider = "";
      state.identifier = "";
      state.isLoggedIn = false;
    },
    sessionCheck(state) {
      console.log("SESSION CHECKING");
      axios.get(`${endpoint}/auth/session`).then((res) => {
        console.log(res.data);
        if (res.data === "SESSION_EXPIRED") {
          console.log("SESSION EXPIRED");
          return "SESSION_EXPIRED";
        } else {
          state.isLoggedIn = true;
          state.provider = res.data.provider;
          state.id = res.data.id;
          state.nickname = res.data.displayName;
          state.identifier = res.data.identifier;
          return "OK";
        }
      });
    },
  },
};
