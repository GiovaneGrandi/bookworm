import { NativeModule, registerWebModule } from 'expo';

// Web não é plataforma alvo do MVP (mvp.md §2 — Android primeiro). `performance.now()` é a
// aproximação mais honesta disponível no navegador — não tem a garantia de "continua contando
// com o aparelho dormindo" que `RN-TEL.6` exige, mas o app nunca roda essa apuração em produção
// nesta plataforma; existe só para o bundle web não quebrar.
class BookwormRelogioModule extends NativeModule<Record<string, never>> {
  elapsedRealtime(): number {
    return performance.now();
  }

  uptimeMillis(): number {
    return performance.now();
  }
}

export default registerWebModule(BookwormRelogioModule, 'BookwormRelogioModule');
