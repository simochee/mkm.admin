slide-menu
	.slide-menu(class="{open: opts.isOpen}")
		ul.menu-list
			li.thumb
				img.logo(src="./images/logo.svg")
			li.list-item(each="{item in menu}")
				a.anchor(href="{item.href}" target="{item._blank ? '_blank' : '_self'}")
					span.icon(class="{item.icon}")
					span.title {item.title}
		.copyright Developed by simochee @ 2016

	script.
		this.menu = [
			{
				title: 'サイトを開く',
				icon: 'ion-android-home',
				href: 'http://村村村.shop',
				_blank: true
			},
			{
				title: 'おすすめ',
				icon: 'ion-wineglass',
				href: '#/rec'
			},
			{
				title: '営業日',
				icon: 'ion-android-calendar',
				href: '#/bus'
			},
			{
				title: 'おしらせ',
				icon: 'ion-edit',
				href: '#/blog'
			},
			{
				title: 'アクセス',
				icon: 'ion-arrow-graph-up-right',
				href: 'http://google.com',
				_blank: true
			}
		]

	style(type="sass" scoped).
		.slide-menu
			position: fixed
			top: 50px
			bottom: 0
			left: -240px
			width: 240px
			background: #fff
			z-index: 999
			transition: left .3s ease
			&.open
				left: 0
			.menu-list
				.thumb
					display: -webkit-flex
					display: -moz-flex
					display: -ms-flex
					display: -o-flex
					display: flex
					align-items: center
					justify-content: center
					height: 120px
					background: #111
					.logo
						width: 80px
				.list-item
					border-bottom: 1px solid  #ccc
					.anchor
						$height: 60px
						position: relative
						display: block
						height: $height
						line-height: $height
						color: #222
						text-decoration: none
						transition: background .2s ease
						&:hover
							background: #ccc
						.icon
							position: absolute
							top: 0
							left: 5px
							display: block
							width: 40px
							margin-right: 10px
							font-size: 20px
							text-align: center
						.title
							display: block
							margin-left: 10px
							letter-spacing: 0.1em
							text-align: center
							font-size: 14px
			.copyright
				position: absolute
				bottom: 10px
				left: 0
				right: 0
				text-align: center
				font-size: 10px
				color: #333