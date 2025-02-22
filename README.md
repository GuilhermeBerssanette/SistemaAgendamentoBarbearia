## Sistema de Agendamento para Barbearias

### Introdução

O Sistema de Agendamento para Barbearias é uma plataforma intuitiva e moderna, desenvolvida para facilitar a gestão de barbearias e a experiência dos clientes. Com funcionalidades robustas, o sistema permite que barbearias organizem seus serviços, gerenciem horários, e interajam diretamente com seus clientes de forma prática e eficiente.

O sistema foi desenvolvido utilizando Angular 17, Firebase (Firestore, Storage, Authentication), e integrações com APIs como o Google Calendar para garantir uma experiência completa e automatizada.

### Tecnologias Utilizadas 

- Angular 17: Para desenvolvimento.
- Firebase: Firestore, Storage, Authentication.
- Google Calendar API: Para integração com agendamentos.
- SCSS e Bootstrap: Para estilização responsiva e moderna.
- Node.js: Para funções serverless com Firebase Functions.


### Apresentação do sistema

![Descrição da imagem](src/assets/doc/img-login.png)
---
![Descrição da imagem](src/assets/doc/img-initialPage.png)
![Descrição da imagem](src/assets/doc/img-filtro.png)
#### Página Inicial  
A página inicial do sistema exibe todas as barbearias cadastradas. Essa interface permite que usuários localizem e visualizem as barbearias de forma prática. Na parte superior direita, há um link chamado "Cadastrar barbearia", que permite o registro de um novo estabelecimento no sistema.

Funcionalidades Disponíveis na Página Inicial: 
- Busca por barbearia ou cidade: Utilize a barra de pesquisa para encontrar barbearias por nome ou localidade.
- Filtros e Limpar Filtros: Aplique filtros para refinar a busca ou limpe os filtros para ver todas as barbearias.
- Visualização das Barbearias: Cada card exibe informações como o nome da barbearia e seu endereço.
- Cadastrar Barbearia: Clique no link no canto superior direito para iniciar o cadastro de sua barbearia.
Como Cadastrar Sua Barbearia
- Clique no link "Cadastrar barbearia". 

--- 

![Descrição da imagem](src/assets/doc/img-registerBarbearia.png)
#### Página de Cadastro de Barbearia  
Esta é a página de cadastro da barbearia no sistema Agendamento Online. Aqui você poderá registrar sua barbearia para que ela seja exibida na página inicial e possa ser gerenciada.

Interface da Página  
- A página de cadastro é dividida em seções intuitivas para facilitar o preenchimento.


Campos Disponíveis
- Os campos estão agrupados de acordo com a natureza das informações a serem fornecidas:

Informações Gerais

- Nome Fantasia: Nome comercial da barbearia.
- Razão Social: Nome registrado oficialmente.
- Responsável: Nome do responsável pela barbearia.
- Seleção de Tipo

Pessoa Jurídica ou Pessoa Física: Indique o tipo de cadastro.
- UF e Cidade: Localização da barbearia.
- Rua e Número: Endereço completo.  

Contato
- Email: Endereço de email para contato.
- Celular: Número de celular.
- Telefone: Número de telefone fixo.
- WhatsApp: Número com suporte para comunicação no WhatsApp.

Redes Sociais
- Instagram
- Facebook
- TikTok
- Twitter

Como Preencher
- Preencha todos os campos obrigatórios (indicados pelo sistema).
- Escolha o tipo de cadastro (Pessoa Física ou Jurídica).
- Insira informações completas e precisas.
- Clique no botão Cadastrar ao final do formulário.  

Importante
- Certifique-se de inserir um número válido no campo WhatsApp, pois ele é obrigatório para comunicação com os clientes.
- As informações de redes sociais são opcionais, mas recomendadas para promover sua barbearia.
- Após o cadastro, sua barbearia será listada na página inicial e estará pronta para ser gerenciada no sistema.

--- 
![Descrição da imagem](src/assets/doc/img-admin.png)
#### Página Admin da Barbearia
Esta é a página administrativa da barbearia no sistema Agendamento Online. Nela, você poderá visualizar as principais informações da sua barbearia, gerenciar barbeiros, editar o perfil e acompanhar métricas de desempenho.

Interface da Página  
A página é organizada em três seções principais, acessíveis por botões na parte superior:
- Dashboard (página inicial da administração)
- Gerenciar Barbeiros
- Editar Perfil

Seção: Dashboard  
O Dashboard oferece um panorama geral do desempenho da barbearia com os seguintes indicadores:
- Renda Gerada: Valor total obtido pela barbearia.
- Agendamentos Realizados: Número total de serviços realizados.
- Gráfico de Renda e Serviços por Barbeiro: Comparativo entre os ganhos e os serviços concluídos por cada barbeiro.

Seção: Gerenciar Barbeiros  
Nesta seção, você poderá:
- Adicionar novos barbeiros à barbearia.
- Visualizar a lista de barbeiros cadastrados.
- Editar ou excluir barbeiros conforme necessário.

Seção: Editar Perfil  
A seção de Editar Perfil permite atualizar as informações da barbearia, incluindo:
- Dados de contato (telefone, email, WhatsApp).
- Endereço (cidade, estado, rua, número).
- Redes sociais (Instagram, Facebook, TikTok, Twitter).
- Imagem de perfil da barbearia.

--- 

![Descrição da imagem](src/assets/doc/img-googleBarbeiro.png)
#### Tela de Login com Google
Na primeira vez que o barbeiro acessar o sistema Agendamento Online, será apresentada uma tela de autorização do Google, conforme mostrado na imagem abaixo:    

Por que essa autorização é necessária? 
O sistema solicita permissão para acessar o Google Agenda do barbeiro. Isso é essencial para:
- Gerenciar agendamentos: O sistema pode criar, editar ou excluir compromissos diretamente na agenda do barbeiro, garantindo organização e eficiência no gerenciamento dos horários.  

Após conceder a permissão, o barbeiro será direcionado à tela principal do barbeiro, onde poderá visualizar e gerenciar seus serviços, horários e informações pessoais. Essa tela será apresentada a seguir.

--- 
![Descrição da imagem](src/assets/doc/img-barbeiroAdm.png)

#### Tela de Administração do Barbeiro
Após o login e a autorização inicial do Google, o barbeiro será direcionado para a tela de administração, conforme mostrado abaixo:  

