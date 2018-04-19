
// Vuex state
const state = {
    currentUser: {} //User info
};

// Vuex getter
const getters = {
    getCurrentUser(state){
        return state.currentUser;
    }
};

// Vuex mutations
const mutations = {
    setCurrentUser(state, currentUser){
        state.currentUser = currentUser;
    }
};

// Vuex actions
const actions = {
    setCurrentUser({ commit }, currentUser){
        commit('setCurrentUser', currentUser)
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};