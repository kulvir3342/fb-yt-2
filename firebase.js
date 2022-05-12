import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBfidFCwx8YVFPIGMRoCmsOLQQ3oOKjuqg",
    authDomain: "facebook-2-yt-aa91e.firebaseapp.com",
    projectId: "facebook-2-yt-aa91e",
    storageBucket: "facebook-2-yt-aa91e.appspot.com",
    messagingSenderId: "1014905084598",
    appId: "1:1014905084598:web:239254eeedbd4227826417"
  };

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

  const db = getFirestore();
  const storage = getStorage();

  export {app, db, storage};