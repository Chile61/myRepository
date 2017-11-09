import { TaskFormDefinitionVo } from '../../../../models/task/TaskFormDefinitionVo';
import { FormElementsVo } from '../../../../models/task/FormElementsVo';
import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the TaskFormEle page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-task-form-ele',
  templateUrl: 'task-form-ele.html'
})
export class TaskFormElePage extends BasePage{
  public index: number;
  public item: FormElementsVo;
  public taskForm: TaskFormDefinitionVo;

  public selected: Array<any> = [];
  constructor(injector:Injector) {
    super(injector);
    this.index = this.navParams.get('index');
    this.item = this.navParams.get('item');
    console.log(this.item);
    this.taskForm = JSON.parse(localStorage.getItem('FormEle'));
    console.log(this.taskForm);

    if(this.item.type == '4'){
      for(var i=0 ; i < this.item.items.length; i++){
         this.selected[i] = false;
         for(var j = 0;  j < this.item.selectedItems.length ; j++){
           if(this.item.items[i] == this.item.selectedItems[j]){
             this.selected[i] = true;
            }
          }
      }
      console.log(this.selected);
    }
  }
  
 //单项选择事件
 changeSingleOpt(selected){
   console.log(this.index);
   console.log(selected);
   console.log(this.taskForm);
  
  this.taskForm.containers[this.index].field.selectedItems[0] = selected;
  this.taskForm.containers[this.index].field.defaultValue = selected;
  localStorage.setItem('FormEle',JSON.stringify(this.taskForm));
 }
 //多项选择
 changeMoreOpt(index,opts){
   this.selected[index] = opts._checked; 
   console.log(this.selected);
   let newSelectedItems = [];
   let num = 0;
   for(var i = 0; i < this.selected.length; i++){
     if(this.selected[i]){
       newSelectedItems[num] = this.item.items[i];
       num++;
     }
   }
   console.log(newSelectedItems);
   this.taskForm.containers[this.index].field.selectedItems = newSelectedItems;
   this.taskForm.containers[this.index].field.defaultValue = newSelectedItems.join(',');
   localStorage.setItem('FormEle',JSON.stringify(this.taskForm));
 }

}
