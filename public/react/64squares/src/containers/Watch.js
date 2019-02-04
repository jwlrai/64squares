import React from 'react';
import { Grid, Col, Row,Table, Container,Button } from 'react-bootstrap';
import axios from 'axios';
import urls from '../modules/ajaxUrl';
import socketObj from '../modules/socket';
import openSocket from 'socket.io-client';
import GameWatch from '../components/game_profile/GameWatch';
import { connect } from 'react-redux'
import {showAlert,hideAlert}  from '../action/alert';
import {showModel,hideModel}  from '../action/model';
const WatchInfo = (props)=>{
    return(
        <div>
            this is info
        </div>
    )
}
class Watch extends React.Component {
    constructor(props){
        super(props);
        this.newGame = null;
        this.state ={
            gameOn :false,
            gameInfo:null,
        }
        this.ingame =false;
    }
    handleWatchMatch = (e)=>{
        e.stopPropagation();
       
        let token = sessionStorage.getItem('x-token');
        var ths = this;
        axios({
            method:'POST',
            url: urls.matchWatch,
            headers: {
                'x-token': token,
            },
            data:{
                "room":e.target.closest('.wcg').dataset.gameid,
            }
        }).then((resp) => {
            // ths.setState({
            //     gameOn:false,
            // })
            ths.setState({
                gameInfo:resp
            })
            ths.props.handleGameWatch(true)
            
        }).catch((err) => {
            // future edge case
        })
    }
    componentDidMount(){
        let ths =this;
        if(socketObj.socket==null){
            socketObj.socket = openSocket('https://squares64.herokuapp.com/');
            socketObj.socket.on('pool', (message) => {
                if (message['room']) {
                    this.ingame =true;
                    var content = {
                        title:"Your Game is Ready",
                        body:<div><Button onClick={this.props.joinMatch}>Join</Button>
                        <Button onClick={this.props.closeModel}>close</Button></div>
                    } 
                    this.props.showModel(content);
                    this.props.gameState(false);
                    this.props.setRoom(message);
                }
                else if(message['skip']) {
                    var content = {
                        title:"Your opponent skip the game",
                        body:<div><Button onClick={this.props.hideGame}>Leave</Button></div>
                    } 
                    this.props.gameState(false);
                    this.props.showModel(content);
                    // if(this.props.room===''){
                    //     this.props.hideModel();
                    //     this.props.gameState(true);
                    //     this.props.showAlert("Searching game Started", 'success');
                    //     setTimeout(() => {
                    //         this.props.hideAlert();
                    //     }, 3000);
                    // }else{
                    //     var content = {
                    //         title:"Your opponent skip the game",
                    //         body:<div><Button onClick={this.props.hideGame}>Leave Game</Button></div>
                    //     } 
                    //     this.props.gameState(true);
                    //     this.props.showModel(content);
                    // }
                    
                }
                else if(message['winner']){
                   
                    if(message['winner'].id.toString() === socketObj.socket.id){
                        var content = {
                            title:"You won the game",
                            body:<div><Button onClick={this.props.hideGame}>Leave Game</Button></div>
                        } 
                        this.props.showModel(content);
                    }
                    else{
                        this.props.handleAudienceWinerAlert(true,message['winner'].type)
                    }
                }
            })
        }
        
        let token = sessionStorage.getItem('x-token');
        axios({
            method:'POST',
            url: urls.matchList,
            headers: {
                'x-token': token,
            }
        }).then((resp) => {
            for(let i=0; i < resp.data.length;i++){
                let wcg = document.createElement('div');
                wcg.className = "wcg";
                wcg.addEventListener('dblclick',this.handleWatchMatch);
                wcg.setAttribute('data-gameid', resp.data[i].room);
                let wpi1 = document.createElement('div');
                wpi1.className = "wpi";
                wpi1.style.cssText = `background-image:url(/images/profile/${resp.data[i].bplayer.img});background-repeat:no-repeat;background-size:100% 100%;`
                let wpi2 = document.createElement('div');
                wpi2.className = "wpi";
                wpi2.style.cssText = `background-image:url(/images/profile/${resp.data[i].wplayer.img});background-repeat:no-repeat;background-size:100% 100%;`
                let p1 = document.createElement('p');
                p1.textContent = resp.data[i].bplayer.name;
                let p2 = document.createElement('p');
                p2.textContent ="VS";
                let p3 = document.createElement('p');
                p3.textContent =resp.data[i].wplayer.name
                let wpn = document.createElement('div');
                wpn.className = 'wpn';
                wpn.appendChild(p1);
                wpn.appendChild(p2);
                wpn.appendChild(p3);
                wcg.appendChild(wpi1);
                wcg.appendChild(wpn);
                wcg.appendChild(wpi2);
                document.getElementById('matchlist').appendChild(wcg);
               
            }
        }).catch((err) => {
            // future edge case
        })
    }
    closeGameWatch = (state)=>{
        this.setState({gameOn:state})
    }
    render() {
        let GameView = (this.props.gameWatch)?<GameWatch    handleGameWatch={this.props.handleGameWatch} winInfo ={this.props.winInfo}  closeGameWatch={this.closeGameWatch} resp ={this.state.gameInfo} />:<WatchInfo />
        return (
            <Grid>
                <Row className="show-grid">
                    <Col style={{ paddingRight:"30px" }} xs={6} md={3}>
                        <div id="matchlist"></div>
                    </Col>
                    <Col xs={12} style={{borderLeft:"2px solid #d1d1d1",minHeight:"75vh"}} md={9}>
                        {GameView}
                            
                    </Col>
                </Row>
            </Grid>
        );
    }
}


export default connect(null, { showAlert, hideAlert, showModel, hideModel })(Watch);