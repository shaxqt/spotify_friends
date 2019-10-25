This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Demo

[Heroku](herokuapp.spotify.com) (spotify account needed)

## Run this Project locally

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

Rename `server/config/_config.js` to `server/config/config.js` and paste in your Spotify Client-ID and Secret and **save it**.
_Optional_ change the link to MongoDB here, if you dont run it locally at default port 27017.

Go to your [Spotify Application](https://developer.spotify.com/dashboard/applications), click "Edit Settings" and add `http://localhost:3000` at "Redirect URIs" (don't forget to **scroll down and klick save**).

Now you can run

```
npm run dev
```

Visit your browser at [http://localhost:3000](http://localhost:3000) (should open automatically).
The page will reload if you make edits.<br>
