import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import axios from "axios";
import { sendMessageRoute, getAllMessageRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentUser && currentChat) {
        const response = await axios.post(getAllMessageRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      }
    };

    fetchMessages();
  }, [currentChat, currentUser]);

  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    const data = await JSON.parse(localStorage.getItem('chat-app-user'));
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      msg,
    });
    setMessages((prevMessages) => [
      ...prevMessages,
      { fromSelf: true, message: msg },
    ]);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt="Avatar"
                />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            <Logout />
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={uuidv4()} // using uuidv4 to ensure unique keys
                className={`message ${message.fromSelf ? "sended" : "received"}`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color:#DAF7A6;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: black;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: black;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: aqua;
      }
    }
    .received {
      justify-content: flex-start;
      .content {
        background-color: #E6E6FA;
      }
    }
  }
`;
