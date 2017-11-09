import { BasePage } from '../../../../core/base-page/BasePage';
import { AfterViewInit, Compiler, Component, NgModule, ViewChild, ViewContainerRef, Injector } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavParams } from 'ionic-angular';


@Component({
    selector: 'page-information-html',
    templateUrl: 'information-html.html'
})
export class InformationHtmlPage extends BasePage{
    // @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
    // public strHtml: any;
    // constructor(
    //     private compiler: Compiler,
    //     public sanitize: DomSanitizer,
    //     public navParams: NavParams) {
    //     this.strHtml = this.navParams.data.strHtml;
    // }

    // ngAfterViewInit() {
    //     this.addComponent(this.strHtml);
    // }

    // private addComponent(template: string) {
    //     @Component({ template: template })
    //     class TemplateComponent {

    //     }

    //     @NgModule({ declarations: [TemplateComponent] })
    //     class TemplateModule { }

    //     const mod = this.compiler.compileModuleAndAllComponentsSync(TemplateModule);
    //     const factory = mod.componentFactories.find((comp) =>
    //         comp.componentType === TemplateComponent
    //     );
    //     const component = this.container.createComponent(factory);
    // }
    public contents: string = '';
    public pageTitle: string;
    public sanitizeHtml: any;
    public objType: number;
    constructor(injector: Injector,
                private sanitize: DomSanitizer) {
        super(injector);
        this.objType = this.navParams.data.objType;
        if (this.objType == 1) {
            this.pageTitle = '新闻';
        } else {
            this.pageTitle = '公告';
        }
        this.contents = this.navParams.data.strHtml;
        this.sanitizeHtml = this.sanitize.bypassSecurityTrustHtml(this.contents);
    }
}