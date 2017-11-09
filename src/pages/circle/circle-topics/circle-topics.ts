import { BasePage } from '../../../core/base-page/BasePage';
import { Component, Injector, ViewChild } from '@angular/core';
import { CircleHotTopicPage } from '../circle-hot-topic/circle-hot-topic';
import { CircleNewTopicPage } from '../circle-new-topic/circle-new-topic';
import { AttendTopicPage } from '../circle-attend-topic/circle-attend-topic';
import { CirclePostPage } from '../circle-post/circle-post';
import { PopoverController, Events, Tabs } from 'ionic-angular';
import { CircleVotePage } from "../circle-vote/circle-vote";
import { EventsConstants } from '../../../core/EventsConstants';
import { PopoverPage } from '../circle-popoverpage/circle-popoverpage';

@Component({
    selector: 'page-circle-topics',
    templateUrl: 'circle-topics.html'

})
export class CircleTopicsPage extends BasePage {
    @ViewChild('myTabs') tabRef: Tabs;
    public tab1 = CircleHotTopicPage;
    public tab2 = CircleNewTopicPage;
    public tab3 = AttendTopicPage;
    public circleOptions: any;
    public isShow: boolean = true;
    public ATTEND_TYPE: number = 1;//1、我参与的 2、我发起的 3、我回复的 4、@我的
    public POST_TYPE: number = 2;
    public REPLY_TYPE: number = 3;
    public INVITE_TYPE: number = 4;
    public selected: number;//上次选择的状态数据
    constructor(injector: Injector, public popoverCtrl: PopoverController, public events: Events) {
        super(injector);
        this.circleOptions = {
            title: '筛选话题类型',
        };
    }
    //发表话题
    goPostTopic() {
        this._app.getRootNav().push(CirclePostPage);
    }

    //进入发起投票
    openCircleVote() {
        this._app.getRootNav().push(CircleVotePage);
    }
    ionViewWillEnter() {
        this.events.subscribe(EventsConstants.FILTER_TOPIC, (data: number) => {
            this.selected = data;
            if (data == this.ATTEND_TYPE) {
                this.tabRef.getByIndex(2).tabTitle = '我参与的';
            } else if (data == this.POST_TYPE) {
                this.tabRef.getByIndex(2).tabTitle = '我发起的';
            } else if (data == this.REPLY_TYPE) {
                this.tabRef.getByIndex(2).tabTitle = '我回复的';
            } else if (data == this.INVITE_TYPE) {
                this.tabRef.getByIndex(2).tabTitle = '@我的';
            }
        });
        this.events.subscribe(EventsConstants.POST_TOPIC, () => {
            this.tabRef.select(1)
        });
    }
    ionViewWillUnload() {
        this.events.unsubscribe(EventsConstants.POST_TOPIC);
        this.events.unsubscribe(EventsConstants.FILTER_TOPIC);
    }

    selectTopic(ev) {
        if (this.tabRef.getByIndex(2).isSelected == false) {
            this.tabRef.select(2)
        } else {
            let popover = this.popoverCtrl.create(PopoverPage, { data: this.selected });
            popover.present({
                ev: ev
            });
        }
    }
}
