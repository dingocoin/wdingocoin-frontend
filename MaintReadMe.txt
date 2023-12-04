This Guide and support code is to add hot-swapping Maint-Mode ( AKA- Hot Switch) capability without having to rebuild the entire application. The idea is to enable hot module replacement (HMR), which allows you to inject updated modules into the running application without a full rebuild.

Step One 
Install React Hot Loader:
React Hot Loader is a tool that enables hot module replacement for React components.

Run:
yarn add react-hot-loader

Place babel.config file in the root of your project which will add the following configuration:

{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": [
    "react-hot-loader/babel"
  ]
}

Update Main Application
/src/index.jsx and save file.


Start server:
yarn start

This would enable hot module replacement, and your changes to React components should be reflected in the running application without a full re-build.


How to trigger:

Code Section:
/src/App.jsx
Line 40


{/* Maint Mode Toggle  'const maintenance' = -- true = on  | false = off */}
  const maintenance = false;  <--- true or false
  return (
    <Router>
      {maintenance ? (
        <Maintenance />
      ) ........

save, refresh browser :)