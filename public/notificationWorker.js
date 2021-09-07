
const sendNotification = async machine => {
    return self.registration.showNotification(`Machine ${machine.name} is free!`, {
        body: `Machine ${machine.name} in room ${machine.room} has just stopped working and should be free to use.`,
        vibrate: [100, 50, 100],
        icon: '/favicon.png',
        data: {
            dateOfArrival: Date.now(),
            primaryKey: machine.name
        },
    });
};

self.addEventListener('push', event => {
    const machine = JSON.parse(event.data.text());
    console.log("push!", machine);
    event.waitUntil(sendNotification(machine));
});