import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from "@material-ui/core/styles/makeStyles.js";
import ScheduleCard from "./ScheduleCard.js";

const useStyles = makeStyles(theme => ({
    scheduleScreen: {
        display: 'flex',
        flexWrap: 'wrap'
    },
}));

const ScheduleScreen = props => {
    const classes = useStyles();

    const generateFakeMachineData = () => {
        let data = [];
        for (let i = 0; i < 12; i++) {
            data.push(Math.random());
        }
        return data;
    }

    let fakeData = [];
    for (let i = 0; i < 7; i++) {
        fakeData.push({
            'X-1': generateFakeMachineData(),
            'X-2': generateFakeMachineData()
        });
    }

    return (
        <div className={classes.scheduleScreen}>
            <ScheduleCard
                name="Room X"
                data={fakeData}
            />
        </div>
    );
};

ScheduleScreen.propTypes = {};

export default ScheduleScreen;