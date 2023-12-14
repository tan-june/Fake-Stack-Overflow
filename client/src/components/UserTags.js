import React from 'react';
import axios from 'axios';
import sadface from "../images/sad.png";


class UserTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tagsWithCount: [],
      userVerified: false,
      isServerNull: false,
      modifiedTagName:'',
      inputValue: '',
    };
  }

  serverCheck = () => {
    axios
      .get('http://localhost:8000/show', { withCredentials: true })
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
    this.getUserTags();
    // this.getUserData();

    axios.get(`http://localhost:8000/getTagsByUser?id=${this.props.userID}`, { withCredentials: true })
    .then((res) => {
      //console.log('Received data from the server:', res.data);
  
      this.setState({
        tagsWithCount: res.data.userTags,
      });
    })
    .catch((error) => {
      console.error('Error retrieving tags and questions count:', error);
    });
  

  }
  getUserTags() {
    axios
      .get(`http://localhost:8000/getTagsByUser?id=${this.props.userID}`, { withCredentials: true })
      .then((res) => {
        this.setState({
          tagsWithCount: res.data.userTags,
        });
      })
      .catch((error) => {
        console.error('Error retrieving tags and questions count:', error);
      });
  }

  handleDeleteTag(tag) {
    //console.log('Deleting tag:', tag);
    axios
      .delete(`http://localhost:8000/deleteUserTags/${tag._id}`, { withCredentials: true })
      .then((res) => {
        //console.log('Tag deleted successfully:', res.data.UserTags);
        this.getUserTags();
      })
      .catch((error) => {
        console.error('Error deleting tag:', error);
        window.alert('Failed to delete tag name. You are not the only user using this tag.');
      });
  }


  handleModifyTag(tag) {
    this.setState({ inputValue: tag.name, modifiedTagName: tag.name });
  }

  handleInputChange(e) {
    this.setState({ inputValue: e.target.value });
  }

 
  handleSaveClick(tag) {
    const { inputValue } = this.state;
  
    //console.log('Input value before sending request:', inputValue);
  
    axios
      .put(`http://localhost:8000/updateUserTags/${tag._id}`, { name: inputValue }, { withCredentials: true })
      .then((res) => {
        //console.log('Tag name updated successfully:', res.data.UserTags);
        this.getUserTags();
      })
      .catch((error) => {
        console.error('Error updating tag name:', error);
        window.alert('Failed to update tag name. You are not the only user using this tag.');
      })
      .finally(() => {

        this.setState({ modifiedTagName: '', inputValue: '' });
      });
  }


  getTags() {
    const { tagsWithCount} = this.state;

    if (tagsWithCount.length === 0) {
      return <p>No tags have been used yet!</p>;
    }

    return this.state.tagsWithCount.map((tag, index) => (
      // console.log()
      
      <div className="tag-box" key={index}>
        {this.state.modifiedTagName === tag.name ? (
          <div>
            <input
              type="text"
              value={this.state.inputValue}
              onChange={(e) => this.handleInputChange(e)}
            />
            <br />
            <button
              className="save-button"
              style={{ backgroundColor: '#55a1ff', marginTop: '10px', marginLeft: '10px', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              onClick={() => this.handleSaveClick(tag)}
            >
              Save
            </button>
            <button
              className="cancel-button"
              style={{ backgroundColor: '#e74c3c', marginLeft: '10px', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              onClick={() => this.setState({ modifiedTagName: '', inputValue: '' })}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
        <u>
        {tag.name}
          </u>
            <br />
            {tag.count} question(s)

            {/* Add modify and delete buttons */}
            {this.state.userVerified && (
              <div>
                <button
                  className="modify-button"
                  style={{ backgroundColor: '#55a1ff', marginTop: '10px', marginLeft: '20px', marginRight: '20px', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  onClick={() => this.handleModifyTag(tag)}
                >
                  Modify
                </button>
                <button
                  className="delete-button"
                  style={{ backgroundColor: '#55a1ff', marginLeft: '20px', marginRight: '20px', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  onClick={() => this.handleDeleteTag(tag)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
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
          <h1>{this.state.username} Tags</h1>
          {/* {this.state.userVerified && (<button className="ask-q" onClick={() => this.props.newQ()}>New Question</button>)} */}
          {this.state.userVerified && (<button style={{visibility:'hidden'}}className="ask-q" onClick={() => this.props.newQ()}>Ask A Question</button>)}
        </div>
        <div className='tag-container' id='displayTags'>
          {this.getTags()}
        </div>
      </div>
    );
  }
}
}

export default UserTags;