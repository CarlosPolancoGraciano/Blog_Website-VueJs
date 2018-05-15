import { mapGetters } from 'vuex';

const USER_LOGGED = {
    computed: {
        // Access like any data value in a Vue component
        ...mapGetters([
            'getUserLogged'
        ])
    },
    watch:{
        getUserLogged(newVal, oldVal){
            this.currentUserLoggedState(newVal);
        }
    },
    methods: {
        currentUserLoggedState(newVal){},
        setUserLogged(){
            this.$store.dispatch('setUserLogged', true);
        },
        removeUserLogged(){
            this.$store.dispatch('setUserLogged', false);
        }
    }
};

const USER_AUTH = {
    computed: {
        // Access like any data value in a Vue component
        ...mapGetters([
            'getCurrentUser'
        ])
    },
    watch:{
        getCurrentUser(newVal, oldVal){
            this.currentUserInfo(newVal);
        }
    },
    methods:{
        currentUserInfo(newVal){},
        setAuthCurrentUser(user){
            if(user.length > 0){
                // Recieve an array with current user object
                this.$store.dispatch('setCurrentUser', user[0]);
            }else{
               // Recieve the current user object
               this.$store.dispatch('setCurrentUser', user);
            }
        },
        removeAuthCurrentUser(){
            this.$store.dispatch('removeCurrentUser');
        }
    }
};

export { USER_LOGGED, USER_AUTH };