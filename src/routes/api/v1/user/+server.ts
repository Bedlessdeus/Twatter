import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({request}) => {
    let bod = await request.json()
    if(bod.user == null || bod.pass == null) return json({status: 500});
    
    return json({status: 200});
}