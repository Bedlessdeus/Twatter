import { containsUsername, getUser, stringToUUID } from "$lib/server/db/dbutil";

export const validateUsername = async (username: string, checkexists : boolean = true): Promise<boolean> => {
    if (username == undefined) return false;
    if (!/^[a-zA-Z0-9]{3,12}$/.test(username)) return false;
    if(checkexists)
        if (await containsUsername(username)) return false;
    return true;
}



export const validateUser = async (userId: string, userHash : string) => {

        if (!userId || !userHash) {
            return false;
        }
    
        const user = await getUser(stringToUUID(userId));
        if (!user) {
            return false;
        }
    
        const isValidHash = userHash === user.user_enc;

        if (!isValidHash) {
            return false;
        }
    
        return true;
}