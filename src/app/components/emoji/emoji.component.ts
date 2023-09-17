import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.scss'],
})
export class EmojiComponent implements OnInit {
  constructor() {}

  @Output() currentEmoji = new EventEmitter<string>();

  emoji(e: any) {
    this.currentEmoji.emit(e.emoji.native);
    // this.currentEmoji = ;
    // this.itemForm.controls['icon'].setValue(this.currentEmoji);
  }

  ngOnInit(): void {}
}
