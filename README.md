Maria Sylla

Android Manager application for InteticsLab TestTask.
App is deployed to Heroku: https://android-manager-msylla.herokuapp.com/

Set up:
- clone git repository
- run npm init
- run npm install
- run createdb android_manager
- run psql -d android_manager -f db/schema.sql
- run npm i nodemon
- run nodemon app.js -e html,css,js


Technologies used:
Back-end: NodeJS, Express, Express-Session, PG-promise, Method-Override, Body-Parser, Bcrypt, PSQL

Front-End: HTML5, CSS3, Bootstrap, Javascript, jQuery
