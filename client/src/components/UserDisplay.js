import React from 'react';
import axios from 'axios';
import BadRender from './BadRender';
import user1image from '../images/user1Image.png';

class UserDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
      userQuestions: [],
      allUsers: [],
      selectedQuestionId: null,
      userVerified: false,
    };
  }

  componentWillUnmount() {
    this.setState({
      userVerified: false,
      userData: [],
    });
  }

  userCheck = () => {
    axios
      .get('http://localhost:8000/CheckSession', { withCredentials: true })
      .then((response) => {
        const checker = response.data;
        if (checker.validated) {
          this.setState({ userVerified: true });
        } else {
          this.setState({ userVerified: false });
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
  };

  componentDidMount = () => {
    this.userCheck();
    setTimeout(() => {
      if (this.props.keySwitch === null) {
        axios
          .get('http://localhost:8000/UserDisplay', { withCredentials: true })
          .then((response) => {
            this.setState({ userData: response.data });
            if (this.state.userData.usertype === 'Adminstrator') {
              this.props.changetoAdmin();
            } else if (this.state.userData.usertype === 'Standard User') {
              axios
                .get(`http://localhost:8000/questionsByUser/${this.state.userData.username}`, { withCredentials: true })
                .then((questionsResponse) => {
                  this.setState({ userQuestions: questionsResponse.data });
                })
                .catch((questionsError) => {
                  console.error('Error fetching user questions:', questionsError.message);
                });
            }
          })
          .catch((error) => {
            console.error('Error:', error.message);
          });
      } else if (this.props.keySwitch === 'AdminView') {
        axios
          .get('http://localhost:8000/getUserData', {
            params: { userId: this.props.usertoShow },
            withCredentials: true,
          })
          .then((response) => {
            this.setState({ userData: response.data }, () => {
              axios
                .get(`http://localhost:8000/questionsByUser/${this.state.userData.username}`, { withCredentials: true })
                .then((questionsResponse) => {
                  this.setState({ userQuestions: questionsResponse.data });
                })
                .catch((questionsError) => {
                  console.error('Error fetching user questions:', questionsError.message);
                });
            });
          })
          .catch((error) => console.error(error));
      }
    }, 100);
  };

  switchToModifyQuestions = () => {
    this.setState({ view: 'modifyQuestion' });
  };

  handleQuestionTitleClick = (questionId) => {
    axios
      .get(`http://localhost:8000/getQuestionByIdUpdate?questionId=${questionId}`, { withCredentials: true })
      .then((detailsResponse) => {
        this.props.modifyQ(questionId);
      })
      .catch((detailsError) => {
        console.error('Error fetching question details:', detailsError.message);
      });
  };

  showUserTags = () => {
    this.props.showUserTags(this.state.userData._id);
  };

  render() {
    let content;

    if ((this.state.userVerified && this.state.userData.usertype === 'Standard User') || (this.state.userVerified && this.props.keySwitch)) {
      content = (
        <div>
          <div className="userDetail">
            <div className="useruserBox" style={{ width: '300px' }}>
              <img src={user1image} alt="" width={50} style={{ marginBottom: '20px' }} />

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
            <h1 style={{ fontSize: '20px', margin: '0', fontWeight: 'bold', marginRight: '5px' }}>Your Questions:</h1>
            {this.state.userQuestions ? (
              <div>
                {this.state.userQuestions.length > 0 ? (
                  <div>
                    {this.state.userQuestions.map((question) => (
                      <div key={question._id}>
                        <a
                          href={`/ModifyQuestions/${question._id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            this.handleQuestionTitleClick(question._id);
                          }}
                        >
                          {question.title}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>You have not asked any questions yet!</p>
                )}
              </div>
            ) : (
              <p>Loading user questions...</p>
            )}
          </div>

          <div style={{ display: 'flex', marginTop: '20px' }}>
            <button
              style={{ backgroundColor: '#55a1ff', marginLeft: '20px', marginRight: '20px', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              id="UserAnswerButton"
              onClick={() => this.props.showUserAnswers(this.state.userData._id)}
            >
              User Answers
            </button>

            <button
              style={{ backgroundColor: '#e74c3c', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              id="UserTagsButton"
              onClick={this.showUserTags}
            >
              User Tags
            </button>
          </div>
        </div>
      );
    } else {
      content = <BadRender />;
    }

    return <div>{content}</div>;
  }
}

export default UserDisplay;