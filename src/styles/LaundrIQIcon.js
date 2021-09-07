import React from 'react';
import PropTypes from 'prop-types';

const LaundrIqIcon = props => {
    const style = {
        fill: 'none',
        stroke: props.color,
        strokeWidth: 5,
        strokeLinecap: 'round',
        strokeMiterlimit: 10
    };
    return (
        <svg version="1.1" x="0px" y="0px" viewBox="0 0 72.43 72.43" style={props.style} className={props.className}>
            <circle cx="36.21" cy="36.21" r="33.71"
                    style={style}/>
            <path d="M69.34,42.52c-1.57,0.03-3.88-0.04-6.58-0.62c-6.52-1.4-7.73-4.11-11.83-4.71c-6.45-0.95-7.52,5.15-14.71,5.33
	                 c-7.87,0.19-10.68-7.02-17-5.16c-2.9,0.85-3.24,2.64-7.58,4.12c-3.36,1.15-6.42,1.19-8.54,1.04"
                  style={style}
            />
            <path d="M54.83,23.73c-0.46-0.95-1.4-2.61-3.19-4.11c-1.8-1.51-3.62-2.14-4.64-2.42"
                  style={style}
            />

        </svg>
    );
};

LaundrIqIcon.propTypes = {
    color: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string
};

export default LaundrIqIcon;