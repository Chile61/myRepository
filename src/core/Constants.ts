/**
 * Created by zxh on 2017/1/10.
 */
//公用常量
export class Constants {
    static LOGIN_OUT_STATUS_CODE:number = 401;
    static LOGIN_EVENT:string = "loginout";

    //评论1:课程  3:新闻 4:通知  5:关卡 6:活动 7:课程素材 8: 草根明星(资料库) 9:门店评论
    static COURSE_COMMENT: number = 1;
    static NEW_COMMENT: number = 3;
    static NOTICE_COMMENT: number = 4;
    static PASS_COMMENT: number = 5;
    static ACTIVITY_COMMENT: number = 6;
    static MATERIAL_COMMENT: number = 7;
    static DATA_COMMENT: number = 8;
    static STORE_COMMENT: number = 9;

    //点赞 1:课程  2:评论  3:话题  4:话题评论 (或班级问答评论)
    static COURSE_UP: number = 1;
    static COURSE_COMMENT_UP: number = 2;
    static TOPIC_UP: number = 3;
    static TOPIC_COMMENT_UP: number = 4;

    //收藏 1：新闻，2：通知，3：课程，4：圈子话题，5：资料
    static NEW_COLLECTION: number = 1;
    static NOTICE_COLLECTION: number = 2;
    static COURSE_COLLECTION: number = 3;
    static TOPIC_COLLECTION: number = 4;
    static DATA_COLLECTION: number = 5;

    //名师详情 1、来自名师榜 2、来自栏目主题
    static TEACHER_FROM_FAMOUS: number = 1;
    static TEACHER_FROM_THEME: number = 2;

    //课程详情(来自)
    static COURSE_LIST: number = 0;//来自课程列表(默认)
    static FROM_PASS: number = 1;//来自闯关
    static FROM_TASK: number = 2;//来自任务
    static FROM_CLASS: number = 3;//来自班级
    static FROM_TOPIC: number = 4;//来自圈子话题
    static FROM_ACTIVITY: number = 5;//来自活动
    static FROM_OFFLINE_DOWNLOAD: number = 6;//来自离线下载



}
