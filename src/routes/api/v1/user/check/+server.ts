import { genMissingParam, issame } from "$lib/server/WebUtil";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({url}) => {
    if(!issame(["USERNAME"], [... url.searchParams.keys()])) {
        return genMissingParam(["USERNAME"], [... url.searchParams.keys()]);
    }
    return json({status: 200, used: false})
}