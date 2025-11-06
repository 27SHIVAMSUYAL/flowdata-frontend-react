import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';


function Signup() {
 const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email , setEmail] = useState('');
    const [error, setError] = useState(''); // For error messages
    const [userType , setUserType] = useState("user");
    const [signupEndPoint , setSignupEngPoint] = useState("/user-signup");
    const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_URL;


    const toggleUser = () =>{ // toggle end point and user type
        if(userType === "user"){
            setUserType("admin");
            setSignupEngPoint("/admin-signup")
        }else{
            setUserType("user");
            setSignupEngPoint("/user-signup")
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

            // Making an API call to your signup endpoint
            const response = await axios.post(apiUrl + signupEndPoint, {
                username,
                password,
                email
            });
            
            if(response.status == 200){
            console.log('response', response.data);
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('userType' , userType);
            alert("Success sign up successfull ")

            setError('');
            navigate("/");
            }else{
                setError("Invalid Details");
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
                <h1 className="text-center text-xl font-semibold">Sign up</h1>

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

                     <div className="mb-4">
                        <label className="label">Email</label>
                        <input
                            type="email"
                            className="input"
                            placeholder="email id"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>


                    <div className='flex justify-center'>
                    <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
                        <legend className="fieldset-legend">Signup options</legend>
                        <label className={`label ${userType === "admin" ? "font-extrabold text-glow" : "" } `}>
                            <input type="checkbox" className="toggle" onClick={toggleUser} />
                                Admin Signup
                        </label>
                    </fieldset>
                    </div>


                    {error && <div className="text-red-500 text-sm mb-2">{error}</div>} {/* Error message */}

                    <div className="flex justify-center">
                        {/* <button type="submit" className="btn btn-neutral mt-4 text-center hover:bg-green-800">Login</button> */}
                        <button type="submit" className="btn btn-wide  mt-4 text-center hover:bg-green-800 ">Sign up</button>
                    </div>
                      <div className="flex justify-center mt-2">
                        <a href='/' className='text-blue-800 text-sm hover:cursor-pointer' >Login</a>
                    </div>

                </form>
            </fieldset>
        </div>
    );
}

export default Signup