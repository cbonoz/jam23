import { Layout, Menu, Spin } from "antd";
import { ACTIVE_NETWORK, APP_NAME, HUDDLE_PROJECT_ID } from "./util/constants";
import React, { useEffect } from "react";
import { Routes, Route, Link, Router } from "react-router-dom";
import UploadPage from "./components/UploadPage";
import logo from "./assets/logo.png";
import About from "./components/About";
import Discover from "./components/Discover";
import ConnectButton from "./components/ConnectButton";
import LiveStream from "./components/LiveStream";
import { useHuddle01 } from "@huddle01/react";

import "antd/dist/antd.min.css";
import "./App.css";

const { Header, Footer, Sider, Content } = Layout;

function App() {

  return (
    <div className="App">
      <Layout>
        <Header className="header">
          <Menu theme="light" mode="horizontal" defaultSelectedKeys={["2"]}>
            <Link to="/">
              <Menu.Item key="0">
                <img src={logo} className="header-image" />
              </Menu.Item>
            </Link>
            <Link to="/">
              <Menu.Item key="1">Home</Menu.Item>
            </Link>
            <Link to="/stream">
              <Menu.Item key="2">Start Streaming</Menu.Item>
            </Link>
            <Link to="/sell">
              <Menu.Item key="2">Sell Content</Menu.Item>
            </Link>
            <Link to="/about">
              <Menu.Item key="3">About</Menu.Item>
            </Link>
            <ConnectButton />
          </Menu>
        </Header>
        <Content>
          <div className="container">
            <Routes>
            <Route exact path="/" element={<About/>}/>
              <Route exact path="/stream" element={<LiveStream />} />
              <Route exact path="/sell" element={<UploadPage />} />
              <Route exact path="/about" element={<About />} />
              <Route path="/:address" element={<Discover />} />
            </Routes>
          </div>
        </Content>
        <Footer>
          {APP_NAME} &copy;2023 - Built for the&nbsp;
          <a href="https://videojam.huddle01.com/" target="_blank">
            Videojam hackathon 2023
          </a>. Active Network: {ACTIVE_NETWORK.name}
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
