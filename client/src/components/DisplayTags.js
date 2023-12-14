import React from 'react';
import axios from 'axios';
import sadface from "../images/sad.png";


class DisplayTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tagsWithCount: [],
      userVerified: false,
      isServerNull: false,
    };
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

  componentDidMount() {
    this.serverCheck();
    this.userCheck();
  
    setTimeout(() => {
      axios.get('http://localhost:8000/getAllTags')
        .then((res) => {
          this.setState({
            tagsWithCount: res.data,
          });
          // //console.log(this.state.tagsWithCount);
        })
        .catch((error) => {
          console.error('Error retrieving tags and questions count:', error);
        });
    }, 100);
  }
  

  getTags() {
    return this.state.tagsWithCount.map((tag, index) => (
      <div className="tag-box" key={index}>
        <a href="/#" onClick={() => this.props.handleTagSpecificDisplay(tag.id)}>{tag.name}</a>
        <br />
        {tag.count} question(s)
      </div>
    ));
  }

  render() {
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
      <div id='top-panel'>
        <div className='right-panel1'>
          <h1>{this.state.tagsWithCount.length} Tag(s)</h1>
          <h1>All Tags</h1>
          {this.state.userVerified && (<button className="ask-q" onClick={() => this.props.newQ()}>New Question</button>)}
          {!this.state.userVerified && (<button style={{visibility:'hidden'}}className="ask-q" onClick={() => this.props.newQ()}>Ask A Question</button>)}
        </div>
        <div className='tag-container' id='displayTags'>
          {this.getTags()}
        </div>
      </div>
    );
  }
}
}

export default DisplayTag;