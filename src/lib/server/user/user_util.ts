import { containsUsername } from "../db/dbutil";

export const validateUsername = async (username: string): Promise<boolean> => {
    if (username == undefined) return false;
    if (!/^[a-zA-Z0-9]{3,12}$/.test(username)) return false;
    if (await containsUsername(username)) return false;
    return true;
}