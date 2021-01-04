import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppSetupComponent } from './app-firebase/app-setup/app-setup.component';
import { LoginComponent } from './app-firebase/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'setup',
    component: AppSetupComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
