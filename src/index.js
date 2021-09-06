import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from "./Home.js";
import themes from "./styles/themes.js";
import {ThemeProvider} from "@material-ui/core/styles";
import {BrowserRouter} from "react-router-dom";
import moment from "moment";
import {endpoint} from "./api-endpoint.json";
import subscribedMachines from './util/subscribedMachines.js';

const Root = () => {
    const [darkMode, setDarkMode] = React.useState(themes.isDarkTheme());
    themes.onThemeChange(enable => {
        setDarkMode(enable);
    });

    return (
        <BrowserRouter>
            <ThemeProvider theme={themes.getCurrentTheme()}>
                <Home/>
            </ThemeProvider>
        </BrowserRouter>
    );
};

moment.updateLocale('en', {
    week: {
        dow: 1,
    },
});
moment.updateLocale('de', {
    week: {
        dow: 1,
    },
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        navigator.serviceWorker.register('/notificationWorker.js').then((registration) => {
            // Registration was successful
            console.log('notificationWorker registration successful with scope: ', registration.scope);
        }, (err) => {
            // registration failed :(
            console.log('notificationWorker registration failed: ', err);
        });

        await navigator.serviceWorker.ready;
        console.log("sending test broadcast...");
        const initChannel = new BroadcastChannel('notification-init');
        initChannel.postMessage({type: 'api-endpoint', payload: endpoint});
        initChannel.postMessage({type: 'subbed-machines', payload: subscribedMachines.get()});

        initChannel.onmessage = e => {
            if (!e.data) return;
            switch (e.data.type) {
                case 'sw-subbed-machines':
                    subscribedMachines.save(e.data.payload);
                    break;
            }
        }
    });
}

ReactDOM.render(<Root/>, document.getElementById('root'));