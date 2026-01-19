import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebase 프로젝트 설정
const firebaseConfig = {
    apiKey: "AIzaSyADXd3sEn6vMDf41l1xrOrgA2FXhu5iw2M",
    authDomain: "phycom-ai.firebaseapp.com",
    databaseURL: "https://phycom-ai-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "phycom-ai",
    storageBucket: "phycom-ai.firebasestorage.app",
    messagingSenderId: "577054049161",
    appId: "1:577054049161:web:a7a473afcfd18bf1ec1758",
    measurementId: "G-H4JY4Z7RE7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
