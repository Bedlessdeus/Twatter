import fs from 'fs';
import path from 'path';
import type { Database, UserData, Interaction, Post, CPost } from '$lib/server/db/user';
import { v4 as uuid } from 'uuid';
import { env } from '$env/dynamic/private';
import type { UUID } from 'crypto';

const filePath = env.DB_LOCAL_PATH || path.join(process.cwd() + '/src/lib/server/db', 'db.json');

/* File Util */
const readFile = (): Database => {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Database;
};

const writeFile = (db: Database) => {
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
};

const db = readFile();

/* User Util */
export const addUser =  (username: string, pass_enc : string): string => {
    if(containsUsername(username)) return "INVALID";
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

export const removeUser =  (userID: UUID) => {
    if (db[userID]) {
        delete db[userID];
        writeFile(db);
    }
}

export const getUser =  (userID: UUID): UserData | null => {
    return db[userID] || null;
}

export const getUserByUsername =  (username: string): UserData | null => {
	return Object.values(db).find(user => user.username.toLowerCase() === username.toLowerCase()) || null;
}

export const getUserId =  (username: string): UUID | null => {
	const user = Object.entries(db).find(([_, user]) => user.username.toLowerCase() === username.toLowerCase());
	return user ? stringToUUID(user[0]) : null;
}

export const containsUser =  (userID: UUID): boolean => {
    const db = readFile();
    return !!db[userID];
}

export const updateUser =  (userID: UUID, userData : UserData) : UserData | null => {
    if(!containsUser(userID)) return null;
    db[userID] = userData;
    writeFile(db);
    return userData;
}

export const containsUsername = (username: string): boolean => {
	return Object.values(db).some(user => user.username.toLowerCase() === username.toLowerCase());
}

/* Post Util */
export const addPost =  (userID: UUID, title: string, text: string) => {
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

export const removePost =  (userID: UUID, postID: UUID) => {
    if (db[userID]) {
        db[userID].posts = db[userID].posts.filter(post => post.post !== postID);
        writeFile(db);
    }
}

export const updatePost =  (userID: UUID, postID: UUID, post: Post): Post | null => {
    if(!containsPost(userID, postID)) return null;
    if(db[userID]) {
        db[userID].posts = db[userID].posts.filter(pot => pot.post !== postID)
        db[userID].posts.push({
            post: post.post,
            title: post.title,
            text: post.text,
            like: post.like,
            dislike: post.dislike
        });
        writeFile(db);
        return post;
    }
    return null;
}

export const getPost =  (userID: UUID, postID: UUID): Post | null => {
    if (!containsPost(userID, postID)) return null;
    const user = db[userID];
    if (user) {
        return user.posts.find(post => post.post === postID) || null;
    }
    return null;
}

export const containsPost =  (userID: UUID, postID: UUID): boolean => {
    const user = db[userID];
    if (user) {
        return user.posts.some(post => post.post === postID);
    }
    return false;
}

export const getTopPosts =  (limit : number = 10, offset: number = 0) : Post[] => {
    const allPosts : Post[] = Object.entries(db).flatMap(([userId, userData]) =>
        userData.posts.map(  post => ({
            ...post
        }))
    );
    const sortedPosts = allPosts.sort((a, b) => b.like - a.like);
    return sortedPosts.slice(offset, limit + offset);
}

export const getTopCPosts = (limit : number = 10, offset: number = 0): CPost[] => {
    let topPosts = getTopPosts(limit, offset);
    let posts: Array<CPost> = [];
	for (const post of topPosts) {
		const posterUUID = (getPoster(post.post)) ?? stringToUUID('');
		let posterUser = getUser(posterUUID);
		if (posterUser == null)
			posterUser = { username: 'Error', user_enc: 'Error', posts: [], interactions: [] };
		let cpo: CPost = {
			post: post.post,
			poster: posterUUID,
			posterUser: posterUser.username,
			title: post.title,
			text: post.text,
			like: post.like,
			dislike: post.dislike
		};
        console.log(cpo)
		posts.push(cpo);
	}
    return posts;
}

export const getPoster =  (post : UUID) : UUID | null => {
    let outValue : UUID | null = null;
    Object.entries(db).flatMap(([userID, userData]) => {
        if(outValue != null) return;
        userData.posts.map(uPo => {
            if(outValue != null) return;
            if(uPo.post == post) {
                outValue = stringToUUID(userID);
                return;
            }
        })
    })
    return outValue;
}

export const getUserPostInteractions =  (poster : UUID, post : UUID, userID : UUID): Interaction[] => {
    if(!containsPost(poster, post)) return [];
    if(!containsUser(userID)) return [];
    let user = getUser(userID);
    if(user == null || user.interactions == null ||  user.interactions.length == 0) return [];
    let ret : Interaction[] = []
    user.interactions.forEach((Interaction) => {
        if(Interaction.post == post)
            ret.push(Interaction)
    })
   return ret;
}

/* Like */
export const addLike =  (userID : UUID, post: UUID, liker : UUID): boolean => {
    if(hasLiked(userID, post, liker)) return false;
    let postDat = getPost(userID, post);
    if(postDat == null) return false;
    postDat.like++;
    updatePost(userID, post, postDat)
    addInteraction(liker, post, {post: post, status: "LIKE"});
    return true;
}

export const hasLiked =  (userID: UUID, post : UUID, liker : UUID): boolean => {
    let postDat = getPost(userID, post);
    if(postDat == null) return false;
    let likingUser = getUser(liker);
    if(likingUser == null) return false;
   let interaction = (getUserPostInteractions(userID, post,liker))[0];
   if(interaction == null) return false;
   if(interaction.status == "LIKE") return true;
   return false;
}

export const addInteraction =  (userID : UUID, post : UUID, interaction : Interaction) => {
    if(!containsUser(userID)) return null;
    let user = getUser(userID);
    if(user == null) return null;
    user.interactions.push(interaction);
    updateUser(userID, user);
    return interaction;
}

/* Other Util */
export const stringToUUID = (str: string): UUID => {
	return str as UUID;
};