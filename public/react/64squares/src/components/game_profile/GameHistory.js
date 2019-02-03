import React from 'react';
import { Table} from 'react-bootstrap';
import './GameHistory.css';
import axios from 'axios';
import urls from '../../modules/ajaxUrl';
class GameHistory extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            data:[]
        }
    }
    componentDidMount(){
        
    }
    render() {
        let data = this.props.hist.map((d)=>{
                        return(
                            <tr>                            
                                <td>{d.start}</td>
                                <td>{d.player}</td>
                                <td>{d.win}</td>
                                <td>{d.duration}</td>
                                <td>{d.start}</td>
                            </tr>
                            );
                    });
        return (

            <div className="gamehis">
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Date Time</th>
                            <th>Player</th>
                            <th>Result</th>
                            <th>Duration</th>
                            <th>Start</th>
                        </tr>
                    </thead>
                    <tbody id="listHist">
                        
                        {data}
                    </tbody>
                </Table>;
                </div>

        );
    }
}

export default GameHistory;