Funcionalidades disponíveis:

Dashboard  
Visualize métricas importantes, como:
- Renda gerada.
- Quantidade de agendamentos realizados.
- Acompanhe gráficos de serviços realizados e receita por barbeiro.  

Galeria de Fotos  
Permite ao barbeiro gerenciar fotos de cortes ou serviços realizados, possibilidade de adicionar imagens com comentários personalizados.  
- Objetivo: Auxiliar o barbeiro a exibir seu portfólio de trabalho diretamente no sistema, além de ampliar sua presença digital, complementando plataformas como Instagram.  


Gerenciar Serviços  
Configure os serviços oferecidos, como:
- Nome do serviço (ex.: corte de cabelo, barba).
- Preços e durações.
- Editar Perfil

Atualize informações pessoais ou de contato, como:
- Nome.
- Redes sociais.
- Telefone e WhatsApp.
- Propósito da Tela
- 
Essa interface foi projetada para oferecer controle total ao barbeiro sobre seus serviços, agendamentos e informações de exibição, integrando dados diretamente com o Google Agenda para máxima eficiência no gerenciamento de horários. Além disso, a galeria de fotos permite que o barbeiro mostre sua experiência e qualidade, impactando diretamente na atração de novos clientes.

--- 

![Descrição da imagem](src/assets/doc/img-galeria.png)
![Descrição da imagem](src/assets/doc/img-servicooCadastrado.png)
![Descrição da imagem](src/assets/doc/img-horarios.png)

---

![Descrição da imagem](src/assets/doc/img-barbearia.png)
#### Tela da Barbearia
Na tela da barbearia, você encontrará as principais informações sobre o estabelecimento selecionado. Essa página é projetada para oferecer uma experiência fácil e informativa para os usuários que desejam conhecer mais sobre a barbearia e seus serviços.  

Principais funcionalidades:

Informações da Barbearia:
- No topo da tela, o nome da barbearia é exibido junto ao logotipo.
- A localização e outras informações essenciais podem ser acessadas rapidamente.

Favoritar Barbearia:
- Há um ícone de coração próximo ao nome da barbearia. O usuário pode clicar nele para favoritar o estabelecimento, facilitando o acesso no futuro.

Redes Sociais e Contatos:
- Os ícones no canto superior direito permitem que o usuário acesse as redes sociais da barbearia, como Instagram, TikTok e WhatsApp, ou encontre a localização diretamente pelo Google Maps. Isso torna o contato mais dinâmico e direto.

Barbeiros Disponíveis:
- Todos os barbeiros cadastrados na barbearia serão listados nesta tela. Ao lado do nome de cada barbeiro, há um ícone de interrogação (?). Clicando nele, o usuário pode visualizar informações detalhadas sobre aquele profissional, como experiência e especialidades.


Essa tela foi pensada para oferecer ao cliente todas as ferramentas necessárias para uma interação completa e eficiente com a barbearia.

___ 

![Descrição da imagem](src/assets/doc/img-barbeiro.png)
#### Tela do Barbeiro
A tela do barbeiro é projetada para destacar o profissional e os serviços que ele oferece, permitindo ao cliente conhecer melhor o trabalho do barbeiro e se conectar diretamente com ele.

Funcionalidades principais:
Perfil do Barbeiro:  
- Exibe a foto do barbeiro em destaque, junto com o nome logo abaixo, proporcionando uma identidade visual clara.  


Tela Inicial:   
Apresenta uma lista organizada dos serviços que o barbeiro oferece.  
Para cada serviço, são exibidos:
- Nome do serviço.
- Valor cobrado.
- Duração estimada.

Fotos: Direciona para a galeria de fotos do barbeiro , onde o cliente pode visualizar imagens de trabalhos realizados.

Essa tela oferece uma experiência completa e personalizada para os clientes, permitindo conhecer o barbeiro, seus serviços e entrar em contato de maneira prática.

--- 

![Descrição da imagem](src/assets/doc/img-calendario.png)
![Descrição da imagem](src/assets/doc/img-confirm.png)

#### Agendamento de Serviço
Após escolher o serviço desejado, o usuário será redirecionado para a página de Agendar Serviço. Nesta tela, o sistema exibirá um calendário com todos os horários disponíveis para o dia selecionado. O usuário pode:
- Selecionar uma data usando o campo fornecido na parte superior.
- Escolher um dos horários disponíveis, que são exibidos em formato de botões para facilitar a navegação.
- Confirmação do Agendamento  


Depois de selecionar o horário, será aberta uma janela de Confirmação com as seguintes informações:
- Data: Data escolhida para o agendamento.
- Horário: Horário selecionado.
- Serviço: Nome do serviço escolhido (ex.: Barba, Cabelo).
- Barbeiro: Nome do barbeiro que realizará o serviço.
- Preço: Valor do serviço.  

O usuário precisará inserir o seu nome no campo disponível para finalizar o agendamento. Após preencher o nome, basta clicar em Confirmar.

--- 
![Descrição da imagem](src/assets/doc/img-confirmation.png)
![Descrição da imagem](src/assets/doc/img-googleAgendas.png)
#### Agendamento Confirmado no Google Agenda
Após o cliente clicar no botão "Confirmar" na tela de confirmação do agendamento, o sistema solicitará a autorização para acessar o Google Agenda. Esta permissão é necessária para criar e gerenciar eventos na conta do Google do cliente.

Na primeira imagem acima, é exibida a tela de consentimento do Google, onde o cliente poderá conceder acesso ao BarberHub para visualizar e adicionar eventos em sua agenda. Esta etapa é essencial para garantir que o sistema possa realizar a integração de agendamentos diretamente no Google Agenda.

Assim que a permissão é concedida, o sistema cria automaticamente um evento tanto na agenda do cliente quanto na agenda do barbeiro. A segunda imagem mostra o evento adicionado no Google Agenda, contendo as seguintes informações:

- Título do Evento: Agendamento: Barbearia
- Data e Horário: Data e horário escolhidos pelo cliente.
- Serviço: Serviço agendado (exemplo: Barba).
- Barbeiro: Nome do barbeiro responsável pelo serviço.
- Link de Localização: Endereço da barbearia integrado ao Google Maps.
- Notificação Prévia: Alerta configurado para 30 minutos antes do agendamento.

