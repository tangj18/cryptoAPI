import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoininfoPage } from './coininfo.page';

const routes: Routes = [
  {
    path: '',
    component: CoininfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoininfoPageRoutingModule {}
