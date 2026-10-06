# Open Dish Atlas — página principal

Pacote de referência da página principal do ODA, preparado para edição e publicação.

## Abrir

Abra `index.html` em um navegador. Para publicação, envie a pasta inteira preservando a estrutura.

## Estrutura

- `index.html` — página principal.
- `assets/css/site.css` — identidade visual e responsividade.
- `assets/js/site-config.js` — indicadores exibidos na faixa de números.
- `assets/js/site.js` — comportamento leve da navegação e leitura da configuração.
- `assets/img/` — logos e arte vetorial do hero.
- `map/` — versão funcional V4 True SVG do mapa interativo, incorporada à home.
- `docs/` — documentação técnica preservada do mapa.

## Indicadores

Os valores `21 países`, `48 projetos catalogados` e `17 projetos interativos` estão configurados como **valores visuais provisórios**, porque ainda não foram fornecidos números consolidados do levantamento. Troque-os em `assets/js/site-config.js` quando a base real estiver fechada.

Ordem adotada: **países → projetos catalogados → projetos interativos**.

## Hero

O hero usa `assets/img/hero-blueprint.svg`: um recorte abstrato/zoom de uma estrutura parabólica, sem medidas, ângulos, escalas ou anotações técnicas inventadas. A intenção é sugerir um blueprint sem simular um desenho de engenharia real.

## Logos

- O logo ODA branco/transparente foi preservado.
- O logo BERG foi preservado como recebido.
- O logo do Instituto Vinciano original foi mantido em `ivac-logo-original.png`.
- Foi criada `ivac-logo-white.png` apenas convertendo a cor visível para branco e preservando geometria, textura e transparência, para integração no rodapé escuro.

## Mapa

O mapa permanece isolado em `map/` e é incorporado à home por `iframe`, evitando conflitos entre o CSS/JavaScript do componente cartográfico e o restante do site. A implementação original V4 True SVG foi preservada. Os registros contidos em `map/data.js` são demonstrativos e devem ser substituídos pelos registros definitivos do ODA.

## Destaques

SRT, DSPIRA e ARGOS foram mantidos como conteúdo demonstrativo para estruturar visualmente a seção `Em destaque`. Os links ainda são placeholders e devem apontar para as futuras fichas do catálogo.

## V2 — densidade e mobile
Esta revisão mantém a arquitetura e a identidade visual da V1, mas reduz a altura do hero, paddings, intervalos, cards e rodapé no desktop. Em telas intermediárias e celulares, a composição foi revista para preservar legibilidade e áreas de toque sem carregar espaços decorativos. No celular, os três indicadores permanecem lado a lado de forma compacta e o mapa recebe prioridade visual logo após a abertura da seção Explorar.

## Revisão V3 — correções visuais e de incorporação
- O mapa incorporado passa a ocupar exatamente a altura do contêiner da home, sem `100vh` interno e sem barra de rolagem no iframe.
- O hero usa o recorte do blueprint aprovado no mockup visual, armazenado em `assets/img/hero-blueprint-approved.png`.
- Os indicadores recuperam ícones semânticos e imediatamente reconhecíveis: globo (países), antena parabólica (projetos) e cursor/interação (projetos interativos).
- A densidade/compactação introduzida na V2 foi preservada.

## V4 — 03/10/2026
- Destaques refeitos no padrão visual do mockup aprovado: fotografia superior, classificação em ciano, título, descrição e seta lateral.
- Rodapé compactado em três blocos: BERG / descrição / IVAC.
- Ordem de navegação e conteúdo ajustada para deixar **Sobre** como último item.


## V5 — simplificação da home
- A seção Explore o Atlas passa a exibir somente o mapa interativo, em toda a largura útil.
- Removidos os três blocos laterais de navegação, por redundância com o próprio mapa e o menu do site.
- O clique nos pontos continua usando o resumo já existente no mapa; a evolução prevista é o link desse resumo para a página do projeto.
- Removidas da home as seções Recursos e Sobre que apareciam depois de Em destaque.
- A sequência da home fica: Hero → Indicadores → Explore o Atlas → Em destaque → Rodapé.
- Não é necessária uma página exclusiva para o mapa nesta etapa: o mapa incorporado à home é a própria ferramenta cartográfica do ODA.

## V6 — manutenção dos dados do mapa

Os registros do mapa ficam agora em `map/data.js`. Para adicionar, remover ou corrigir um instrumento, edite somente esse arquivo. O motor permanece em `map/assets/atlas-map.js`. Nenhuma alteração visual foi realizada nesta versão.
