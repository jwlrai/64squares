import React from 'react';
import game from '../modules/game';
import {Grid,Row,Col,Modal,Button } from 'react-bootstrap';
import socketObj from '../modules/socket';
import axios from 'axios';
import urls from '../modules/ajaxUrl';
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            show:false,
            content:'',
            checkMate:false
        }
        this.newGame = null;
    }
    componentWillUnmount(){
        this.newGame.destory();
       
    }
    componentDidMount() {
        this.newGame = new game({
            id:"game",
            detailId:"gameDetail",
            type:this.props.gameData.type,
            player:this.props.gameData.player,
            userType : this.props.gameData.userType
        });
       
        socketObj.socket.on('ongame',function(message){// listing for ongame event
            ths.newGame.renderOpponentMove(message);
            ths.newGame.changeMoveStatus(ths.props.gameData.type===message.moveQue)
        })
        var ths  = this;
        this.newGame.start(function(move){
            
            if(move==='checkmate'){
               
                ths.setState({
                    checkMate:true
                })
                let token = sessionStorage.getItem('x-token');
                axios({
                    method: 'POST',
                    url: urls.makeForfeit,
                    headers: {
                        'x-token': token,
                    },
                    data:{
                        room:ths.props.gameData.room,
                    }
                }).then((resp) => {
                    
                }).catch((err) => {
                    //future edge cases undo move functions
                })
            }
            else{
                
                let token = sessionStorage.getItem('x-token');
                axios({
                    method: 'PUT',
                    url: urls.updateMatch,
                    headers: {
                        'x-token': token,
                    },
                    data:{
                        room:ths.props.gameData.room,
                        move:move
                    }
                }).then((resp) => {
                    // for the future purpose
                }).catch((err) => {
                    //future edge cases undo move functions
                })
            }
            
        })
    }
    leaveGame = ()=>{
        this.setState({
            checkMate:false
        })
        this.props.hideGame();
    }
    makeForfeit = ()=>{
        var ths  = this;
        let token = sessionStorage.getItem('x-token');
        axios({
            method: 'POST',
            url: urls.makeForfeit,
            headers: {
                'x-token': token,
            },
            data:{
                room:this.props.gameData.room,
            }
        }).then((resp) => {
            ths.props.hideGame();
        }).catch((err) => {
            //future edge cases undo move functions
        })
    }
    render() {       
        return (
            <>
            <Modal show={this.props.forfeit} >
                    <Modal.Body>
                        <p>Are you sure?</p>
                        <Button variant="danger" onClick={this.makeForfeit}>Yes</Button><Button onClick={this.props.hideForfeit} variant="info">No</Button>
                        {this.state.content}
                    </Modal.Body>
            </Modal>
            <Modal show={this.state.checkMate} >
                    <Modal.Body>
                        <p>Checkmate You lose the game</p>
                        <Button variant="danger" onClick={this.leaveGame}>Leave game</Button>
                    </Modal.Body>
            </Modal>
            <Grid>
                <Row className="show-grid">
                    <Col xs={12} md={8}><div id="game"></div></Col>
                    <Col xs={6} md={4}><div id="gameDetail"></div></Col>
                </Row>
            </Grid>
            </>
        )
    }
}

export default Game;