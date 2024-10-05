import React from 'react';
import ReactDOM from 'react-dom/client'; // Use 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { UserProvider } from './context/userContext'; // Import UserProvider
import 'bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root

root.render(
    <Router>
        <UserProvider>
            <App />
        </UserProvider>
    </Router>
);
