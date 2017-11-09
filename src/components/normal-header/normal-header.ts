import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ThemeUtils } from '../../core/ThemeUtils';

@Component({
    selector: 'normal-header',
    templateUrl: 'normal-header.html'
})
export class NormalHeaderComponent {
    @Input() isHaveBack?: boolean = false;//返回键
    @Input() isHaveCancel?: boolean = false;//取消键
    @Input() isHaveHeaderMore?: boolean = false;//更多按钮
    @Input() isHaveHeaderSearch?: boolean = false;//搜索
    @Input() isHaveRightString?: boolean = false;//右边标题

    @Output() goBack = new EventEmitter();
    @Output() cancel = new EventEmitter();
    @Output() rightString = new EventEmitter();
    @Output() more = new EventEmitter();
    @Output() search = new EventEmitter();
    @Input() headerTitle?: string = '';//标题
    @Input() headerRightString?: string = '';//右边标题
    constructor(private themeUtils: ThemeUtils) {
    }

    clickBack(event: any) {
        this.goBack.emit(event);
    }

    clickCancel(event: any) {
        this.cancel.emit(event);
    }

    clickRightString(event: any) {
        this.rightString.emit(event);
    }

    clickMore(event: any) {
        this.more.emit(event);
    }

    clickSearch(event: any) {
        this.search.emit(event);
    }

    bindTitle() {
        let background = '#158be0';
        if (this.themeUtils.checkIsHaveThemePicture()) {
            background = this.themeUtils.getThemePicture();
        } else {
            background = this.themeUtils.getThemeColor();
        }
        let theme = { 'background': background };
        return theme;
    }

    initComponent(isHaveBack: boolean, isHaveCancel: boolean, headerTitle: string, isHaveHeaderMore: boolean, isHaveHeaderSearch: boolean, isHaveRightString: boolean, headerRightString: string) {
        this.isHaveBack = isHaveBack;
        this.isHaveCancel = isHaveCancel;
        this.isHaveHeaderMore = isHaveHeaderMore;
        this.isHaveHeaderSearch = isHaveHeaderSearch;
        if (headerTitle == '' || headerTitle == null) {
            this.headerTitle = '';
        } else {
            this.headerTitle = headerTitle;
        }

        if (headerRightString == '' || headerRightString == null) {
            this.headerRightString = '';
        } else {
            this.headerRightString = headerRightString;
        }
    }
}