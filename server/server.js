const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const getData = require('./models/getData')
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());

const corsStuff = {
  credentials: true,
  origin: 'http://localhost:3000',
};

async function deleteAllSessions() {
  try {
    const users = await getData.getAllUsers();
    for (const user of users) {
      await getData.deleteSessiononUser(user._id);
    }
  } catch (error) {
  }
}

app.use(cors(corsStuff));
app.use(cookieParser());
const server = app.listen(8000, () => {
  console.log(`Server is running on http://localhost:${8000}`);
});

mongoose
  .connect('mongodb://127.0.0.1:27017/fake_so', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error: ', err);
  });

process.on('SIGINT', () => {
  mongoose.connection.close();
  console.log('Server closed. Database instance disconnected.');
  process.exit(0);
});

module.exports = server;

//--------------------------------------------HTTP REQUESTS---------------------------------------------------------------
app.get('/getAllQuestions', async (req, res) => {
  try {
    const questions = await getData.getAllQuestions();
    res.json({ questions: questions });
  } catch (error) {
    console.error('Error fetching all questions:', error);res.status(500).json({ error: 'Error fetching all questions' });
  }
    
});

app.get('/getAllQuestionsAndCount', async (req, res) => {
  try {
    const questions = await getData.getAllQuestions();
    const questionCount = questions.length;
    res.json({ questions: questions, questionCount: questionCount });
  } catch (error) {
    console.error('Default Question Load Not Possible:', error);
  }
});

app.get('/getActiveQuestionsandCount', async (req, res) => {
  try {
    const questions = await getData.getActiveQuestions();
    const questionCount = questions.length;
    res.json({ questions: questions, questionCount: questionCount });
  } catch (error) {
    console.error('Error retrieving questions and question count:', error);
  }
});

app.get('/getUnansweredQuestionsAndCount', async (req, res) => {
  try {
    const questions = await getData.getUnansweredQuestions();
    const questionCount = questions.length;
    res.json({ questions: questions, questionCount: questionCount });
  } catch (error) {
    console.error('Error retrieving questions and question count:', error);
  }
});

app.get('/getQuestionById', async (req, res) => {
  try {
    const questionId = req.query.questionId;
    if (!questionId) {
      return null;
    }
    else {
      const question = await getData.getQuestionById(questionId);
      res.send(question);
    }
  } catch (error) {
    console.error('Error retrieving question by ID:', error);
  }
});

app.get('/getQuestionByIdUpdate', async (req, res) => {
  try {
    const questionId = req.query.questionId;
    if (!questionId) {
      return null;
    }
    else {
      const question = await getData.getQuestionByIdUpdate(questionId);
      // //console.log(question);
      res.send(question);
    }
  } catch (error) {
    console.error('Error retrieving question by ID:', error);
  }
});


//--------------------------------------------POST QUESTION---------------------------------------------------------------
app.post('/postQuestion', async (req, res) => {
  try {
    const user = await getData.findSession(req.cookies.fake_so_securesessionval);
    const tagQueried = await getData.newQuestionTagCheck(req.body.tags, user.userrep);
    await getData.createQuestion(req.body.title, req.body.summary, req.body.text, tagQueried, req.cookies.fake_so_securesessionval, req.cookies.values_88242);
    res.send("Success");
  } catch (error) {
    console.error('Error posting question:', error);
  }
});


//--------------------------------------------POST ANSWER-----------------------------------------------------------------
app.post('/postAnswer', async (req, res) => {
  try {
    const { questionId, text } = req.body;
    await getData.addAnswer(questionId, text, req.cookies.fake_so_securesessionval, req.cookies.values_88242);
    res.send("Success");
  } catch (error) {
    console.error('Error posting answer:', error);
  }
});

//--------------------------------- Get All Tags------

app.get('/getAllTags', async (req, res) => {
  try {
    const tags = await getData.getAllTags();
    const sender = tags.map(tag => ({
      name: tag.name,
      id: tag._id,
      count: tag.count,
    }));
    // //console.log(sender);
    res.json(sender);
  } catch (error) {
    console.error('Error retrieving tags:', error);
  }
});

//----------------------Get Tags by Question
app.get('/getQuestionsByTag', async (req, res) => {
  try {
    const tagId = req.query.tidSearch;
    // //console.log("asdf", tagId);
    const questions = await getData.getQuestionsByTag(tagId);
    const length = questions.length;
    // //console.log(questions);
    res.json({ questions: questions, questionCount: length });
  } catch (error) {
    console.error('Error retrieving questions by tag:', error);
  }
});

