# AutoWycena

## Building the React frontend

The Electron application loads the compiled files from `frontend/build`. If the
directory does not exist, build the frontend first:

```bash
cd frontend
npm install           # only needed once to install dependencies
npm run build         # generates the `build/` folder
```

The React entry component is `App.jsx`. Ensure this file exists and is used when
running or building the frontend.

After building the frontend you can start the Electron app from the repository
root:

```bash
npm start
```

The Create React App build uses relative asset paths thanks to the
`"homepage": "./"` setting in `frontend/package.json`. This allows the build
to load correctly when opened using the `file://` protocol in Electron.
