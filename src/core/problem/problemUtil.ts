/**
 * Created by Administrator on 2017/1/5.  考试题目组件
 */
import {AfterViewInit, Compiler, Component, NgModule, ViewChild, ViewContainerRef,Input} from '@angular/core';
import { ToastController } from 'ionic-angular';
@Component({
    selector: 'problem-util',
    template: '<span #container></span>',
})
export class ProblemUtilPage implements AfterViewInit {
    @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
    @Input() str:string;
    constructor(public mycompiler: Compiler,public toastController:ToastController) {}

    ngAfterViewInit() {
        if(this.str.indexOf("$spaces$") > 0) {
            this.str = this.str.replace(/\$spaces\$/g,'<input type="text" (blur)="click()" class="game-input">');
        } else {
            this.str = '<span>'+this.str+'</span>';
        }
        this.addComponent(this.str);
    }

    private addComponent(template: string) {
        @Component({template: template})
        class TemplateComponent {
            click(){
                alert('sdfsdf');
            }
        }

        @NgModule({declarations: [TemplateComponent]})
        class TemplateModule {}
        console.log(this.mycompiler);
        const mod = this.mycompiler.compileModuleAndAllComponentsSync(TemplateModule);
        const factory = mod.componentFactories.find((comp) =>
            comp.componentType === TemplateComponent
        );
        const component = this.container.createComponent(factory);
    }

    // Toast
    toast(msg: any,time:number) {
        let toast = this.toastController.create({
            message: msg,
            duration: time * 1000
        });
        toast.present();
    }
}
