import { genMissingParam, issame } from '$lib/server/WebUtil';
import { json, type RequestHandler } from '@sveltejs/kit';
import { addUser } from '$lib/server/db/dbutil';
import { env } from '$env/dynamic/private';
import path from 'path';
import fs from 'fs';

const filePath = env.DB_PATH || path.join(process.cwd() + '/src/lib/server/db', 'db.json');

const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

//TODO: Unfucketh this
export const GET: RequestHandler = async ({ request, url }) => {
	if (!issame([...url.searchParams.keys()], ['userid'])) {
		return genMissingParam(['userid'], [...url.searchParams.keys()]);
	}

	console.log(JSON.stringify(data, null, 2));

	return json({
		status: 200,
		BODY: {
			POSTS: [
				{
					title: 'Test',
					text: 'Very important and epic test here',
					LIKE: 1,
					DISLIKE: 100
				},
				{
					title: 'Very goood',
					text: 'Very important and epic test here',
					LIKE: 90,
					DISLIKE: 101
				},
				{
					title: 'Not god',
					text: 'Very important and epic test here',
					LIKE: 1000,
					DISLIKE: 100
				},
				{
					title: 'Noice',
					text: 'Very important and epic test here',
					LIKE: 10,
					DISLIKE: 1
				},
				{
					title: 'Cheese',
					text: 'Very important and epic test here',
					LIKE: 1,
					DISLIKE: 1
				},
				{
					title: 'Croissant',
					text: 'Are you gonna be eating that Croissant?!',
					LIKE: 5,
					DISLIKE: 0
				},
				{
					title: 'La Baguette',
					text: 'That Bagutette :D',
					LIKE: 10000,
					DISLIKE: 10
				},
				{
					title: 'Not famous',
					text: 'Very important and epic test here',
					LIKE: 9,
					DISLIKE: 8
				},
				{
					title: 'Not that epic',
					text: 'Very important and epic test here',
					LIKE: 10,
					DISLIKE: 100
				}
			]
		}
	});
};

export const POST: RequestHandler = async ({ request, url }) => {
	console.log('posted');
	return json({ status: 200 });
};
