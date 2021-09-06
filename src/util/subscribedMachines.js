const key = 'subscribed-machines';
const initChannel = new BroadcastChannel('notification-init');

const saveMachines = m => {
    sessionStorage.setItem(key, JSON.stringify(m));
    initChannel.postMessage({type: 'subbed-machines', payload: m});
};

const loadMachines = () => {
    const res = sessionStorage.getItem(key);
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
    saveMachines(subbedMachines);
    return subbedMachines;
};

export default {
    save: saveMachines,
    get: loadMachines,
    clean: cleanMachines
}