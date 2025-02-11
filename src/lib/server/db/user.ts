export type Post = {
	POST: string;
	TITLE: string;
	text: string;
	like: number;
	dislike: number;
};

export type Interaction = {
	POST: string;
	STATUS: string;
};

export type UserData = {
    USERNAME: string,
	posts: Post[];
	interactions: Interaction[];
};

export type Database = {
	[key: string]: UserData;
};
