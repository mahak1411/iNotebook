import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


const SignUp = (props) => {
  const [credential, setcredential] = useState({ name: "", email: "", password: "", cpassword: "" })
  let navigate = useNavigate();

  let handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credential;
    const response = await fetch("http://localhost:5000/api/auth/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    })
    const json = await response.json()
    console.log(json)
    if(json.success){
      localStorage.setItem('token' , json.authtoken);
      navigate("/");
      props.showAlert("You have succefully Created an Account!","success");

      }
  else{
     props.showAlert("Enter Invalid Credential!","danger");

  }

  }

  const handleOnChange = (e) => {
    setcredential({ ...credential, [e.target.name]: e.target.value })
  }
  return (
    <div className='container my-3'>
      <h1 className='my-3'>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Enter your name</label>
          <input type="name" className="form-control" id="name" name="name" onChange={handleOnChange} />
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" onChange={handleOnChange} />
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" name='password' className="form-control" id="password" onChange={handleOnChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="cpassword" className="form-label">Confirm Password</label>
              <input type="password" name='cpassword' className="form-control" id="cpassword" onChange={handleOnChange} />
            </div>


            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignUp
