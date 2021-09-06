import React, {useEffect, useState} from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles.js";
import List from "@material-ui/core/List";
import LaundryIcon from '@material-ui/icons/LocalLaundryService';
import {Tooltip, Typography} from "@material-ui/core";
import useTheme from "@material-ui/core/styles/useTheme.js";
import PropTypes from 'prop-types';
import api from "../util/api.js";
import display from "../util/display.js";
import CardActionArea from "@material-ui/core/CardActionArea";
import MachineDetailsDialog from "./MachineDetailsDialog.js";
import CardTitle from "./CardTitle.js";
import {animated, useTransition} from "react-spring";
import CircularProgress from "@material-ui/core/CircularProgress";
import LaundryMachineBusyIcon from "../styles/LaundryMachineBusyIcon.js";
import IconButton from "@material-ui/core/IconButton";
import NotificationsNoneRoundedIcon from '@material-ui/icons/NotificationsNoneRounded';
import NotificationsActiveRoundedIcon from '@material-ui/icons/NotificationsActiveRounded';
import subscribedMachines from '../util/subscribedMachines.js';

const useStyles = makeStyles(theme => ({
    dashboard: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    dashboardPortrait: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center'
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
    machineItemCardBody: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
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
    },
}));

const MachineItem = props => {
    const classes = useStyles();
    const theme = useTheme();

    const laundryIcon = props.isBusy ?
        <LaundryMachineBusyIcon className={classes.machineIcon}/> :
        <LaundryIcon className={classes.machineIcon} style={{fill: theme.palette.success.main}}/>;

    let notificationIcon;
    // if (props.isBusy) {
    notificationIcon = props.hasNotification ? <NotificationsActiveRoundedIcon/> : <NotificationsNoneRoundedIcon/>;
    // }
    let notificationTooltip = "Notify me when this machine is free";

    return (
        <Card variant="outlined" className={classes.machineItemCard}>
            <CardActionArea onClick={props.onClick} className={classes.machineItemCardBody}>
                <div className={classes.machineItemContainer}>
                    {laundryIcon}
                    <div className={classes.machineTextContainer}>
                        <Typography className={classes.machineTitle}>
                            Machine {props.name}
                        </Typography>
                        <Typography className={classes.machineSubtitle}>
                            {props.status}
                        </Typography>
                    </div>
                </div>
                <Tooltip title={notificationTooltip}>
                    <IconButton style={{marginRight: '0.5em'}} onClick={e => {
                        if (props.onNotificationClick) {
                            props.onNotificationClick(e);
                        }
                        e.stopPropagation();
                    }}>
                        {notificationIcon}
                    </IconButton>
                </Tooltip>
            </CardActionArea>
        </Card>
    );
}
MachineItem.propTypes = {
    name: PropTypes.string,
    status: PropTypes.string,
    isBusy: PropTypes.bool,
    hasNotification: PropTypes.bool,
    onClick: PropTypes.func,
    onNotificationClick: PropTypes.func
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
                hasNotification={props.subscribedMachines.includes(machine.name)}
                key={machine.name}
                onClick={() => props.onMachineClick(machine)}
                onNotificationClick={() => props.onMachineSubscribe(machine)}
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
    subscribedMachines: PropTypes.array,
    onMachineClick: PropTypes.func,
    onMachineSubscribe: PropTypes.func
};

const Dashboard = props => {
    const classes = useStyles();
    const [rooms, setRooms] = useState([]);
    const [detailMachine, setDetailMachine] = useState({});
    const [showDetails, setShowDetails] = useState(false);
    const [loading, setLoading] = useState(true);
    const [subbedMachines, setSubbedMachines] = useState(subscribedMachines.get());

    // TODO: add error handling

    useEffect(async () => {
        setRooms((await api.getCurrentStatus()).rooms);
        setLoading(false);

        const statusChannel = new BroadcastChannel('machine-status');
        statusChannel.onmessage = e => {
            if (e.data) {
                switch (e.data.type) {
                    case 'machine-status':
                        console.log("got rooms!");
                        setRooms(e.data.payload.rooms);
                        setSubbedMachines(subscribedMachines.clean(e.data.payload.rooms));
                        break;
                }
            }
        };
    }, []);

    const onSubscribe = machine => {
        let subbed = subscribedMachines.get();
        let i = subbed.indexOf(machine.name);
        if (i >= 0) {
            subbed.splice(i, 1);
        }
        else {
            subbed.push(machine.name);
        }
        subscribedMachines.save(subbed);
        setSubbedMachines(subbed);
    };

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
                <CircularProgress style={{position: 'absolute'}}/>
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
                    subscribedMachines={subbedMachines}
                    onMachineSubscribe={m => onSubscribe(m)}
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
            transform: 'translateX(-25%)'
        },
        trail: 200
    });

    return (
        <div className={display.isPortrait() ? classes.dashboardPortrait : classes.dashboard}>

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