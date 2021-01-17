import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles.js";

const useStyles = makeStyles(theme => ({
    title: {
        marginTop: 0,
        marginBottom: 0,
        fontSize: '2em',
        fontWeight: 600,
        color: theme.palette.primary.main
    },
}));

const CardTitle = props => {
    const classes = useStyles();
    return (
        <h2 className={classes.title}>
            {props.children}
        </h2>
    );
};

export default CardTitle;