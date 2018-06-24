import { NgModule }     from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BriscolaRoutingModule } from './briscola-routing.module';
import { BriscolaCategoryComponent } from './briscola-category.component'
import { BriscolaInDueComponent } from './briscola_in_due/briscola-in-due.component';

@NgModule({
  imports:      [ BriscolaRoutingModule ],
  declarations: [ 
    BriscolaCategoryComponent,
    BriscolaInDueComponent
  ],
  exports: [RouterModule]
})
export class BriscolaModule { }