import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from "./Home.js";
import themes from "./styles/themes.js";
import {ThemeProvider} from "@material-ui/core/styles";
import {BrowserRouter} from "react-router-dom";

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

ReactDOM.render(<Root/>, document.getElementById('root'));