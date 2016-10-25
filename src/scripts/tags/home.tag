home
	navbar(title="{opts.title}")

	a(href="http://examle.com" target="_blank").home-logo
		img(src="./images/logo.svg")

	

	style(type="sass" scoped).
		.home-logo
			position: absolute
			top: 50%
			left: 50%
			display: block
			width: 150px
			height: 150px
			margin: -75px
			background: #111
			text-align: center
			img
				height: 40px
				margin: 55px 0