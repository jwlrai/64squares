import React from 'react';
import { Panel,Grid,Col,Row } from 'react-bootstrap';
import './UserDetail.css';
class UserDetail extends React.Component {
    render() {
        return (

            <Panel className="pfp">
                <Panel.Heading>MY PROFILE</Panel.Heading>
                <Panel.Body>
                    <div className="text-center">
                        <img className="pimg" src="/images/profile/questionmark.png" alt="profile pic" />
                        <div className="">
                            <p className="pname">{this.props.userdetail.name}</p>
                           
                        </div>
                    </div>
                    <div className="clearfix ">
                    
                        <Row className="show-grid">
                            <Col  className="text-left" style={{marginLeft:'3%'}} >
                                <Panel className="nfm floatLeft">
                                    <Panel.Heading>Games</Panel.Heading>
                                    <Panel.Body>
                                    {this.props.userdetail.game}
                                    </Panel.Body>
                                </Panel>
                            </Col>
                            <Col className="">
                                <Panel className="nfm floatRight" style={{marginRight:'3%'}}>
                                    <Panel.Heading>Wins</Panel.Heading>
                                    <Panel.Body>
                                    {this.props.userdetail.win}
                                    </Panel.Body>
                                </Panel>
                            </Col>
                        </Row>
                   
                        
                    </div>
                </Panel.Body>
            </Panel>
           
        )
    }
}

export default UserDetail;