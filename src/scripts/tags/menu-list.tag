menu-list

	ol.menu-list-wrapper
		li(each="{type in data}") 
			ol.menu-list
				li(each="{cat in type.list}")
					.category.test.sample.what(onclick="{openItems}") {cat.ja}
					ol.menu-item
						li(each="{item in cat.menu}" onclick="{changeItem(item)}")
							.left
								.thumb(style="background-image: url(./images/menu/{item.image})")
							.right
								.name {item.name}
								.price {item.price}円
								.comment {item.comment}

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

		self.changeItem = function(data) {
			return function() {
				obs.trigger('changeRecommend', data);
			}
		}

		self.openItems = function(e) {
			var $elem = e.target;
			
			if(~$elem.classList.value.indexOf('open')) {
				$elem.classList.remove('open');
			} else {
				$elem.classList.add('open')
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
					transition: background-color .4 ease
					&::before
						content: "\f123";
						position: absolute
						left: 0
						display: block
						width: 40px
						height: 40px
						text-align: center
						line-height: 40px
						font-family: 'Ionicons'
						font-size: 13px
						transform: rotate(-90deg)
					&:hover
						background: #ccc
					&.open
						&::before
							transform: rotate(0)
						& + .menu-item
							display: block
				.menu-item
					display: none
					li
						overflow: hidden
						clear: both
						height: 80px
						border-bottom: 1px solid #ccc
						&:hover
							background: #ddd
						.left
							float: left
							width: 120px
							.thumb
								width: 100px
								height: 70px
								margin: 5px 10px
								background: center center no-repeat #eee
								background-size: cover
						.right
							margin-left: 120px
							padding: 15px 5px 0 0
							& > div
								overflow: hidden
								white-space: nowrap
								text-overflow: ellipsis
							.name
								height: 20px
								line-height: 20px
								font-size: 16px
							.price
								height: 15px
								line-height: 15px
								font-size: 10px
							.comment
								height: 20px
								line-height: 20px
								font-size: 12px