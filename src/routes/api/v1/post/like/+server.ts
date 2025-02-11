import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({request}) => {
    let bod = await request.json();
    if(bod.method != "add" || bod.method != "remove") return json({status: 403, message: "Malformed content, no method added, please use 'add' or 'remove'"})
    return json({status: 405});
}