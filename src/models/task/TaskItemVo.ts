import { TaskItemUserVo } from './TaskItemUserVo';
//任务项
export class TaskItemVo {
    id: number;//任务项Id
    objType: number; //1课程，2考试，3练习，4调研，5投票，6测评 7内容包 8闯关 9圈子 10主题 11栏目 12反馈  13混合(自定义表单)，999综合
    objTypeName: string;
    objId: number;
    objName: string;
    requireLevel: number; //1.必修2.选修
    state: number; //0未开始,1未完成,2已完成,3超时完成 
    percent: number;
    objContent: string;
    taskItemUserVo: TaskItemUserVo;
}