import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from "@material-ui/core/styles/makeStyles.js";
import useTheme from "@material-ui/core/styles/useTheme.js";
import {fade} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import themes from "../styles/themes.js";

const useStyles = makeStyles(theme => ({
    heatmapRoot: {
        position: 'relative',
        padding: '1em',
        overflowX: 'auto'
    },
    heatmapRow: {
        display: 'flex'
    },
    heatmapSquare: {
        width: '2em',
        height: '2em',
        borderRadius: '0.25em',
        margin: '0.1em',
        position: "relative",
        flexShrink: 0
    },
    legendSquare: {
        width: '100%',
        height: '100%',
        fontSize: '0.75em',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    legendSquareY: {
        alignItems: "right",
        position: "absolute",
        top: '-50%',
        right: '0.4em'
    }
}));

const HeatmapSquare = props => {
    const classes = useStyles();
    const theme = useTheme();

    const getHeatmapColor = (activity) => {
        let baseColor = themes.isDarkTheme() ? theme.palette.primary.light : theme.palette.primary.light;
        if (activity >= 0.75) {
            return baseColor;
        }
        else if (activity >= 0.5) {
            return fade(baseColor, 0.6);
        }
        else if (activity >= 0.15) {
            return fade(baseColor, 0.25);
        }
        else return theme.palette.action.disabledBackground;
    };

    return (
        <Tooltip title={`activity: ${Math.round(props.activity * 100)}%`}>
                <div
                    className={classes.heatmapSquare}
                    style={{
                        backgroundColor: getHeatmapColor(props.activity),

                    }}
                />
        </Tooltip>
    );
}

HeatmapSquare.propTypes = {
    activity: PropTypes.number
}

const Heatmap = props => {
    const classes = useStyles();
    const rows = [];

    const legendRow = [];

    legendRow.push(<div className={classes.heatmapSquare}/>);
    for (let l of props.legendX) {
        legendRow.push(
            <div className={classes.heatmapSquare}>
                <div className={classes.legendSquare}>{l}</div>
            </div>
        );
    }
    rows.push(
        <div className={classes.heatmapRow}>
            {legendRow}
        </div>
    );

    for (let i = 0; i < props.data[0].length; i++) {
        const row = [];

        row.push(
            <div className={classes.heatmapSquare}>
                <div className={`${classes.legendSquare} ${classes.legendSquareY}`}>
                    {props.legendY[i]}
                </div>
            </div>
        )

        for (let j = 0; j < props.data.length; j++) {
            row.push(
                <HeatmapSquare activity={props.data[j][i]}/>
            );
        }
        rows.push(
            <div className={classes.heatmapRow}>
                {row}
            </div>
        );
    }

    return (
        <div className={classes.heatmapRoot}>
            {rows}
        </div>
    );
};

Heatmap.propTypes = {
    data: PropTypes.array.isRequired,
    legendX: PropTypes.array,
    legendY: PropTypes.array
};

const Schedule = props => {
    let data = [];
    for (let i = 0; i < 7; i++) {
        data.push([]);
        for (let j = 0; j < 12; j++) {
            data[i].push(Math.random());
        }
    }
    const legendX = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
    const legendY = ['0:00', '2:00', '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

    return (
        <div>
            <Heatmap
                data={data}
                legendX={legendX}
                legendY={legendY}
            />
        </div>
    );
};

Schedule.propTypes = {};

export default Schedule;