import React from "react";
import { ABOUT_INFO, APP_DESC, APP_NAME } from "../util/constants";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Button, Steps } from "antd";

function About(props) {
  const navigate = useNavigate()
  return (
    <div className="container about-container">
      <img src={logo} className="about-image" />
      <h3>{APP_DESC}</h3>
      <br/>

      <Steps
        direction="horizontal"
        current={0}
        size="small"
        className="about-steps"
        items={[
        ]}
      />

      <Button type="primary" size="large" onClick={() => navigate('/sell')}>Start selling</Button>
    </div>
  );
}

export default About;
