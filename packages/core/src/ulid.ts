// RN-ST.9, RN-TEL.32 — todo evento e toda sessão carregam um ULID gerado no cliente **no
// instante do fato**, não no do envio: é o que torna o reenvio pelo outbox idempotente no
// servidor. `ulid()` já embute o carimbo de parede (primeiros 48 bits) — não é preciso gerar o
// carimbo em separado para ordenação.
// `monotonicFactory` garante ordem lexicográfica não decrescente mesmo para chamadas no mesmo
// milissegundo (o `ulid()` simples não garante isso — o componente aleatório pode ordenar antes
// do de uma chamada anterior no mesmo ms) — importa para o outbox, onde a ordem de criação vira
// ordem de envio.
import { monotonicFactory } from 'ulidx';

const gerador = monotonicFactory();

export function criarUlid(): string {
  return gerador();
}
