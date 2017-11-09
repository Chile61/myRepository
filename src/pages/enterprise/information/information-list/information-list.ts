import { InformationVo } from '../../../../models/class/InformationVo';
import { Component, Injector } from '@angular/core';
import { BasePage } from '../../../../core/base-page/BasePage';
import { AnnouncementPage } from '../information-announcement/information-announcement';
import { InformationNewsPage } from '../information-news/information-news';
import { Headers, RequestOptions, Http } from '@angular/http';
import { InformationHtmlPage } from '../information-html/information-html';


@Component({
    selector: 'page-information-list',
    templateUrl: 'information-list.html'
})
export class InformationListPage extends BasePage {
    private pageNum: number = 1;
    private pageSize: number = 10;
    public newList: Array<InformationVo>;
    public canLoadMore: boolean = false;
    private informationUrl: any = [[]];
    constructor(
        injector: Injector,
        private http: Http) {
        super(injector);
        this.getInformationList();
    }

    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.getInformationList(refresher);
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
    getInformationList(refresher?: any) {
        this.showLoading();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            title: '',
            pageNum: this.pageNum,
            pageSize: this.pageSize

        }
        this.httpUtil.get({
            url: this.apiUrls.getNewList(), param: params, success: (res) => {
                if (this.pageNum == 1) {
                    this.newList = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.newList = this.newList.concat(res.result);
                this.getInformationUrl(this.newList);
                if (res.result.length >= this.pageSize) {
                    this.canLoadMore = true;
                } else {
                    this.canLoadMore = false;
                }
            }, fail: (res) => {
                this.toast(res.msg);
            }, finish: () => {
                if (refresher != null) {
                    refresher.complete();
                }
                this.dismissLoading();
            }
        });
    }
    //获取资讯的配图
    getInformationUrl(newList: any) {
        for (let i = 0; i < newList.length; i++) {
            if(newList[i].url){
                this.informationUrl[i]=newList[i].url.split(';');
            }
        }
    }
    //去资讯详情页 type 1为富文本，2为纯文本，3为超链接 objType: 1、新闻  2、公告）
    goNewsDetail(InformationVo) {
        if (InformationVo.type == 2) {//纯文本
            this.log(InformationVo.type);
            this._app.getRootNav().push(AnnouncementPage, { title: InformationVo.title, content: InformationVo.content, time: InformationVo.time, objType: InformationVo.objType });
        } else if (InformationVo.type == 1) {//富文本
            let myUrl: string;
            let newUrl = this.apiUrls.getNewDetails();
            myUrl = newUrl + '?newsId=' + InformationVo.id + '&userId=' + this.storageUtil.getUserId() + '&orgId=' + this.storageUtil.getOrgId();
            let token = this.storageUtil.getAccessToken();
            let header = new Headers({ 'X-Access-Token': token });
            let options = new RequestOptions({ headers: header });
            this.http.get(myUrl, options).map(res => res).subscribe((res) => {
                let body: any = res;
                this._app.getRootNav().push(InformationHtmlPage, { strHtml: body._body, objType: InformationVo.objType });
            }, (err) => {
                this.toast(err);
            });
        } else {
            this._app.getRootNav().push(InformationNewsPage, { id: InformationVo.newId, title: InformationVo.title, content: InformationVo.content, objType: InformationVo.objType, type: InformationVo.type });
        }
    }
}