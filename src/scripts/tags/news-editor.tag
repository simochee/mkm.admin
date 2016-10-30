news-editor
	.news-editor
		ul.input-group
			li
				span.label タイトル
				.input.large
					textarea.input-form#inputTitle
			li
				span.label 記事ID（半角英数と-のみ）
				.input.small
					input.input-form(placeholder="省略した場合はentry+date")
				span.note.note-danger
					span.ion-alert-circled.icon
					| 半角英数字と - (ハイフン)のみ入力可能です
			li
				news-editor-body

	script.
		var utils = require('../utils');

		this.on('mount', function() {
			utils.autoResize(document.getElementById('inputTitle'));
		});

	style(type="sass").
		.input-group
			padding: 8px 12px
			li
				margin-bottom: 15px
				.label
					margin-bottom: 5px
					font-size: 12px
					font-weight: bold
				.note
					display: block
					margin: 4px 10px
					font-size: 12px
					font-weight: bold
					visibility: hidden
					&.note-danger
						color: #eb2142
					.icon
						margin-right: 5px

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