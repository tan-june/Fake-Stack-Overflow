import React from "react";
import { createQuestionElement } from './QuestionandAnswerComponents';
import axios from "axios";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      questionCount: 0,
      currentPage: 1,
      questionsPerPage: 5,
      userVerified: false,
      
    };
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


  componentDidMount() {
    this.userCheck();
    this._isMounted = true;
    this.performSearch();
  }

  componentWillUnmount() {
    this._isMounted = false;
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

  newestLoad = () => {
    setTimeout(() => {
      axios.get("http://localhost:8000/getAllQuestionsAndCount")
        .then((res) => {
          const reversedQuestions = res.data.questions.reverse();
          this.setState({
            questionCount: res.data.questionCount,
            searchResults: reversedQuestions,
          }, () => {
            this.updateQuestionDetails();
            this.forceUpdate();
          });
        })
        .catch((error) => {
          console.error('Error retrieving questions and question count:', error);
        });
    }, 100);    
  }

  activeMode = () => {
    setTimeout(() => {
    axios.get("http://localhost:8000/getActiveQuestionsAndCount")
      .then((res) => {
        const reversedQuestions = res.data.questions.reverse();
        this.setState({
          questionCount: reversedQuestions.length,
          searchResults: reversedQuestions,
        }, () => {
          this.updateQuestionDetails();
        });
      })
      .catch((error) => {
        console.error('Error retrieving questions and question count:', error);
      });
    }, 100);    
  }

  getUnanswered = () => {
    setTimeout(() => {
      axios.get("http://localhost:8000/getUnansweredQuestionsAndCount")
      .then((res) => {
        const reversedQuestions = res.data.questions.reverse();
        this.setState({
          questionCount: reversedQuestions.length,
          searchResults: reversedQuestions,
        }, () => {
          this.updateQuestionDetails();
        });
      })
      .catch((error) => {
        console.error('Error retrieving questions and question count:', error);
      });
    }, 100);    
  }

  performSearch() {
    const { searchQuery } = this.props;

    if (!searchQuery || searchQuery.trim() === '') {
      //console.log('Empty search query');
      this.setState({ searchResults: [], questionCount: 0 });
      return;
    }

    setTimeout(() => {    
    axios.get(`http://localhost:8000/search?q=${encodeURIComponent(searchQuery)}`)
      .then(res => {
        //console.log('Search Results from Server:', res.data);
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
    //console.log('Question clicked:', qid);
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
          {this.state.userVerified && (<button className="ask-q" onClick={() => this.props.newQ()}>
            New Question
          </button>)}
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
            <br/>
            <br/>
            <button style={{ fontFamily: 'Libre Franklin', backgroundColor: '#55a1ff', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={this.handlePrevPage} disabled={isPrevDisabled}>
              Previous
            </button>
            <button style={{ marginLeft: '10px', backgroundColor: '#55a1ff', color: 'whit e', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={this.handleNextPage} disabled={isNextDisabled}>
              Next
            </button>
          </center>
        </div>
      </div>
    );
  }
}

export default Search;
