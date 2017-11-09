import { UserInfo3rdVo } from './UserInfo3rdVo';
import { DisAttachCourseVo } from './DisAttachCourseVo';


export class DiscussCommentVo{
    public commentId:number;//评论ID
    public content:string;//评论内容
    public imgURLs:Array<string>;//图片地址
    public voiceUrl:string;//语音地址
    public replyTime:number;//回复时间，TIMESTAMP，单位毫秒
    public awesomeCount:number;//点赞数
    public followingComments:Array<DiscussCommentVo>;//可空，跟帖
    public attachCourses:Array<DisAttachCourseVo>;//附加课程列表
    public anonymousFlag:number;//0:不匿名, 1:匿名
    public user:UserInfo3rdVo;//回复者信息，参考UserInfo3rdVo信息
    public hasAppraised:string;//是否已点赞（true已点赞，false未点赞）
}