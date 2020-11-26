import Dashboard from './dashboard.js';
import React, { useState } from 'react';
import {BrowserRouter as Router, Redirect, Switch, Route} from 'react-router-dom';
import Cookies from 'js-cookie'
import CreateAccount from './createaccount.js';
import ContactMe from './contactme.js';

import AuthApi from "./authapi";
import StashViewer from './stashviewer/stashviewer.js';

const Login = () => {
  const [auth,setAuth] = useState(false);
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');

  const readCookie = () => {
      const user = Cookies.get("user");
      if(user){
          setAuth(true);
          setUsername(user);
      }
  }
  React.useEffect(() => {
      readCookie();
  }, [])

  return(
    <div>
      <AuthApi.Provider value={{auth, setAuth, username, setUsername, password, setPassword}}>
        <Router>
          <LoginRoutes/>
        </Router>
      </AuthApi.Provider>
    </div>
  )
}
const LoginForm = () => {
  const [invalidUsername,setInvalidUsername] = useState(false);
  const [invalidPassword,setInvalidPassword] = useState(false);
  const [loginFail,setLoginFail] = useState(false);

  const Auth = React.useContext(AuthApi);
  const handleOnClick = (event) => {
      fetch(`http://localhost:5000/?username=${Auth.username}&password=${Auth.password}`)
      .then(response => response.json())
      .then(data => 
      {
        if(data.length > 0){
          console.log(data);
          Auth.setAuth(true);
          Cookies.set("user", `${Auth.username}`, {expires: 7});
        }
        else setLoginFail(true);
      })
      .catch(err => console.error(err))

  }
  const handleChange = event => {
      switch (event.target.name){
        case 'username':
          Auth.setUsername(event.target.value);
          break;
        case 'password':
          Auth.setPassword(event.target.value);
          break;
      }
  };
  const handleSubmit = event => {
      event.preventDefault();
      console.log("submitted");
      let tryLogin = true;
      if(Auth.username.length == 0){
          setInvalidUsername(true);
          tryLogin = false;
      }
      else setInvalidUsername(false);

      if(Auth.password.length == 0){
          setInvalidPassword(true);
          tryLogin = false;
      }
      else setInvalidPassword(false);

      if(tryLogin) handleOnClick();
  };
  return(
    <div>
      <h1>Welcome to the heaven's forge</h1>
      <form onSubmit={handleSubmit}>
          <div>
              <label>Username</label>
              <input name="username" placeholder="username" type="text" value={Auth.username} onChange={handleChange} />
          </div>
          {invalidUsername ? (<div style={{ fontSize: 12, color: "red"}}>Username cannot be empty</div>
          ) : null}
          <div>
              <label>Password</label>
              <input name="password" placeholder="password" type="password" value={Auth.password} onChange={handleChange} />
          </div>
          {invalidPassword ? (<div style={{ fontSize: 12, color: "red"}}>Password cannot be empty</div>
          ) : null}
          <button type="submit">Login</button>
          {loginFail ? (<div style={{ fontSize: 12, color: "red"}}>Username or Password is incorrect</div>
          ) : null}
      </form>
      <a href="/CreateAccount"><button>Create Account</button></a>
    </div>
  )
}

const LoginRoutes = () =>{
  const Auth = React.useContext(AuthApi);
  return (
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
      <Route exact path="/ContactMe" component={ContactMe} />
      <Route exact path="/StashView" component={StashViewer} />
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