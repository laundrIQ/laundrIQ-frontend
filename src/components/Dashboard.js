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
import display from "../util/display.js";
import CardActionArea from "@material-ui/core/CardActionArea";
import MachineDetailsDialog from "./MachineDetailsDialog.js";
import CardTitle from "./CardTitle.js";
import {animated, useTransition} from "react-spring";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(theme => ({
    dashboard: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    roomCard: {
        width: '20em',
        margin: '1em',
        maxWidth: 'calc(100vw - 6em)'
    },
    machineItemCard: {
        marginTop: '0.5em',
        background: 'transparent'
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
            <CardActionArea onClick={props.onClick}>
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
            </CardActionArea>
        </Card>
    );
}
MachineItem.propTypes = {
    name: PropTypes.string,
    status: PropTypes.string,
    isBusy: PropTypes.bool,
    onClick: PropTypes.func
};

const RoomCard = props => {
    const classes = useStyles();
    const machineCards = [];

    for (const machine of props.machines) {
        let status = "available";
        if (machine.isBusy) {
            status = display.getPrettyTimeRelative(machine.endTime.earliest, machine.endTime.latest) + " left";
        }
        machineCards.push(
            <MachineItem
                name={machine.name}
                status={status}
                isBusy={machine.isBusy}
                key={machine.name}
                onClick={() => props.onMachineClick(machine)}
            />
        );
    }

    return (
        <Card className={classes.roomCard}>
            <CardContent>
                <CardTitle>
                    Room {props.name}
                </CardTitle>
                <List>
                    {machineCards}
                </List>
            </CardContent>
        </Card>
    );
};

RoomCard.propTypes = {
    name: PropTypes.string,
    machines: PropTypes.array,
    onMachineClick: PropTypes.func
};

const Dashboard = props => {
    const classes = useStyles();
    const [rooms, setRooms] = useState([]);
    const [detailMachine, setDetailMachine] = useState({});
    const [showDetails, setShowDetails] = useState(false);
    const [loading, setLoading] = useState(true);

    // TODO: add error handling

    useEffect(async () => {
        setRooms((await api.getCurrentStatus()).rooms);
        setLoading(false);

        const interval = setInterval(async () => {
            setRooms((await api.getCurrentStatus()).rooms);
        }, 10000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    const roomCards = [];
    if (loading) {
        roomCards.push(
            <div key="spinner" style={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '10em',
                height: '10em'
            }}>
                <CircularProgress  style={{position: 'absolute'}}/>
            </div>
        );
    }
    else {
        for (const room of rooms) {
            roomCards.push(
                <RoomCard
                    key={room.name}
                    name={room.name}
                    machines={room.machines}
                    onMachineClick={m => {
                        setDetailMachine(m);
                        setShowDetails(true);
                    }}
                />);
        }
    }

    const transitions = useTransition(roomCards, r => r.key, {
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
            transform: 'translateX(0%)'
        }
    });

    return (
        <div className={classes.dashboard}>

            {transitions.map(({item, key, props: fprops}) =>
                <animated.div key={key} style={fprops}>{item}</animated.div>
            )}

            <MachineDetailsDialog
                open={showDetails}
                machine={detailMachine}
                onClose={() => setShowDetails(false)}
            />
        </div>
    );
};

Dashboard.propTypes = {};

export default Dashboard;