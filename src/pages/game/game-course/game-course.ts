import {Component, ViewChild, Injector} from '@angular/core';
import {NavController, Events} from 'ionic-angular';

import 'rxjs/add/operator/map';
import {CourseDetailPage} from '../../study/course-detail/course-detail';
import {GameExamPage} from '../game-exam/game-exam';
import {BasePage} from "../../../core/base-page/BasePage";
import {Constants} from "../../../core/Constants";

@Component({
    selector: 'page-game-course',
    templateUrl: 'game-course.html'
})
export class GameCoursePage extends BasePage {
    @ViewChild('content') public content: NavController;
    public num: number = 0;
    numTotal: number;
    private courseId: number;
    boolSubmit: boolean;
    private questionContent: any;
    private gameId: string;
    private questId: string;
    questContentObjType;

    constructor(injector: Injector,
                public events: Events) {
        super(injector);
        this.gameId = this.navParams.get('gameId');
        this.questId = this.navParams.get('questId');
        this.beginGameQuest();
    }

    //开始闯关(获取关卡基础信息)
    beginGameQuest() {
        this.httpUtil.get({
            url: this.apiUrls.beginGameQuest(),
            param: {
                'userId': this.storageUtil.getUserId(),
                'orgId': this.storageUtil.getOrgId(),
                'gameId': this.gameId,
                'questId': this.questId
            },
            success: (data) => {
                console.log("开始闯关(获取关卡基础信息)");
                console.log(data);
                let result = data.result;
                this.numTotal = result.questMiniContentVoLs.length;
                sessionStorage.setItem("gameInstId", result.gameInstId);
                sessionStorage.setItem("questInstId", result.questInstId);
                this.questionContent = result;
                this.courseId = result.questMiniContentVoLs[0].questContentObjId;
                this.getQuestContent(
                    result.questMiniContentVoLs[0].questContentId,
                    result.questMiniContentVoLs[0].questContentObjId,
                    result.questMiniContentVoLs[0].questContentObjType,
                    result.questInstId
                )
            },
            fail: (data) => {
                this.toast(data);
                // console.log(data)
            }
        });
    }

    //获取闯关内容信息
    getQuestContent(questContentId, questContentObjId, questContentObjType, questInstId) {

        this.httpUtil.get({
            url: this.apiUrls.getQuestContent(),
            param: {
                'userId': this.storageUtil.getUserId(),    //用户ID
                'orgId': this.storageUtil.getOrgId(),      //机构ID
                'questInstId': questInstId,                  //关卡实例ID
                'questContentId': questContentId,            //关卡内容ID
                'questContentObjId': questContentObjId,      //内容对像ID
                'questContentObjType': questContentObjType   //内容对像类型（1课程，2考试，3练习，4调研）
            },
            success: (data) => {
                this.log("获取闯关内容信息");
                this.log(data);

                let result = data.result;
                //切换是否最后一题，提交按钮
                if (this.num == this.numTotal - 1) {
                    this.boolSubmit = true;
                } else {
                    this.boolSubmit = false;
                }
                //内容对像类型（1课程，2考试，3练习，4调研）
                // console.log('内容对像类型');
                this.questContentObjType = result.questContentObjType;
                // console.log(this.questContentObjType);
                if (result.questContentObjType == 1) {
                    //课程
                    this.courseId = data.result.courseDetailVo.courseId;
                    this.content.push(CourseDetailPage, {
                        courseId: this.courseId,
                        fromWhere: Constants.FROM_PASS
                    });
                } else if (result.questContentObjType == 2) {
                    //考试
                    this.content.push(GameExamPage, {GameExamResult: result});
                } else if (result.questContentObjType == 3) {
                    //练习
                    this.content.push(GameExamPage, {GameExamResult: result});
                } else {
                    //调研
                }
            },
            fail: (data) => {
                this.toast(data.msg);
                this.navController.pop();
            }
        });
    }

    //下一页
    nextFun() {
        //判断内容对像类型
        if (this.questContentObjType == 2 || 3) {
            // console.log('考试或者练习');
            this.events.publish('sub-result', {
                gameId: this.gameId,
                questId: this.questId,
                nav: this.navController,
                lastPage: false,
                num: this.num
            });
        }else {
            // console.log('课程或者调研')
        }

        if (this.num < this.numTotal - 1) {
            this.num++;
            if (this.num < this.questionContent.questMiniContentVoLs.length) {
                this.getQuestContent(
                    this.questionContent.questMiniContentVoLs[this.num].questContentId,
                    this.questionContent.questMiniContentVoLs[this.num].questContentObjId,
                    this.questionContent.questMiniContentVoLs[this.num].questContentObjType,
                    this.questionContent.questInstId
                )
            }
        } else {
            this.toast('没有下一页');
        }
    }

    //上一页
    prevFun() {
        if (this.num > 0) {
            this.num--;
            if (this.num < this.questionContent.questMiniContentVoLs.length) {
                this.getQuestContent(
                    this.questionContent.questMiniContentVoLs[this.num].questContentId,
                    this.questionContent.questMiniContentVoLs[this.num].questContentObjId,
                    this.questionContent.questMiniContentVoLs[this.num].questContentObjType,
                    this.questionContent.questInstId
                )
            }
        } else {
            this.toast('没有上一页');

        }
    }

    //提交试卷，计算分数
    openGameResult() {
        console.log("提交");
        //静态方法
        // GameExamPage.aa();
        // console.log(this.examQuestionParamsArr)
        //执行嵌入页面里的方法
        this.events.publish('sub-result-all', {
            gameId: this.gameId,
            questId: this.questId,
            nav: this.navController,
            lastPage: true,
            num: this.num
        });
    }

    //页面注消时执行
    ionViewWillUnload() {
        this.events.unsubscribe('sub-result');
    }

    //退出闯关
    bindOutgame() {
        let alert = this.alertCtrl.create({
            title: '提示',
            message: '你确定要放弃本次闯关?',
            buttons: [
                {
                    text: '确定',
                    role: 'cancel',
                    handler: () => {
                        this.navController.pop();
                    }
                },
                {
                    text: '取消',
                    handler: () => {
                        console.log('取消');
                    }
                }
            ]
        });
        alert.present();
    }
}
