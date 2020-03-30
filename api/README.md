## Password Manager - API

### How to run?

1. Make sure you have running mongodb server or run `sudo service mongodb start` on your bash terminal
2. Make sure you have NPM
3. Run `npm i` or `npm install`
4. Run `npm run serve`
5. API server will run on `http://localhost:3001` or `http://127.0.0.1:3001`

### Architecture
For this API, I use uncle bob clean architecture for separation of concerns that separated with particular layer :

1. domains (Highest)
2. usecases
3. interfaces
4. infrastructure (lowest)
