import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios';
import Hero from '../components/Hero';

function Dashboard() {

    const [students, setStudents] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;
    const access_token = localStorage.getItem("access_token");
    const userType = localStorage.getItem("userType");
    const [mode, setMode] = useState("light");


    const getStudentsData = async () => {

        try {

            const response = await axios.get(apiUrl + "/get-all-students", {
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-Type": "application/json"
                }
            })

            if (response.status === 200) {
                console.log(response.data);
                setStudents(response.data);
            } else {
                console.log(response);
                setStudents(response.data);
            }

        } catch (e) {
            console.log("error" + e);
        }
    }





    useEffect(() => {
        if (mode === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark'); // Set DaisyUI dark theme
        } else {
            document.documentElement.setAttribute('data-theme', 'light'); // Set DaisyUI light theme
        }
    }, [mode])

    console.log(" access token : " + access_token);
    console.log(" userType :" + userType);

    useEffect(() => {

        getStudentsData();

    }, [])

    return (
        <div>
            <Navbar mode={mode} setMode={setMode} />
            <Hero studentsData={students} refreshStudents={getStudentsData} />

        </div>
    )
}

export default Dashboard