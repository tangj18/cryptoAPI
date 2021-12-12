import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoininfoPageRoutingModule } from './coininfo-routing.module';

import { CoininfoPage } from './coininfo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoininfoPageRoutingModule
  ],
  declarations: [CoininfoPage]
})
export class CoininfoPageModule {}
