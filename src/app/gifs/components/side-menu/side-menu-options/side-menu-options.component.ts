import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuOption {
  icon: string;
  label: string;
  route: string;
  subLabel:string;
}

@Component({
  selector: 'gisf-side-menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu-options.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuOptionsComponent {

   menuOptions: MenuOption[] = [
    {
      icon: 'fa-solid fa-chart-line',
      label: 'Treding',
      route: '/dashboard/treding',
      subLabel: 'Ver los gifs mas populares'
    },
    {
      icon: 'fa-solid fa-magnifying-glass',
      label: 'Buscar',
      route: '/dashboard/search',
      subLabel: 'Buscar gifs por nombre'
    }
  ]


}
