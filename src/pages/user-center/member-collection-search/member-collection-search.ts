import { BasePage } from '../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';

/*
  Generated class for the MemberCollectionSearch page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-member-collection-search',
  templateUrl: 'member-collection-search.html'
})
export class MemberCollectionSearchPage extends BasePage{

  constructor(injector:Injector) {
    super(injector);
  }

  ionViewDidLoad() {
    console.log('Hello MemberCollectionSearchPage Page');
  }

}
