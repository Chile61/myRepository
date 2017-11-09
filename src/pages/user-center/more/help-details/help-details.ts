import { HelpQnaContentVo } from '../../../../models/userCenter/HelpQnaContentVo';
import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the HelpDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-help-details',
  templateUrl: 'help-details.html'
})
export class HelpDetailsPage extends BasePage{
  public qnaContentId: number;
  public qnaContent: HelpQnaContentVo;

  public questionImgUrlSet: Array<string> = [];
  public answerImgUrlSet: Array<string> = [];
  constructor(injector:Injector) {
    super(injector);
    this.qnaContentId = this.navParams.get('qnaContentId')
    this.showLoading();
    this.getQnaDetails();
  }
  getQnaDetails(){
    let param = {
			moduleValue: 1,
			qnaContentId: this.qnaContentId,
			page: 1

		};
    this.httpUtil.get({
           url: this.apiUrls.getQnaDetail(),
           param: param,
           success: (data) => {     
              
              console.log(data);
              this.qnaContent = data.result;
              if(this.qnaContent.questionImgUrlSet.length > 0) {
                this.questionImgUrlSet = this.qnaContent.questionImgUrlSet.split(',');
              }
              if(this.qnaContent.answerImgUrlSet.length > 0) {
                this.answerImgUrlSet = this.qnaContent.answerImgUrlSet.split(',');
              }
              
           },fail: (err) => {
              this.toast(err.msg);
           }, finish: () => {
              this.dismissLoading();
          }
     })
  }

}
