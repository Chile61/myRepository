import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { TimePipe } from '../../core/TimePipe';
import { CommentView } from "../../components/comment-view/comment-view";
import { NormalHeaderComponent } from '../../components/normal-header/normal-header';

@NgModule({
    bootstrap: [IonicApp],
    imports: [
        IonicModule
    ],
    declarations: [
        TimePipe,
        CommentView,
        NormalHeaderComponent
    ],
    entryComponents: [CommentView,NormalHeaderComponent],
    providers: [],
    exports: [IonicModule, TimePipe, CommentView, NormalHeaderComponent]
})
export class ShareModule {
}
