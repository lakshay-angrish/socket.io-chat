import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showLogoutButton = false;

  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    if (sessionStorage.getItem('username') === null) {
      this.showLogoutButton = false;
    } else {
      this.showLogoutButton = true;
    }
  }

  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('');
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    sessionStorage.clear();
  }
}
