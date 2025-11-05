import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // For error messages
    const [userType , setUserType] = useState("user");
    const [loginEndPoint , setLoginEngPoint] = useState("/user-login");
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;


    const toggleUser = () =>{ // toggle end point and user type
        if(userType === "user"){
            setUserType("admin");
            setLoginEngPoint("/admin-login")
        }else{
            setUserType("user");
            setLoginEngPoint("/user-login")
        }
    }

    useEffect(()=>{
  
            console.log("user type :" + userType);
            // Dynamically apply dark mode class when userType is 'admin'
         if (userType === 'admin') {
            document.documentElement.setAttribute('data-theme', 'dark'); // Set DaisyUI dark theme
        } else {
            document.documentElement.setAttribute('data-theme', 'light'); // Set DaisyUI light theme
        }

    },[userType , username , password])

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload on form submit

        try {

            // Making an API call to your login endpoint
            const response = await axios.post(apiUrl + loginEndPoint, {
                username,
                password,
            });
            
            if(response.status == 200){
            console.log('response', response.data);
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('userType' , userType);
            
            setError('');
            navigate("/dashboard");
            }else{
                setError("Invalid Login");
                setUsername("");
                setPassword("");
            }
        
           
     
        } catch (err) {
            // Handle error
            setError('Invalid username or password');
             setUsername("");
            setPassword("");
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <fieldset className="bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <h1 className="text-center text-xl font-semibold">Login</h1>

                {/* Form tag to handle submission */}
                <form onSubmit={handleSubmit}  >
                    <div className="mb-4">
                        <label className="label">Username</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="label">Password</label>
                        <input
                            type="password"
                            className="input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>


                    <div className='flex justify-center'>
                    <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
                        <legend className="fieldset-legend">Login options</legend>
                        <label className={`label ${userType === "admin" ? "font-extrabold text-glow" : "" } `}>
                            <input type="checkbox" className="toggle" onClick={toggleUser} />
                                Admin Login
                        </label>
                    </fieldset>
                    </div>


                    {error && <div className="text-red-500 text-sm mb-2">{error}</div>} {/* Error message */}

                    <div className="flex justify-center">
                        {/* <button type="submit" className="btn btn-neutral mt-4 text-center hover:bg-green-800">Login</button> */}
                        <button type="submit" className="btn btn-wide  mt-4 text-center hover:bg-green-800 hover:cursor-pointer ">Login</button>
                    </div>
                     <div className="flex justify-center mt-2">
                        <a href='/Signup' className='text-blue-800 text-sm hover:cursor-pointer' >Sign Up</a>
                    </div>

                </form>
            </fieldset>
        </div>
    );
}

export default Login;
