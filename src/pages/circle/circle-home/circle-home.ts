import { BasePage } from '../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { ClassListPage } from '../../enterprise/class/class-list/class-list';
import { TaskPage } from '../../enterprise/task/task';
import { CirclePage } from '../circle-circles/circle-circles';
import { CircleTopicsPage } from '../circle-topics/circle-topics';
import { ConfigKey } from '../../../core/storage/ConfigKey';
import { ThemeUtils } from '../../../core/ThemeUtils';

@Component({
    selector: 'page-circle-home',
    templateUrl: 'circle-home.html'
})

export class CircleHomePage extends BasePage {
    public MODEL_CONFIG_COMMUNITY_PAGE: "MODEL_CONFIG_COMMUNITY_PAGE";//圈子
    public MODEL_CONFIG_COMMUNITY_TOPIC_PAGE: "MODEL_CONFIG_COMMUNITY_TOPIC_PAGE";//话题
    public circleList: { pageCode: string } = { pageCode: this.MODEL_CONFIG_COMMUNITY_PAGE };
    tab1 = CirclePage;
    tab2 = CircleTopicsPage;
    constructor(injector: Injector,private themeUtile:ThemeUtils) {
        super(injector);
        this.getCircleConfig();
    }
    setTheme(){
        let background = this.themeUtile.getThemeColor();
    }
    //获取圈子配置
    getCircleConfig() {
        let moduleConfig: any = this.storageUtil.getModuleConfig();
        for (let i = 0; i < moduleConfig.length; i++) {
            if (moduleConfig[i].moduleCode == 'MODEL_CONFIG_COMMUNITY') {
                this.circleList = moduleConfig[i].modulePageConfgs;
                let attributes: any = moduleConfig[i].attributes;
                for (let j = 0; j < attributes.length; j++) {
                    if (attributes[j].attrCode == 'COMMENT_MAX_LENGTH') {//评论字数最大限制
                        this.storageUtil.setStorageValue(ConfigKey.CIRCLE_COMMENT_MAX_LENGTH, attributes[j].attrValue);
                    } else if (attributes[j].attrCode == 'TOP_SUBJECT_NUM') {//置顶话题的数量
                        this.storageUtil.setStorageValue(ConfigKey.CIRCLE_TOP_SUBJECT_NUM, attributes[j].attrValue);
                    } else if (attributes[j].attrCode == 'DISCUSS_SUBJECT_OFFER_BUTTON') {//是否显示打赏按钮标识
                        this.storageUtil.setStorageValue(ConfigKey.CIRCLE_DISCUSS_SUBJECT_OFFER_BUTTON, attributes[j].attrValue);
                    } else if (attributes[j].attrCode == 'OFFER_SUBJECT_MAX_NUMS') {//打赏话题的最大值
                        this.storageUtil.setStorageValue(ConfigKey.CIRCLE_OFFER_SUBJECT_MAX_NUMS, attributes[j].attrValue);
                    } else if (attributes[j].attrCode == 'ALLOW_ANONYMOUS_FLAG') {//是否允许匿名
                        this.storageUtil.setStorageValue(ConfigKey.CIRCLE_ALLOW_ANONYMOUS_FLAG, attributes[j].attrValue);
                    }
                }
            }
        }
    }
}