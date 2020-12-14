import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from "@material-ui/core/styles/makeStyles.js";
import useTheme from "@material-ui/core/styles/useTheme.js";
import Waves from "./components/Waves.js";
import IconButton from "@material-ui/core/IconButton";
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import themes from "./styles/themes.js";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100vw",
        height: "100vh",
        backgroundColor: theme.palette.background.default
    },
    headerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1em',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.default
    },
    headerTitle: {
        fontSize: '3rem',
        fontWeight: '500',
        margin: 0,
        marginLeft: '1em',
        flexGrow: 0
    },
    themeSwitcherButton: {
      color: theme.palette.background.default,
      flexShrink: 0,
        width: '66px',
    }
}));

const Header = props => {
    const classes = useStyles();

    return (
        <div>
            <div className={classes.headerContent}>
                <div className={classes.headerTitle}>{props.title}</div>
                <IconButton
                    className={classes.themeSwitcherButton}
                    onClick={() => themes.setDarkTheme(!themes.isDarkTheme())}
                >
                    {themes.isDarkTheme() ? <Brightness7Icon/> : <Brightness4Icon/>}
                </IconButton>
            </div>
            <Waves/>
        </div>
    );
};

Header.propTypes = {
    title: PropTypes.string
}

const Home = props => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Header title="laundrIQ"/>
        </div>
    );
};

Home.propTypes = {
    
};

export default Home;