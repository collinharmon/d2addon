import React from 'react';

import AuthApi from "../common/authapi";
import Cookies from 'js-cookie';
import FileUpload from "../filehandling/index.js";
import { useHistory } from "react-router-dom";

export function Dashboard(){
    const Auth = React.useContext(AuthApi)
    const history = useHistory();

    const handleOnButtonClick = () =>{
        history.push("/StashView");
        console.log("number of entries in stack: " + history.length);
        console.log("current location: " + history.length);
    }
    const handleOnClick = () =>{
        Auth.setAuth(false);
        Auth.setUsername("");
        Auth.setPassword("");
        Cookies.remove("user");
    }
    return(
        <div className="Dashboard">
            <h1>Welcome to the Dashboard</h1>
            <FileUpload />
            <button onClick={handleOnClick}>Logout</button>
            <button onClick={handleOnButtonClick}>Stash View</button>
        </div>
    )
}

export default Dashboard;