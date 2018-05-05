// Vuex state
const state = {
  isLoading: false
}

// Vuex getters
const getters = {
  getIsLoading(state){
    return state.isLoading;
  }
}

// Vuex mutations
const mutations = {
  setIsLoading(state, newVal){
    state.isLoading = newVal;
  }
}

// Vuex actions
const actions = {
  setIsLoading({ commit }, newVal){
    commit('setIsLoading', newVal);
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}