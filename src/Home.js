import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from "@material-ui/core/styles/makeStyles.js";
import Waves from "./components/Waves.js";
import IconButton from "@material-ui/core/IconButton";
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import themes from "./styles/themes.js";
import BodyContent from "./components/BodyContent.js";
import Typography from "@material-ui/core/Typography";
import FloatingTabSwitcher from "./components/FloatingTabSwitcher.js";
import { useHistory  } from 'react-router-dom'

// FORMAT: [url]: [icon]
const tabs = {
    '/': "home",
    '/schedule': "event"
};

const useStyles = makeStyles(theme => ({
    root: {
        position: "absolute",
        overflow: "auto",
        width: "100vw",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.5s, color 0.5s',
    },
    headerContainer: {
        flexShrink: 0,
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
    },
    homeBody: {
        flexGrow: 1,
        padding: '2em',
        paddingBottom: '3em',
        position: 'relative'
    },
    homeFooter: {
        position: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: '100vw',
        bottom: 'min(5vh, 5vw)',
        flexShrink: 0,
    }
}));

const Header = props => {
    const classes = useStyles();

    return (
        <div className={classes.headerContainer}>
            <div className={classes.headerContent}>
                <Typography className={classes.headerTitle}>
                    {props.title}
                </Typography>
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
    const history = useHistory();

    return (
        <div className={classes.root}>
            <Header title="laundrIQ"/>
            <div className={classes.homeBody}>
                <BodyContent/>
            </div>
            <div className={classes.homeFooter}>
                <FloatingTabSwitcher
                    tabs={tabs}
                    onSwitch={t => history.push(t)}
                />
            </div>
        </div>
    );
};

Home.propTypes = {};

export default Home;