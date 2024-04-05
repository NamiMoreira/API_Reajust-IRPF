Frente à necessidade, foi realizado uma API de comunicação entre o Portal de Relacionamento com Cliente e o ERP . 
A mesma foi desenvolvida com o Swagger disponibilizado , assim o retorno em JSON é formatado para que o Portal consuma e apresente no front-end. 
A partir da requisição , os parametros são recebidos e armazenados em variaveis. Assim, a API utiliza essas variaveis e faz uma requisição
para o ERP que também possui algumas API , no entanto, como o retorno dela não está no padrão do Swagger, uma função recebe esses dados e formata para o envio.
Em alguns casos, uma consulta direta ao banco foi necessário, sendo necessário alguma modificações para que a aplicação consiga ser compativel com a versão do Oracle no servidor.
Existe também uma rota que recebe uma requisição de IRPF impresso em pdf. Seguindo também, o padrão do Swagger, é enviado um JSON com o pdf convertido em base64 . 
Os dados novamente são recebidos da API do ERP , após é criado um pdf, convertido e base64 e formatado para ser enviado ao Portal.
Considerando boas práticas, pretendo futuramente fazer novas releases com aplicação de TypeScript, principios de Clean Code, Design Patterns entre outras como melhorar a performance utilizando corretamente o async/await . 
Como um dos meus primeiros projetos, tem um valor significativo para mim, ainda que eu saiba que ele pode ser melhorado.
