import React from 'react';
import PropTypes from 'prop-types';
import useTheme from "@material-ui/core/styles/useTheme.js";
import './laundryIcon.css';

const LaundryMachineBusyIcon = props => {
    const theme = useTheme();
    return (
            <svg
                version="1.1" x="0px" y="0px" viewBox="0 0 18 18"
                className={`laundry-machine-busy ${props.className}`}
                style={{ fill: theme.palette.error.main, ...props.style }}
            >
                <path d="M13.5,1.5l-9,0C3.7,1.5,3,2.2,3,3v12c0,0.8,0.7,1.5,1.5,1.5h9c0.8,0,1.5-0.7,1.5-1.5V3C15,2.2,14.3,1.5,13.5,1.5z M7.5,3
                        c0.4,0,0.8,0.3,0.8,0.8S7.9,4.5,7.5,4.5c-0.4,0-0.8-0.3-0.8-0.8S7.1,3,7.5,3z M5.3,3C5.7,3,6,3.3,6,3.8S5.7,4.5,5.3,4.5
                        c-0.4,0-0.8-0.3-0.8-0.8S4.8,3,5.3,3z M9,15c-2.5,0-4.5-2-4.5-4.5S6.5,6,9,6s4.5,2,4.5,4.5S11.5,15,9,15z"
                      style={{ fill: theme.palette.error }}
                />
                <path
                    className="laundry-machine-content"
                    d="M7,12.9c-0.2,0.2-0.2,0.5,0,0.6c1.4,1.1,3.4,0.9,4.6-0.3S13,10,11.9,8.6c-0.2-0.2-0.5-0.2-0.6,0 C11.3,8.6,7,12.9,7,12.9z"
                />
            </svg>
    );
};

LaundryMachineBusyIcon.propTypes = {};

export default LaundryMachineBusyIcon;