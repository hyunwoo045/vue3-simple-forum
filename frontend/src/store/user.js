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
      // localStorage.removeItem("accessToken");
      // localStorage.removeItem("refreshToken");
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
  // actions: {
  //   async AccessTokenHandler({ commit }) {
  //     try {
  //       const payload = await verifyAccessToken();
  //       commit("setState", payload);
  //       return "OK";
  //     } catch (err) {
  //       return err;
  //     }
  //   },
  //   async RefreshTokenHandler({ commit }) {
  //     try {
  //       const payload = await verifyRefreshToken();
  //       commit("setState", payload);
  //       return "OK";
  //     } catch (err) {
  //       return err;
  //     }
  //   },
  // },
};

// function verifyAccessToken() {
//   return new Promise((resolve, reject) => {
//     const token = localStorage.getItem("accessToken");
//     if (!token) {
//       reject("NEED_LOGIN");
//     } else {
//       axios.get(`${endpoint}/auth/check?token=${token}`).then((res) => {
//         const data = res.data;
//         if (data.message === "VALID_TOKEN") {
//           localStorage.setItem("accessToken", data.accessToken);
//           localStorage.setItem("refreshToken", data.refreshToken);
//           resolve(data.payload);
//         } else {
//           reject("NOT_VALID_ACCESS_TOKEN");
//         }
//       });
//     }
//   });
// }

// function verifyRefreshToken() {
//   return new Promise((resolve, reject) => {
//     const token = localStorage.getItem("refreshToken");
//     if (!token) {
//       reject("NEED_LOGIN");
//     } else {
//       axios.get(`${endpoint}/auth/check_refresh?token=${token}`).then((res) => {
//         const data = res.data;
//         if (data.message === "VALID_REFRESH_TOKEN") {
//           localStorage.setItem("accessToken", data.accessToken);
//           localStorage.setItem("refreshToken", data.refreshToken);
//           resolve(data.payload);
//         } else {
//           reject("NOT_VALID_REFRESH_TOKEN");
//         }
//       });
//     }
//   });
// }
