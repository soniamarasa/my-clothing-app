import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDialog } from './item-dialog.component';

describe('ItemDialog', () => {
	let component: ItemDialog;
	let fixture: ComponentFixture<ItemDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ItemDialog],
		}).compileComponents();

		fixture = TestBed.createComponent(ItemDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
