news-editor-body
	.news-editor-body
		ul.toolbar
			li.tool-item
				i.fa.fa-font
			li.tool-item
				i.fa.fa-align-left
			li.tool-item
				i.fa.fa-header
			li.tool-item
				i.fa.fa-image
			li.tool-item
				i.fa.fa-chain
			li.tool-item
				i.fa.fa-undo
			li.tool-item
				i.fa.fa-code

		.editor
			iframe#editor

	script(src="./src/scripts/libs/squire-row.js")
	script.

		var editor;
		this.on('mount', function() {
			var iframe = document.getElementById('editor');

			iframe.addEventListener('load', function() {
				var doc = iframe.contentDocument;

				// Editorが生成されていたら実行しない
				if( editor ) {
					return;
				}

				editor = new Squire(doc, {
					blockTag: 'p'
				});
			}, false);
		});

	style(type="sass" scoped).
		.news-editor-body
			margin: 0 -12px
			.toolbar
				width: 280px
				height: 40px
				margin: 0 auto
				border: 1px solid #aaa
				border-radius: 3px
				.tool-item
					float: left
					width: 40px
					height: 40px
					box-sizing: border-box
					line-height: 40px
					text-align: center
					&:not(:last-child)
						border-right: 1px solid #aaa
					&:hover
						border-bottom: 3px solid #02aedc

		.editor
			width: 100%
