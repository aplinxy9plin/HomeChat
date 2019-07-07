import React from 'react'
import { Page, Messagebar, Navbar, MessagebarAttachment, MessagebarAttachments, Messages, Link, MessagebarSheet, MessagesTitle, Message, MessagebarSheetImage, NavLeft, NavTitle, CardContent, Card, CardHeader, CardFooter, Row, Col, Button } from 'framework7-react';
import socketIOClient from "socket.io-client";
import tenant from '../../img/tenant.png'
const socket = socketIOClient("http://0.0.0.0:8080");
class MessageComponent extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        attachments: [],
        sheetVisible: false,
        typingMessage: null,
        messagesData: [],
        chat_name: localStorage.getItem("chat"),
        just_like: false
      }
    
    }
    componentDidMount(){
      fetch("http://0.0.0.0:8080/getMessages?chat="+this.state.chat_name)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({
          messagesData: data.map((message) => {
            var msg = message;
            msg.type = msg.name === localStorage.getItem("nick") ? "sent" : "received"
            msg.avatar = msg.name === localStorage.getItem("nick") ? null : tenant
            return msg
          })
        })
      })
      .catch(err => console.log(err))
      this.$f7ready(() => {
        this.messagebar = this.messagebarComponent.f7Messagebar;
        this.messages = this.messagesComponent.f7Messages;
      });
      console.log("Here ddmoints")
      socket.on("writing", (data) => {
        console.log(data)
        if(data.name !== localStorage.getItem("nick")){
          this.setState({
            typingMessage: {
              name: data.name,
              avatar: tenant,
            },
          })
          setTimeout(() => {
            this.setState({
              typingMessage: null
            })
          }, 4000)
        }else{
          if(data.bad && data.value.length > 7){
            this.$f7.dialog.alert("Не стоит грубить!")
          }
        }
      })
      socket.on("message", (data) => {
        console.log(data)
        if(data.chat === localStorage.getItem("chat")){

        }
        var arr = this.state.messagesData;
        if(data.name !== localStorage.getItem("nick")){
          arr.push({
            type: "received",
            text: data.text,
            name: data.name,
            avatar: tenant,
            opacity: data.opacity
          })
          this.setState({
            messagesData: arr
          })
        }else{
          arr.push({
            type: "sent",
            text: data.text,
          })
          this.setState({
            messagesData: arr
          })
        }
      })
    }
    like = (e) =>{
      fetch("http://0.0.0.0:8080/likeAd?id="+e.target.id+"&nick="+localStorage.getItem("nick"))
      .then(response => response.json())
      .then(check => {
        if(check){
          fetch("http://0.0.0.0:8080/getAds")
          .then(response => response.json())
          .then(data => {
            this.setState({
                ads: data
            })
          })
          .catch(err => console.log(err)) 
        }
      })
      .catch(err => console.log(err))
    }
    dislike = (e) =>{
      fetch("http://0.0.0.0:8080/dislikeAd?id="+e.target.id+"&nick="+localStorage.getItem("nick"))
      .then(response => response.json())
      .then(check => {
        if(check){
          fetch("http://0.0.0.0:8080/getAds")
          .then(response => response.json())
          .then(data => {
            this.setState({
                ads: data
            })
          })
          .catch(err => console.log(err)) 
        }
      })
      .catch(err => console.log(err))
    }
    sendMessage = () => {
      const text = this.messagebar.getValue().replace(/\n/g, '<br>').trim();
      socket.emit('message', {name: localStorage.getItem("nick"), text: text, views: 0, chat: this.state.chat_name})
    }
    render() {
      return (
        <Page>
          <Navbar>
            <NavLeft>
              {/* onClick={this.$f7.views.current.router.navigate("/home")} */}
              <Link href="/home">Back</Link>
            </NavLeft>
            <NavTitle>
              Message
            </NavTitle>
          </Navbar>
  
          <Messagebar
            placeholder={this.placeholder}
            ref={(el) => {this.messagebarComponent = el}}
            attachmentsVisible={this.attachmentsVisible}
            sheetVisible={this.state.sheetVisible}
            onChange={(e) => socket.emit("writing", {name: localStorage.getItem("nick"), value: e.target.value})}
          >
            <Link
              iconIos="f7:camera_fill"
              iconAurora="f7:camera_fill"
              iconMd="material:camera_alt"
              slot="inner-start"
              onClick={() => {this.setState({sheetVisible: !this.state.sheetVisible})}}
            ></Link>
            <Link
              iconIos="f7:arrow_up_fill"
              iconAurora="f7:arrow_up_fill"
              iconMd="material:send"
              slot="inner-end"
              onClick={this.sendMessage.bind(this)}
            ></Link>
            <MessagebarAttachments>
              {this.state.attachments.map((image, index) => (
                <MessagebarAttachment
                  key={index}
                  image={image}
                  onAttachmentDelete={() => this.deleteAttachment(image)}
                ></MessagebarAttachment>
              ))}
            </MessagebarAttachments>
            {/* <MessagebarSheet>
              {this.state.images.map((image, index) => (
                <MessagebarSheetImage
                  key={index}
                  image={image}
                  checked={this.state.attachments.indexOf(image) >= 0}
                  onChange={this.handleAttachment.bind(this)}
                ></MessagebarSheetImage>
              ))}
            </MessagebarSheet> */}
          </Messagebar>
  
          <Messages ref={(el) => {this.messagesComponent = el}}>
            <MessagesTitle>Начало</MessagesTitle>
  
            {this.state.messagesData.map((message, index) => (
              message.description ? 
              <Message 
                key={index}
                type={message.type}
                style={{width: "100%", alignContent: "center", marginTop: "0px", position: "fixed", zIndex: 10000000000}}
              >
                <Card >
                  <CardHeader><img src={message.img} width="100%" /></CardHeader>
                  <CardContent><h2 style={{lineHeight: 0}}>{message.name}</h2> <br />{message.description}</CardContent>
                    {
                      !this.state.just_like ? <CardFooter><Button onClick={this.like} id={message._id} style={{width: "40%"}} color="green" fill large>Лайк</Button>
                      <Button onClick={this.dislike} id={message._id} style={{width: "40%"}} color="red" fill large>Дизлайк</Button></CardFooter> : <CardFooter><p>Вы уже голосовали</p></CardFooter>
                    }
                    {/* <Row>
                      <Col>
                        <Button>Лайк</Button>
                      </Col>
                      <Col>
                        <Button>Дизлайк</Button>
                      </Col>
                    </Row> */}
                </Card>
              </Message>
              :
              <Message
                key={index}
                type={message.type}
                onClick={message.type === "sent" ? null : (e) => {
                  // open alert with buttons
                  this.$f7.dialog.create({
                    message: message.text,
                    title: 'Оценить сообщение '+message.name,
                    // text: 'Dialog with vertical buttons',
                    onClick: (e, i) => {
                      console.log(e, i)
                      fetch("http://0.0.0.0:8080/markStat?message="+e.params.message+"&type="+(i === 1 ? 0 : 1))
                      .then(response => response.json())
                      .then(data => {
                        
                      })
                    },
                    buttons: [
                      {
                        text: 'Лайк 👍',
                      },
                      {
                        text: 'Дизлак 👎',
                      }
                    ],
                    verticalButtons: true,
                  }).open();
                }}
                image={message.image}
                name={message.name}
                avatar={message.avatar}
                first={this.isFirstMessage(message, index)}
                last={this.isLastMessage(message, index)}
                tail={this.isTailMessage(message, index)}
              >
                {message.text && (
                  <span style={message.opacity === 0.3 ? {color: "white"} : message.opacity  < 0.3 ? {color: "#e5e5ea"} : null} slot="text" dangerouslySetInnerHTML={{__html: message.text}} />
                )}
              </Message>
            ))}
            {this.state.typingMessage && (
              <Message
                type="received"
                typing={true}
                first={true}
                last={true}
                tail={true}
                header={`${this.state.typingMessage.name} is typing`}
                avatar={this.state.typingMessage.avatar}
              ></Message>
            )}
            {/* <Message>
              <Card>
                <CardHeader>Test Name</CardHeader> 
                <CardContent>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, facere maxime quidem consequatur, repellendus accusamus amet impedit nihil suscipit ratione magnam quasi! Inventore exercitationem quod quia tempore ad asperiores? Praesentium!</CardContent> 
                <img src="" />
              </Card>
            </Message> */}
          </Messages>
        </Page>
      )
    }
    get attachmentsVisible() {
      const self = this;
      return self.state.attachments.length > 0;
    }
    get placeholder() {
      const self = this;
      return self.state.attachments.length > 0 ? 'Add comment or Send' : 'Message';
    }
    isFirstMessage(message, index) {
      const self = this;
      const previousMessage = self.state.messagesData[index - 1];
      if (message.isTitle) return false;
      if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) return true;
      return false;
    }
    isLastMessage(message, index) {
      const self = this;
      const nextMessage = self.state.messagesData[index + 1];
      if (message.isTitle) return false;
      if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
      return false;
    }
    isTailMessage(message, index) {
      const self = this;
      const nextMessage = self.state.messagesData[index + 1];
      if (message.isTitle) return false;
      if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
      return false;
    }
  };

  export default MessageComponent