
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

export default {
    get: getSettings,
    save: saveSettings,
    onSettingsChange
}