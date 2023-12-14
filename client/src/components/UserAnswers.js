import React, { Component } from 'react';
import axios from 'axios';
import { createQuestionElement } from './QuestionandAnswerComponents';

class UserAnswers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userAnswers: [],
      currentPage: 1,
      questionsPerPage: 5,
      userVerified: false,
      usertype: 'Standard User'
    };
  }

  componentWillUnmount(){
    this.setState({userVerified: false});
  }


  userCheck = () => {
    axios
      .get('http://localhost:8000/CheckSession', { withCredentials: true })
      .then((response) => {
        const checker = response.data;
  
        if (checker.validated) {
          this.setState({ userVerified: true, usertype: response.data.user.usertype}, () => {
            ////console.log(this.state.userVerified);
          });
        } else {
          this.setState({ userVerified: false }, () => {
            ////console.log(this.state.userVerified);
          });
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  componentDidMount() {
    this.userCheck();
    setTimeout(() => {
      this.fetchUserAnswers();
    }, 100);
  }

  fetchUserAnswers = () => {
    //////console.log(this.props.userID);

    const requestBody = {
        id: this.props.userID,
    };

    axios.post('http://localhost:8000/getAnsweredQuestionsByUser', requestBody, { withCredentials: true })
      .then((response) => {
        ////console.log('Response:', response);

        if (response.data) {
          console.log("data log", response.data);
          this.setState({ userAnswers: response.data.reverse() }, () => {
            this.updateQuestionDetails();
        });
        
        } else {
          console.error('Invalid response format. Expected an array.');
        }
      })
      .catch((error) => {
        console.error('Error retrieving user answers:', error);
      });
};


  updateQuestionDetails = () => {
    const startIndex = (this.state.currentPage - 1) * this.state.questionsPerPage;
    const endIndex = startIndex + this.state.questionsPerPage;
    const currentQuestions = this.state.userAnswers.slice(startIndex, endIndex);
    createQuestionElement(currentQuestions, this.buttonClicked);
  }
  
  buttonClicked = (qid) => {
    if (typeof this.props.DisplayUserA === 'function') {
      this.props.DisplayUserA(qid);
    } else {
      console.error('DisplayUserA is not a function');
    }
  }
  handleNextPage = () => {
    this.setState(
      (prevState) => ({ currentPage: prevState.currentPage + 1 }),
      this.updateQuestionDetails
    );
  };

  handlePrevPage = () => {
    this.setState(
      (prevState) => ({ currentPage: prevState.currentPage - 1 }),
      this.updateQuestionDetails
    );
  };

  render() {
    // console.log(this.state.userAnswers);
    const totalPages = Math.ceil(this.state.userAnswers.length / this.state.questionsPerPage);
    const isPrevDisabled = this.state.currentPage === 1;
    const isNextDisabled = this.state.currentPage === totalPages;

    return (
      <div>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h2 style={{color: 'red'}}>
          <center>
          Please click on a question to view and modify/delete your answers.
          </center>
          </h2>

          <h3 style={{color: 'blue'}}>
          <center>
If you don't see any questions below, you have not answered any questions.          </center>
          </h3>
        {/* Render the questions using createQuestionElement */}
        <div className="questionDetails" id="questionDetails">
        </div>

        {/* Pagination controls */}
        <div>
          <center>
            <br />
            <br />
            <button
              style={{
                fontFamily: 'Libre Franklin',
                backgroundColor: '#55a1ff',
                color: 'white',
                padding: '10px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              onClick={this.handlePrevPage}
              disabled={isPrevDisabled}
            >
              Previous
            </button>
            <button
              style={{
                marginLeft: '10px',
                backgroundColor: '#55a1ff',
                color: 'white',
                padding: '10px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              onClick={this.handleNextPage}
              disabled={isNextDisabled}
            >
              Next
            </button>
          </center>
        </div>
      </div>
    );
  }
}

export default UserAnswers;