import { BasePage } from '../../../core/base-page/BasePage';
import { Component, Injector, ViewChild } from '@angular/core';
import { Events, ViewController } from 'ionic-angular';
import { EventsConstants } from '../../../core/EventsConstants';



@Component({
    selector: '.circle-popoverpage-page',
    templateUrl: 'circle-popoverpage.html'
})
export class PopoverPage extends BasePage {
    public selected: number;
    public ATTEND_TYPE: number = 1;//1、我参与的 2、我发起的 3、我回复的 4、@我的
    public POST_TYPE: number = 2;
    public REPLY_TYPE: number = 3;
    public INVITE_TYPE: number = 4;
    public attendChecked: boolean = false;
    public postChecked: boolean = false;
    public replyChecked: boolean = false;
    public inviteChecked: boolean = false;
    constructor(injector: Injector, public events: Events, public viewCtrl: ViewController) {
        super(injector);
        this.selected = this.navParams.get('data');
        if (this.selected == this.ATTEND_TYPE) {
            this.attendChecked = true;
            this.postChecked = false;
            this.replyChecked = false;
            this.inviteChecked = false;
        } else if (this.selected == this.POST_TYPE) {
            this.attendChecked = false;
            this.postChecked = true;
            this.replyChecked = false;
            this.inviteChecked = false;

        } else if (this.selected == this.REPLY_TYPE) {
            this.attendChecked = false;
            this.postChecked = false;
            this.replyChecked = true;
            this.inviteChecked = false;
        } else if (this.selected == this.INVITE_TYPE) {
            this.attendChecked = false;
            this.postChecked = false;
            this.replyChecked = false;
            this.inviteChecked = true;
        } else {
            this.attendChecked = true;
            this.postChecked = false;
            this.replyChecked = false;
            this.inviteChecked = false;
        }
    }
    //筛选话题类型
    topicType(type: number) {
        this.events.publish(EventsConstants.FILTER_TOPIC, type);
        this.viewCtrl.dismiss();
    }
}