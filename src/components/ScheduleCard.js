import React, {useState} from 'react';
import moment from "moment";
import CardContent from "@material-ui/core/CardContent";
import CardTitle from "./CardTitle.js";
import Card from "@material-ui/core/Card";
import Heatmap from "./Heatmap.js";
import PropTypes from 'prop-types';
import makeStyles from "@material-ui/core/styles/makeStyles.js";
import {CardActionArea} from "@material-ui/core";
import {useSpring, animated} from "react-spring";
import useTheme from "@material-ui/core/styles/useTheme.js";
import IconButton from "@material-ui/core/IconButton";
import RoundIcon from "./RoundIcon.js";

const useStyles = makeStyles(theme => ({
    controlsRoot: {
        width: '100%',
        height: '2.25em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    switchContainer: {
        width: '10em',
        height: '2em',
        display: "flex",
        backgroundColor: theme.palette.action.disabledBackground,
        color: theme.palette.text.disabled,
        fontWeight: 600,
        borderRadius: '2em',
    },
    switchText: {
        zIndex: 1,
        width: '50%',
        textAlign: 'center',
        fontFamily: theme.typography.fontFamily
    },
    switchKnob: {
        position: 'absolute',
        left: '0',
        width: '50%',
        height: '100%',
        borderRadius: '2em',
        backgroundColor: theme.palette.primary.main,
    },
    weekdayRoot: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    weekdayText: {
        fontWeight: 600,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '4.5em',
        textTransform: 'lowercase'
    }
}));

const ViewSwitch = props => {
    const classes = useStyles();
    const theme = useTheme();
    const springConfig = {
        to: {
            left: props.mode ? '50%' : '0%',
            textColor1: !props.mode ? theme.palette.primary.contrastText : theme.palette.text.disabled,
            textColor2: props.mode ? theme.palette.primary.contrastText : theme.palette.text.disabled
        }
    };
    const springProps = useSpring(springConfig);

    const handleSwitchClick = () => {
        if (props.onSwitch) {
            props.onSwitch();
        }
    }

    return (
        <CardActionArea className={classes.switchContainer} onClick={() => handleSwitchClick()}>
            <animated.div className={classes.switchKnob} style={{left: springProps.left}}/>
            <animated.div className={classes.switchText} style={{color: springProps.textColor1}}>week</animated.div>
            <animated.div className={classes.switchText} style={{color: springProps.textColor2}}>day</animated.div>
        </CardActionArea>
    );
}

ViewSwitch.propTypes = {
    mode: PropTypes.bool,
    onSwitch: PropTypes.func
}

const WeekdaySwitcher = props => {
    const classes = useStyles();

    return (
        <div className={classes.weekdayRoot}>
            <IconButton onClick={props.onPrevious} disabled={props.day < 1}>
                <RoundIcon>arrow_back_ios</RoundIcon>
            </IconButton>
            <div className={classes.weekdayText}>
                {moment.weekdays(true, props.day)}
            </div>
            <IconButton onClick={props.onNext} disabled={props.day >= 6}>
                <RoundIcon>arrow_forward_ios</RoundIcon>
            </IconButton>
        </div>
    );
}

WeekdaySwitcher.propTypes = {
    day: PropTypes.number,
    onNext: PropTypes.func,
    onPrevious: PropTypes.func
};

WeekdaySwitcher.defaultProps = {
    day: 0
};

const ScheduleControls = props => {
    const classes = useStyles();

    const springConfig = {
        to: {
            opacity: props.mode ? 1 : 0,
            transform: props.mode ? "translateX(0em)" : 'translateX(-1em)'
        }
    };
    const springProps = useSpring(springConfig);
    console.log(springProps.opacity);

    const handleDayChange = d => {
        if (props.onDayChange) {
            props.onDayChange(d);
        }
    };
    const handleModeChange = m => {
        if (m) {
            handleDayChange(moment().weekday())
        }
        if (props.onModeChange) {
            props.onModeChange(m);
        }
    };

    return (
        <animated.div className={classes.controlsRoot}>
            <ViewSwitch mode={props.mode} onSwitch={() => handleModeChange(!props.mode)}/>
            <animated.div style={{...springProps, pointerEvents: props.mode ? 'all' : 'none'}}>
                <WeekdaySwitcher
                    day={props.day}
                    onNext={() => handleDayChange(props.day + 1)}
                    onPrevious={() => handleDayChange(props.day - 1)}
                />
            </animated.div>
        </animated.div>
    );
};

ScheduleControls.propTypes = {
    onModeChange: PropTypes.func,
    onDayChange: PropTypes.func
};

// EXPECTED IS THE FOLLOWING DATA STRUCTURE:
/*
[
    // one object for each day
    {
        "11-1": [float, float, float, ...], 12 values, one for every 2 hour block
        "11-2": ... ,
        ...
    },
    {
        "11-1": [float, float, float, ...],
        "11-2": ... ,
        ...
    },
    ...

]

 */

const ScheduleCard = props => {
    const [mode, setMode] = useState(false);
    const [day, setDay] = useState(0);

    const handleRowClick = i => {
        setMode(true);
        setDay(i);
    }

    const getSummedDay = day => {
        let summary = new Array(12).fill(0);
        let count = 0;
        for (let machineData of Object.values(day)) {
            for (let i = 0; i < machineData.length; i++) {
                summary[i] += machineData[i];
            }
            count += 1;
        }
        for (let i = 0; i < summary.length; i++) {
            summary[i] /= count;
        }
        return summary;
    }

    let data = [];
    let legendX = [];
    let legendY = [];
    const m = moment().set({hour: 0, minute: 0});
    for (let i = 0; i < 12; i++) {
        legendY.push(m.format('HH:mm'))
        m.add(2, 'h');
    }

    // we're looking at one day
    if (mode) {
        legendX = Object.keys(props.data[day]).map(name => `Machine ${name}`);
        data = Object.values(props.data[day]);
    }
    // we're looking at the weekly summary
    else {
        legendX = moment.weekdaysShort(true);
        for (let day of props.data) {
            data.push(getSummedDay(day));
        }
    }

    return (
        <Card>
            <CardContent>
                <CardTitle>
                    {props.name}
                </CardTitle>
                <ScheduleControls
                    mode={mode}
                    day={day}
                    onModeChange={m => setMode(m)}
                    onDayChange={d => setDay(d)}
                />
                <Heatmap
                    clickableColumns={!mode}
                    onRowClick={i => handleRowClick(i)}
                    data={data}
                    legendX={legendX}
                    legendY={legendY}
                    width="17.5em"
                />
            </CardContent>
        </Card>
    );
};

ScheduleCard.propTypes = {
    name: PropTypes.number,
    data: PropTypes.object
};

export default ScheduleCard;