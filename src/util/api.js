
// THIS FILE CONTAINS THE API ENDPOINT
// it should have the following structure:
// { "endpoint": string }
import {endpoint} from "../api-endpoint.json";

const get = async (path) => {
    console.log(endpoint + path);
    return await (await fetch(endpoint + path)).json();
}

const getCurrentStatus = async () => {
    return await get('/machines');
}

export default {
    getCurrentStatus
}