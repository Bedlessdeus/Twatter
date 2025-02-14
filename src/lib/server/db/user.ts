import type { UUID } from "crypto";

export type Post = {
	post: UUID;
	title: string;
	text: string;
	like: number;
	dislike: number;
};

export type Interaction = {
	post: UUID;
	status: string;
};

export type UserData = {
	username: string;
	user_enc: string;
	posts: Post[];
	interactions: Interaction[];
};

export type Database = {
	[key: UUID]: UserData;
};

export type TopPost = {
	post: Post,
	username: string
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