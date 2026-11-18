import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { espelhar, giro } from '../tema/geometria';
import type { NomeSuperficie } from '../tema/superficies';
import { tipo } from '../tema/tipografia';

type Props = {
  /** O que vai no selo: "EPUB", "PDF" ou "?" quando o arquivo foi recusado. */
  selo: string;
  nomeArquivo: string;
  meta: string;
  children: ReactNode;
  /** EPUB chega em papel; PDF, como fotocópia, num papel mais cinzento. */
  superficie?: NomeSuperficie;
  /** Vizinhos alternam o sinal da rotação (RN-DS.9). */
  espelhado?: boolean;
};

/** O envelope em que o arquivo chega à bandeja (mockup B, "Pôr um livro na mesa"). */
export function BwEnvelope({
  selo,
  nomeArquivo,
  meta,
  children,
  superficie = 'papel',
  espelhado = false,
}: Props) {
  return (
    <View
      style={[
        estilos.envelope(superficie),
        { transform: [{ rotate: espelhado ? espelhar(giro.plaqueta) : giro.plaqueta }] },
      ]}
    >
      <View style={estilos.selo(superficie)} importantForAccessibility="no">
        <Text style={estilos.seloTexto(superficie)}>{selo}</Text>
      </View>
      <Text style={estilos.arquivo(superficie)}>{nomeArquivo}</Text>
      <Text style={estilos.meta(superficie)}>{meta}</Text>
      <View style={estilos.miolo}>{children}</View>
    </View>
  );
}

const estilos = StyleSheet.create((theme) => ({
  envelope: (superficie: NomeSuperficie) => ({
    backgroundColor: theme.sup[superficie].fundo,
    borderWidth: 1,
    borderColor: theme.sup[superficie].borda,
    padding: theme.esp[5],
    marginVertical: theme.esp[5],
    boxShadow: theme.sup[superficie].sombra.erguido,
  }),
  selo: (superficie: NomeSuperficie) => ({
    position: 'absolute',
    right: 12,
    top: 12,
    width: 54,
    height: 62,
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: theme.sup[superficie].tintaFraca,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  seloTexto: (superficie: NomeSuperficie) => ({
    ...tipo.kickerAbertura,
    letterSpacing: 0.1 * 10.5,
    color: theme.sup[superficie].tinta,
  }),
  arquivo: (superficie: NomeSuperficie) => ({
    ...tipo.kickerAbertura,
    textTransform: 'none',
    letterSpacing: 0,
    marginTop: theme.esp[6],
    marginRight: 81,
    color: theme.sup[superficie].tinta,
  }),
  meta: (superficie: NomeSuperficie) => ({
    ...tipo.kickerMicro,
    marginTop: theme.esp[2],
    color: theme.sup[superficie].tintaFraca,
  }),
  miolo: {
    marginTop: theme.esp[4],
    gap: theme.esp[3],
  },
}));
