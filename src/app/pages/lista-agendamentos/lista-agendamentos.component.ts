import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Agendamento } from '../../models/agendamento';
import { AgendamentoService } from '../../services/agendamento.service';
import { Pagamento } from '../../models/pagamento';
import { PagamentoService } from '../../services/pagamento.service';

@Component({
  selector: 'app-lista-agendamentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-agendamentos.component.html',
  styleUrl: './lista-agendamentos.component.css'
})
export class ListaAgendamentosComponent {

  pagamentos: Pagamento[] = [];

  constructor(private pagamento: PagamentoService, private router: Router) { }

  ngOnInit(): void {
    this.carregarProtudos();
  };

  carregarProtudos(): void {
    this.pagamento.listar().subscribe(pagamento => {
      this.pagamentos = pagamento.sort((a, b) => {
        const nomeA = a.status.toLowerCase();
        const nomeB = b.status.toLowerCase();
        return nomeB.localeCompare(nomeA);
      });
    });
  }

  carregarProtudosPet(): void {
    this.pagamentos.sort((a, b) => {
      const nomeA = a.agendamento.pet.nome.toLowerCase();
      const nomeB = b.agendamento.pet.nome.toLowerCase();
      return nomeA.localeCompare(nomeB);
    });
  }

  carregarProtudosFuncionario(): void {
    this.pagamentos.sort((a, b) => {
      const nomeA = a.agendamento.funcionario.pessoa.nome.toLowerCase();
      const nomeB = b.agendamento.funcionario.pessoa.nome.toLowerCase();
      return nomeA.localeCompare(nomeB);
    });
  }

  carregarProtudosServico(): void {
    this.pagamentos.sort((a, b) => {
      const descA = a.agendamento.servico.descricao.toLowerCase();
      const descB = b.agendamento.servico.descricao.toLowerCase();
      return descA.localeCompare(descB);
    });
  }

  carregarPagamento(): void {
    this.pagamentos.sort((a, b) => {
      const descA = a.metodo.toLowerCase();
      const descB = b.metodo.toLowerCase();
      return descA.localeCompare(descB);
    });
  }

  carregarStatus(): void {
    this.pagamentos.sort((a, b) => {
      const descA = a.status.toLowerCase();
      const descB = b.status.toLowerCase();
      return descB.localeCompare(descA);
    });
  }

  carregarData(): void {
    this.pagamento.listar().subscribe(pagamento => {
      this.pagamentos = pagamento.sort((a, b) => {
        return new Date(b.dataVencimento).getTime() - new Date(a.dataVencimento).getTime();
      });
    });
  }

  executarAcao(pagamento: Pagamento): void {
    this.router.navigate(['/menu/atividades'], { state: { pagamento: pagamento } });
  }
}