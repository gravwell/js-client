/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isString } from 'lodash';
import {
	MailServerConfig,
	MailServerTestData,
	RawMailServerConfig,
	RawMailServerTestData,
} from '../../models/mail-server';

export const toMailServerConfig = (raw: RawMailServerConfig): MailServerConfig => {
	return {
		insecureSkipVerify: raw.InsecureSkipVerify,
		password: raw.Password,
		port: raw.Port,
		server: raw.Server,
		useTLS: raw.UseTLS,
		username: raw.Username,
	};
};

export const toRawMailServerConfig = (config: MailServerConfig): RawMailServerConfig => {
	return {
		InsecureSkipVerify: config.insecureSkipVerify,
		Password: config.password,
		Port: config.port,
		Server: config.server,
		UseTLS: config.useTLS,
		Username: config.username,
	};
};

export const toRawMailServerTestData = (data: MailServerTestData): RawMailServerTestData => {
	return {
		From: data.from,
		To: isString(data.to) ? [data.to] : data.to,
		Subject: data.subject,
		Body: data.body,
	};
};
