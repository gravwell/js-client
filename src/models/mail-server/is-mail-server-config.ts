import {MailServerConfig} from './mail-server-config';

export const isMailServerConfig = (v: any): v is MailServerConfig => {
	return true;
}
/*
insecureSkipVerify: boolean;
password: string;
port: number;
server: string;
useTLS: boolean;
username: string;
