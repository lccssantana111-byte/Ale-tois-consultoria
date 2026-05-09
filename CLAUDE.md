# CLAUDE.md — Landing Page: Ale Tois Consultoria

> Este arquivo serve como briefing completo do projeto. Sempre consulte este documento antes de gerar ou editar qualquer código.

---

## 🎯 Visão Geral do Projeto

**Produto:** Landing page de consultoria de treino e dieta personalizada  
**Cliente:** Ale Tois  
**Credencial principal:** Co-fundador da Academia Gaviões  
**Público-alvo:** Público geral — pessoas que querem emagrecer, ganhar massa, melhorar a saúde ou performance, independentemente do nível  
**Objetivo da página:** Converter visitantes em leads via WhatsApp ou formulário de contato  

---

## 👤 Sobre o Profissional

- **Nome:** Ale Tois
- **Título:** Personal Trainer & Consultor de Nutrição Esportiva
- **Destaque:** Co-fundador da Academia Gaviões
- **Especialidade:** Consultoria de treino + dieta para todos os objetivos (emagrecimento, hipertrofia, saúde, performance)
- **Formato de atendimento:** hibrido 
- **Localização:** sao paulo, sp
- **WhatsApp:** 11 94774-6827
- **Instagram:** _aletois


---

## 🎨 Identidade Visual Sugerida

### Conceito: **"Iron & Gold"**
Inspirado no universo fitness premium — disciplina, força e resultado. Paleta escura com dourado como acento, transmitindo autoridade, seriedade e resultado comprovado.

### Paleta de Cores
```
--bg-primary:     #0A0A0A   /* Preto profundo — fundo principal */
--bg-secondary:   #111111   /* Preto suave — cards e seções alternadas */
--bg-card:        #1A1A1A   /* Cinza escuro — elementos elevados */
--accent-gold:    #C9A84C   /* Dourado — CTA, destaques, ícones */
--accent-gold-lt: #E8C96A   /* Dourado claro — hover states */
--text-primary:   #F5F5F5   /* Quase branco — títulos */
--text-secondary: #A0A0A0   /* Cinza médio — corpo de texto */
--text-muted:     #555555   /* Cinza escuro — rodapés, labels */
--border:         #2A2A2A   /* Divisores sutis */
```

### Tipografia
```
Display / Headings: "Bebas Neue" (Google Fonts) — impacto, força, atletismo
Body / Parágrafos:  "DM Sans" (Google Fonts) — legibilidade, modernidade
Accent / Labels:    "DM Sans" em uppercase + letter-spacing
```

### Estética Geral
- Fundo escuro dominante com respiros de dourado
- Efeitos de luz sutil (glow dourado em elementos CTA)
- Linhas finas como separadores geométricos
- Textura grain/noise muito sutil no fundo
- Animações de entrada suaves (fade + translate) ao fazer scroll
- Imagens em preto e branco com overlay dourado no hover

---

## 🗂️ Estrutura da Landing Page

### 1. `#hero` — Seção Hero
- Headline poderosa com nome do profissional em destaque
- Sub-headline com proposta de valor clara
- CTA primário: botão WhatsApp ("Quero minha consultoria")
- Foto do Ale Tois (placeholder até imagem real)
- Badge: "Co-fundador da Academia Gaviões"

**Copy sugerida:**
> **"Seu corpo. Seu objetivo. Meu método."**  
> Consultoria personalizada de treino e dieta com quem já transformou centenas de vidas.

---

### 2. `#sobre` — Sobre o Ale Tois
- Foto + bio profissional
- Credenciais e formação [PREENCHER]
- Números de impacto (ex: "X alunos transformados", "X anos de experiência")
- Destaque visual: Co-fundador da Academia Gaviões

**Dados para preencher:**
```
anos_experiencia: [PREENCHER]
alunos_atendidos: [PREENCHER]
formacao:         [PREENCHER — ex: CREF, Nutrição, Especializações]
```

---

### 3. `#como-funciona` — Como Funciona a Consultoria
- 3 ou 4 etapas visuais (ícone + título + descrição)
- Sugestão de etapas:
  1. **Avaliação** — Análise completa do seu histórico e objetivos
  2. **Plano Personalizado** — Treino e dieta 100% adaptados para você
  3. **Acompanhamento** — Ajustes semanais e suporte direto
  4. **Resultado** — Evolução real, mensurável e sustentável

---

### 4. `#depoimentos` — Depoimentos de Alunos
- Cards com foto (avatar), nome, objetivo alcançado e depoimento
- Mínimo 3 depoimentos reais [PREENCHER]
- Formato: carousel ou grid 3 colunas

**Template de depoimento:**
```
nome:      [PREENCHER]
foto:      [PREENCHER ou usar iniciais]
objetivo:  [ex: "Perdeu 12kg em 3 meses"]
texto:     "[PREENCHER — depoimento real]"
```

---

### 5. `#cta` — Seção de Contato / WhatsApp CTA
- Headline de urgência/escassez (ex: "Vagas limitadas por mês")
- Botão WhatsApp com ícone — link direto para conversa
- Formulário simples alternativo:
  - Nome
  - WhatsApp
  - Objetivo (select: Emagrecer / Ganhar massa / Saúde / Performance)
  - Botão de envio

---

### 6. `#footer` — Rodapé
- Logo / nome
- Links sociais (Instagram, WhatsApp)
- CREF (se aplicável) [PREENCHER]
- Copyright

---

## ⚙️ Requisitos Técnicos

```
Framework:     HTML + CSS + JavaScript vanilla (sem dependências obrigatórias)
               OU React/JSX se for artifact Claude
Fontes:        Google Fonts (Bebas Neue + DM Sans)
Ícones:        Lucide Icons ou SVG inline
Animações:     CSS transitions + Intersection Observer para scroll reveal
Responsivo:    Mobile-first, breakpoints: 480px / 768px / 1024px / 1280px
Performance:   Imagens com lazy loading, CSS crítico inline
Acessibilidade: Alt text em imagens, contraste mínimo AA, foco visível
```

---

## 📋 Checklist Antes de Publicar

- [ ] Substituir todos os `[PREENCHER]` com dados reais
- [ ] Inserir foto real do Ale Tois
- [ ] Adicionar depoimentos reais com fotos ou avatares
- [ ] Configurar link do WhatsApp com mensagem pré-definida
- [ ] Testar em mobile (iOS e Android)
- [ ] Testar formulário de contato
- [ ] Adicionar Google Analytics ou Meta Pixel (se necessário)
- [ ] Configurar domínio e hospedagem

---

## 💬 Mensagem Padrão WhatsApp

```
Olá, Ale! Vi seu site e tenho interesse na consultoria.
Meu objetivo é: [objetivo do aluno]
Pode me contar mais sobre como funciona?
```

Link formato:
```
https://wa.me/55[DDD][NUMERO]?text=Olá%2C+Ale%21+Vi+seu+site+e+tenho+interesse+na+consultoria.
```

---

*Documento criado para o projeto Ale Tois Consultoria — versão 1.0*