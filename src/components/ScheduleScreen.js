import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import makeStyles from "@material-ui/core/styles/makeStyles.js";
import ScheduleCard from "./ScheduleCard.js";
import CircularProgress from "@material-ui/core/CircularProgress";
import {animated, useTransition} from "react-spring";
import api from "../util/api.js";
import settings from "../util/settings.js";
import display from "../util/display.js";

const useStyles = makeStyles(theme => ({
    scheduleScreen: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    scheduleScreenPortrait: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center'
    },
}));

const ScheduleScreen = props => {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(async () => {
        setData(await api.getStatistics(settings.get().statisticsWeeks));
        setLoading(false);
    }, []);

    settings.onSettingsChange(async changed => {
        setLoading(true);
        setData(await api.getStatistics(changed.statisticsWeeks));
        setLoading(false);
    });

    const scheduleCards = [];
    if (loading) {
        scheduleCards.push(
            <div key="spinner" style={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '10em',
                height: '10em'
            }}>
                <CircularProgress style={{position: 'absolute'}}/>
            </div>
        );
    }
    else {
        for (let room in data) {
            scheduleCards.push(
                <ScheduleCard
                    name={`Room ${room}`}
                    data={data[room]}
                />
            );
        }
    }

    const transitions = useTransition(scheduleCards, r => r.key, {
        from: {
            opacity: 0,
            transform: 'translateX(25%)'
        },
        enter: {
            opacity: 1,
            transform: 'translateX(0%)'
        },
        leave: {
            opacity: 0,
            transform: 'translateX(-25%)'
        },
        trail: 200
    });

    return (
        <div className={display.isPortrait() ? classes.scheduleScreenPortrait : classes.scheduleScreen}>
            {transitions.map(({item, key, props: fprops}) =>
                <animated.div key={key} style={fprops}>{item}</animated.div>
            )}
        </div>
    );
};

ScheduleScreen.propTypes = {};

export default ScheduleScreen;