import React from "react";
import axios from "axios";
import BadRender from "./BadRender";
import adminimage from "../images/adminImage.png";

class AdminViewofUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: "",
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
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the user ${username}?`
    );

    if (confirmDelete) {
      axios
        .delete(`http://localhost:8000/deleteUser/${userId}`, {
          withCredentials: true,
        })
        .then((response) => {
          this.fetchAllUsers();
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };

  userCheck = () => {
    axios
      .get("http://localhost:8000/CheckSession", { withCredentials: true })
      .then((response) => {
        const checker = response.data;
        if (checker.validated) {
          this.setState({ userVerified: true, currentUser: response.data.user });
        } else {
          this.setState({ userVerified: false });
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  componentDidMount = () => {
    this.userCheck();
    axios
      .get("http://localhost:8000/UserDisplay", { withCredentials: true })
      .then((response) => {
        this.setState({ userData: response.data });
      });
    this.fetchAllUsers();
  };

  fetchAllUsers = () => {
    axios
      .get("http://localhost:8000/getAllUsers", { withCredentials: true })
      .then((usersResponse) => {
        this.setState({ allUsers: usersResponse.data });
      })
      .catch((usersError) => {
        console.error("Error fetching all users:", usersError.message);
      });
  };

  render() {
    let content;

    if (
      this.state.userVerified &&
      this.state.userData.usertype === "Adminstrator"
    ) {
      content = (
        <div>
          <div className="userDetail">
            <div className="useruserBox" style={{ width: "300px" }}>
              <img
                src={adminimage}
                alt=""
                width={50}
                style={{ marginBottom: "20px" }}
              />
              <div>
                <h1>Username:</h1>
                <p>{this.state.userData.username}</p>
                <h1>Email:</h1>
                <p>{this.state.userData.email}</p>
                <h1>User Type:</h1>
                <p>{this.state.userData.usertype}</p>
                <h1>Reputation:</h1>
                <p>{this.state.userData.userrep}</p>
              </div>
            </div>
          </div>

          <div className="useruserBox">
            <div>
              <h1
                style={{
                  fontSize: "20px",
                  margin: "0",
                  fontWeight: "bold",
                  marginRight: "5px",
                }}
              >
                All Users:
              </h1>
              <br />
              {this.state.allUsers.users &&
              this.state.allUsers.users.length > 0 ? (
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "30px", border: "1px solid #ddd" }}>
                        Username
                      </th>
                      <th style={{ padding: "30px", border: "1px solid #ddd" }}>
                        Action
                      </th>
                      <th style={{ padding: "30px", border: "1px solid #ddd" }}>
                        User Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.allUsers.users.map((user) => (
                      <tr key={user._id}>
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          <a
                            href={`/UserPage/${user.username}`}
                            onClick={(e) => {
                              e.preventDefault();
                              this.props.handleUsernameClick(
                                user._id,
                                user.username
                              );
                            }}
                          >
                            {user.username}
                          </a>
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          <center>
                            <button
                              id="deleteButton"
                              onClick={() =>
                                this.state.currentUser &&
                                user.username ===
                                  this.state.currentUser.username
                                  ? window.alert("Can't delete active user.")
                                  : this.deleteUser(user._id, user.username)
                              }
                              style={{
                                backgroundColor: "#e74c3c",
                                color: "#fff",
                                padding: "5px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                              disabled={user._id === this.state.currentUser.id}
                            >
                              DELETE
                            </button>
                          </center>
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          <center>{user.usertype}</center>
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
      );
    } else {
      content = <BadRender />;
    }

    return <div>{content}</div>;
  }
}
export default AdminViewofUser;