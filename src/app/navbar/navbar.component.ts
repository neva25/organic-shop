import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user$: Observable<Profile | null>;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { 
    this.user$ = auth.profile;
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl("/")
  }

}
