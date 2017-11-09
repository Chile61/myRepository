import { BasePage } from '../../../core/base-page/BasePage';
import { LoginPage } from '../../login/login';
import { Component, Injector } from '@angular/core';

/*
  Generated class for the IndexSlides page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-index-slides',
  templateUrl: 'index-slides.html'
})
export class IndexSlidesPage extends BasePage{
  public introducePages: Array<string>;
  mySlideOptions = {
    initialSlide:0,
    loop:false,
    pager:true
  }
  constructor(injector:Injector) {
    super(injector);
    this.introducePages = this.navParams.get('introducePages');
    console.log(this.introducePages);
  }

  enterLogin() {
    this.navController.push(LoginPage);
    
  }
}
