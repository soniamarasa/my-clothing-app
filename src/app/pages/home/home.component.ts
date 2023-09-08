import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  subs = new SubSink();

  constructor(public _dialogService: DialogService, private _router: Router) {}

  ngOnInit(): any {}

  ngOnDestroy(): any {}
}
