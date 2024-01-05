import React from 'react';
import axios from 'axios';
import {checkUser} from './QuestionandAnswerComponents.js';

class UserTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tagsWithCount: [],
      userVerified: false,
      modifiedTagName:'',
      inputValue: '',
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
    this.getUserTags();

    axios.get(`http://localhost:8000/getTagsByUser?id=${this.props.userID}`, { withCredentials: true })
    .then((res) => {
 
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
    axios
      .delete(`http://localhost:8000/deleteUserTags/${tag._id}`, { withCredentials: true })
      .then((res) => {
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
       return (
      <div id='top-panel'>
        <div className='right-panel1'>
          <h1>{this.state.tagsWithCount.length} Tag(s)</h1>
          <h1>{this.state.username} Tags</h1>
          {this.state.userVerified && (<button style={{visibility:'hidden'}}className="ask-q" onClick={() => this.props.newQ()}>Ask A Question</button>)}
        </div>
        <div className='tag-container' id='displayTags'>
          {this.getTags()}
        </div>
      </div>
    );
}
}

export default UserTags;