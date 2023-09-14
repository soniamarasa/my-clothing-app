import { Component, OnInit } from '@angular/core';
import { UsersFacade } from '@facades/users.facade';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  items: MenuItem[] | undefined;

  constructor(private userFacade: UsersFacade) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Coleções',
        icon: 'fa-solid fa-grip',
        items: [
          {
            label: 'Acessórios',
            icon: 'fa-solid fa-socks',
            routerLink: '/accessories',
          },
          {
            label: 'Bandanas',
            icon: 'fa-solid fa-hat-wizard',
            routerLink: '/bandanas',
          },

          {
            label: 'Bolsas',
            icon: 'fa-solid fa-bag-shopping',
            routerLink: '/handbags',
          },
          {
            label: 'Roupas',
            icon: 'fa-solid fa-shirt',
            routerLink: '/clothes',
          },
          {
            label: 'Sapatos',
            icon: 'fa-solid fa-socks',
            routerLink: '/shoes',
          },
        ],
      },
      {
        label: 'Classificação',
        icon: 'fa-solid fa-tags',
        items: [
          {
            label: 'Categorias',
            icon: 'fa-solid fa-shapes',
                routerLink: '/categories',
          },
          {
            label: 'Tags',
            icon: 'fa-solid fa-tag',
            routerLink: '/tags',
          },
        ],
      },
      {
        label: 'Lugares',
        icon: 'fa-solid fa-location-pin',
        routerLink: '/places',
      },
      {
        label: 'Looks',
        icon: 'fa-solid fa-crown',
        items: [
          {
            label: 'Combinações',
            icon: 'fa-solid fa-vest-patches',
            routerLink: '/looks',
          },
          {
            label: 'Planejados',
            icon: 'fa-solid fa-calendar-day',
            routerLink: '/planned-looks',
          },
          {
            label: 'Usados',
            icon: 'fa-solid fa-calendar-check',
            routerLink: '/used-looks',
          },
        ],
      },
      {
        label: 'Outros',
        icon: 'fa-brands fa-elementor',
        items: [
          {
            label: 'Academia',
            icon: 'fa-solid fa-dumbbell',
            routerLink: '/gym',
          },
          {
            label: 'Especiais',
            icon: 'fa-solid fa-star',
            routerLink: '/specials',
          },
        ],
      },
    ];
  }
}
