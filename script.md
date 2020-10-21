# Workshop NextJS

## Introdução

- Framework para React para desenvolvimento Front-end Web
- Possibilita criação de funções serveless para acesso a ferramentas backend
- Diferenças gerais com o React "puro"
    - Ganhos principalmente em produção (mudanças muito pequenas em desenvolvimento)
        - Perfomance
        - Indexação: react puro roda diretamente no browser (client side) dificultando indexação (crawling, scrapping)
        - Outros componentes built-in, como:
          - `Head`: Permite melhorias no SEO de páginas diferentes (ex: embed de links)
          - `Link`: permite fazer navegação declarativa (similar ao mesmo componente do `react-router-dom`)
    - Mudança no fluxo de acesso
        - React puro: Usuário -> React (browser) -> Interface
        - NextJS: Usuário -> Servidor Node.js (server-side rendering) -> Interface (browser)

## Rotas

- Uso da pasta `pages` para criar rotas
    - Pode estar localizada na raiz do projeto ou dentro da pasta `src`
- Built-in, não precisa instalar nenhum pacote externo
- É possível criar rotas complexas ao criar pastas dentro da pasta `pages`.
    - Ex: o arquivo `src/pages/blog/posts/post.tsx` gera a rota `/blog/posts/post`
- Se criarmos arquivos com `_` na frente, o next irá descartar e não irá considerar como rota
    - Existem alguns arquivos especiais do next que já usam esse mecanismo (`_app.jsx`, `_document.jsx`, `_error.jsx`)
- `index.js` gera a rota `/`

### Rotas dinâmicas

- Usa a sintaxe com colchetes para criar rotas que dinâmicas que irão mudar de acordo com um determinado id.
    - Ex: o arquivo `src/pages/blog/posts/[post].tsx` gera as rotas `/blog/posts/ID_DO_POST`, para cada post com seu id

### Navegação
- `useRouter`
- `Link`

## Data fetching

### Client Side Fetching
- Forma comum do React
- Feito via client-side, no browser, em tempo de execução
- Utiliza os métodos do ciclo de vida do react
- Funciona da mesma forma que no React puro
- Quando usar: quando não precisamos que a informação solicitada pela chamada seja indexada
  - Exemplos: comentários de um produto num e-commerce

### Server-side rendering
- Feito do lado do servidor, em tempo de chamada de rota
- Utiliza o `getServerSideProps`, que executa antes da exibição do componente
- Aumenta o TTFB (Time to first bite: tempo para a primeira aparição na tela), pois só permite que a página seja exibida após a finalzação da execução do `getServerSideProps`
  - Por isso, deve ser usado com cuidado
  - Deve-se avaliar o tradeoff entre diminuir o TTFB e melhorar o UX e o uso de server-side rendering para melhorar a indexação
  - É possível usar uma abordagem híbrida
- Quando usar: quando precisamos que a informação solicitada seja indexada e ela muda com frequência
  - Exemplos: a página de um produto num e-commerce (muda de preço com frequência)

### Static Site Generation
- Feito do lado do servidor, em tempo de build
- Muito performático
- Quando usar: quando precisamos que a informação solicitada seja indexada, mas ela não muda com frequência
  - Exemplos: um post em um blog (o conteúdo é dinâmico, mas não muda com frequência)
- Podemos usar o atributo `revalidate` para setar um intervalo de tempo em que a página será atualizada
- Para gerar páginas dinâmicas (que recebam parâmetros) de maneira estática, precisamos definir os paths usando a função `getStaticPaths`
    - Não é necessário prover todos os paths existentes
    - Para isso, podemos usar o parâmetro `fallback: true`
    - Isso é útil para quando temos um projeto com muitas rotas para buildar, o que tomaria um tempo muito grande
    - Com o `fallback: true`, podemos escolher algumas rotas para buildar e deixar que as demais sejam geradas em tempo de solicitação do usuário e, a partir da próxima, solicitação, elas já estarão geradas
      - Exemplo: um blog com muitas páginas pode ser buildado somente com as mais recentes e as demais são buildadas posteriormente quando houver a primeira solicitação


## Características de Execução de Código

- O que roda client side?
  - useEffect, useState, etc
  - Quando: em tempo de execução
  - Onde: dentro do browser
- O que roda server side?
  - getStaticProps
    - Quando: em tempo de build
  - getServerSideProps (antigo getInitialProps)
    - Quando: em tempo de execução
    - Onde: no servidor, quando o usuário solicita a página

- O que NÃO está disponível server side?
  - Objetos e APIs característicos do browser como `document`, `window`, `navigator` etc

## Arquivos especiais
- `_app.jsx`
    - Funciona como entry point e wrapper da aplicação
    - Local para fazer importações e configurações globais (ex: importar estilos globais do Styled Components, configurar reducer)
    - Renderizado uma única vez
- `_document.jsx`
    - Também funciona como um wrapper da aplicação
    - Renderizado a cada tela
    - Usado para customizar o conteúdo de todas as páginas do app (tags, html, head, etc)
      - Definição de meta tags globais (charset, favicon, manifest)
      - Importação de fontes
      - Importação de css externo
- `404.jsx`
    - Substitui a página 404 padrão do next

## Outras características
- Preview Mode
- Dynamic Import
  - Possibilita importações somente quando o usuário precisar de uma determinada funcionalidade
  - Possibilita code splitting e páginas que carregam menos dados por padrão
  - Otimiza o bundle da aplicação
  - Gera chunks com apenas do código que você precisa e o importa apenas quando você precisa
- Lazy Load
  - Permite o carregamento de componentes apenas quando eles forem necessários
  - Também faz parte de um processo de otimização do bundle
  - Esse é um artifício também presente no react puro, mas o next encapsula com mais opções devido ao SSR
- Variáveis de ambiente
  - Permite segmentar variáveis de ambiente usand `.env` e separando por tipo de ambiente
    - Exemplo: `.env.development`, `.env.local`, `.env.test`, `.env.production`
  - Por padrão, as variáveis só estão disponíveis nos métodos estáticos de data fetching (`getServeSideProps` e `getStaticProps`) e não no browser
  - Para permitir uma variável e ambiente no browser é necessário adicionar o prefixo `NEXT_PUBLIC_` no nome da variável
- Serve arquivos estáticos que estejam dentro da pasta static que são acessíveis no código simplesmente usando a url a partir da raíz
  - Exemplo: para usar a imagem que está em `/static/minha_imagem.png` como prop `src`, basta passá-la como `<img src="/minha_imagem.png" />` que o next irá resolver o caminho

## Outras integrações
- Estilos
    - Styled-components
    - Sass
- Progressive Web Apps
- Web Push Protocol

## Build e deploys
- Automatic Static Optimization
- Static HTML Export