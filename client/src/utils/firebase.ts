import * as firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY!,
  authDomain: "aip-assessment-2.firebaseapp.com",
  databaseURL: "https://aip-assessment-2.firebaseio.com",
  projectId: "aip-assessment-2",
  storageBucket: "aip-assessment-2.appspot.com",
  messagingSenderId: process.env.MSG_SENDER_ID!,
  appId: process.env.FIREBASE_APP_ID!,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID!,
};

// Ensure only one firebase instance is created
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const authProviders = {
  google: new firebase.auth.GoogleAuthProvider(),
  github: new firebase.auth.GithubAuthProvider(),
};

// If on client, assign auth object for debugging
if (process.browser) {
  (window as any).auth = firebase.auth();
  (window as any).providers = authProviders;
}

export const auth = firebase.auth();
