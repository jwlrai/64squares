import React from 'react';
import {Grid,Col,Row,Button} from 'react-bootstrap';
import UserDetail from '../components/game_profile/UserDetail';
import GameHistory from '../components/game_profile/GameHistory';

import { connect } from 'react-redux'
import {showAlert,hideAlert}  from '../action/alert';
import {showModel,hideModel}  from '../action/model';
import socketObj from '../modules/socket';
import openSocket from 'socket.io-client';
class GameProfile extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            data:[]
        }
    }
    
    componentDidMount(){
        
        
        if(socketObj.socket==null){
            socketObj.socket = openSocket('http://localhost:3001');
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
                    // if(this.props.room ===''){
                    //     this.props.hideModel();
                    //     this.props.gameState(true);
                    //     this.props.showAlert("Searching game Started", 'success');
                    //     setTimeout(() => {
                    //         this.props.hideAlert();
                    //     }, 3000);
                    // }else{
                    //     var content = {
                    //         title:"Your opponent skip the game",
                    //         body:<div><Button onClick={this.props.hideGame}>Leave</Button></div>
                    //     } 
                    //     this.props.gameState(false);
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
                    }else if(message['winner'].lid.toString() !== socketObj.socket.id){
                        this.props.handleAudienceWinerAlert(true,message['winner'].type)
                    }
                }
            })
        }
        
    }
    render(){
        return(
            <Grid>
                <Row className="show-grid">
                    <Col xs={6} md={3}><UserDetail userdetail ={this.props.userdetail} /></Col>
                    <Col xs={12} md={9}><GameHistory hist = {this.props.hist} /></Col>
                </Row>
            </Grid>
        );
    }
}

export default connect(null, { showAlert, hideAlert, showModel, hideModel })(GameProfile);

