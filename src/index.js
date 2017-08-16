import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
import registerServiceWorker from './registerServiceWorker';

class AddUser extends React.Component{
    constructor(props){
        super(props);
        this.state={
            update: true
        };
        this.updateInputValue = this.updateInputValue.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    updateInputValue(evt) {
        this.setState({
            inputValue: evt.target.value,
            update: false
        });
    }

    onSubmit(e){
        var url = "http://localhost:8080/weatherapi/rest/weather/addUser";
        var json = "{username:'"+this.state.inputValue+"'}";
        let header = new Headers({
            'Access-Control-Allow-Origin':'',
            'Content-Type': 'text/plain'
        });
        let sentData={
            method:'POST',
            header: header,
            body:  json
        };
        var that = this;
        fetch(url, sentData).then((response) =>{
            that.setState({update:true});
            that.forceUpdate();
        });

    }

    render(){
        return(
            <div>
                <div className="form-group">
                    <label className="label-title">Add board:</label>
                    <div className="form-div">
                        <input type="text" className="form-control input-list" value={this.state.inputValue} onChange={this.updateInputValue} id="usr"/>
                        <button type="button" className="btn btn-default btn-add-user" onClick={this.onSubmit}>
                            <span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
                <UsersList update={this.state.update} />
            </div>
        );
    }

}

class AddLocation extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username : props.username
        }
        this.updateInputValue = this.updateInputValue.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.updateList = this.updateList.bind(this);
    }



    updateInputValue(evt) {
        this.setState({
            inputValue: evt.target.value,
            update: false
        });
    }

    onSubmit(e){
        var url = "http://localhost:8080/weatherapi/rest/weather/addLocation";
        var json = "{username:'"+this.state.username+"', city:'"+this.state.inputValue+"'}";
        let header = new Headers({
            'Access-Control-Allow-Origin':'',
            'Content-Type': 'text/plain'
        });
        let sentData={
            method:'POST',
            header: header,
            body:  json
        };
        var that = this;
        fetch(url, sentData).then((response) =>{
            that.setState({update:true});
            that.forceUpdate();
        });
    }

    updateList(){
        this.setState({update:true});
        this.forceUpdate();
    }

    render(){
        return(
            <div>
                <div className="form-group">
                    <label className="label-title">Add city:</label>
                    <div className="form-div">
                        <input type="text" className="form-control input-board" value={this.state.inputValue} onChange={this.updateInputValue} id="usr"/>
                        <button type="button" className="btn btn-default btn-board" onClick={this.onSubmit}>
                            <span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
                        </button>
                        <button type="button" className="btn btn-default btn-board" onClick={this.updateList}>
                            <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
                <WidgetsList username={this.state.username} update={this.state.update}/>
            </div>
        );
    }
}

class User extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            username : props.user.username
        }
        this.loadBoard = this.loadBoard.bind(this);
    }

    loadBoard(){
        document.getElementById('board').innerHTML = '';
        ReactDOM.render(<div>
                            <AddLocation username={this.state.username}/>
                        </div>, document.getElementById('board'));
    }

    render(){
        return(
            <p><button className="btn btn-list" type="button" onClick={this.loadBoard}>/board/{this.state.username}/</button>
            <button className="btn btn-rm-user">
                <span className="glyphicon glyphicon-remove"></span>
            </button>
            </p>
        );
    }

}

class UsersList extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userlist : []
        };
    }

    shouldComponentUpdate(){
        return true;
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.update){
            this.componentDidMount();
        }
    }

    componentDidMount() {
        var url = "http://localhost:8080/weatherapi/rest/weather/users";
        fetch(url).then((responseText) => {

            var response = responseText.json();

            response.then(function(resp){
                this.setState({userlist:resp});
            }.bind(this));
        });
    }

    render(){
        const userlist = this.state.userlist.map( (user, i) => <User user={user} key={i} />);
        return (
            <div>
                {userlist}
            </div>
        );
    }
}

class Widget extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            city : props.weather.location.city,
            temp : props.weather.item.condition.temp + props.weather.units.temperature,
            direction : props.weather.wind.direction,
            speed: props.weather.wind.speed + props.weather.units.speed,
            humidity: props.weather.atmosphere.humidity + props.weather.units.pressure,
            pressure: props.weather.atmosphere.pressure + props.weather.units.temperature,
            username: props.username
        }
        this.deleteLocation = this.deleteLocation.bind(this);
        this.unmount = props.unmount;
    }


    deleteLocation(city){
        var url = "http://localhost:8080/weatherapi/rest/weather/deleteLocation";
        var json = "{username:'"+this.state.username+"', city:'"+city+"'}";
        let header = new Headers({
            'Access-Control-Allow-Origin':'',
            'Content-Type': 'text/plain'
        });
        let sentData={
            method:'POST',
            header: header,
            body:  json
        };
        var that = this;
        fetch(url, sentData).then((response) =>{
            that.unmount();
        });
    }

    render(){
        return(
            <div className="panel panel-default widget-container" id={this.state.username + this.state.city}>
                <div className="panel-heading">
                    {this.state.city}
                    <button type="button" className="close btn-close" onClick={() => this.deleteLocation(this.state.city)} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="panel-body">
                    <table className="table">
                        <tbody>
                            <tr>
                                <td><h3>Temperature: {this.state.temp}</h3></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><h4>Wind</h4></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><strong> Direction: </strong> {this.state.direction}</td>
                                <td> <strong> Speed: </strong> {this.state.speed} </td>
                            </tr>
                            <tr>
                                <td><h4>Atmosphere</h4></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><strong> Pressure: </strong> {this.state.humidity}</td>
                                <td><strong> Humidity: </strong> {this.state.pressure}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

class WidgetsList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: props.username,
            weatherlist:[]
        }
        this.unmount = this.unmount.bind(this);
    }

    unmount(){
        this.getWidgets();
    }

    shouldComponentUpdate(){
        return true;
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.update){
            this.getWidgets();
        }
    }

    getWidgets(){
        var url = "http://localhost:8080/weatherapi/rest/weather/board/"+this.state.username;
        let header = new Headers({
            'Access-Control-Allow-Origin':'*',
            'Content-Type': 'application/json'
        });

        let sentData={
            method:'GET',
            mode: 'cors',
            header: header
        };
        fetch(url, sentData).then((responseText) => {
            var response = responseText.json();
            response.then(function(resp){
                var data = resp.data;
                this.setState({weatherlist:[]});
                for (var i = 0; i < data.length; i++){
                    this.state.weatherlist.push(data[i]);
                }
                this.setState({weatherlist:this.state.weatherlist});
            }.bind(this));
        });
    }

    componentDidMount(){
        this.getWidgets();
    }

    render() {
        const list = this.state.weatherlist.map((weather, i) => <Widget weather={weather} key={i} username={this.state.username} unmount={()=> this.unmount()}/>);
        return (
            <div>
                {list}
            </div>
        );
    }
}

ReactDOM.render(<AddUser />, document.getElementById('board-list'));
registerServiceWorker();

