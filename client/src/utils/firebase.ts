import * as firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5y4j7UT8lGiHA_CD85gKEClsjooh1cNc",
  authDomain: "aip-assessment-2.firebaseapp.com",
  databaseURL: "https://aip-assessment-2.firebaseio.com",
  projectId: "aip-assessment-2",
  storageBucket: "aip-assessment-2.appspot.com",
  messagingSenderId: "562901182872",
  appId: "1:562901182872:web:acf829424a7883a4d2a3ed",
  measurementId: "G-ZCF2WBN3M6",
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
