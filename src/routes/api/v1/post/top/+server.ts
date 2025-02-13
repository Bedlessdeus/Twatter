import { getTopPosts } from "$lib/server/db/dbutil";
import { genMissingParam, issame } from "$lib/server/WebUtil";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
    if(!issame(["limit", "offset"], [...url.searchParams.keys()]))
        return genMissingParam(["limit", "offset"], [...url.searchParams.keys()]);

    const limit = parseInt(url.searchParams.get("limit") || "10");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const topPosts = await getTopPosts(limit, offset);

    return json({posts: topPosts}, { status: 200 })
}