import React from 'react';
import PropTypes from 'prop-types';
import {Switch, Route} from "react-router-dom";
import NotFoundPage from "./NotFoundPage.js";
import Dashboard from "./Dashboard.js";
import ScheduleScreen from "./ScheduleScreen.js";

const BodyContent = props => {
    return (
        <Switch>
            <Route exact path="/">
                <Dashboard/>
            </Route>
            <Route exact path="/schedule">
                <ScheduleScreen/>
            </Route>
            <Route>
                <NotFoundPage/>
            </Route>
        </Switch>
    );
};

BodyContent.propTypes = {

};

export default BodyContent;