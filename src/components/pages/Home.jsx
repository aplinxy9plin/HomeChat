import React from 'react'
import { Page, Navbar, NavTitle, Sheet, Toolbar, Tabs, Link, Segmented, Col, Button, List, Popup, NavRight, Block, Tab, Swiper, SwiperSlide, Card, CardContent, CardHeader } from 'framework7-react';
// import Camera from 'react-html5-camera-photo';
// import 'react-html5-camera-photo/build/css/index.css';
// import Jimp from 'jimp';
// import MetaTags from 'react-meta-tags';
// import ShareLink from 'react-facebook-share-link'
import socketIOClient from "socket.io-client";

import MessageList from './MessagesList'
import UK from './UK'

class Home extends React.Component{
    constructor(props){
        super(props)
        this.state = {
          isBottom: true
        }
    }
    componentDidMount(){
      // const socket = socketIOClient.connect("http://0.0.0.0:8080")
      // socket.on("message", (data) => {
      //   // var this.state 
      // })
      if(localStorage.getItem("auth")){

      }else{
        this.$f7.views.current.router.navigate("/login")
      }
    }
    render(){
        return(
            <Page id="test123">
                <Toolbar tabbar labels position={this.state.isBottom ? 'bottom' : 'top'}>
                  <Link tabLink="#tab-1" tabLinkActive text="Сообщения" iconIos="f7:email_fill" iconAurora="f7:email_fill" iconMd="material:email"></Link>
                  <Link tabLink="#tab-2" text="Обращения" iconIos="f7:today_fill" iconAurora="f7:today_fill" iconMd="material:today"></Link>
                  <Link tabLink="#tab-3" text="Настройки" iconIos="f7:cloud_fill" iconAurora="f7:cloud_fill" iconMd="material:file_upload"></Link>
                </Toolbar>

                <Tabs>
                  <Tab id="tab-1" tabActive>
                    <MessageList />
                  </Tab>
                  <Tab id="tab-2" >
                    <UK />
                  </Tab>
                  <Tab id="tab-3" >
                  
                    <Block>
                      <Button fill large onClick={() => {localStorage.removeItem("auth"); localStorage.removeItem("nick"); window.location.href = "/"}}>Выйти</Button>
                    </Block>
                  </Tab>
                </Tabs>
            </Page>
        )
    }
}
export default Home