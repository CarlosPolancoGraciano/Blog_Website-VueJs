import { mapGetters } from 'vuex';

const GLOBAL = {
    methods: {
        /* Static URLs Methods */
        expressURL(){
            const expressURL = "http://localhost:15536";
            return expressURL;
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
        },
        /* Used to create new register and send to API */
        getLatestTableId(tableName = ''){
            axios.get(`${this.axiosURL}/${tableName}`)
            .then(response => {
                if(response.data.length === 0){
                    return 0;
                }
                return response.data.length
            })
        },
        /* Used to display messages of response to API */
        dynamicToastr(toastrObj){
            let that = this;
            that.$toastr( 'add',
                            { title: toastrObj.title, 
                              msg: toastrObj.msg, 
                              clickClose: true, 
                              timeout: 10000, 
                              position: 'toast-bottom-right', 
                              type: toastrObj.type });
        },
    }
}

export { GLOBAL };