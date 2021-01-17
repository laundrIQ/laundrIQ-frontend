import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from "@material-ui/core/styles/makeStyles.js";
import Paper from "@material-ui/core/Paper";
import Schedule from "./Schedule.js";
import CardContent from "@material-ui/core/CardContent";
import CardTitle from "./CardTitle.js";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles(theme => ({
    scheduleScreen: {
        display: 'flex',
        flexWrap: 'wrap'
    },
}));

const ScheduleScreen = props => {
    const classes = useStyles();
    return (
        <div className={classes.scheduleScreen}>
            <Card>
                <CardContent>
                    <CardTitle>
                        Room X
                    </CardTitle>
                    <Schedule/>
                </CardContent>
            </Card>
        </div>
    );
};

ScheduleScreen.propTypes = {};

export default ScheduleScreen;