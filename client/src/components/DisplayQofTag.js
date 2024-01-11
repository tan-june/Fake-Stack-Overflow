import React from "react";
import {
  createQuestionElement,
  newestLoad,
  activeMode,
  getUnanswered,
  checkUser
} from './QuestionandAnswerComponents';
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

  userCheck = async () => {
    try {
      const validated = await checkUser();
      this.setState({ userVerified: validated });
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  updateQuestionDetails = () => {
    const startIndex = (this.state.currentPage - 1) * this.state.questionsPerPage;
    const endIndex = startIndex + this.state.questionsPerPage;
    const currentQuestions = this.state.questionsArray.slice(startIndex, endIndex);
    createQuestionElement(currentQuestions, this.buttonClicked);
  }

  async loadData(callback) {
    const response = await callback();
    this.setState({
      questionCount: response.questionCount,
      questionsArray: response.questionsArray,
      currentPage: 1,
    });
    this.updateQuestionDetails();
  }

  newestLoad = () => {
    this.loadData(newestLoad);
  };

  activeMode = () => {
    this.loadData(activeMode);
  };

  getUnanswered = () => {
    this.loadData(getUnanswered);
  };


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
            <button className="paginationButtons" onClick={this.handlePrevPage} disabled={isPrevDisabled}>
              Previous
            </button>
            <button className="paginationButtons" onClick={this.handleNextPage} disabled={isNextDisabled}>
              Next
            </button>
          </center>
        </div>

      </div>
    );
  }
}

export default DisplayQofTag;