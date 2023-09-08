import { Component, OnInit } from '@angular/core';
import { UsersFacade } from '@facades/users.facade';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  todayIs: any;
  isHome = window.location.pathname === '/' ? true : false;
  userName = '';

  constructor(private userFacade: UsersFacade) {}

  ngOnInit(): void {}
}
