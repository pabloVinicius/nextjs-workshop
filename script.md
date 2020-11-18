# Workshop NextJS

## Introdução

- Framework para React para desenvolvimento Front-end Web
- Possibilita criação de funções serveless para acesso a ferramentas backend
- Permite começar com zero configuração
  - Disponibiliza um script `create-next-app` que provê a configuração básica inicial do projeto
  - Similar ao `create-react-app` nesse quesito
- Permite trabalhar facilmente com server-side rendering e geração estática da aplicação, inclusive alternativas híbridas, utilizando ambas as formas
- Ganhos principalmente em produção (mudanças menores em desenvolvimento)
  - Perfomance
  - Indexação: react puro roda diretamente no browser (client side) dificultando indexação (crawling e scrapping de buscadores, tags open graph para redes sociais etc)
- Possui uma série de features built-in, como:
  - Componentes para SEO
  - Roteamento
  - Internacionalização
  - etc
- Mudança no fluxo de acesso
  - React puro: Usuário -> React (browser) -> Interface
  - NextJS (SSR/SSG): Usuário -> Servidor Node.js (server-side rendering) -> Interface (browser)

## Roteamento

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
- Imperativa: `useRouter`
- Declarativa: `Link`

### Arquivos especiais
- `_app.jsx`
    - Usado para inicializar páginas
    - Um App personalizado permite:
      - Criar layouts globais
      - Adicionar CSS globais (style-componentes, css modules etc)
      - Manter estado entre páginas (Redux, por exemplo)
      - Criar um error handler global
    - Não suporta métodos de Data Fetching
- `_document.jsx`
    - Usado para customizar o conteúdo HTML de todas as páginas do app (tags, html, head, etc)
      - Definição de meta tags globais (charset, favicon, manifest)
      - Importação de fontes
    - Não suporta métodos de Data Fetching
    - Só roda no servidor, logo, métodos e objetos do lado cliente da aplicação não funcionam aqui
- `404.jsx` e `_error.jsx`
    - Substitui a página 404 e página de erro geral (500) padrões do next, respectivamente
    - É possível importar o componente `Error` do Next para reusar o layout

## Data fetching

### Server-side rendering
- Feito do lado do servidor, em tempo de execução, na chamada da rota (`getServerSideProps`)
- Objetos e APIs característicos do browser como `document`, `window`, `navigator` etc não estão disponíveis
- Aumenta o TTFB (Time to first bite: tempo para a primeira aparição na tela), pois só permite que a página seja exibida após a finalzação da execução do `getServerSideProps`
  - Por isso, deve ser usado com cuidado
  - Deve-se avaliar o tradeoff entre diminuir o TTFB e melhorar o UX e o uso de server-side rendering para melhorar a indexação
  - É possível usar uma abordagem híbrida
- Quando usar: quando precisamos que a informação solicitada seja indexada e ela muda com frequência
  - Exemplos: a página de um produto num e-commerce (muda de preço com frequência)
- Indexação e SEO
  - Componente `Head`

### Static Site Generation
- Feito do lado do servidor, em tempo de build (`getStaticProps`)
- Objetos e APIs característicos do browser como `document`, `window`, `navigator` etc não estão disponíveis
- Muito performático
- Quando usar: quando precisamos que a informação solicitada seja indexada, mas ela não muda com frequência
  - Exemplos: um post em um blog (o conteúdo é dinâmico, mas não muda com frequência)
- `Regeneration`: Podemos usar o atributo `revalidate` para setar um intervalo de tempo em segundos em que a página será atualizada
- Para gerar páginas dinâmicas (que recebam parâmetros) de maneira estática, precisamos definir os paths usando a função `getStaticPaths`
    - Não é necessário prover todos os paths existentes
    - Para isso, podemos usar o parâmetro `fallback: true` (`Incremental Static Generation`)
    - Isso é útil para quando temos um projeto com muitas rotas para buildar, o que tomaria um tempo muito grande
    - Com o `fallback: true`, podemos escolher algumas rotas para buildar e deixar que as demais sejam geradas em tempo de solicitação do usuário e, a partir da próxima, solicitação, elas já estarão geradas
      - Exemplo: um blog com muitas páginas pode ser buildado somente com as mais recentes e as demais são buildadas posteriormente quando houver a primeira solicitação
  - Usar `fallback: true` gera problemas no SEO, uma vez que ao usá-lo a página vai ser retornada com um elemento de loading inicialmente, e vai ter sua renderização finalizada no browser, o que impede que a página retorne o seu conteúdo pra crawlers de buscadores, redes sociais etc
    - Para resolver essa situação, o Next 10 adicionou a opção `fallback: 'blocking'`, que permite gerar essa página sem enviar um fallback estático para o browser, fazendo com que ele espere a página ser completamente buildada para então renderizá-la.

