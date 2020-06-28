var express = require('express');
var router = express.Router();

const request = require('request');
const s3 = require('../config/s3.config.js');
const cognito = require('../config/cognito.js')

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
//const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
//const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

const poolData = {    
  UserPoolId : cognito.userPoolId, // Your user pool id here    
  ClientId : cognito.clientId // Your client id here
}; 
const pool_region = cognito.region; //Your region here
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

var logged = null;

router.get('/', function(req, res, next) {
  if (logged === null)
    logged = false;

  if(logged)
    res.render('video');
  else
    res.redirect('/login');
});

router.get('/login', function(req, res, next){
  if(!logged)
    res.render('login');
  else
    res.redirect('/');
})

router.post('/login', function(req, res, next){
  if (!logged) {
    Login(req.body.email, req.body.password);
  } else {
    res.redirect('/');
  }
})

router.get('/notifications', function(req, res, next) {
  url = 'https://tgmdpuq1ai.execute-api.us-east-1.amazonaws.com/crud/alertnotifications';

  request(url, {json : true}, (err, response, body) => {
    if (err) { return console.log(err); }
    //let notificationList = body;

    var notificationList = body.slice(0);
    notificationList.sort(function(a,b) {
        var x = a.usuario;
        var y = b.usuario;
        return x > y ? -1 : x < y ? 1 : 0;
    });

    res.render('notifications', {notificationList : notificationList});
  });  
});

router.get('/information', function(req, res, next) {
  res.render('information');
});

router.get('/:filename', function(req, res) {
  const s3Client = s3.s3Client;
  const params = s3.downloadParams;
  const hbjs = require('handbrake-js')
  
  params.Key = req.params.filename;
 
  // var file = require('fs').createWriteStream('public/assets/video/video.avi');

  // s3Client.getObject(params)
  //   .createReadStream()
  //     .on('error', function(err){
  //       res.status(500).json({error:"Error -> " + err});
  //   }).pipe(file);

    // hbjs.spawn({ input: 'public/assets/video/video.avi', output: 'public/assets/video/video.mp4' })
    // .on('error', err => {
    //   // invalid user input, no video found etc
    // })
    // .on('progress', progress => {
    //   console.log(
    //     'Percent complete: %s, ETA: %s',
    //     progress.percentComplete,
    //     progress.eta
    //   )
    // })

    res.render('notification_video')
});

function Login(user, pass) {
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username : user,
      Password : pass,
  });

  var userData = {
      Username : user,
      Pool : userPool
  };
  
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
          console.log('access token + ' + result.getAccessToken().getJwtToken());
          console.log('id token + ' + result.getIdToken().getJwtToken());
          console.log('refresh token + ' + result.getRefreshToken().getToken());
          logged = true;
      },
      onFailure: function(err) {
          console.log(err);
      },
  });
}

module.exports = router;
