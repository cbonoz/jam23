import React from "react";
import { ABOUT_INFO, APP_DESC, APP_NAME } from "../util/constants";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Button, Steps } from "antd";

function About(props) {
  const navigate = useNavigate()

  const isAbout = window.location.pathname === '/about'
  return (
    <div className="container about-container">
      <img src={logo} className="about-image" />
      <h3>{APP_DESC}</h3>
      <br/>

      {isAbout && <Steps
        direction="horizontal"
        current={3}
        size="small"
        className="about-steps"
        items={[
          {
            title: 'Create your stream',
            description: 'Create a new stream and share it with your audience.'
          },
          {
            title: 'Share your stream',
            description: 'Share your stream with your audience.'
          },
          {
            title: 'Monetize your stream',
            description: 'Monetize your stream by selling clips on the Filecoin network.'
          },
        ]}
      />}

      <Button type="primary" size="large" onClick={() => navigate('/stream')}>Start streaming</Button>
    </div>
  );
}

export default About;
