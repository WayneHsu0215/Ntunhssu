import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
const Root = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                authContext.updateLoggedInStatus(true);  // 更新登录状态
                navigate('/TranList');
            } else {
                console.error('Login failed');
                setShowAlert(true);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    if (authContext.loggedIn) {
        return (
            <div>
                <h1>Welcome, {username}!</h1>
            </div>
        );
    }
    // 登录界面
    return (
        <div className="bg-gray-200 h-screen flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl text-center font-bold mb-4">學生會問卷管理網站</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-600">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="mt-1 p-2 w-full rounded-md border"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="mt-1 p-2 w-full rounded-md border"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Login</button>
                </form>
            </div>
            {showAlert && (
                <div
                    className="absolute bottom-4 right-4 bg-red-500 text-white p-2 rounded shadow animate-slide-in-out">
                    登入失敗，你打錯囉!
                </div>
            )}
            <style>
                {`
                @keyframes slide-in-out {
                    0%, 100% { transform: translateX(120%); }
                    10%, 90% { transform: translateX(0); }
                }

                .animate-slide-in-out {
                    animation: slide-in-out 3s ease;
                }
                `}
            </style>
        </div>

    );
};

export default Root;