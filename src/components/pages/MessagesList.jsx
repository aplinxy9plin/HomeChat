import React from 'react'
import { Page, ListItem, Fab, Icon, Toolbar, Tabs, Link, Segmented, Col, Button, List, Popup, Navbar, NavTitle, Tab, Swiper, SwiperSlide } from 'framework7-react';
// import Camera from 'react-html5-camera-photo';
// import 'react-html5-camera-photo/build/css/index.css';
// import Jimp from 'jimp';
// import MetaTags from 'react-meta-tags';
// import ShareLink from 'react-facebook-share-link'

class MessageList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
          isBottom: true,
        }
    }
    componentDidMount(){
      if(localStorage.getItem("auth")){
        
      }else{
        this.$f7.views.current.router.navigate("/login")
      }
    }
    render(){
        return(
            <div>
                <Navbar>
                    <NavTitle>
                        HomeChat
                    </NavTitle>
                </Navbar>
                <List mediaList>
                    <ListItem
                      link="/message"
                    //   onClick={() => {this.$f7.views.main.router.navigate("/message/"); console.log("clicked")}}
                      title="Основной чат"
                      subtitle="Queen">
                      <img slot="media" src="https://cdn.framework7.io/placeholder/fashion-88x88-2.jpg" width="44" />
                    </ListItem>
                </List>
                <Fab onClick={() => console.log("write new message")} position="right-bottom" slot="fixed" color="blue">
                  <Icon ios="f7:add" aurora="f7:add" md="material:add"></Icon>
                  <Icon ios="f7:close" aurora="f7:close" md="material:close"></Icon>
                </Fab>
            </div>
        )
    }
}
export default MessageList