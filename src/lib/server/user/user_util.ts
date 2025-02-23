import { containsUsername, getUser, stringToUUID } from "$lib/server/db/dbutil";

export const validateUsername = (username: string, checkexists : boolean = true): boolean => {
    if (username == undefined) return false;
    if (!/^[a-zA-Z0-9]{3,12}$/.test(username)) return false;
    if(checkexists) {
        if (containsUsername(username)) return false;
    }
    return true;
}



export const validateUser = (userId: string, userHash : string) => {
        if (!userId || !userHash) {
            return false;
        }
    
        const user = getUser(stringToUUID(userId));
        if (!user) {
            console.log("Invalid User")
            return false;
        }

        const isValidHash = userHash === user.user_enc;

        if (!isValidHash) {
            return false;
        }
    
        return true;
}