import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'page-capture-result',
    templateUrl: 'capture-result.html'
})

export class CaptureResultPage extends BasePage {
    public resUrl: any;
    public url: string;
    constructor(injector: Injector, private sanitizer: DomSanitizer) {
        super(injector);
        this.url = this.navParams.data.result;
        this.resUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    }

}