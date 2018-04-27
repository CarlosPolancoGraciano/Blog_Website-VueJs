
// Vuex state
const state = {
    currentUser: {}, //User info
    userLogged: false,
};

// Vuex getter
const getters = {
    getCurrentUser(state){
        return state.currentUser;
    },
    getUserLogged(state){
        return state.userLogged;
    }
};

// Vuex mutations
const mutations = {
    setCurrentUser(state, currentUser){
        state.currentUser = currentUser;
    },
    removeCurrentUser(state){
        state.currentUser = {};
    },
    setUserLogged(state, userIsLogged){
        state.userLogged = userIsLogged;
    }
};

// Vuex actions
const actions = {
    setCurrentUser({ commit }, currentUser){
        commit('setCurrentUser', currentUser);
    },
    removeCurrentUser({ commit }){
        commit('removeCurrentUser');
    },
    setUserLogged({ commit }, userIsLogged){
        commit('setUserLogged', userIsLogged);
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};