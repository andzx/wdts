import React, {useState} from 'react';
import axios from 'axios';

function Login(props) {
    const [email, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    return (
        <div class="box-login">
            <header>NJORD</header>
            <h2>Company Login</h2>
            <input type="text" value={email} onChange={e => setUsername(e.target.value)} name="username" placeholder="Username" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" class="login" />
            <div class="error">{error}</div>
            <div class="rmfp">
                <label>
                    <input type="checkbox" class="remember-me" onChange={e => setRememberMe(e.target.value)}/>Remember me
                </label>
                <a href=""> Forgot password</a>
            </div>
            <button type="button" class="btn-login" onClick={login}>Sign In</button>
            <a class="tnc" href="/">Terms &amp; conditions</a>
        </div>
    );
    
    function login() {  
        axios.post("api/login", {
            email: email,
            password: password,
            rememberMe: rememberMe
        }).then((response) => {
            // Clear the form fields after login
            setUsername("");
            setPassword("");
            setRememberMe("");
        
            // Save the session data to localStorage
            const session = response.data.data;
            localStorage.username = session.username;
            localStorage.userRole = session.userRole;
            localStorage.accessToken = session.accessToken;
            localStorage.deviceToken = session.deviceToken;
            
            // Remove error if there was one from a previous login attempt
            setError("");

            // Go to the Index page
            props.onAuthorization();
        }, (error) => {
            setError("Could not log in");
        });
    }
}

export default Login;