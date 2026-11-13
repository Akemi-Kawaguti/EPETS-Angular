import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WHATSAPP_URL } from '../../config/contato';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected readonly whatsapp = WHATSAPP_URL;
}