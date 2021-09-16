import { createRouter, createWebHashHistory } from "vue-router";
import Container from "./Container";
import Add from "./Add";
import Read from "./Read";
import Login from "./Login";
import Home from "./Home";

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
    },
    {
      path: "/",
      component: Home,
      name: "Home",
      beforeEnter: (to, from, next) => {
        if (!store.state.user.isLoggedIn) {
          console.log("STORE NEED UPDATED");
          axios.get(`${endpoint}/auth/session`).then((res) => {
            if (res.data === "SESSION_EXPIRED") {
              alert("로그인이 필요합니다.");
              next("/login");
              console.log("NEED LOGIN");
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
