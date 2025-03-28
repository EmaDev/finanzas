import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD7aAGGmzUizXT4vLCaF_GV4V6JgIoYC2Y",
    authDomain: "portafolio-3c6e9.firebaseapp.com",
    projectId: "portafolio-3c6e9",
    storageBucket: "portafolio-3c6e9.appspot.com",
    messagingSenderId: "986866712900",
    appId: "1:986866712900:web:80d2caaf33e9c1ff13d711"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);