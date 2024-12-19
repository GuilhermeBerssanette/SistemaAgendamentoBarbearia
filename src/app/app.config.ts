import { ApplicationConfig, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from "@angular/common/http";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import {firebaseConfig} from "../environments/firebase";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { provideFirestore } from "@angular/fire/firestore";
import { getFirestore } from "@angular/fire/firestore";
import { provideEnvironmentNgxMask } from "ngx-mask";
import { provideStorage } from "@angular/fire/storage";
import { getStorage } from "@angular/fire/storage";
import { cloud } from "../environments/cloud";

export const CLOUD_CONFIG = new InjectionToken('CloudConfig', {
  providedIn: 'root',
  factory: () => cloud,
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideEnvironmentNgxMask(),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    { provide: CLOUD_CONFIG, useValue: cloud },
  ]
};
