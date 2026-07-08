import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarDay, formatMonthLabel } from '../../utils/calendar';
import { IPlannedLook } from '@interfaces/plannedLook';
import {
  getPlannedLookSummary,
  isPlannedLookUsed,
} from '../../utils/planned-look-label';

@Component({
  standalone: false,
  selector: 'app-planned-looks-calendar',
  templateUrl: './planned-looks-calendar.component.html',
  styleUrls: ['./planned-looks-calendar.component.scss'],
})
export class PlannedLooksCalendarComponent {
  @Input() days: CalendarDay[] = [];
  @Input() month = new Date().getMonth();
  @Input() year = new Date().getFullYear();
  @Input() selectedDate: Date | null = null;
  @Input() selectedDayLooks: IPlannedLook[] = [];
  @Input() canMarkAsUsed = false;

  @Output() prevMonth = new EventEmitter<void>();
  @Output() nextMonth = new EventEmitter<void>();
  @Output() today = new EventEmitter<void>();
  @Output() selectDay = new EventEmitter<CalendarDay>();
  @Output() openLook = new EventEmitter<IPlannedLook>();
  @Output() markAsUsed = new EventEmitter<IPlannedLook>();

  readonly weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  get monthLabel(): string {
    return formatMonthLabel(this.month, this.year);
  }

  summary(plannedLook: IPlannedLook): string {
    return getPlannedLookSummary(plannedLook);
  }

  isUsed(plannedLook: IPlannedLook): boolean {
    return isPlannedLookUsed(plannedLook);
  }

  isSelected(day: CalendarDay): boolean {
    if (!this.selectedDate) {
      return false;
    }

    return day.date.toDateString() === this.selectedDate.toDateString();
  }

  onSelectDay(day: CalendarDay): void {
    this.selectDay.emit(day);
  }

  onOpenLook(event: Event, plannedLook: IPlannedLook): void {
    event.stopPropagation();
    this.openLook.emit(plannedLook);
  }

  onMarkAsUsed(event: Event, plannedLook: IPlannedLook): void {
    event.stopPropagation();
    this.markAsUsed.emit(plannedLook);
  }
}
