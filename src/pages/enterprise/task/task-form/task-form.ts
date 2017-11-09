import { document } from '@angular/platform-browser/src/facade/browser';
import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { TaskFormDefinitionVo } from '../../../../models/task/TaskFormDefinitionVo';
import { TaskFormElePage } from '../task-form-ele/task-form-ele';

/*
  Generated class for the TaskForm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-task-form',
  templateUrl: 'task-form.html'
})
export class TaskFormPage extends BasePage{
  public taskId: number;
  public taskItemId: number;
  public objId: number;

  public taskForm: TaskFormDefinitionVo;

  constructor(injector:Injector) {
    super(injector);
    this.showLoading();
    this.taskId = this.navParams.get('taskId');
    this.taskItemId = this.navParams.get('taskItemId');
    this.objId = this.navParams.get('objId');
    this.getFormMsg();
  }
  //每次进入
  ionViewWillEnter() {
    console.log('refresh');
    this.taskForm = JSON.parse(localStorage.getItem('FormEle'));
  }

  //获取自定义信息
 getFormMsg(){
   let body = {
     orgId: this.storageUtil.getOrgId(),
     userId: this.storageUtil.getUserId(),
     taskId: this.taskId,
     taskItemId: this.taskItemId,
     objId: this.objId
   }

   this.httpUtil.get({
     url: this.apiUrls.getTaskForm(),
     param: body,
     success: data => {
       console.log('自定义信息：')
       console.log(data);
       this.taskForm = data.result;
       localStorage.setItem('FormEle',JSON.stringify(this.taskForm));
     },
     fail: (err) => {
       this.toast(err.msg);
     }, finish: () => {
       this.dismissLoading();
     }
   })
 }
 
 //进入选择
 bindSelectItems(item,index){
  let inputValue = [];
  let iNum = 0;
  for(let i = 0; i < this.taskForm.containers.length; i++){
    if( this.taskForm.containers[i].field.type == '1' || this.taskForm.containers[i].field.type == '2'){
       inputValue[iNum]= i;
       iNum++;
     }
  }
  for(let i = 0; i < inputValue.length; i++ ){
    let element = (document.getElementById(this.taskForm.containers[inputValue[i]].field.id) as HTMLInputElement).value;
    this.taskForm.containers[inputValue[i]].field.defaultValue = element;
  }

  localStorage.setItem('FormEle',JSON.stringify(this.taskForm));
  this.navController.push(TaskFormElePage,{item:item,index:index})
 }

 //提交反馈类型
 submitBtn(){
  let inputValue = [];
  let iNum = 0;
  for(let i = 0; i < this.taskForm.containers.length; i++){
    if( this.taskForm.containers[i].field.type == '1' || this.taskForm.containers[i].field.type == '2'){
       inputValue[iNum]= i;
       iNum++;
     }
  }
  console.log(inputValue);
  for(let i = 0; i < inputValue.length; i++ ){
    let element = (document.getElementById(this.taskForm.containers[inputValue[i]].field.id) as HTMLInputElement).value;
    if(!element){
      //非必填
      if(this.taskForm.containers[inputValue[i]].field.required=='1'){
         this.toast('您还有未填写的项');
         return
      }
    }else{
      this.taskForm.containers[inputValue[i]].field.defaultValue = element;
    }
  }
  console.log(this.taskForm);

  for(let i = 0; i < this.taskForm.containers.length; i++){
    if( this.taskForm.containers[i].field.type == '3' || this.taskForm.containers[i].field.type == '4'){
       if(this.taskForm.containers[i].field.selectedItems.length < 1 && this.taskForm.containers[i].field.required=='1'){
         this.toast('您还有未填写的项');
         return
       }
     }
  }
  this.showLoading('正在提交...');

  let param = {
    orgId: this.storageUtil.getOrgId(),
    userId: this.storageUtil.getUserId(),
    taskId: this.taskId,
    taskItemId: this.taskItemId,
    objId: this.objId,
    containers: this.taskForm
  }
  this.httpUtil.post({
     url: this.apiUrls.saveTaskForm() + '/'+this.storageUtil.getOrgId() + '/' + this.storageUtil.getUserId() + '/'+this.taskId + '/' + this.taskItemId + '/' + this.objId,
     param: this.taskForm,
     success: data => {
       console.log('提交自定义表单：')
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


