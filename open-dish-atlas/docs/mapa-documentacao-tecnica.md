# BERG Interactive Map — Documentação Técnica

**Componente:** BERG Interactive Map  
**Primeira aplicação:** Open Dish Atlas (ODA)  
**Versão funcional preservada:** V4 — True SVG  
**Data da referência:** 2026-10-03  
**Objetivo deste documento:** permitir compreender, manter, reutilizar e recuperar o componente sem depender da memória de quem o implementou.

---

## 1. O que é este componente

O BERG Interactive Map é um pequeno motor cartográfico executado inteiramente no navegador. Ele combina uma base cartográfica mundial vetorial com uma camada de dados georreferenciados.

Na aplicação original, os registros representam iniciativas relacionadas à radioastronomia educacional. A arquitetura, porém, não depende desse conteúdo e pode ser reutilizada para escolas, observatórios, instituições, eventos, ações do BERG ou qualquer outro conjunto de registros que possua latitude e longitude.

A versão de referência não utiliza Google Maps, Mapbox, Leaflet, OpenStreetMap, APIs cartográficas, CDN ou biblioteca JavaScript externa em tempo de execução.

---

## 2. Princípio fundamental

> O mapa apresenta os dados. Os dados não pertencem ao mapa.

A cartografia, o mecanismo de zoom, o pan, os marcadores e os clusters devem permanecer separados do conteúdo específico de cada aplicação.

O Open Dish Atlas é uma aplicação do componente, não o componente em si.

---

## 3. Estrutura da versão preservada

```text
reference-v4/
├── index.html
├── README.txt
└── assets/
    ├── data.js
    ├── atlas-map.js
    └── style.css
```

### `index.html`

Contém a estrutura da interface e, principalmente, o SVG cartográfico incorporado diretamente à página.

Elementos importantes:

- `#viewport` — janela visível do mapa;
- `#worldMap` — SVG principal;
- `#cartography` — grupo contendo a cartografia;
- `#dataLayer` — grupo onde JavaScript insere marcadores e clusters;
- `#zoomIn`, `#zoomOut`, `#home` — controles;
- `#detail` — painel de informações do registro selecionado.

### `data.js`

Contém os registros utilizados pelo protótipo.

Na referência V4 há entradas demonstrativas criadas apenas para testar clusters. Elas não devem ser tratadas como dados definitivos do Open Dish Atlas.

### `assets/atlas-map.js`

É o motor do mapa. Contém:

- projeção latitude/longitude → coordenadas SVG;
- renderização dos marcadores;
- cálculo dos clusters;
- zoom;
- pan;
- conversão entre coordenadas da tela e coordenadas do mapa;
- seleção de registros;
- preenchimento do painel de detalhes.

### `assets/style.css`

Define a aparência da página, mapa, controles, marcadores, clusters e painel informativo.

---

## 4. Por que o mapa permanece nítido

A solução definitiva NÃO amplia uma imagem com CSS.

A cartografia está dentro do próprio SVG:

```html
<svg id="worldMap" viewBox="0 0 1800 900">
    <g id="cartography">...</g>
    <g id="dataLayer"></g>
</svg>
```

O zoom modifica o `viewBox`.

Exemplo conceitual:

```text
visão mundial:
0 0 1800 900

zoom:
450 200 900 450

zoom maior:
675 300 450 225
```

O navegador redesenha os caminhos vetoriais dentro da nova janela. Não existe uma fotografia sendo ampliada.

### Não substituir por `transform: scale()`

Uma versão anterior aplicava escala ao elemento inteiro. Dependendo da forma como o SVG era carregado/renderizado, isso produzia aparência rasterizada.

### Não voltar a usar o mapa como `<img>`

Também foi testado:

```html
<img src="mapa.svg">
```

Embora o arquivo seja SVG, essa não é a arquitetura escolhida para a versão de referência.

A solução preservada utiliza SVG **inline**.

---

## 5. Sistema de coordenadas

A versão de referência usa uma projeção equiretangular simples.

Dimensões lógicas:

```text
largura = 1800
altura  = 900
```

Conversão:

```text
x = (longitude + 180) / 360 × largura
y = (90 - latitude) / 180 × altura
```

No código:

```javascript
const project = (lat, lon) => ({
    x: (lon + 180) / 360 * W,
    y: (90 - lat) / 180 * H
});
```

Isso significa que, para cadastrar um ponto, basta fornecer latitude e longitude. O responsável pelo conteúdo nunca deve posicionar manualmente o marcador em pixels.

---

## 6. Zoom

O estado visível é guardado aproximadamente como:

