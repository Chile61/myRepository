import { BasePage } from '../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { StudyStatisticsVo } from '../../../models/userCenter/StudyStatisticsVo';

/*
  Generated class for the MemberStatistics page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-member-statistics',
  templateUrl: 'member-statistics.html'
})
export class MemberStatisticsPage extends BasePage{
  public studyStatisticsVo :StudyStatisticsVo;
  constructor(injector:Injector) {
    super(injector);
    this.getStatistics();
  }

  ionViewDidLoad() {
    console.log('Hello MemberStatisticsPage Page');
  }
  //学习统计
  getStatistics() {
       let body = {
            userId: this.storageUtil.getUserId(),
            orgId: this.storageUtil.getOrgId()
        };

        this.httpUtil.get({
            url: this.apiUrls.getMyStudyStatistics(),
            param: body,
            success: (data) => {
              this.log(data);
              this.studyStatisticsVo = data.result; 
            },
            fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
              
            }
        });
  }
}
