import React from "react";
import { createQuestionElement } from './QuestionandAnswerComponents';
import axios from "axios";
class DisplayQofTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionCount: 0,
      questionsArray: [],
      currentPage: 1,
      questionsPerPage: 5,
      userVerified: false,
    };
  }

  componentDidMount() {
    this.userCheck()
    setTimeout(() => {
      this.loadQuestionsByTag();
    }
    , 100);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tidSearch !== this.props.tidSearch) {
      this.loadQuestionsByTag();
    }
  }

  loadQuestionsByTag = () => {
    axios.get(`http://localhost:8000/getQuestionsByTag?tidSearch=${this.props.tidSearch}`)
      .then((res) => {
        const reversedQuestions = res.data.questions.reverse();
        this.setState({
          questionCount: res.data.questionCount,
          questionsArray: reversedQuestions,
        }, () => {
          this.updateQuestionDetails();
        });
      })
      .catch((error) => {
        console.error('Error retrieving questions by tag:', error);
      });
  }

  buttonClicked = (qid) => {
    this.props.displayA(qid);
  }

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


  updateQuestionDetails = () => {
    const startIndex = (this.state.currentPage - 1) * this.state.questionsPerPage;
    const endIndex = startIndex + this.state.questionsPerPage;
    const currentQuestions = this.state.questionsArray.slice(startIndex, endIndex);
    createQuestionElement(currentQuestions, this.buttonClicked);
  }

  newestLoad = () => {
    axios.get("http://localhost:8000/getAllQuestionsAndCount")
      .then((res) => {
        const reversedQuestions = res.data.questions.reverse();
        this.setState({
          questionCount: res.data.questionCount,
          questionsArray: reversedQuestions,
        }, () => {
          this.updateQuestionDetails();
        });
      })
      .catch((error) => {
        console.error('Error retrieving questions and question count:', error);
      });
  }

  activeMode = () => {
    axios.get("http://localhost:8000/getActiveQuestionsAndCount")
      .then((res) => {
        const reversedQuestions = res.data.questions;
        this.setState({
          questionCount: reversedQuestions.length,
          questionsArray: reversedQuestions,
        }, () => {
          this.updateQuestionDetails();
        });
      })
      .catch((error) => {
        console.error('Error retrieving questions and question count:', error);
      });
  }

  getUnanswered = () => {
    axios.get("http://localhost:8000/getUnansweredQuestionsAndCount")
      .then((res) => {
        const reversedQuestions = res.data.questions.reverse();
        this.setState({
          questionCount: reversedQuestions.length,
          questionsArray: reversedQuestions,
        }, () => {
          this.updateQuestionDetails();
        });
      })
      .catch((error) => {
        console.error('Error retrieving questions and question count:', error);
      });
  }

  handleNextPage = () => {
    this.setState(
      (prevState) => ({ currentPage: prevState.currentPage + 1 }),
      this.updateQuestionDetails
    );
  }

  handlePrevPage = () => {
    this.setState(
      (prevState) => ({ currentPage: prevState.currentPage - 1 }),
      this.updateQuestionDetails
    );
  }
  

  render() {
    
    const totalPages = Math.ceil(this.state.questionCount / this.state.questionsPerPage);
    const isPrevDisabled = this.state.currentPage === 1;
    const isNextDisabled = this.state.currentPage === totalPages;
    return (
      
      <div>
        <div className="right-panel1">
          <h1>Tag Search Results</h1>
          {this.state.userVerified && (<button className="ask-q" onClick={() => this.props.newQ()}>New Question</button>)}
        </div>

        <div className="right-panel2">
          <h1>{this.state.questionCount} Question(s)</h1>
          <div className="filter-button-container">
            <button className="filter-button" onClick={this.newestLoad}>Newest</button>
            <button className="filter-button" onClick={this.activeMode}>Active</button>
            <button className="filter-button" onClick={this.getUnanswered}>Unanswered</button>
          </div>
        </div>

        <br />

        <div style={{ borderBottom: '1px dotted black', marginLeft: '50px', marginRight: '50px' }}>
        </div>

        <div className="questionDetails" id="questionDetails">

        </div>

        <div>
          <center>
            <br/>
            <br/>
            <button style={{ fontFamily: 'Libre Franklin', backgroundColor: '#55a1ff', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={this.handlePrevPage} disabled={isPrevDisabled}>
              Previous
            </button>
            <button style={{ marginLeft: '10px', backgroundColor: '#55a1ff', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={this.handleNextPage} disabled={isNextDisabled}>
              Next
            </button>
          </center>
        </div>

      </div>
    );
  }
}

export default DisplayQofTag;
