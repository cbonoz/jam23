import { Layout, Menu, Spin } from "antd";
import { ACTIVE_NETWORK, APP_NAME, HUDDLE_PROJECT_ID } from "./util/constants";
import React, { useEffect, useState } from "react";
import { Routes, Route, Link, Router } from "react-router-dom";
import SellStream from "./components/SellStream";
import logo from "./assets/logo.png";
import About from "./components/About";
import Discover from "./components/Discover";
import ConnectButton from "./components/ConnectButton";
import LiveStream from "./components/LiveStream";

import "antd/dist/antd.min.css";
import "./App.css";
import { useNavigate } from "react-router-dom";
import PurchaseStream from "./components/PurchaseStream";
import { getPrimaryAccount } from "./contract/huddleContract";

const { Header, Footer, Sider, Content } = Layout;

function App() {
  const navigate = useNavigate()
  const [account, setAccount] = useState(0);

  const pathname = window.location.pathname;
  console.log("pathname", pathname);

  const isPurchaseUrl = pathname.startsWith("/purchase");


  async function handleConnect() {
    if (window.ethereum) {
      setAccount(await getPrimaryAccount());
    } else {
      alert("No ethereum wallet detected");
    }
  }


  return (
    <div className="App">
      <Layout>
        <Header className="header">
          <Menu theme="light" mode="horizontal" selectedKeys={[pathname]}>
            <Menu.Item key="/" onClick={() => navigate('')}>
              <img src={logo} className="header-image" />
            </Menu.Item>
            {!isPurchaseUrl && (<>
            <Menu.Item key="/stream" onClick={() => navigate('/stream')}>
              Start Streaming
            </Menu.Item>
            <Menu.Item key="/sell" onClick={() => navigate('/sell')}>

              Sell Content
            </Menu.Item>
            <Menu.Item key="/about" onClick={() => navigate('/about')}>
              About
            </Menu.Item>
</>)}
            <ConnectButton onClick={handleConnect} account={account}/>
            
          </Menu>
        </Header>
        <Content>
          <div className="container">
            <Routes>
              <Route exact path="/" element={<About />} />
              <Route exact path="/stream" element={<LiveStream />} />
              {/* Stream with room id in path */}
              <Route exact path="/stream/:roomId" element={<LiveStream />} />
              <Route exact path="/sell" element={<SellStream account={account} />} />
              <Route exact path="/about" element={<About />} />
              <Route path="/:address" element={<Discover />} />

              {/* Purchase stream */}
              <Route path="/purchase/:contractAddress" element={<PurchaseStream account={account}/>} />
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
