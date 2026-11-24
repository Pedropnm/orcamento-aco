# Solicitação de orçamento ACO — webapp

Aplicativo web estático (PWA) para preencher a ficha de solicitação de orçamento da ACO Drenagem, buscar itens dos catálogos por código ou descrição, consultar CNPJ/CEP e gerar o PDF no formato da ficha.

## Estrutura

```
index.html              página do app
manifest.webmanifest    dados para instalar como app
sw.js                   cache offline (service worker)
data/produtos.json      base de itens (código, descrição, unidade, linha)
assets/                 logo ACO e ícones do app
vendor/                 jsPDF 2.5.1 e jsPDF-AutoTable 3.8.2 (cópias locais)
```

Não há build nem servidor próprio: qualquer hospedagem de arquivos estáticos serve.

## Publicar

O app precisa ser servido por HTTPS (ou `localhost`) para instalar e funcionar offline. Abrir o `index.html` direto do disco (`file://`) não carrega a base de itens.

- **Netlify Drop** (mais simples): arraste a pasta `webapp` em https://app.netlify.com/drop. Gera um link na hora.
- **Vercel**: `npx vercel` dentro da pasta `webapp`, ou importe o repositório no painel.
- **GitHub Pages**: suba a pasta para um repositório, em Settings → Pages escolha a branch e a pasta.
- **Servidor próprio / intranet**: copie a pasta para qualquer servidor web (Apache, Nginx, IIS).

Teste local:

```
cd webapp
python3 -m http.server 8080
# abrir http://localhost:8080
```

## Uso

- **Itens**: digite o código ou palavras da descrição (em qualquer ordem, sem acento). Código completo preenche descrição e unidade. Itens fora da base podem ser digitados livremente.
- **CNPJ**: valida os dígitos e consulta a BrasilAPI (alternativa: CNPJ.ws). Preenche razão social, endereço, cidade, UF, CEP, telefone e e-mail.
- **CEP do projeto**: preenche o campo Local (BrasilAPI ou ViaCEP).
- **Gerar PDF**: baixa a solicitação no formato da ficha, com o bloco do representante.
- **Rascunho**: fica salvo no navegador. Os dados do representante não são apagados em Limpar.
- **Instalar**: no Chrome/Edge aparece o botão "Instalar app"; no iPhone, Compartilhar → Adicionar à Tela de Início.
- **Offline**: depois do primeiro acesso, busca de itens e PDF funcionam sem internet. CNPJ e CEP precisam de conexão.

## Atualizar a base de itens

Edite `data/produtos.json` (uma lista de `{"c": código, "d": descrição, "u": "m" | "un", "l": linha}`) e publique de novo. O app busca a versão nova a cada abertura quando há internet.

Ao mudar outros arquivos do app, altere `CACHE` em `sw.js` (por exemplo `orcamento-aco-v2`) para forçar a atualização nos aparelhos que já instalaram.

## Dados pré-preenchidos

Os valores padrão do representante estão em `index.html`, na constante `REP`.
