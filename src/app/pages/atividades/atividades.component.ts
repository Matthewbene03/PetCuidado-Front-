import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FuncionarioService } from '../../services/funcionario.service';
import { Pessoa } from '../../models/pessoa';
import { Funcionario } from '../../models/funcionario';
import { PessoaService } from '../../services/pessoa.service';
import { Pet } from '../../models/pet';
import { PetService } from '../../services/pet.service';
import { Agendamento } from '../../models/agendamento';
import { Servico } from '../../models/servico';
import { ServicoService } from '../../services/servico.service';
import { AgendamentoService } from '../../services/agendamento.service';
import { Pagamento } from '../../models/pagamento';
import { PagamentoService } from '../../services/pagamento.service';

@Component({
  selector: 'app-atividades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './atividades.component.html',
  styleUrl: './atividades.component.css'
})
export class AtividadesComponent {

  formulario: FormGroup;
  agendamentoRecebido: Agendamento = new Agendamento();
  pagamentoRecebido: Pagamento = new Pagamento();
  nomePets: Pet[] = [];
  nomeDonos: Pessoa[] = [];
  descricoes: Servico[] = [];
  listStatus: string[] = ['NAO_CONCLUIDO', 'EM_ANDAMENTO', 'CONCLUIDO'];

  cargo: string | null = null;

  constructor(private fb: FormBuilder, private funcionarioService: FuncionarioService, private petService: PetService, private pessoaService: PessoaService, private servico: ServicoService, private agendamento: AgendamentoService, private pagamento: PagamentoService, private route: ActivatedRoute, private router: Router) {
    this.cargo = this.funcionarioService.getCargoUsuarioLogado();
    this.formulario = this.fb.group({
      id: [''], // campo opcional para identificar edição
      nomePet: [null, Validators.required],
      nomeDono: [null, Validators.required],
      funcionario: [null, Validators.required],
      dataVencimento: [null, Validators.required],
      descricao: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.funcionarioService.buscarPorId(id).subscribe(funcionario => {
        this.formulario.patchValue(funcionario)
      });
    }

    this.agendamentoRecebido = history.state.agendamento;
    this.pagamentoRecebido = history.state.pagamento;
    if (this.agendamentoRecebido) {
      console.log(this.agendamentoRecebido);
      this.preencherFormulario(this.agendamentoRecebido);
      this.formulario.get('descricao')?.disable();
    } else if (this.pagamentoRecebido) {
      console.log(this.pagamentoRecebido);
      this.preencherFormularioPagamento(this.pagamentoRecebido);
      this.formulario.get('descricao')?.disable();
      this.formulario.get('dataVencimento')?.disable();
      if (this.pagamentoRecebido.status === "CONCLUIDO") {
        this.formulario.patchValue({
          status: this.listStatus[2]
        });
        this.formulario.get('status')?.disable();
      }
    } else {
      this.petService.listar().subscribe(pet => {
        this.nomePets = pet;
      });

      this.pessoaService.listar().subscribe(pessoa => {
        this.nomeDonos = pessoa;
      });

      this.servico.listar().subscribe(servico => {
        this.descricoes = servico;
      })
    }
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      if (this.agendamentoRecebido) {
        let statusModificado = this.formulario.get('status')?.value;
        console.log(statusModificado);
        this.agendamentoRecebido.status = statusModificado;
        this.agendamento.salvar(this.agendamentoRecebido).subscribe(() => {
          this.formulario.reset();
          if (statusModificado === this.listStatus[2]) {
            this.router.navigate(['/menu/']);
          } else {
            this.router.navigate(['/menu/verificarHorario']);
          }
        });
      } else if (this.pagamentoRecebido) {
        let statusModificado = this.formulario.get('status')?.value;
        console.log(statusModificado);
        this.pagamentoRecebido.status = statusModificado;
        this.pagamento.salvar(this.pagamentoRecebido).subscribe(() => {
          this.formulario.reset();
          this.router.navigate(['/menu/listaAgendamentos']);
        });
      }
    }
  }

  preencherFormulario(agendamento: Agendamento): void {
    this.formulario.patchValue({
      nomePet: agendamento.pet,
      nomeDono: agendamento.pet.pessoa,
      descricao: agendamento.servico.descricao,
      status: this.listStatus[0]
    });
  }

  preencherFormularioPagamento(pagamento: Pagamento): void {
    const dataFormatada = pagamento.dataVencimento
      ? new Date(pagamento.dataVencimento).toISOString().split('T')[0]
      : '';

    this.formulario.patchValue({
      nomePet: pagamento.agendamento.pet,
      nomeDono: pagamento.agendamento.pet.pessoa,
      funcionario: pagamento.agendamento.funcionario.pessoa,
      dataVencimento: dataFormatada,
      descricao: pagamento.agendamento.servico.descricao,
      status: this.listStatus[0]
    });
  }

  sair(): void {
    this.formulario.reset();
    this.router.navigate(['/menu']);
  }

  sairPagamento(): void {
    this.formulario.reset();
    this.router.navigate(['/menu/listaAgendamentos']);
  }
}