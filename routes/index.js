var express = require('express');
var router = express.Router();

const request = require('request');
const cognito = require('../config/cognito.js')

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
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

var logged = false;

router.get('/', function(req, res, next) {  

  if(logged)
    res.render('video');
  else  
  res.redirect('/login');
});

router.get('/login', function(req, res, next){
  if(logged)    
    res.redirect('/');
  else
    res.render('login');
})

router.get('/logout', function(req, res, next){
  var cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
      cognitoUser.signOut();
      logged = false;
      res.redirect('/login');
  }
})

router.post('/login', function(req, res, next){
  if (logged) {
    res.redirect('/');
  } else {    
      var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username : req.body.email,
        Password : req.body.password,
      });

      var userData = {
          Username : req.body.email,
          Pool : userPool
      };
    
      var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
      cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: function (result) {
              // console.log('access token + ' + result.getAccessToken().getJwtToken());
              // console.log('id token + ' + result.getIdToken().getJwtToken());
              // console.log('refresh token + ' + result.getRefreshToken().getToken());
              logged = true;
              res.redirect('/notifications');
          },
          onFailure: function(err) {
              console.log(err);
              res.redirect('/login');
          },
      });
    }
})

router.get('/notifications', function(req, res, next) {
  if(logged)
  {
    url = 'https://tgmdpuq1ai.execute-api.us-east-1.amazonaws.com/crud/alertnotifications';

    request(url, {json : true}, (err, response, body) => {
      if (err) { return console.log(err); }
      //let notificationList = body;

      var notificationList = body.slice(0);
      // notificationList.sort(function(a,b) {
      //     var x = a.usuario;
      //     var y = b.usuario;
      //     return x > y ? -1 : x < y ? 1 : 0;
      // });

      res.render('notifications', {notificationList : notificationList});
    });    
  }
  else
    res.redirect('login');
  
});

router.get('/information', function(req, res, next) {
  if(logged)    
    res.render('information');
  else
    res.redirect('login');
  
});

router.get('/:filename', function(req, res) {
  if(logged)    
    res.render('notification_video');
  else
    res.redirect('login')
});

module.exports = router;
