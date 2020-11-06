Requirements:
PostgreSQL v13
Node v12.14.1 LTS

Certificates:
The api does not make use of any https certificates as I would run it behind a reverse-proxy like nginx.

Database choice:
I considered the MongoDB with the Mongoose driver. In this scenario I would have to manage foreign keys. That can be mitigated somewhat by combining some of the document collections (tables) which belong together in a NoSQL database.

Another option was MariaDB and Sequelize, but MariaDB doesn't support variable length TEXT as primary keys.

The layout looks like sql and Postgre supports TEXT primary keys so I picked Postgre with Sequelize for database.

Notes:
Didn't look like the intended authorization system was Oauth2 or jwt, so I made something custom that creates an access token and a device token which was intended to change after each request (I didn't manage to finish the changing part).
You can't log in from the app because I didn't manage to finish it before midnight on friday, but you can post a request to api/login url with a tool like Postman or Insomnia to see it return tokens when using the username 'Jonathan' and the password 'password'.
The same with get proposals, didn't finish it in the app, but you can post a get request to /api/company/1/job/1/proposals with the accessToken and deviceToken headers to see what it returns.

Api Setup with mariadb
0. Clone this git repository or download an archive version of this project and unpack somewhere
1. Create a database for this project in Postgres, with, for example, the name: 'wdts'
2. In the api/config.js file change DB_NAME, DB_USER and DB_PASSWORD to match your database configuration
3. Open your command prompt or terminal and navigate to the project directory with: cd <your\project\path\here>
4. Run "npm install" to install the project dependencies
5. Execute "node setup" and wait for the database tables to be created
6. If all went well run the "node server" command to start the api
   (if you don't see the message 'The API is ready for use', ether the database is taking its time, or it didn't go well)

App setup
1. Navigate to the project app directory with command-prompt or another command execution interface
2. Run "npm install" to install project dependencies
3. Run "npm start" and the React app should open in your browser with an address of http://localhost:5001/