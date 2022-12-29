import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-pager',
    templateUrl: './pager.component.html',
    styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {
    @Input() totalCount: number;
    @Input() pageSize: number;

    // we want to call the method 'onPageChanged' from parent, but from our child component
    // we wanna take the pageChanged event and even tho we're going to be inside the child component
    // we still want it to be able to call the mehtod inside the parent
    @Output() pageChanged = new EventEmitter<number>();

    constructor() {}

    ngOnInit(): void {}

    onPagerChange(event: any) {
        this.pageChanged.emit(event.page);
    }
}
