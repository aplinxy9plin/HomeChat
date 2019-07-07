import React from 'react'
import { Card, CardContent, CardHeader, Icon, Tabs, Link, Row, Col, Button, List, Popup, NavRight, Block, Tab, Swiper, SwiperSlide, Navbar, NavTitle, CardFooter } from 'framework7-react';
import background from '../../img/login_back.gif'
import AddAd from './AddAd'

class UK extends React.Component{
    constructor(props){
        super(props)
        this.state = {
          isBottom: true
        }
    }
    componentDidMount(){
      fetch("http://0.0.0.0:8080/getAds")
      .then(response => response.json())
      .then(data => {
        this.setState({
            ads: data
        })
      })
      .catch(err => console.log(err))
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
    like = (e) =>{
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
    repost = (e) => {
      fetch("http://0.0.0.0:8080/repost?id="+e.target.id+"&nick="+localStorage.getItem("nick")+"&chat="+localStorage.getItem("chat"))
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(err => {
        this.$f7.dialog.alert("Этим обращением уже делились.")
      })
    }
    render(){
        return(
            <div>
                <Navbar style={{zIndex: 0}}>
                    <NavTitle>Обращения</NavTitle>
                    <NavRight><Button onClick={() => this.setState({opened: true})}><Icon ios="f7:add" aurora="f7:add" md="material:add"></Icon></Button></NavRight>
                </Navbar>
                {
                    this.state.ads && this.state.ads.map((ad, i) => 
                        <Card expandable key={i}>
                          <CardContent padding={false}>
                            <div style={{height: '300px', backgroundImage: `url(${ad.img})`}}>
                              <CardHeader style={{background: "grey"}} textColor="white" className="display-block">
                                {ad.name}
                                <br />
                                {/* <small style={{opacity: 0.7}}>Build Mobile Apps</small> */}
                              </CardHeader>
                              <Link cardClose color="white" className="card-opened-fade-in" style={{position: 'absolute', right: '15px', top: '15px'}} iconF7="close_round_fill" />
                            </div>
                            <div className="card-content-padding">
                              <h5>Просмотров: {ad.views === 0 ? "0" : ad.views}</h5>
                              <p>{ad.description}</p>
                              {/* <CardFooter style={{width: "100%"}}> */}
                                  <Row>
                                    <Col>
                                        <Button id={ad._id.$oid} onClick={this.like} large raised fill color="green">Лайк - {ad.likes === 0 ? "0" : ad.likes}</Button>
                                    </Col>
                                    <Col>
                                        <Button onClick={this.repost} id={ad._id.$oid} large raised fill color="blue">Repost</Button>
                                    </Col>
                                    <Col>
                                        <Button id={ad._id.$oid} onClick={this.dislike} large raised fill color="red">Дизлайк - {ad.dislikes === 0 ? "0" : ad.dislikes}</Button>
                                    </Col>
                                  </Row>
                              {/* </CardFooter> */}
                            </div>
                          </CardContent>
                        </Card>
                    )
                }
                <AddAd opened={this.state.opened} onPopupClosed={() => this.setState({opened: false})} />
            </div>
        )
    }
}
export default UK