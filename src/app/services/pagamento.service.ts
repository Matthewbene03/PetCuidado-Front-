import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet } from '../models/pet';
import { appSettings } from '../app.config';
import { Servico } from '../models/servico';
import { Pagamento } from '../models/pagamento';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  private apiUrl = `${appSettings.apiBaseUrl}/pagamentos`;

  constructor(private http: HttpClient) { }

  listar(): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(this.apiUrl);
  }

  salvar(pagamento: Pagamento): Observable<Pagamento> {
    if (pagamento.id) {
      return this.http.put<Pagamento>(`${this.apiUrl}/${pagamento.id}`, pagamento);
    } else {
      pagamento.status = 'NAO_CONCLUIDO'
      return this.http.post<Pagamento>(this.apiUrl, pagamento);
    }
  }

  buscarPorId(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  } 
}

