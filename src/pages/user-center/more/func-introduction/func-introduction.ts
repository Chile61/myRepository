import { DomSanitizer } from '@angular/platform-browser';
import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the FuncIntroduction page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-func-introduction',
  templateUrl: 'func-introduction.html'
})
export class FuncIntroductionPage extends BasePage {
  
    public resUrl: any;
   
    constructor(injector: Injector, private sanitizer: DomSanitizer) {
        super(injector);
        
        this.initPage();
    }
    initPage() {
      
        let myUrl = this.apiUrls.getBasePath() + '/mobile/index.html';
        this.resUrl = this.sanitizer.bypassSecurityTrustResourceUrl(myUrl);
    }


}