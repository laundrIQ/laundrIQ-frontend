import React, {useState} from 'react';
import PropTypes from 'prop-types';
import makeStyles from "@material-ui/core/styles/makeStyles.js";
import Paper from "@material-ui/core/Paper";
import {CardActionArea, fade} from "@material-ui/core";
import themes from "../styles/themes.js";
import RoundIcon from "./RoundIcon.js";

const useStyles = makeStyles(theme => ({
    switcherRoot: {
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        borderRadius: '2em',
        padding: '0.25em 0.5em',
        pointerEvents: "all"
    },
    tabItemContainer: {
    },
    icon: {
        borderRadius: '1.5em',
        padding: '0.5em 1.25em',
        margin: '0.25em',
        color: theme.palette.text.disabled,
    },
    iconSelected: {
        color: themes.isDarkTheme() ? theme.palette.primary.light : theme.palette.primary.main,
        backgroundColor: themes.isDarkTheme() ? fade(theme.palette.primary.light, 0.25) : fade( theme.palette.primary.main, 0.15),
    }
}));

const TabItem = props => {
    const classes = useStyles();

    return (
        <CardActionArea
            className={`${classes.icon} ${props.selected && classes.iconSelected}`}
            onClick={props.onClick}
        >
            <RoundIcon>{props.icon}</RoundIcon>
        </CardActionArea>
    );
};

TabItem.propTypes = {

};

const FloatingTabSwitcher = props => {
    const classes = useStyles();
    const [selected, setSelected] = useState(window.location.pathname);

    const handleClick = t => {
        setSelected(t);
        if (props.onSwitch) {
            props.onSwitch(t);
        }
    };

    const items = [];
    for (let t in props.tabs) {
        items.push(
            <TabItem
                key={t}
                icon={props.tabs[t]}
                selected={selected === t}
                onClick={() => handleClick(t)}
            />
        )
    }

    return (
        <Paper elevation={3} className={classes.switcherRoot}>
            {items}
        </Paper>
    );
};

FloatingTabSwitcher.propTypes = {
    tabs: PropTypes.object.isRequired,
    onSwitch: PropTypes.func
};

export default FloatingTabSwitcher;