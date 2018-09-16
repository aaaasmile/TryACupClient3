import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component'
import { LoginComponent } from './login/login.component'
import { SignUpComponent } from './sign-up/sign-up.component'
import { UserDetailsComponent } from './user-details/user-details.component'
import { AuthenticationService } from './services/authentication.service'
import { OnlineModeService } from './services/onlineMode.service'
import { GameListComponent } from './game-list/game-list.component'


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent, canActivate: [AuthenticationService]  },
  { path: 'login', component: LoginComponent, canActivate: [OnlineModeService] },
  { path: 'signup', component: SignUpComponent, canActivate: [OnlineModeService] },
  { path: 'user-details', component: UserDetailsComponent, canActivate: [AuthenticationService] },
  //{ path: 'games', loadChildren: './games/games.module' }
  { path: 'games', loadChildren: './games/games.module#GamesModule', canActivate: [AuthenticationService]  },
  { path: 'app/games', component: GameListComponent, canActivate: [AuthenticationService] }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
