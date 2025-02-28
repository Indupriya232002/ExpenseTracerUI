import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { OtpverificationComponent } from './components/otpverification/otpverification.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { AuthGuard } from './auth.guard'

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' }, // Redirect to Welcome page
  { path: 'welcome', component: WelcomeComponent }, // Welcome route
  {path:'login',component:LoginComponent},
  {path:'signup',component:RegisterComponent},
  {path:'expenses',component:ExpensesComponent},
  {path:'forgotpassword',component:ForgotpasswordComponent},
  {path:'otpverification',component:OtpverificationComponent},
  {path:'resetpassword',component:ResetpasswordComponent},
  {path:'sidebar',component:SideBarComponent,canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
