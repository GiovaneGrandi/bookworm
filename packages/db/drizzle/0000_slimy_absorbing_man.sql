CREATE TABLE `agregado_diario` (
	`usuario_id` text DEFAULT 'local' NOT NULL,
	`eixo` text NOT NULL,
	`dia` text NOT NULL,
	`tempo_ativo_s` integer DEFAULT 0 NOT NULL,
	`paginas_canonicas` real DEFAULT 0 NOT NULL,
	`sessoes_validas` integer DEFAULT 0 NOT NULL,
	`sessoes_curtas` integer DEFAULT 0 NOT NULL,
	`interacoes_qualitativas` integer DEFAULT 0 NOT NULL,
	`maior_bloco_continuo_s` integer DEFAULT 0 NOT NULL,
	`soma_leitura_consciente` integer DEFAULT 0 NOT NULL,
	`distribuicao_estilo` text NOT NULL,
	`obras_concluidas` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`usuario_id`, `eixo`, `dia`)
);
--> statement-breakpoint
CREATE TABLE `item_biblioteca` (
	`id` text PRIMARY KEY NOT NULL,
	`usuario_id` text DEFAULT 'local' NOT NULL,
	`obra_id` text NOT NULL,
	`estado` text NOT NULL,
	`estante_desde` integer,
	`adicionado_em` integer NOT NULL,
	`atualizado_em` integer NOT NULL,
	FOREIGN KEY (`obra_id`) REFERENCES `obra`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `obra` (
	`id` text PRIMARY KEY NOT NULL,
	`titulo` text NOT NULL,
	`autor` text,
	`formato` text NOT NULL,
	`origem` text NOT NULL,
	`privada` integer NOT NULL,
	`caminho_arquivo` text NOT NULL,
	`indice_caracteres` text,
	`criada_em` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `progresso_leitura` (
	`usuario_id` text DEFAULT 'local' NOT NULL,
	`obra_id` text NOT NULL,
	`locator` text NOT NULL,
	`caracteres_progresso` integer NOT NULL,
	`atualizado_em` integer NOT NULL,
	PRIMARY KEY(`usuario_id`, `obra_id`),
	FOREIGN KEY (`obra_id`) REFERENCES `obra`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `carteira` (
	`usuario_id` text PRIMARY KEY DEFAULT 'local' NOT NULL,
	`saldo` integer DEFAULT 0 NOT NULL,
	`atualizada_em` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lancamento_ledger` (
	`id` text PRIMARY KEY NOT NULL,
	`usuario_id` text DEFAULT 'local' NOT NULL,
	`tipo` text NOT NULL,
	`valor` integer NOT NULL,
	`motivo` text NOT NULL,
	`criado_em` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `congelamento` (
	`id` text PRIMARY KEY NOT NULL,
	`usuario_id` text DEFAULT 'local' NOT NULL,
	`eixo` text NOT NULL,
	`origem` text NOT NULL,
	`adquirido_em` integer NOT NULL,
	`consumido_em` integer,
	`dia_protegido` text
);
--> statement-breakpoint
CREATE TABLE `dia_ofensiva` (
	`usuario_id` text DEFAULT 'local' NOT NULL,
	`eixo` text NOT NULL,
	`dia` text NOT NULL,
	`meta_valor` integer NOT NULL,
	`meta_unidade` text NOT NULL,
	`realizado` integer NOT NULL,
	`cumprido` integer NOT NULL,
	`cumprido_em` integer,
	`protegido_por_congelamento` integer DEFAULT false NOT NULL,
	`celebracao_estado` text DEFAULT 'nao_aplicavel' NOT NULL,
	`celebrada_em` integer,
	PRIMARY KEY(`usuario_id`, `eixo`, `dia`)
);
--> statement-breakpoint
CREATE TABLE `meta_diaria` (
	`id` text PRIMARY KEY NOT NULL,
	`usuario_id` text DEFAULT 'local' NOT NULL,
	`eixo` text NOT NULL,
	`unidade` text NOT NULL,
	`valor` integer NOT NULL,
	`vigente_desde` text NOT NULL,
	`direcao_alteracao` text NOT NULL,
	`proxima_alteracao_permitida_em` text,
	`criada_em` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ofensiva` (
	`usuario_id` text DEFAULT 'local' NOT NULL,
	`eixo` text NOT NULL,
	`contagem_atual` integer DEFAULT 0 NOT NULL,
	`melhor_marca` integer DEFAULT 0 NOT NULL,
	`contagem_encerrada` integer DEFAULT 0 NOT NULL,
	`encerrada_em` text,
	`ultimo_dia_cumprido` text,
	`estado` text DEFAULT 'dormente' NOT NULL,
	`acervo_dias_cumpridos` integer DEFAULT 0 NOT NULL,
	`atualizada_em` integer NOT NULL,
	PRIMARY KEY(`usuario_id`, `eixo`)
);
--> statement-breakpoint
CREATE TABLE `item_outbox` (
	`usuario_id` text DEFAULT 'local' NOT NULL,
	`tipo` text NOT NULL,
	`referencia_id` text NOT NULL,
	`payload` text NOT NULL,
	`criado_em` integer NOT NULL,
	`atualizado_em` integer NOT NULL,
	`enviado_em` integer,
	`tentativas` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`usuario_id`, `tipo`, `referencia_id`)
);
--> statement-breakpoint
CREATE TABLE `anotacao` (
	`id` text PRIMARY KEY NOT NULL,
	`sessao_id` text NOT NULL,
	`obra_id` text NOT NULL,
	`locator` text NOT NULL,
	`texto` text NOT NULL,
	`criada_em` integer NOT NULL,
	FOREIGN KEY (`sessao_id`) REFERENCES `sessao_leitura`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`obra_id`) REFERENCES `obra`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `consulta_dicionario` (
	`id` text PRIMARY KEY NOT NULL,
	`sessao_id` text NOT NULL,
	`obra_id` text NOT NULL,
	`locator` text NOT NULL,
	`termo` text NOT NULL,
	`criada_em` integer NOT NULL,
	FOREIGN KEY (`sessao_id`) REFERENCES `sessao_leitura`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`obra_id`) REFERENCES `obra`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `destaque` (
	`id` text PRIMARY KEY NOT NULL,
	`sessao_id` text NOT NULL,
	`obra_id` text NOT NULL,
	`locator` text NOT NULL,
	`pigmento` text NOT NULL,
	`criado_em` integer NOT NULL,
	FOREIGN KEY (`sessao_id`) REFERENCES `sessao_leitura`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`obra_id`) REFERENCES `obra`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `intervalo_inatividade` (
	`id` text PRIMARY KEY NOT NULL,
	`sessao_id` text NOT NULL,
	`tipo` text NOT NULL,
	`classificacao` text NOT NULL,
	`inicio_mono` integer NOT NULL,
	`fim_mono` integer NOT NULL,
	`duracao_s` integer NOT NULL,
	FOREIGN KEY (`sessao_id`) REFERENCES `sessao_leitura`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessao_leitura` (
	`id` text PRIMARY KEY NOT NULL,
	`usuario_id` text DEFAULT 'local' NOT NULL,
	`obra_id` text NOT NULL,
	`tipo` text DEFAULT 'normal' NOT NULL,
	`iniciada_em` integer NOT NULL,
	`encerrada_em` integer,
	`fuso` text NOT NULL,
	`offset_utc_minutos` integer NOT NULL,
	`tempo_bruto_s` integer NOT NULL,
	`tempo_ativo_s` integer NOT NULL,
	`caracteres_lidos` integer NOT NULL,
	`volume_suspeita` integer DEFAULT false NOT NULL,
	`maior_bloco_continuo_s` integer NOT NULL,
	`blocos_foco` text,
	`interacoes_qualitativas` integer DEFAULT 0 NOT NULL,
	`score_leitura_consciente` integer,
	`estilo` text,
	`status` text NOT NULL,
	`origem` text NOT NULL,
	`deriva_relogio_ms` integer DEFAULT 0 NOT NULL,
	`criada_em` integer NOT NULL,
	FOREIGN KEY (`obra_id`) REFERENCES `obra`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `evento_bruto_sessao` (
	`id` text PRIMARY KEY NOT NULL,
	`sessao_id` text NOT NULL,
	`tipo` text NOT NULL,
	`parede_ms` integer NOT NULL,
	`mono_ms` integer NOT NULL,
	`payload` text NOT NULL,
	FOREIGN KEY (`sessao_id`) REFERENCES `sessao_em_curso`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessao_em_curso` (
	`id` text PRIMARY KEY NOT NULL,
	`usuario_id` text DEFAULT 'local' NOT NULL,
	`obra_id` text NOT NULL,
	`estado` text NOT NULL,
	`fuso` text NOT NULL,
	`offset_utc_minutos` integer NOT NULL,
	`ultimo_sinal_parede_ms` integer NOT NULL,
	`ultimo_sinal_mono_ms` integer NOT NULL,
	`atualizada_em` integer NOT NULL,
	FOREIGN KEY (`obra_id`) REFERENCES `obra`(`id`) ON UPDATE no action ON DELETE no action
);
