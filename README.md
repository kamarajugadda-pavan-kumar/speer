# Clone the repository

gh repo clone kamarajugadda-pavan-kumar/speer

# Navigate to the project directory

cd speer

# Install dependencies

npm install

#congigure .env file
configure your database in .env file 

```
# postgres database connection 
host = your_host
port = your_port
database = your_database_name
user = Your_username
password = your_password

# jwt secret
jwtSecret = jhdfksdjhfklsdhfsdfhds3543ds4fsdajfsdhkfjsdghkfgsdlkghf
```

# navigate to src folder
```
cd src
node server.js
```
This should start the server



Copy code
## API Endpoints

List and briefly describe the API endpoints available in your project.

### Authentication Endpoints

- `POST /api/auth/signup`: Create a new user account.
- `POST /api/auth/login`: Log in to an existing user account and receive an access token.

### Note Endpoints

- `GET /api/notes`: Get a list of all notes for the authenticated user.
- `GET /api/notes/:id`: Get a note by ID for the authenticated user.
- `POST /api/notes`: Create a new note for the authenticated user.
- `PUT /api/notes/:id`: Update an existing note by ID for the authenticated user.
- `DELETE /api/notes/:id`: Delete a note by ID for the authenticated user.
- `POST /api/notes/:id/share`: Share a note with another user for the authenticated user.
- `GET /api/search?q=:query`: Search for notes based on keywords for the authenticated user.

All endpoints require authentication using the provided access token. The `authMiddleware` is implemented to ensure secure access to the protected routes.

#postman workspace
Functional testing of the end points is done here in postman. You can check the link https://www.postman.com/grey-comet-213189/workspace/speer/collection/23792729-f3c6475d-7049-4aa3-b5c9-988919ce8b6a



#Technologies Used

Node.js
Express.js
PostgreSQL
...
Project Structure
src
├─ .env
├─ app.js
├─ controllers
│  ├─ notesController.js
│  └─ userController.js
├─ middleware
│  ├─ authMiddleware.js
│  └─ rateLimitMiddleware.js
├─ modals
│  ├─ notesModel.js
│  └─ userModel.js
├─ routes
│  ├─ noteRoutes.js
│  ├─ userRoutes.js
│  └─ web.js
├─ server.js
├─ services
│  ├─ createTables.sql
│  ├─ databaseService.js
│  ├─ gracefulShutdownService.js
│  └─ initializeService.js
└─ tests
   ├─ end-to-end
   ├─ integration
   └─ unit

