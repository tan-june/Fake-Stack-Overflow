import React from 'react';
import axios from 'axios';
import sadface from "../images/sad.png";
import user1image from "../images/user1Image.png";


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

  componentWillUnmount(){
    this.setState({userVerified: false,
      userData: [],
    });
  }

  userCheck = () => {
    //console.log("checked");
    axios
      .get('http://localhost:8000/CheckSession', { withCredentials: true })
      .then((response) => {
        const checker = response.data;
        if (checker.validated) {
          this.setState({ userVerified: true }, () => {
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
  
  componentDidMount = () => {
    this.userCheck();
    setTimeout(() => {

      if(this.props.keySwitch === null){
        axios.get('http://localhost:8000/UserDisplay', { withCredentials: true })
        .then(response => {
          this.setState({ userData: response.data });
  
          // //console.log('User Data:', this.state.userData);
          //console.log(response.data);
          // Check if the user is an admin
          if (this.state.userData.usertype === 'Adminstrator') {
             this.props.changetoAdmin();
  
          } else if(this.state.userData.usertype === 'Standard User') {
            axios.get(`http://localhost:8000/questionsByUser/${this.state.userData.username}`, { withCredentials: true })
              .then(questionsResponse => {
                this.setState({ userQuestions: questionsResponse.data });
                //console.log('User Questions:', this.state.userQuestions);
              })
              .catch(questionsError => {
                console.error('Error fetching user questions:', questionsError.message);
              });
          }
        })
        .catch(error => {
          // Handle errors here
          console.error('Error:', error.message);
        });
      }
        
      else if (this.props.keySwitch === "AdminView") {
        //console.log("Switch successful.");
        //console.log(this.props.usertoShow);
      
        axios
          .get('http://localhost:8000/getUserData', {
            params: { userId: this.props.usertoShow },
            withCredentials: true
          })
          .then(response => {
            //console.log(response.data);
            this.setState({ userData: response.data }, () => {
              //console.log(this.state.userData);
              //console.log(this.state.userData.username);
      
              axios.get(`http://localhost:8000/questionsByUser/${this.state.userData.username}`, { withCredentials: true })
                .then(questionsResponse => {
                  this.setState({ userQuestions: questionsResponse.data });
                  //console.log('User Questions:', this.state.userQuestions);
                })
                .catch(questionsError => {
                  console.error('Error fetching user questions:', questionsError.message);
                });
            });
          })
          .catch(error => console.error(error));
      }
    }, 100);


    
    
      
    }

  switchToModifyQuestions = () => {
    this.setState({ view: 'modifyQuestion' });
  };

  handleQuestionTitleClick = (questionId) => {

    //console.log('Handling question title click for question ID:', questionId);

    axios
      .get(`http://localhost:8000/getQuestionByIdUpdate?questionId=${questionId}`, { withCredentials: true })
      .then((detailsResponse) => {
        // const questionDetails = detailsResponse.data;
        //console.log('Question Details:', questionDetails);
        this.props.modifyQ(questionId);
      })
      .catch((detailsError) => {
        console.error('Error fetching question details:', detailsError.message);
      });
  };

  showUserTags = () => {
    //console.log("User Answers button clicked");
    this.props.showUserTags(this.state.userData._id); 
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


  render() {
    // //console.log(this.state.userData)
  
    let content;
    

    if ((this.state.userVerified && this.state.userData.usertype === 'Standard User' ) || (this.state.userVerified && this.props.keySwitch)) {
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
          <img src={user1image} alt='' width={30} style={{ marginBottom: '10px' }} />
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
          // CSS Used from WWW3 Schools
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
                      //console.log('Question Title Clicked', question._id);
                      // Add more logs or debugging steps if needed
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
    style={{ backgroundColor: '#55a1ff', marginLeft: '20px', marginRight:'20px', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
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

      
      )
      }
    
      else {
        content = (
          <div>
          
          <center>
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                  <img src={sadface} alt="Sad Face" width="100" />
                  <h1>You must be logged in to view this page!</h1>
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

export default UserDisplay;
