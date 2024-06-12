import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"foodmate-30cdc","appId":"1:76066438463:web:da7737b8f803224ae2678a","storageBucket":"foodmate-30cdc.appspot.com","apiKey":"AIzaSyCfW46Xg5QPh-7RPNPveDkPaCMbaAZa_sE","authDomain":"foodmate-30cdc.firebaseapp.com","messagingSenderId":"76066438463","measurementId":"G-SHXSVM6Y0Z"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
