recommend
	navbar(title="{opts.title}")

	div(class="{edit ? 'edit' : 'display'}")
		.header
			h2
				.input
					input(value="{data.title}" readonly="{!edit}")
			button.btn.btn-small(type="button" onclick="{toggleMode}" class="btn-{edit ? 'danger' : 'edit'}") {edit ? '終了' : '編集'}

	script.
		var store = require('../store');
		var self = this;

		self.edit = false;
		self.toggleMode = function() {
			self.edit = ~self.edit;
		}

		console.log(store.getRecommend('getRec'));
		obs.on('getRec', function(data) {
			self.data = data;
			riot.update();
		});

	style(type="sass" scoped).
		.header
			display: -webkit-flex
			display: -moz-flex
			display: -ms-flex
			display: -o-flex
			display: flex
			align-items: center
			justify-content: space-between
			margin: 10px 15px
			h2
				flex: 1
				margin-right: 10px
				.input
					input
						width: 100%
						padding: 0 5px
						box-sizing: border-box
						border: none
						font-size: 20px
						line-height: 40px
		.edit
			.input
				position: relative
				&::before
					content: ""
					position: absolute
					left: 0
					bottom: 0
					display: block
					width: 100%
					height: 2px
					border:
						top: 0
						left: 1px solid  #aaa
						bottom: 1px solid  #aaa
						right: 1px solid  #aaa
		.display
			.input
				input
					overflow: hidden
					white-space: nowrap
					text-overflow: ellipsis


		.btn
			border: none
			&.btn-small
				height: 30px
				padding: 0 15px
				font-size: 14px
				line-height: 30px
			&.btn-edit
				background: #009688
				color: #fff
			&.btn-danger
				background: #eb2142
				color: #fff