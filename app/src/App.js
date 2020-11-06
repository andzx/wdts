import React, {useState, useEffect} from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

// Import components
import Index from "./components/index/index.jsx";
import Login from "./components/login/login.jsx";

// Import component css
import "./components/index/index.css";
import "./components/login/login.css";

// Pre-determine initial states to prevent an infinite rendering loop
let authorizedPred = false;
let accessLevelPred = 0;
let timeLeftPred = 1800;

if (sessionStorage.sessionId) {
    const refreshed = parseInt(sessionStorage.refreshed) || 0;
    
    // Get current and last session refresh time in seconds
    const now = Math.floor(new Date() / 1000);
    const then = refreshed;
    
    // Check if the session has expired (30 minutes)
    if (now > (then + 1800)) {
        authorizedPred = false;
        sessionStorage.removeItem("sessionId");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("accessLevel");
        sessionStorage.removeItem("refreshed");
    } else {
        authorizedPred = true;
    }
}

function App() {
    const [authorized, setAuthorized] = useState(authorizedPred);
    const [accessLevel, setAccessLevel] = useState(accessLevelPred);
    const [timeLeft, setTimeLeft] = useState(timeLeftPred);
    const [showSessionExpirationWarning, setSessionExpirationWarning] = useState(false);
    
    // Check if the users session is about to expire
    useEffect(() => {
        setInterval(() => {
            // Only run if a session exists
            if (sessionStorage.sessionId) {
                const now = Math.floor(new Date() / 1000);
                const then = parseInt(sessionStorage.refreshed);
                const timeLeft = now - (then + 1800);
                const timeLeftAbsolute = Math.abs(timeLeft);
                let seconds = timeLeftAbsolute % 60;
                // Add a zero before single digit seconds
                if (seconds < 10) { seconds = "0" + seconds}
                // Add a zero before single digit minutes
                let minutes = Math.floor(timeLeftAbsolute / 60);
                if (minutes < 10) { minutes = "0" + minutes}
                setTimeLeft(minutes + ":" + seconds);
                
                // Display the timer if there are lest than 5 minutes left in the session
                if (timeLeft > -300) {
                    // Don't re-render the app if expiration warning is already set is already set
                    if (showSessionExpirationWarning === false) {
                        setSessionExpirationWarning(true);
                        console.log('Ran');
                    }
                } else {
                    // Don't re-render the app if expiration warning is already set is already set
                    if (showSessionExpirationWarning === true) {
                        setSessionExpirationWarning(false);
                    }
                }
                
                // Log user out if time left is 0
                if (timeLeft > -1) {
                    deAuthorize();
                }
            }
        }, 1000);
    }, []);
    
    function handleAuthorization() {
        setAccessLevel(parseInt(sessionStorage.accessLevel));
        setAuthorized(true);
    }
    
    function deAuthorize() {
        sessionStorage.removeItem("sessionId");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("accessLevel");
        sessionStorage.removeItem("refreshed");
        setAuthorized(false);
    }

    // Display navigation and pages if logged in
    if (authorized) {
        return (
            <Router>
                <nav>
                    <Link to="/">Dashboard</Link>
                    <Link to="/">Job Ads</Link>
                    <Link to="/">Proposals</Link>
                    <Link to="/">Reviews</Link>
                </nav>
                
                <div class="content">
                    {showSessionExpirationWarning ? <div class="time-left">{timeLeft}</div> : null}
                    <button type="button" class="btn-power" onClick={deAuthorize}>Log out</button>
                    <Switch>
                        <Route path="/" exact={true} component={Index}></Route>
                    </Switch>
                </div>
            </Router>
        );
    }
    
    // Display login screen if not authorized
    return <Login onAuthorization={handleAuthorization}/>;
}

export default App;
