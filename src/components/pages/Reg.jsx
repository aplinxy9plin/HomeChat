import React from 'react'
import { Page, Navbar, NavLeft, Link, List, Popup, LoginScreenTitle, ListInput, ListItem, ListButton } from 'framework7-react';

import CanvasDraw from "react-canvas-draw";

class Register extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            opened: false,
            first_name: '',
            sur_name: '',
            home: '',
            flat: '',
            status: '',
        }
    }
    componentDidUpdate(prevProps) {
      if (this.props.opened !== prevProps.opened) {
        this.setState({opened: this.props.opened})
      }
    }
    reg = (e) => {
        if(this.state.home !=='' && this.state.flat !== '' && this.state.status !== '' && this.state.first_name !== '' && this.state.sur_name !== ''){
          var user = this.state;
          user.sign = this.saveableCanvas.canvas.drawing.toDataURL('image/jpeg', 1);
          delete user.opened;  
          // fetch('http://0.0.0.0:8080/reg?first_name='+this.state.first_name+"&home="+this.state.home+"&flat="+this.state.flat+"&status="+this.state.status+"&sur_name="+this.state.sur_name+"&password="+this.state.password)
          fetch("http://0.0.0.0:8080/reg", {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
          })
            .then(response => response.json())
            .then(data => {
                if(!data.type){
                    this.setState({opened: false})
                }else{
                    this.$f7.dialog.alert("Такой пользователь уже зарегистрирован.")
                }
            })
            .catch(err => console.log(err))
        }else{
            this.$f7.dialog.alert("Необходимо заполнить все поля")
        }
    }
    onChange = (e) => {
        console.log(e.target.name, e.target.value)
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    render(){
        return(
            <Popup className="reg" opened={this.state.opened} onPopupClosed={this.props.onPopupClosed}>
                <Page loginScreen>
                    <Navbar>
                      <NavLeft>
                        <Link onClick={() => this.setState({opened: false})}>Назад</Link>
                      </NavLeft>
                    </Navbar>
                    <LoginScreenTitle>Регистрация</LoginScreenTitle>
                    <List>
                      <ListInput
                        style={{color: "white", fontSize: "20px"}}
                        outline
                        name="first_name"
                        placeholder="Имя"
                        onInput={this.onChange}
                      />
                      <ListInput
                        style={{color: "white", fontSize: "20px"}}
                        outline
                        name="sur_name"
                        placeholder="Фамилия"
                        onInput={this.onChange}
                      />
                      <ListInput
                        style={{color: "white", fontSize: "20px"}}
                        outline
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        onInput={this.onChange}
                      />
                      <ListInput
                        style={{color: "white", fontSize: "20px"}}
                        outline
                        name="home"
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
                        label="Статус"
                        outline
                        type="select"
                        defaultValue="Совет дома"
                        placeholder="Пожалуйста, выбирайте"
                        name="status"
                        onInput={this.onChange}
                      >
                        <option value="Совет дома">Совет дома</option>
                        <option value="Жилец">Жилец</option>
                        <option value="Собственник">Собственник</option>
                        <option value="Арендатор">Арендатор</option>
                      </ListInput>
                    </List>
                    <CanvasDraw
                        ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
                       style={{width: "100%", height: "20%"}}
                    />
                    <List>
                     <ListButton onClick={this.reg}>Регистрация</ListButton>
                    </List>
                </Page>
            </Popup>
        )
    }
}
export default Register;