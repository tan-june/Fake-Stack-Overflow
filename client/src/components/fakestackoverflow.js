import React from "react";
import DefaultPage from "./DefaultPage";
import NewQuestion from "./NewQuestion";
import DisplayAnswer from "./DisplayAnswer";
import DisplayQofTag from "./DisplayQofTag";
import Search from "./Search";
import NewAnswer from "./NewAnswer";
import NewLoad from "./NewLoad";
import userImage from "../images/userImage.png";
import UserDisplay from "./UserDisplay";
import ModifyQuestions from "./ModifyQuestions";
import UserAnswers from "./UserAnswers";
import UserTags from "./UserTags";
import DisplayUserAnswer from "./DisplayUserAnswer"
import AdminViewofUser from "./AdminViewofUser";
import ModifyAnswers from "./ModifyAnswers";
import logoutbutton from "../images/logout_button.png";
import homeButton from "../images/home.png";
import DisplayTags from "./DisplayTags"
import axios from "axios";
import { checkUser } from "./QuestionandAnswerComponents";

class FakeStackOverflow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qidforDisplay: "",
      searchQuery: "",
      tidSearch: "",
      usertoDisplayAdmin: '',
      defaultPageKey: 1,
      activeComponent: "newLoad",
      userVerified: false,
      usertoDisplay: '',
    };
  }

  componentDidMount() {
    setTimeout(() => {
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
 

  setShowTags = () => {
    this.setState({
      activeComponent: "displayTag",
    });
  };

  defaultLoad = () => {
    this.setState({
      activeComponent: "defaultPage",
    });
  };

  newQuestion = () => {
    this.setState({
      activeComponent: "newQuestion",
    });
  };

  adminView = () => {
    this.setState({
      activeComponent: "adminViewofUser",
    });
  };

  answerQuestion = (qid) => {
    this.setState({
      qidforDisplay: qid,
      activeComponent: "newAnswer",
    });
  };

  displayAnswer = (qid) => {
    this.setState({
      qidforDisplay: qid,
      activeComponent: "displayAnswer",
    });
  };

  displayUserAnswers = (user_id) => {
    this.setState({
      usertoDisplayAdmin: user_id,
      activeComponent: "userAnswers",
    });
  };

  displayUserTags = (user_id) => {
    this.setState({
      usertoDisplayAdmin: user_id,
      activeComponent: "userTags",
    });
  };

  displayUser = () => {
    this.setState({
      activeComponent: "userDisplay",
    });
  };

  displayUserAnswer = (qid) => {
    this.setState({
      activeComponent: "userAnswerToQ",
      qidforDisplay: qid,
    });
  };

  newLoader = () => {
    this.setState({
      activeComponent: "newLoad",
    });
  };

  modifyQ = (qid) => {
    this.setState({
      activeComponent: "modifyQuestions",
      qidforDisplay: qid,
    });
  };

  modifyA = (qid) => {
    this.setState({
      activeComponent: "modifyAnswers",
      qidforDisplay: qid,
    });
  }

  initiateLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/LogoutProcess",
        {},
        { withCredentials: true },
      );
      this.newLoader();
    } catch (error) {
      window.alert("Logout Unsuccessful! Please try again!");
      console.error(error);
    }
  };

  handleTagSpecificDisplay = (tid) => {
    this.setState({
      tidSearch: tid,
      activeComponent: "displayQofTag",
    });
  };

  handleSearchChange = (event) => {
    this.setState({
      searchQuery: event.target.value,
    });
  };

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      this.setState({
        activeComponent: "search",
      });
    }
  };

  colorChange = (buttonID) => {
    const currentButton = document.getElementById(buttonID);
    if (currentButton) {
      currentButton.classList.remove("blue");
      currentButton.classList.add("grey");

      const otherButtonID = buttonID === "homePage" ? "tagsButton" : "homePage";
      const otherButton = document.getElementById(otherButtonID);

      if (otherButton) {
        otherButton.classList.remove("grey");
        otherButton.classList.add("blue");
      }
    }
  };

  handleUsernameClick = (id) => {
    this.setState({
      usertoDisplay: id,
      activeComponent: 'adminUserKeyer'
    })
  }

  render() {
    const componentMap = {
      newLoad: <NewLoad defaultLoad={this.defaultLoad} />,
      displayTag: (
        <DisplayTags
          handleTagSpecificDisplay={this.handleTagSpecificDisplay}
          newQ={this.newQuestion}
        />
      ),
      displayQofTag: (
        <DisplayQofTag
          tidSearch={this.state.tidSearch}
          displayA={this.displayAnswer}
          newQ={this.newQuestion}
        />
      ),
      newQuestion: (
        <NewQuestion
          defaultLoad={this.defaultLoad}
          qid={this.state.qidforDisplay}
        />
      ),
      defaultPage: (
        <DefaultPage displayA={this.displayAnswer} newQ={this.newQuestion} />
      ),
      displayAnswer: (
        <DisplayAnswer
          displayA={this.displayAnswer}
          defaultLoad={this.defaultLoad}
          newQ={this.newQuestion}
          qid={this.state.qidforDisplay}
          answerQuestion={this.answerQuestion}
        />
      ),
      newAnswer: (
        <NewAnswer
          defaultLoad={this.defaultLoad}
          questionID={this.state.qidforDisplay}
          displayA={this.displayAnswer}
        />
      ),
      userDisplay: (
        <UserDisplay
          modifyQ={this.modifyQ}
          userInfoDisplayer={this.displayUser}
          showUserAnswers={this.displayUserAnswers}
          showUserTags={this.displayUserTags}
          changetoAdmin={this.adminView}
          keySwitch={null}
        />
      ),
      userAnswers: (
        <UserAnswers
          displayA={this.displayAnswer}
          userID={this.state.usertoDisplayAdmin}
          DisplayUserA={this.displayUserAnswer}
        />
      ),
      modifyQuestions: (
        <ModifyQuestions
          modifyQ={this.modifyQ}
          questionId={this.state.qidforDisplay}
          userInfoDisplayer={this.displayUser}
          backtoUser={this.displayUser}
        />
      ),
      adminUserKeyer: (
        <UserDisplay
          modifyQ={this.modifyQ}
          userInfoDisplayer={this.displayUser}
          showUserAnswers={this.displayUserAnswers}
          showUserTags={this.displayUserTags}
          backtoUser={this.displayUser}
          keySwitch={"AdminView"}
          usertoShow={this.state.usertoDisplay}
        />
      ),
      modifyAnswers: (
        <ModifyAnswers
          modifyA={this.modifyA}
          questionId={this.state.qidforDisplay}
          DisplayUserA={this.DisplayUserA}
          backtoUser={this.displayUser}
        />
      ),
      userAnswerToQ: (
        <DisplayUserAnswer
          DisplayUserA={this.DisplayUserA}
          newQ={this.newQuestion}
          qid={this.state.qidforDisplay}
          answerQuestion={this.answerQuestion}
          modifyA={this.modifyA}
        />
      ),
      adminViewofUser: <AdminViewofUser
        handleUsernameClick={this.handleUsernameClick}
      />,
      userTags: <UserTags
        userID={this.state.usertoDisplayAdmin}
        displayUserTags={this.displayUserTags}
      />,
      search: (
        <Search
          displayA={this.displayAnswer}
          searchQuery={this.state.searchQuery}
          newQ={this.newQuestion}
          handleSearchChange={this.handleSearchChange}
          handleTagSpecificDisplay={this.handleTagSpecificDisplay}
          newestLoad={this.newestLoad}
          activeMode={this.activeMode}
          getUnanswered={this.getUnanswered}
        />
      ),
    };

    let content =
      componentMap[this.state.activeComponent] || componentMap["newLoad"];

    if (this.state.activeComponent === "newLoad") {
      return <div>{content}</div>;
    } else {
      return (
        <div id="outer" className="outer">
          <div id="header" className="header">
            <div className="navbar">
              <div className="logo">
                <img src="logo512.png" alt="Logo" width="60" />
              </div>
              <div className="title">
                <a href="/#" className="title-text">
                  <h1>Fake Stack Overflow</h1>
                </a>
              </div>
              <div className="spacer"></div>
              <div className="search-bar" style={{ marginRight: "10px" }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={this.state.searchQuery}
                  onChange={this.handleSearchChange}
                  onKeyDown={this.handleKeyPress}
                />
              </div>
              <div className="user-actions">
                <a href="#/" onClick={this.defaultLoad}>
                  <img
                    alt="HomeButton"
                    style={{ marginRight: "10px", width: "45px" }}
                    src={homeButton}
                  />
                </a>
                <a href="#/" onClick={this.displayUser}>
                  <img
                    alt="Manage Account"
                    style={{ marginRight: "10px", width: "45px" }}
                    src={userImage}
                  />
                </a>
                <a href="#/" onClick={this.initiateLogout}>
                  <img
                    alt="Manage Account"
                    style={{ width: "45px" }}
                    src={logoutbutton}
                  />
                </a>
              </div>
            </div>
            <div id="main" className="main">
              <div className="left-panel">
                <center>
                  <div>
                    <button
                      className="left-panel-buttons grey" onClick={() => { this.defaultLoad(); this.colorChange("homePage"); }}
                      id="homePage"
                    >
                      Questions
                    </button>
                    <br />
                    <br />
                    <button
                      className="left-panel-buttons blue"
                      onClick={() => {
                        this.setShowTags();
                        this.colorChange("tagsButton");
                      }}
                      id="tagsButton"
                    >
                      Tags
                    </button>
                  </div>
                </center>
              </div>
              <div className="right-panel" id="top-panel">
                {content}
                <br /><br /><br /><br />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default FakeStackOverflow;