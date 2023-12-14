import React from 'react';
import axios from 'axios';
import sadface from "../images/sad.png";

class ModifyQuestions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionId: '',
            questionTitle: '',
            questionText: '',
            questionSummary: '',
            questionTags: [],
            userVerified: false,
          };
    }

    componentDidMount() {
        this.userCheck();
        const questionId = this.props.questionId;
        if (questionId) {
            this.fetchQuestionData(questionId);
        }
    }

    userCheck = () => {
        axios
          .get('http://localhost:8000/CheckSession', { withCredentials: true })
          .then((response) => {
            const checker = response.data;
            ////console.log(checker);
      
            if (checker.validated) {
              this.setState({ userVerified: true }, () => {
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
    
    checkInput = () => {
        const patternCheck = /[[\]()]/;
        const patternCheck2 = /]\(/;
      
        const title = this.state.questionTitle.trim();
        const summary = this.state.questionSummary.trim();
        const details = this.state.questionText.trim();
        const tags = this.state.questionTags.map(tag => tag.name);
      
        const isTitleValid = title.length > 0;
        const isSummaryValid = summary.length > 0;
        const isDetailsValid = details.length > 0;
        const validTags = tags.length <= 5 && tags.every(tag => tag.length > 0 && tag.length <= 10);
      
        document.getElementById('box1').innerHTML = isTitleValid ? '' : 'Please fill out the title field.';
        document.getElementById('summaryBox').innerHTML = isSummaryValid ? '' : 'Please fill out the summary field.';
        document.getElementById('box3').innerHTML = validTags ? '' : 'Tags must be up to 5, each up to 10 characters, separated by white space.';
        document.getElementById('box5').innerHTML = isDetailsValid ? '' : 'Please fill out the details field.';
      
        if ((patternCheck.test(details) && patternCheck2.test(details)) && isSummaryValid && isTitleValid && isDetailsValid && validTags) {
          const isPatternValid = this.checkPattern(details);
          return isPatternValid;
        }
      
        return isTitleValid && isSummaryValid && isDetailsValid && validTags;
      }
      
    
      checkPattern = (text) => {
        const validPattern = /\[[^\]]+\]\(https?:\/\/[^\s)]+\)/;
    
        if (validPattern.test(text)) {
          document.getElementById("box2").innerHTML = "";
          return true;
        }
        document.getElementById("box2").innerHTML = "The pattern in the text field is missing 'http://' or 'https://'. Please fix it.";
        return false;
      }

    
    fetchQuestionData = (questionId) => {
        axios.get(`http://localhost:8000/getQuestionByIdUpdate?questionId=${questionId}`)
          .then((response) => {
            const questionData = response.data;
            ////console.log('Question Data:', questionData);
            this.setState({
              questionId: questionData._id,
              questionTitle: questionData.title,
              questionText: questionData.text,
              questionSummary: questionData.qsummary,
              questionTags: questionData.tags,
            }, () => {
              ////console.log('Component State:', this.state);
            });
          })
          .catch((error) => {
            console.error('Error fetching question data:', error);
          });
      };
      
    
    // Add your checkInput and checkPattern functions from NewQuestion
    
    updateQuestion = () => {
        // //console.log('Updating question...');

        if (this.checkInput()) {
            
          const { questionId, questionTitle, questionSummary, questionText, questionTags } = this.state;
          const tagsArray = questionTags.map(tag => tag.name); // Extract tag names
    
          const replacedQuestionText = questionText.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank">$1</a>'
    );
          const updateValues = {
            title: questionTitle,
            summary: questionSummary,
            text: replacedQuestionText,
            tags: tagsArray,
          };
    
          axios.put(`http://localhost:8000/updateQuestion/${questionId}`, updateValues, { withCredentials: true })
            .then((response) => {
              //console.log(response.data); 
                this.props.userInfoDisplayer()
            })
            .catch((error) => {
              console.error('Error updating question:', error);
            });
        }  //console.log('Update completed.');

    };

    deleteQuestion = () => {
        const { questionId } = this.state;
    
        
        axios.delete(`http://localhost:8000/deleteQuestion/${questionId}`, { withCredentials: true })
          .then((response) => {
            //console.log(response.data); 
            this.props.userInfoDisplayer()
          })
          .catch((error) => {
            console.error('Error deleting question:', error);
          });
    };
    


    render() {
        let content;
    
        if (this.state.userVerified) {
            content = (
                <div>
                    <div style={{ margin: '5% auto', width: '60%', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h1><center>&nbsp;&nbsp;Modify Question</center></h1>
                            <button id="cancelButton" style={{ backgroundColor: '#e74c3c', color: '#fff', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => this.props.backtoUser()}>Cancel</button>
                        </div>
    
                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
                            {/* Question Title */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontWeight: '1000'}} htmlFor="questionTitle">
                                    &nbsp;&nbsp;Question Title<span id="titleRequired" style={{ color: 'red' }}>*</span>
                                </label>
                                <p style={{ fontSize: '14px', color: '#555' }}>&nbsp;&nbsp;Limited to 100 characters or less.</p>
                                <input
                                    type="text"
                                    id="questionTitle"
                                    placeholder="Insert question and/or a brief description."
                                    maxLength="100"
                                    required
                                    style={{ width: '95%', padding: '12px', border: 'none', boxSizing: 'border-box' }}
                                    value={this.state.questionTitle} // Set the value based on the state
                                    onChange={(event) => {
                                        this.setState({ questionTitle: event.target.value });
                                        this.checkInput();
                                    }}
                                />
                                
                                <div id="box1" style={{ color: 'red' }}></div>
                            </div>

                            {/* Question Summary */}
                        <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontWeight: '1000'}} htmlFor="questionSummary">
                            &nbsp;&nbsp;Question Summary<span id="summaryRequired" style={{ color: 'red' }}>*</span>
                        </label>
                        <p style={{ fontSize: '14px', color: '#555' }}>&nbsp;&nbsp;Limited to 140 characters or less.</p>
                        <input
                            type="text"
                            id="questionSummary"
                            placeholder="Insert question summary."
                            maxLength="140"
                            required
                            style={{ width: '95%', padding: '12px', border: 'none', boxSizing: 'border-box' }}
                            value={this.state.questionSummary}
                            onChange={(event) => {
                            this.setState({ questionSummary: event.target.value });
                            this.checkInput();
                            }}
                        />
                        <div id="summaryBox" style={{ color: 'red' }}></div>
                        </div>

    
                            {/* Question Details */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontWeight: '1000'}} htmlFor="questionText">
                                    &nbsp;&nbsp;Question Description<span id="textRequired" style={{ color: 'red' }}>*</span>
                                </label>
                                <p style={{ fontSize: '14px', color: '#555' }}>&nbsp;&nbsp;Add details.</p>
                                <textarea
                                    id="questionText"
                                    placeholder="Insert a detailed description of your question."
                                    style={{ width: '95%', padding: '12px', border: 'none', resize: 'vertical', minHeight: '200px', boxSizing: 'border-box' }}
                                    required
                                    value={this.state.questionText}
                                    onChange={(event) => {
                                        this.setState({ questionText: event.target.value });
                                        this.checkInput();
                                    }}
                                />
                                <div id="box2" style={{ color: 'red' }}></div>
                                <div id="box5" style={{ color: 'red' }}></div>
                            </div>
    
                            {/* Question Tags */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontWeight: '1000'}} htmlFor="questionTags">
                                    &nbsp;&nbsp;Question Tags<span id="tagsRequired" style={{ color: 'red' }}>*</span>
                                </label>
                                <p style={{ fontSize: '14px', color: '#555' }}>&nbsp;&nbsp;Enter tags separated by white space.</p>
                                <input
                                    id="questionTags"
                                    type="text"
                                    placeholder="Add Tags"
                                    required
                                    style={{ width: '95%', padding: '12px', border: 'none', boxSizing: 'border-box' }}
                                    value={this.state.questionTags.map(tag => tag.name).join(' ')} // Use map to get tag names
                                    onChange={(event) => {
                                        // Keep the state as an array of tag objects
                                        const tagsArray = event.target.value.split(' ').map(tagName => ({ name: tagName }));

                                        this.setState({ questionTags: tagsArray });
                                        this.checkInput();
                                    }}
                                />
                                <div id="box3" style={{ color: 'red' }}></div>
                            </div>
                        </div>
    
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                <button
                                    style={{ backgroundColor: '#55a1ff', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                                    id="modifyButton"
                                    onClick={this.updateQuestion}
                                >
                                    Modify Question
                                </button>
                                <button
                                    style={{ backgroundColor: '#e74c3c', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                                    id="deleteButton"
                                    onClick={this.deleteQuestion}
                                >
                                    Delete Question
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
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

export default ModifyQuestions;