import React from 'react';
import PropTypes from 'prop-types';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles.js";
import moment from "moment";
import useTheme from "@material-ui/core/styles/useTheme.js";
import display from "../util/display.js";
import RoundIcon from "./RoundIcon.js";

const useStyles = makeStyles(theme => ({
    detailRoot: {
        display: "flex",
        minWidth: '10em',
        marginBottom: '1em'
    },
    detailIcon: {
        marginTop: '0.045em',
        fontSize: '1.5em',
        color: theme.palette.primary.main,
        flexShrink: 0
    },
    detailContent: {
        marginLeft: '0.5em',
        flexGrow: 1
    },
    detailTitle: {
        color: theme.palette.primary.main,
        fontSize: '1.5em',
        lineHeight: '1em',
    },
    detailText: {
        fontSize: '1.1em',
        textTransform: 'lowercase'
    }
}));

const DetailItem = props => {
    const classes = useStyles();

    return (
        <div className={classes.detailRoot}>
            <RoundIcon
                className={classes.detailIcon}
                style={{color: props.iconColor}}
            >
                {props.icon}
            </RoundIcon>
            <div className={classes.detailContent}>
                <Typography className={classes.detailTitle}>
                    {props.title}
                </Typography>
                <Typography className={classes.detailText}>
                    {props.text}
                </Typography>
            </div>
        </div>
    );
};

DetailItem.propTypes = {
    icon: PropTypes.string,
    iconColor: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.any
}

const MachineDetailsDialog = props => {
    const theme = useTheme();

    let statusDetails = [];
    if (props.machine.isBusy) {
        statusDetails = [
            <DetailItem
                key="startTime"
                icon="schedule"
                title="start time"
                text={moment(props.machine.startTime).calendar()}
            />,
            <DetailItem
                key="endTime"
                icon="update"
                title="end time"
                text={display.getPrettyTimeCalendar(props.machine.endTime.earliest, props.machine.endTime.latest)}
            />
        ];
    }
    else {
        statusDetails = [
            <DetailItem
                key="lastUsed"
                icon="history"
                title="last used"
                text={moment(props.machine.lastUsed).calendar()}
            />
        ];
        // TODO: add "usually empty until"
    }

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Machine {props.machine.name}</DialogTitle>
            <DialogContent>
                <DetailItem
                    icon="lens"
                    iconColor={props.machine.isBusy ? theme.palette.error.main : theme.palette.success.main}
                    title="status"
                    text={props.machine.isBusy ? "working" : "available"}
                />
                {statusDetails}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

MachineDetailsDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    machine: PropTypes.object
};

export default MachineDetailsDialog;