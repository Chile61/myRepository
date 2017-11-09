import {Component, Injector, ViewChild} from '@angular/core';
import {BasePage} from "../../../core/base-page/BasePage";
import {CommentView} from "../../../components/comment-view/comment-view";
import {EmojiUtils} from "../../../core/EmojiUtils";
import {Constants} from "../../../core/Constants";
import {CircleDetailPage} from "../circle-detail/circle-detail";
@Component({
    selector: 'page-circle-vote-detail',
    templateUrl: 'circle-vote-detail.html'
})
export class CircleVoteDetailPage extends BasePage {
    public subjectId: number;
    public objId: number;
    public objType: number;
    public questionsVos: any;
    public examResultId: number;
    public finishFlag: boolean;
    public questionsVosArr: any;
    public groupName:string;
    public title:string;
    public nickName:string;
    public avatarUrl:string;
    public createDate:number;
    public SelectobjType:number;

    public myCircle:any;

    //评论
    private pageNum: number = 1;
    public gameComments: any = [];
    private pageSize: number = 100;
    public canLoadMore: boolean = false;
    private questionId: number = 0;
    private commentType: string = '02';//01,最新 02,最热
    public courseComments:any = [];

    @ViewChild('CommentView') commentView: CommentView;//评论控件

    private parentId: number = 0;

    constructor(injector: Injector,
                private emojiUtils: EmojiUtils) {
        super(injector);
        this.subjectId = this.navParams.get('subjectId');
        this.getDiscussSubjectDetail();
        this.getCommentsOfSubject();
    }

    //获取投票详情(和获取话题详情一样)
    getDiscussSubjectDetail() {
        this.httpUtil.get({
            url: this.apiUrls.getDiscussSubjectDetail(),
            param: {
                'userId': this.storageUtil.getUserId(),
                'orgId': this.storageUtil.getOrgId(),
                'subjectId': this.subjectId
            },
            success: (data) => {
                console.log('获取投票详情(和获取话题详情一样)');
                console.log(data);
                let result = data.result;

                this.myCircle=result;

                this.objId = result.objId;
                this.objType = result.objType;
                this.questionId = result.objId;
                this.finishFlag = result.finishFlag;
                this.groupName=result.groupName;   //圈子名称
                this.title=result.title;        //主题标题
                this.nickName=result.author.nickName;   //昵称
                this.avatarUrl=result.author.avatarUrl  //头像图片URL
                this.createDate=result.createDate; //创建时间
                this.SelectobjType=result.objType; //单选，多选
                if (this.finishFlag == true) {
                    //已投票
                    this.getLatestQuestionsByExamId();
                } else {
                    //未投票
                    this.getStartNewExamFun();
                }

            },
            fail: (data) => {
                console.log(data)
            }
        });
    }

    //已投票
    getLatestQuestionsByExamId() {
        this.httpUtil.get({
            url: this.apiUrls.latestQuestionsByExamId(),
            param: {
                'orgId': this.storageUtil.getOrgId(),
                'userId': this.storageUtil.getUserId(),
                'examId': this.objId
            },
            success: (data) => {
                console.log('开始新的考试(先创建考试结果对象,再获取试题列表)[POST](详情页) (已投票)');
                console.log(data);
                // this.questionsVos=data.result;
                this.questionsVosArr = data.result;
            },
            fail: (data) => {
                // this.toast(data.msg);
            }
        });
    }

    //未投票
    getStartNewExamFun() {
        this.httpUtil.post({
            url: this.apiUrls.getstartNewExam() + '/' + this.storageUtil.getOrgId() + '/' + this.storageUtil.getUserId() + '/1/' + this.objId,
            param: {
                'userId': this.storageUtil.getUserId(),
                'orgId': this.storageUtil.getOrgId(),
                'objId': this.objId,
                'objType': 1
            },
            success: (data) => {
                console.log('开始新的考试(先创建考试结果对象,再获取试题列表)[POST](详情页) (未投票)');
                console.log(data);
                this.questionsVos = data.result;
                this.examResultId = this.questionsVos[0].examResultId;

                //将所有选项加一select属性为false
                for (let i = 0; i < this.questionsVos.length; i++) {
                    for (let j = 0; j < this.questionsVos[i].examQuestionVo.examQuestionOptionVos.length; j++) {
                        this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select = false;
                    }
                }

            },
            fail: (data) => {
                // this.toast(data.msg);
            }
        });
    }

    //转百分比
    bindShowNumPercentage(absPercent) {
        let percent = (absPercent * 100).toFixed(0);
        let num = {
            'width': percent + '%'
        };
        return num;
    }

