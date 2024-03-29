import React, { Component } from "react";
import axios from "axios";
import upvote from "../images/upvote.png";
import { checkUser } from "./QuestionandAnswerComponents";

class DisplayUserAnswer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: null,
      showFormA: false,
      aQID: null,
      showFormQ: false,
      qQid: null,
      currentPage: 1,
      answersPerPage: 5,
      questionCurrentPage: 1,
      commentsPerPage: 3,
      answerPages: {},
      userVerified: false,
      currentUserType: '',
    };
  }

  userCheck = async () => {
    try {
      const validated = await checkUser();
      this.setState({ userVerified: validated });
      if (!validated) {
        this.setState({ usertype: validated.data.user.usertype })
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  commentForm = (answerID) => {
    this.setState({ showFormA: true, aQID: answerID });
  };

  resetCommentForm = () => {
    this.setState({ showFormA: false, attachQuestionToo: null });
  };

  commentFormforQ = (questionID) => {
    this.setState({ showFormQ: true, qQid: questionID });
  };

  resetCommentFormforQ = () => {
    this.setState({ showFormQ: false, qQid: null });
  };

  postCommentCheck = (event) => {
    event.preventDefault();
    axios.get('http://localhost:8000/SendUser', { withCredentials: true })
      .then((response) => {
        if (response.data.userrep >= 50) {
          const text = document.getElementById('commentToAnswer').value;
          if ((text.length >= 10) && (text.length <= 140)) {
            const errorBox = document.getElementById('commentBoxError');
            errorBox.style.visibility = 'hidden';
            this.postComment();
          } else {
            const errorBox = document.getElementById('commentBoxError');
            errorBox.style.visibility = 'visible';
            errorBox.innerText = 'Please write a comment greater than 10 and/or less than 140 characters.';
          }
        } else {
          const errorBox = document.getElementById('commentBoxError');
          errorBox.style.visibility = 'visible';
          errorBox.innerText = 'You can not post a comment, not enough reputation.';
        }
      })
      .catch((error) => console.log(error));
  }

  postComment = () => {
    const user = 'Needs to Fix';
    const text = document.getElementById('commentToAnswer').value;
    axios.post(`http://localhost:8000/AddCommentToAnswer`, { id: this.state.aQID, comment: text, user: user }, { withCredentials: true })
    this.resetCommentForm();
    this.updateQuestionInfo();
  }


  // Post Comment
  postCommentCheckforQ = (event) => {
    event.preventDefault();

    axios.get('http://localhost:8000/SendUser', { withCredentials: true })
      .then((response) => {
        if (response.data.userrep >= 50) {
          const text = document.getElementById('commentToQuestion').value;
          // //console.log("Length", text.length);
          if ((text.length >= 10) && (text.length <= 140)) {
            const errorBox = document.getElementById('commentBoxError1');
            //console.log("Greater than 10")
            errorBox.style.visibility = 'hidden';
            this.postCommentforQ();
          } else {
            const errorBox = document.getElementById('commentBoxError1');
            errorBox.style.visibility = 'visible';
            errorBox.innerText = 'Please write a comment greater than 10 and/or less than 140 characters.';
          }
        } else {
          const errorBox = document.getElementById('commentBoxError1');
          errorBox.style.visibility = 'visible';
          errorBox.innerText = 'You can not post a comment, not enough reputation.';
        }
      })
      .catch((error) => console.log(error));
  }


  postCommentforQ = () => {
    // window.alert(this.state.qQid);
    const user = 'Needs to Fix';
    const text = document.getElementById('commentToQuestion').value;
    const valuesPoster = { id: this.props.qid, comment: text, user: user };
    // //console.log(valuesPoster);
    axios.post(`http://localhost:8000/AddCommentToQuestion`, valuesPoster, { withCredentials: true })
    this.resetCommentFormforQ();
    this.updateQuestionInfo();
  }

  componentWillUnmount() {
    this.setState({ question: [] });
  }

  componentDidMount() {
    this.serverCheck();
    setTimeout(() => {
      axios
        .get(`http://localhost:8000/getQuestionById?questionId=${this.props.qid}`)
        .then((response) => {
          this.setState({ question: response.data });
        })
        .catch((error) => {
          console.error("Error retrieving question:", error);
        })
        .then(() => {
          // this.updateQuestionInfo();
          this.updateQuestionInfo();
          this.displayAnswerQuestionOrNot();
        });

      axios
        .get("http://localhost:8000/GetCurrentUserData", { withCredentials: true })
        .then((response) => {
          this.setState({
            currentUser: response.data.username,
            currentUserType: response.data.usertype,
          });
        })
        .catch((error) => {
          console.error("Error fetching current user:", error);
        });
    }, 100);

  }

  handleNextAnswerPage = () => {
    this.setState(
      (prevState) => ({ currentPage: prevState.currentPage + 1 }),
      this.updateQuestionInfo
    );
  };

  handlePrevAnswerPage = () => {
    this.setState(
      (prevState) => ({ currentPage: prevState.currentPage - 1 }),
      this.updateQuestionInfo
    );
  };

  handleQuestionCommentNextPage = () => {
    this.setState(
      (prevState) => ({ questionCurrentPage: prevState.questionCurrentPage + 1 }),
      this.updateQuestionInfo
    );
  };

  handleQuestionCommentPrevPage = () => {
    this.setState(
      (prevState) => ({ questionCurrentPage: prevState.questionCurrentPage - 1 }),
      this.updateQuestionInfo
    );
  };


  displayAnswerQuestionOrNot = async () => {
    try {
      const validated = await checkUser();
      this.setState({ userVerified: validated });
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };



  updateQuestionInfo = () => {
    axios
      .get(
        `http://localhost:8000/getQuestionByIdUpdate?questionId=${this.props.qid}`,
      )
      .then((response) => {
        const responseData = response.data;
        this.setState({ question: { ...responseData, answers: responseData.answers.reverse() } });
      })
      .catch((error) => {
        console.error("Error retrieving question:", error);
      });
  }


  upvoteQuestion = (id) => {
    axios.post(`http://localhost:8000/QuestionUpvote`, { id: id }, { withCredentials: true });
    this.updateQuestionInfo();
  };

  downvoteQuestion = (id) => {
    axios.post(`http://localhost:8000/QuestionDownvote`, { id: id }, { withCredentials: true });
    this.updateQuestionInfo();
  };

  upvoteAnswer = (id) => {
    axios.post(`http://localhost:8000/AnswerUpvote`, { id: id }, { withCredentials: true });
    this.updateQuestionInfo();
  };

  downvoteAnswer = (id) => {
    axios.post(`http://localhost:8000/AnswerDownVote`, { id: id }, { withCredentials: true });
    this.updateQuestionInfo();
  };

  upvoteComment = (answerID, commentID, passValue) => {
    axios.post(`http://localhost:8000/CommmentUpvote`, { answerId: answerID, commentId: commentID, passValue: passValue }, { withCredentials: true })
      .then()
      .catch((error) => {
        console.error("Error retrieving question:", error);
      });
    this.updateQuestionInfo();
  }
  updateAnswerPage = (answerId, currentPage) => {
    const answerPages = { ...this.state.answerPages, [answerId]: currentPage };
    this.setState({ answerPages });
  };

  putTagsAd = () => {
    const { tags } = this.state.question;

    return (
      <div className="tagContainer" id="tagContainer">
        {tags.map((tag, index) => (
          <div key={index} className="taginQ">
            <div className="inner-tag">{tag.name ?? ''}</div>
          </div>
        ))}
      </div>
    );
  };

  render() {
    if (!this.state.question) {
      return (
        <div>
          <h1>We're sorry this question was not found! </h1>
          <h3>Please click the button below and go back.</h3>
          <button className="ask-q" onClick={() => this.props.defaultLoad()}>
            Return to Home Page!
          </button>
        </div>
      );
    }

    const startIndex = (this.state.currentPage - 1) * this.state.answersPerPage;
    const endIndex = startIndex + this.state.answersPerPage;
    const currentAnswers = this.state.question.answers.slice(startIndex, endIndex);


    const totalPages = Math.ceil(this.state.question.answers.length / 5);
    const isPrevAnswerDisabled = this.state.currentPage === 1;
    const isNextAnswerDisabled = this.state.currentPage === totalPages;

    return (
      <div>
        <br></br>
        <center><h1 style={{ color: 'red' }}>Modify Answers</h1></center>

        <div className="right-panel1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>



          <div style={{ width: '15%' }}>
            <center>
              <b>{this.state.question.answers.length} answer(s) <br />
                {this.state.question.questionrep} Votes</b>
            </center>
          </div>

          <div style={{ width: '70%', marginLeft: '30px', marginRight: '30px', textAlign: 'center' }}>
            <h3>{this.state.question.title}</h3>
            <div style={{ fontSize: '15px', fontWeight: 'normal' }}><b>Summary:</b> {this.state.question.qsummary}</div>


            <br></br>
            <br></br>

            {this.putTagsAd()}

          </div>
          <div style={{ width: '15%' }}>
          </div>
        </div>
        <br />
        <div id="questionContainer" className="question-container">
          <div style={{ border: 'none' }} className="question-container-left">
            <div>
              <b>{this.state.question.views} view(s)</b>
              <br />
              <br />
            </div>
          </div>

          <div style={{ border: 'none' }} className="question-container-center">

            <p dangerouslySetInnerHTML={{ __html: this.state.question.text }}></p>
          </div>
          <div style={{ border: 'none' }} className="question-container-right">
            <div style={{ color: "red" }}>{this.state.question.asked_by}</div> asked {" "}
            {this.state.question.ask_date_time}
            <br />
            <br />
          </div>

        </div>
        {this.state.question.comments
          .reverse().slice(
            (this.state.questionCurrentPage - 1) * this.state.commentsPerPage,
            this.state.questionCurrentPage * this.state.commentsPerPage
          )
          .map((comment) => (
            <div key={comment._id}>
              <div className="comment-container">
                {/* Render individual comments here */}
                <div className="comment-container-left">
                  <div>
                    <div
                      id="rep-count"
                      style={{
                        fontSize: "20px",
                        paddingTop: "10px",
                        paddingBottom: "5px",
                      }}
                    >
                      {comment.reputation}
                      <div style={{ fontSize: "13px" }}>Votes</div>
                    </div>
                  </div>
                </div>
                <div className="comment-container-center">
                  <center>{comment.text}</center>
                </div>
                <div className="comment-container-right">
                  comment by <br /><br /> <b>{comment.comment_by}</b>
                </div>
              </div>

            </div>
          ))}

        {this.state.question.comments.length > this.state.commentsPerPage && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px', marginRight: '60px' }}>
            <button
              style={{
                backgroundColor: "#55a1ff",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={this.handleQuestionCommentPrevPage}
              disabled={this.state.questionCurrentPage === 1}
            >
              Prev
            </button>
            <button
              style={{
                backgroundColor: "#55a1ff",
                color: "white",
                padding: "10px",
                marginLeft: "10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={this.handleQuestionCommentNextPage}
              disabled={
                this.state.questionCurrentPage ===
                Math.ceil(this.state.question.comments.length / this.state.commentsPerPage)
              }
            >
              Next
            </button>
          </div>
        )}
        <div className="question-container">
          <div className="question-container-left"> </div>
          <div className="question-container-center"> </div>
          <div className="question-container-right"> </div>
        </div>

        <div className="boxyContainer">
          <div id="answersContainer">


            {currentAnswers.reverse().map((answer) => (
              <div key={answer._id}>

                <div className="answer-container">
                  <div className="answer-container-left">
                    <div id="voting-container">


                      <div
                        id="reputation-count"
                        style={{
                          fontSize: "25px",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                        }}
                      >
                        {answer.answerrep}
                        <div style={{ fontSize: '13px' }}>Votes</div>
                      </div>

                    </div>
                  </div>

                  {/* Center Container */}
                  <div className="answer-container-center">
                    <p dangerouslySetInnerHTML={{ __html: answer.text }}></p>
                  </div>

                  {/* Right Container */}
                  <div className="answer-container-right">
                    <div style={{ color: "green" }}>{answer.ans_by}</div> answered{" "}
                    {answer.ans_date_time}
                    <br />
                    <br />

                    {((this.state.userVerified && this.state.currentUser === answer.ans_by) || (this.state.userVerified && this.state.currentUserType === "Adminstrator")) && (
                      <button
                        style={{
                          padding: "20px 22px",
                          fontSize: "14px",
                          backgroundColor: "#e74c3c",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          marginTop: "20px",
                        }}
                        onClick={() => {
                          // //console.log("Clicked on Modify Answer button for answer ID:", answer._id);
                          this.props.modifyA(answer._id);
                        }}
                      >
                        Modify Answer
                      </button>
                    )}
                  </div>
                </div>
                {answer.comments && (
                  <div>
                    {answer.comments
                      .reverse()
                      .slice(
                        (this.state.answerPages[answer._id] - 1 || 0) * this.state.commentsPerPage,
                        (this.state.answerPages[answer._id] || 1) * this.state.commentsPerPage
                      )
                      .map((comment) => (
                        <div key={comment._id}>
                          <div className="comment-container">
                            <div className="comment-container-left">
                              <div>
                                {this.state.userVerified && (
                                  <a
                                    href="#/"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => this.upvoteComment(answer._id, comment._id, 0)}
                                    id="upvote"
                                  >
                                    <img src={upvote} width="15" alt="+" />
                                  </a>
                                )}

                                <div
                                  id="rep-count"
                                  style={{ fontSize: "20px", paddingTop: "10px", paddingBottom: "5px" }}
                                >
                                  {comment.reputation}
                                  <div style={{ fontSize: "13px" }}>Votes</div>
                                </div>
                              </div>
                            </div>
                            <div className="comment-container-center">
                              <center>{comment.text}</center>
                              {/* {answer._id} */}
                            </div>
                            <div className="comment-container-right">
                              comment by <br />
                              <br />
                              <b>{comment.comment_by}</b>
                            </div>
                          </div>
                        </div>
                      ))}
                    {answer.comments.length > this.state.commentsPerPage && (
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "30px", marginRight: "60px" }}>
                        <button
                          style={{
                            backgroundColor: "#55a1ff",
                            color: "white",
                            padding: "10px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            this.setState(
                              (prevState) => ({
                                answerPages: {
                                  ...prevState.answerPages,
                                  [answer._id]: (prevState.answerPages[answer._id] || 1) - 1,
                                },
                              }),
                              () => this.updateAnswerPage(answer._id, this.state.answerPages[answer._id])
                            )
                          }
                          disabled={(this.state.answerPages[answer._id] || 1) === 1}
                        >
                          Prev
                        </button>
                        <button
                          style={{
                            backgroundColor: "#55a1ff",
                            color: "white",
                            padding: "10px",
                            marginLeft: "10px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            this.setState(
                              (prevState) => ({
                                answerPages: {
                                  ...prevState.answerPages,
                                  [answer._id]: (prevState.answerPages[answer._id] || 0) + 1,
                                },
                              }),
                              () => this.updateAnswerPage(answer._id, this.state.answerPages[answer._id])
                            )
                          }
                          disabled={
                            (this.state.answerPages[answer._id] || 0) ===
                            Math.ceil(answer.comments.length / this.state.commentsPerPage)
                          }
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <div className="question-container">
                  <div className="question-container-left"> </div>
                  <div className="question-container-center"> </div>
                  <div className="question-container-right"> </div>
                  <br />
                </div>
              </div>
            ))}

            <div>
              <br />
              <center>
                <button
                  style={{
                    backgroundColor: "#55a1ff",
                    color: "white",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={this.handlePrevAnswerPage}
                  disabled={isPrevAnswerDisabled}
                >
                  Previous
                </button>
                <button
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#55a1ff",
                    color: "white",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={this.handleNextAnswerPage}
                  disabled={isNextAnswerDisabled}
                >
                  Next
                </button>
              </center>
            </div>

          </div>
        </div>


        {this.state.showFormA && (
          <div>
            <center>
              <form
                action=""
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  width: '30%',
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-25%, -50%)',
                  padding: '20px',
                  boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
                  zIndex: 1,
                }}
              >
                <h1>Add Comment to Answer!</h1>

                <div id="newLoginBox" style={{ color: 'green' }}></div>
                <table>
                  <tbody>
                    <tr>
                      <textarea
                        type="text"
                        placeholder="Enter Text"
                        name="text"
                        required
                        id="commentToAnswer"
                        style={{
                          width: '100%',
                          padding: '20px',
                          margin: '5px 0 22px 0',
                          border: 'none',
                          background: '#f1f1f1',
                          fontFamily: 'Calibri',
                          height: '120px',
                          fontSize: '13px',
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word',
                        }}
                      />
                    </tr>
                  </tbody>
                </table>

                <div id="commentBoxError" style={{ width: 'block', background: 'yellow', fontSize: '20px', color: 'red' }}></div>

                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    className="left-panel-buttons orange"
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      padding: '14px 20px',
                      margin: '8px 5px',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '5px',
                      opacity: '0.9',
                    }}
                    onClick={this.resetCommentForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="left-panel-buttons orange"
                    onClick={this.postCommentCheck}
                    style={{
                      backgroundColor: '#04AA6D',
                      color: 'white',
                      padding: '14px 20px',
                      margin: '8px 5px',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '5px',
                      opacity: '0.9',
                    }}
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            </center>
          </div>
        )}


        {this.state.showFormQ && (
          <div>
            <center>
              <form
                action=""
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  width: '30%',
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-25%, -50%)',
                  padding: '20px',
                  boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
                  zIndex: 1,
                }}
              >
                <h1>Add Comment to Question!</h1>

                <div id="newLoginBox" style={{ color: 'green' }}></div>
                <table>
                  <tbody>
                    <tr>
                      <textarea
                        type="text"
                        placeholder="Enter Text"
                        name="text"
                        required
                        id="commentToQuestion"
                        style={{
                          // width: '100%',
                          width: '378px',
                          padding: '20px',
                          margin: '5px 0 22px 0',
                          border: 'none',
                          background: '#f1f1f1',
                          fontFamily: 'Calibri',
                          height: '120px',
                          fontSize: '13px',
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word',
                        }}
                      />
                    </tr>
                  </tbody>
                </table>

                <div id="commentBoxError1" style={{ width: 'block', background: 'yellow', fontSize: '20px', color: 'red' }}></div>

                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    className="left-panel-buttons orange"
                    style={{

                      backgroundColor: '#f44336',
                      color: 'white',
                      padding: '14px 20px',
                      margin: '8px 5px',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '5px',
                      opacity: '0.9',
                    }}
                    onClick={this.resetCommentFormforQ}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="left-panel-buttons orange"
                    onClick={this.postCommentCheckforQ}
                    style={{
                      backgroundColor: '#04AA6D',
                      color: 'white',
                      padding: '14px 20px',
                      margin: '8px 5px',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '5px',
                      opacity: '0.9',
                    }}
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            </center>
          </div>
        )}
      </div>
    );
  }
}

export default DisplayUserAnswer;