import { TaskFormPage } from '../task-form/task-form';
import {Component, Injector} from '@angular/core';
import {BasePage} from '../../../../core/base-page/BasePage';
import {TaskItemVo} from '../../../../models/task/TaskItemVo';
import {ClassExamPage} from "../../../class-exam/class-exam/class-exam";
import { TaskFeedbackPage } from '../task-feedback/task-feedback';
import {CourseDetailPage} from "../../../study/course-detail/course-detail";
import {ClassPracticePage} from "../../../class-exam/class-practice/class-practice";
/*
 Generated class for the TaskItem page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-task-item',
    templateUrl: 'task-item.html'
})
export class TaskItemPage extends BasePage {
    public title: string;
    public taskItem: Array<TaskItemVo>;
    private pageNum: number = 1;
    private pageSize: number = 10;
    public canLoadMore: boolean = false;
    constructor(injector: Injector) {
        super(injector);

        this.showLoading();
        this.title = this.navParams.get('title');
        this.getMyTaskItem();
    }

    //删除自定义储存内容
    ionViewWillLeave() {
        console.log('leave');
        localStorage.removeItem('FormEle');
    }

    //获得任务项
    getMyTaskItem(refresher?) {
        let param = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            taskId: this.navParams.get('taskId'),
            page: this.pageNum,
            pageSize: this.pageSize
        }
        //获取任务列表
        this.httpUtil.get({
            url: this.apiUrls.getTaskItems(),
            param: param,
            success: data => {
                console.log('TASK_ITEM:')
                console.log(data);
                
                //this.taskItem = data.result;
                if(this.pageNum == 1){
                    this.taskItem = [];
                }
                if(data.result == null || data.result == ''){
                    this.canLoadMore = false;
                    return;
                }
                this.taskItem = this.taskItem.concat(data.result);
                if(data.result.length >= this.pageSize){
                    this.canLoadMore = true;
                }else{
                    this.canLoadMore = false;
                }
            },
            fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                if(refresher){
                    refresher.complete();
                }
                this.dismissLoading();
            }
        });
    }
    //
    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.showLoading();
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.getMyTaskItem(refresher);
    }

    bindFinishedColor(state){
      if(state == 2||state == 3){
        let textColor ={
          'color':'#999'
        }
        return textColor;
      }
      return;
    }

    //绑定任务类型颜色
    bindTaskType(type) {
        let color;
        switch (type) {
            case 1:
                color = 'type_blue';
                break;
            case 2:
                color = 'type_red';
                break;
            case 3:
                color = 'type_deepBlue';
                break;
            case 4:
                color = 'type_green';
                break;
            case 5:
                color = 'type_yellow';
                break;
            case 12:
                color = 'type_brown';
                break;
            case 13:
                color = 'type_deepBrown';
                break;
        }
        return color;
    }

    //跳转到class-exam
    openClassExam(item){
        //任务类型（1课程，2考试，3练习，4调研，5投票，6测评 7内容包 8闯关 9圈子 10主题 11栏目 12反馈  13混合(自定义表单)，999综合）
        switch(item.objType){
            case 1:
                this.navController.push(CourseDetailPage,{
                    courseId:item.objId
                });
                break;
            case 2:
                this.navController.push(ClassExamPage,{
                    objId:item.objId,
                    objType:item.objType
                });
                break;
            case 3:
                this.navController.push(ClassExamPage,{
                    objId:item.objId,
                    objType:item.objType
                });
                break;
            case 4:
                this.navController.push(ClassExamPage,{
                    objId:item.objId,
                    objType:item.objType
                });
                break;
            case 5:
                this.navController.push(ClassExamPage,{
                    objId:item.objId,
                    objType:item.objType
                });
                break;
            case 12:
                this.navController.push(TaskFeedbackPage,{
                    taskId:item.taskId,
                    taskItemId:item.id
                });
                break;
            case 13:
                this.navController.push(TaskFormPage,{
                    taskId:item.taskId,
                    taskItemId:item.id,
                    objId:item.objId
                });
                break;
        }

    }
}
