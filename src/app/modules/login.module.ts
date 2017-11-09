import { NgModule } from '@angular/core';
import { IonicApp } from 'ionic-angular';
import { ShareModule } from './share.module';
import { ForgetPasswordPage } from '../../pages/login/forget-password/forget-password';
import { RetrievePasswordPage } from '../../pages/login/retrieve-password/retrieve-password';

@NgModule({
  bootstrap: [IonicApp],
  imports: [
    ShareModule
  ],
  declarations: [
    ForgetPasswordPage,
    RetrievePasswordPage
  ],
  entryComponents: [
    ForgetPasswordPage,
    RetrievePasswordPage
  ],
  providers: [
    ForgetPasswordPage,
    RetrievePasswordPage
  ]
})
export class LoginModule {}
