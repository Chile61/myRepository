import { TeacherVo } from './TeacherVo';

export class TrainingClassVo{

    public id:number;//班级id
    public createTime:number;//创建时间
    public creatorId:number;//创建人
    public className:string;//班级名称
    public usergroup:string;//面向人群
    public address:string;
    public description:string;//班级简介
    public userCounts:number;//可参加的人数
    public joinedUserCount:number;//已参加的人数
    public state:number;//状态（1：已参加，2未参加）
    public startTime:number;//开始时间
    public endTime:number;//结束时间
    public classTeacher:string;//讲师
    public inClassStartTime:number;//课中阶段开始时间
    public inClassEndTime:number;//课中阶段结束时间
    public currentStageName:string;//当前班级所处阶段名称
    public joinStatus:number;//用户加入状态(0未加入 1待审核  2已加入)
    public imageUrl:string;//班级配图
    public qcodeUrl:string;//班级二维码路径
    public needPay:number;//是否需要付费（0否 1是）
    public cost:number;//费用、价格
    public teacherList:Array<TeacherVo>; //讲师信息

    constructor(){

    }
}