//任务列表
export class TaskListVo {
    taskId: number;
    title: string;
    beginTime: number;
    endTime: number;
    state: number; //状态（1待办/2已办/3超时完成
    taskState: number; //任务状态(1发布/3任务取消)
    taskItemCount: number;
    taskItemFinishedCount: number;
    percent: number;
}