```markdown
# Fake Stack OverFlow

## Description

This project involves HTML, CSS, and JavaScript for the front-end, while the back-end is written in JavaScript using Axios to parse HTTP requests and MongoDB for data storage.

## Setup Instructions

1. **Install Dependencies:**

   Run the following command in both the server and client directories:

   ```bash
   cd server
   npm install
   ```
   ```bash
   cd client
   npm install
   ```

2. **Populate Data:**

   Execute the "init.js" script from the parent directory with admin username and password as parameters:

   ```bash
   node server/init.js adminUsername adminPassword
   ```

   *Default admin email is set to:* admin@fake_so.com

3. **Run the following commands in separate terminals:**

   - **Start MongoDB:**

     ```bash
     mongod
     ```

   - **Start the client:**

     ```bash
     cd client
     npm start
     ```

   - **Start the server:**

     ```bash
     cd server
     nodemon server/server.js
     ```

## Additional Information

### Standard Users:

1. Email: 'testuser@gmail.com', Password: 'cse316'
2. Email: 'janedoe@gmail.com', Password: 'password123'
3. Email: 'johndoe@gmail.com', Password: 'pass123' *(This user has 0 reputation)*

### Additional Admin Users:

1. Email: 'admin2@fake_so.com', Username: 'admin2', Password: 'cse316'
2. Email: 'admin3@fake_so.com', Username: 'admin3', Password: 'cse316'

Feel free to explore and test the application using the provided credentials.
```