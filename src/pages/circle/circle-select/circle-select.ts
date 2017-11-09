import { BasePage } from '../../../core/base-page/BasePage';
import { Injector, Component } from '@angular/core';
import { DiscussGroupVo } from '../../../models/circle/DiscussGroupVo';

@Component({
    selector: 'page-circle-select',
    templateUrl: 'circle-select.html'
})
export class SelectCirclePage extends BasePage {
    public myCircleList: Array<DiscussGroupVo>;//已加入的圈子
    public circleName: string = '';
    public circleId: number;
    constructor(injector: Injector) {
        super(injector);
        this.circleName = this.navParams.get('circleName');
        this.circleId = this.navParams.get('circleId');
        this.getMyCircleGroups();
    }
    //获取已加入的圈子列表
    getMyCircleGroups() {
        this.showLoading();
        let params = {
            userId: this.storageUtil.getUserId(),
            orgId: this.storageUtil.getOrgId(),
            pageNum: 1,
            pageSize: 0
        };
        this.httpUtil.get({
            url: this.apiUrls.getMyAllGroups(), param: params, success: (res) => {
                if (res.result == null || res.result == '') {
                    this.myCircleList = null;
                    return;
                }
                this.myCircleList = res.result;
            }, fail: (res) => {
                this.toast(res.msg);
            }, finish: () => {
                this.dismissLoading();
            }
        });
    }
    //选择圈子
    selectCircle(discussGroupVo:DiscussGroupVo) {
        this.storageUtil.setStorageValue("circleId",discussGroupVo.groupId);
        this.storageUtil.setStorageValue("circleName", discussGroupVo.name);
        this.storageUtil.setStorageValue("categoryId", discussGroupVo.category.id);
        this.navController.pop();
    }
}