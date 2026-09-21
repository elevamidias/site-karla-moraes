# Site Dra. Karla Moraes — V20

V20 baseada integralmente na V19 aprovada.

## Objetivo desta versão
Refatoração conservadora do CSS, sem alteração intencional de design, textos, imagens, animações ou funcionalidades.

## Limpeza realizada
- Removidas duplicações de regras CSS comprovadamente idênticas.
- Mantidas regras repetidas quando podem ter função específica de responsividade ou cascata.
- Mantida a ordem das regras restantes para preservar o comportamento visual da V19.
- CSS validado sem erros de parsing.

## Resultado
- CSS: 2.745 → 2.712 linhas.
- 6 blocos duplicados removidos com segurança.
- Não foi feita uma redução agressiva de regras, justamente para evitar mudanças visuais inesperadas.

## Importante
A V19 continua sendo a referência visual. Se qualquer diferença aparecer no teste, a V19 deve ser usada como comparação.


### Atualização posterior
- Removido o card de Psicoterapia da seção Especialidades.
- Atualizado o endereço de atendimento para Tv Angustura N 1008, Pedreira, Belém - PA.
- Adicionado mapa responsivo da localização na seção Contato.
- Atualizado o endereço no rodapé e nos dados estruturados do site.
