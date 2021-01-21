import React, {useState} from 'react';
import PropTypes from 'prop-types';
import makeStyles from "@material-ui/core/styles/makeStyles.js";
import Dialog from "@material-ui/core/Dialog";
import MachineDetailsDialog from "./MachineDetailsDialog.js";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Select from "@material-ui/core/Select";
import settings from "../util/settings.js";
import MenuItem from "@material-ui/core/MenuItem";
import DialogActions from "@material-ui/core/DialogActions";
import {Button, Typography} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    settingsTitle: {
        fontSize: '1.25em',
        color: theme.palette.primary.main
    },
    settingsDescription: {
        color: theme.palette.text.secondary
    }
}));

const SettingsDialog = props => {
    const classes = useStyles();
    const [currSettings, setCurrentSettings] = useState(settings.get());

    const onStatsChange = w => {
        const newSettings = {...currSettings, statisticsWeeks: w};
        settings.save(newSettings);
        setCurrentSettings(newSettings);
    };

    return (
        <Dialog open={props.open} onClose={props.onClose} fullWidth>
            <DialogTitle>Settings</DialogTitle>
            <DialogContent>
                <p className={classes.settingsTitle}>Statistics Collection Range</p>
                <Select
                    fullWidth
                    variant="outlined"
                    value={currSettings.statisticsWeeks}
                    onChange={e => onStatsChange(e.target.value)}
                >
                    <MenuItem value={2}>2 Weeks</MenuItem>
                    <MenuItem value={4}>1 Month</MenuItem>
                    <MenuItem value={12}>3 Months</MenuItem>
                </Select>
                <p className={classes.settingsDescription}>
                    This setting defines how far we should look back to define the statistics on the schedule page.
                </p>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

SettingsDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
};

export default SettingsDialog;