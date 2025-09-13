import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import Logout from "./Logout";

export default function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      const user = await JSON.parse(localStorage.getItem('chat-app-user'));
      setUserName(user.username);
    };
    fetchUserName();
  }, []);

  return (
    <Container>
      <div className="logout-button">
        <Logout />
      </div>
      <img src={Robot} alt="Robot" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  flex-direction: column;
  position: relative; /* Added */
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
  .logout-button {
    position: absolute;
    top: 10px;
    right: 10px; 
    transform: scale(1.5);
  }
`;
