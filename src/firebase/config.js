import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyD_oYn1ryureog-YnWHmYkFZhHrOGl2-nk",
    authDomain: "sciforumchat.firebaseapp.com",
    projectId: "sciforumchat",
    storageBucket: "sciforumchat.appspot.com",
    messagingSenderId: "597550251438",
    appId: "1:597550251438:web:ebf01c3eb379022ab55c3f",
    measurementId: "G-6DV1N73FNN"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth;
export const db = firebase.database();