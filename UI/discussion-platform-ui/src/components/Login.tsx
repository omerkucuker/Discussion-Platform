import React, { useState } from 'react'
import '../styles/loginPage.css';
import services from '../services/services';
import { LoginResponseModel } from '../model/LoginResponseModel';
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Login(props: any) {

    let history = useNavigate();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    let service = new services();

    const loginCheck = () => {
        service.checkLogin({ userName, password }).then((res: AxiosResponse<LoginResponseModel | boolean>) => {
            if (!res.data) {
                alert("Username Or Password wrong.");
            }
            else {
                history('/homepage', { state: { loggedInUser: res.data, logedIn: true } });
            }
        }).catch((err) => alert("" + err));
    }

    return (
        <div>
            <h2>Login Form</h2>

            <div className="loginContainer">
                <label htmlFor="lusername"><b>Username</b></label>
                <input id="username_id" value={userName} onChange={(e) => setUserName(e.target.value)} type="text" placeholder="Enter Username" name="uname" required />

                <label htmlFor="psw"><b>Password</b></label>
                <input id="psw" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter Password" name="psw" required />

                <button id="loginButton" onClick={() => loginCheck()} >Login</button>

            </div>
        </div>

    )
}
