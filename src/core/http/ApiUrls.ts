/**
 * Created by zxh on 2016/12/16.
 */
export class ApiUrls {
    // public domain: string = 'http://beta.study2win.net';
    public domain: string = 'http://192.168.1.11:8380';//测试服
    constructor() {

    }

    public getDomain() {
        return this.domain;
    }

    public getBasePath() {
        return this.getDomain() + "/front";
    }

    public getWxBasePath() {
        return this.getBasePath() + "/wx";
    }

    //获取企业配置
    public getUrlSpecialConfig() {
        return this.getBasePath() + '/appConf/getSpecialConfig';
    }

    //账号密码登录
    public getUrlLoginWithPwd() {
        return this.getBasePath() + '/login/unp';
    }

    //手机登陆
    public getUrlLoginWithTel() {
        return this.getBasePath() + '/login/mnc'
    }

    //获取验证码
    public getTelCode() {
        return this.getBasePath() + '/checkNum/askForCheckNumSafe'
    }

    //获取模块配置
    public getUrlModuleConfig() {
        return this.getBasePath() + '/appConf/getModuleConfig';
    }

    //(忘记密码)手机短信验证码
    public getForgetTelCode() {
        return this.getBasePath() + '/checkNum/checkMobileAndGetCheckNum';
    }
    //验证短信验证码
    public getCheckTelCode() {
        return this.getBasePath() + '/resPwd/checkCheckNum';
    }
    //修改密码
    public getResPwd() {
        return this.getBasePath() + '/resPwd/resetPassword';
    }
    /******************************学习相关****************************/

    //获取学习活动页
    public getUrlStudyBannerLs() {
        return this.getBasePath() + '/studyBanner/getBannerLs';
    }

    //获取推荐栏目主题
    public getUrlRecommendLs() {
        return this.getBasePath() + '/studyTopic/getSuggestTopicLs';
    }

    //获取最新课程列表
    public getUrlCourseLs() {
        return this.getBasePath() + '/studyCourse/getCourseLs';
    }

    //获取能力分类列表
    public getUrlCompetencyClassLs() {
        return this.getBasePath() + '/studyCompetency/getCompetencyClassLs';
    }

    //获取能力分类标签
    public getUrlClassifyLabel() {
        return this.getBasePath() + '/studyCompetency/getCompcyLsByCompcyClassId';
    }

    //判断用户对标签下的课程权限
    public getUrlCheckLabelCourseJurisdiction(){
        return this.getBasePath() + '/studyCompetency/judgeUserCompcyCourseAuth';
    }

    //获取课程详情
    public getUrlCourseDetail() {
        return this.getBasePath() + '/studyCourse/getCourseDetail';
    }

    //获取课程评论
    public getUrlCourseTypeComment() {
        return this.getBasePath() + '/studyComment/getCommentLs';
    }

    //根据关键字搜索课程
    public getUrlSearchCourseLs() {
        return this.getBasePath() + '/studyCourseSearch/searchCourseLs';
    }

    //获取能力课程
    public getUrlCompyClassCourseLs() {
        return this.getBasePath() + '/studyCompetency/getCompyClassCourseLs';
    }

    //获取能力标签课程
    public getUrlCourseLsByCompetency() {
        return this.getBasePath() + '/studyCompetency/getCourseLsByCompetency';
    }

    //获取课程形式列表
    public getUrlCourseFormLs() {
        return this.getBasePath() + '/studyCourseForm/getCourseFormLs';
    }

    //获取形式课程
    public getUrlCourseLsByFormId() {
        return this.getBasePath() + '/studyCourse/getCourseLsByFormId';
    }

    //获取主题或者栏目分类
    public getUrlClassOrSeriesLs() {
        return this.getBasePath() + '/studyTopicSeries/getClassOrSeriesLs';
    }

    //根据栏目分类获取栏目列表
    public getUrlNewestColumnLs() {
        return this.getBasePath() + '/studyTopic/getNewestColumnLs';
    }

    //根据分类获取分类主题
    public getUrlSeriesLsWithTopicVoLs() {
        return this.getBasePath() + '/studyTopic/getSeriesLsWithTopicVoLs';
    }

    //根据分类获取系列主题
    public getUrlSeriesTopicVoLs() {
        return this.getBasePath() + '/studyTopic/getSeriesTopicVoLs';
    }

    //获取栏目主题详情
    public getUrlStudyTopicDetail() {
        return this.getBasePath() + '/studyTopic/getTopicDetail';
    }

    //搜索栏目主题
    public getUrlSearchTopicalLs() {
        return this.getBasePath() + '/studyTopic/searchTopicalLs';
    }

    //获取评论最多课程
    public getUrlMostComment() {
        return this.getBasePath() + '/studyCourseSearch/searchMorestComment';
    }

