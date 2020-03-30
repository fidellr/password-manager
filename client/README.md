## Password Manager - Client

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.

### Architecture

Usecases is divided on for directory:
1. `./src/components` for any shareable component that shouldn't be have any state or stateless.
2. `./src/containers` for any shareable component that can be have state and treat like a wrapper of usecase.
3. `./src/pages` is an entry point for app route pages components
4. `./src/redux` is a place for storing any data with their logic functionalities.