app.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.q;
    const searchResults = await getData.searchData(searchQuery);
    res.json({
      searchResults: searchResults,
      questionCount: searchResults.length,
    });
  } catch (error) {
    console.error('Error during search:', error);
    console.error('Error performing search:', error);
  }
});


app.post('/newRegister', async (req, res) => {
  try {
    const result = await getData.newRegister(req.body.username, req.body.email, req.body.password);
    if (result.status === 200) {
      res.send({ validityCheck: 200 });
    } else if (result.status === 400) {
      res.send({ validityCheck: 400 });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.send({ status: 400 });
  }
});

app.post('/LoginCredentials', async (req, res) => {
  try {
    const result = await getData.loginAttempt(req.body.email, req.body.password);
     console.log(result);
    if (result.status === 200) {
      const session = await getData.generateSession(req.body.email);
      res.cookie('fake_so_securesessionval', session.sessionHash, {
        httpOnly: true,
        secure: true,
        maxAge: 10800000,
    });
    
    res.cookie('values_88242', session.userHashed, {
        httpOnly: true,
        secure: true,
        maxAge: 10800000,
    });      

      res.send({ validityCheck: 200 });

    } else if (result.status === 400) {
      res.send({ validityCheck: 400, error: 'Incorrect email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.send({ validityCheck: 400, error: 'Internal server error' });
  }
});


app.get('/Guest', async (req, res) => {
  try {
    // res.cookie('SessionKey', 'nokey');
    res.cookie('fake_so_securesessionval', 'undefined', {
      httpOnly: true,
      secure: true,
      maxAge: threeHours,
    });

    res.cookie('values_88242', 'undefined', {
      httpOnly: true,
      secure: true,
      maxAge: threeHours,
  });
  
    res.send({ validityCheck: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Question and Answer Reputation Update:

app.post('/AnswerUpvote', async (req, res) => {
  try {
    const userData = await getData.findSession(req.cookies.fake_so_securesessionval);
    if (userData.userrep >= 50) {
      await getData.AnswerUpvote(req.body.id, userData);
      res.send(userData);
    } else {
      throw new Error("User reputation is less than 50.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post('/AnswerDownVote', async (req, res) => {
  try {
    const userData = await getData.findSession(req.cookies.fake_so_securesessionval);
    if (userData.userrep >= 50) {
      await getData.AnswerDownVote(req.body.id, userData);
      res.send(userData);
    } else {
      throw new Error("User reputation is less than 50.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post('/QuestionUpvote', async (req, res) => {
  try {
    const userData = await getData.findSession(req.cookies.fake_so_securesessionval);
    console.log(userData);
    if (userData.userrep >= 50) {
      await getData.QuestionUpvote(req.body.id);
      res.send(userData);
    } else {
      console.log("Throwing new error");
      throw new Error("User reputation is less than 50.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post('/QuestionDownvote', async (req, res) => {
  try {
    const userData = await getData.findSession(req.cookies.fake_so_securesessionval);
    if (userData.userrep >= 50) {
      await getData.QuestionDownvote(req.body.id);
      res.send(userData);
    } else {
      console.log("Throwing new error");
      throw new Error("User reputation is less than 50.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


app.post('/CommmentUpvote', async (req, res) => {
  try {
    const userData = await getData.findSession(req.cookies.fake_so_securesessionval);
    let response;
    if(userData){
      if(req.body.passValue === 0){
        await getData.commentUpvote(req.body.answerId, req.body.commentId);
        }
        else if(req.body.passValue === 1){
         await getData.commentUpvoteQ(req.body.answerId, req.body.commentId);
        }
    }
    res.send(response)
  } catch (error) {
    throw error;
  }
});

//Add Comments to Question or Answer
app.post('/AddCommentToAnswer', async (req, res) => {
  try {
    const user = await getData.findSession(req.cookies.fake_so_securesessionval);
    if(user.userrep >= 50){
      await getData.addCommentToAnswer(req.body.id, req.body.comment, user.username);
    }

  } catch (error) {
    throw error;
  }
});
app.post('/AddCommentToQuestion', async (req, res) => {
  try {
    const user = await getData.findSession(req.cookies.fake_so_securesessionval);
    if(user.userrep >= 50){
      await getData.addCommentToQuestion(req.body.id, req.body.comment, user.username);
    }
  } catch (error) {
    throw error;
  }
});

app.get('/UserDisplay', async (req, res) => {
  try {
    const userData = await getData.findSession(req.cookies.fake_so_securesessionval);
    res.send(userData);

  } catch (error) {
    res.send({username: 'null'});
  }
});

app.get('/SendUser', async(req, res) => {
  try{
    const userData = await getData.findSession(req.cookies.fake_so_securesessionval);
    res.send(userData);
  }
  catch(error){
    res.send({validated: false});
  }
});

app.get('/CheckSession', async(req, res) => {
  try{
    const userData = await getData.findSession(req.cookies.fake_so_securesessionval);
    res.send({validated: true, user: userData});
  }
  catch(error){
    res.send({validated: false});
  }
});

app.post('/LogoutProcess', async (req, res) => {
  try {
    if(req.cookies.fake_so_securesessionval !== "undefined"){
        const user = await getData.findSession(req.cookies.fake_so_securesessionval);
        await getData.deleteSessiononUser(user);
        res.cookie('fake_so_securesessionval', 'undefined', { httpOnly: true, secure: true });   
        res.cookie('values_88242', 'undefined', { httpOnly: true, secure: true });   
        res.send({ status: 200 });  
      }
      else{
        res.send({ status: 200 });
      }
  } catch (error) {
      console.error(error);
      res.send({ status: 400 });
  }
});

//-----------------------------------------QUESTION BY USER----------------------------------------------------------

app.get('/questionsByUser/:username', async (req, res) => {
  try {
    // //console.log("inside");
    const userQuestions = await getData.getQuestionByUser(req.params.username);
    // //console.log(userQuestions);
    res.json(userQuestions);
  } catch (error) {
    console.error('Error fetching user questions:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//-----------------------------------------ANSWER BY USER----------------------------------------------------------

app.post('/getAnsweredQuestionsByUser', async (req, res) => {
  try {
    const userCheck1 = await getData.findSession(req.cookies.fake_so_securesessionval);
    const userCheck2 = await getData.findUserForAdmin(req.body.id);
      if ((userCheck1.id === userCheck2.id) || userCheck1.usertype === "Adminstrator") {
      const username = userCheck2.username;

      const answeredQuestions = await getData.getAnsweredQuestionsByUser(username);


      res.json(answeredQuestions );
    } else {
     
      res.status(401).json({ error: 'Unauthorized: Invalid session or user not authenticated' });
    }
  } catch (error) {
    console.error('Error fetching answered questions by user:', error);
    res.status(500).json({ error: 'Error fetching answered questions by user' });
  }
});
//-----------------------------------------TAG BY USER---------------------------------------------------------

app.get('/getTagsByUser', async (req, res) => {
  try {
    const userData = await getData.findSession(req.cookies.fake_so_securesessionval);
    if (userData) {

      if ((userData.usertype === "Adminstrator") || (userData.id === req.query.id)) {
        const loggedInUsername = await getData.findUserForAdmin(req.query.id);
        const userTags = await getData.getTagsByUser(loggedInUsername.username);
        res.json({ userTags });
      } else {
        res.status(401).json({ error: 'Unauthorized: Insufficient privileges' });
      }
    } else {
      res.status(401).json({ error: 'Unauthorized: Invalid session or user not authenticated' });
    }
  } catch (error) {
    console.error('Error fetching user tags:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//-----------------------------------------DELETE QUESTION----------------------------------------------------------

app.delete('/deleteQuestion/:questionId', async (req, res) => {
  try {
    const userData = await getData.findSession(req.cookies.fake_so_securesessionval);
    
    if(userData){
      const questionId = req.params.questionId;
      const result = await getData.deleteQuestion(questionId);
    res.send(result);
    }
    else{
      console.error('Error', error);
    }
  } catch (error) {
    console.error('Error deleting question:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//--------------------------------------------UPDATE QUESTION---------------------------------------------------------------
app.put('/updateQuestion/:questionId', async (req, res) => {
  try {

    const findUser =  await getData.findSession(req.cookies.fake_so_securesessionval);
    if(findUser){     
      const { title, text, tags, summary} = req.body;
      const questionId = req.params.questionId;
      const findUser =  await getData.findSession(req.cookies.fake_so_securesessionval);
      const result = await getData.updateQuestion(questionId, title, summary, text, tags, findUser.userrep);
      res.send(result);
    }

  } catch (error) {
    console.error('Error updating question:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//--------------------------------------------GET ALL USERS---------------------------------------------------------------

app.get('/getAllUsers', async (req, res) => {
  try {
      const findUser = await getData.findSession(req.cookies.fake_so_securesessionval);

      if(findUser.userrep = 'Adminstrator'){
        const users = await getData.getAllUsers();
        res.json({ users: users });
      }
      else{
        console.error('Error fetching all users:', error);
      }
  } catch (error) {
      console.error('Error fetching all users:', error);
      res.status(500).json({ error: 'Error fetching all users' });
  }
});



app.get('/getCurrentUserData', async (req, res) => {
  try {
      const sessionID = req.cookies.fake_so_securesessionval;
      const currentUser = await getData.findSession(sessionID);

      if (!currentUser) {
          return res.status(401).json({ error: 'Unauthorized' });
      }

      const userData = {
          username: currentUser.username,
          email: currentUser.email,
          usertype: currentUser.usertype,
      };

      res.json(userData);
  } catch (error) {
      console.error('Error fetching current user data:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getAnswerTextById/:answerId', async (req, res) => {
  try {
    const answerId = req.params.answerId;
    const answerText = await getData.getAnswerTextById(answerId);
    if (answerText) {
      res.json({ answerText });
    } else {
      res.status(404).json({ error: 'Answer not found' });
    }
  } catch (error) {
    console.error('Error fetching answer text by ID:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//---------------------------------------
app.post('/updateAnswer', async (req, res) => {
  try {
    const result = await getData.updateAnswer(req.body.answerID, req.body.text);
    res.send(result);

  } catch (error) {
    console.error('Error updating question:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//---------------------------------------
app.post('/deleteAnswer', async (req, res) => {
  try {
    const result = await getData.deleteAnswer(req.body.answerID);
    res.send(result);
  } catch (error) {
    console.error('Error updating question:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//---------------------------------------------Delete User---------------------------------------------
app.delete('/deleteUser/:userId', async (req, res) => {
  try {
    const sessionID = req.cookies.fake_so_securesessionval;
    const currentUser = await getData.findSession(sessionID)

    if ((currentUser && currentUser.usertype === 'Adminstrator') && (currentUser._id.toString() !== req.params.userId)) {
      const result = await getData.deleteUser(req.params.userId, currentUser);
      res.send(result);  
    } else {
      res.status(403).json({ error: 'Forbidden' }); 
    }
  } catch (error) {
    console.error('Error updating question:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//---------------------------------------------USER DATA---------------------------------------------

app.get('/getUserData', async (req, res) => {  
  try{
    const sessionID = req.cookies.fake_so_securesessionval;
    const currentUser = await getData.findSession(sessionID);
      
    if(currentUser && currentUser.usertype == "Adminstrator"){
      const userId = req.query.userId;
      const userData = await getData.findUserForAdmin(userId);
      //console.log(userData);
    
      res.json(userData);
    }

  } catch (error){
    console.error(error);
  }
});

//---------------------------------------------DELETE TAG---------------------------------------------

app.delete('/deleteUserTags/:tagId', async (req, res) => {
  try {
    const sessionID = req.cookies.fake_so_securesessionval;
    const currentUser = await getData.findSession(sessionID);
    

    if (currentUser && (currentUser.usertype == 'Administrator' || currentUser.usertype === 'Standard User')) {
      const tagId = req.params.tagId;

      const result = await getData.deleteUserTags(tagId, currentUser);
      
      res.json(result);
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }

  } catch (error) {
    console.error('Error deleting user tags:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//---------------------------------------------UPDATE TAG---------------------------------------------

app.put('/updateUserTags/:tagId', async (req, res) => {
  try {
    const sessionID = req.cookies.fake_so_securesessionval;
    const currentUser = await getData.findSession(sessionID);

    if (currentUser && (currentUser.usertype == 'Administrator' || currentUser.usertype === 'Standard User')) {
      const { tagId } = req.params;
      const { name } = req.body;

      //console.log('Received request to update tag. Tag ID:', tagId, 'New Name:', name);

      const result = await getData.updateUserTags(tagId, name, currentUser);

      if (result.success) {
        res.json(result);
      } else {
        
        res.status(404).json(result);
      }
    } else {
      console.error('Unauthorized access to update tag');
      res.status(403).json({ error: 'Forbidden' });
    }
  } catch (error) {
    console.error('Error updating user tags:', error.message);
    res.status(500).json({ error: 'Internal Service Error' });
  }
});