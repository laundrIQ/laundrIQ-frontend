import {createMuiTheme} from "@material-ui/core";

const typography = {
    fontFamily: [
        'Nunito',
        'sans-serif'
    ]
};
const rootTransition = {root: {transition: 'background-color 0.5s, color 0.5s'}};
const overrides = {
    MuiPaper: rootTransition,
    MuiCard: rootTransition,
    MuiCardActions: rootTransition,
    MuiChip: rootTransition,
    MuiTypography: rootTransition,
    MuiIcon: rootTransition,
    MuiListItemText: {primary: {transition: '0s'}},
    MuiTimeline: {root: {paddingLeft: 0, paddingRight: 0}}
};

export const lightTheme = createMuiTheme({
    palette: {
        type: "light",
        primary: {
            main: '#7C4DFF'
        },
        secondary: {
            main: '#7C4DFF'
        }
    },
    typography,
    overrides
});

export const darkTheme = createMuiTheme({
    palette: {
        type: "dark",
        primary: {
            main: '#7C4DFF'
        },
        secondary: {
            main: '#7C4DFF'
        }
    },
    typography,
    overrides
});

const getCurrentTheme = () => isDarkTheme() ? darkTheme : lightTheme;

const setDarkTheme = (enable) => {
    localStorage.setItem('darkMode', enable);
    if (themeCallback) {
        themeCallback(enable);
    }
};
const isDarkTheme = () => localStorage.getItem('darkMode') === 'true';

let themeCallback;
let onThemeChange = (callback) => {
    themeCallback = callback;
};

export default {
    getCurrentTheme,
    isDarkTheme,
    setDarkTheme,
    onThemeChange
}