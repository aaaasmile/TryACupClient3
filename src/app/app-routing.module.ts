import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component'
import { LoginComponent } from './login/login.component'
import { SignUpComponent } from './sign-up/sign-up.component'
import { UserDetailsComponent } from './user-details/user-details.component'
import { AuthenticationService } from './services/authentication.service'
import { OnlineModeService } from './services/networkMode.service'
import { GameListComponent } from './game-list/game-list.component'
import { BriscolaInDueComponent } from './games/briscola/briscola_in_due/briscola-in-due.component';
import { TestGfxComponent } from './games/test-gfx/test-gfx.component';
import { TestCardComponent } from './games/test-gfx/testcard/testcard.component';
import { TestCardComponent2 } from './games/test-gfx/testcard2/testcard2.component';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent, canActivate: [AuthenticationService] },
  { path: 'login', component: LoginComponent, canActivate: [OnlineModeService] },
  { path: 'signup', component: SignUpComponent, canActivate: [OnlineModeService] },
  { path: 'user-details', component: UserDetailsComponent, canActivate: [AuthenticationService] },
  { path: 'app/games', component: GameListComponent, canActivate: [AuthenticationService] },
  { path: 'games/briscola/briscola-in-due', component: BriscolaInDueComponent },
  { path: 'games/test-gfx', component: TestGfxComponent },
  { path: 'games/test-gfx/testcard', component: TestCardComponent },
  { path: 'games/test-gfx/testcard2', component: TestCardComponent2 }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
