import React, { Component } from 'react';
import Header from '../components/layout/Header';
import { Route, Switch, withRouter } from 'react-router-dom';
import Signup from './Signup';
import Watch from './Watch';
import GameProfile from './GameProfile';
import PageNotFound from './PageNotFound';
import Game from './Game';
import { Alert, Modal, Button, Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux'
import { showAlert, hideAlert } from '../action/alert';
import { showModel, hideModel } from '../action/model';
import axios from 'axios';
import urls from '../modules/ajaxUrl';
import socketObj from '../modules/socket';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: false,
            gameSearch: false,
            room: '',
            gameShow: false,
            forfeit: false,            
            gameWatch:false,
            userdetail:{},
            hist:[]
        }
        this.timeIntervalVar = null;
    }
    handleUserDetail = (detail)=>{
        this.setState({
            userdetail:detail
        });
    }
    renderHistory(){
        
    }
    componentWillMount(){
        let token = sessionStorage.getItem('x-token');

        if (token != null) {
            let ths = this;
            axios({
                method: 'POST',
                url: urls.islogin,
                headers: {
                    'x-token': token,
                }
            }).then((resp) => {
               
                if(resp.data.data===undefined){
                    
                    sessionStorage.clear();
                }else{
                    
                    ths.setState({
                        login: true,
                        userdetail:resp.data.data
                    })
                }
                
            }).catch((err) => {
                // sessionStorage.clear();
            })
            
        }
    }
  
    componentDidMount() {
        this.loadHistory()
    }
    setRoom = (room) => {
        this.setState({
            room: room
        })
    }
    joinMatch = (e) => {
        let token = sessionStorage.getItem('x-token');
        axios({
            method: 'PATCH',
            url: urls.joinMatch,
            headers: {
                'x-token': token,
            },
            data: {
                room: this.state.room.room,
                type: this.state.room.type,
                socektid: socketObj.socket.id
            }
        }).then((resp) => {
            this.props.hideModel();
            setTimeout(() => {
                this.setState({
                    gameShow: true
                })
            }, 200);


            socketObj.socket.emit('join', this.state.room.room, token, true);

            this.props.showAlert(resp.data.message, 'success');
            setTimeout(() => {
                this.props.hideAlert();
            }, 3000);
            this.setState({ gameSearch: false })
        }).catch((err) => {
            if (err.data !== undefined) {
                this.props.showAlert(err.data.message);
            }
            else {
                this.props.showAlert("error found");
            }
            setTimeout(() => {
                this.props.hideAlert();
            }, 3000);
        })
    }
    closeModel = (e) => {
        if (e !== undefined && (e.target.type === 'button' || e.target.parentNode.type === 'button')) {
            let token = sessionStorage.getItem('x-token');
            axios({
                method: 'PATCH',
                url: urls.skip,
                headers: {
                    'x-token': token,
                },
                data: {
                    room: this.state.room.room
                }
            }).then((resp) => {
                this.props.showAlert(resp.data.message, 'success');
                setTimeout(() => {
                    this.props.hideAlert();
                }, 3000);
                this.setState({ gameSearch: true })
            }).catch((err) => {
                if (err.data !== undefined) {
                    this.props.showAlert(err.data.message);
                }
                else {
                    this.props.showAlert("error found");
                }
                setTimeout(() => {
                    this.props.hideAlert();
                }, 3000);
            })
            this.props.hideModel();
        }

    }
    handleLogin = (state) => {
        this.setState({
            login: state
        })
    }

    gameState = (state) => {

        this.setState({ gameSearch: state })
    }
    handleGameSearch = (e) => {
        let token = sessionStorage.getItem('x-token');
        if (this.state.gameSearch === false) {
            axios({
                method: 'POST',
                url: urls.searchGame + '/start',
                headers: {
                    'x-token': token,
                },
                data: {
                    socketid: socketObj.socket.id
                }
            }).then((resp) => {

                this.props.showAlert(resp.data.message, 'success');
                setTimeout(() => {
                    this.props.hideAlert();
                }, 3000);
                this.setState({ gameSearch: true })

            }).catch((resp) => {
                if (resp.data !== undefined) {
                    this.props.showAlert(resp.data.message);
                }
                else {
                    this.props.showAlert("error found");
                }
                setTimeout(() => {
                    this.props.hideAlert();
                }, 3000);
            });

        } else {
            axios({
                method: 'POST',
                url: urls.searchGame + '/end',
                headers: {
                    'x-token': token,
                }
            }).then((resp) => {
                this.props.showAlert(resp.data.message, 'success');
                setTimeout(() => {
                    this.props.hideAlert();
                }, 3000);
                this.setState({ gameSearch: false })

            }).catch((resp) => {
                if (resp.data !== undefined) {
                    this.props.showAlert(resp.data.message);
                }
                else {
                    this.props.showAlert("error found");
                }
                setTimeout(() => {
                    this.props.hideAlert();
                }, 3000);
            });
        }
    }
    handleForfeit = (e) => {
        this.setState({ forfeit: true })
    }
    hideForfeit = (e) => {
        this.setState({ forfeit: false })
    }
    hideGame = () => {

        this.setState({ gameShow: false, room: '', forfeit: false })
        this.props.hideModel();
        this.loadHistory()
    }
    handleAudienceWinerAlert = (state,type)=>{
        this.props.showModel({
            title:`Player ${type} won the game`,
            body:<div><Button onClick={(e)=>this.handleGameWatch(false)}>Leave Game</Button></div>
        })
    }
    handleGameWatch = (state)=>{
        this.setState({
            gameWatch:state
        } );
        this.props.hideModel()
    }
    loadHistory(){
        let token = sessionStorage.getItem('x-token');
        axios({
            method: 'GET',
            url: urls.getMatchHis,
            headers: {
                'x-token': token,
            }
        })        
        .then((res)=>{
            this.setState({
                hist:res.data
            })
           
        })
        .catch((res)=>{

        })
    }
    render() {
        const searchItem = (this.state.gameSearch) ?
            <Button onClick={this.handleGameSearch}>...Searching Game <img src='/images/chess/searching.gif' style={{ height: '20px' }} /></Button> :
            <Button onClick={this.handleGameSearch}>Search Game</Button>;

        const Home = (this.state.login) ? GameProfile : Signup;
        const GameSearch = (this.state.login) ? searchItem : "";
        const RoutesModi = (this.state.login) ?
            (
                <Switch>
                    <Route exact path="/"
                        render={(props) => <GameProfile {...props}
                            hideGame={this.hideGame}
                            userdetail ={this.state.userdetail}
                            joinMatch={this.joinMatch}
                            gameState={this.gameState}
                            setRoom={this.setRoom}
                            room = {this.state.room}
                            hist = {this.state.hist}
                            handleAudienceWinerAlert = {this.handleAudienceWinerAlert}
                            closeModel={this.closeModel} />}
                    />
                    <Route path="/watch"
                        render={(props) => <Watch {...props}
                            hideGame={this.hideGame}
                            setRoom={this.setRoom}
                            joinMatch={this.joinMatch}
                            gameState={this.gameState}
                            room = {this.state.room}
                            gameWatch = {this.state.gameWatch}
                            handleAudienceWinerAlert = {this.handleAudienceWinerAlert}
                            handleGameWatch = {this.handleGameWatch}
                           />}
                    />
                    <Route path="/*" component={PageNotFound} />
                </Switch>
            ) : (
                <Switch>
                    <Route exact path="/" component={Signup} />
                    <Route path="/*" component={PageNotFound} />
                </Switch>
            );
        return (
            <React.Fragment>
                <Modal className="gameModel" show={this.state.gameShow} dialogClassName="custom-modal">
                    <Modal.Header >
                        <Modal.Title id="contained-modal-title-lg">
                            <Grid>
                                <Row className="show-grid">
                                    <Col xs={6} md={8}>
                                        Game ID - {this.state.room.room}
                                    </Col>
                                    <Col xs={6} md={4} style={{ textAlign: 'right' }}>
                                        <Button bsStyle="danger" onClick={this.handleForfeit} >FORFEIT</Button>
                                    </Col>
                                </Row>
                            </Grid>

                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Game hideGame={this.hideGame} hideForfeit={this.hideForfeit} forfeit={this.state.forfeit} gameData={this.state.room} />
                    </Modal.Body>
                </Modal>
                <Modal show={this.props.model.show} onHide={this.closeModel}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.model.content.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.props.model.content.body}
                    </Modal.Body>
                </Modal>
                <Alert
                    bsStyle={this.props.alert.type}
                    onDismiss={this.props.hideAlert}
                    style={{ display: this.props.alert.display, position: "absolute", right: "20px", top: "20px", zIndex: "100" }}
                >{this.props.alert.content}</Alert>

                <Header
                    handleLogin={this.handleLogin}
                    login={this.state.login}
                    handleUserDetail ={this.handleUserDetail}
                />
                <div className="container text-right" style={{ marginBottom: "25px", }} >
                {GameSearch}

                </div>
                {RoutesModi}
            </React.Fragment>

        );
    }
}
const mapStateToProps = (state) => {
    return state
}
export default withRouter(connect(mapStateToProps, { showAlert, hideAlert, showModel, hideModel })(App));



