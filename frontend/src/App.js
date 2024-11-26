import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom'; // Import useLocation
import NavBar from './components/NavBar';
import Home from './pages/Home';
import About from './pages/About';
import UserPhotos from './pages/UserPhotos';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from "./components/Profile";
import Contact from "./pages/Contact";
import Users from "./pages/Users";

const App = () => {
    const location = useLocation();

    return (
        <>
            {location.pathname !== '/signin' && location.pathname !== '/signup' && <NavBar/>}

            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/product" element={<UserPhotos/>}/>
                <Route path="/signin" element={<SignIn/>}/>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/users" element={<Users/>}/>
            </Routes>
        </>
    );
};

export default App;
