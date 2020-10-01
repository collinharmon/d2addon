import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Login from './login.js';
import ContactMe from './contactme.js';

const Routes = () => {
    return(
        <Router>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/ContactMe" component={ContactMe} />
            </Switch>
        </Router>
    );
}

export default Routes;