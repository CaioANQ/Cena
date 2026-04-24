# Cena · Sistema de Locação de Equipamentos Audiovisuais

> Protótipo de validação para plataforma de locação inteligente de equipamentos audiovisuais no mercado brasileiro. Cliente: 1º Assistente de Câmera (AC) profissional. Objetivo: substituir o fluxo manual via WhatsApp por um sistema multi-locadora com cotações paralelas, tracking visual e check-out digital no set.

> **Uso de portfólio:** este repositório está disponível apenas para avaliação profissional por empresas e recrutadores. O código, design, documentação, fluxos, textos e demais conteúdos não podem ser copiados, reutilizados, modificados, distribuídos ou publicados sem autorização prévia por escrito. Consulte [LICENSE](LICENSE).

---

## Índice

1. [Visão do produto](#visão-do-produto)
2. [Arquivos entregues](#arquivos-entregues)
3. [Identidade visual](#identidade-visual)
4. [Arquitetura dos protótipos](#arquitetura-dos-protótipos)
5. [Perfis de usuário](#perfis-de-usuário)
6. [Decisões de design críticas](#decisões-de-design-críticas)
7. [Mock data](#mock-data)
8. [Próximos passos](#próximos-passos)

---

## Visão do produto

### Problema atual
O 1º AC brasileiro hoje monta a lista de equipamentos para uma diária via WhatsApp, enviando o mesmo pedido para 3-4 locadoras diferentes, copiando e colando listas de equipamento, esperando respostas em horários diferentes, negociando preço individualmente e fazendo retirada manual com check-list em papel. Processo leva em média 4-6 horas de trabalho administrativo por diária.

### Solução proposta
Plataforma mobile-first que resolve 3 problemas:

1. **Cotação multi-locadora em um toque.** O AC monta uma única lista; o sistema identifica automaticamente quais itens estão em quais locadoras e envia cotações separadas em paralelo — uma para cada casa. Cada locadora vê apenas os itens dela.

2. **Acompanhamento visual em tempo real.** Tracker de 5 etapas (Enviada → Em análise → Orçamento recebido → Aprovada → Retirada agendada) dá visibilidade total ao AC sem ligar ou mandar WhatsApp.

3. **Check-out digital no set.** Scanner QR + checklist fotográfico + assinatura digital substitui o processo em papel. Reduz de 30-45 min para 5 min, com registro auditável.

### Requisitos técnicos
- **LGPD compliance**: dados pessoais mascarados por padrão, criptografia AES-256 em repouso, portabilidade de dados
- **Isolamento de valores entre locadoras**: nenhuma locadora vê o que outras cotaram
- **Arquitetura preparada para pagamentos futuros**: checkout hoje é só cotação, mas com hooks para integração futura
- **Mobile-first**: AC vive no celular entre takes, na van, no set — dark theme otimizado para ambientes escuros

---

## Arquivos entregues

### 1. `cena-mvp.html` (132 KB · 2.519 linhas)
**MVP interativo desktop** com os 3 perfis de usuário navegáveis lado a lado. Demo switcher flutuante permite alternar entre perfis sem logout. Arquitetura React via CDN, 5 scripts `type="text/babel"` compartilhando estado global via `window.__CENA_*__`.

**Uso recomendado**: apresentação ao cliente em reunião, rodando em laptop. Mostra o produto end-to-end em formato navegável.

**O que demonstra**:
- Catálogo completo com 16 equipamentos reais (ARRI Alexa Mini LF, RED Komodo 6K, Sony FX6, Zeiss Supreme Prime, Sigma Cine, Cooke S4/i, ARRI SkyPanel S60-C, Aputure LS 600d, Astera Titan Tube, Sennheiser MKH 416, Zoom F8n Pro, DJI Ronin 2, Easyrig, Teradek Bolt, SmallHD 703, Blackmagic URSA Mini Pro 12K)
- 4 locadoras (Cinestúdio SP, Luz & Câmera, FilmeHouse, Pauta Rental)
- 6 categorias (câmeras, lentes, luz, áudio, rigging, acessórios)
- Fluxo completo: catálogo → produto → carrinho agrupado por locadora → checkout 3 steps → tracker 5 steps
- Dashboard staff (agenda de retiradas, resposta a cotações)
- Dashboard admin (KPIs, gestão de equipamentos, relatórios)

---

### 2. `cena-mobile-wireframes.html` (93 KB · 1.843 linhas)
**Apresentação scroll-longa** com 15 telas mobile desenhadas em alta fidelidade dentro de phone frames iPhone. Organizado em 8 seções narrativas com texto explicando decisões de UX.

**Uso recomendado**: apresentação estratégica ao cliente, export para PDF como deck de apresentação, ou envio por e-mail como documento standalone para validação.

**As 15 telas**:
1. **Splash** — abertura com diafragma animado
2. **Login** — 2FA, SSO com Google
3. **Home/Feed** — cotação ativa no topo, categorias, featured, locadoras
4. **Categoria** — chips de filtro, grid 2-col com disponibilidade
5. **Produto** — specs em abas, quantity stepper, sticky CTA
6. **Carrinho** — agrupado por locadora (cada grupo = uma cotação)
7. **Datas & projeto** — calendário range-picker
8. **Revisão** — resumo por locadora, dados mascarados, badge LGPD
9. **Confirmação** — protocolos, prazo médio, próxima ação
10. **Lista de cotações** — filtros por status, badges coloridos
11. **Detalhe com tracker** — 5 etapas + orçamento mascarado
12. **Push na lock screen** — notificação de orçamento recebido
13. **Check-out no set** ⭐ — scanner QR + checklist fotográfico (feature diferencial)
14. **Perfil & LGPD** — dados mascarados, segurança visível
15. **Agenda do staff** — timeline de retiradas do dia

---

### 3. `cena-prototipo-clicavel-parcial.html` (51 KB · 710 linhas)
**Protótipo navegável em construção** — incompleto. Arquitetura baseada em Context API (NavContext + DataContext), phone frame fixo com navegação state-based entre telas.

**O que está pronto** (PART 1 + PART 2):
- Infraestrutura completa (router, contexts, CSS, mock data, icons, phone frame)
- Telas: Splash, Login, Home, Category, Equipment Detail, Search, Notifications, House Detail
- Navegação funcional entre essas telas

**O que falta** (PART 3 + PART 4 + main App):
- Cart, Checkout (dates/review), Success
- Quotations (list/detail), Set Checkout (QR scanner)
- Profile, Staff screens (agenda, job detail, quotations, reply, acervo)
- Main App component com roteamento final e painéis laterais de controle

**Recomendação honesta**: o protótipo clicável em HTML puro bateu no teto de praticidade. Para apresentação profissional ao cliente com navegação real, recomendo converter para **Figma interativo** ou **Framer** na próxima etapa, usando os wireframes do arquivo 2 como base. HTML puro tem limites (animações de gesto, simulação de teclado mobile, export para compartilhamento) que Figma/Framer resolvem nativamente.

---

## Identidade visual

### Paleta de cores
A paleta é cinematográfica, escura, inspirada na iluminação de set (tungstênio, âmbar quente, verde/vermelho/azul de filme processado):

| Token | Hex | Uso |
|---|---|---|
| `ink-950` | `#0a0908` | Fundo principal |
| `ink-900` | `#121110` | Cards, containers |
| `ink-850` | `#171614` | Superfícies elevadas |
| `ink-800` | `#1a1817` | Borders, divisores |
| `ink-700` | `#2a2724` | Inputs, botões secundários |
| `ink-400`–`ink-100` | `#8a867e` → `#ece8de` | Gradação de tipografia |
| `amber-glow` | `#ff7a2e` | Accent primário · CTAs · highlights |
| `amber-warm` | `#e8c468` | Accent secundário · decorativo |
| `film-green` | `#4a6d3f` / `#8cbf78` | Sucesso · aprovado · seguro |
| `film-red` | `#c44536` / `#e87560` | Erro · recusado · alerta |
| `film-blue` | `#2d5d7b` / `#6ba3c4` | Informativo · neutro frio |

### Tipografia
Trio com personalidade cinematográfica:
- **Fraunces** (serif display) — títulos, números destacados, momentos editoriais
- **Geist** (sans) — UI body, labels, navegação
- **JetBrains Mono** (monospace) — IDs, timestamps, specs técnicas, eyebrow labels

### Elementos decorativos recorrentes
- **Film grain overlay** (SVG noise) sobre o fundo inteiro — `opacity: 0.035`
- **Cine-glow** — radial gradients âmbar no topo e dourado no canto inferior
- **Film strip** — linhas decorativas pontilhadas âmbar (como sprockets de 35mm)
- **Diafragma animado** — logo com 6 pétalas alternando âmbar e dourado, rotação de 60° em loop de 6s

### Logo
6 pétalas triangulares centradas (como um diafragma de câmera fechando/abrindo), alternando `#ff7a2e` e `#e8c468`, com círculo preto central. Animação em loop sutil.

---

## Arquitetura dos protótipos

Todos os 3 arquivos são **HTML único auto-contido**, sem build step, sem dependências externas além de CDNs. Abrem em qualquer navegador moderno direto do arquivo (`file://`).

### Stack
- **Tailwind CSS** via CDN com config inline (`tailwind.config` em `<script>` antes do CSS)
- **React 18** via CDN (UMD build)
- **Babel Standalone** para transformar JSX no navegador
- Fontes Google Fonts (Fraunces, Geist, JetBrains Mono)

### Padrão de organização
Scripts divididos em blocos `type="text/babel"` que compartilham estado via `window.__CENA_*__`:
```
PART 1 — base (config, CSS, icons, components compartilhados, mock data)
PART 2 — telas do AC (catálogo, produto, carrinho, checkout)
PART 3 — telas de cotação + check-out no set
PART 4 — telas do staff/admin
PART 5 — main App com roteamento e estado global
```

Cada PART exporta seus componentes para `window.__CENA_PX__` e o próximo PART importa. Isso contorna o limite de tamanho de cada bloco Babel e permite que o arquivo seja editado/debugado por partes.

### Mock data compartilhado
16 equipamentos, 4 locadoras, 6 categorias e 4 cotações iniciais com estados diferentes (pending, quoted, approved, ready, declined) — permite demonstrar todos os estados da UI.

---

## Perfis de usuário

### 1. Cliente AC/DoP (prioridade 1)
**Persona**: Rafael Moretti, 32 anos, 1º AC freelancer, trabalha em 15-20 diárias/mês em SP/RJ. Usa iPhone. Vive no celular entre takes.

**Fluxo principal**:
1. Abre o app, vê cotação ativa no topo da home
2. Busca ou navega categoria → seleciona equipamento
3. Adiciona ao carrinho (agrupado por locadora automaticamente)
4. Define datas do projeto
5. Envia — recebe N cotações de N locadoras
6. Aprova a melhor individualmente
7. No dia, faz check-out digital no set com QR + foto

### 2. Funcionário locadora (prioridade 2)
**Persona**: Carolina Teixeira, atendente de balcão em locadora média, faz 5-12 retiradas/dia. Usa Android médio. Vive no galpão da locadora.

**Fluxo principal**:
1. Abre o app, vê agenda do dia (retiradas ordenadas por hora)
2. Responde cotações pendentes enviando orçamento
3. Quando cliente aprova, prepara kit
4. No horário da retirada, valida com QR scan junto com o AC

### 3. Administrador (prioridade 3)
**Persona**: dono/gerente da locadora. Vive no desktop do escritório.

**Fluxo principal**:
1. Dashboard com KPIs (retiradas do mês, receita, top equipamentos)
2. Gestão de equipe (adicionar/remover staff)
3. Gestão de catálogo (adicionar equipamentos, configurar disponibilidade)
4. Relatórios e exportação

> **Nota de design**: admin é desktop-only. Staff tem versão mobile enxuta (só "o que separar agora"). Cliente é mobile-first mas tem versão desktop.

---

## Decisões de design críticas

### 1. Preços mascarados no catálogo
`R$ ••.•••,••` no lugar de valores. Motivos:
- **Proteção de margem das locadoras** — evita comparação superficial que desvaloriza o serviço
- **LGPD de valores** — cotações são contratuais, não podem ser expostas entre partes
- **Forçar negociação** — preço aparece só depois que a locadora emite orçamento

### 2. Carrinho agrupado por locadora
Cada grupo vira uma cotação separada. Importante:
- Locadora A só vê itens do grupo dela
- AC aprova cada uma individualmente
- Se uma não tem todos os itens, as outras cobrem sem travar o fluxo
- Valores nunca cruzam entre locadoras

### 3. CPF e telefone mascarados por padrão
`•••.456.789-••` com ícone de cadeado verde. Revela só após autenticação extra. LGPD visível, não escondido em submenu.

### 4. Badges de segurança em verde
Todo elemento de segurança/confiança (2FA ativo, criptografia, verificado) em `#8cbf78` — reforço visual de que o sistema cuida dos dados.

### 5. Thumbnails em SVG geométrico
Não usamos fotos de equipamento. Ícones geométricos estilizados em SVG garantem:
- **Consistência visual** — todos iguais em estilo
- **Performance em 3G/4G** — SVG inline pesa ~500 bytes vs 50-200KB de JPG
- **Independência de fornecedores** — não precisa licenciar fotos ARRI/RED/etc

### 6. Tracker vertical de 5 etapas
Cotação tem estados visuais explícitos: **Enviada → Em análise → Orçamento recebido → Aprovada → Retirada agendada**. AC nunca precisa perguntar "e aí, como está?" — o estado está sempre visível.

### 7. Check-out no set (feature diferencial)
**Substitui 30-45 min de trabalho manual por 5 min auditáveis.**

Hoje: lista impressa → fotografar cada item sobre a mesa → assinar termo em papel → conferir serial manual → perda de tempo + risco jurídico em caso de dano.

Com Cena: aponta câmera → QR lê serial automaticamente → foto do item → assinatura no touch → PDF vai para ambos os lados, timestampado e assinado. Prova jurídica pronta em caso de dispute.

---

## Mock data

### Equipamentos (16 itens reais do mercado brasileiro)
Câmeras: ARRI Alexa Mini LF, Alexa 35, RED Komodo 6K, Sony FX6, Canon C500 Mark II, Blackmagic URSA Mini Pro 12K.
Lentes: Zeiss Supreme Prime 40mm T1.5, Sigma Cine 50mm T1.5, Cooke S4/i 32mm T2.0.
Luz: ARRI SkyPanel S60-C, Aputure LS 600d Pro, Astera Titan Tube.
Áudio: Sennheiser MKH 416, Zoom F8n Pro.
Rigging: DJI Ronin 2, Easyrig Minimax.
Acessórios: Teradek Bolt 4K, SmallHD 703 Bolt.

### Locadoras (4 fictícias)
- **Cinestúdio SP** (Vila Leopoldina) — 284 itens, ★4.9
- **Luz & Câmera Rental** (Pinheiros) — 156 itens, ★4.7
- **FilmeHouse** (Barra Funda) — 213 itens, ★4.8
- **Pauta Rental** (Mooca) — 98 itens, ★4.6

### Cotações de exemplo (estados diferentes para demo)
- `COT-0248` — **Orçamento recebido** (AC precisa revisar/aprovar)
- `COT-0247` — **Aprovada** (aguardando retirada)
- `COT-0245` — **Pronta para retirada** (permite testar fluxo de check-out no set)
- `COT-0241` — **Recusada** (demonstra estado negativo no tracker)

---

## Próximos passos

### Fase 1 — Validação (próximas 2-4 semanas)
1. **Apresentar os 3 artefatos ao cliente** em reunião
2. **Teste de usabilidade com 3 ACs** ativos — sessões de 30 min observando uso real dos wireframes
3. **Ajustes finos** no fluxo baseado no feedback
4. **Converter wireframes para Figma interativo** — protótipo clicável profissional para demos futuras

### Fase 2 — Design system (2-3 semanas)
1. Formalizar tokens (cores, tipografia, espaçamento, raios, sombras) em Figma Variables
2. Criar biblioteca de componentes (buttons, cards, inputs, badges) com variantes
3. Documentar padrões de interação (toques, swipes, push notifications)

### Fase 3 — Development kickoff
**Stack recomendado**:
- **Mobile**: React Native + Expo (iOS + Android com codebase único)
- **Backend**: Node.js + NestJS + PostgreSQL (estrutura preparada para escalar)
- **Auth**: Auth0 ou Clerk (SSO + 2FA prontos, economiza 2 meses de implementação)
- **SMS/Push**: Twilio + Firebase Cloud Messaging
- **Pagamentos (fase 4)**: Stripe Connect ou Pagar.me para split de pagamento entre locadoras

**Validações regulatórias**:
- Validação real de CPF (Receita Federal pública) — obrigatório para LGPD
- DPO (Data Protection Officer) contratado antes do launch — obrigatório LGPD para plataformas

### Fase 4 — Integração de pagamentos (só depois do MVP validado)
- Split automático de pagamento entre locadoras na mesma cotação
- Retenção de caução em cartão
- Faturamento para produtoras (emissão de NFe, parcelamento)

---

## Créditos

Projeto: **Cena** · sistema de locação audiovisual
Cliente: 1º Assistente de Câmera brasileiro
Produto: Caio
Design + prototyping: via Claude (Anthropic)
Data: Abril 2026

---

*Todos os arquivos HTML são standalone — abra no navegador e pronto. Para o MVP desktop, recomenda-se tela 1440px+. Para wireframes mobile e protótipo, qualquer tamanho serve.*
