# fhir-server-express

Patient Service API This repository contains a simple Express.js server that provides a Patient Service API for managing patient data. Below, you'll find instructions on how to set up and use the server.

Start the Server (The server will run on http://localhost:3000): npm start

What the Code Does The API allows you to create patient records, search for patients by name, and retrieve patient data. The patient data is stored in an SQLite database named patients.db.

Creating a Mock Patient To create a mock patient record, you can use a REST client like Rest Client in Visual Studio Code. Use the provided HTTP requests in the .http files to make requests to the API. The patient will be stored in the SQLite database, and a unique medical record number will be generated for them.

Using the .http Files The .http file provided in the repository contain example HTTP requests that you can use to interact with the API. To use them:

Open Visual Studio Code.

Install the "Rest Client" extension if you haven't already.

Open one of the .http files (e.g., index.http, patient.service.http) in the editor.

Click the "Send Request" button next to each request to execute it against the running server. You can modify the request payload as needed.

Viewing the Database To view the contents of the SQLite database (patients.db), you can use an SQLite viewer or browser tool.

Getting a Patient by Name To get a patient by name, you can use the following GET request: GET http://localhost:3000/patient/search?name=John%20Doe

This request will search for patients with the name "John Doe" and return their details, including their medical record number.
