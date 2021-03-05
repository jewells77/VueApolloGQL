import {
  REGISTER_USER,
  AUTHENTICATED_USER,
  AUTHENTICATE_USER,
} from "../../gql";
import { apolloClient } from "../../vue-apollo";
import router from "../../router";

const state = {
  user: {},
  authStatus: false,
  token: localStorage.getItem("apollo-token") || null,
};

const getters = {
  user: (state) => state.user,
  isAuth: (state) => !!state.token,
  authStatus: (state) => state.authStatus,
};

const actions = {
  async loginUser({ dispatch }, userData) {
    let {
      data: { authenticateUser },
    } = await apolloClient.query({
      query: AUTHENTICATE_USER,
      variables: userData,
    });
    dispatch("setAuthUserData", authenticateUser);
  },

  async registerUser({ dispatch }, userData) {
    let {
      data: { registerUser },
    } = await apolloClient.mutate({
      mutation: REGISTER_USER,
      variables: userData,
    });
    dispatch("setAuthUserData", registerUser);
  },

  async setAuthUserData({ commit }, payload) {
    commit("LOGIN_USER", payload);
    commit("SET_TOKEN", payload);
    //Set token in localstorage
    localStorage.setItem("apollo-token", payload.token.split(" ")[1]);
    // Redirect the user to the Dashboard
    router.push("/dashboard");
  },

  async getAuthUser({ commit, dispatch }) {
    try {
      let {
        data: { authUserProfile },
      } = await apolloClient.query({
        query: AUTHENTICATED_USER,
      });
      commit("LOGIN_USER", { user: authUserProfile });
    } catch (err) {
      dispatch("logoutUser");
    }
  },
  logoutUser({ commit }) {
    commit("LOGOUT_USER");
<<<<<<< HEAD
    localStorage.removeItem("apollo-token");
=======
>>>>>>> db5dff3b1909840601ca68a6db674191867c5f24
  },
};

const mutations = {
  LOGIN_USER(state, payload) {
    state.user = payload.user;
    state.authStatus = true;
  },
  SET_TOKEN(state, payload) {
    state.token = payload.token;
  },
  LOGOUT_USER(state) {
    state.user = {};
    state.authStatus = false;
    state.token = null;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true,
};
