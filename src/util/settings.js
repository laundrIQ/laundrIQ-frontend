import api from "./api.js";

const defaultSettings = {
    statisticsWeeks: 4
};

const getSettings = () => {
    let s = localStorage.getItem('settings');
    if (!s) {
        saveSettings(defaultSettings);
        return Object.assign({}, defaultSettings);
    }

  return JSON.parse(s);
};

const saveSettings = (s) => {
    localStorage.setItem('settings', JSON.stringify(s));

    if (settingsCallback) {
        settingsCallback(s);
    }
};

let settingsCallback;
let onSettingsChange = (callback) => {
    settingsCallback = callback;
};

const getNotificationPublicKey = async () => {
    let key = sessionStorage.getItem('notif-key');
    if (!key) {
        key = (await api.getPushPublicKey()).publicKey;
        sessionStorage.setItem('notif-key', key);
    }
    return key;
}

export default {
    get: getSettings,
    save: saveSettings,
    onSettingsChange,
    getNotificationPublicKey
}