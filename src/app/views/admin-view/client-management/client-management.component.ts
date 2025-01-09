import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {Client} from "../../../core/models/client";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {ClientService} from "../../../core/services/clientService/client.service";

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './client-management.component.html',
  styleUrl: './client-management.component.css'
})
export class ClientManagementComponent implements OnInit{
  clients: Client[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients(): void {
    this.clientService.getClients().subscribe({
      next:  (data) => {
        this.clients = data
      },
      error: (err) => {
        console.log('Error fetching clients:', err)
      }
    })
  }



  onDeleteClient(client: Client) : void {
    if (confirm('Are you sure you want to delete the client?')) {
      this.clientService.deleteClient(client).subscribe(() => {
        console.log(`Client with ID ${client.id} was deleted successfully`);
      });
      window.location.reload();
    }
  }
}