```javascript
vb = {
    x: 0,
    y: 0,
    w: 1800,
    h: 900
}
```

`x` e `y` indicam a origem da janela visível.

`w` e `h` indicam quanto do universo SVG está visível.

Quanto menor `w` e `h`, maior o zoom.

A função responsável aplica:

```javascript
svg.setAttribute(
    "viewBox",
    `${vb.x} ${vb.y} ${vb.w} ${vb.h}`
);
```

### Limite de zoom

A versão de referência limita a aproximação para impedir valores absurdos:

```javascript
vb.w = clamp(vb.w, W / 12, W);
```

Esse valor pode ser alterado futuramente.

---

## 7. Pan

Ao arrastar o mapa, o código calcula quanto o ponteiro se deslocou na tela e converte esse deslocamento para o sistema de coordenadas do SVG.

Em vez de mover fisicamente o elemento HTML, são alterados `vb.x` e `vb.y`.

Depois, o `viewBox` é recalculado.

---

## 8. Marcadores

Os marcadores são elementos SVG criados por JavaScript.

Cada registro passa por `project(lat, lon)`.

O resultado define a posição do grupo:

```javascript
transform="translate(x y)"
```

Os círculos que formam o marcador são adicionados dentro desse grupo.

### Tamanho constante

O código compensa o nível de zoom aplicando uma escala inversa ao marcador:

```javascript
scale(1 / zoom)
```

Assim, aproximar o mapa não transforma o marcador em um círculo gigantesco.

---

## 9. Clusters

Clusters são agrupamentos de registros próximos na escala atual.

Fluxo simplificado:

```text
registros
   ↓
converter lat/lon para x/y
   ↓
medir distância entre pontos
   ↓
estão próximos?
   ├── sim → cluster
   └── não → marcador individual
```

O limite de proximidade muda de acordo com o nível de zoom.

Ao clicar num cluster, o mapa aproxima aquela região.

Depois do zoom, os clusters são recalculados. Portanto:

```text
● 12
  ↓ zoom
● 5   ● 4   ● 3
  ↓ zoom
● ● ● ● ● ...
```

Não existem posições de cluster armazenadas nos dados.

---

## 10. Dados

Na referência, os registros estão em:

```text
data.js
```

Estrutura aproximada:

```javascript
{
    id: "srt",
    name: "Small Radio Telescope",
    institution: "MIT Haystack Observatory",
    country: "Estados Unidos",
    lat: 42.62,
    lon: -71.49,
    type: "Educational radio telescope",
    url: "#srt"
}
```

### Regra de manutenção

Não inserir no registro:

- posição x/y;
- cor do marcador;
- cluster;
- nível de zoom;
- posição do popup.

Essas propriedades pertencem à interface e devem ser calculadas pelo sistema.

---

## 11. Evolução recomendada dos dados

A referência V4 usa JavaScript porque era a forma mais rápida de demonstrar o mecanismo.

Para o Open Dish Atlas definitivo, recomenda-se separar os registros em uma área própria, por exemplo:

```text
data/
└── entries/
    ├── srt.md
    ├── dspira.md
    ├── rosie.md
    └── ...
```

ou uma fonte JSON equivalente.

Uma ficha poderá conter:

```yaml
---
id: srt
name: Small Radio Telescope
short_name: SRT
institution: MIT Haystack Observatory
country: United States
latitude: 42.62
longitude: -71.49
category: educational-radio-telescope
status: active
---
```

A mesma fonte poderá alimentar:

- mapa;
- clusters;
- busca;
- filtros;
- catálogo;
- contadores;
- ficha individual.

Evitar manter duas bases independentes com a mesma informação.

---

## 12. Cartografia

A geometria da versão de referência foi derivada da base Natural Earth e convertida para SVG.

O mapa é propositalmente simplificado para escala mundial.

Em aproximações extremas podem aparecer segmentos mais simplificados na costa ou fronteiras. Isso é **simplificação geométrica**, não pixelização.

Se no futuro for necessária cartografia mais detalhada, deve-se substituir a geometria por uma base vetorial de maior resolução, preservando:

- a mesma projeção;
- o mesmo `viewBox` ou ajustando a função `project()`;
- SVG inline;
- zoom por `viewBox`.

---

## 13. Estilo visual

A identidade adotada utiliza:

- fundo azul muito escuro;
- continentes azul-escuros;
- contornos e grade em ciano/azul;
- marcadores normais em ciano;
- seleção em vermelho discreto;
- tipografia técnica nos elementos de interface.

O estilo foi inspirado genericamente por interfaces cartográficas cinematográficas contemporâneas, mas os elementos da interface devem representar informações reais do projeto.

