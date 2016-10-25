navbar
	.navbar
		.left
			button.btn-icon(onclick="{openMenu}")
				span.ion-navicon
		.center
			h1 {title}

	slide-menu(is-open="{isOpen}")

	script.
		var self = this;

		self.mixin({
			setTitle: function(title) {
				self.title = title;
				self.update();
			}
		});

		self.isOpen = false;
		self.openMenu = function() {
			self.isOpen = ~self.isOpen;
		}
		obs.on('sildeMenu:close', function() {
			self.isOpen = false;
			self.update();
		});

	style(type="sass" scoped).
		.navbar
			position: fixed
			top: 0
			left: 0
			right: 0
			width: 100%
			height: 50px
			box-sizing: border-box
			border-bottom: 1px solid  #ccc
			background: #fff
			line-height: 50px
			z-index: 9999
			.left
				position: absolute
				left: 0
			.center
				margin: 0 auto
				text-align: center
			h1
				font-size: 16px
			.btn-icon
				width: 50px
				height: 50px
				border: none
				background: none
				font-size: 30px