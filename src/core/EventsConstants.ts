/**
 * Events 常量
 */
export class EventsConstants {
    /*****************圈子********************/
    //圈子发送话题
    static POST_TOPIC: string = 'post_topic';
    //圈子加入与退出圈子
    static OPERATE_CIRCLE: string = 'operate_circle';
    //删除话题
    static DELETE_TOPIC: string = 'delete_topic';
    //编辑话题
    static EDIT_TOPIC: string = 'edit_topic';
    //筛选话题
    static FILTER_TOPIC: string = 'filter_topic';
    //图片编辑-删除图片
    static DELETE_PICTURE: string = 'delete_picture';  
    //发表话题@好友
    static SELECT_FRIEND: string = 'select_friend';

    /*****************班级**********************/
    //发表班级问答
    static POST_CLASS_QUESTION: string = 'post_class_question';
    //班级学习课程置灰
    static CLASS_STUDY_GREY: string = 'class_study_grey';

    /******************学习**********************/
    //评论控件选择课程
    static SELECT_COURSE: string = 'select_course';
    //关闭课程搜索页(选择课程使用)
    static CLOSE_SEARCHPAGE: string = 'close_searchPage';
    //刷新课程列表(已读置灰使用)
    static REFRESH_COURSE_LIST: string = 'refresh_courseList';
}
