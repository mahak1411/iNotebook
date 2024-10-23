import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
// import Alert from './Alert';

const Login = (props) => {
    const [credential , setcredential] = useState({email:"" , password : ""})
    let navigate = useNavigate();

    let handleSubmit = async(e)=>{
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login",{
            method :"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body : JSON.stringify({email : credential.email , password :credential.password})
        })
        const json = await response.json()
        console.log(json)
        if(json.success){
            localStorage.setItem('token' , json.authToken);
            navigate("/");
           props.showAlert("You have succefully Logged in!","success");

            }
        else{
           props.showAlert("Sorry Invalid Credential","danger");
        }
    }

    const handleonchange = (e)=>{
        setcredential({...credential , [e.target.name] : e.target.value})
    }
    return (
        <div className='container my-3'>
            <h1 className='my-3'>Login Form</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" value={credential.email} onChange={handleonchange} />
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" name='password' className="form-control" id="password" value={credential.password} onChange={handleonchange} />
                    </div>


                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Login
