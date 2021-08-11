import {MailServerConfig, RawMailServerConfig} from '../../models/mail-server';

export const toMailServerConfig = (raw: RawMailServerConfig): MailServerConfig => {
	return {
		insecureSkipVerify: raw.InsecureSkipVerify,
		password: raw.Password,
		port: raw.Port,
		server: raw.Server,
		useTLS: raw.UseTLS,
		username: raw.Username,
	}
}

export const toRawMailServerConfig = (config: MailServerConfig): RawMailServerConfig => {
	return {
		InsecureSkipVerify: config.insecureSkipVerify,
		Password: config.password,
		Port: config.port,
		Server: config.server,
		UseTLS: config.useTLS,
		Username: config.username,
	}
}
