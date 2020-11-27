import firebase from 'firebase/app'
require('@firebase/firestore')
require('firebase/auth');

// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCSJbnb1xxh4vsfrMuOFvVBBRV9CRAqbGM",
    authDomain: "lms-whj.firebaseapp.com",
    databaseURL: "https://lms-whj.firebaseio.com",
    projectId: "lms-whj",
    storageBucket: "lms-whj.appspot.com",
    messagingSenderId: "286269547609",
    appId: "1:286269547609:web:4089d0b35189591030bd48"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()

