import fs from 'fs';
import path from 'path';
import type { Database, UserData, Interaction, Post } from '$lib/server/db/user';
import { v4 as uuid } from 'uuid';
import { env } from '$env/dynamic/private';
import type { UUID } from 'crypto';

const filePath = env.DB_PATH || path.join(process.cwd() + '/src/lib/server/db', 'db.json');

/* User Util */
export const addUser = async (username: string, pass_enc : string): Promise<string> => {
    const db = readFile();
    const userID : UUID = stringToUUID(uuid());
    db[userID] = {
        username: username,
		user_enc: pass_enc,
        posts: [],
        interactions: []
    };
    writeFile(db);
    return userID;
};

export const removeUser = async (userID: UUID) => {
    const db = readFile();
    if (db[userID]) {
        delete db[userID];
        writeFile(db);
    }
}

export const getUser = async (userID: UUID): Promise<UserData | null> => {
    const db = readFile();
    return db[userID] || null;
}

export const getUserByUsername = async (username: string): Promise<UserData | null> => {
	const db = readFile();
	return Object.values(db).find(user => user.username === username) || null;
}

export const getUserId = async (username: string): Promise<UUID | null> => {
	const db = readFile();
	const user = Object.entries(db).find(([_, user]) => user.username === username);
	return user ? stringToUUID(user[0]) : null;
}

export const containsUser = async (userID: UUID): Promise<boolean> => {
    const db = readFile();
    return !!db[userID];
}

export const containsUsername = async (username: string): Promise<boolean> => {
	const db = readFile();
	return Object.values(db).some(user => user.username === username);
}

/* Post Util */
export const addPost = async (userID: UUID, title: string, text: string) => {
    const db = readFile();
    if (db[userID]) {
        db[userID].posts.push({
            post: stringToUUID(uuid()),
            title: title,
            text: text,
            like: 0,
            dislike: 0
        });
        writeFile(db);
    }
};

export const removePost = async (userID: UUID, postID: UUID) => {
    const db = readFile();
    if (db[userID]) {
        db[userID].posts = db[userID].posts.filter(post => post.post !== postID);
        writeFile(db);
    }
}

export const getPost = async (userID: UUID, postID: UUID): Promise<Post | null> => {
    if (!containsPost(userID, postID)) return null;
    const db = readFile();
    const user = db[userID];
    if (user) {
        return user.posts.find(post => post.post === postID) || null;
    }
    return null;
}

export const containsPost = async (userID: UUID, postID: UUID): Promise<boolean> => {
    const db = readFile();
    const user = db[userID];
    if (user) {
        return user.posts.some(post => post.post === postID);
    }
    return false;
}

/* File Util */
const readFile = (): Database => {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Database;
};

const writeFile = (db: Database) => {
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
};

/* Other Util */
export const stringToUUID = (str: string): UUID => {
	return str as UUID;
};