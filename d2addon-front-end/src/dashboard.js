import React from 'react';

import AuthApi from "./authapi";
import Cookies from 'js-cookie'

export function Dashboard(){
    const Auth = React.useContext(AuthApi)

    const handleOnClick = () =>{
        Auth.setAuth(false);
        Auth.setUsername("");
        Auth.setPassword("");
        Cookies.remove("user");
    }
    return(
        <div className="Dashboard">
            <h1>Welcome to the Dashboard</h1>
            <button onClick={handleOnClick}>Logout</button>
        </div>
    )
}

export default Dashboard;