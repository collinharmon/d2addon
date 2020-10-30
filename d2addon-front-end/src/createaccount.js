import React, { useState } from 'react';
import AuthApi from "./authapi";
import Cookies from 'js-cookie'

const CreateAccount = () => {
  const [passwordConfirm,setPasswordConfirm] = useState("");

  const [invalidUsername,setInvalidUsername] = useState(false);
  const [invalidPassword,setInvalidPassword] = useState(false);
  const [invalidPasswordConfirm,setInvalidPasswordConfirm] = useState(false);
  const [passwordMismatch,setPasswordMismatch] = useState(false);
  const [loginFail,setLoginFail] = useState(false);


    const Auth = React.useContext(AuthApi);

    const attemptCreateAccount = () => {
        fetch(`http://localhost:5000/Createaccount?username=${Auth.username}&password=${Auth.password}`, {method: 'POST'})
        .then(response => {
            if(response.status == 200){
                Auth.setAuth(true);
                Cookies.set("user",`${Auth.username}`, {expires: 7});
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
            case "confirmPassword":
                setPasswordConfirm(event.target.value);
                break;
        }
    };

    const handleSubmit = event => {
        event.preventDefault();

        let tryAccountCreate = true;

        if(Auth.username.length == 0){
            setInvalidUsername(true);
            tryAccountCreate = false;
        }
        else setInvalidUsername(false);

        if(Auth.password.length == 0){
            setInvalidPassword(true);
            tryAccountCreate = false;
        }
        else setInvalidPassword(false);

        if(passwordConfirm.length == 0){
            setInvalidPasswordConfirm(true);
            tryAccountCreate = false;
        }
        else setInvalidPasswordConfirm(false);

        if(passwordConfirm != Auth.password){
            setPasswordMismatch(true);
            tryAccountCreate = false;
        }
        else setPasswordMismatch(false);

        if(tryAccountCreate) attemptCreateAccount();

    };

    return(
        <div className="CreateAccount">
            <h1>Create Account</h1>
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
                <div>
                    <label>Confirm Password</label>
                    <input name="confirmPassword" placeholder="confirm password" type="password" value={passwordConfirm} onChange={handleChange} />
                </div>
                {invalidPasswordConfirm ? (<div style={{ fontSize: 12, color: "red"}}>Password Confirm cannot be empty</div>
                ) : null}
                {passwordMismatch ? (<div style={{ fontSize: 12, color: "red"}}>Provided passwords do not match</div>
                ) : null}
                <button type="submit">Create Account</button>
                {loginFail ? (<div style={{ fontSize: 12, color: "red"}}>Provided username already exists, please choose a different one</div>
                ) : null}
            </form>
        </div>
    )
}


export default CreateAccount;