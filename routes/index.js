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

var logged = 0;
var logout = 0;
var errormsg = 0;

router.get('/', function(req, res, next) {  

  if(logged == 1)
    res.render('video', {logged:logged, logout:logout});
  else  
    res.redirect('/login');
      
});

router.get('/login', function(req, res, next){
  if(logged == 1)    
    res.redirect('/');
  else if (logged == 2)
  {
    res.render('login', {logged:logged, logout:0, errormsg:errormsg});
  }
  else
    res.render('login', {logged:logged, logout:logout, errormsg:errormsg});
  
})

router.get('/logout', function(req, res, next){
  var cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
      cognitoUser.signOut();
      logged = 0;
      logout = 1;
      res.redirect('/login');
  }
})

router.post('/login', function(req, res, next){
  if (logged == 1) {
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
              console.log(result);
              logged = 1;
              res.redirect('/notifications');
          },
          onFailure: function(err) {
              if (err.message == 'User is not confirmed.')
              {
                errormsg = 1;
              }
              else {
                errormsg = 0;
              }
              console.log(err);
              logged = 2;
              res.redirect('/login');
          },
      });
    }
})

router.get('/notifications', function(req, res, next) {
  if(logged == 1)
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

      res.render('notifications', {notificationList : notificationList , logged:logged, logout:logout});
    });    
  }
  else
    res.redirect('login');
   
});

router.get('/information', function(req, res, next) {
  if(logged == 1)    
    res.render('information', {logged:logged,logout:logout});
  else
    res.redirect('login');
  
});

router.get('/:filename', function(req, res) {
  if(logged == 1)    
    res.render('notification_video', {logged:logged,logout:logout});
  else
    res.redirect('login')
});

module.exports = router;