    //获取收藏最多课程
    public getUrlMostFavorite() {
        return this.getBasePath() + '/studyCourseSearch/searchMorestFavorite';
    }

    //获取点赞最多课程
    public getUrlMostAppraise() {
        return this.getBasePath() + '/studyCourseSearch/searchMorestAppraise';
    }

    //用户点赞
    public getUrlUserAppraise() {
        return this.getBasePath() + '/studyCommon/userAppraise';
    }

    //记录用户收藏
    public getUrlUserCollect() {
        return this.getBasePath() + '/studyCommon/collect';
    }

    //记录用户取消收藏
    public getUrlCancelCollect() {
        return this.getBasePath() + '/studyCommon/cancelCollect';
    }

    //获取我的课程收藏
    public getUrlMyCourseCollection(){
        return this.getBasePath() + '/personalCenter/myFavoritedCourses';
    }

    //发表评论
    public getUrlPostStudyComment(){
        return this.getBasePath() + '/studyComment/publishComment';
    }

    //记录课程已读(在线)
    public getUrlOnLineCourseRead(){
        return this.getBasePath() + '/studyCourse/markOnLineCourseReaded';
    }

    //记录课程已读(离线)
    public getUrlOffLineCourseRead(){
        return this.getBasePath() + '/studyCourse/markOffLineCourseReaded';
    }

    //我的已学课程ID
    public getUrlReadCourseId(){
        return this.getBasePath() + '/personalCenter/myStudyIdsHistory';
    }

    /******************************学习相关END****************************/

    /******************************名师相关****************************/

    //获取名师列表
    getUrlFamousTeachers(){
        return this.getBasePath() + '/teacher/list';
    }

    //获取名师详细信息
    getUrlTeacherDetail(){
        return this.getBasePath() + '/teacher/detail';
    }

    //获取名师课程列表
    getUrlTeacherCourseList(){
        return this.getBasePath() + '/teacher/course/list';
    }

    //获取名师留言列表
    getUrlTeacherMessgeList(){
        return this.getBasePath() + '/teacher/message/list';
    }

    //获取名师专栏列表
    getUrlTeacherColumnList(){
        return this.getBasePath() + '/teacher/topical/list';
    }

    //讲师留言回复
    getUrlTeacherMessageComment(){
        return this.getBasePath() + '/teacher/message/comment';
    }

    /******************************学习相关END****************************/

    /******************************企业***********************************/

    //获取我的班级列表
    public getClassesListJoined() {
        return this.getBasePath() + '/classes/list/joined';
    }

    //我可报名的班级列表
    public getClassesListCanBeJion() {
        return this.getBasePath() + '/classes/list/canBeJoin';
    }

    //获取所有班级
    public getClassesListAll() {
        return this.getBasePath() + '/classes/list/all';
    }

    //获取班级信息
    public getClassesInfo() {
        return this.getBasePath() + '/classes/info';
    }

    //获取班级通知列表
    public getClassesNoticeList() {
        return this.getBasePath() + '/classes/notice/list';
    }

    //获取签到统计列表
    public getClassStatisticsSignList() {
        return this.getBasePath() + '/classes/statistics/sign/list';
    }

    //获取阶段统计列表
    public getClassStatisticsStageList() {
        return this.getBasePath() + '/classes/statistics/stage/list';
    }

    //获取用户签到列表
    public getClassStatisticsSignUserList(){
        return this.getBasePath() + '/classes/statistics/sign/userList';
    }

    //获取班级问答列表
    public getClassesQnaList() {
        return this.getBasePath() + '/classes/qna/list';
    }

    //班级介绍（班级详情）
    public getClassesDetail() {
        return this.getBasePath() + '/classes /detail';
    }

    //获取班级详情
    public getClassQuestionDetail(){
        return this.getBasePath() + '/classes/qna/detail';
    }

    //问答详情评论列表
    public getClassCommentList(){
        return this.getBasePath() + '/classes/qna/comment/list';
    }

    //班级问答详情发表评论
    public postClassQuestionComment(){
        return this.getBasePath() + '/classes/qna/comment';
    }

    //班级提问
    public postClassQuestion(){
        return this.getBasePath() + '/classes/qna';
    }

    //获取班级学员列表
    public getClassStudents(){
        return this.getBasePath() + '/classes /students';
    }

    //加入班级
    public postJoinClass() {
        return this.getBasePath() + '/classes/join';
    }

    //获取签到历史列表
    public getClassSignHistory() {
        return this.getBasePath() + '/classes/sign/history';
    }

    //班级记录学习记录
    public postWriteUserCourseHistory(){
        return this.getBasePath() + '/classes/writeUserCourseHistory';
    }

