import React, {useEffect, useState} from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles.js";
import List from "@material-ui/core/List";
import LaundryIcon from '@material-ui/icons/LocalLaundryService';
import {Typography} from "@material-ui/core";
import useTheme from "@material-ui/core/styles/useTheme.js";
import PropTypes from 'prop-types';
import api from "../util/api.js";
import {Room} from "@material-ui/icons";
import moment from "moment";

const useStyles = makeStyles(theme => ({
    dashboard: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    roomCard: {
        minWidth: '20em',
        margin: '1em',
        maxWidth: 'calc(100vw - 2em)'
    },
    roomTitle: {
        marginTop: 0,
        marginBottom: 0,
        fontSize: '2.5em',
        fontWeight: 600,
        color: theme.palette.primary.main
    },
    machineItemCard: {
        marginTop: '0.5em'
    },
    machineItemContainer: {
        padding: '0.5em',
        display: 'flex',
        alignItems: 'center'
    },
    machineIcon: {
        fontSize: '3em'
    },
    machineTextContainer: {
        marginRight: '1em',
        marginLeft: '1em'
    },
    machineTitle: {
        fontSize: '1.5em'
    },
    machineSubtitle: {
        color: theme.palette.text.secondary,
        fontSize: '1.25em'
    }
}));

const MachineItem = props => {
    const classes = useStyles();
    const theme = useTheme();

    const iconColor = props.isBusy ? theme.palette.error.main : theme.palette.success.main;

    return (
        <Card variant="outlined" className={classes.machineItemCard}>
            <div className={classes.machineItemContainer}>
                <LaundryIcon className={classes.machineIcon} style={{fill: iconColor}}/>
                <div className={classes.machineTextContainer}>
                    <Typography className={classes.machineTitle}>
                        Machine {props.name}
                    </Typography>
                    <Typography className={classes.machineSubtitle}>
                        {props.status}
                    </Typography>
                </div>
            </div>
        </Card>
    );
}
MachineItem.propTypes = {
    name: PropTypes.string,
    status: PropTypes.string,
    isBusy: PropTypes.bool
};

const RoomCard = props => {
    const classes = useStyles();
    const machineCards = [];

    for (const machine of props.machines) {
        let status = "available";
        if (machine.isBusy) {
            status = `~ ${moment(machine.projectedEndTime).fromNow(true)} left`;
        }
        machineCards.push(
            <MachineItem
                name={machine.name}
                status={status}
                isBusy={machine.isBusy}
                key={machine.name}
            />);
    }

    return (
        <Card className={classes.roomCard}>
            <CardContent>
                <h2 className={classes.roomTitle}>
                    Room {props.name}
                </h2>
                <List>
                    {machineCards}
                </List>
            </CardContent>
        </Card>
    );
}

const Dashboard = props => {
    const classes = useStyles();
    const [rooms, setRooms] = useState([]);

    useEffect(async () => {
        setRooms((await api.getCurrentStatus()).rooms)

        const interval = setInterval(async () => {
            setRooms((await api.getCurrentStatus()).rooms);
        }, 10000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    const roomCards = [];

    console.log("rooms", rooms);
    for (const room of rooms) {
        roomCards.push(
            <RoomCard
                name={room.name}
                machines={room.machines}
            />);
    }

    const getData = async () => {

    }

    return (
        <div className={classes.dashboard}>
            {roomCards}
        </div>
    );
};

Dashboard.propTypes = {};

export default Dashboard;