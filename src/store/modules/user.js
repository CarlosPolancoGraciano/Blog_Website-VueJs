
// Vuex state
const state = {
    currentUserId: ''
};

// Vuex getter
const getters = {
    getCurrentUser(state){
        return state.currentUserId;
    }
};

// Vuex mutations
const mutations = {
    setCurrentUser(state, currentUserId){
        state.currentUser = currentUserId;
    }
};

// Vuex actions
const actions = {
    setCurrentUser({ commit }, currentUserId){
        console.log(currentUserId);
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};