Essa funcionalidade é uma maneira prática e eficiente de organizar os compromissos, tanto para os clientes quanto para os barbeiros, utilizando o Google Agenda para garantir que nenhum horário seja esquecido.

---

A seguir, apresentamos a parte escrita do Trabalho de Conclusão de Curso (TCC).

---






INSTITUTO FEDERAL DO PARANÁ

GUILHERME OTAVIO ESPIRITO SANTO BERSSANETTE

JOÃO VITOR SILVA

MANOEL PEDRO MARTINS NETO

## DESENVOLVIMENTO DE UM SISTEMA WEB PARA GERENCIAMENTO DE ATIVIDADES EM BARBEARIAS

PONTA GROSSA

2024

GUILHERME OTAVIO ESPIRITO SANTO BERSSANETTE

JOÃO VITOR SILVA

MANOEL PEDRO MARTINS NETO

## DESENVOLVIMENTO DE UM SISTEMA WEB PARA GERENCIAMENTO DE ATIVIDADES EM BARBEARIAS

## DEVELOPMENT OF A WEB SYSTEM FOR MANAGING BARBERSHOP ACTIVITIES

> Projeto apresentado ao componente curricular Projeto e Desenvolvimento
> de Sistemas, do curso Técnico em Informática Integrado ao Ensino Médio
> do Instituto Federal do Paraná (IFPR), como requisito parcial a para
> obtenção do título de Técnico em Informática.
>
> Orientador(a): Prof. Dr. João Henrique Berssanette

PONTA GROSSA

2024



## AGRADECIMENTOS

Certamente, estas palavras não serão suficientes para expressar toda a
minha gratidão a todas as pessoas que fizeram parte desta etapa tão
significativa da minha vida. Peço desculpas às que não estão nominadas
aqui, mas saibam que fazem parte dos meus pensamentos e do meu sincero
agradecimento.

Agradeço, em primeiro lugar, ao meu orientador, Prof. Dr. João Henrique
Berssanette, pela paciência, sabedoria e dedicação ao longo desta
jornada. Sua orientação foi fundamental para que eu pudesse superar
desafios e alcançar os objetivos deste trabalho.

Aos meus colegas de sala, pela parceria, troca de ideias e momentos de
descontração, que tornaram essa trajetória mais leve e enriquecedora. À
Secretaria do Curso, pela cooperação e suporte ao longo do
desenvolvimento deste projeto.

Deixo registrado o meu profundo reconhecimento à minha família, que
sempre esteve ao meu lado, oferecendo apoio incondicional, palavras de
incentivo e compreensão nos momentos de dificuldade.

Por fim, agradeço a todos que, de alguma forma, contribuíram para a
realização deste trabalho, seja com palavras de encorajamento, conselhos
ou auxílio direto. Àqueles que acreditaram em mim, dedico este esforço e
conquista.

Se este trabalho pôde ser realizado com sucesso, é graças ao apoio de
todas essas pessoas e instituições.



## RESUMO

O mercado de salões de beleza masculino está em plena expansão, mas
muitas barbearias ainda enfrentam dificuldades na organização de
horários devido à ausência de sistemas de agendamento online. Essa falta
de organização resulta em impactos negativos tanto para os barbeiros,
que têm dificuldades em gerenciar seus compromissos e prestar um
atendimento de qualidade, quanto para os clientes, que frequentemente
enfrentam inconvenientes para agendar seus serviços. Este projeto tem
como objetivo desenvolver um sistema de agendamento online para
barbearias, utilizando o framework Angular e a metodologia de
prototipação. Essa abordagem permite o desenvolvimento de ciclos rápidos
e a validação contínua das funcionalidades do sistema, garantindo sua
eficácia e eficiência. Além de solucionar um problema recorrente no
setor, o sistema também abre oportunidades para sua comercialização no
mercado, sendo uma alternativa viável e inovadora. Simultaneamente, o
desenvolvimento do projeto permite que os estudantes do curso técnico
apliquem de forma prática os conhecimentos adquiridos durante sua
formação, contribuindo significativamente para o aprimoramento de suas
competências acadêmicas e profissionais, além de criar um impacto direto
no setor de beleza masculino, modernizando e otimizando os processos das
barbearias.

**Palavras-chave:** Sistema web; Controle de agendamento; Barbearia.

## ABSTRACT

The men\'s beauty salon market is booming, but many barbershops still
face difficulties in organizing their schedules due to the lack of
online scheduling systems. This lack of organization results in negative
impacts both for barbers, who have difficulty managing their
appointments and providing quality service, and for clients, who often
face inconvenience in scheduling their services. This project aims to
develop an online scheduling system for barbershops, using the Angular
framework and prototyping methodology. This approach allows for rapid
development cycles and continuous validation of the system\'s
functionalities, ensuring its effectiveness and efficiency. As well as
solving a recurring problem in the sector, the system also opens up
opportunities for its commercialization on the market, making it a
viable and innovative alternative. At the same time, the development of
the project allows students on the technical course to apply the
knowledge acquired during their training in a practical way, making a
significant contribution to improving their academic and professional
skills, as well as creating a direct impact on the male beauty sector by
modernizing and optimizing barbershop processes.

**Keywords**: web system; appointment control; barbershop.


LISTA DE ABREVIATURAS E SIGLAS

<table>
<colgroup>
<col style="width: 15%" />
<col style="width: 84%" />
</colgroup>
<thead>
<tr class="header">
<th><blockquote>
<p>ABNT</p>
</blockquote></th>
<th><blockquote>
<p>Associação Brasileira de Normas Técnicas</p>
</blockquote></th>
</tr>
<tr class="odd">
<th><blockquote>
<p>Coef.</p>
<p>G1</p>
</blockquote></th>
<th><blockquote>
<p>Coeficiente</p>
<p>Central Globo de Jornalismo</p>
</blockquote></th>
</tr>
<tr class="header">
<th><blockquote>
<p>IBGE</p>
</blockquote></th>
<th><blockquote>
<p>Instituto Brasileiro de Geografia e Estatística</p>
</blockquote></th>
</tr>
<tr class="odd">
<th><blockquote>
<p>NBR</p>
</blockquote></th>
<th><blockquote>
<p>Normas Brasileiras</p>
</blockquote></th>
</tr>
<tr class="header">
<th><blockquote>
<p>IFPR</p>
<p>BD</p>
</blockquote></th>
<th><blockquote>
<p>Instituto Federal do Paraná</p>
<p>Banco de Dados</p>
</blockquote></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 1.  **INTRODUÇÃO**

