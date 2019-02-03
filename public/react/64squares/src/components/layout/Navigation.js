import React from 'react';
import { Navbar, NavItem, Nav, Button, Form, FormGroup, FormControl } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';

import axios from 'axios';
import urls from '../../modules/ajaxUrl';
import socketObj from '../../modules/socket';
import { connect } from 'react-redux';
import { showAlert, hideAlert } from '../../action/alert';
import { showModel, hideModel } from '../../action/model';


class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countSec: 120,
            email :'',
            password:''
        }
    }
    changeCount = () => {
        setInterval(() => {
            this.setState({ countSec: this.state.countSec - 1 });
        }, 1000)

    }
    
    componentDidMount() {
       
    }
    logout = (e) => {
        e.preventDefault();
        let token = sessionStorage.getItem('x-token');
        axios({
            method: 'POST',
            url: urls.logout,
            headers: {
                'x-token': token,
            },
        }).then((resp) => {
            
            this.props.handleLogin(false);
            this.props.showAlert(resp.data.message, 'success');
            setTimeout(() => {
                this.props.hideAlert();
            }, 3000);
            sessionStorage.clear();
            socketObj.socket.disconnect();
            socketObj.socket = null;
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
        });
    }
    handleChange = (e)=> {
        if(e.target.getAttribute('type')==='email'){
            this.setState({ email: e.target.value });
        }
        else{
            this.setState({ password: e.target.value });
        }
    }
    login=(e)=>{
        e.preventDefault();        
        axios.post(urls.login,
            {
                email:this.state.email,
                password:this.state.password
            }
        ).then((resp)=>{
            if(resp.data.status === true){
                sessionStorage.setItem('x-token', resp.headers['x-token']);
                this.props.handleLogin(true);
                this.setState({
                    email   :'',
                    password:'',
                });
                this.props.showAlert(resp.data.message,'success');
                this.props.handleUserDetail(resp.data.data)
               
            }else{
                this.props.showAlert(resp.data.message);
            }
            setTimeout(() => {
                this.props.hideAlert();
            }, 3000);
        }).catch((err)=>{
           
            this.props.showAlert("error found");
            setTimeout(() => {
                this.props.hideAlert();
            }, 3000);
        })
    }
    render() {
        var rightMenu = (this.props.login) ? 
                    (<>
                        <ul className='nav navbar-nav'>
                            <li role="presentation" >
                                <Link role="button" to="/watch">Watch</Link>
                            </li>
                        </ul>
                        <Nav pullRight>
                            <NavItem eventKey={1} href="#">Profile</NavItem>
                            <NavItem eventKey={2} onClick={this.logout} href="#">Logout</NavItem>
                        </Nav>
                    </>) 
                    : (<>
                        <Navbar.Form pullRight >
                            <Form onSubmit={this.login} >
                                <FormGroup>
                                    <FormControl type="email" onChange={this.handleChange} value={this.state.email} placeholder="Email" />
                                    <FormControl type="password" onChange={this.handleChange} value={this.state.password} placeholder="Password" />
                                </FormGroup>{' '}
                                <Button className="btn-danger" type="submit">Login</Button>
                            </Form>
                        </Navbar.Form>
                    </>);
        return (

            <Navbar collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">64squares</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    {rightMenu}
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
export default withRouter(connect(null, { showAlert, hideAlert, showModel, hideModel })(Navigation));

