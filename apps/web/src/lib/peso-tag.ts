/* ================================================================
   peso-tag.ts — o peso visual de uma tag acompanha o uso
   ================================================================
   /tags e o convite de /buscar mostram as mesmas tags. Se cada tela
   calculasse o próprio nível, a mesma palavra apareceria com peso
   diferente em dois lugares e o peso deixaria de significar uso.

   O nível é relativo à tag mais usada da lista, não a um número fixo:
   o acervo é novo, e "marca duas ideias" hoje é o topo. As duas telas
   recebem a lista na mesma ordem (uso decrescente, é o `orderBy` do
   TagsService), então a maior é a mesma nos dois lugares mesmo quando
   uma delas mostra só as doze primeiras.

   Nível 0 é a tag que não marca ideia nenhuma. Ela existe no
   vocabulário e leva a uma página vazia; aparecer pálida é o aviso.
   ================================================================ */

export function nivelDeUso(uso: number, maior: number): 0 | 1 | 2 | 3 {
  if (uso <= 0) return 0;
  if (maior <= 0) return 1;
  const parte = uso / maior;
  if (parte >= 0.66) return 3;
  if (parte >= 0.33) return 2;
  return 1;
}