    //获取资讯列表
    public getNewList() {
        return this.getBasePath() + '/news/list';
    }

    //资讯  获取非纯文本类型的新闻
    public getNewDetails() {
        return this.getBasePath() + '/news/show';
    }

    //任务列表
    public getTaskList() {
        return this.getBasePath() + '/task/list';
    }
    //获取任务项
    public getTaskItems() {
        return this.getBasePath() + '/task/items';
    }
    //任务项ID获取指定任务项（反馈类型）
    public getTaskFeedbackItems() {
        return this.getBasePath() + '/task/item';
    }
    //提交任务项（反馈类型）
    public saveTaskFeedback() {
        return this.getBasePath() + '/task/item/save';
    }
    //获取自定义表单（混合类型任务）
    public getTaskForm() {
        return this.getBasePath() + '/task/itemOfForm';
    }
    //提交自定义表单（混合类型任务）
    public saveTaskForm() {
        return this.getBasePath() + '/task/itemOfForm/save';
    }
    /******************************企业THE END***********************************/

    /***********************************闯关*************************************/

    //获取更多闯关游戏列表
    public  getMyGameLs(){
        return this.getBasePath() + '/studyGame/getMyGameLs';
    }
    //获取闯关详情
    public getGameDetail(){
        return this.getBasePath() + '/studyGame/getGameDetail';
    }
    //获取关卡详情
    public getGameQuestDetail(){
        return this.getBasePath() + '/studyGameQuest/getGameQuestDetail';
    }
    //获取关卡评论数量
    public getCommentsNum(){
        return this.getBasePath() + '/studyComment/getCommentsNum';
    }
    //获取评论信息
    public getCommentLs(){
        return this.getBasePath() + '/studyComment/getCommentLs';
    }
    //开始闯关(获取关卡基础信息)
    public beginGameQuest(){
        return this.getBasePath() + '/studyGameQuest/beginGameQuest';
    }
    //获取闯关内容信息
    public getQuestContent(){
        return this.getBasePath() + '/studyGameQuestContent/getQuestContent';
    }
    //保存闯关内容结果
    public saveQuestContentResult(){
        return this.getBasePath() + '/studyGameQuestContent/saveQuestContentResult/';
    }
    //获取本次闯关结果[不提供答案解析信息]
    public getQuestResult(){
        return this.getBasePath() + '/studyGameQuest/getQuestResult';
    }
    //获取上一次通过闯关结果
    public getLastPassQuestResult(){
        return this.getBasePath() + '/studyGameQuest/getLastPassQuestResult';
    }
    //下一关接口
    public getNextQuest(){
        return this.getBasePath() + '/studyGameQuest/getNextQuest';
    }
    /******************************闯关THE END***********************************/

    /****************************** 班级考试 ***********************************/
    //根据考试ID获取考试基本信息[GET]
    public getExamDetail(){
        return this.getBasePath() + '/exam/detail';
    }
    //根据考试ID获取考试基本信息[GET]
    public getstartNewExam(){
        return this.getBasePath() + '/exam/startNewExam';
    }
    //批量提交考试/交卷[POST]
    public submitExamWithQuestions(){
        return this.getBasePath() + '/exam/submitExamWithQuestions';
    }
    //根据考试ID获取用户最近考试结果[GET]
    public latestQuestionsByExamId(){
        return this.getBasePath() + '/exam/latestQuestionsByExamId';
    }
    /******************************班级考试THE END******************************/

