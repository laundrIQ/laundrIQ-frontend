import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from "./Home.js";
import themes from "./styles/themes.js";
import {ThemeProvider} from "@material-ui/core/styles";

const Root = () => {
    const [darkMode, setDarkMode] = React.useState(themes.isDarkTheme());
    themes.onThemeChange(enable => {
        setDarkMode(enable);
    });

    return (
        <ThemeProvider theme={themes.getCurrentTheme()}>
            <Home/>
        </ThemeProvider>
    );
}

ReactDOM.render(<Root/>, document.getElementById('root'));