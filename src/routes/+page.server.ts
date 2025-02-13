import type {  PageServerLoad } from './$types';
import type { Post } from '$lib/server/db/user';
import type { UUID } from 'crypto';
import { getPoster, getUser, stringToUUID } from '$lib/server/db/dbutil';

export type ret = {
	posts: Array<CPost>
}

export type CPost = {
	poster: UUID;
	posterUser: string;
	post: UUID;
	title: string;
	text: string;
	like: number;
	dislike: number;
}

export const load: PageServerLoad = async ({cookies}): Promise<ret> => {
	const userID = cookies.get("userID");

	if(!userID) return {posts: []}

	let cookie = `userID=${userID}; token=${cookies.get("token")}`

	let f = await fetch(`http://localhost:5173/api/v1/post/top?limit=10&offset=0`, {
		headers: {
			"Cookie":  cookie 
		},
		method: 'GET'
	});

	let bod = await f.json();

	if(!f.ok)
		return {posts: [] };

	const bodPosts : Array<Post> = bod.posts;
	let posts : Array<CPost> = []
	bodPosts.forEach(async post => {
		const posterUUID = await getPoster(post.post)?? stringToUUID("");
		let posterUser = await getUser(posterUUID);
		if(posterUser == null)
			posterUser = {username: "Error", user_enc: "Error", posts: [], interactions: []} 
		let cpo : CPost = {
			post: post.post,
			poster: posterUUID,
			posterUser: posterUser.username,
			title: post.title,
			text: post.text,
			like: post.like,
			dislike: post.dislike
		}
		posts.push(cpo)
	});
	return {posts: posts };
};
