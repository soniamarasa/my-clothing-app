import { Component, Input, OnChanges } from '@angular/core';
import { getGravatarUrl } from '@utils/gravatar.util';

@Component({
  standalone: false,
  selector: 'app-user-img',
  templateUrl: './user-img.component.html',
  styleUrls: ['./user-img.component.scss'],
})
export class UserImgComponent implements OnChanges {
  @Input() gender!: string;
  @Input() email!: string;
  @Input() size = 100;

  gravatarUrl = '';

  ngOnChanges(): void {
    this.gravatarUrl = getGravatarUrl(this.email, this.size);
  }
}
