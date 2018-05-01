import { mapGetters } from 'vuex';

const GLOBAL = {
    methods: {
        /* Static URLs Methods */
        pusherURL(){
            const pusherURL = "http://localhost:15536";
            return pusherURL;
        },
        websiteURL(){
            const websiteURL = "http://localhost:8080";
            return websiteURL;
        },
        requestURL(){
            const requestURL = "http://localhost:3000";
            return requestURL;
        },
        webstorageKey(){
            const webStorageKey = "currentUser";
            return webStorageKey;
        },
        /* Login Purposes */
        /* Web Storage Methods */
        getWebStorageCurrentUser(){
            let currentUser = null;
            const webStorageKey = this.webstorageKey();

            // Seek localStorage first for user
            currentUser = JSON.parse(localStorage.getItem(webStorageKey));
            if(currentUser === null){
                // No user in LS, seek in sessionStorage
                currentUser = JSON.parse(sessionStorage.getItem(webStorageKey));
                return currentUser;
            }
            return currentUser;
        },
        saveWebStorageCurrentUser(user, isLocal){
            debugger;
            const webStorageKey = this.webstorageKey();

            // isLocal indicates the webstorage that will be used
            if(isLocal){
                localStorage.setItem(webStorageKey, JSON.stringify(user));
                return true;
            }else{
                sessionStorage.setItem(webStorageKey, JSON.stringify(user));
                return true;
            }
        },
        removeWebStorageCurrentUser(){
            const webStorageKey = this.webstorageKey();
            
            // Clean both of them
            localStorage.removeItem(webStorageKey);
            sessionStorage.removeItem(webStorageKey);
            return true;
        }
    }
}
 
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
            this.currentUserInfo
        }
    },
    methods:{
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

export { GLOBAL, USER_LOGGED, USER_AUTH };