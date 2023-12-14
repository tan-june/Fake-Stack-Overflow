const mongoose = require('mongoose');
let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let UserSchema = require('./models/UserSchema')
const bcrypt = require('bcrypt');

mongoose
  .connect('mongodb://127.0.0.1:27017/fake_so', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error: ', err);
  });

    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    
    let tags = [];
    let answers = [];
    function tagCreate(name) {
      let tag = new Tag({ name: name });
      return tag.save();
    }
    
    async function userCreate(username, email, password, usertype = 'Standard User', initialReputation = 50) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserSchema({
        username: username,
        email: email,
        password: hashedPassword,
        usertype: usertype,
        userrep: initialReputation
      });
      // console.log(user)
      return await user.save();
    }
        
    function answerCreate(text, ans_by, ans_date_time) {
      answerdetail = {text:text};
      if (ans_by != false) answerdetail.ans_by = ans_by;
      if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
    
      let answer = new Answer(answerdetail);
      return answer.save();
    }
    
    function questionCreate(title, text, tags, answers, asked_by, ask_date_time, views, qsummary) {
      qstndetail = {
        title: title,
        text: text,
        tags: tags,
        asked_by: asked_by,
        qsummary: qsummary
      }
      if (answers != false) qstndetail.answers = answers;
      if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
      if (views != false) qstndetail.views = views;
    
      let qstn = new Question(qstndetail);
      return qstn.save();
    }
    
    const populate = async () => {

        //Admin Login Creation
        const adminUsername = process.argv[2];
        const adminPassword = process.argv[3];
    
        if (!adminUsername || !adminPassword) {
          console.error('Please provide both admin username and password as command line arguments.');
          process.exit(1);
        }

      await userCreate(adminUsername, 'admin@fakeso.com', adminPassword, usertype = 'Adminstrator', 1000)
      await userCreate('admin2', 'admin2@fakeso.com', 'cse316', usertype = 'Adminstrator', 1000)
      await userCreate('admin3', 'admin3@fakeso.com', 'cse316', usertype = 'Adminstrator', 1000)


      await userCreate('testuser', 'testuser@gmail.com', 'cse316', usertype = 'Standard User', 50)
      await userCreate('janeDoe', 'janedoe@gmail.com', 'password123', usertype = 'Standard User', 50);
      await userCreate('johnDoe', 'johndoe@gmail.com', 'pass123', usertype = 'Standard User', 0);

      let t1 = await tagCreate('react');
      let t2 = await tagCreate('javascript');
      let t3 = await tagCreate('android-studio');
      let t4 = await tagCreate('shared-preferences');
      let t5 = await tagCreate('nodejs');
      let t6 = await tagCreate('mongodb');
      let t7 = await tagCreate('express');
    
      let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', 'johnDoe', false);
      let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', 'admin2', false);
      let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', 'admin3', false);
      let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', 'admin3', false);
      let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', 'johnDoe', false);
      let a6 = await answerCreate('Another answer text here.', 'janeDoe', false);
      let a7 = await answerCreate('Yet another answer text.', 'janeDoe', false);
      let a8 = await answerCreate('Additional answer content.', 'janeDoe', false);
      let a9 = await answerCreate('Answer text for the new question.', 'johnDoe', false);
      let a10 = await answerCreate('Another answer for the new question.', 'johnDoe', false);
      let a11 = await answerCreate('In React Router v6, there are significant changes, and the library is more modular. Now, the `useNavigate` hook is used for navigation instead of the `history` object. This simplifies the navigation process and is worth considering for new projects.', 'admin4', false);
      let a12 = await answerCreate('For SharedPreferences in Android Studio, you can use apply() when you don\'t need to know if the operation was successful. If you need a callback when the operation is done, you should use commit().', 'admin2', false);
      let a13 = await answerCreate('In Node.js, you can use the util.promisify() method to convert callback-based functions to promise-based functions. This can make handling asynchronous operations more straightforward.', 'admin3', false);
      let a14 = await answerCreate('Regarding MongoDB indexing, ensure that you are indexing fields used in queries. Additionally, consider using compound indexes for frequently used combinations of fields in queries.', 'admin4', false);
      let a15 = await answerCreate('Express.js provides middleware like helmet for security. Use it to set HTTP headers to secure your application. Also, always validate user input and sanitize data to prevent security vulnerabilities.', 'admin3', false);
      let a16 = await answerCreate('Web development fundamentals include HTML, CSS, and JavaScript. Understanding the Document Object Model (DOM) is crucial for manipulating web pages dynamically.', 'admin4', false);
      let a17 = await answerCreate('When working with React Router, you can use the withRouter higher-order component to access the history object and perform programmatic navigation within your components.', 'johnDoe', false);
      let a18 = await answerCreate('In Android Studio, you can use SharedPreferences to save and retrieve key-value pairs persistently. Make sure to apply proper exception handling when working with SharedPreferences.', 'janeDoe', false);
      let a19 = await answerCreate('For handling asynchronous operations in Node.js, consider using the async/await syntax along with try/catch blocks for error handling. This can make your code more readable and maintainable.', 'admin2', false);
      let a20 = await answerCreate('In MongoDB, indexing can significantly improve query performance. Use the explain() method to analyze query execution and ensure that your indexes are utilized efficiently.', 'janeDoe', false);
      let a21 = await answerCreate('When creating RESTful APIs with Express.js, use the express.Router() middleware to organize your routes. This helps in maintaining a clean and modular code structure.', 'johnDoe', false);

      await questionCreate(
        'Programmatically navigate using React router',
        'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.',
        [t1, t2],
        [a1, a2, a11, a12, a13],
        'testuser',
        false,
        false,
        'React router is acting up.'
      );
    
      await questionCreate(
        'android studio save string shared preference, start activity and load the saved string',
        'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time I switch to a different view. I just hide/show my fragments depending on the icon selected. The problem I am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what I am using to refrain them from being recreated.',
        [t3, t4, t2],
        [a3, a4, a5, a14,a15],
        'testuser',
        false,
        121,
        'Android studio is being a pain in the butt in regards to navigation.'
      );
    
      await questionCreate(
        'How to handle asynchronous operations in Node.js?',
        'I am facing issues with async code in Node.js...',
        [t1, t5],
        [a1, a6, a16],
        'janeDoe',
        false,
        50,
        "I'm trying to use async and await but not working"
      );
    
      await questionCreate(
        'Best practices for MongoDB indexing?',
        'I need recommendations for optimizing MongoDB queries...',
        [t6],
        [a7],
        'janeDoe',
        false,
        75,
        'The DB is extremely slow, trying to work to make it faster.'
        );
    
      await questionCreate(
        'Creating RESTful APIs with Express.js',
        'What are the steps to create a RESTful API using Express.js?',
        [t2, t7],
        [a8],
        'janeDoe',
        false,
        30,
        'Super lost ngl, please help.'
      );
    
      await questionCreate(
        'Securing Node.js applications',
        'What are the best practices for securing Node.js applications?',
        [t5],
        [],
        'johnDoe',
        false,
        60,
        'Trying to secure the application'
      );
    
      await questionCreate(
        'Introduction to Web Development',
        'What are the fundamental concepts of web development?',
        [t2, t5],
        [a9],
        'johnDoe',
        false,
        40,
        'This course was taught by Christopher Kane at Stony Brook.'
      );
    
      await questionCreate(
        'Choosing between React and Angular',
        'What factors should be considered when deciding between React and Angular for a project?',
        [t1, t2],
        [a10],
        'johnDoe',
        false,
        55,
        'React seems like the better option if I am not wrong.'
      );

      await questionCreate(
        'Managing state in React components',
        'What are the best practices for managing state in React components? I often find myself dealing with complex state logic.',
        [t1, t2],
        [a17, a18, a19, a20, a21],
        'testuser',
        false,
        90,
        'State management in React is getting tricky for me.'
      );
    
      if(db) db.close();
    
      console.log('done');
    }
    
    populate()
      .catch((err) => {
        console.log('ERROR: ' + err);
        if(db) db.close();
      });
    
    console.log('processing ...');