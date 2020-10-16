import Dashboard from './dashboard.js';
import React, { useState } from 'react';
import {BrowserRouter as Router, Redirect, Switch, Route} from 'react-router-dom';
import Cookies from 'js-cookie'

import AuthApi from "./authapi";

const Login = () => {
  const [auth,setAuth] = useState(false);
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');

  const readCookie = () => {
      const user = Cookies.get("user");
      if(user){
          setAuth(true);
      }
  }
  React.useEffect(() => {
      readCookie();
  }, [])

  return(
    <div>
      <AuthApi.Provider value={{auth, setAuth, username, setUsername, password, setPassword}}>
        <Router>
          <Routes/>
        </Router>
      </AuthApi.Provider>
    </div>
  )
}
const LoginForm = () => {
  const Auth = React.useContext(AuthApi);
  const handleOnClick = (event) => {
      fetch(`http://localhost:5000/?username=${Auth.username}&password=${Auth.password}`)
      .then(response => response.json())
      .then(data => 
      {
        if(data.length > 0){
          console.log(data);
          Auth.setAuth(true);
          Cookies.set("user","loginTrue", {expires: 7});
        }
      })
      .catch(err => console.error(err))

  }
  const handleUsernameChange = (event) => {
      console.log("hello there");
      Auth.setUsername(event.target.value);
  }
  const handlePasswordChange = (event) => {
      Auth.setPassword(event.target.value);
  }
  return(
    <div>
      <h1>Welcome to the heaven's forge</h1>
      <form>
          <div>
              <label>Username</label>
              <input type="text" value={Auth.username} onChange={handleUsernameChange} />
          </div>
          <div>
              <label>Password</label>
              <input type="password" value={Auth.password} onChange={handlePasswordChange} />
          </div>
      </form>
      <button onClick={handleOnClick}>Login</button>
    </div>
  )
}

const Routes = () =>{
  const Auth = React.useContext(AuthApi);
  return (
    <Switch>
      <ProtectedLogin exact path="/" auth={Auth.auth}>
          <LoginForm />
      </ProtectedLogin>
      <ProtectedDashboard exact path="/Dashboard" auth={Auth.auth} >
        <Dashboard />
      </ProtectedDashboard>
    </Switch>
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

export default Login;