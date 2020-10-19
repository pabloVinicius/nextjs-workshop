# Workshop NextJS

## Introdução

- Framework para React para desenvolvimento Front-end Web
- Possibilita criação de funções serveless para acesso a ferramentas backend
- Diferenças com o React "puro"
    - Ganhos principalmente em produção (mudanças muito pequenas em desenvolvimento)
        - Perfomance
        - Indexação: react puro roda diretamente no browser (client side) dificultando indexação (crawling, scrapping)
    - Mudança no fluxo de acesso
        - React puro: Usuário -> React (browser) -> Interface
        - NextJS: Usuário -> Servidor Node.js (server-side rendering) -> Interface (browser)