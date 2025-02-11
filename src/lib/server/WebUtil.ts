import { json } from "@sveltejs/kit";

export const genMissingParam = (required_params : Array<any>, given_params : Array<any>) => {
    return json({
        status: 400,
        body: {
            message: "Missing or invalid params",
            Missing_params: test(required_params, given_params),
            invalid_params: test(given_params, required_params)
        }
    });
}

export const issame = (arr_1 : Array<any>, arr_2 : Array<any>) : boolean=> {
    return JSON.stringify(arr_1) === JSON.stringify(arr_2);
}

const test = (arr_1 : Array<any>,  arr_2 : Array<any>) => {
    let ret : Array<any> = [];
    arr_1.forEach(element => {
        if(!arr_2.includes(element)) ret.push(element);
    });
    return ret;
}
