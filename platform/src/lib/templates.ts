import type { TriggerType } from "@/lib/types";

export interface AutomationTemplate {
  id: string;
  name: string;
  summary: string;
  description: string;
  trigger_type: TriggerType;
  source_app: string;
  actions: string[];
  config: Record<string, string>;
}

// Modelos são apenas pontos de partida: nenhum deles vem conectado.
// O workflow correspondente precisa existir no n8n antes da ativação.
export const TEMPLATES: AutomationTemplate[] = [
  {
    id: "atendimento",
    name: "Atendimento automatizado",
    summary: "Responde mensagens recebidas com um agente de IA e encaminha casos complexos.",
    description:
      "Recebe mensagens de clientes, gera uma resposta com o provedor de IA e encaminha para um humano quando a confiança for baixa.",
    trigger_type: "webhook",
    source_app: "WhatsApp / Chat do site",
    actions: [
      "Classificar a intenção da mensagem",
      "Gerar resposta com o provedor de IA",
      "Encaminhar para atendimento humano quando necessário",
    ],
    config: { canal_humano: "", tom_de_voz: "Profissional e cordial" },
  },
  {
    id: "leads",
    name: "Captura e organização de leads",
    summary: "Recebe leads de formulários, enriquece os dados e envia para a planilha ou CRM.",
    description:
      "Recebe novos leads de formulários, padroniza os campos, qualifica com IA e registra no destino escolhido.",
    trigger_type: "webhook",
    source_app: "Formulário do site",
    actions: ["Padronizar nome, e-mail e telefone", "Qualificar o lead com IA", "Registrar no CRM ou planilha"],
    config: { destino: "", campos_obrigatorios: "nome, email" },
  },
  {
    id: "follow-up",
    name: "Follow-up de clientes",
    summary: "Envia mensagens de acompanhamento em intervalos definidos.",
    description: "Verifica periodicamente clientes sem resposta e envia um follow-up personalizado.",
    trigger_type: "schedule",
    source_app: "CRM",
    actions: ["Buscar clientes sem interação recente", "Gerar mensagem personalizada", "Enviar por e-mail ou WhatsApp"],
    config: { intervalo: "Diariamente às 9h", dias_sem_resposta: "3" },
  },
  {
    id: "notificacoes",
    name: "Notificações automáticas",
    summary: "Avisa a equipe quando um evento importante acontece.",
    description: "Recebe eventos de sistemas externos e envia notificações para o canal da equipe.",
    trigger_type: "event",
    source_app: "Sistema externo",
    actions: ["Filtrar eventos relevantes", "Formatar a notificação", "Enviar para Slack, e-mail ou WhatsApp"],
    config: { canal: "" },
  },
];

export const TRIGGER_LABELS: Record<TriggerType, string> = {
  manual: "Manual",
  webhook: "Webhook",
  schedule: "Agendamento (n8n)",
  event: "Evento externo (n8n)",
};

export const TRIGGER_HINTS: Record<TriggerType, string> = {
  manual: "Executada pelo botão “Executar agora”.",
  webhook: "Um sistema externo chama a URL de webhook desta automação.",
  schedule: "O agendamento é configurado no próprio workflow do n8n, que reporta cada execução.",
  event: "O n8n escuta o evento e reporta cada execução para a plataforma.",
};
