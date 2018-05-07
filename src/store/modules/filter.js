const state = {
    filter: {}
}

const getters = {
    getFilterVals(state){
        return state.filter;
    }
}

const mutations = {
    setFilterVal(state, filterVal){
        state.filter = filterVal;
    }
}

const actions = {
    setFilterVal({ commit }, filterVal){
        commit('setFilterVal', filterVal);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}