import React from 'react';
import {
  AppBar, Toolbar, Typography
} from '@material-ui/core';
import './TopBar.css';
import axios from 'axios';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    var version;    
    this.state = {currentView: this.props.currentView, version: version};    
    this.uploadFile = this.uploadFile.bind(this);
  }
  
  render() {        
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar className="cs142-topbar-toolbar">
          <Typography variant="h5" color="inherit">
              Nicholas Bashour
          </Typography>
          <Typography variant="h5" color="inherit">
              Version: {this.state.version}
          </Typography>
          <Typography variant="h5" color="inherit">
              {
                this.props.loggedInUser === undefined ?
                  "Please login" :
                  "Hi " + this.props.loggedInUser.first_name
              }
          </Typography>          
          { this.state.currentView !== undefined ? <Typography>{this.state.currentView}</Typography> : <></> }          
          { this.props.loggedInUser === undefined ? <></> : <button onClick={this.props.logout}>Logout</button> }
          { this.props.loggedInUser === undefined ? <></> : <input type="file" accept="image/*" ref={(domFileRef) => { this.uploadInput = domFileRef; }} />}
          { this.props.loggedInUser === undefined ? <></> : <button onClick={this.uploadFile}>Upload File</button>}
        </Toolbar>
      </AppBar>
    );
  }  
  
  uploadFile(event) {
    event.preventDefault(); // stop DOM from making POST request
    if (this.uploadInput.files.length > 0) {
      // Create a DOM form and add the file to it under the name uploadedphoto
      const domForm = new FormData();
      domForm.append('uploadedphoto', this.uploadInput.files[0]);
      axios.post('/photos/new', domForm)
        .then((res) => {
          console.log(res);
        })
        .catch(err => console.log(err));
    }
  }

  componentDidMount() {
    var promise = axios.get("/test/info");
    promise.then((response) => {
        this.setState({version: response.data.__v});
      })
      .catch((err) => {
        console.error("Error in TopBar axios get request: " + err.response);
      });
  }
  
  componentDidUpdate() {
    var iife = () => {
      if(this.props.currentView !== this.state.currentView) {
        this.setState({currentView: this.props.currentView});
      }
    };
    iife();
  }
}

export default TopBar;