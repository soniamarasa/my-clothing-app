import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ILook } from '@interfaces/look';
import { getContrastTextColor } from '../../utils/color-contrast';

@Component({
  standalone: false,
  selector: 'app-look-card',
  templateUrl: './look-card.component.html',
  styleUrls: ['./look-card.component.scss'],
})
export class LookCardComponent {
  @Input({ required: true }) look!: ILook;
  @Input() showRemove = true;
  @Output() edit = new EventEmitter<ILook>();
  @Output() remove = new EventEmitter<ILook>();

  textColor(color: string | undefined): string {
    return getContrastTextColor(color);
  }

  onEdit(): void {
    this.edit.emit(this.look);
  }

  onRemove(event: Event): void {
    event.stopPropagation();
    this.remove.emit(this.look);
  }
}
