import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { TeachersFormComponent } from './pages/teachers-form/teachers-form.component';
import { PanelAdministradorComponent } from './pages/panel-administrador/panel-administrador.component';
import { StudentsFormComponent } from './pages/students-form/students-form.component';
import { MyAccountComponent } from './pages/dashboard/my-account/my-account.component';
import { MyStudentsComponent } from './pages/dashboard/my-students/my-students.component';
import { ReviewsComponent } from './pages/dashboard/reviews/reviews.component';
import { authGuard } from './guards/auth.guard';
import { MessagesComponent } from './pages/dashboard/messages/messages.component';
import { childrenGuard } from './guards/children.guard';
import { checkIdGuard } from './guards/check-id.guard';
import { MyClassesComponent } from './pages/dashboard/my-classes/my-classes.component';
import { checkAdminGuard } from './guards/check-admin.guard';
import { isLoggedGuard } from './guards/is-logged.guard';
import { MyInfoComponent } from './pages/dashboard/my-info/my-info.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'password-recovery', component: PasswordRecoveryComponent },
  { path: 'panel-control', component: PanelAdministradorComponent },
  {
    path: 'register',
    canActivate: [isLoggedGuard],
    component: RegisterComponent,
  },
  {
    path: 'nuevo-profesor',
    canActivate: [isLoggedGuard],
    component: TeachersFormComponent,
  },
  {
    path: 'nuevo-alumno',
    canActivate: [isLoggedGuard],
    component: StudentsFormComponent,
  },
  {
    path: 'admin',
    canActivate: [checkAdminGuard],
    component: PanelAdministradorComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    canActivateChild: [childrenGuard],
    children: [
      { path: 'my-account', component: MyAccountComponent },
      { path: 'my-students', component: MyStudentsComponent },
      { path: 'my-classes', component: MyClassesComponent },
      { path: 'my-info', component: MyInfoComponent },

      {
        path: 'messages',
        component: MessagesComponent,
      },
      { path: 'reviews', component: ReviewsComponent },
      { path: '', redirectTo: 'my-account', pathMatch: 'full' },
      {
        path: 'editar-profesor/:id',
        canActivate: [checkIdGuard],
        component: TeachersFormComponent,
      },
      {
        path: 'editar-alumno/:id',
        canActivate: [checkIdGuard],
        component: StudentsFormComponent,
      },
    ],
  },

  { path: '**', redirectTo: 'home' },
];
