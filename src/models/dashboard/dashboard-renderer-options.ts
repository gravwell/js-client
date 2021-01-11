export interface RendererOptions {
	XAxisSplitLine?: 'no';
	YAxisSplitLine?: 'no';
	IncludeOther?: 'yes';
	Stack?: 'grouped' | 'stacked';
	Smoothing?: 'normal' | 'smooth';
	Orientation?: 'v' | 'h';
	ConnectNulls?: 'no' | 'yes';
	Precision?: 'no';
	LogScale?: 'no';
	Range?: 'no';
	Rotate?: 'yes';
	Labels?: 'no';
	Background?: 'no';
	values?: {
		Smoothing?: 'smooth';
		Orientation?: 'h';
		columns?: Array<string>;
	};
}
