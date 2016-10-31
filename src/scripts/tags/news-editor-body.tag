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
			#editor

			pre#preview
	script.

		this.on('mount', function() {
			// Squireオブジェクト
			var editor;
			var iframe = document.createElement('iframe');

			iframe.addEventListener('load', function() {
				var doc = iframe.contentDocument;

				// Editorが生成されていたら実行しない
				if( editor ) {
					return;
				}

				editor = new Squire(doc, {
					blockTag: 'p'
				});

				// StyleSheetを追加
				var link = doc.createElement('link');
				link.rel = 'stylesheet';
				link.href = './stylesheets/editor.css';
				doc.querySelector('head').appendChild(link);
			}, false);

			document.getElementById('editor').appendChild(iframe);
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
