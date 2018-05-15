import { mapGetters } from 'vuex';

const LOADING_OVERLAY = {
    computed: {
        ...mapGetters([
            'getIsLoading'
        ])
    },
    watch:{
        getIsLoading(newVal, oldVal){
            this.returnIsLoading(newVal);
        }
    },
    methods: {
        returnIsLoading(newVal){},
        setIsLoading(){
            this.$store.dispatch('setIsLoading', true);
        },
        removeIsLoading(){
            this.$store.dispatch('setIsLoading', false);
        }
    }
};

export { LOADING_OVERLAY };