    //转成 A B C D
    conversionFun(num) {
        let numE = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
            'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
            'U', 'V', 'W', 'X', 'Y', 'Z'
        ];
        return numE[num];
    }

    //单选,判断
    getRadion(probId, id) {
        //选中的加上一个属性select=true
        for (let i = 0; i < this.questionsVos.length; i++) {
            if (this.questionsVos[i].probId == probId) {
                for (let j = 0; j < this.questionsVos[i].examQuestionVo.examQuestionOptionVos.length; j++) {
                    this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select = false;
                    if (this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].id == id) {
                        this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select = true;
                    }
                }
            }
        }
        console.log(this.questionsVos)
    }

    //多选
    getCheckbox(probId, id) {
        for (let i = 0; i < this.questionsVos.length; i++) {
            if (this.questionsVos[i].probId == probId) {
                for (let j = 0; j < this.questionsVos[i].examQuestionVo.examQuestionOptionVos.length; j++) {
                    if (this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].id == id) {
                        if (this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select == true) {
                            this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select = false;
                        } else {
                            this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select = true;
                        }
                    }
                }
            }
        }
        console.log(this.questionsVos)
    }

    //记录用户完成投票（新增）
    finishVoteSubjectFun() {

        let examQuestionParams: any = [];  //所答题目
        let probResult: any;   //用户所答内容
        for (let i = 0; i < this.questionsVos.length; i++) {
            let questionTypeId = this.questionsVos[i].examQuestionVo.questionTypeId;

            let optionIds = [];
            let optionResults = [];
            //单选题计分
            if (questionTypeId == 1) {
                for (let j = 0; j < this.questionsVos[i].examQuestionVo.examQuestionOptionVos.length; j++) {
                    //用户选择答案
                    if (this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select == true) {
                        optionIds.push(parseInt(this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].id));
                        optionResults.push((this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].id).toString());
                    }
                }
            }
            //多选题计分
            else if (questionTypeId == 2) {
                let AllSelect: boolean = false;
                for (let j = 0; j < this.questionsVos[i].examQuestionVo.examQuestionOptionVos.length; j++) {
                    //用户选择答案
                    if (this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select == true) {
                        optionIds.push(parseInt(this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].id));
                        optionResults.push((this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].id).toString());
                    }
                }
            }

            //所答题目
            let json = {
                'examResultId': this.questionsVos[i].examResultId,                          //考试结果ID
                'groupId': 0,                                    //题目组ID
                'probId': this.questionsVos[i].probId,                                      //试题ID
                'probResult': '',               //用户作答结果
                'optionIds': optionIds,                                                     //用户选择的选项集
                'optionResults': optionResults,                                             //用户的选项结果集(如自定义作答)
                'usedTime': 1,
                'questionTypeId': this.questionsVos[i].examQuestionVo.questionTypeId        //试题类型
            };
            examQuestionParams.push(json);
            console.log(examQuestionParams)

        }


        this.httpUtil.post({
            url: this.apiUrls.finishVoteSubject() + '/' + this.storageUtil.getOrgId() + '/' + this.storageUtil.getUserId() + '/' + this.subjectId,
            param: {
                'finishType': 1,
                'examId': this.objId,
                'examResultId': this.examResultId,
                'operType': 1,
                'discussVoteObject': {'examQuestionParams': examQuestionParams}
            },
            success: (data) => {
                console.log('记录用户完成投票');
                console.log(data);
                this.getLatestQuestionsByExamId();
                this.finishFlag = true;
            },
            fail: (data) => {
                this.toast(data.msg);
            }
        });
    }

    //获取投票评论
    getCommentsOfSubject(refresher?: any) {
        let url = this.apiUrls.getCommentsOfSubject();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            subjectId: this.subjectId,
            orderType: this.commentType,
            pageNum: this.pageNum,
            pageSize: this.pageSize
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                console.log('新分页获取话题评论（区分最新、最热')
                console.log(res);
                this.courseComments=res.result;
                console.log(this.courseComments.length)
                if (this.pageNum == 1) {
                    this.gameComments = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.gameComments = this.gameComments.concat(res.result);
                if (res.result.length >= this.pageSize) {
                    this.canLoadMore = true;
                } else {
                    this.canLoadMore = false;
                }
            }, fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                if (refresher != null) {
                    refresher.complete();
                }
                this.dismissLoading();
            }
        });
    }

    //表情标签转图片
    transSmils(commentContent: string) {
        return this.emojiUtils.transSmiles(commentContent);
    }

    //课程评论点赞
    thumbUpCourseComment(index: number) {
        if (this.gameComments[index].hasAppraised == true) {
            this.toast('你已经点过赞啦');
            return;
        }
        this.showLoading();
        let url = this.apiUrls.getUrlUserAppraise() + '/'
            + this.storageUtil.getOrgId() + '/'
            + this.storageUtil.getUserId() + '/'
            + Constants.COURSE_COMMENT_UP + '/' + this.gameComments[index].commentId;
        this.httpUtil.post({
            url: url, success: (res) => {
                this.gameComments[index].hasAppraised = true;
                this.gameComments[index].awesomeCount++;
            }, fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                this.dismissLoading();
            }
        });
    }

    //评论回复
    replyInput(parentId: number) {
        this.commentView.showInput(false, false, false);
        this.parentId = parentId;
    }

    //发送评论
    postComment(Content: any) {
        this.showLoading();
        let url = this.apiUrls.postComment() + '/' + this.storageUtil.getOrgId() + '/' + this.storageUtil.getUserId() + '/' + this.subjectId;
        let params = {
            userId: this.storageUtil.getUserId(),
            parentId: this.parentId,
            objId: this.questionId,
            content: Content.commentContent

        };
        this.httpUtil.post({
            url: url, param: params, success: (res) => {
                console.log('发送评论成功')
                this.pageNum = 1;
                this.showLoading();
                this.getCommentsOfSubject();
                this.commentView.closeCommentInput();
                this.parentId = 0;
            }, fail: (err) => {
                this.toast(err);
            }, finish: () => {
                this.dismissLoading();
            }
        });
    }

    //取消发送评论
    cancelInputComment() {
        this.parentId = 0;
    }

    //上拉更新，下拉加载
    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.showLoading();
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.getCommentsOfSubject(refresher);
    }

    //切换最新最热评论
    selectCommentType(commentType: string) {
        if (this.commentType == commentType) {
            return;
        }
        this.commentType = commentType;
        this.pageNum = 1;
        this.showLoading();
        this.getCommentsOfSubject();
    }

    //跳转到圈子详情
    openCircleDetail(){
        this.navController.push(CircleDetailPage,{
            'myCircle':this.myCircle
        })
    }
}
