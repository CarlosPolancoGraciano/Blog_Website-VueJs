import { mapGetters } from 'vuex';

const FILTER = {
    computed: {
        ...mapGetters([
            'getFilterVals'
        ])
    },
    methods: {
        // Save filter in Vuex
        setFilterInVuex(filterVal){
            this.$store.dispatch('setFilterVal', filterVal);
        }
    }
};

export { FILTER };