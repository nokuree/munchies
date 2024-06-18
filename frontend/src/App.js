import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/views/')
            .then(response => {
                console.log(response.data); // Add this line to debug the response
                setData(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Data from Firebase</h1>
                <p>Name: {data.day}</p>
                <p>Type: {data.id}</p>
                <p>Subscribers: {data.projectname}</p>
            </header>
        </div>
    );
}

export default App;

