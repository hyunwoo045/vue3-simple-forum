import { createRouter, createWebHashHistory } from "vue-router";
import Container from "./Container";
import Add from "./Add";
import Read from "./Read";
import Login from "./Login";
// import Signin from "./Signin";
import Home from "./Home";
import LoginSuccess from "./LoginSuccess";

import store from "../store/index";
import axios from "axios";
import config from "~/key/config";
const endpoint = config.endpoint;

export default createRouter({
  history: createWebHashHistory(),

  routes: [
    {
      path: "/login",
      component: Login,
      name: "Login",
      beforeEnter: (to, from, next) => {
        axios.get(`${endpoint}/auth/session`).then((res) => {
          if (res.data !== "SESSION_EXPIRED") {
            next("/");
          }
        });
      },
    },
    // {
    //   path: "/signin",
    //   component: Signin,
    //   name: "Signin",
    //   beforeEnter: (to, from, next) => {
    //     if (store.state.user.isLoggedIn) {
    //       alert("잘못된 경로 접근입니다.");
    //       next("/");
    //     } else {
    //       next();
    //     }
    //   },
    // },
    {
      path: "/loginsuccess",
      component: LoginSuccess,
      name: "LoginSuccess",
    },
    {
      path: "/",
      component: Home,
      name: "Home",
      beforeEnter: (to, from, next) => {
        if (!store.state.user.isLoggedIn) {
          console.log("STORE NEED UPDATED");
          // const sessionCheckResult = store.commit("user/sessionCheck");
          // console.log("BEFORE: ", sessionCheckResult);
          // if (sessionCheckResult === "OK") {
          //   next();
          // } else if (sessionCheckResult === "SESSION_EXPIRED") {
          //   console.log("SESSION EXPIRED");
          //   alert("로그인이 필요합니다.");
          //   next("/login");
          // }
          axios.get(`${endpoint}/auth/session`).then((res) => {
            if (res.data === "SESSION_EXPIRED") {
              alert("로그인이 필요합니다.");
              next("/login");
            } else {
              const payload = res.data;
              store.commit("user/setState", payload);
              next();
            }
          });
        } else {
          next();
        }
      },
      // beforeEnter: (to, from, next) => {
      //   if (store.state.user.isLoggedIn) {
      //     next();
      //   } else {
      //     store.dispatch("user/AccessTokenHandler").then((res) => {
      //       if (res === "NOT_VALID_ACCESS_TOKEN") {
      //         console.log("ACCESS TOKEN 만료");
      //         store.dispatch("user/RefreshTokenHandler").then((res) => {
      //           if (res === "NOT_VALID_REFRESH_TOKEN") {
      //             console.log("REFRESH TOKEN 만료");
      //             store.commit("user/resetState");
      //             alert("세션이 만료되었습니다.");
      //             next("/login");
      //           } else {
      //             next();
      //           }
      //         });
      //       } else if (res === "NEED_LOGIN") {
      //         store.commit("user/resetState");
      //         next("/login");
      //         return;
      //       } else {
      //         next();
      //       }
      //     });
      //   }
      // },
      children: [
        {
          path: "",
          component: Container,
          name: "Container",
        },
        {
          path: "add",
          component: Add,
          name: "Add",
          props: true,
        },
        {
          path: "read",
          component: Read,
          name: "Read",
        },
      ],
    },
  ],
});
