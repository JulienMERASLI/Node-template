# Node.js Template fullstack application

This repository is a template for a fullstack app built with Node.js and Typescript. It uses Express on the server, with MongoDB for the database. On the client, it uses Preact for UIs and is built via SSR with Vite.

## How to start the application

First, create a `.env` file at the root of the project and add the following keys:
- `MONGODB_URI` containing for the url for your database
- `EMAIL` containing your email (used to send emails to reset user's password)
- `EMAIL_PASSWORD` containing the password corresponding to your email address

Then run the following commands:
- `npm i` to install the dependencies
- `npm run tscServer` to compile all Typescript files of the server. This command uses `ttsc` instead of `tsc` to allow the use of custom transformers. This project already includes `typescript-is` which can be used to create run-time type checks.
- `npm start` or `npm run dev` to start the server. (`npm run dev` will start `nodemon` to automatically refresh when you make changes.)

Finally, go to [localhost:8080](http://localhost:8080) to see the result.

## File structure

```
ssr-preact
 ├─> controllers
 │   ├── accountController.ts
 │   ├── helpers.ts
 │   └── mainController.ts
 ├─> models
 │   └─> accounts
 │       ├── mailsResetPW.ts
 │       ├── modifySettings.ts
 │       ├── passportModel.ts
 │       ├── registration.ts
 │       ├── resetPW.ts
 │       └── userSchemaModel.ts
 ├─> public
 │   ├── favicon.ico
 │   ├─> fonts
 │   │   ├── (font files)
 │   ├─> images
 │   │   ├── appleIcon.png
 │   │   ├── icon.png
 │   │   ├── loading.gif
 │   │   ├── maskable_icon.png
 │   │   └── shareIcon.png
 │   ├── manifest.webmanifest
 │   └── robots.txt
 ├─> src
 │   ├── App.tsx
 │   ├── entry-client.tsx
 │   ├── entry-server.tsx
 │   ├── fonts.less
 │   ├─> forms
 │   │   ├── forms.less
 │   │   └── settingsValidator.tsx
 │   ├─> help
 │   │   ├── figimg.tsx
 │   │   ├── help.less
 │   │   └── sectionDiv.tsx
 │   ├─> index
 │   │   ├── index.less
 │   │   └── paragraph.tsx
 │   ├── main.less
 │   ├─> pages
 │   │   ├── $ResetPW.tsx
 │   │   ├── ForgotPW.tsx
 │   │   ├── Help.tsx
 │   │   ├── Index.tsx
 │   │   ├── Login.tsx
 │   │   ├── Profile.tsx
 │   │   ├── Register.tsx
 │   │   └── Settings.tsx
 │   ├─> profile
 │   │   ├── profile.less
 │   │   ├── projectItem.tsx
 │   │   └── searchForm.tsx
 │   ├── pwa_sw.tsx
 │   ├─> sharedComponents
 │   │   ├── dialogs.tsx
 │   │   ├── formsElements.tsx
 │   │   ├── header.tsx
 │   │   ├── installPWA.tsx
 │   │   ├── messages.tsx
 │   │   ├── overlay.less
 │   │   └── overlay.tsx
 │   └─> utilities
 │       ├── dialogs.tsx
 │       ├── fetch.tsx
 │       ├── registerPWA.tsx
 │       └── utilities.tsx
 ├─> types
 │   ├── client.d.ts
 │   ├── jsx.d.ts
 │   ├── server.d.ts
 │   └── worker.d.ts
 ├── index.html
 ├── package.json
 ├── server.ts
 ├── tsconfig.json
 ├── tsconfig.server.json
 └── vite.config.ts
```

When `server.ts` is started, it imports the 2 controllers inside the `controllers` folder, along with the `createViteServer` function from `controllers/helpers.ts` which starts the SSR server. 

Each `GET` route in the controllers should have their last middleware call `setResParams` from `controllers/helpers.ts`. This function defines what will be the title of the HTML page for this route, what Less files will be applied for styling, and what props will be passed to the component.

The components for the pages are located in the `src/pages` directory. Each file defines a route in which the body of the document will be the default export of the file. Files starting with \$ are considered collections, an example is the `$ResetPW.tsx` file: it will be called for every route that looks like `/resetPW/:someparam`. However, the parameter needs to the passed to the `setResParams` function from the server to be used as props.

*I tried to name all the variables and functions in English, but some text may be in French, feel free to change it to whatever language you'd like.*

If you like this template, be sure to check [my personal website](https://julienmerasli.vercel.app).