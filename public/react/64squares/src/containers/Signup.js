import React from 'react';
import { connect } from 'react-redux'
import {showAlert,hideAlert}  from '../action/alert';
import {showModel,hideModel}  from '../action/model';
import {Grid,Row, Col,Form,FormControl,FormGroup,Button} from 'react-bootstrap';
import axios from 'axios';
import urls from '../modules/ajaxUrl';

class Signup extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            name:'',
            email:'',
            password:'',
            conpassword:''
        }
    }
    handleChange =(e)=>{
        if(e.target.getAttribute('type')==='text'){
            this.setState({name:e.target.value});
        }
        else if(e.target.getAttribute('type')==='email'){
            this.setState({email:e.target.value});
        }
        else if(e.target.getAttribute('type')==='password'){
            if(e.target.getAttribute('placeholder')==='Password'){
                this.setState({password:e.target.value});
            }else{
                this.setState({conpassword:e.target.value});
            }
           
        }
    }
    signup=(e)=>{
        e.preventDefault();
        axios.post(urls.signup,
            {
                name:this.state.name,
                email:this.state.email,
                password:this.state.password,
                conpassword:this.state.conpassword

            }
        ).then((resp)=>{
            this.setState({
                name:'',
                email:'',
                password:'',
                conpassword:''
            });
            this.props.showAlert(resp.data.message,'success');
            setTimeout(() => {
                this.props.hideAlert();
            }, 3000);
            
        }).catch((err)=>{
            this.props.showAlert(err.response.data.message);
            setTimeout(() => {
                this.props.hideAlert();
            }, 3000);
        })
       
    }
    render(){
        return(
            <Grid>
                <Row className="show-grid">
                    <Col xs={12} md={9}>
                        <div>
                            <h2 >Welcome</h2> 
                            <p >Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique unde hic vitae debitis repellendus neque eaque dolor quo natus quae esse soluta minus iusto, amet voluptates, iure alias repudiandae itaque!</p>
                            <p >Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique unde hic vitae debitis repellendus neque eaque dolor quo natus quae esse soluta minus iusto, amet voluptates, iure alias repudiandae itaque!</p>
                        </div>
                    </Col>
                    <Col style={{paddingRight:"30px"}} xs={6} md={3}>
                        <h2>Sign Up</h2>
                        <div>
                            <Form horizontal onSubmit={this.signup} >
                                <FormGroup controlId="formHorizontalName">                           
                                <Col sm={12}>
                                <FormControl value={this.state.name} onChange={this.handleChange} type="text" placeholder="Name" />
                                </Col>
                                </FormGroup>
                                <FormGroup controlId="formHorizontalEmail">                           
                                    <Col sm={12}>
                                    <FormControl value={this.state.email} onChange={this.handleChange}  type="email" placeholder="Email" />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="formHorizontalPassword">                            
                                    <Col sm={12}>
                                    <FormControl value={this.state.password} onChange={this.handleChange}  type="password" placeholder="Password" />
                                    </Col>
                                </FormGroup>    
                                <FormGroup controlId="formHorizontalConPassword">                            
                                    <Col sm={12}>
                                    <FormControl value={this.state.conpassword} onChange={this.handleChange}  type="password" placeholder="Conform Password" />
                                    </Col>
                                </FormGroup>     
                                <FormGroup >
                                    <Col smOffset={0}  sm={10}>
                                    <Button className="btn-danger ml-3" style={{marginRight:"12px"}} type="submit">Sign Up</Button>
                                    <Button  type="reset">Reset</Button>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </div>
                        
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default connect(null, {showAlert ,hideAlert,showModel,hideModel})(Signup);


































































































































































































