No Brasil, o mercado de barbearias tem se destacado pelo crescimento
constante. De acordo com um relatório da agência Euromonitor, o consumo
no mercado brasileiro de beleza masculina cresceu 70% entre 2012 e 2017,
atingindo uma arrecadação de R\$ 19,8 bilhões. Mantendo esse ritmo, o
Brasil pode ultrapassar os Estados Unidos e se tornar o líder global no
segmento. Entretanto, esse crescimento também trouxe desafios, como a
dificuldade que muitas barbearias enfrentam para organizar seus horários
e atender à alta demanda de clientes de forma eficiente.

Nesse cenário, o agendamento online desponta como uma solução prática e
eficiente, capaz de trazer agilidade, praticidade e autonomia ao
processo de atendimento. Essa ferramenta se torna indispensável para
barbearias que buscam aprimorar a experiência de seus clientes,
oferecendo um atendimento mais organizado e profissional.

Portanto, este trabalho propõe o desenvolvimento de um sistema de
agendamento online voltado para barbearias, com o objetivo de
automatizar e otimizar o gerenciamento de horários. A proposta visa
facilitar a rotina tanto dos clientes quanto dos barbeiros, que
frequentemente enfrentam a falta de organização em um cotidiano cada vez
mais acelerado.

## 1.1 Problema

Na atualidade, a busca por praticidade e agilidade leva os clientes a
preferirem opções que facilitem o agendamento de serviços, como nas
barbearias. No entanto, uma parcela significativa desses
estabelecimentos inicia suas atividades sem dispor de muitos recursos e,
consequentemente, sem um sistema capaz de gerenciar de forma eficiente a
logística de agendamento de horários. Essa ausência pode ocasionar
desorganização nos horários, dificultando o atendimento adequado aos
clientes e impactando a rotina dos profissionais. Um sistema eficiente
de agendamento pode não apenas otimizar o processo de organização da
agenda dos barbeiros, mas também melhorar significativamente o
relacionamento entre os profissionais e seus clientes, promovendo uma
experiência mais prática e satisfatória para ambas as partes.

## 1.2 Objetivos

### 1.2.1 Geral

O objetivo geral deste trabalho é desenvolver um sistema web de
agendamento de horários para barbearias, com foco em oferecer maior
controle e eficiência na organização de horários, atendendo às
necessidades específicas dos salões de cabeleireiros masculinos.

### 1.2.2 Específicos

- Identificar os requisitos essenciais do sistema com base nas necessidades dos barbeiros e barbearias;

- Projetar funcionalidades específicas para o sistema, como agendamento integrado ao Google Calendar, gerenciamento de serviços, cadastro de barbeiros e criação de galerias de fotos, alinhando-se às demandas do mercado;

- Modelar o banco de dados no Firebase, garantindo a organização, segurança e eficiência no armazenamento e recuperação de informações.

- Implementar uma interface responsiva e intuitiva, projetada para facilitar a interação de diferentes tipos de usuários em dispositivos móveis e desktop.

- Realizar testes e validações em todas as etapas do desenvolvimento, assegurando a robustez, usabilidade e confiabilidade do sistema final.

## 1.3 Justificativa

A relevância deste projeto está associada ao crescimento significativo
do número de barbearias no mercado, muitas das quais ainda não dispõem
de sistemas para gestão eficiente de horários. A ausência de ferramentas
adequadas frequentemente resulta em desorganização, impactando
negativamente tanto a rotina dos barbeiros quanto a experiência dos
clientes. Nesse contexto, o desenvolvimento de um sistema de agendamento
online se justifica como uma solução prática e viável para enfrentar
esses desafios. Além de otimizar a organização de horários, o sistema
tem o potencial de melhorar o relacionamento entre barbeiros e clientes,
contribuindo para um atendimento mais eficiente e satisfatório

## 1.4 Organização do Trabalho

Este trabalho está organizado em cinco capítulos, estruturados da
seguinte forma: no capítulo 2, será apresentada a fundamentação teórica,
que abrange os principais elementos do projeto e uma análise comparativa
de sistemas existentes, destacando as diferenças e melhorias propostas
pelo sistema desenvolvido. No capítulo 3, serão descritos os
procedimentos metodológicos utilizados no desenvolvimento do sistema,
com detalhes sobre as técnicas e ferramentas empregadas. O capítulo 4
apresentará o cronograma de desenvolvimento e as etapas realizadas ao
longo do projeto. No capítulo 5, serão sintetizados os resultados
obtidos, os desafios enfrentados e as possíveis direções futuras para o
aprimoramento do sistema.

# 2.  **FUNDAMENTAÇÃO TEÓRICA**

Neste capítulo, são apresentados os principais elementos e conceitos que
sustentam o desenvolvimento do sistema de agendamento para barbearias. A
compreensão desses fundamentos é essencial para justificar as escolhas
relacionadas ao design, às funcionalidades implementadas e às abordagens
técnicas adotadas durante o desenvolvimento do sistema. Além disso,
serão exploradas teorias e conhecimentos que embasam o projeto,
contextualizando-o no corpo de conhecimento existente e demonstrando
como essas bases teóricas foram aplicadas na prática para atender às
necessidades identificadas.

## 2.1 Barbearia

Uma barbearia é um estabelecimento comercial dedicado ao tratamento e
cuidado do cabelo e da barba, oferecendo serviços como modelagem de
barba, tratamentos capilares e outros cuidados estéticos. Além dos
serviços, muitas barbearias se destacam por proporcionar um ambiente
social acolhedor, promovendo interação entre os clientes e momentos de
descontração e relaxamento. Alguns desses estabelecimentos, inclusive,
oferecem itens de consumo, como bebidas e jogos, para tornar a
experiência mais agradável.

O mercado de barbearias tem apresentado um crescimento significativo. De
acordo com um levantamento do Correio Braziliense (2023), existem
aproximadamente 16 mil empresas registradas no setor de beleza e
estética no Distrito Federal, das quais 14,4 mil são de
Microempreendedores Individuais (MEI). Entre 2022 e 2023, foram
registrados 7.147 novos CNPJs no ramo, reforçando o dinamismo do setor.

