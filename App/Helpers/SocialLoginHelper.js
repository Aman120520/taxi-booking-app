import { Alert, Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";
// const APPLE_SIGNIN_CLIENT_ID = "";
// const APPLE_SIGNIN_CALLBACK_URL = "";
import { appleAuthAndroid, appleAuth, AppleAuthRequestOperation } from '@invertase/react-native-apple-authentication';
//import 'react-native-get-random-values';
//import { v4 as uuid } from 'uuid';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

import { Strings } from "../Resources";

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import {
  LoginButton,
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from "react-native-fbsdk-next";

import Utils from "./Utils";

export default class SocialLoginHelperService {
  static signInGoogle = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        GoogleSignin.configure({
          offlineAccess: false,
        });
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        await GoogleSignin.signOut();
        resolve(this.parseSocialObject(userInfo.user, false));
      } catch (error) {
        reject(error);
      }
    });
  };

  static signOut = async (socialLoginType) => {
    try {
      if (
        socialLoginType !== null &&
        socialLoginType !== "" &&
        socialLoginType !== "null" &&
        socialLoginType !== " "
      ) {
        if (socialLoginType === "1" || socialLoginType === 1) {
          GoogleSignin.configure({
            offlineAccess: false,
          });
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        } else if (socialLoginType === "2" || socialLoginType === 2) {
          await LoginManager.logOut();
        } else if (socialLoginType === "3" || socialLoginType === 3) {
          await appleAuth.performRequest({
            requestedOperation: AppleAuthRequestOperation.LOGOUT,
          });
        }
      }
    } catch (error) {
      //Alert.alert("",Strings.some_thing_went_wrong_please_try_later);
    }
  };

  static loginWithFacebook = () => {
    return new Promise((resolve, reject) => {
      LoginManager.logInWithPermissions(["public_profile", "email"]).then(
        (result) => {
          if (result.isCancelled) {
            reject(Strings.you_have_cancell_login);
          } else {
            AccessToken.getCurrentAccessToken().then((data) => {
              let accessToken = data.accessToken;
              let facebookId = data.userID;
              const responseInfoCallback = (error, result) => {
                if (error) {
                } else {
                  resolve(this.parseSocialObject(result, true));
                }
              };
              const infoRequest = new GraphRequest(
                "/me",
                {
                  accessToken: accessToken,
                  parameters: {
                    fields: {
                      string:
                        "name,first_name, last_name, picture.type(large),email,gender",
                    },
                  },
                },
                responseInfoCallback
              );
              new GraphRequestManager().addRequest(infoRequest).start();
            });
          }
        },
        function (error) {
          reject(Strings.some_thing_went_wrong_please_try_later);
        }
      );
    });
  };

  static parseSocialObject = (result, isFB) => {
    if (result !== null) {
      var name = "";
      var social_id = "";
      var emailAddress = "";
      var gender = "";
      var profilePicture = "";
      var first_name = "";
      var last_name = "";
      var full_name = "";
      if (result.hasOwnProperty("name") && !Utils.isStringNull(result.name)) {
        name = result.name;
      }
      if (
        result.hasOwnProperty("first_name") &&
        !Utils.isStringNull(result.first_name)
      ) {
        full_name = result.first_name;
        first_name = result.first_name;
      }
      if (
        result.hasOwnProperty("last_name") &&
        !Utils.isStringNull(result.last_name)
      ) {
        last_name = result.last_name;
        if (Utils.isStringNull(full_name)) {
          full_name = result.last_name;
        } else {
          full_name = full_name + " " + result.last_name;
        }
      }
      if (Utils.isStringNull(name)) {
        name = full_name;
      }
      if (
        result.hasOwnProperty("givenName") &&
        !Utils.isStringNull(result.givenName)
      ) {
        first_name = result.givenName;
      }
      if (
        result.hasOwnProperty("familyName") &&
        !Utils.isStringNull(result.familyName)
      ) {
        last_name = result.familyName;
      }
      if (result.hasOwnProperty("id") && !Utils.isStringNull(result.id)) {
        social_id = result.id;
      }
      if (result.hasOwnProperty("email") && !Utils.isStringNull(result.email)) {
        emailAddress = result.email;
      }
      if (
        result.hasOwnProperty("gender") &&
        !Utils.isStringNull(result.gender)
      ) {
        gender = result.gender;
      }
      try {
        if (
          result.hasOwnProperty("photo") &&
          !Utils.isStringNull(result.photo)
        ) {
          profilePicture = result.photo;
        } else if (
          result.hasOwnProperty("picture") &&
          result.picture !== null
        ) {
          if (
            result.picture.hasOwnProperty("data") &&
            result.picture.data !== null
          ) {
            if (
              result.picture.data.hasOwnProperty("url") &&
              !Utils.isStringNull(result.picture.data.url)
            ) {
              profilePicture = result.picture.data.url;
            }
          }
        }
      } catch (error) { }
      let data = {
        ...result,
        name: name,
        social_id: social_id,
        first_name: first_name,
        last_name: last_name,
        socialProfilePicture: profilePicture,
        email: emailAddress,
        gender: gender,
      };
      return data;
    }
  };

  static onAppleButtonPress = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!appleAuth.isSupported) {
          reject("Apple Authentication is not supported on this device.");
          return;
        }
        //Perform an Apple Sign-In request
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        // Retrieve the current authentication state for the user
        const credentialState = await appleAuth.getCredentialStateForUser(
          appleAuthRequestResponse.user,
        );

        //Use the credentialState response to confirm that the user is authenticated
        if (credentialState === appleAuth.State.AUTHORIZED) {
          let email = appleAuthRequestResponse?.email;
          const fullName = appleAuthRequestResponse?.fullName

          var sub = "";
          // verify identity token is exist
          if (appleAuthRequestResponse.identityToken) {
            const identityToken = jwtDecode(appleAuthRequestResponse.identityToken)
            if (!email && identityToken?.email) {
              email = identityToken.email;
            }
            sub = identityToken.sub;
          }
          const userInfo = {
            fullName,
            email,
            id: sub,
            //user: appleAuthRequestResponse.user
          }

          resolve(userInfo);
        } else {
          reject('An error occurred during sign in.');
        }
      } catch (error) {
        reject('An error occurred during sign in.');
      }
    })
  }

  /*static signWithApple = async () => {
   const rawNonce = uuid();
   const state = uuid();
   try {
      await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGOUT
      })
    } catch (error) {

    }
   return new Promise( async (resolve, reject) => {
        try {
          appleAuthAndroid.configure({
            clientId: APPLE_SIGNIN_CLIENT_ID,
            redirectUri: APPLE_SIGNIN_CALLBACK_URL,
            responseType: appleAuthAndroid.ResponseType.ALL,
            scope: appleAuthAndroid.Scope.ALL,
            nonce: rawNonce,
            state,
          });

        const response = await appleAuthAndroid.signIn();

        if (response) {
          resolve(response);
        }
        }catch (error) {
         if (error && error.message) {
           switch (error.message) {
             case appleAuthAndroid.Error.NOT_CONFIGURED:
               reject(Strings.unable_to_login_with_your_apple_account);
               break;
             case appleAuthAndroid.Error.SIGNIN_FAILED:
               reject(Strings.unable_to_login_with_your_apple_account);
               break;
             case appleAuthAndroid.Error.SIGNIN_CANCELLED:
                reject(Strings.you_have_cancell_login);
               break;
             default:
                reject(Strings.some_thing_went_wrong_please_try_later);
               break;
           }
         }
       }
    })
  }*/
}
