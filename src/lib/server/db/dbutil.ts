import fs from 'fs'
import path from 'path'
import type { Database, UserData, Interaction, Post } from "$lib/server/db/user"
import { v4 as uuid } from 'uuid'

const filePath = "C:/Users/QEJ1FE/OneDrive - Bosch Group/Backup/Projects/sveltekittt/epic project/src/lib/server/db/users.json"

export const addUser = async (USERNAME : string) => {
    const db = readFile();
    const userID = uuid();
    db[userID] = {
        USERNAME: USERNAME,
        posts: [],
        interactions: []
    }
    writeFile(db);
}

const readFile = (): Database => {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Database;
}

const writeFile = (db : Database) => {
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2))
}