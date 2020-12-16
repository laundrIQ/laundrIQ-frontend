import makeStyles from "@material-ui/core/styles/makeStyles.js";
import "../styles/wave.css";
import React from 'react';
import PropTypes from 'prop-types';
import useTheme from "@material-ui/core/styles/useTheme.js";

const useStyles = makeStyles(theme => ({
    waveRoot: {
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        height: '6rem',
        transform: 'scaleY(-1)'
    }
}));

const waveConfig = [
    {
        speed: 30,
        opacity: 0.3,
        height: 6,
        width: 600,
    },
    {
        speed: 45,
        opacity: 0.6,
        height: 6,
        width: 600,
    },
    {
        speed: 15,
        opacity: 1,
        height: 3,
        width: 300,
    },
];

// const waveConfig = [
//     {
//         speed: 30,
//         opacity: 0.3,
//         height: 6,
//         width: 800,
//     },
//     {
//         speed: 45,
//         opacity: 0.6,
//         height: 6,
//         width: 800,
//     },
//     {
//         speed: 15,
//         opacity: 1,
//         height: 3,
//         width: 400,
//     },
// ];

const getWaveStyle = config => ({
    '--height': config.height,
    '--opacity': config.opacity,
    '--speed': config.speed,
    '--width': config.width
});



const SingleWave = props => {
    const theme = useTheme();

    return (
        <svg
            className="wave"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 762 52.917"
            preserveAspectRatio="none"
            style={getWaveStyle(waveConfig[props.number])}
        >
            <defs>
                <path id="wave"
                      d="M0 0c22.863 0 40.637 25.93 63.5 25.93S104.137 0 127 0s40.637 25.93 63.5 25.93S231.137 0 254 0s40.637 25.93 63.5 25.93S358.137 0 381 0s40.637 25.93 63.5 25.93S485.137 0 508 0s40.637 25.93 63.5 25.93S612.137 0 635 0s40.637 25.93 63.5 25.93S739.137 0 762 0v52.917H0z"
                      fill={theme.palette.primary.main}/>
            </defs>
            <g>
                <use href="#wave"/>
            </g>
        </svg>
    );
}

SingleWave.propTypes = {
    number: PropTypes.number
};
SingleWave.defaultProps = {
    number: 0
}

const Waves = props => {
    const classes =useStyles();
    return (
        <div className={classes.waveRoot}>
            <SingleWave number={0}/>
            <SingleWave number={1}/>
            <SingleWave number={2}/>
        </div>
    );
};

Waves.propTypes = {};

export default Waves;