export type Desculpa = {
  titulo: string;
  texto: string;
  nivelDeRisco: "baixo" | "medio" | "alto";
  analise: string;
};

export type ExcuseRequest = {
  situacao: string;
  tom: Tom;
  formalidade: Formalidade;
  canal: Canal;
  destinatario?: string;
  incluirJustificativa: boolean;
  incluirReparo: boolean;
};

export type Tom = "diplomatico" | "sincero" | "espirituoso" | "dramatico" | "tecnico" | "vago";
export type Formalidade = "casual" | "neutro" | "formal" | "executivo";
export type Canal = "email" | "slack" | "whatsapp" | "presencial" | "reuniao";
