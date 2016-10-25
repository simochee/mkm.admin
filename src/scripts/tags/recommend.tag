recommend
	div(class="{edit ? 'edit' : 'display'}")
		.header
			h2
				.input.large
					input.input-form(value="{data.title}" readonly="{!edit}")
			button.btn.btn-small(type="button" onclick="{toggleMode}" class="btn-{edit ? 'danger' : 'safety'}") {edit ? '保存' : '編集'}

		.thumb(class="{disactive: !usePicture}")
			img.picture(src="./images/menu/{data.pic}")
			.onhover
				.overlay
					button.btn.btn-warning.btn-large(class="{btn-outline: !usePicture}" onclick="{toggleUsePic}") {usePicture ? '画像を使用する' : '画像を使用しない'}
		.info
			ul.input-group
				li.menu-name
					.input.large
						input.input-form(value="{data.name}" readonly="{!edit}")
				li.menu-price
					.input.normal
						input.input-form(value="{data.price}" readonly="{!edit}")
				li.menu-comment
					.input.normal
						textarea.input-form#comment(value="{data.comment}" readonly="{!edit}")

		.openList(if="{edit}")
			button.btn.btn-large.btn-primary.btn-block(onclick="{toggleMenuList}") 選択

	.modal#menuList
		menu-list
		button.btn.btn-normal.btn-danger.btn-block(onclick="{toggleMenuList}") 閉じる

	script.
		var store = require('../store');
		var utils = require('../utils');
		var anime = require('animejs');
		var self = this;

		self.edit = false;
		self.toggleMode = function() {
			if(self.edit) {
				self.update();
				store.getRecommend().then(function(data) {
					console.log(data, self.data)
					if(JSON.stringify(data) !== JSON.stringify(self.data)) {
						console.log('データが更新されたよ！');
					} else {
						console.log('でーたがかわってないよ！')
					}
				});
			}
			self.edit = ~self.edit;
		}

		self.usePicture = -1;
		self.toggleUsePic = function() {
			if(!self.edit) return;
			self.usePicture = ~self.usePicture;
		}

		var isModalOpen = false;
		self.toggleMenuList = function() {
			var $ele = document.getElementById('menuList');
			if(isModalOpen) {
				isModalOpen = false;
				anime({
					targets: $ele,
					duration: 300,
					easing: 'easeOutCubic',
					translateY: '40px',
					opacity: 0,
					complete: function() {
						$ele.style.display = 'none';
					}
				});
			}
			else {
				isModalOpen = true;
				$ele.style.transform = 'translateY(40px)';
				$ele.style.display = 'block';
				anime({
					targets: $ele,
					duration: 450,
					easing: 'easeOutCubic',
					translateY: 0,
					opacity: 1
				});
			}
		}

		obs.on('changeRecommend', function(data) {
			self.data = {
				title: self.data.title,
				name: data.name,
				price: data.price,
				comment: data.comment,
				pic: data.image || 'poteto-salad.jpg'
			};
			self.update();
			self.toggleMenuList();
		});

		self.on('mount', function() {
			utils.autoResize(document.getElementById('comment'));
		});

		store.getRecommend('getRec').then(function(data) {
			self.data = data;
			self.update();
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
			.input-form
				width: 100%
				padding: 0 5px
				box-sizing: border-box
				border: none
			textarea.input-form
				resize: none
			&.large
				.input-form
					font-size: 20px
					line-height: 40px
			&.normal
				.input-form
					font-size: 16px
					line-height: 30px
			&.small
				.input-form
					font-size: 14px
					line-height: 20px
		.thumb
			position: relative
			width: 95%
			margin: 10px auto 0
			.picture
				width: 100%
			.onhover
				display: none
				.overlay
					position: absolute
					top: 0
					left: 0
					bottom: 0
					right: 0
					display: -webkit-flex
					display: -moz-flex
					display: -ms-flex
					display: -o-flex
					display: flex
					align-items: center
					justify-content: center
					.btn
						position: relative
						z-index: 1
			&.disactive
				position: relative
				&::after
					content: ''
					position: absolute
					top: 0
					left: 0
					bottom: 0
					right: 0
					background: rgba(#fff, 0.7)
				.onhover
					display: block
		.info
			margin-top: 10px
			.input-group
				.menu-name
					padding: 10px 10px
				.menu-price
					position: relative
					width: 80px
					padding: 0 20px
					&::before
						content: "￥"
						position: absolute
						left: 20px
						width: 30px
						height: 30px
						line-height: 30px
						text-align: center
						z-index: 1
					.input-form
						padding-left: 34px
				.menu-comment
					padding: 10px 20px
		.openList
			margin: 20px 15px 0
		.edit
			.thumb
				&:not(.disactive)
					.onhover
						display: none
					&:hover
						.onhover
							display: block
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
				.input-form
					outline: 0
				.input-form:not(textarea)
					overflow: hidden
					white-space: nowrap
					text-overflow: ellipsis

		.modal
			position: fixed
			top: 50px
			left: 0
			bottom: 0
			right: 0
			overflow-y: auto
			display: none
			background: #fff
			box-sizing: border-box
			opacity: 0
			z-index: 99

		.btn
			border: none
			&.btn-small
				height: 30px
				padding: 0 15px
				font-size: 14px
				line-height: 30px
			&.btn-normal
				height: 40px
				padding: 0 20px
				font-size: 16px
				line-height: 40px
			&.btn-large
				height: 50px
				padding: 0 30px
				font-size: 18px
				line-height: 50px
				background: #009688
				color: #fff
			&.btn-block
				display: block
				width: 100%
			&.btn-primary
				background: #02aedc
				color: #fff
			&.btn-danger
				background: #eb2142
				color: #fff
			&.btn-warning
				background: #d35400
				color: #fff
			&.btn-safety
				background: #2fcdb4
				color: #fff
			&.btn-outline
				&.btn-warning
					box-sizing: border-box
					background: transparent
					border: 2px solid  #d35400
					color: #d35400
