import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component'
import { LoginComponent } from './login/login.component'
import { SignUpComponent } from './sign-up/sign-up.component'
import { UserDetailsComponent } from './user-details/user-details.component'
import { AuthenticationService } from './services/authentication.service'
import { OnlineService } from './services/online.service'


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent, canActivate: [AuthenticationService]  },
  { path: 'login', component: LoginComponent, canActivate: [OnlineService] },
  { path: 'signup', component: SignUpComponent, canActivate: [OnlineService] },
  { path: 'user-details', component: UserDetailsComponent, canActivate: [AuthenticationService] },
  //{ path: 'games', loadChildren: './games/games.module' }
  { path: 'games', loadChildren: './games/games.module#GamesModule', canActivate: [AuthenticationService]  }
  //{ path: 'app/games', loadChildren: 'app/games/games.module' }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
