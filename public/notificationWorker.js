const initChannel = new BroadcastChannel('notification-init');
const statusChannel = new BroadcastChannel('machine-status');
let apiEndpoint;
let machineStatus = {};
let subscribedMachines = [];

const getCurrentStatus = async () => {
    return await (await fetch(apiEndpoint + "/machines")).json()
};

const sendNotification = async machine => {
    await self.registration.showNotification(`Machine ${machine.name} is free!`, {
        body: `Machine ${machine.name} in room ${machine.room} has just stopped working and should be free to use.`,
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: machine.name
        },
    });
};

// This triggers when user starts the app
self.addEventListener('install', event => {
    console.log("installing");
    initChannel.onmessage = e => {
        if (!e.data) return;
        switch (e.data.type) {
            case 'api-endpoint':
                apiEndpoint = e.data.payload;
                console.log("got api endpoint!");
                break;
            case 'subbed-machines':
                subscribedMachines = e.data.payload;
                console.log("new machines!", subscribedMachines);
                break;
        }
    };
});

// This triggers when service is ready to do stuff
self.addEventListener('activate', event => {
    console.log("activating");
    setInterval(async () => {
        if (!apiEndpoint) return;

        console.log("refreshing machine status...");
        machineStatus = await getCurrentStatus();
        statusChannel.postMessage({type: 'machine-status', payload: machineStatus});

        let sendUpdate = false;
        // iterate through all machines and check if a subscribed machine is now free
        if (subscribedMachines.length > 0) {
            for (let room of machineStatus.rooms) {
                for (let machine of room.machines) {
                    if (!machine.isBusy && subscribedMachines.includes(machine.name)) {
                        console.log(machine.name, "is subscribed and not busy anymore!");
                        subscribedMachines.splice(subscribedMachines.indexOf(machine.name), 1);
                        sendUpdate = true;
                        sendNotification(machine);
                    }
                }
            }
        }
        if (sendUpdate) {
            statusChannel.postMessage({type: 'sw-subbed-machines', payload: subscribedMachines});
        }
    }, 10000);
});

self.addEventListener('update', event => {
    console.log("update!");
})