Entretanto, esse crescimento traz consigo desafios operacionais. Entre
os principais problemas enfrentados pelas barbearias estão as
dificuldades no gerenciamento de agendamentos e no relacionamento entre
barbeiros e clientes. Nesse sentido, este projeto busca resolver esses
desafios, propondo um sistema de agendamento online para organizar
horários e melhorar a experiência de ambas as partes, contribuindo para
a eficiência e a satisfação no setor.

## 2.2 Sistema de Agendamento

O sistema de agendamento é uma ferramenta crucial para a otimização de
tempo e serviços em muitos tipos de empreendimentos, dentre eles, as
barbearias. Tal sistema permite o agendamento de maneira confortável
para o cliente, garantindo a satisfação e a organização das empresas e
seus consumidores.

Segundo Ninsaúde, um sistema de agendamento eficiente não é apenas uma
ferramenta para marcar compromissos; é um pilar central na otimização de
fluxos de trabalho.

Dessa forma, se torna nítido a importância de um sistema de agendamento.
Considerando o contexto da barbearia, um sistema de agendamento se torna
de extrema importância, visto que, a partir dele, conseguimos erradicar
problemas comuns como o conflito no momento de encontrar horários,
proporcionando melhores experiências cliente-barbeiro.

## 2.3 Sistema Web

Um sistema web é um software desenvolvido para ser acessado por meio de
navegadores de internet, como o Google Chrome, exigindo apenas um
dispositivo conectado à rede, seja um computador ou dispositivo móvel.
Esses sistemas variam em complexidade e funcionalidade, desde sites
simples, usados para exibição de informações, até aplicações web
sofisticadas que realizam operações em tempo real, como Facebook e
Instagram.

De acordo com uma pesquisa realizada pelo G1, o uso da internet no
Brasil cresceu de 74% para 81% da população entre 2019 e 2020,
alcançando 152 milhões de pessoas. O celular foi identificado como o
principal meio de acesso à internet, demonstrando a crescente demanda
por sistemas que sejam acessíveis em múltiplas plataformas.

Diante desse cenário, a opção por desenvolver um sistema web para este
projeto foi motivada por sua acessibilidade e abrangência. Essa
abordagem permite que clientes acessem os serviços de forma prática e
eficiente, acompanhando a tendência de crescimento do uso de
dispositivos conectados e oferecendo uma solução adaptada às
necessidades modernas do mercado.

## 2.4 Sistemas Existentes/ Trabalhos Correlatos

Nesta subseção, são analisados sistemas já existentes no mercado,
identificados por meio de pesquisas na internet, utilizando os seguintes
critérios: funcionalidades, interface e facilidade de uso. O objetivo
dessa análise é avaliar os pontos fortes e fracos dos sistemas
recuperados, com o intuito de aperfeiçoar e diferenciar o sistema
proposto..

- Análise do Sistema Perukas (perukas.com.br):

  - Funcionalidades: Agendamento de horários online e lembretes automáticos pelo WhatsApp.

  - Pontos Fortes: Controle financeiro eficiente, ferramenta de pesquisa de satisfação e interface intuitiva.

  - Pontos Fracos: Personalização limitada de lembretes, ausência de integração com redes sociais e custo elevado para assinatura.

