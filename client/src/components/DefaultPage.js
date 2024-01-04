import React from 'react';
import {checkUser} from './QuestionandAnswerComponents.js';
import {
  createQuestionElement,
  newestLoad,
  activeMode,
  getUnanswered,
} from './QuestionandAnswerComponents';
import BadRender from './BadRender.js';

class DefaultPage extends React.Component {
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
    setTimeout(() => {
      this.newestLoad();
      this.userCheck();
    }, 100);
  }

  userCheck = async () => {
    try {
      const validated = await checkUser();
      this.setState({ userVerified: validated });
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  componentWillUnmount() {
    this.setState({
      questionCount: 0,
      questionsArray: [],
    });
  }

  buttonClicked = (qid) => {
    this.props.displayA(qid);
  };

  updateQuestionDetails = () => {
    const startIndex = (this.state.currentPage - 1) * this.state.questionsPerPage;
    const endIndex = startIndex + this.state.questionsPerPage;
    const currentQuestions = this.state.questionsArray.slice(startIndex, endIndex);
    createQuestionElement(currentQuestions, this.buttonClicked);
  };

  handleNextPage = () => {
    const totalPages = Math.ceil(this.state.questionCount / this.state.questionsPerPage);
    if (this.state.currentPage < totalPages) {
      this.setState(
        (prevState) => ({ currentPage: prevState.currentPage + 1 }),
        this.updateQuestionDetails
      );
    }
  };

  handlePrevPage = () => {
    if (this.state.currentPage > 1) {
      this.setState(
        (prevState) => ({ currentPage: prevState.currentPage - 1 }),
        this.updateQuestionDetails
      );
    }
  };

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

  render() {
    const totalPages = Math.ceil(this.state.questionCount / this.state.questionsPerPage);
    const isPrevDisabled = this.state.currentPage === 1;
    const isNextDisabled = this.state.currentPage === totalPages;

    if (!this.state.questionsArray.length && this.state.questionCount === 0) {
      return <BadRender />;
    }

    return (
      <div>
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
              <br />
              <br />
              <button className="paginationButtons" onClick={this.handlePrevPage} disabled={isPrevDisabled}>
                Previous
              </button>
              <button className="paginationButtons" onClick={this.handleNextPage} disabled={isNextDisabled}>
                Next
              </button>
            </center>
          </div>
        </div>
      </div>
    );
  }
}

export default DefaultPage;