    /******************************个人中心***********************************/
    //我的信息
    public getMyInfo(){
        return this.getBasePath() + '/personalCenter/myInfo';
    }
    //学习统计
    public getMyStudyStatistics(){
        return this.getBasePath() + '/personalCenter/myStudyStatistics';
    }
    //已学课程(按天算)
    public getMyStudyHistoryByDay(){
        return this.getBasePath() + '/personalCenter/myStudyHistoryByDay';
    }
    //已学课程（课程历史）
    public getMyStudyHistory(){
        return this.getBasePath() + '/personalCenter/myStudyHistory';
    }
    //修改个人信息
    public updateMyInfo(){
        return this.getBasePath() + '/personalCenter/updateMyInfo';
    }
    //获取我的评论
    public getMyCourseComments(){
        return this.getBasePath() + '/studyComment/getMyCourseComments';
    }
    //学习排行
    public getRankingChart(){
        return this.getBasePath() + '/personalCenter/rankingChart';
    }
    //部门层级列表
    public getMyDept(){
        return this.getBasePath() + '/personalCenter/deptHierarchyLs';
    }
    //我的排名
    public getMyRanking(){
        return this.getBasePath() + '/personalCenter/myRanking';
    }
    //我的课程收藏
    public getMyFavoritedCourses(){
        return this.getBasePath() + '/personalCenter/myFavoritedCourses';
    }
    //我的话题收藏
    public getMyFavoritedSubject(){
        return this.getBasePath() + '/personalCenter/myFavoritedSubject';
    }
    //个人积分概要
    public getMyIntegral(){
        return this.getBasePath() + '/personalCenter/myIntegralBriefInfo';
    }
    //个人积分明细
    public getIntegralAccountingDetail(){
        return this.getBasePath() + '/personalCenter/myIntegralAccountingDetail';
    }
    //积分说明之等级说明
    public getIntegralRanks(){
        return this.getBasePath() + '/personalCenter/integralRanks';
    }
    //积分说明之规则说明
    public getIntegralRules(){
        return this.getBasePath() + '/personalCenter/integralRules';
    }
    //积分说明之积分奖励
    public getIntegralRewards(){
        return this.getBasePath() + '/personalCenter/integralRewards';
    }
    //人群接口
    public getMyPersonGrp(){
        return this.getBasePath() + '/personalCenter/getMyPersonGrp';
    }
    //绑定手机号码
    public getBindMobile(){
        return this.getBasePath() + '/personalCenter/bindMobile';
    }
    //关于我们
    public aboutUs(){
        return this.getBasePath() + '/personalCenter/aboutUs';
    }

    //帮助中心
    // 获取问题类型列表
    public getTypeList(){
        return this.getBasePath() + '/helpAndSupport/qna/type/list?moduleValue=1';
    }
    // 获取问题列表
    public getQnaList(){
        return this.getBasePath() + '/helpAndSupport/qna/list';
    }
    //获取问题详情
    public getQnaDetail(){
        return this.getBasePath() + '/helpAndSupport/qna/detail';
    }
    /******************************个人中心 END***********************************/

    /******************************圈子***********************************/
    //分页列出我的圈子
    public getMyAllGroups(){
        return this.getBasePath() + '/community/myAllGroups';
    }

    //分页列出所有圈子
    public getQueryQvailableGroups(){
        return this.getBasePath() + '/community/queryAvailableGroups';
    }

    //分页列出全部热门话题
    public getListAllHotSubjects(){
        return this.getBasePath() + '/community/listAllHotSubjects';
    }

    //分页列出全部最新话题
    public getListAllNewSubjects(){
        return this.getBasePath() + '/community/listAllNewSubjects';
    }

    //分页列出我参与的话题
    public getMyAttendedSubjects(){
        return this.getBasePath() + '/community/myAttendedSubjects';
    }

    //分页列出我发起的话题
    public getMyPostedSubjects(){
        return this.getBasePath() + '/community/myPostedSubjects';
    }

    //分页列出我回复的话题
    public getMyReplySubjects(){
        return this.getBasePath() + '/community/myReplySubjects';
    }

    //分页列出@我的话题
    public getSubjectByInviteUser(){
        return this.getBasePath() + '/community/subjectByInviteUser';
    }

    //发表话题
    public postSubject(){
        return this.getBasePath() + '/discussGroup/postSubject';
    }

    //获取话题详情
    public getDiscussSubjectDetail(){
        return this.getBasePath() + '/discussSubject/detail';
    }

    //圈子简介
    public getBriefOfGroup(){
        return this.getBasePath() + '/community/briefOfGroup';
    }

    //分页获取话题评论列表（区分最新最热）
    public getCommentsOfSubject(){
        return this.getBasePath() + '/discussSubject/commentsOfSubject';
    }

    //发表话题评论
    public postComment(){
        return this.getBasePath() + '/discussSubject/postComment';
    }

    //加入圈子
    public postJoinCircle(){
        return this.getBasePath() + '/discussGroup/join';
    }

    //退出班级
    public postQuitCircle(){
        return this.getBasePath() + '/discussGroup/quit';
    }

    //删除话题
    public getDeleteTopic(){
        return this.getBasePath() + '/discussGroup/deleteSubject';
    }

    //修改话题
    public postUpdateSubject(){
        return this.getBasePath() + '/discussGroup/updateSubject';
    }

    //上传文件资源接口(统一上传接口)
    public postUploadFile(){
        return this.getBasePath() + '/sysOssUpload/uploadFile';
    }



    //发表投票
    public postVoteSubject(){
        return this.getBasePath() + '/discussGroup/postVoteSubject';
    }

    //记录用户完成投票
    public finishVoteSubject(){
        return this.getBasePath() + '/discussGroup/finishVoteSubject';
    }

    //获取圈子好友
    public getUrlCircleFriend(){
        return this.getBasePath() + '/discussSubject/getColleagueListInGroup';
    }

    /******************************圈子 END***********************************/

}
