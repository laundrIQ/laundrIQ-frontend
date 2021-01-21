import makeStyles from "@material-ui/core/styles/makeStyles.js";
import useTheme from "@material-ui/core/styles/useTheme.js";
import themes from "../styles/themes.js";
import {CardActionArea, emphasize, fade} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import PropTypes from "prop-types";
import React from "react";

const useStyles = makeStyles(theme => ({
    heatmapRoot: {
        position: 'relative',
        padding: '1em',
        overflowX: 'auto',
        display: 'flex'
    },
    heatmapColumn: {
        fontSize: '1em',
        fontFamily: theme.typography.fontFamily,
        fontWeight: '600',
        borderRadius: '0.3em',
        width: '2em',
        margin: '0 0.1em',
        flexShrink: 0,
        flexGrow: 1
    },
    heatmapSquare: {
        width: '100%',
        height: '2em',
        borderRadius: '0.25em',
        marginBottom: '0.2em',
        position: "relative"
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
        let baseColor = themes.isDarkTheme() ? theme.palette.primary.light : emphasize(theme.palette.primary.main, 0.1);
        if (activity >= 0.75) {
            return baseColor;
        }
        else if (activity >= 0.6) {
            return fade(baseColor, 0.7);
        }
        else if (activity >= 0.35) {
            return fade(baseColor, 0.4);
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
    const columns = [];
    const legendColumn = [];

    const handleClick = i => {
        if (props.onRowClick) {
            props.onRowClick(i);
        }
    }

    legendColumn.push(<div className={classes.heatmapSquare}/>);
    for (let l of props.legendY) {
        legendColumn.push(
            <div className={classes.heatmapSquare} key={l}>
                <div className={`${classes.legendSquare} ${classes.legendSquareY}`}>
                    {l}
                </div>
            </div>
        );
    }
    columns.push(
        <div
            key="legendY"
            className={classes.heatmapColumn}
            style={{
                width: '2em',
                flexGrow: 0
            }}>
            {legendColumn}
        </div>
    );

    for (let i = 0; i < props.data.length; i++) {
        const column = [
            <div className={classes.heatmapSquare} key={`legendX-${i}`}>
                <div className={classes.legendSquare}>
                    {props.legendX[i]}
                </div>
            </div>
        ];
        for (let j = 0; j < props.data[i].length; j++) {
            column.push(
                <HeatmapSquare activity={props.data[i][j]} key={`${i}-${j}`}/>
            );
        }

        columns.push(
            props.clickableColumns ?
                <CardActionArea
                    key={`column-${i}`}
                    onClick={() => handleClick(i)}
                    className={classes.heatmapColumn}
                >
                    {column}
                </CardActionArea>
                :
                <div className={classes.heatmapColumn} key={`column-${i}`}>
                    {column}
                </div>
        );
    }

    return (
        <div className={classes.heatmapRoot} style={{width: props.width}}>
            {columns}
        </div>
    );
};

Heatmap.propTypes = {
    data: PropTypes.array.isRequired,
    legendX: PropTypes.array,
    legendY: PropTypes.array,
    clickableColumns: PropTypes.bool,
    onRowClick: PropTypes.func,
    width: PropTypes.string
};

export default Heatmap;