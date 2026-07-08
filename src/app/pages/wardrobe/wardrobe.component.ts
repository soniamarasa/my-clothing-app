import { Component } from '@angular/core';

interface WardrobeTab {
  id: 'clothes' | 'shoes' | 'handbags' | 'accessories';
  label: string;
  icon: string;
}

@Component({
  standalone: false,
  selector: 'app-wardrobe',
  templateUrl: './wardrobe.component.html',
  styleUrls: ['./wardrobe.component.scss'],
})
export class WardrobeComponent {
  activeTab: WardrobeTab['id'] = 'clothes';

  readonly tabs: WardrobeTab[] = [
    { id: 'clothes', label: 'Roupas', icon: 'pi pi-user' },
    { id: 'shoes', label: 'Sapatos', icon: 'pi pi-directions' },
    { id: 'handbags', label: 'Bolsas', icon: 'pi pi-shopping-bag' },
    { id: 'accessories', label: 'Acessórios', icon: 'pi pi-glass' },
  ];
}
