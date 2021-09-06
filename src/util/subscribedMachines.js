import settings from "./settings.js";
import api from "./api.js";

const key = 'subscribed-machines';

const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const saveMachines = async (m, silent) => {
    if (localStorage.getItem(key) === JSON.stringify(m)) return;

    let update = true;

    if (!silent) {
        try {
            const reg = await navigator.serviceWorker.getRegistration();
            let subscription = await reg.pushManager.getSubscription();
            if (!subscription) {
                const key = await settings.getNotificationPublicKey();
                try {
                    subscription = await reg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlB64ToUint8Array(key)
                    });
                }
                catch (e) {
                    // user probably didn't grant permission
                    console.error("user didn't grant permission or something similar went wrong...", e);
                    update = false;
                }
            }
            if (subscription) {
                await api.updatePushSubscription(subscription, m);
            }
        }
        catch (e) {
            console.error("subscription stuff went wrong...", e);
        }
    }
    if (update) {
        localStorage.setItem(key, JSON.stringify(m));
        return m;
    }
    else {
        return loadMachines();
    }
};

const loadMachines = () => {
    const res = localStorage.getItem(key);
    if (!res) return [];
    else return JSON.parse(res);
};

const cleanMachines = (rooms) => {
    let subbedMachines = loadMachines();
    for (let r of rooms) {
        for (let m of r.machines) {
            if (!m.isBusy && subbedMachines.includes(m.name)) {
                subbedMachines.splice(subbedMachines.indexOf(m.name), 1);
            }
        }
    }
    saveMachines(subbedMachines, true);
    return subbedMachines;
};

export default {
    save: saveMachines,
    get: loadMachines,
    clean: cleanMachines
}