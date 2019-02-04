# 64Squares

This application is build specially for all those chess lovers where they can play chess with each others and watch
current on going game played by other players in this application
To play or watch game users need to have login credentials. Once login they have access to game pool where they can join pool for searching opponent players and play games. There is also a watch page where user can watch current on going games.
- [ link to the hosted app ](https://squares64.herokuapp.com)

## Technologies and framework used

```
This is a MERN (MongoDb, Express, React, NodeJs) stack based application with following framworks and techonogies
- Socket IO
- Redux
- React-Bootstrap
- Jsonwebtoken
- Bycryptjs
```

## Folder Structure

- Backend application 
```
    --64squares
     |----bin
     |----config
     |----controllers
     |----models
     |----modules
     |----public
     |----routes
     |----views
```
- Frontend application
```
   --64squares
     |----public
            |----react
                    |----64squares
                            |----build
                            |----public
                            |----src
```

## Installation process

```
    //download this repo
    git clone https://github.com/jwlrai/64squares.git

    //go to root folder 
    cd 64squares

    //install all nodejs dependencies
    npm install 

    // start application
    npm start   // application starts on port 3001

    // the react build file is inside public/build folder


```

## ERD

[ 64squares erd link ](https://github.com/jwlrai/64squares/blob/master/erd/erd.png)

## Wireframes

- [ login/signup page link ](https://github.com/jwlrai/64squares/blob/master/wireframes/home%20page-login-singup.png)

- [ after login page ](https://github.com/jwlrai/64squares/blob/master/wireframes/after%20login-home%20page.png)

- [ after login watch page ](https://github.com/jwlrai/64squares/blob/master/wireframes/after%20login-%20watch%20page.png)

- [ game playing page ](https://github.com/jwlrai/64squares/blob/master/wireframes/game%20playing%20page.png)

## Future features and improvements 

- Take care of all edge cases

- Rank system individual/clan

- Reconnection in game

- Replay most voted game and own game history

- Room chatting / among audience

- Profile and setting update

- Creation of clan 

