import firebase from 'firebase';

var firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_CHATAPP_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: "597550251438",
    appId: "1:597550251438:web:ebf01c3eb379022ab55c3f",
    measurementId: "G-6DV1N73FNN"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth;
export const db = firebase.database();