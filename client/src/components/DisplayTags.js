import React from 'react';
import axios from 'axios';
import { checkUser } from './QuestionandAnswerComponents';

class DisplayTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tagsWithCount: [],
      userVerified: false,
    };
  }

  userCheck = async () => {
    try {
      const validated = await checkUser();
      this.setState({ userVerified: validated });
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  componentDidMount() {
    this.userCheck();
    setTimeout(() => {
      axios.get('http://localhost:8000/getAllTags')
        .then((res) => {this.setState({tagsWithCount: res.data});})
        .catch((error) => {
          console.error('Error retrieving tags and questions count:', error);
        });
    }, 100);
  }

  render() {
    return (
      <div id='top-panel'>
        <div className='right-panel1'>
          <h1>{this.state.tagsWithCount.length} Tag(s)</h1>
          <h1>All Tags</h1>
          {this.state.userVerified && (<button className="ask-q" onClick={() => this.props.newQ()}>New Question</button>)}
          {!this.state.userVerified && (<button style={{ visibility: 'hidden' }} className="ask-q" onClick={() => this.props.newQ()}>Ask A Question</button>)}
        </div>
        <div className='tag-container' id='displayTags'>
          {this.state.tagsWithCount.map((tag, index) => (
            <div className="tag-box" key={index}>
              <a href="/#" onClick={() => this.props.handleTagSpecificDisplay(tag.id)}>{tag.name}</a>
              <br />
              {tag.count} question(s)
            </div>
          ))}
        </div>
      </div>
    );

  }
}
export default DisplayTag;