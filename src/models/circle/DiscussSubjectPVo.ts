import { DisAttachCourseVo } from './DisAttachCourseVo';

export class DiscussSubjectPVo{
    public title:string;//主题标题
    public content:string;//主题内容
    public categoryId:number;//主题归类Id，默认填0
    public imgURLs:string[];//主题的图片
    public anonymousFlag:number;//是否匿名发表，0=非匿名发表，大于0匿名发表；默认是0；
    public inviteeUserIds:number[];//话题@新增成员的userId
    public removeInvitee:number[];//移除掉当前话题@的成员的userId
    public attachCourses:Array<DisAttachCourseVo>;//附加课程列表
}