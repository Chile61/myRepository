/**
 * Created by zxh on 2016/12/16.
 */
export class ConfigKey {
    // -----------------------------------------------基础模块-----------------------------------------------
    static ORG_CODE: string = 'ORG_CODE';                                 // 企业ID
    static ORG_ID: string = 'ORG_ID';                                     // 企业ID编码
    static USER_ID: string = 'USER_ID';                                   // 用户ID
    static USERNAME: string = 'USERNAME';                                 // 用户名
    static NICKNAME: string = 'NICKNAME';                                 // 用户昵称
    static ACCESS_TOKEN: string = 'X-Access-Token';                       // TOKEN
    static AVATAR: string = 'AVATAR';                                     // 头像
    static GENDER: string = 'GENDER';                                     // 性别
    static PERSON_GRP_ID: string = 'PERSON_GRP_ID';                       // 人群分组ID
    static MODULE_CONFIG: string = 'MODULE_CONFIG';                       // 模块配置
    static USER_MSG: string = 'USER_MSG';                                 // 用户信息
    static OLD_USER_ID: string = 'OLD_USER_ID';                           // 绑定用户的ID（切换用户时使用）
    static THEME_VALUE: string = 'THEME_VALUE';                           //主题色
    static THEME_IMAGE: string = 'THEME_IMAGE';                           //主题图片
    // -----------------------------------------------登录模块-----------------------------------------------


    // -----------------------------------------------学习模块-----------------------------------------------

    static COURSE_COMMENT_MAX: string = 'STUDY_COMMENT_MAX';               // 课程详情评论字数限制
    static COURSE_COMMENT_REPLY_MAX: string = 'STUDY_COMMENT_REPLY_MAX';   // 课程详情回复字数限制
    static STUDY_COURSE_COLLECT: string = 'STUDY_COURSE_COLLECT';          // 课程收藏按钮是否显示
    static STUDY_COURSE_APPRAISE: string = 'STUDY_COURSE_APPRAISE';        // 课程点赞按钮是否显示
    static STUDY_COURSE_DOWNLOAD: string = 'STUDY_COURSE_DOWNLOAD';        // 课程下载按钮是否显示

    static STUDY_READ_COURSE_HINT: string = 'READ_COURSE_HINT_TIME';       // 课程阅读提醒时间(上次设置暂不提醒的时间)

    // -----------------------------------------------企业模块-----------------------------------------------


    // -----------------------------------------------圈子模块-----------------------------------------------
    static CIRCLE_COMMENT_MAX_LENGTH: string = 'CIRCLE_COMMENT_MAX_LENGTH'; //圈子评论字数限制
    static CIRCLE_TOP_SUBJECT_NUM: string = 'CIRCLE_TOP_SUBJECT_NUM';       //圈子话题置顶条数
    static CIRCLE_DISCUSS_SUBJECT_OFFER_BUTTON: string = 'CIRCLE_DISCUSS_SUBJECT_OFFER_BUTTON'; //是否显示话题打赏按钮标识
    static CIRCLE_OFFER_SUBJECT_MAX_NUMS: string = 'CIRCLE_OFFER_SUBJECT_MAX_NUMS'; //打赏话题的最大值
    static CIRCLE_ALLOW_ANONYMOUS_FLAG: string = 'CIRCLE_ALLOW_ANONYMOUS_FLAG'; //是否允许匿名标识

    // -----------------------------------------------闯关模块-----------------------------------------------

}
