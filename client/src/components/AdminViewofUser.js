import React from 'react';
import axios from 'axios';
import sadface from "../images/sad.png";
import adminimage from "../images/adminImage.png";

class AdminViewofUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: '',
      userQuestions: [],
      allUsers: [],
      selectedQuestionId: null,
      userVerified: false,
      currentUser: [],
    };
  }

  componentWillUnmount() {
    this.setState({ userVerified: false });
  }

  deleteUser = (userId, username) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the user ${username}?`);

    if (confirmDelete) {
      axios.delete(`http://localhost:8000/deleteUser/${userId}`, { withCredentials: true })
        .then(response => {
          //console.log('User deleted successfully');
          this.fetchAllUsers();
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    }
  };


  userCheck = () => {

    //console.log("checked");
    axios
      .get('http://localhost:8000/CheckSession', { withCredentials: true })
      .then((response) => {
        const checker = response.data;
        if (checker.validated) {
          this.setState({ userVerified: true ,
            currentUser: response.data.user,
          }, () => {
            //console.log(this.state.userVerified);
          });
        } else {
          this.setState({ userVerified: false }, () => {
            //console.log(this.state.userVerified);
          });
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  formatDateTime = (dateString) => {
    const questionDate = new Date(dateString);
    const currentDate = new Date();

    const timeDifferenceInSeconds = Math.floor((currentDate - questionDate) / 1000);

    if (timeDifferenceInSeconds < 60) {
      return `${timeDifferenceInSeconds} second(s) ago`;
    } else if (timeDifferenceInSeconds < 3600) {
      const minutesAgo = Math.floor(timeDifferenceInSeconds / 60);
      return `${minutesAgo} minute(s) ago`;
    } else if (timeDifferenceInSeconds < 86400) {
      const hoursAgo = Math.floor(timeDifferenceInSeconds / 3600);
      return `${hoursAgo} hour(s) ago`;
    } else if (currentDate.getFullYear() === questionDate.getFullYear()) {
      return questionDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return questionDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }


  componentDidMount = () => {
    this.userCheck();
    axios.get('http://localhost:8000/UserDisplay', { withCredentials: true })
      .then(response => {
        this.setState({ userData: response.data });
      })
    this.fetchAllUsers();
  };

  fetchAllUsers = () => {
    axios.get('http://localhost:8000/getAllUsers', { withCredentials: true })
      .then(usersResponse => {
        this.setState({ allUsers: usersResponse.data });
        //console.log('All Users:', this.state.allUsers);
      })
      .catch(usersError => {
        console.error('Error fetching all users:', usersError.message);
      });
  }

  render() {
    let content;
    if (this.state.userVerified && this.state.userData.usertype === 'Adminstrator') {
      content = (
        <div>
          <div style={{
            // CSS Used from WWW3 Schools
            backgroundColor: 'white',
            padding: '20px',
            margin: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <img src={adminimage} alt='' width={30} style={{ marginBottom: '10px' }} />
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <h1 style={{ fontSize: '20px', margin: '0', fontWeight: 'bold', marginRight: '5px' }}>Username:</h1>
              <p>{this.state.userData.username}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <h1 style={{ fontSize: '20px', margin: '0', fontWeight: 'bold', marginRight: '5px' }}>Email:</h1>
              <p>{this.state.userData.email}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <h1 style={{ fontSize: '20px', margin: '0', fontWeight: 'bold', marginRight: '5px' }}>User Type:</h1>
              <p>{this.state.userData.usertype}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <h1 style={{ fontSize: '20px', margin: '0', fontWeight: 'bold', marginRight: '5px' }}>Reputation:</h1>
              <p>{this.state.userData.userrep}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <h1 style={{ fontSize: '20px', margin: '0', fontWeight: 'bold', marginRight: '5px' }}>Account Created:</h1>
              <p>{this.formatDateTime(this.state.userData.userCreated)}</p>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            margin: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '450px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <div>
              <h1 style={{ fontSize: '20px', margin: '0', fontWeight: 'bold', marginRight: '5px' }}>
                All Users:
              </h1>
              <br />
              {this.state.allUsers.users && this.state.allUsers.users.length > 0 ? (
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '30px', border: '1px solid #ddd' }}>Username</th>
                      <th style={{ padding: '30px', border: '1px solid #ddd' }}>Action</th>
                      <th style={{ padding: '30px', border: '1px solid #ddd' }}>User Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.allUsers.users.map((user) => (
                      <tr key={user._id}>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <a
                            href={`/UserPage/${user.username}`}
                            onClick={(e) => {
                              e.preventDefault();
                              this.props.handleUsernameClick(user._id, user.username);
                            }}
                          >
                            {user.username}
                          </a>
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        <center>
                        <button
    id="deleteButton"
    onClick={() => this.state.currentUser && user.username === this.state.currentUser.username
        ? window.alert("Can't delete active user.")
        : this.deleteUser(user._id, user.username)
    }
    style={{
        backgroundColor: '#e74c3c',
        color: '#fff',
        padding: '5px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    }}
    disabled={user._id === this.state.currentUser.id}
>
    DELETE
</button>

</center>

                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        <center>
                        {user.usertype}

                          </center>                          
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              ) : (
                <p>No users available.</p>
              )}
            </div>
          </div>
        </div>
      )
    }
    else {
      content = (
        <div>

          <center>
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <img src={sadface} alt="Sad Face" width="100" />
              <h1>You must are not authorized to view this page!</h1>
              <h3>Click Here to Navigate to the Login/Register Page!</h3>

              <a className="left-panel-buttons blue"
                style={{ marginRight: '10px' }}
                href="/" onClick={this.props.newLoader}> Login </a>
            </div>
          </center>
        </div>
      );
    }

    return (
      <div>
        {content}
      </div>

    );
  }
}

export default AdminViewofUser;