import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Auth, User, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo, signOut, user } from '@angular/fire/auth';
import { UserService } from './user.service';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User| null>;

  constructor(
      private afAuth: Auth,
      private userService: UserService,
  ) {
    this.user$ = user(afAuth);
  }

  async login() {
    const credential = await signInWithPopup(this.afAuth, new GoogleAuthProvider());
    const additionalInfo = getAdditionalUserInfo(credential);
    if (additionalInfo?.isNewUser) {
      this.user$.subscribe(user => this.userService.save(<User>user))
    }
  }

  async logout() {
    await signOut(this.afAuth);
  }

  get profile(): Observable<Profile|null> {
    return this.user$
      .pipe(switchMap(user => {
        if (user) return this.userService.get(user.uid);

        return of(null);
      }))
  }

}