Evitar acrescentar números, gráficos ou indicadores fictícios apenas para produzir aparência tecnológica.

---

## 14. Funcionamento offline

A versão preservada funciona sem conexão com a internet porque todos os elementos necessários ao mecanismo estão locais:

```text
HTML
CSS
JavaScript
SVG
dados demonstrativos
```

Links externos presentes nas fichas naturalmente exigirão internet quando forem acessados.

Isso não constitui dependência cartográfica do componente.

---

## 15. O que NÃO fazer durante manutenção

### 15.1 Não converter o mapa para PNG/JPEG

Isso destrói a principal vantagem da solução: zoom vetorial.

### 15.2 Não usar SVG como simples imagem e depois ampliar a camada

Preservar o SVG inline e o zoom por `viewBox`.

### 15.3 Não aplicar `GaussianBlur` à cartografia

Uma versão intermediária utilizou glow/blur e produziu aparência borrada no zoom.

Se algum brilho for desejado, fazê-lo de maneira independente e muito controlada.

### 15.4 Não inserir manualmente x/y dos registros

Usar sempre latitude e longitude.

### 15.5 Não cadastrar clusters

Clusters são resultado da visualização, não conteúdo.

### 15.6 Não acoplar dados do ODA ao motor genérico

O componente deve continuar reutilizável.

---

## 16. Como cadastrar um novo registro na versão atual

Abra:

```text
data.js
```

Adicione um objeto dentro de `window.ODA_ENTRIES`.

Exemplo:

```javascript
{
    id: "novo-projeto",
    name: "Nome do projeto",
    institution: "Instituição",
    country: "Brasil",
    lat: -7.23,
    lon: -35.88,
    type: "Categoria",
    url: "/caminho/"
}
```

Salve e recarregue `index.html`.

O sistema deverá:

1. calcular a posição;
2. verificar proximidade com outros registros;
3. criar marcador ou cluster;
4. incluir o registro na contagem;
5. preencher o painel ao selecioná-lo.

---

## 17. Como alterar as cores

Editar:

```text
assets/style.css
```

Classes principais:

```text
.marker
.marker .halo
.marker .ring
.marker .core
.marker.active
.cluster-g
.cluster-g .halo
.cluster-g .ring
```

A cartografia está incorporada no `index.html`; suas cores aparecem nos atributos SVG, como:

```text
fill
stroke
stroke-opacity
```

Para uma futura versão genérica, recomenda-se mover as cores cartográficas para variáveis CSS.

---

## 18. Como alterar o limite de zoom

Em:

```text
assets/atlas-map.js
```

procurar:

```javascript
W / 12
```

Quanto maior o divisor, maior a aproximação máxima permitida.

Exemplo:

```text
W / 12 → zoom atual
W / 20 → permite aproximar mais
```

Antes de alterar, testar:

- linhas cartográficas;
- clusters;
- marcadores;
- arraste;
- painel.

---

## 19. Como alterar o comportamento dos clusters

Em `render()` existem limites associados ao nível de zoom.

Na referência:

```javascript
const zoom = W / vb.w;
const threshold =
    zoom < 1.7 ? 68 :
    zoom < 2.7 ? 42 :
    24;
```

Esses números controlam a distância usada para considerar pontos próximos.

Ajustes futuros devem ser feitos visualmente com conjuntos densos de registros.

---

## 20. Diagnóstico rápido de problemas

### O mapa ficou pixelizado

Verificar se:

- a cartografia continua SVG;
- ela continua inline;
- o zoom continua sendo feito pelo `viewBox`;
- ninguém substituiu a cartografia por PNG/JPEG;
- não foi aplicado `transform: scale()` ao mapa inteiro.

### Marcador aparece no lugar errado

Verificar:

- latitude;
- longitude;
- sinal negativo;
- ordem `lat, lon`;
- projeção utilizada pela nova cartografia.

### Marcadores ficaram enormes durante zoom

Verificar a escala inversa:

```javascript
scale(1 / zoom)
```

### Cluster não se desfaz

Verificar:

- cálculo de `zoom`;
- `threshold`;
- chamada de `render()` após alterar o `viewBox`.

### Não consigo arrastar

Verificar eventos:

```text
pointerdown
pointermove
pointerup
```

e se algum elemento está interceptando o ponteiro.

### Painel não abre

Verificar:

- `id` dos elementos no HTML;
- evento `click` do marcador;
- função `show()`.

---

## 21. Testes mínimos antes de publicar uma alteração

Sempre testar:

