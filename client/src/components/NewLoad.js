import React from 'react';
import axios from 'axios';
import validator from 'validator';

class NewLoad extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      register: false,
      login: false,
    };
  }
  //Open Register Form
  registerClick = () => {
    this.setState({ register: true, login: false });
  };

  //Open Login Form
  loginClick = () => {
    this.setState({ register: false, login: true });
  };

  //Cancel All Buttons
  reset = () => {
    this.setState({ register: false, login: false });
  };

  //Guest Mode Login
  guestLoad = async () => {
    await axios.get("http://localhost:8000/Guest", { withCredentials: true });
    this.props.defaultLoad();
  }

  loginUserChecked = async (event) => {
    const email = document.getElementById('emailL').value;
    const password = document.getElementById('passwordL').value;
    try {
      const response = await axios.post('http://localhost:8000/LoginCredentials', { email: email, password: password }, { withCredentials: true });
      //Values Correct
      if (response.data.validityCheck === 200) {
        this.props.defaultLoad();
        const errorBox = document.getElementById('loginBoxError');
        errorBox.style.visibility = 'hidden';
        errorBox.innerText = '';
      }
      //Incorrect Username/Password
      else if (response.data.validityCheck === 400) {
        const errorBox = document.getElementById('loginBoxError');
        errorBox.style.visibility = 'visible';
        errorBox.innerText = 'Error: Email/Password Incorrect.';
        window.alert("Error: Email/Password Incorrect");
      }
    }
    //Server or Internal Error Occurred
    catch (error) {
      const errorBoxer = document.getElementById('loginBoxError');
      if(errorBoxer){
        errorBoxer.style.visibility = 'visible';
      errorBoxer.innerText = 'Internal Error occurred.';
    }
    }
  };

  loginUser = async (event) => {

    event.preventDefault();
    const email = document.getElementById('emailL').value;
    const password = document.getElementById('passwordL').value;
    if (!validator.isEmail(email)) {
      const errorBox = document.getElementById('loginBoxError');
      errorBox.style.display = 'block';
      errorBox.innerText = 'Error: Invalid Email.';
      return;
    }

    if (password && email) {
      this.loginUserChecked();
    }
    else {
      const errorBox = document.getElementById('loginBoxError');
      errorBox.style.display = 'block';
      errorBox.innerText = 'Error: Required Fields Empty.';
    }
  };

  registerUser = async (event) => {
    event.preventDefault();
    const errorBox = document.getElementById('newRegisterErrorBox');
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('confirmPassword').value;

    //Check if actually an email
    if (!validator.isEmail(email)) {
      errorBox.style.display = 'block';
      errorBox.innerText = 'Error: Invalid Email.';
      return;
    }
    //passwords have to match
    if ((password !== password2)) {
      errorBox.style.display = 'block';
      errorBox.innerText = 'Error: Passwords must match.';
      return;
    }
    //make sure password doesn't contain username or email
    if (password.includes(email) || password.includes(username)) {
      errorBox.style.display = 'block';
      errorBox.innerText = 'Error: Password cannot contain username/email.';
      return;
    }
    //make sure all fields are full
    if (email && username && password && password2) {
      this.registerUserChecked();
    }
    else {
      errorBox.style.display = 'block';
      errorBox.innerText = 'Error: Required Fields Empty.';
    }
  };

  registerUserChecked = async (event) => {
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await axios.post('http://localhost:8000/newRegister', { email: email, username: username, password: password });

      if (response.data.validityCheck === 200) {
        this.loginClick();
        const errorBox = document.getElementById('newLoginBox');
        errorBox.style.display = 'block';
        errorBox.innerText = 'Success! Please login below.';
      }
      else if (response.data.validityCheck === 400) {
        const errorBox = document.getElementById('newRegisterErrorBox');
        errorBox.style.display = 'block';
        errorBox.innerText = 'Error: Email already exists. Please login instead.';
      }
    }
    catch (error) {
      const errorBox = document.getElementById('newRegisterErrorBox');
      errorBox.style.display = 'block';
      errorBox.innerText = 'Internal Error occurred.';
    }
  };

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '95vh' }}>
      <div
        style={{
          width: '50%',
          padding: '20px',
          borderRadius: '10px',
          // backgroundColor: 'rgba(192, 223, 217, 0.1)',
          boxShadow: '0 0 2000px rgba(192, 223, 217, 1)',
        }}
      >
        <center><img src="logo512.png" alt="Logo" style={{ width: '80px', margin: '0 auto' }} /></center>
        <h1 style={{ fontSize: '1.5em', textAlign: 'center' }}>Hello, Welcome to Fake Stack Overflow!</h1>
        <h1 style={{ fontSize: '1.0em', textAlign: 'center', color: 'blue' }}>Developed by Tanmay Singhal and Kelly Curtis</h1>
        <h3 style={{ textAlign: 'center' }}>Choose from one of the following options to continue:</h3>

        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
          <button
            className="left-panel-buttons blue"
            onClick={this.registerClick}
            style={{ marginRight: '10px' }}
          >
            Register
          </button>
          <button
            className="left-panel-buttons"
            onClick={this.loginClick}
            style={{ backgroundColor: 'lightgrey', color: 'blue', marginRight: '10px' }}
          >
            Login
          </button>
          <button
            className="left-panel-buttons orange"
            onClick={this.guestLoad}
            style={{ backgroundColor: 'orange' }}
          >
            Continue as Guest
          </button>
        </div>

        {this.state.register && (
          <div style={{ marginTop: '15px' }}>
            <center>
              <form
                action=""
                style={{  width: '50%',
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                marginTop: '15px', }}
              >
                <h1>New User Registration</h1>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <label htmlFor="email"><b>Email&nbsp;&nbsp;</b></label>
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Enter Email"
                          id="email"
                          name="email"
                          required
                          style={{
                            width: '100%',
                            padding: '15px',
                            margin: '5px 0 22px 0',
                            border: 'none',
                            background: '#f1f1f1',
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="username"><b>Username&nbsp;&nbsp;</b></label>
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Enter Username"
                          id="username"
                          name="username"
                          required
                          style={{
                            width: '100%',
                            padding: '15px',
                            margin: '5px 0 22px 0',
                            border: 'none',
                            background: '#f1f1f1',
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="password"><b>Password&nbsp;&nbsp;</b></label>
                      </td>
                      <td>
                        <input
                          type="password"
                          placeholder="Enter Password"
                          id="password"
                          name="password"
                          required
                          style={{
                            width: '100%',
                            padding: '15px',
                            margin: '5px 0 22px 0',
                            border: 'none',
                            background: '#f1f1f1',
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="confirmPassword"><b>Confirm Password&nbsp;&nbsp;</b></label>
                      </td>
                      <td>
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          id="confirmPassword"
                          name="confirmPassword"
                          required
                          style={{
                            width: '100%',
                            padding: '15px',
                            margin: '5px 0 22px 0',
                            border: 'none',
                            background: '#f1f1f1',
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div id="newRegisterErrorBox" style={{ width: 'block', background: 'yellow', fontSize: '20px', color: 'red' }}></div>

                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    className="left-panel-buttons orange"
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      padding: '14px 20px',
                      margin: '8px 0',
                      border: 'none',
                      cursor: 'pointer',
                      opacity: '0.9',
                    }}
                    onClick={this.reset}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="left-panel-buttons orange"
                    style={{
                      backgroundColor: '#04AA6D',
                      color: 'white',
                      padding: '14px 20px',
                      margin: '8px 20px',
                      border: 'none',
                      cursor: 'pointer',
                      opacity: '0.9',
                    }}
                    onClick={this.registerUser}
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            </center>
          </div>
        )}

        {this.state.login && (
          <div style={{ marginTop: '15px' }}>
            <center>
              <form
                action=""
                style={{  width: '50%',
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                marginTop: '15px',}}
              >
                <h1>Login</h1>

                <div id="newLoginBox" style={{ color: 'green' }}></div>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <label htmlFor="emailL"><b>Email &nbsp;&nbsp;</b></label>
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Enter Email"
                          name="email"
                          id="emailL"
                          required
                          style={{
                            width: '100%',
                            padding: '15px',
                            margin: '5px 0 22px 0',
                            border: 'none',
                            background: '#f1f1f1',
                          }}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <label htmlFor="psw"><b>Password &nbsp;&nbsp;</b></label>
                      </td>
                      <td>
                        <input
                          type="password"
                          placeholder="Enter Password"
                          name="psw"
                          required
                          id="passwordL"
                          style={{
                            width: '100%',
                            padding: '15px',
                            margin: '5px 0 22px 0',
                            border: 'none',
                            background: '#f1f1f1',
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div id="loginBoxError" style={{ width: 'block', background: 'yellow', fontSize: '20px', color: 'red' }}></div>

                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    className="left-panel-buttons orange"
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      padding: '14px 20px',
                      margin: '8px 0',
                      border: 'none',
                      cursor: 'pointer',
                      opacity: '0.9',
                    }}
                    onClick={this.reset}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="left-panel-buttons orange"
                    onClick={this.loginUser}
                    style={{
                      backgroundColor: '#04AA6D',
                      color: 'white',
                      padding: '14px 20px',
                      margin: '8px 20px',
                      border: 'none',
                      cursor: 'pointer',
                      opacity: '0.9',
                    }}
                  >
                    Sign In
                  </button>
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