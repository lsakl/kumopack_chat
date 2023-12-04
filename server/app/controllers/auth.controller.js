const Auth        = require("../models/auth.model.js");
const authHealper = require('../helper/auth.helper');

exports.login = (req, res) => {

    Auth.getUserProfile(req.body, (getUserProfileErr, dataProfile) => {
      if (getUserProfileErr){
        res.status(getUserProfileErr.status).send(getUserProfileErr);
        return;
      }
      
      Auth.getUserAccount(req.body, dataProfile, (checkUserAccountErr, userAccount) => {
          if (checkUserAccountErr){
            res.status(checkUserAccountErr.status).send(checkUserAccountErr);
            return;
          }
          if(req.body.type){
            Auth.addContact(userAccount.data.user._id.toString(), userAccount.data.to._id.toString(), (contactErr) => {
              if (contactErr){
                res.status(contactErr.status).send(contactErr);
                return;
              }

              userAccount.accessToken = authHealper.generateAccessToken({ 
                id:userAccount.data.user._id,
                uuId:userAccount.data.user.uuId,
              }),
              res.status(userAccount.status).send(userAccount);
              return;
            });
          }else{
            userAccount.accessToken = authHealper.generateAccessToken({ 
              id:userAccount.data.user._id,
              uuId:userAccount.data.user.uuId,
            }),
            res.status(userAccount.status).send(userAccount);
            return;
          }
      });
    });

};