import React from 'react';
import axios from 'axios';
import sadface from '../images/sad.png'


class NewQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionTitle: '',
      questionText: '',
      questionTags: '',
      qSummary: '',
      userVerified: false,
      isServerNull: false,
    };
  }

  componentDidMount(){
          
    setTimeout(() => {
      this.serverCheck();
      this.userCheck();
    }, 100);  

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

  postQuestionReCheck = () => {
    if (this.checkInput()) {
      this.postQuestion();
    }
  }

  checkInput = () => {
    const patternCheck = /[[\]()]/;
    const patternCheck2 = /]\(/;

    const title = this.state.questionTitle.trim();
    const qsummary = this.state.qSummary.trim();
    const details = this.state.questionText.trim();
    const tags = this.state.questionTags.trim().split(' ');

    const isTitleValid = title.length > 0;
    const isSummaryValid = qsummary.length > 0;
    const isDetailsValid = details.length > 0;
    const validTags = tags.length <= 5 && tags.every(tag => tag.length > 0 && tag.length <= 10);

    document.getElementById('box1').innerHTML = isTitleValid ? '' : 'Please fill out this field.';
    document.getElementById('qsummarybox').innerHTML = isSummaryValid ? '' : 'Please fill out this field.';
    document.getElementById('box3').innerHTML = validTags ? '' : 'Tags must be up to 5, each up to 10 characters, separated by white space.';
    document.getElementById('box5').innerHTML = isDetailsValid ? '' : 'Please fill out this field.';

    if ((patternCheck.test(details) && patternCheck2.test(details)) && isSummaryValid && isTitleValid && isDetailsValid && validTags) {
      const isPatternValid = this.checkPattern(details);
      return isPatternValid;
    }

    return isTitleValid && isDetailsValid && validTags && isSummaryValid;
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

  postQuestion = () => {
    const questionTitle = this.state.questionTitle.trim();
    const questionText = this.state.questionText.trim();
    const qsummary = this.state.qSummary.trim();
    const questionTags = this.state.questionTags.trim().split(' ');

    const replacedQuestionText = questionText.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank">$1</a>'
    );

    if (questionTitle && qsummary && replacedQuestionText && questionTags) {
      const tagsArray = questionTags.map(tag => tag.toLowerCase());

      const postValues = {
        title: questionTitle,
        summary: qsummary,
        text: replacedQuestionText,
        tags: tagsArray,
      }

      axios.post('http://localhost:8000/postQuestion', postValues, { withCredentials: true });

      this.setState({
        questionTitle: '',
        questionText: '',
        questionTags: '',
        qsummary: '',
      });
      
      this.props.defaultLoad();
    }
  };

  render() {
    let content;

    
    if(this.state.userVerified){
      content = (
        <div>
       <div style={{ margin: '5% auto', width: '60%', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h1><center>&nbsp;&nbsp;Ask Question</center></h1>
    <button id="cancelButton" style={{ backgroundColor: '#e74c3c', color: '#fff', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => this.props.defaultLoad()}>Cancel</button>
  </div>

  <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
    {/* Question Title */}
    <div style={{ marginBottom: '20px' }}>
      <label style={{ fontWeight: '1000'}} htmlFor="questionTitle">
      &nbsp;&nbsp;Question Title<span id="titleRequired" style={{ color: 'red' }}>*</span>
      </label>
      <p style={{ fontSize: '14px', color: '#555' }}>&nbsp;&nbsp;Limited to 50 characters or less.</p>
      <input
        type="text"
        id="questionTitle"
        placeholder="Insert question and/or a brief description."
        maxLength="50"
        required
        style={{ width: '95%', padding: '12px', border: 'none', boxSizing: 'border-box' }}
        value={this.state.questionTitle}
        onChange={(event) => {
          this.setState({ questionTitle: event.target.value });
          this.checkInput();
        }}
      />
      <div id="box1" style={{ color: 'red' }}></div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
    {/* Question Title */}
    <div style={{ marginBottom: '20px' }}>
      <label style={{ fontWeight: '1000'}} htmlFor="questionTitle">
      &nbsp;&nbsp;Question Summary<span id="titleRequired" style={{ color: 'red' }}>*</span>
      </label>
      <p style={{ fontSize: '14px', color: '#555' }}>&nbsp;&nbsp;Limited to 140 characters or less.</p>
      <input
        type="text"
        id="questionTitle"
        placeholder="Insert question summary."
        maxLength="140"
        required
        style={{ width: '95%', padding: '12px', border: 'none', boxSizing: 'border-box' }}
        value={this.state.qSummary}
        onChange={(event) => {
          this.setState({ qSummary: event.target.value });
          this.checkInput();
        }}
      />
      <div id="qsummarybox" style={{ color: 'red' }}></div>
    </div>
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
        value={this.state.questionTags}
        onChange={(event) => {
          this.setState({ questionTags: event.target.value });
          this.checkInput();
        }}
      />
      <div id="box3" style={{ color: 'red' }}></div>
    </div>
  </div>

  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
    <button
      style={{ backgroundColor: '#55a1ff', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      id="postQuestionButton"
      disabled={this.checkInput === true}
      onClick={this.postQuestionReCheck}
    >
      Post Question
    </button>
    <div style={{ color: 'red', fontSize: '14px' }}>* indicates mandatory fields</div>
  </div>
</div>



</div>
  )   

  }
  else if(!this.state.isServerNull){
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
  
  else{
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

  return(
    <div>
      {content}
    </div>
  );


}
}

export default NewQuestion;
