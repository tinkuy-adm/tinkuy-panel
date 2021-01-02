import app from "firebase/app";
require("firebase/auth");

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_APP_NAME}.firebaseapp.com`,
  databaseURL: `https://${process.env.REACT_APP_FIREBASE_APP_NAME}.firebaseio.com`,
  projectId: `${process.env.REACT_APP_FIREBASE_APP_NAME}`,
  storageBucket: `${process.env.REACT_APP_FIREBASE_APP_NAME}.appspot.com`,
  messagingSenderId: process.env.REACT_APP_FIREBASE_messagingSenderId,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENTID,
};

export default class Firebase {
  auth: app.auth.Auth;
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
  }
}
