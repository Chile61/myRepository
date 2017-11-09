import { UserInfo3rdVo } from './UserInfo3rdVo';
import { DisAttachCourseVo } from './DisAttachCourseVo';
import { CourseMiniVo } from '../study/CourseMiniVo';

export class DiscussSubjectMiniVo {
    public groupId: number;
    public groupName: string;
    public type: string;//话题类型
    public subjectId: number;//主题id
    public title: string;//主题标题
    public content: string;//主题内容
    public imgURLs: Array<string>;//主题LOGO图片地址
    public createDate: number;//创建时间
    public endDate: number;//结束时间
    public author: UserInfo3rdVo;//创建者信息，参考UserInfo3rdVo信息
    public countOfComments: number;//回复总数
    public awesomeCount: number;//点赞数
    public topFlag: number;//是否置顶
    public anonymousFlag: number;//是否匿名
    public invitee: boolean;//当前话题对当前用户的@是否有效
    public inviteeUsers: Array<UserInfo3rdVo>;//当前话题所@的人，参考UserInfo3rdVo信息
    public doYouAwesomed: boolean;//是否已点赞过
    public doYouOffered: boolean;//是否已打赏（true已打赏，false未打赏）
    public doYouFavorite: boolean;//是否已收藏（true已收藏，false未收藏）
    public OfferedCoinNums: string;//话题已获取的打赏金币值
    public attachCourses: Array<CourseMiniVo>;//附加课程的列表
    public finishFlag: boolean;//注：用户完成标识，目前只适用于投票话题
    public objType: number;//投票类型：单选=1, 多选=2
    public objId: number;//投票实例ID
    public objStage: number;//阶段  1：未开始   2：进行中  3：已结束(即过期)
    public publishType: string;//圈子发布类型：OPB01=企业公开，OPV02=不公开，APB00=完全公开
}