- Análise do Sistema AppBarber (https://sites.appbarber.com.br/):

  - Funcionalidades: Agendamento online.

  - Pontos Fortes: Permite avaliação das barbearias e localiza a barbearia mais próxima.

  - Pontos Fracos: Informações incompletas sobre as barbearias cadastradas, como preços e endereços, e ausência de filtros para facilitar a busca.

- Análise do Sistema BestBarbers (https://sites.appbarber.com.br/):

  - Funcionalidades: Agendamento online.

  - Pontos Fortes: Oferece relatórios mensais sobre o desempenho da barbearia e possui um design atrativo.

  - Alto custo para assinatura.

- Diferenciação do Sistema Proposto:

  - Funcionalidade única: Agendamento via Google Calendar.

  - Vantagem competitiva: Custo de assinatura mensal mais acessível em comparação com os concorrentes.

  - Melhoria significativa: Integração de um sistema de feedback para avaliação da experiência do cliente, promovendo a satisfação e fidelização.

## 3.  METODOLOGIA/ MATERIAIS E MÉTODOS

Este capítulo apresenta a metodologia adotada para o planejamento,
implementação e validação de um sistema de agendamento online para
barbearias. A abordagem utilizada foi cuidadosamente selecionada para
garantir eficiência e alinhamento com os objetivos do projeto. Além
disso, são destacadas as ferramentas e tecnologias empregadas, bem como
a arquitetura do sistema, proporcionando uma visão completa e detalhada
do processo de desenvolvimento.

## 3.1 Abordagem de Desenvolvimento

Para este projeto, foi adotada a metodologia baseada na prototipação,
uma abordagem que se destaca pela rapidez e flexibilidade no
desenvolvimento de sistemas. Essa metodologia é caracterizada por ciclos
curtos de desenvolvimento, nos quais protótipos funcionais e simples são
criados, testados e aprimorados de forma interativa, permitindo a
realização de avaliações frequentes e ajustes contínuos com base no
feedback obtido.

O planejamento do projeto consistiu em desenvolver protótipos para cada
funcionalidade, de modo a torná-las operacionais o mais rápido possível,
garantindo entregas incrementais que agregam valor em cada etapa. A
escolha pela prototipação se mostrou estratégica para o desenvolvimento
do sistema de agendamento online para barbearias, pois está alinhada com
as necessidades do projeto e os objetivos de agilidade e eficiência.

Entre as vantagens dessa abordagem estão a validação antecipada das
funcionalidades, o feedback contínuo dos envolvidos no processo e a
redução de riscos associados ao desenvolvimento. Dessa forma, a
metodologia adotada não apenas garantiu um processo de desenvolvimento
mais dinâmico, mas também possibilitou a entrega de um sistema alinhado
às expectativas e demandas dos usuários finais.

## 3.2 Ferramentas e Tecnologias

As principais ferramentas e tecnologias utilizadas no desenvolvimento do
sistema são descritas a seguir, destacando suas características e
funcionalidades:

- Frontend: Desenvolvido utilizando HTML e SCSS para a estrutura e estilização das páginas, garantindo uma interface responsiva e visualmente atraente.

- Backend: Implementado em TypeScript e JavaScript, proporcionando uma base robusta e escalável para o gerenciamento da lógica do sistema.

- Frameworks: Angular foi utilizado para o desenvolvimento do sistema, possibilitando uma arquitetura modular e eficiente, com componentes reutilizáveis que facilitam a manutenção e expansão.

- Banco de Dados: Firebase foi adotado para o armazenamento dos dados, devido à sua confiabilidade e integração nativa com outros serviços do ecossistema Google.

- Figma: Utilizado para a prototipação das telas, permitindo o planejamento visual e a definição da interface antes do desenvolvimento.

- Ambiente de Desenvolvimento: Visual Studio Code foi escolhido como a IDE principal, por oferecer extensões úteis e um ambiente otimizado para o desenvolvimento do sistema.

- Controle de Versão: Git e GitHub foram utilizados para versionamento e colaboração, garantindo o acompanhamento do histórico de alterações no código.

- Hospedagem: O sistema foi hospedado diretamente no Firebase Hosting, que oferece uma solução confiável, escalável e de fácil integração com o backend.

- API do Google Calendar: Disponibilizada pelo Google Cloud, a API foi integrada ao sistema para gerenciar agendamentos, garantindo sincronização e flexibilidade na organização de horários.

## 3.3 Arquitetura do Sistema

A arquitetura do sistema de agendamento de barbearia, será detalhada a
seguir na figura 1 é apresentada a arquitetura geral do sistema, sendo
evidenciado os principais componentes, bem como são apresentadas na
sequência as tecnologias utilizadas e o fluxo de informações. A
arquitetura do sistema segue o padrão cliente-servidor, com uma clara
divisão entre frontend e backend.

**Figura 1 -- Arquitetura do sistema**

![Descrição da imagem](src/assets/write-project/arquitetura.png)

**Fonte: Autoria própria (2024)**

Componentes

O sistema é composto por três componentes principais:

Cliente:

- Interface Web permite que os usuários interajam com o sistema: HTML, SCSS no Angular

Servidor:

- Processamento de requisições, acesso ao banco de dados e lógica da aplicação: TypeScript e JavaScript no Angular

Banco de dados:

- Armazena as informações dos prestadores de serviços e agendamentos: Firebase

Fluxo de Informação:

1.  Usuário acessa o sistema.

2.  Cliente envia requisições para o servidor

3.  O servidor processa a requisição e recupera os dados no BD

4.  Servidor retorna os dados para o cliente

5.  Cliente apresenta os dados ao usuário

6.  Usuário interage com o sistema, realizando pesquisa ou agendando horário

7.  Cliente envia uma nova requisição para o servidor com as informações da interação do usuário

8.  Servidor processa a requisição e atualiza o BD

9.  Servidor retorna uma resposta ao cliente

10. Cliente atualiza a interface web de acordo com a resposta do servidor

A arquitetura do sistema segue o padrão cliente-servidor, com uma
divisão clara entre frontend e backend. No frontend, a aplicação é
estruturada seguindo o padrão de arquitetura de componentes, utilizando
o Angular. No backend, a arquitetura segue o padrão MVC
(Model-View-Controller), onde o TypeScript é utilizado para definir
rotas, controladores e modelos de dados. O banco de dados Firebase é
utilizado para armazenar as informações dos prestadores de serviços, com
comunicação entre o servidor TypeScript e o banco de dados através do
driver oficial do Firebase.

## 4. Desenvolvimento do Sistema

Neste capítulo, será apresentado o processo de construção do sistema de
agendamento online para barbearias, detalhando desde a concepção inicial
até a entrega final. Serão descritas as etapas de planejamento, análise
detalhada, modelagem, implementação das funcionalidades e realização de
testes. Este capítulo busca oferecer uma visão técnica e abrangente do
desenvolvimento do sistema, evidenciando as etapas tomadas para atender
às necessidades identificadas e transformar os requisitos em uma solução
funcional e prática.

## 4.1 Descrição do Projeto

O sistema de agendamento online para barbearias foi desenvolvido para
otimizar a organização de horários e melhorar a comunicação entre
barbeiros e clientes. Ele integra funcionalidades como cadastro de
barbearias, gerenciamento de horários de trabalho e serviços, além da
integração com o Google Calendar para agendamentos dinâmicos.

Com uma interface responsiva e intuitiva, o sistema busca facilitar o
gerenciamento operacional das barbearias e proporcionar uma experiência
prática para os clientes. Essa solução visa atender às demandas
específicas do setor, melhorando a eficiência do atendimento e
organizando os processos de forma moderna e acessível em diferentes
dispositivos.

## 4.2 Análise do Sistema

A análise do sistema de agendamento online para barbearias foi uma etapa
essencial para identificar as necessidades de barbearias, barbeiros e
clientes. Durante essa fase, os requisitos funcionais e não funcionais
foram documentados, garantindo que todas as funcionalidades do sistema
fossem planejadas de maneira a atender às demandas específicas do setor.

Para representar os fluxos de dados e interações, utilizamos a linguagem
de modelagem UML (Unified Modeling Language), que proporcionou uma visão
clara e detalhada da estrutura do sistema e de suas entidades. Além
disso, foi adotada a metodologia de prototipação, caracterizada por
ciclos rápidos de desenvolvimento e validação. Essa abordagem permitiu a
criação de protótipos funcionais que foram testados e aprimorados de
forma iterativa, com base no feedback dos usuários e na análise contínua
dos resultados.

Durante a prototipação, as funcionalidades do sistema foram
implementadas gradualmente. O protótipo inicial incluiu recursos
básicos, como o cadastro de barbearias, barbeiros e clientes. Nas etapas
seguintes, funcionalidades mais complexas foram adicionadas, como o
agendamento integrado ao Google Calendar, a criação de galerias de fotos
para barbeiros e o painel administrativo com métricas dinâmicas. Cada
versão do protótipo foi submetida a testes para validar a usabilidade e
a eficiência das funcionalidades.

Essa abordagem iterativa facilitou a adaptação do sistema às mudanças e
demandas emergentes ao longo do desenvolvimento. A prototipação também
permite ajustes rápidos e efetivos, garantindo que o sistema final seja
funcional, intuitivo e alinhado às expectativas dos usuários. Ao
utilizar esse método, conseguimos construir um sistema robusto e
prático, adequado às necessidades do mercado de barbearias.

### 4.2.1 Levantamento de Requisitos

O levantamento de requisitos foi realizado com base em análises das
necessidades de barbearias, barbeiros e clientes, coletadas por meio de
entrevistas com profissionais do setor e observações de sistemas
existentes no mercado. Durante esse processo, foram identificadas as
funcionalidades essenciais para o gerenciamento de agendamentos e
serviços, além de requisitos relacionados à segurança, usabilidade e
desempenho.

Os requisitos funcionais definidos para o sistema incluem:

- Cadastro e gerenciamento de usuários, permitindo o registro de barbearias, barbeiros e clientes.

- Gerenciamento de agendamentos, com integração ao Google Calendar para evitar conflitos de horários.

- Registro e edição de serviços e preços, incluindo a criação de combos promocionais.

- Disponibilização de um painel administrativo para visualização de métricas e geração de relatórios.

Já os requisitos não funcionais priorizados são:

- Segurança, com autenticação robusta e comunicação criptografada.

- Usabilidade, garantindo uma interface intuitiva e responsiva em diferentes dispositivos.

- Desempenho, assegurando o suporte a múltiplos usuários simultâneos sem comprometer a eficiência.

- Disponibilidade, garantindo operação contínua do sistema, com tempo de inatividade mínimo.

### 4.2.2 Modelagem de Casos de Uso

![Descrição da imagem](src/assets/write-project/barbearia.png)

![Descrição da imagem](src/assets/write-project/barbeiro.png)

![Descrição da imagem](src/assets/write-project/user.png)

Os diagramas apresentados ilustram as interações principais entre os
atores do sistema de agendamento para barbearias e os casos de uso
identificados. Cada diagrama destaca um conjunto específico de
funcionalidades, como gerenciamento de usuários, agendamentos, serviços
e movimentação financeira, refletindo a modularidade e a abrangência do
sistema. O primeiro diagrama foca nas ações do usuário geral, incluindo
login e gerenciamento de contas, enquanto o segundo detalha as
atividades administrativas, como controle de barbeiros e finanças. O
terceiro enfatiza os casos de uso do barbeiro, abrangendo o
gerenciamento de serviços, agenda e produtos. Esses casos de uso foram
modelados para garantir que o sistema atenda às necessidades de cada
tipo de usuário de maneira clara e eficiente, promovendo usabilidade e
alinhamento com os objetivos do projeto.

### 4.2.3 Modelagem do Banco de Dados

A modelagem do banco de dados para o sistema de agendamento online para
barbearias foi projetada para atender às necessidades do projeto, com
foco na organização, integridade e escalabilidade dos dados. Utilizando
o Firebase Firestore, um banco de dados NoSQL, o sistema armazena as
informações em coleções e subcoleções, possibilitando acessos rápidos e
sincronização em tempo real.

A estrutura foi organizada com base nas principais entidades do sistema:
Barbearia, Barbeiro, Cliente, Serviço e Agendamento. Cada entidade
possui atributos específicos que permitem armazenar dados essenciais e
manter a relação lógica entre os diferentes elementos do sistema.

### 4.2.4 Design de Interface**

O design de interface do sistema de agendamento online para barbearias
foi desenvolvido com foco na usabilidade, acessibilidade e
responsividade, garantindo uma experiência de usuário intuitiva e
agradável. O layout foi planejado para ser simples e funcional,
atendendo às necessidades de diferentes perfis de usuários, como
barbeiros, clientes e administradores, com um visual moderno e elementos
gráficos que reforçam a identidade profissional das barbearias.

![Descrição da imagem](src/assets/write-project/img1.png)

![Descrição da imagem](src/assets/write-project/img2.png)

![Descrição da imagem](src/assets/write-project/img3.png)

![Descrição da imagem](src/assets/write-project/img4.png)

![Descrição da imagem](src/assets/write-project/img5.png)

O sistema de agendamento online para barbearias foi implementado
utilizando Angular para gerenciar tanto o frontend quanto a lógica de
backend, enquanto o Firebase foi empregado como banco de dados e para
autenticação de usuários. O cadastro de barbearias e barbeiros foi
desenvolvido com formulários dinâmicos que garantem o armazenamento e
atualização dos dados em tempo real.

A funcionalidade de agendamento de horários foi integrada à API do
Google Calendar, permitindo gerenciar disponibilidades e evitar
conflitos de horários. Gráficos interativos, criados com a biblioteca
Charts, foram implementados para exibir métricas administrativas de
maneira clara e acessível. Além disso, uma galeria de fotos foi
desenvolvida para que barbeiros pudessem carregar e exibir imagens de
seus trabalhos de forma dinâmica. O painel administrativo foi projetado
para facilitar o gerenciamento, oferecendo uma interface intuitiva e
responsiva.

## 4.4 Testes e Validação

Os testes e validações realizados buscaram assegurar a qualidade,
funcionalidade e robustez do sistema desenvolvido. Foram conduzidos
testes unitários para verificar o funcionamento correto de componentes
específicos, como os formulários de cadastro e os gráficos gerados pela
biblioteca Charts. Também foram realizados testes de integração,
garantindo que módulos como a API do Google Calendar e o banco de dados
Firebase interagissem de forma consistente e confiável.

## 5. Resultados

Neste capítulo, são apresentados os principais resultados obtidos
durante o processo de desenvolvimento do sistema, com destaque para a
implementação bem-sucedida das funcionalidades projetadas, o
funcionamento integrado de todos os módulos e a acessibilidade garantida
para usuários. Além disso, o projeto foi disponibilizado em um
repositório público no GitHub.

Os resultados evidenciam a robustez e a funcionalidade da solução
desenvolvida, atendendo plenamente aos objetivos definidos. Esta seção
permite aos leitores compreenderem o impacto do sistema na otimização de
processos operacionais e na melhoria da experiência dos usuários, além
de proporcionar uma visão clara do produto final e de suas aplicações
práticas no setor de barbearias.

## 5.1 Apresentação do Sistema

O sistema de agendamento online para barbearias foi desenvolvido com o
objetivo de atender às principais demandas do setor, como organização de
horários, gerenciamento de serviços e melhor comunicação entre barbeiros
e clientes. Ele apresenta uma interface intuitiva e responsiva, que
permite fácil navegação tanto em dispositivos móveis quanto em desktops,
oferecendo uma experiência fluida e eficiente para todos os usuários.

As funcionalidades incluem:

- Gerenciamento de Usuários: Cadastro de barbearias, barbeiros e clientes com informações detalhadas, promovendo um controle organizado.

- Agendamento Integrado: Clientes podem agendar horários com barbeiros específicos, visualizando os serviços disponíveis. A integração com o Google Calendar evita conflitos e atualiza compromissos em tempo real.

- Painel Administrativo: Oferece métricas como número de serviços realizados, receitas e gráficos interativos para auxiliar na tomada de decisões.

- Galeria de Fotos: Barbeiros podem postar imagens de seus trabalhos, promovendo seus serviços e atraindo novos clientes.

- Sistema de Avaliação: Clientes avaliam os serviços realizados, promovendo melhorias contínuas.

Os resultados obtidos confirmam que o sistema atende aos requisitos
levantados durante a análise inicial, sendo uma solução robusta e
prática para os desafios enfrentados pelas barbearias. Ele demonstra uma
integração harmoniosa de tecnologias modernas como Angular e Firebase,
alinhada às expectativas do mercado.

## 5.2 GitHub do projeto

O código-fonte do sistema de agendamento online para barbearias está
hospedado em um repositório público no GitHub, proporcionando acesso
aberto e transparente ao código e ao histórico de desenvolvimento. Por
meio do repositório, os interessados podem explorar as funcionalidades
implementadas, acompanhar as alterações realizadas durante o processo de
desenvolvimento, contribuir com sugestões e reportar possíveis problemas
encontrados.

O GitHub também oferece ferramentas robustas de colaboração e
gerenciamento de projetos, facilitando futuras expansões e melhorias do
sistema. Este repositório foi estruturado para garantir fácil navegação
e compreensão do código.

O projeto pode ser acessado no seguinte endereço: https://github.com/GuilhermeBerssanette/SistemaAgendamentoBarbearia

## 6. Conclusão

Este trabalho apresentou o desenvolvimento de um sistema de agendamento
online para barbearias, concebido para atender às demandas específicas
de um mercado em constante crescimento. O sistema foi projetado com
funcionalidades que priorizam a automação, praticidade e uma melhor
experiência para os usuários, contribuindo para a organização e
eficiência do setor. Utilizando tecnologias modernas como Angular e
Firebase, foi possível aplicar conceitos teóricos em um contexto
prático, resultando em uma solução robusta e funcional.

Os resultados obtidos confirmaram o cumprimento dos objetivos
estabelecidos, oferecendo funcionalidades como integração ao Google
Calendar, criação de galerias de fotos e um painel administrativo com
métricas detalhadas. Durante o processo de validação, o sistema
demonstrou ser uma solução eficaz, facilitando a gestão de horários e
serviços, enquanto melhora a experiência de barbeiros e clientes. Este
trabalho também representou uma oportunidade de aprendizado prático,
consolidando os conhecimentos adquiridos ao longo do curso técnico.

Por fim, o sistema contribui para a modernização do setor, promovendo
maior eficiência na gestão de barbearias e estabelecendo um melhor
relacionamento entre profissionais e clientes. O impacto positivo do
projeto reforça sua relevância e viabilidade, consolidando-se como uma
ferramenta inovadora e valiosa para o mercado.

## 6.1 Dificuldade e Limitações

Durante o processo de criação do sistema de agendamento online para
barbearias, foram encontradas algumas dificuldades e limitações. Um dos
principais desafios foi a integração com a API do Google Calendar, que
exigiu ajustes específicos para garantir a sincronização precisa dos
horários e a resolução de conflitos. Além disso, a configuração e
manipulação do Firebase, particularmente no armazenamento e recuperação
de dados em tempo real, demandaram testes extensivos para assegurar a
consistência das informações.

Também foram observadas limitações relacionadas à escalabilidade, já que
o sistema foi projetado para um volume médio de usuários, podendo
precisar de aprimoramentos para suportar uma demanda maior. O tempo
limitado para o desenvolvimento restringiu a implementação de
funcionalidades adicionais, como notificações automáticas e suporte a
múltiplos idiomas, que poderiam agregar mais valor ao sistema. Essas
dificuldades destacam áreas que podem ser aprimoradas em futuras versões
do projeto.

## 6.2 Trabalhos Futuros

O sistema de agendamento online para barbearias oferece diversas
possibilidades de expansão e aprimoramento em versões futuras. A
arquitetura baseada em componentes do Angular facilita a adição de novas
funcionalidades, permitindo que o sistema seja atualizado e ampliado com
agilidade e eficiência. Um dos aprimoramentos planejados é a
implementação de pagamentos diretamente pelo site, integrando gateways
de pagamento seguros para que clientes possam realizar transações
financeiras de forma rápida e prática, além de simplificar a gestão
financeira para as barbearias.

Outra direção importante é o desenvolvimento de um módulo financeiro
integrado ao painel administrativo, que possibilite o controle detalhado
de receitas, despesas e fluxo de caixa. A inclusão de notificações
automáticas, tanto para clientes quanto para barbeiros, também é uma
melhoria relevante, com lembretes sobre agendamentos e atualizações
importantes. Além disso, a integração com redes sociais pode ampliar a
visibilidade das barbearias, permitindo a divulgação de galerias de
fotos e serviços diretamente em plataformas digitais.

Por fim, a exploração de tecnologias emergentes, como inteligência
artificial, pode agregar ainda mais valor ao sistema. Recursos como
recomendações personalizadas de serviços baseadas no histórico dos
clientes e previsões de horários de pico são possibilidades promissoras.
Para garantir que o sistema atenda a um público crescente, testes de
escalabilidade e otimizações de desempenho também serão necessários,
assegurando a estabilidade mesmo em cenários de alta demanda. Essas
melhorias alinham-se às tendências do mercado e reforçam o potencial do
sistema como uma ferramenta indispensável para o setor de barbearias.

## Referências

FILHO, João Carlos e RODRIGUES, Luis Fellype. Mercado de barbearias
atrai mais jovens profissionais na capital federal. Brasilia: Correio
Braziliense, 2023.

TOMAZ, Helton Marinho. Sistema de agendamento para Clinicas: conheça os
benefícios. Santa Catarina: Ninsaúde, 2024.

EQUIPE G1. Uso da internet no Brasil cresce e chega a 81% da população.
São Paulo: G1, 2021

EQUIPE DE MARKETING. Crescimento das barbearias produz uma nova vertente
de estilo masculino no Brasil. São Paulo: Mundo do Marketing, 2024

AGÊNCIA EUROMONITOR. Consumo do mercado de beleza masculino. 2018.


