import React from 'react'
import { Page, Navbar, NavLeft, ListItem, List, LoginScreenTitle, ListInput, Link, ListButton } from 'framework7-react';
import Reg from './Reg'

import Background from '../../img/login_back.gif'

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            home: '',
            flat: ''
        }
    }
    componentDidMount(){
        if(localStorage.getItem("auth")){
            this.$f7.views.current.router.navigate("/home")
        }
    }
    onChange = (e) => {
        console.log(e.target.name, e.target.value)
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    login = () => {
        if(this.state.home !== '' && this.state.flat !== ''){
            fetch("http://0.0.0.0:8080/login?home="+this.state.home+"&flat="+this.state.flat+"&password="+this.state.password)
            .then(response => response.json())
            .then(data => {
                if(data.type){
                    localStorage.setItem("nick", data.nick)
                    localStorage.setItem("auth", true)
                    localStorage.setItem("chat", data.chat)
                    this.$f7.views.current.router.navigate('/home')
                }else{
                    this.$f7.dialog.alert("Такого пользователя не существует")
                }
            })
            .catch(err => console.log(err))
        }else{
            this.$f7.dialog.alert("Заполнены не все поля")
        }
    }
    render(){
        return(
            <Page loginScreen>
                {/* <div style={{position: "fixed", zIndex: 3, width: "100%", height: "100%", backgroundImage: `url(${Background})`, height: "100%", filter: "blur(20px)"}}></div> */}
                {/* <div style={{position: "absolute", width: "100%", height: "100%", color: "white", paddingTop: "30%", zIndex: 5, }}> */}
                   <LoginScreenTitle>Войти</LoginScreenTitle>
                    <List>
                      <ListInput
                        style={{color: "white", fontSize: "20px"}}
                        outline
                        name="home"
                        type="text"
                        placeholder="Адрес дома"
                        onInput={this.onChange}
                      />
                      <ListInput
                        style={{color: "white", fontSize: "20px"}}
                        outline
                        name="flat"
                        type="number"
                        placeholder="Квартира"
                        onInput={this.onChange}
                      />
                      <ListInput
                        style={{color: "white", fontSize: "20px"}}
                        outline
                        name="flat"
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        onInput={this.onChange}
                      />  
                    </List>
                    <List>
                      <ListButton onClick={this.login}>Войти</ListButton>
                      <ListButton onClick={() => this.setState({opened: true})}><center>Регистрация</center></ListButton>
                    </List> 
                {/* </div> */}
                <Reg opened={this.state.opened} onPopupClosed={() => this.setState({opened: false})} />
            </Page>
        )
    }
}
export default Login