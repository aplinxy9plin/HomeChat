import React from 'react'
import { Page, Navbar, NavLeft, Link, List, Popup, Button, ListInput, ListItem, ListButton, LoginScreenTitle } from 'framework7-react';
import Reaptcha from 'reaptcha'

// import JSZip from 'jzip'
import Docxtemplater from 'docxtemplater'
import fs from 'fs'
import word from '../../word.docx'
class AddAd extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            opened: false,
            img_text: "Прикрепить фото",
            problem: true,
            src: null
        }
    }
    componentDidMount(){
        console.log(word)
        // let reader = new FileReader();
        // reader.readAsDataURL(word);
        // reader.onload = function () {
        //     // cb(reader.result)
        //     console.log(reader.result)
        // };
        // reader.onerror = function (error) {
        //     console.log('Error: ', error);
        // };
    }
    componentDidUpdate(prevProps) {
      if (this.props.opened !== prevProps.opened) {
        this.setState({opened: this.props.opened})
      }
    }
    onChange = (e) => {
        if(e.target.name === "name" && e.target.value.toLowerCase() === "жалоба" && this.state.problem){
            this.setState({problem: false})
            this.$f7.dialog.confirm('Хотите отправить жалобу?', () => {
                this.$f7.dialog.preloader()
                fetch("http://0.0.0.0:8080/sendEmail?nick="+localStorage.getItem("nick"))
                .then(response => response.json())
                .then(data => {
                    this.$f7.dialog.close()
                    this.setState({src: data.url})
                    this.$f7.dialog.confirm("Скачать документ?", "Успешно добавлено", () => {
                        document.getElementById("doc").click()
                    })
                })
            });
        }
        console.log(e.target.name, e.target.value)
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    chooseFile = (e) => {
        var file = e.target.files[0];
        var reader = new FileReader();
        var self = this;
        reader.readAsDataURL(file);
        reader.onload = function () {
          console.log(reader.result);
          self.setState({img: reader.result})
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
        this.setState({
            img_text: "Изменить фото"
        })
    }
    submit = () => {
        if(this.state.name !== '' && this.state.description !== '' && this.state.img && this.state.captcha){
            fetch('http://0.0.0.0:8080/addAd', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  name: this.state.name,
                  description: this.state.description,
                  img: this.state.img,
                  views: 0,
                  likes: 0,
                  dislikes: 0,
                  marks: []
              })
            })
            .then(response => response.json())
            .then(data => {
                if(data.type === "ok"){
                    this.$f7.dialog.alert("Успешно добавлено")
                    this.setState({opened: false})
                }else{
                    this.$f7.dialog.alert("Ошибка сервера.")
                }
            })
            .catch(err => console.log(err))
        }else{
            this.$f7.dialog.alert("Заполнены не все поля")
        }
    }
    createDoc(){
        // fs.readFileSync(word, (err, data) => {
        //     console.log(data)
        // })
        // var doc = new Docxtemplater();
        // doc.loadZip(zip);

        // //set the templateVariables
        // doc.setData({
        //     // inoml: gabariti.inom+"-"+reactor.l,
        //     // izol_name: izol.name,
        //     // m_zag: gabariti.weight,
        //     // m: izol.m, // количество
        //     // m_izol: izol.weight,
        // });

        // try {
        //     // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        //     doc.render()
        // }
        // catch (error) {
        //     var e = {
        //         message: error.message,
        //         name: error.name,
        //         stack: error.stack,
        //         properties: error.properties,
        //     }
        //     console.log(JSON.stringify({error: e}));
        //     // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
        //     throw error;
        // }

        // var buf = doc.getZip()
        //              .generate({type: 'nodebuffer'});
        // console.log(buf)
    }
    render(){
        return(
            <Popup className="reg" opened={this.state.opened} onPopupClosed={this.props.onPopupClosed}>
                <Page>
                    <Navbar>
                      <NavLeft>
                        <Link onClick={() => this.setState({opened: false})}>Закрыть</Link>
                      </NavLeft>
                    </Navbar>
                    <br />
                    <LoginScreenTitle>Подать обращение</LoginScreenTitle>
                    <List>
                        <ListInput type="text" name="name" onChange={this.onChange} placeholder="Название обращения" />
                        <ListInput type="textarea" name="description" onChange={this.onChange} placeholder="Описание" />
                        {
                            this.state.img && <ListItem>
                                <img src={this.state.img} width="100%" />
                            </ListItem>
                        }
                        <ListButton onClick={() => document.getElementById("file").click()}>{this.state.img_text}</ListButton>
                        <ListItem>
                            <Reaptcha sitekey="6Lc8XKwUAAAAACUN7hfaKP1Z7VqINNd1v3061Dw5" onVerify={() => this.setState({captcha: true})}/>
                        </ListItem>
                        <ListItem>
                            <Button onClick={this.submit} outline fill large disabled={!this.state.captcha} style={{width: "100%"}}>Отправить</Button>
                        </ListItem>
                        <Button onClick={this.createDoc}>Create doc</Button>
                        <input onChange={this.chooseFile} type="file" accept="image/*;capture=camera" style={{display: 'none'}} id="file" />
                    </List>
                </Page>
                <a href={this.state.src} id="doc" target="_blank" class="link external" style={{display: "none"}}></a>
            </Popup>
        )
    }
}
export default AddAd;