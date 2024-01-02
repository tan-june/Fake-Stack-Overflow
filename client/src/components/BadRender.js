import React from 'react';
import sadface from "../images/sad.png";

class BadRender extends React.Component {
  render() {
    return (
      <div>
        <center>
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <img src={sadface} alt="Sad Face" width="100" />
            <h1>You must be logged in to view this page!</h1>
            <h3>Click Here to Navigate to the Login/Register Page!</h3>
            
            <a
              className="left-panel-buttons blue"
              style={{ marginRight: '10px' }}
              href="/"
              onClick={this.props.newLoader}
            >
              Login
            </a>
          </div>
        </center>
      </div>
    );
  }
}

export default BadRender;
