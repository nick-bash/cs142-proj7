import React from 'react';
import { Typography } from '@material-ui/core';
import './loginRegister.css';
import axios from 'axios';

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);     
    this.state = {        
        username: "",
        password: "",        
        newUsername: "",
        newPassword: "",
        newPasswordConfirmation: "",
        newFirstName: "",
        newLastName: "",
        newLocation: "",
        newDescription: "",
        newOccupation: "", 
        errorText: "",
        successText: "",
    };

    // This bindings for the DOM
    this.userLoginAttempt = this.userLoginAttempt.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.registrationAttempt = this.registrationAttempt.bind(this);
    this.handleNewUsername = this.handleNewUsername.bind(this);
    this.handleNewPassword = this.handleNewPassword.bind(this);
    this.handleNewPasswordConfirmation = this.handleNewPasswordConfirmation.bind(this);
    this.handleNewFirstName = this.handleNewFirstName.bind(this);
    this.handleNewLastName = this.handleNewLastName.bind(this);
    this.handleNewLocation = this.handleNewLocation.bind(this);
    this.handleNewDescription = this.handleNewDescription.bind(this);
    this.handleNewOccupation = this.handleNewOccupation.bind(this);
  }
  
  render() {        
    return (
      <div className="cs142-loginRegister-div">
        <Typography>
          If you have an account, login:
        </Typography>
        <form onSubmit={this.userLoginAttempt} className="cs142-loginRegister-form">
            <label htmlFor="username">
                Username: <input type="text" value={this.state.username} onChange={this.handleUsername} />
            </label>
            <label htmlFor="password">
                Password: <input type="password" value={this.state.password} onChange={this.handlePassword} />
            </label>
            <input type="submit" value="Submit" />
        </form>
        <Typography className="cs142-loginRegister-successText">  
          {this.state.successText}
        </Typography>
        <Typography className="cs142-loginRegister-errorText">  
          {this.state.errorText}
        </Typography>
        <Typography>          
          Don&apos;t have an account? Create one below!
        </Typography>
        <form onSubmit={this.registrationAttempt} className="cs142-loginRegister-form">
            <label htmlFor="newUsername">
                Username: <input type="text" value={this.state.newUsername} onChange={this.handleNewUsername} />
            </label>
            <label htmlFor="newPassword">
                Password: <input type="password" value={this.state.newPassword} onChange={this.handleNewPassword} />
            </label>
            <label htmlFor="newPasswordConfirmation">
                Confirm Password: <input type="password" value={this.state.newPasswordConfirmation} onChange={this.handleNewPasswordConfirmation} />
            </label>
            <label htmlFor="newFirstname">
                First Name: <input type="text" value={this.state.newFirstName} onChange={this.handleNewFirstName} />
            </label>
            <label htmlFor="newLastname">
                Last Name: <input type="text" value={this.state.newLastName} onChange={this.handleNewLastName} />
            </label>
            <label htmlFor="newLocation">
                Location: <input type="text" value={this.state.newLocation} onChange={this.handleNewLocation} />
            </label>
            <label htmlFor="newDescription">
                Description: <input type="text" value={this.state.newDescription} onChange={this.handleNewDescription} />
            </label>
            <label htmlFor="newOccupation">
                Occupation: <input type="text" value={this.state.newOccupation} onChange={this.handleNewOccupation} />
            </label>
            <input type="submit" value="Register Me" />
        </form>
      </div>
    );
  }  
  
  // Handlers for login of registered users  
  userLoginAttempt (event) {
      event.preventDefault(); // Stop DOM from generating a POST

      // Validation: if there's no username entered or password entered, don't send the request
      if(this.state.username === "" || this.state.password === "") {
        this.setState({errorText: "Enter your username and password to login"});
        return;
      }

      // Remove success/error text for this new login attempt
      this.setState({successText: "", errorText: ""});
      
      console.log("LoginRegister | Calling /admin/login with login_name: " + this.state.username);
      var promise = axios.post("/admin/login", {login_name: this.state.username, password: this.state.password});
      promise.then(response => {            
          this.props.updateLoggedInUser(response.data); // callback to PhotoShare            
        })
        .catch(err => {
            this.setState({errorText: "You used a bad username or password. Try again."});
            console.error("LoginRegister | Bad login attempt with error: " + err);
        });        
  }

  handleUsername(event) {
      this.setState({ username: event.target.value});
  }

  handlePassword(event) {
    this.setState({ password: event.target.value});
  }

  // Handlers for registration of new user
  registrationAttempt(event) {
    event.preventDefault(); // Stop DOM from generating a POST

    // Upon new registration attempt, set success/error text to empty
    this.setState({successText: "", errorText: ""});

    // Client side validation: nonempty(user, pass, first, last), passwords match
    if(this.state.newUsername === "") {
        this.setState({errorText: "Enter a unique username"});
    } else if(this.state.newPassword === "") {
        this.setState({errorText: "Enter a password"});
    } else if(this.state.newPassword !== this.state.newPasswordConfirmation) {
        this.setState({errorText: "Your passwords don't match"});
    } else if(this.state.newFirstName === "" || this.state.newLastName === "") {
        this.setState({errorText: "Enter your first and last name"});    
    
    // Attempt registration. Server checks for unique username.
    } else {        
        var promise = axios.post('/user', {login_name: this.state.newUsername,
            password: this.state.newPassword,
            first_name: this.state.newFirstName,
            last_name: this.state.newLastName,
            location: this.state.newLocation,
            occupation: this.state.newOccupation,
            description: this.state.newDescription
        });
        promise.then(response => {
            this.setState({successText: "Thanks for registering :) You can now log in!",
                newUsername: "",
                newPassword: "",
                newPasswordConfirmation: "",
                newFirstName: "",
                newLastName: "",
                newLocation: "",
                newOccupation: "",
                newDescription: ""});
            console.log("LoginRegister | Successful registration of of login_name: " + this.state.newUsername +
                " with response: " + response);
        })
        .catch(err => {            
            this.setState({errorText: err});
            console.error("LoginRegister | Error in registration attempt: " + err);
            });       
    }
  }

  handleNewUsername(event) {
    this.setState({ newUsername: event.target.value});
  }
  
  handleNewPassword(event) {
    this.setState({ newPassword: event.target.value});
  }

  handleNewPasswordConfirmation(event) {
    this.setState({ newPasswordConfirmation: event.target.value});
  }

  handleNewFirstName(event) {
    this.setState({ newFirstName: event.target.value});
  }

  handleNewLastName(event) {
    this.setState({ newLastName: event.target.value});
  }

  handleNewLocation(event) {
    this.setState({ newLocation: event.target.value});
  }

  handleNewDescription(event) {
    this.setState({ newDescription: event.target.value});
  }

  handleNewOccupation(event) {
    this.setState({ newOccupation: event.target.value});
  }

  // Lifecycle handlers
  componentDidMount() { }
  
  componentDidUpdate() { }    
}

export default LoginRegister;