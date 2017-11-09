import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the HelpSearch page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-help-search',
  templateUrl: 'help-search.html'
})
export class HelpSearchPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello HelpSearchPage Page');
  }

}
