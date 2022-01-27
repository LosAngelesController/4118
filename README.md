# License

This Map was made by Kenneth Mejia For LA City Controller

You're free to use this for whatever you want! (except certain cases)
If you plan on using the map publically, please attribute "Kenneth Mejia For LA City Controller" in a clearly stated manner on the map. 
If you would like an exception on a case-by-case basis to this, contact kyler@mejiaforcontroller.com
If your additions to this map are public, you must maintain the same Tethics on your project and ensure your code is Open-Source.

Tech Ethics (Tethics):
- Do not use this to enforce criminalization against unhoused neighbours
- Do not harrass unhoused people
- You cannot use this map in anyway, shape, or form to enforce 41.18.
- Do good, not evil

# Using the finished compiled files from this project.
Our Geojson export file is stored in `src/features.json`

Our team generates new kml files after each updates and they are stored in `kmlexport` folder. Bring in both files into your own software program and layer them on top of each other.

Any files in the `combining-json` are used by our team to join our geojson files after drawing into a single file to be imported into the app. It's a mess and we recommend you work with the single built file at `src/features.json` and not `combining-json`

# Technical Documentation

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3006](http://localhost:3006) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
