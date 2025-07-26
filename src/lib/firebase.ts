// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPWCfkOEES3lpJp795WsgiwYfXX4Gk6_Q",
  authDomain: "newsblend-kj0fq.firebaseapp.com",
  projectId: "newsblend-kj0fq",
  storageBucket: "newsblend-kj0fq.firebasestorage.app",
  messagingSenderId: "399257475041",
  appId: "1:399257475041:web:fbf7c9499169f9aa4624a0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
