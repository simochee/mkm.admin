module.exports = {
	// テキストエリアの自動リサイズ
	// @ http://qiita.com/YoshiyukiKato/items/507b8022e6df5e996a59
	autoResize: (target, h = 25, lh = 25) => {
		target.style.height = `${h}px`;
		target.style.lineHeight = `${lh}px`;
		target.addEventListener('input', function(e) {
			// 中身とTextareaの大きさを比較して高さを付与
			if(e.target.scrollHeight > e.target.offsetHeight) {
				e.target.style.height = `${e.target.scrollHeight}px`;
			} else {
				let height, lineHeight;
				while(true) {
					// 外側の高さを取得
					height = +(e.target.style.height.split('px')[0]);
					// lineHeighの値を取得
					lineHeight = +(e.target.style.lineHeight.split('px')[0]);
					e.target.style.height = height - lineHeight + 'px';
					if(e.target.scrollHeight > e.target.offsetHeight) {
						e.target.style.height = e.target.scrollHeight + 'px';
						break;
					}
				}
			}
		});
	}
}