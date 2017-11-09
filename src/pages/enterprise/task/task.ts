import { TaskListVo } from '../../../models/task/TaskListVo';
import { Component, Injector } from '@angular/core';
import { BasePage } from '../../../core/base-page/BasePage';
import { TaskItemPage } from './task-item/task-item';
/*
  Generated class for the Task page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-task',
  templateUrl: 'task.html'
})
export class TaskPage extends BasePage {
  public static TASK_DONE = 2;
  public static TASK_UNFINISHED = 1;
  public doneLists: Array<TaskListVo> = [];
  public unfinishedLists: Array<TaskListVo> = [];

  private pageNum: number = 1;
  private pageSize: number = 10;
  public canLoadMore: boolean = false;

  public taskTab: string = "unfinished";
  public today;//当前时间
  public flag = false;
  constructor(injector: Injector) {
    super(injector);
    this.today = Date.now();

    this.showLoading();

    this.getMyTask(TaskPage.TASK_UNFINISHED);
  }

  ionViewDidLoad() {
    console.log('Hello TaskPage Page');
  }
  //获取任务列表
  getMyTask(state,refresher?){
    if(!refresher){
      this.pageNum = 1;
    }
    let param = {
      orgId: this.storageUtil.getOrgId(),
      userId: this.storageUtil.getUserId(),
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      state: state
    }
    this.httpUtil.get({
        url: this.apiUrls.getTaskList(),
        param: param,
        success:data =>{
          console.log('task_list:' + state)
    			console.log(data);
         
          if (this.pageNum == 1) {
            state == TaskPage.TASK_DONE? this.doneLists = []:this.unfinishedLists = [];
          }
          if(data.result == null || data.result == ''){
            this.canLoadMore = false;
            return;
          }
          state == TaskPage.TASK_DONE? this.doneLists = this.doneLists.concat(data.result):this.unfinishedLists = this.unfinishedLists.concat(data.result);

          if (data.result.length >= this.pageSize) {
            this.canLoadMore = true;
          } else {
            this.canLoadMore = false;
          }
    		},
        fail:(error) =>{
          this.toast(error.msg);
        }, finish: () => {
          if(refresher){
            refresher.complete();
          }
          this.dismissLoading();
        }
      });
  }
  //跳转到任务项
  toTaskItem(taskId: number,title: string) {
    this.navController.push(TaskItemPage, {taskId: taskId,title: title});
  }

  //计算剩余时间
  leftTime(endTime) {
    let date2 = new Date(endTime);
    let dateNow = new Date();
    let date3 = date2.getTime() - dateNow.getTime();
      //计算天数
  		var days = Math.floor(date3/(24*3600*1000));
  		//计算小时
  		var leave1 = date3%(24*3600*1000);
  		var hours = Math.floor(leave1/(3600*1000));
  		//计算分钟
  		var leave2 = leave1%(3600*1000);
  		var minutes =Math.floor(leave2/(60*1000));
  		var result = "剩余" + ((days == 0)? "":days+"天") + hours + "小时" + minutes +"分";
  	return result
  }
  //绑定圆
  bindCirclePercents(finished,total,endTime?) {
    let val = finished/total;
    let v = val*100;
    let perCentClass = 'p'+ v.toFixed(0);
    return (endTime && this.today > endTime)? [perCentClass,'black']:perCentClass;
  }

  bindCircleColor(val) {

    let flag = true;
    if(val == 0){
      flag = false;
    }
    let color = {
       green: flag,
    }

    return true;
  }
  bindOutOfDateColor(endTime){
    if(this.today > endTime){
      let textColor ={
        'color':'#999'
      }
      return textColor;
    }
    return;
  }
  bindCircle(finished,total){
    let val = finished/total;
    let rotationMultiplier = 3.6;
    let rotationDegrees = rotationMultiplier*val*100;

    let circle = {
      '-webkit-transform' : 'rotate(' + rotationDegrees + 'deg)',
			  '-moz-transform'    : 'rotate(' + rotationDegrees + 'deg)',
			  '-ms-transform'     : 'rotate(' + rotationDegrees + 'deg)',
			  '-o-transform'      : 'rotate(' + rotationDegrees + 'deg)',
			  'transform'         : 'rotate(' + rotationDegrees + 'deg)'
    }
    return circle;
  }
  //
  doRefresh(refresher, isRefresh: boolean) {
    if (isRefresh) {
       this.showLoading();
       this.pageNum = 1;
    } else {
       this.pageNum = this.pageNum + 1;
    }
    if(this.taskTab == 'unfinished'){
      this.getMyTask(TaskPage.TASK_UNFINISHED,refresher);
    }else{
      this.getMyTask(TaskPage.TASK_DONE,refresher);
    }
  }
}
