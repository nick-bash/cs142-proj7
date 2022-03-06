import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Grid, Paper } from '@material-ui/core';
import axios from 'axios';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';
import LoginRegister from './components/loginRegister/loginRegister';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentView: undefined, loggedInUser: undefined};
  }

  render() {
    return (
      <HashRouter>
      <div>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <TopBar currentView={this.state.currentView} loggedInUser={this.state.loggedInUser} logout={this.logout}/>
        </Grid>
        <div className="cs142-main-topbar-buffer"/>
        <Grid item sm={3}>
          <Paper className="cs142-main-grid-item">
            { this.state.loggedInUser !== undefined ? 
              <UserList updateCurrentView = {this.updateCurrentView} twoUserLists={false} loggedInUser={this.state.loggedInUser}/> :
              <></>
            }            
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="cs142-main-grid-item">
            <Switch>           
              { this.state.loggedInUser === undefined ?
                <Route path="/login-register" render = { props => <LoginRegister {...props} updateLoggedInUser = {this.updateLoggedInUser} /> } /> :
                <Redirect path="/login-register" to={"/users/" + this.state.loggedInUser._id} />
              }
              { this.state.loggedInUser !== undefined ?
                <Route path="/users/:userId" render={ props => <UserDetail {...props} updateCurrentView = {this.updateCurrentView} loggedInUser={this.state.loggedInUser}/> }/> : 
                <Redirect path="/users/:userId" to="/login-register" />
              }
              { this.state.loggedInUser !== undefined ?
                <Route path="/photos/:userId" render ={ props => <UserPhotos {...props} updateCurrentView = {this.updateCurrentView} loggedInUser={this.state.loggedInUser}/> } /> :
                <Redirect path="/photos/:userId" to="/login-register" />
              }              
              { this.state.loggedInUser !== undefined ?
                <Route path="/users" component={UserList} updateCurrentView = {this.updateCurrentView} twoUserLists={true} loggedInUser={this.state.loggedInUser}/> :
                <Redirect path="/users" to="/login-register" />
              }
            </Switch>
          </Paper>
        </Grid>
      </Grid>
      </div>
      </HashRouter>
    );
  }

  // A callback so that children can update current view
  updateCurrentView = (updatedView) => {        
    this.setState({currentView: updatedView});    
  };

  // A callback so LoginRegister can update the logged in user
  updateLoggedInUser = (newUser) => {
    this.setState({loggedInUser: newUser});
    console.log("updateLoggedInUser() from PhotoShare with user: " + newUser);
  };

  // A callback to logout the current user
  logout = () => {
    var promise = axios.post('/admin/logout');
    promise.then( response => {
      console.log("PhotoShare.jsx | Successful logout of user: " + this.state.loggedInUser.login_name + 
        ". Response is: " + response);
      this.setState({loggedInUser: undefined, currentView: ""});
      })
      .catch(err => console.error(err));        
  };
}

ReactDOM.render(
  <PhotoShare/>,
  document.getElementById('photoshareapp'),
);