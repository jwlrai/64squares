import React from 'react';
import { Modal,Button} from 'react-bootstrap';
import game from '../../modules/game';
import socketObj from '../../modules/socket';
import openSocket from 'socket.io-client';
class GameWatch extends React.Component {
    constructor(props){
        super(props);
        this.newGame = null;
        this.state ={
            show:this.props.winInfo
        }
    }
    closeGame = ()=>{
        this.newGame.destory();
    }
    componentWillUnmount(){
        this.newGame.destory();
    }
    componentDidMount(){
        let token = sessionStorage.getItem('x-token');
        var ths = this;
        this.newGame = new game({
            id:"match",
            // detailId:"matchDetail",
            type:"white",
            userType : "audience",
            assignPieces :this.props.resp.data.gameState
        });
        this.newGame.start();
        
        socketObj.socket.emit('join',this.props.resp.data.room,token,false);
        socketObj.socket.on('ongame',function(message){// listing for ongame event
            ths.newGame.renderMove(message);
        })
    }
    render() {
        
        return (
            <div>
                {/* <Modal show={this.props.show} onHide={this.closeGameWatch}>
                    <Modal.Header closeButton>
                        <Modal.Title>Player {this.props.winnerType} Won the game </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Button onClick={this.closeGameWatch}>Leave Game</Button>
                    </Modal.Body>
                </Modal> */}
                <div className="text-right"><Button onClick={()=>this.props.handleGameWatch(false)}>CLose</Button></div>
                
                <div id="match"></div>
            </div>
           

        );
    }
}

export default GameWatch;