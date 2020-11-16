const DEBUG_STYLES = {
	reset: '\x1b[0m',
	bold: '\x1b[1m',
	dim: '\x1b[2m',
	underscore: '\x1b[4m',
	blink: '\x1b[5m',
	reverse: '\x1b[7m',
	hidden: '\x1b[8m',

	black: '\x1b[30m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	white: '\x1b[37m',

	bgBlack: '\x1b[40m',
	bgRed: '\x1b[41m',
	bgGreen: '\x1b[42m',
	bgYellow: '\x1b[43m',
	bgBlue: '\x1b[44m',
	bgMagenta: '\x1b[45m',
	bgCyan: '\x1b[46m',
	bgWhite: '\x1b[47m',
} as const;

export type DebugStyle = keyof typeof DEBUG_STYLES;

export const makeDebug = (shouldDebugFn = () => true) => {
	const contexts: Array<{ name: string; styles: Array<DebugStyle> }> = [];
	const startDebugContext = (name: string, styles: Array<DebugStyle> = []) => void contexts.push({ name, styles });
	const endDebugContext = () => contexts.pop();

	const debug = (message: string): void => {
		if (!shouldDebugFn()) return;

		const contextString: string =
			contexts
				.map(context => context.styles.map(s => DEBUG_STYLES[s]).join('') + context.name)
				.map(str => str + DEBUG_STYLES.reset + ' > ')
				.join('') + DEBUG_STYLES.reset;
		console.log(contextString + message);
	};

	return { startDebugContext, endDebugContext, debug };
};