1. visão mundial;
2. zoom com botão `+`;
3. zoom com roda do mouse;
4. redução com `-`;
5. botão Home;
6. arrastar em zoom;
7. clicar em cluster;
8. observar cluster se dividir;
9. clicar em marcador;
10. fechar painel;
11. testar marcador selecionado;
12. testar em largura de celular;
13. testar sem internet;
14. aproximar bastante uma costa ou fronteira e verificar ausência de pixels.

Região útil para teste de nitidez: Flórida/Cuba ou Europa.

---

## 22. Histórico técnico da solução

### Etapa 1 — protótipo simples

Mapa simplificado e marcadores para validar a ideia de navegação geográfica.

### Etapa 2 — fundo raster estilizado

Foi criada uma estética azul tecnológica. O resultado visual funcionou, mas o PNG perdia resolução no zoom.

### Etapa 3 — SVG externo

A cartografia passou a ser vetorial. Entretanto, a forma de ampliação e efeitos de glow ainda produziam aparência inadequada.

### Etapa 3.1 — remoção de blur

Foram removidos `GaussianBlur`, glow e sombras. Isso melhorou o traço, mas não resolveu completamente o problema percebido durante ampliação.

### Etapa 4 — arquitetura definitiva de referência

A cartografia foi incorporada como SVG inline.

Mapa e dados passaram a compartilhar o mesmo SVG.

O zoom passou a modificar o `viewBox`, eliminando a ampliação de uma camada previamente renderizada.

Esta é a arquitetura preservada neste pacote.

---

## 23. Fluxo recomendado para futuras aplicações

```text
BASE CARTOGRÁFICA
       +
MOTOR BERG INTERACTIVE MAP
       +
DADOS DA APLICAÇÃO
       ↓
INTERFACE
```

Exemplo:

```text
BERG Interactive Map
       +
Open Dish Atlas data
       ↓
Mapa do ODA
```

Outro projeto poderá fazer:

```text
BERG Interactive Map
       +
Escolas participantes
       ↓
Mapa de ações educacionais
```

Sem reescrever o motor.

---

## 24. Evolução recomendada do componente

Quando houver tempo para transformar a referência em componente genérico:

1. remover nomes específicos do ODA do motor;
2. mover dados para diretório próprio;
3. definir esquema único de metadados;
4. permitir configuração de título/legenda;
5. transformar cores em variáveis CSS;
6. documentar API mínima de inicialização;
7. manter a V4 original intacta como referência;
8. criar testes com conjuntos pequenos e densos;
9. preservar funcionamento offline;
10. evitar dependências externas sem necessidade real.

---

## 25. Arquivo de referência

A pasta `reference-v4/` incluída neste pacote deve ser tratada como **golden master**.

Não editar diretamente para experimentação.

Para desenvolver:

```text
reference-v4/       ← preservar
working-copy/       ← criar cópia e modificar
```

Se uma alteração futura quebrar o mapa, comparar com a referência.

---

## 26. Sobre documentação acadêmica

Em textos acadêmicos sobre o Open Dish Atlas, o componente pode ser descrito tecnicamente de forma concisa, por exemplo:

> A plataforma emprega cartografia vetorial SVG com registros posicionados por coordenadas geográficas, navegação por zoom e pan e agrupamento dinâmico de pontos, processados localmente no navegador e sem dependência de serviços cartográficos externos.

O detalhamento de implementação pertence à documentação técnica quando não fizer parte da pergunta de pesquisa.

Eventuais exigências editoriais sobre ferramentas utilizadas durante elaboração ou desenvolvimento devem ser tratadas de acordo com as regras específicas do evento, periódico ou instituição.

---

## 27. Resumo para manutenção futura

Se você abrir este pacote anos depois e precisar lembrar apenas do essencial:

**1.** O mapa é um SVG inline.  
**2.** Não transformar em imagem.  
**3.** Zoom = alterar `viewBox`.  
**4.** Pan = alterar `x/y` do `viewBox`.  
**5.** Ponto = latitude + longitude.  
**6.** `project()` converte lat/lon para SVG.  
**7.** Cluster é calculado automaticamente.  
**8.** Dados não devem ficar presos ao código do mapa.  
**9.** A V4 é a referência funcional.  
**10.** Preserve uma cópia intacta antes de qualquer refatoração.

---

## 28. Créditos cartográficos

Base geográfica derivada de **Natural Earth**, utilizada como geometria cartográfica vetorial e estilizada para o componente.

---

## 29. Identificação

**BERG — Brazilian Educational Radioastronomy Group**  
**Componente:** BERG Interactive Map  
**Projeto de origem:** Open Dish Atlas  
**Referência técnica:** V4 — True SVG  
**Data:** 2026-10-03
