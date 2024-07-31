import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { LoginRoute } from "../utils/APIRoutes";

export default function Login() {

  const navigate = useNavigate();
  
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem('chat-app-user')) {
      navigate("/");
    }
  }, [navigate]);

  const handleValidation = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("username and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("username and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, password } = values;
      try {
        const { data } = await axios.post(LoginRoute, {
          username,
          password,
        });

        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }
        if (data.status === true) {
          localStorage.setItem(
            'chat-app-user',
            JSON.stringify(data.user)
          );
          navigate("/");
        }
      } catch (error) {
        toast.error("login failed. Please try again.", toastOptions);
        console.error(error); 
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Abhigram</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Log In</button>
          <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: white;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: black;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: white;
    background: transparent; /* Corrected spelling */
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: black; /* Changed from white to black for better visibility */
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }

  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: background-color 0.3s ease; 
    
    &:hover {
      background-color: #997af0; 
    }
  }
  
  span {
    color: black; /* Changed from white to black for better visibility */
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
