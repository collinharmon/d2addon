import React from 'react';
import LoginForm from '../user/login/index.js';
import CreateAccount from '../user/signup/index.js';
import Dashboard from '../dashboard/index.js';
import ContactMe from '../contactme/index.js';
import StashViewer from '../stashviewer/index.js';
import AuthApi from "../common/authapi";
import {BrowserRouter as Router, Redirect, Switch, Route} from 'react-router-dom';

const Routes = () =>{
  const Auth = React.useContext(AuthApi);
  return (
    <Router>
      <Switch>
        <ProtectedLogin exact path="/" auth={Auth.auth}>
            <LoginForm />
        </ProtectedLogin>
        <ProtectedLogin exact path="/CreateAccount" auth={Auth.auth}>
            <CreateAccount />
        </ProtectedLogin>
        <ProtectedDashboard exact path="/Dashboard" auth={Auth.auth} >
          <Dashboard />
        </ProtectedDashboard>
        <ProtectedStashViewer exact path="/StashView" auth={Auth.auth} >
          <StashViewer />
        </ProtectedStashViewer>
        <Route exact path="/ContactMe" component={ContactMe} />
      </Switch>
    </Router>
  )
}

const ProtectedDashboard = ({auth, children, ...rest}) =>{
  return(
    <Route
    {...rest}
    render = {() => auth? (
        children
    ) :
      (
        <Redirect to="/"/>
      )
    }
    />
  )
}

const ProtectedLogin = ({auth, children, ...rest}) =>{
  return(
    <Route
    {...rest}
    render = {() => !auth? (
        children
    ) :
      (
        <Redirect to="/Dashboard"/>
      )
    }
    />
  )
}

const ProtectedStashViewer = ({auth, children, ...rest}) =>{
  return(
    <Route
    {...rest}
    render = {() => auth? (
        children
    ) :
      (
        <Redirect to="/"/>
      )
    }
    />
  )
}

export default Routes;