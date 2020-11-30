import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function callApi(callback) {
    fetch("http://localhost:9000/apiTest") // window.location.href ?
        .then(res => res.text())
        .then(res => {callback(res)});
}

function App() {
    const [apiResponse, setApiResponse] = useState("No response from api");

    useEffect(() => {
        callApi(setApiResponse);
    }, []);

    return (
        <div className="App">
            <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
                Api responds with "{apiResponse}"!
            </p>
            </header>
        </div>
    );
}

export default App;
