
// Vuex state
const state = {
    newNotification: false //User info
};

// Vuex getter
const getters = {
    getNewNotification(state){
        return state.newNotification;
    }
};

// Vuex mutations
const mutations = {
    setNewNotification(state, newNotification){
        state.newNotification = newNotification;
    },
};

// Vuex actions
const actions = {
    setNewNotification({ commit }, newNotification){
        commit('setNewNotification', newNotification);
    },
};

export default {
    state,
    getters,
    mutations,
    actions
};