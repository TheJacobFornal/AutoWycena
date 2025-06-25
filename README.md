# AutoWycena

## Building the React frontend

The Electron application loads the compiled files from `frontend/dist`. If the
directory does not exist, build the frontend first:

```bash
cd frontend
npm install           # only needed once to install dependencies
npm run build         # generates the `dist/` folder
```

The React entry component is `App.jsx`. Ensure this file exists and is used when
running or building the frontend.

After building the frontend you can start the Electron app from the repository
root:

```bash
npm start
```

The Vite configuration uses relative asset paths (`base: './'`) so the build
works correctly when loaded via the `file://` protocol in Electron.
