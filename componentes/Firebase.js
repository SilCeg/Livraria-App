
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC99vSdBJiyKRE99oqtO-3-sjqRMuD4Sw4",
  authDomain: "livraria-e0611.firebaseapp.com",
  projectId: "livraria-e0611",
  storageBucket: "livraria-e0611.firebasestorage.app",
  messagingSenderId: "933508479669",
  appId: "1:933508479669:web:c93ceb22e125fc8425dcfc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth,db};

