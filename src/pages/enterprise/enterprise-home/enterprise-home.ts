import { ClassListPage } from '../class/class-list/class-list';

/**
 * Created by Administrator on 2016/12/14.
 */
import { Component, Injector } from '@angular/core';
import { BasePage } from '../../../core/base-page/BasePage';
import { ModulePageVo } from '../../../models/class/ModulePageVo';
import { TaskPage } from '../task/task';
import { InformationListPage } from '../information/information-list/information-list';

@Component({
    selector: 'page-enterprise-home',
    templateUrl: 'enterprise-home.html'
})

export class EnterprisePage extends BasePage {
    public MODEL_CONFIG_COMPANY_JOB_PAGE: "MODEL_CONFIG_COMPANY_JOB_PAGE";
    public MODEL_CONFIG_COMPANY_CLASS_PAGE: "MODEL_CONFIG_COMPANY_CLASS_PAGE";
    public MODEL_CONFIG_COMPANY_MESSAGE_PAGE: "MODEL_CONFIG_COMPANY_MESSAGE_PAGE";
    public section = 'task';
    public enterpriseList: { pageCode: string } = { pageCode: this.MODEL_CONFIG_COMPANY_JOB_PAGE };
    public tab1=TaskPage;
    public tab2=ClassListPage;
    public tab3=InformationListPage;
    constructor(injector: Injector) {
        super(injector);
        //this.showLoading();
        this.getEnterpriseConfig();
    }

    // get enterprise configs
    getEnterpriseConfig() {
        let moduleConfig: any = this.storageUtil.getModuleConfig();
        for (let i in moduleConfig) {
            let itemConfig = moduleConfig[i];
            if (itemConfig.moduleCode == 'MODEL_CONFIG_COMPANY') {
                this.enterpriseList = itemConfig.modulePageConfgs;
            }
        }
    }


}
