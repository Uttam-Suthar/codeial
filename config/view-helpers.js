
const env = require("./enviroment");
const fs = require('fs');
const path = require('path');

module.exports = (app) => {
    app.locals.assetPath = function (filePath) {
        if (env.name == 'development') {
            return filePath;
        }

        return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath];
    }
}


//   <link rel="stylesheet" type="text/css" href="<%= assetPath('css/layout.css') %>" />
        
//         <link rel="stylesheet" type="text/css" href="<%= assetPath('css/header.css') %>" />
        
//         <link rel="stylesheet" type="text/css" href="<%= assetPath('css/footer.css') %>" />

