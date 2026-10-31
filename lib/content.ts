export type Track = "html" | "css" | "js" | "react" | "a11y" | "web";
export type Question = {
  id: string;
  track: Track;
  title: string;
  code?: string;
  options: string[];
  correct: number;
  explanation: string;
  source: string;
};
export const tracks: {
  id: Track;
  name: string;
  tag: string;
  description: string;
  color: string;
  icon: string;
}[] = [
  {
    id: "html",
    name: "Primeiro, a estrutura",
    tag: "HTML",
    description: "Botões, formulários e boas bases.",
    color: "#ffb695",
    icon: "<>",
  },
  {
    id: "css",
    name: "Dê forma à ideia",
    tag: "CSS",
    description: "Caixas, espaços e seletores.",
    color: "#a8d8ff",
    icon: "#",
  },
  {
    id: "js",
    name: "Faça acontecer",
    tag: "JavaScript",
    description: "Transforme dados em pequenas descobertas.",
    color: "#ffe38f",
    icon: "{}",
  },
  {
    id: "react",
    name: "Pense em componentes",
    tag: "React",
    description: "Listas, props e estado na prática.",
    color: "#b2e9da",
    icon: "✳",
  },
  {
    id: "a11y",
    name: "Web para todo mundo",
    tag: "Acessibilidade",
    description: "Pequenos detalhes. Grandes diferenças.",
    color: "#e1c5ff",
    icon: "◎",
  },
  {
    id: "web",
    name: "Por trás da tela",
    tag: "Navegador",
    description: "Eventos, armazenamento e URLs.",
    color: "#ffbdce",
    icon: "↗",
  },
];
export const questions: Question[] = [
  {
    id: "h1",
    track: "html",
    title: "Qual elemento já nasce como um botão interativo?",
    code: "Qual é a escolha semântica?",
    options: [
      '<div class="botao">',
      '<button type="button">',
      '<span onclick="...">',
      '<strong role="link">',
    ],
    correct: 1,
    explanation:
      "O elemento button já oferece interação por teclado e semântica de botão. A aparência pode ser ajustada com CSS.",
    source:
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button",
  },
  {
    id: "h2",
    track: "html",
    title: "Como um label se conecta a um campo usando atributos?",
    code: '<label for="email">E-mail</label>\n<input ... />',
    options: [
      'O input precisa de name="email"',
      'O label precisa de value="email"',
      'O input precisa de id="email"',
      "Os dois precisam da mesma classe",
    ],
    correct: 2,
    explanation:
      "O for do label aponta para o id do controle. Isso também permite focar o campo ao clicar no rótulo.",
    source:
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label",
  },
  {
    id: "h3",
    track: "html",
    title: "Qual atributo fornece texto alternativo para uma imagem?",
    code: '<img src="gato.webp" ... />',
    options: ["title", "caption", "aria-color", "alt"],
    correct: 3,
    explanation:
      'alt fornece a alternativa textual da imagem. Para imagem puramente decorativa, alt="" pode ser apropriado.',
    source:
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img",
  },
  {
    id: "h4",
    track: "html",
    title:
      "Dentro de um formulário, como impedir que este botão envie o formulário?",
    options: [
      'Usar type="button"',
      'Usar disabled="false"',
      "Trocar o texto do botão",
      'Adicionar target="_self"',
    ],
    correct: 0,
    explanation:
      'type="button" cria um botão sem a ação padrão de enviar o formulário. Um button associado a form pode atuar como submit quando o tipo não é informado.',
    source:
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button",
  },
  {
    id: "c1",
    track: "css",
    title: "Qual é a largura externa, sem contar margem?",
    code: ".caixa {\n  box-sizing: content-box;\n  width: 100px;\n  padding: 10px;\n  border: 2px solid;\n}",
    options: ["100px", "120px", "124px", "144px"],
    correct: 2,
    explanation:
      "No content-box, padding e borda são adicionados: 100 + 10 + 10 + 2 + 2 = 124px.",
    source:
      "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model",
  },
  {
    id: "c2",
    track: "css",
    title:
      "Agora a caixa usa border-box. Qual é a largura externa, sem margem?",
    code: ".caixa {\n  box-sizing: border-box;\n  width: 100px;\n  padding: 10px;\n  border: 2px solid;\n}",
    options: ["124px", "100px", "80px", "104px"],
    correct: 1,
    explanation:
      "Em border-box, a largura declarada já inclui conteúdo, padding e borda. A margem continua fora dessa medida.",
    source: "https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing",
  },
  {
    id: "c3",
    track: "css",
    title: "Qual seletor escolhe apenas filhos diretos de .lista?",
    options: [
      ".lista .item",
      ".lista + .item",
      ".lista ~ .item",
      ".lista > .item",
    ],
    correct: 3,
    explanation:
      "O combinador > seleciona filhos diretos. O espaço seleciona descendentes em qualquer profundidade.",
    source: "https://developer.mozilla.org/en-US/docs/Web/CSS/Child_combinator",
  },
  {
    id: "c4",
    track: "css",
    title:
      "Em uma linha flex, qual propriedade centraliza os itens no eixo principal?",
    code: ".linha { display: flex;\n  flex-direction: row; }",
    options: [
      "justify-content: center",
      "align-content: stretch",
      "text-transform: center",
      "place-text: center",
    ],
    correct: 0,
    explanation:
      "justify-content distribui os itens ao longo do eixo principal. Em flex-direction: row, esse eixo acompanha a direção da linha.",
    source: "https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content",
  },
  {
    id: "j1",
    track: "js",
    title: "Qual é o resultado?",
    code: "[1, 2, 3].map(n => n * 2)",
    options: ["[1, 2, 3, 2]", "[2, 4, 6]", "6", "[1, 4, 9]"],
    correct: 1,
    explanation:
      "map cria um novo array com o resultado da função para cada elemento: 2, 4 e 6.",
    source:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map",
  },
  {
    id: "j2",
    track: "js",
    title: "Quais valores ficam no array?",
    code: "[2, 5, 8, 11].filter(n => n > 6)",
    options: ["[2, 5]", "[6, 8, 11]", "[8, 11]", "[11]"],
    correct: 2,
    explanation:
      "filter mantém apenas os elementos que passam no teste. Aqui, 8 e 11 são maiores que 6.",
    source:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter",
  },
  {
    id: "j3",
    track: "js",
    title: "O que esta comparação retorna?",
    code: '2 === "2"',
    options: ["true", '"true"', "2", "false"],
    correct: 3,
    explanation:
      "A igualdade estrita não converte os tipos. Um número e uma string com os mesmos caracteres continuam diferentes.",
    source:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality",
  },
  {
    id: "j4",
    track: "js",
    title: "Qual é o valor final?",
    code: "[1, 2, 3].reduce((soma, n) => soma + n, 0)",
    options: ["6", "0", "123", "[6]"],
    correct: 0,
    explanation:
      "O acumulador começa em 0 e recebe 1, depois 2, depois 3: o resultado é 6.",
    source:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce",
  },
  {
    id: "r1",
    track: "react",
    title: "O que ajuda o React a identificar itens entre renderizações?",
    code: "itens.map(item => (\n  <li key={item.id}>{item.nome}</li>\n))",
    options: [
      "O tamanho do texto",
      "Uma key estável entre irmãos",
      "O nome da classe CSS",
      "Uma cor diferente para cada item",
    ],
    correct: 1,
    explanation:
      "Uma key estável ajuda o React a relacionar cada item com sua posição na árvore, especialmente em inserções, remoções e reordenações.",
    source: "https://react.dev/learn/rendering-lists",
  },
  {
    id: "r2",
    track: "react",
    title: "Qual Hook permite declarar estado local em um componente?",
    options: ["useFont", "useClass", "useState", "usePage"],
    correct: 2,
    explanation:
      "useState declara uma variável de estado e uma função para atualizá-la. A atualização pede uma nova renderização.",
    source: "https://react.dev/reference/react/useState",
  },
  {
    id: "r3",
    track: "react",
    title: "Qual é a forma usual de passar dados do pai para o filho?",
    code: '<Saudacao nome="Lia" />',
    options: [
      "Alterar o HTML manualmente",
      "Usar sempre localStorage",
      "Mudar o CSS do filho",
      "Passar props",
    ],
    correct: 3,
    explanation:
      "Props são os dados passados a um componente. Neste exemplo, o filho recebe a prop nome com o valor Lia.",
    source: "https://react.dev/learn/passing-props-to-a-component",
  },
  {
    id: "r4",
    track: "react",
    title:
      "Como manter o array anterior intacto ao adicionar um item ao estado?",
    code: "const [itens, setItens] = useState([1, 2]);",
    options: [
      "setItens([...itens, 3])",
      "itens.push(3)",
      "itens = 3",
      "setItens(itens.pop())",
    ],
    correct: 0,
    explanation:
      "Criar outro array com spread mantém o anterior intacto. Arrays em estado devem ser tratados como somente leitura.",
    source: "https://react.dev/learn/updating-arrays-in-state",
  },
  {
    id: "a1",
    track: "a11y",
    title: "O botão tem só um ícone de lupa. O que fornece um nome acessível?",
    options: [
      "Apenas aumentar o ícone",
      'aria-label="Buscar"',
      'title=""',
      "background: search",
    ],
    correct: 1,
    explanation:
      "aria-label pode fornecer o nome acessível quando o botão não tem texto visível. Se houver texto visível, o nome deve ser coerente com ele.",
    source:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label",
  },
  {
    id: "a2",
    track: "a11y",
    title: "Qual comportamento ajuda quem navega por teclado?",
    options: [
      "Ocultar todo outline",
      "Usar apenas hover",
      "Manter um indicador de foco visível",
      "Exigir arrastar para continuar",
    ],
    correct: 2,
    explanation:
      "Um foco visível mostra qual controle receberá a próxima ação. Remover o outline sem uma alternativa dificulta a navegação.",
    source: "https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible",
  },
  {
    id: "a3",
    track: "a11y",
    title: "Como respeitar a preferência por menos movimento no CSS?",
    options: [
      "Acelerar todas as animações",
      "Usar animation: infinite",
      "Exigir tela cheia",
      "Usar prefers-reduced-motion",
    ],
    correct: 3,
    explanation:
      "A media query prefers-reduced-motion permite reduzir ou remover movimentos não essenciais conforme a preferência do usuário.",
    source:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion",
  },
  {
    id: "a4",
    track: "a11y",
    title:
      "Uma mensagem de resultado foi atualizada sem mover o foco. Qual recurso pode anunciá-la de forma educada?",
    options: [
      'role="status"',
      'tabindex="999"',
      'aria-hidden="true"',
      "display: none",
    ],
    correct: 0,
    explanation:
      'role="status" cria uma região com anúncio educado das atualizações. Ela é adequada para informações que não precisam interromper a pessoa.',
    source:
      "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/status_role",
  },
  {
    id: "w1",
    track: "web",
    title: "Que tipo de valor é gravado diretamente por localStorage.setItem?",
    code: 'localStorage.setItem("tema", "escuro");',
    options: ["Funções", "Strings", "Elementos HTML", "Arquivos binários"],
    correct: 1,
    explanation:
      "localStorage armazena chaves e valores como strings. Objetos precisam de serialização, como JSON.stringify, e leitura correspondente.",
    source:
      "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage",
  },
  {
    id: "w2",
    track: "web",
    title: "Qual chamada registra uma ação ao clicar?",
    code: 'const botao = document.querySelector("button");',
    options: [
      'botao.style("click")',
      'botao.addClass("click")',
      'botao.addEventListener("click", acao)',
      "botao.push(acao)",
    ],
    correct: 2,
    explanation:
      "addEventListener registra uma função para um tipo de evento. Aqui, acao será chamada quando o evento click chegar ao botão.",
    source:
      "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener",
  },
  {
    id: "w3",
    track: "web",
    title: "Em uma URL, como se chama a parte que começa por #?",
    code: "https://exemplo.com/guia#formularios",
    options: ["Protocolo", "Domínio", "Query string", "Fragmento"],
    correct: 3,
    explanation:
      "O fragmento começa por #. Ele pode identificar uma parte do documento e não é enviado ao servidor na requisição HTTP.",
    source:
      "https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment",
  },
  {
    id: "w4",
    track: "web",
    title: "O que event.preventDefault() faz quando o evento é cancelável?",
    options: [
      "Cancela a ação padrão daquele evento",
      "Apaga todos os listeners",
      "Fecha o navegador",
      "Interrompe sempre a propagação",
    ],
    correct: 0,
    explanation:
      "preventDefault tenta impedir a ação padrão de um evento cancelável. Parar a propagação é outra operação, como stopPropagation.",
    source:
      "https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault",
  },
];
export const byId = Object.fromEntries(
  questions.map((q) => [q.id, q]),
) as Record<string, Question>;
