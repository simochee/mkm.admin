menu-list

	ol.menu-list-wrapper
		li(each="{type in data}") 
			ol.menu-list
				li(each="{cat in type.list}" onload="{cat.isOpen = false}" onclick="{toggleItem(this)}")
					.category {cat.ja}
					ol.menu-item(if="{false}")
						li(each="{item in cat.menu}") {item.name}
	script.
		var store = require('../store');
		var self = this;

		self.toggleItem = function(_this) {
			return function() {
				console.log(_this)
				_this.cat.isOpen = ~_this.cat.isOpen;
				self.update()
			}
		}

		store.getMenuList().then(function(data) {
			self.data = data;
			console.log(data)
			self.update();
		});

	style(type="sass" scoped).
		.menu-list-wrapper
			.menu-list
				.category
					position: relative
					width: 100%
					height: 40px
					border-bottom: 1px solid  #ccc
					line-height: 40px
					text-align: center
					&::before
						content: "\f123";
						position: absolute
						left: 0
						display: block
						width: 40px
						height: 40px
						text-align: center
						line-height: 40px
						font-family: 'Ionicons';
						font-size: 13px
						transform: rotate(-90deg)
				.menu-item