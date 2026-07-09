import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LooksComponent } from '../../looks/looks.component';
import { PlannedLooksComponent } from '../../planned-looks/planned-looks.component';
import { UnusedLooksComponent } from '../../unused-looks/unused-looks.component';

const routes: Routes = [
  { path: 'looks', title: 'Looks', component: LooksComponent },
  {
    path: 'unused-looks',
    title: 'Looks ainda Não Usados Nesse Ano',
    component: UnusedLooksComponent,
  },
  {
    path: 'planned-looks',
    title: 'Looks Planejados',
    component: PlannedLooksComponent,
  },
  { path: 'used-looks', title: 'Looks Usados', component: PlannedLooksComponent },
  { path: 'gym', title: 'Academia', component: PlannedLooksComponent },
  { path: 'specials', title: 'Especiais', component: PlannedLooksComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LooksRoutingModule {}
