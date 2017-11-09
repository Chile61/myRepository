import { BasePage } from '../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { DiscussGroupVo } from '../../../models/circle/DiscussGroupVo';

@Component({
    selector:'page-circle-introduction',
    templateUrl:'circle-introduction.html'
})
export class CircleIntroductionPage extends BasePage{
    public myCircle:DiscussGroupVo;
    constructor(injector:Injector){
        super(injector);
        this.myCircle=this.navParams.get('myCircle');
    }
}