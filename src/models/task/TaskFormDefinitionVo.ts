import { ContainerVo } from './ContainerVo';
//任务自定义表单
export class TaskFormDefinitionVo {
  name: string;
  remarks:string;
  containers: Array<ContainerVo>;
}