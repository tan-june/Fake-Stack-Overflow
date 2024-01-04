import React from "react";
import axios from "axios";
import {
  createQuestionElement,
  newestLoad,
  activeMode,
  getUnanswered
} from './QuestionandAnswerComponents';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      questionCount: 0,
      currentPage: 1,
      questionsPerPage: 5,
    };
  }

  componentDidMount() {
    this.performSearch();
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.performSearch();
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.searchQuery !== this.props.searchQuery) {
      this.performSearch();
    }
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

  updateQuestionDetails = () => {
    const startIndex = (this.state.currentPage - 1) * this.state.questionsPerPage;
    const endIndex = startIndex + this.state.questionsPerPage;
    const currentQuestions = this.state.searchResults.slice(startIndex, endIndex);
    createQuestionElement(currentQuestions, this.buttonClicked);
  }

  newestLoad = async () => {
    const response = await newestLoad();
    this.setState({
      questionCount: response.questionCount,
      searchResults: response.questionsArray,
      currentPage: 1,
    });
    this.updateQuestionDetails();
  }

  activeMode = async () => {
    const response = await activeMode();
    this.setState({
      questionCount: response.questionCount,
      searchResults: response.questionsArray,
      currentPage: 1,
    });
    this.updateQuestionDetails();
  }

  getUnanswered = async () => {
    const response = await getUnanswered();
    this.setState({
      questionCount: response.questionCount,
      searchResults: response.questionsArray,
      currentPage: 1,
    });
    this.updateQuestionDetails();
  }

  performSearch() {
    const { searchQuery } = this.props;

    if (!searchQuery || searchQuery.trim() === '') {
      this.setState({ searchResults: [], questionCount: 0 });
      return;
    }

    setTimeout(() => {
      axios.get(`http://localhost:8000/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => {
          this.setState({
            questionCount: res.data.questionCount,
            searchResults: res.data.searchResults.reverse(),
            currentPage: 1,
          }, () => {
            this.updateQuestionDetails();
          });
          if (this.state.questionCount === 0) {
            const questionDetailsContainer = document.getElementById('questionDetails');
            questionDetailsContainer.innerHTML = `<h1> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No Search Results Found!</h1>`;
          }
        })
        .catch(error => {
          console.error('Error performing search:', error);
        });
    }, 100);
  }

  buttonClicked = (qid) => {
    this.props.displayA(qid);
  }

  render() {
    const totalPages = Math.ceil(this.state.questionCount / this.state.questionsPerPage);
    const isPrevDisabled = this.state.currentPage === 1;
    const isNextDisabled = this.state.currentPage === totalPages;

    return (
      <div>
        <div className="right-panel1">
          <h1>Search Results</h1>
          {this.state.userVerified && (
            <button className="ask-q" onClick={() => this.props.newQ()}>
              New Question
            </button>
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

        <div
          style={{ borderBottom: '1px dotted black', marginLeft: '50px', marginRight: '50px' }}
        ></div>

        <div className="questionDetails" id="questionDetails">
        </div>

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
    );
  }
}

export default Search;