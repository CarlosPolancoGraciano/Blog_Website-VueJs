export const global = {
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
        isLocalKey(){
            const isLocalKey = "isLocal";
            return isLocalKey;
        },
        /* Login Purposes */
        /* Web Storage Methods */
        getIsLocal(){
            let isLocalKey = this.isLocalKey();
            let isLocal = JSON.parse(localStorage.getItem(isLocalKey));

            if(isLocal === null){
                isLocal = JSON.parse(sessionStorage.getItem(isLocalKey));
                return (isLocal == "false");
            }
            return (isLocal == "true"); // String to bool
        },
        getCurrentUser(){
            let currentUser = null;
            const webStorageKey = this.webstorageKey();
            let isLocal = this.getIsLocal();

            if(isLocal){
                currentUser = JSON.parse(localStorage.getItem(webStorageKey));
                return currentUser;
            }else{
                currentUser = JSON.parse(sessionStorage.getItem(webStorageKey));
                return currentUser;
            }
        },
        saveCurrentUser(user, isLocal){
            const webStorageKey = this.webstorageKey();
            const isLocalKey = this.isLocalKey();

            if(isLocal){
                localStorage.setItem(webStorageKey, JSON.stringify(user));
                localStorage.setItem(isLocalKey, JSON.stringify(String(isLocal)));
                return true;
            }else{
                sessionStorage.setItem(webStorageKey, JSON.stringify(user));
                sessionStorage.setItem(isLocalKey, JSON.stringify(String(isLocal)));
                return true;
            }
        },
        removeCurrentUser(){
            const webStorageKey = this.webstorageKey();
            const isLocalKey = this.isLocalKey();
            let isLocal = this.getIsLocal();

            if(isLocal){
                localStorage.removeItem(webStorageKey);
                localStorage.removeItem(isLocalKey);
                return true;
            }else{
                sessionStorage.removeItem(webStorageKey);
                sessionStorage.removeItem(isLocalKey);
                return true;
            }
        }
    }
}