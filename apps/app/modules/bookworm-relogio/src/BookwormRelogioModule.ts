import { NativeModule, requireNativeModule } from 'expo';

declare class BookwormRelogioModule extends NativeModule<Record<string, never>> {
  /** RN-TEL.6 — continua contando com o aparelho dormindo. Toda duração usa este. */
  elapsedRealtime(): number;
  /** RN-TEL.6 — congela durante o sono; a diferença contra `elapsedRealtime` é quanto dormiu. */
  uptimeMillis(): number;
}

export default requireNativeModule<BookwormRelogioModule>('BookwormRelogio');
