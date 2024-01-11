# Fake Stack OverFlow

## Description

This Fake Stack OverFlow project is a web application that mimics the functionalities of the popular Stack Overflow platform for developers. It's built using a combination of HTML, CSS, and JavaScript for the front-end, while the back-end is powered by JavaScript. Axios is employed for handling HTTP requests, and MongoDB is used for efficient data storage.

## Technical Stack

The technologies used in this project include:

- <i class="icon fab fa-html5"></i> HTML
- <i class="icon fab fa-css3"></i> CSS
- <i class="icon fab fa-react"></i> React
- <i class="icon fab fa-envira"></i> MongoDB
- <i class="icon fab fa-node"></i> Node.js

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

   *Default admin email is set to:* admin@fakeso.com

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

1. Email: 'admin2@fakeso.com', Username: 'admin2', Password: 'cse316'
2. Email: 'admin3@fakeso.com', Username: 'admin3', Password: 'cse316'

Feel free to explore and test the application using the provided credentials!
