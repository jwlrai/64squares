import React  from 'react';
import Navigation from './Navigation';

var Header = (props) => {
    return (
        <header>
            <Navigation 
                joinMatch={props.joinMatch}  
                gameState={props.gameState} 
                handleLogin={props.handleLogin}
                closeModel={props.closeModel} 
                login = {props.login} 
                handleUserDetail = {props.handleUserDetail}
            />
        </header>
    );
}

export default Header;
