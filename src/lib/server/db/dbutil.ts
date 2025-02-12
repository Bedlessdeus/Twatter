import fs from 'fs';
import path from 'path';
import type { Database, UserData, Interaction, Post } from '$lib/server/db/user';
import { v4 as uuid } from 'uuid';
import { env } from '$env/dynamic/private';

const filePath = env.DB_PATH || path.join(process.cwd() + '/src/lib/server/db', 'db.json');

export const addUser = async (USERNAME: string) => {
	const db = readFile();
	const userID = uuid();
	db[userID] = {
		USERNAME: USERNAME,
		posts: [],
		interactions: []
	};
	writeFile(db);
};

const readFile = (): Database => {
	return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Database;
};

const writeFile = (db: Database) => {
	fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
};
