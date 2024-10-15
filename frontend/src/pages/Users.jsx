import React, {useContext, useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import './Users.css';

const Users = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    const getUserdataFromDB = async (e) => {
        try {
            const response = await axios.get('http://localhost:5001/api/users/info');
            setUserData(response.data.users);
            console.log(response.data.users, "user list");
        } catch (error) {
            console.error('Error while fetching user data:', error);
            setError('Failed to fetch.');
        }
    };

    useEffect(() => {
        getUserdataFromDB();
    }, []);


    return (
        <div className="container-fluid bg-black text-white min-vh-100 d-flex align-items-center justify-content-center"
             style={{position:'absolute', marginTop:'3rem'}}>
            <div className="p-5 rounded" style={{maxWidth: '900px'}}>
                <h1 className="display-4 mb-4 text-danger text-center">Rendering fetched User Data</h1>

                <div>
                    {error && <p>{error}</p>}
                    {userData ? (
                        <div>
                            <h3>User Data</h3>
                            <table className="user-table">
                                <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                </tr>
                                </thead>
                                <tbody>
                                {userData.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>Loading data...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Users;
