import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from "./Home.js";
import themes from "./styles/themes.js";
import {ThemeProvider} from "@material-ui/core/styles";
import {BrowserRouter} from "react-router-dom";
import moment from "moment";

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
}

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

ReactDOM.render(<Root/>, document.getElementById('root'));