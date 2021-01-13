import React, { useState } from 'react';
import Cookies from 'js-cookie'
import AuthApi from "./modules/common/authapi";
import Routes from "./modules/routes/index.js";

const App = () => {
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
          <Routes/>
      </AuthApi.Provider>
    </div>
  )
}

export default App;