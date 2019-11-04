This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Demo

[Heroku](http://shaxqt.herokuapp.com) (spotify account needed)

![spotify_friends_preview](https://media.giphy.com/media/VcvtxVNzGVhmzjmDbD/giphy.gif)
## Run this Project

### Requirements

- MongoDB (or use DBaaS)
- Node JS
- Spotify Developer Account (https://developer.spotify.com/)
  - Create an Application to get a Client-ID and Client-Secret

### Setup

```
git clone git@github.com:shaxqt/spotify_friends.git
```

```
cd spotify_friends
```

```
npm install
```

Rename `_.env.local`to `.env.local`. This value is used for the Websocket connection and the redirect to `/auth/login` route, since react-proxy seems to only work for fetches.

Rename `_.env` to `.env` and paste in your Spotify Client-ID and Secret and **save it**.
_Optional_ change the link to MongoDB here, if you dont run it locally at default port 27017.

Go to your [Spotify Application](https://developer.spotify.com/dashboard/applications), click "Edit Settings" and add `http://localhost:3000` at "Redirect URIs". This url has to match the REDIRECT_URI in the `.env` file. (don't forget to **scroll down and klick save**).

Now you can run

```
npm run dev
```

Visit your browser at [http://localhost:3000](http://localhost:3000) (should open automatically).
The page will reload if you make edits.<br>

#### Changes for setup in production

You need to change the REDIRECT_URI to your hostname and also add it to your [Spotify Application](https://developer.spotify.com/dashboard/applications)

After that run

```
npm run build
```

Now you can run the server only, it will deliver the static html files from the build folder

```
node run server.js
```

##### Deploy on Heroku
Simply push this project to heroku, there is a procfile which heroku will use. _But_ you need to setup the enviroment variables manually.
