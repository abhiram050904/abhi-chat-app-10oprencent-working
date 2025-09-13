import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios"; // re-added for saving avatar
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
// Using ESM build of multiavatar per user instruction
import multiavatar from "@multiavatar/multiavatar/esm";

export default function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [loadingError, setLoadingError] = useState(null);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!localStorage.getItem('chat-app-user')) {
      navigate('/login');
    }
  }, [navigate]);

  const encodeSvg = (svg) => {
    try { return btoa(unescape(encodeURIComponent(svg))); } catch { return btoa(svg); }
  };

  const generateAvatars = () => {
    setIsLoading(true);
    setLoadingError(null);
    try {
      // You can replace these seeds with any names/IDs; using numeric seeds currently
      const seeds = Array.from({ length: 4 }, () => Math.round(Math.random() * 100000).toString());
      const svgs = seeds.map(seed => multiavatar(seed)); // returns raw SVG string
      const encoded = svgs.map(encodeSvg);
      setAvatars(encoded);
    } catch (e) {
      console.error('Local multiavatar generation failed:', e);
      setLoadingError('Failed to generate avatars locally.');
      toast.error('Avatar generation error.', toastOptions);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateAvatars();
  }, []); // run once

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error('Please select an avatar', toastOptions);
      return;
    }
    const userData = localStorage.getItem('chat-app-user');
    if (!userData) {
      toast.error('No user data. Please login again.', toastOptions);
      navigate('/login');
      return;
    }
    const user = JSON.parse(userData);
    if (!user || !user._id) {
      toast.error('User data corrupted. Please login again.', toastOptions);
      navigate('/login');
      return;
    }
    try {
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, { image: avatars[selectedAvatar] });
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem('chat-app-user', JSON.stringify(user));
        navigate('/');
      } else {
        toast.error('Error setting avatar. Try again.', toastOptions);
      }
    } catch (e) {
      console.error(e);
      toast.error('Network error while saving avatar.', toastOptions);
    }
  };

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          {loadingError && <p style={{ color: 'red', fontSize: '0.9rem' }}>{loadingError}</p>}
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${selectedAvatar === index ? 'selected' : ''}`}
                onClick={() => setSelectedAvatar(index)}
                title="Click to select"
              >
                <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={generateAvatars} disabled={isLoading} className="secondary-btn" style={secondaryBtnStyle}>
              {isLoading ? 'Loading...' : 'Reload'}
            </button>
            <button onClick={setProfilePicture} className="submit-btn" disabled={avatars.length === 0}>
              Set as Profile Picture
            </button>
          </div>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

const secondaryBtnStyle = {
  background: '#ececec',
  color: '#222',
  padding: '0.9rem 1.5rem',
  border: 'none',
  borderRadius: '0.4rem',
  cursor: 'pointer',
  fontWeight: 600,
  textTransform: 'uppercase'
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: white; /* Changed background color to white */
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: black; /* Changed text color to black */
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff; /* Background color for button */
    color: black; /* Changed text color to black */
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: #997af0; /* Changed hover background color for button */
    }
  }
`;