### Client Side Fetching
- Forma comum do React
- Feito via client-side, no browser, em tempo de execução
- Utiliza os métodos do ciclo de vida do react (useEffect, useState, etc)
- Funciona da mesma forma que no React puro
- Quando usar: quando não precisamos que a informação solicitada pela chamada seja indexada
  - Exemplos: comentários de um produto num e-commerce

## Build e deploys
- Automatic Static Optimization
  - O Next determina automaticamente se a página tem requisitos bloqueantes (`getServerSideProps`) ou se pode ser pré-renderizada
  - Isso permite que a aplicação tenha uma estrutura de data fetching híbrida, com o Next servindo as páginas da maneira mais rápida possível
  - Por exemplo, se uma página não precisa fazer requisições via `getServerSideProps`, ela é servida como página estática, sendo entregue de maneira muito mais rápida
  - "Página estática" não significa que ela não é reativa e sim que ela não faz requisições via servidor antes de ser devolvida, ou seja, métodos do javascript continuam ativos e disponíveis
- Static HTML Export
  - Usando o comando `next export` podemos exportar a aplicação completa de maneira estática, desde que nenhuma das páginas utilize features server-side para funcionar, ou seja, sejam todas estáticas
  - Para páginas com rotas dinâmicas, devemos definir todos os caminhos que devem ser gerados usando o método `getStaticPaths`
  - Uma vez que a aplicação é gerada de maneira completamente estática, as features ` Incremental Static Generation` (`fallback: true`) e `Regeneration` (`revalidade: 1`) não estão disponíveis, pois necessitam de um servidor para funcionar.
  - Gera um diretório `out` que pode ser disponibilizado em qualquer servidor de html comum, sem necessidade de rodar um servidor javascript
  - API Routes não estão disponíveis

## API Routes
- Disponibiliza rotas criadas a partir de arquivos na pasta `/src/pages/api`
- Cada arquivo representa uma rota e deve exportar uma função no formato específico descrito abaixo:

```js
export default function handler(req, res) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ name: 'John Doe' }))
}
```
- A priori, só funciona com chamadas de mesma origem, ou seja, não há definição de headers CORS, mas é possível personalizar essa implementação
- Suporta rotas dinâmicas assim como nas rotas frontend, possibilitando utilizar padrões comuns da arquitetura RESTFul, como:
  - `GET api/cars` retorna a lista de carros
  - `GET api/cars/1234` retorna o detalhe do carro com id `1234`
- Também está disponível o uso das rotas dinâmicas com vários argumentos, isto é, usando `...` dentro da definição da rota dinâmica:
  - Um arquivo `pages/api/cars/[...slug].js` possibilita gerar uma rota que bate com `/api/cars/1`, `/api/cars/1/2`, `/api/cars/1/2/3` e assim por diante
  - Dentro da função, o query param `slug` será uma lista com todos os parmetros informados
- Outra opção são as rotas dinâmicas com vários argumentos opcionais, usando colchetes duplos, por exemplo `pages/api/cars/[[...slug]].js`
  - A principal diferença é que essa forma aceita a rota `/api/cars`, ou seja, com parâmetro vazio
- Por fim, é importante ressaltar a ordem de precedência das definições de rotas, sendo ela a seguinte:
  1. Rotas predefinidas (não dinâmicas)
  2. Rotas dinâmicas
  3. Rotas dinâmicas com vários argumentos
- Contras
  - Dificil de estruturar código, muita lógica acoplada
  - Devido à essa estrutura, talvez só seja realmente útil para features pequenas
  - Devido à arquitetura serveless, perde a capacidade de transações real-time, como conexões via sockets



## Outras características
- Suporte a IE11 e browsers modernos (Edge, Firefox, Chrome, Safari, Opera etc) sem necessidade de configurações ou importações externas de polyfills
- Preview Mode
  - Permite ignorar deploy estático para fazer um preview da página em casos específicos, ou seja, renderizá-la em tempo de execução e não de deploys.
  - Útil para usar junto com um CMS de blog, por exemplo, quando você cria um novo post e quer vê-lo antes de liberar para o grande público
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
- AMP
- Next Analytics
- Next Commerce
- Image Optmization
  - next/image
- Internationalization
- Estilos
    - Styled-components
    - Sass
    - Less
    - CSS modules
- Progressive Web Apps (next-offline)
- Web Push Protocol
- AMP
- Codemods (permite fazer transformações que ajudam a atualizar o codebase quando uma feature muda ou está depreciada)
- MDX
- Diversos outros plugins (https://github.com/vercel/next-plugins)
