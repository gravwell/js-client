/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { APISubscription } from '~/functions/utils/api-subscription';
import { File } from '~/functions/utils/file';
import { BuildableKit } from '~/models/kit/buildable-kit';
import { InstallableKit } from '~/models/kit/installable-kit';
import { KitArchive } from '~/models/kit/kit-archive';
import { KitInstallationStatus } from '~/models/kit/kit-installation-status';
import { LocalKit } from '~/models/kit/local-kit';
import { RemoteKit } from '~/models/kit/remote-kit';

export interface KitsService {
	readonly get: {
		readonly one: {
			readonly local: (kitID: string) => Promise<LocalKit>;
			readonly remote: (kitID: string) => Promise<RemoteKit>;
		};
		readonly all: {
			readonly local: () => Promise<Array<LocalKit>>;
			readonly remote: () => Promise<Array<RemoteKit>>;
		};
	};

	readonly build: {
		readonly one: {
			readonly local: (data: BuildableKit) => Promise<string>;
		};
	};

	readonly upload: {
		readonly one: {
			readonly local: (kit: File) => Promise<LocalKit>;
			readonly remote: (kitID: string) => Promise<RemoteKit>;
		};
	};

	readonly download: {
		readonly one: {
			readonly local: (kitID: string) => Promise<string>;
			readonly remote: (kitID: string) => Promise<string>;
		};
	};

	readonly stage: {
		readonly one: (data: File | RemoteKit) => Promise<LocalKit>;
	};

	readonly install: {
		readonly one: (data: InstallableKit) => Promise<APISubscription<KitInstallationStatus, never>>;
	};

	readonly uninstall: {
		readonly one: (kitID: string, force: boolean) => Promise<void>;
		readonly all: (force: boolean) => Promise<void>;
	};

	readonly delete: {
		readonly one: (kitID: string) => Promise<void>;
	};

	readonly archives: {
		readonly get: {
			readonly all: () => Promise<Array<KitArchive>>;
		};
		readonly delete: {
			readonly one: (archiveID: string) => Promise<void>;
		};
	};
}
