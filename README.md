# Template for Node.js

This is a Node template for Mongodb-Passport.js based applications using Typescript
Feel free to use it if needed.

## Run the project
Just create a `.env` file and add your `MONGODB_URI` for your database, your `EMAIL` and `EMAIL_PASSWORD` to send emails for forgotten passwords.

Then run `npm i` to install all the dependencies, and run `npm start` or `npm run dev` if you want to use nodemon (then you would need to have nodemon installed globally).

To auto compile the Typescript files as you change them, run `tsc -p tsconfig.server.json` for server files or `cd public && tsc -p tsconfig.client.json` for client files.

## Project structure
The project starts with the server.ts file (transpiled to js), which calls all files in the `controllers` folders. They contain all the routing that you need to see the different views.

They then import the `models` files, which just contain the auth logic and user schema for MongoDB.

In the `views` folder, you have all the ejs files for templates.

Finally, the `public` folder is for the client-side files: it contains the manifest, the service worker file for creating PWAs, the `images` folder, the `styles` files written in LESS, and the Typescript (and their transpiled version) front-end files.

<br />

If you liked this project, please visit my website [there](https://julienmerasli.media)

*Some of the text inside this template is in French, I apologize if you don't understand it.*