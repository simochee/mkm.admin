btn
	button.btn(class="btn-{size} btn-{type} btn-{color}" onclick="{callback: typeof(callback === 'function')}")

	script.
		this.size = opts.size || 'normal';
		this.type = opts.type || 'fill';
		this.color = opts.color || 'primary';
