CREATE TABLE `preferencia_leitura` (
	`usuario_id` text PRIMARY KEY DEFAULT 'local' NOT NULL,
	`fonte_chave` text NOT NULL,
	`corpo_escala` real NOT NULL,
	`entrelinha_escala` real NOT NULL,
	`margem_escala` real NOT NULL,
	`alinhamento` text NOT NULL,
	`tema` text NOT NULL,
	`temperatura_luz_k` integer NOT NULL,
	`brilho` real NOT NULL,
	`retorno_sensorial_ativo` integer NOT NULL,
	`atualizado_em` integer NOT NULL
);
