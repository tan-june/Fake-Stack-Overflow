import React from 'react';
import axios from 'axios';
import validator from 'validator';

class NewLoad extends React.Component {
  constructor(props) {
    super(props);
    this.state = { register: false, login: false };
  }

  registerClick = () => { this.setState({ register: true, login: false }); };
  loginClick = () => { this.setState({ register: false, login: true }); };
  reset = () => { this.setState({ register: false, login: false }); };
  guestLoad = async () => { await axios.get("http://localhost:8000/Guest", { withCredentials: true }); this.props.defaultLoad(); }

  displayErrorMessage = (elementId, message) => {
    const element = document.getElementById(elementId);
    if (element) { element.style.display = 'block'; element.innerText = message; }
  };

  showError = (elementId, message) => { this.displayErrorMessage(elementId, message); };

  loginUser = (event) => {
    event.preventDefault();
    const email = document.getElementById('emailL').value;
    const password = document.getElementById('passwordL').value;

    if (!validator.isEmail(email)) { this.showError('loginBoxError', 'Error: Invalid Email.'); }
    if (password && email) { this.pushLogin(email, password); }
    else { this.showError('loginBoxError', 'Error: Required Fields Empty.'); }
  };

  pushLogin = async (email, password) => {
    try {
      const { data: { validityCheck } } = await axios.post('http://localhost:8000/LoginCredentials', { email, password }, { withCredentials: true });
      if (validityCheck === 200) { this.props.defaultLoad(); }
      else if (validityCheck === 400) { this.showError('loginBoxError', 'Error: Email/Password Incorrect.'); }
    } catch (error) { this.showError('loginBoxError', 'Internal Error occurred.'); }
  };

  registerUser = (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('confirmPassword').value;

    if (!email || !username || !password || !password2) { this.showError('newRegisterErrorBox', 'Error: Required Fields Empty.'); return; }
    if (!validator.isEmail(email)) { this.showError('newRegisterErrorBox', 'Error: Invalid Email.'); return; }
    else if (password !== password2) { this.showError('newRegisterErrorBox', 'Error: Passwords must match.'); return; }
    else if (password.includes(email) || password.includes(username)) { this.showError('newRegisterErrorBox', 'Error: Password cannot contain username/email.'); return; }

    this.registerPush();
  };

  registerPush = async () => {
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const { data: { validityCheck } } = await axios.post('http://localhost:8000/newRegister', { email, username, password });
      if (validityCheck === 200) { this.loginClick(); this.showError('newLoginBox', 'Success! Please login below.'); }
      else if (validityCheck === 400) { this.showError('newRegisterErrorBox', 'Error: Email already exists. Please login instead.'); }
    } catch (error) { this.showError('newRegisterErrorBox', 'Internal Error occurred.'); }
  };

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '95vh' }}>
        <div style={{ width: '50%', padding: '20px', borderRadius: '10px', boxShadow: '0 0 2000px rgba(192, 223, 217, 1)' }}>
          <center><img src="logo512.png" alt="Logo" style={{ width: '80px', margin: '0 auto' }} /></center>
          <h1 style={{ fontSize: '1.5em', textAlign: 'center' }}>Fake Stack Overflow</h1>
          <h1 style={{ fontSize: '1.0em', textAlign: 'center', color: 'blue' }}>Developed by Tanmay Singhal</h1>
          <h3 style={{ textAlign: 'center' }}>Choose from one of the following options to continue:</h3>

          <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
            <button className="left-panel-buttons blue" onClick={this.registerClick} style={{ marginRight: '10px' }}>Register</button>
            <button className="left-panel-buttons" onClick={this.loginClick} style={{ backgroundColor: 'lightgrey', color: 'blue', marginRight: '10px' }}>Login</button>
            <button className="left-panel-buttons orange" onClick={this.guestLoad} style={{ backgroundColor: 'orange' }}>Continue as Guest</button>
          </div>

          {this.state.register && (
            <div className="form-container">
              <center>
                <form className="registration-form" action="">
                  <h1>New User Registration</h1>
                  <table>
                    <tbody>
                      <tr><td><label htmlFor="email"><b>Email&nbsp;&nbsp;</b></label></td><td><input type="text" placeholder="Enter Email" id="email" name="email" className="input-field" required /></td></tr>
                      <tr><td><label htmlFor="username"><b>Username&nbsp;&nbsp;</b></label></td><td><input type="text" placeholder="Enter Username" id="username" name="username" className="input-field" required /></td></tr>
                      <tr><td><label htmlFor="password"><b>Password&nbsp;&nbsp;</b></label></td><td><input type="password" placeholder="Enter Password" id="password" name="password" className="input-field" required /></td></tr>
                      <tr><td><label htmlFor="confirmPassword"><b>Confirm Password&nbsp;&nbsp;</b></label></td><td><input type="password" placeholder="Confirm Password" id="confirmPassword" name="confirmPassword" className="input-field" required /></td></tr>
                    </tbody>
                  </table>

                  <div className="error-box" id="newRegisterErrorBox"></div>

                  <div className="button-container">
                    <button type="button" className="cancel-button left-panel-buttons orange" onClick={this.reset}>Cancel</button>
                    <button type="submit" className="sign-up-button left-panel-buttons orange" onClick={this.registerUser}>Sign Up</button>
                  </div>
                </form>
              </center>
            </div>
          )}

          {this.state.login && (
            <div className="form-container">
              <center>
                <form className="registration-form" action="">
                  <h1>Login</h1>

                  <div className="new-login-box" style={{ color: 'green' }}></div>
                  <table>
                    <tbody>
                      <tr><td><label htmlFor="emailL"><b>Email &nbsp;&nbsp;</b></label></td><td><input type="text" placeholder="Enter Email" name="email" id="emailL" required className="input-field" /></td></tr>
                      <tr><td><label htmlFor="psw"><b>Password &nbsp;&nbsp;</b></label></td><td><input type="password" placeholder="Enter Password" name="psw" required id="passwordL" className="input-field" /></td></tr>
                    </tbody>
                  </table>

                  <div className="error-box" id="loginBoxError"></div>

                  <div className="button-container">
                    <button type="button" className="cancel-button left-panel-buttons orange" onClick={this.reset}>Cancel</button>
                    <button type="submit" className="sign-up-button left-panel-buttons orange" onClick={this.loginUser}>Sign In</button>
                  </div>
                </form>
              </center>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default NewLoad;