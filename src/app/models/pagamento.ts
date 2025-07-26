import { Agendamento } from "./agendamento";

export class Pagamento {
    id?: number;
    dataVencimento!: Date;
    dataPagamento!: Date;
    valor!: number;
    metodo!: string;
    status!: string;
    agendamento!: Agendamento;
}