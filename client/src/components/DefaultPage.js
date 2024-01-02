import React from 'react';
import axios from 'axios';
import { createQuestionElement } from './QuestionandAnswerComponents';
import sadface from "../images/sad.png";

class DefaultPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionCount: 0,
      questionsArray: [],
      userVerified: false,
      currentPage: 1,
      questionsPerPage: 5,
      isServerNull: false,
    };
  }

  componentDidMount() {
    this.serverCheck();
    this.userCheck();
    setTimeout(() => {
      this.newestLoad();
    }, 100);
  }
  

  componentWillUnmount() {
    this.setState({
      questionCount: 0,
      questionsArray: [],
    });
  }
  

  serverCheck = () => {
    axios
      .get('http://localhost:8000/show')
      .then((response) => {
        this.setState({ isServerNull: true });
      })
      .catch((error) => {
        this.setState({ isServerNull: false });
      });
  };

  userCheck = () => {
    axios
      .get('http://localhost:8000/CheckSession', { withCredentials: true })
      .then((response) => {
        const checker = response.data;
        //console.log(checker);

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


  buttonClicked = (qid) => {
    this.props.displayA(qid);
  }

  updateQuestionDetails = () => {
    const startIndex = (this.state.currentPage - 1) * this.state.questionsPerPage;
    const endIndex = startIndex + this.state.questionsPerPage;
    const currentQuestions = this.state.questionsArray.slice(startIndex, endIndex);
    createQuestionElement(currentQuestions, this.buttonClicked);
  }
   

handleNextPage = () => {
  const totalPages = Math.ceil(this.state.questionCount / this.state.questionsPerPage);
  if (this.state.currentPage < totalPages) {
    this.setState((prevState) => ({ currentPage: prevState.currentPage + 1 }), this.updateQuestionDetails);
  }
}

handlePrevPage = () => {
  if (this.state.currentPage > 1) {
    this.setState((prevState) => ({ currentPage: prevState.currentPage - 1 }), this.updateQuestionDetails);
  }
}

newestLoad = () => {
  axios
    .get('http://localhost:8000/getAllQuestionsAndCount')
    .then((res) => {
      const reversedQuestions = res.data.questions.reverse();
      this.setState(
        {
          questionCount: res.data.questionCount,
          questionsArray: reversedQuestions,
          currentPage: 1, 
        },
        () => {
          this.updateQuestionDetails();
        }
      );
    })
    .catch((error) => {
      console.error('Error retrieving questions and question count:', error);
    });
}

activeMode = () => {
  axios
    .get('http://localhost:8000/getActiveQuestionsAndCount')
    .then((res) => {
      const reversedQuestions = res.data.questions;
      this.setState(
        {
          questionCount: reversedQuestions.length,
          questionsArray: reversedQuestions,
          currentPage: 1, 
        },
        () => {
          this.updateQuestionDetails();
        }
      );
    })
    .catch((error) => {
      console.error('Error retrieving questions and question count:', error);
    });
}

getUnanswered = () => {
  axios
    .get('http://localhost:8000/getUnansweredQuestionsAndCount')
    .then((res) => {
      const reversedQuestions = res.data.questions.reverse();
      this.setState(
        {
          questionCount: reversedQuestions.length,
          questionsArray: reversedQuestions,
          currentPage: 1, 
        },
        () => {
          this.updateQuestionDetails();
        }
      );
    })
    .catch((error) => {
      console.error('Error retrieving questions and question count:', error);
    });
}


  render() {
    const totalPages = Math.ceil(this.state.questionCount / 5);
    const isPrevDisabled = this.state.currentPage === 1;
    const isNextDisabled = this.state.currentPage === totalPages;

    if (!this.state.isServerNull) {
      return (
        <div>

          <center>
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <img src={sadface} alt="Sad Face" width="100" />
              <h1>Server Error! :(</h1>
              <h3>Please refresh the page!</h3>

              <a className="left-panel-buttons blue"
                style={{ marginRight: '10px' }}
                href="/" onClick={() => window.location.href = '/'}> Refresh </a>
            </div>
          </center>
        </div>

      )
    }
    else if (this.state.isServerNull) {
      return (
        <div>
          {(
            <div>
              <div className="right-panel1">
                <h1>All Questions</h1>

                {this.state.userVerified && (
                  <div>
                    <button className="ask-q" onClick={() => this.props.newQ()}>
                      New Question
                    </button>
                  </div>
                )}
              </div>

              <div className="right-panel2">
                <h1>{this.state.questionCount} Question(s)</h1>
                <div className="filter-button-container">
                  <button className="filter-button" onClick={this.newestLoad}>
                    Newest
                  </button>
                  <button className="filter-button" onClick={this.activeMode}>
                    Active
                  </button>
                  <button className="filter-button" onClick={this.getUnanswered}>
                    Unanswered
                  </button>
                </div>
              </div>

              <br />

              <div style={{ borderBottom: '1px dotted black', marginLeft: '50px', marginRight: '50px' }}></div>

              <div className="questionDetails" id="questionDetails"></div>

              <div>
                <center>
                  <br />            <br />
                  <button style={{ fontFamily: 'Libre Franklin', backgroundColor: '#55a1ff', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={this.handlePrevPage} disabled={isPrevDisabled}>
                    Previous
                  </button>
                  <button style={{ marginLeft: '10px', backgroundColor: '#55a1ff', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={this.handleNextPage} disabled={isNextDisabled}>
                    Next
                  </button>
                </center>
              </div>
            </div>
          )}
        </div>

      );
    }
  }
}

export default DefaultPage;
