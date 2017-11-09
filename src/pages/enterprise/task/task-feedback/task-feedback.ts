import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { TaskItemUserVo } from '../../../../models/task/taskItemUserVo';
import { TaskItemVo } from '../../../../models/task/TaskItemVo';
import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';

/*
  Generated class for the TaskFeedback page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-task-feedback',
  templateUrl: 'task-feedback.html'
})
export class TaskFeedbackPage extends BasePage{
  public value: number = 0;
  public taskId: number;
  public taskItemId: number;
  public txtArea: string ;

  public taskItemVo: TaskItemVo;
  public taskItemUserVo: TaskItemUserVo;

  constructor(injector:Injector) {
    super(injector);
    this.showLoading();
    this.taskId = this.navParams.get('taskId');
    this.taskItemId = this.navParams.get('taskItemId');
    this.getFeedbackMsg();
  }
  //获取反馈任务信息
 getFeedbackMsg(){
   let body = {
     orgId: this.storageUtil.getOrgId(),
     userId: this.storageUtil.getUserId(),
     taskId: this.taskId,
     taskItemId: this.taskItemId
   }

   this.httpUtil.get({
     url: this.apiUrls.getTaskFeedbackItems(),
     param: body,
     success: data => {
       console.log('反馈信息：')
       console.log(data);
       this.taskItemVo = data.result;
       this.taskItemUserVo = this.taskItemVo.taskItemUserVo;
       this.value = this.taskItemUserVo.completionRate;
       this.txtArea = this.taskItemUserVo.remarks;
     },
     fail: (err) => {
       this.toast(err.msg);
     }, finish: () => {
       this.dismissLoading();
     }
   })
 }
 //提交反馈类型
 submitBtn() {
   this.showLoading('正在提交...');

   let taskItemUserVo ={
     itemId: this.taskItemId,
     id: this.taskItemUserVo.id,
     usertaskId: this.taskItemUserVo.usertaskId,
     state: this.taskItemVo.state,
     address: this.taskItemUserVo.address,
     remarks: this.txtArea,
     imageUrlSet: this.taskItemUserVo.imageUrlSet,
     completionRate: this.value
   }
   let body = {
     orgId: this.storageUtil.getOrgId(),
     userId: this.storageUtil.getUserId(),
     taskId: this.taskId,
     taskItemId: this.taskItemId,
     taskItemUserVo: taskItemUserVo
   }
   this.httpUtil.post({
     url: this.apiUrls.saveTaskFeedback() + '/'+this.storageUtil.getOrgId() + '/' + this.storageUtil.getUserId() + '/'+this.taskId + '/' + this.taskItemId,
     param: body,
     success: data => {
       console.log('提交反馈：')
       console.log(data);
       this.navController.pop();
     },
     fail: (err) => {
       this.toast(err.msg);
     }, finish: () => {
       this.dismissLoading();
     }
   })
 }

}
