
// THIS FILE CONTAINS THE API ENDPOINT
// it should have the following structure:
// { "endpoint": string }
import {endpoint} from "../api-endpoint.json";

const get = async (path) => {
    // console.log(endpoint + path);
    return await (await fetch(endpoint + path)).json();
}

const post = async (path, body) => {
    return await (await fetch(endpoint + path, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })).json();
};

const getCurrentStatus = async () => {
    return await get('/machines');
}

const getStatistics = async (weeks) => {
    return await get(`/stats?weeks=${weeks}`);
}

const getPushPublicKey = async () => {
    return await get('/push-key');
}

const updatePushSubscription = async (subscription, machines) => {
    return await post('/push-subscription', {
        subscription,
        machines
    });
}

export default {
    getCurrentStatus,
    getStatistics,
    getPushPublicKey,
    updatePushSubscription
}