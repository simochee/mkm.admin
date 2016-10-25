// Tagファイルを呼び出し
require('./tags/common/navbar');
require('./tags/common/slide-menu');
require('./tags/common/btn');


/*
 * Routerを設定
 */
// Access: / - ホーム
riot.route('/', () => {
	require('./tags/home');

	// routeタグにhomeをマウント
	riot.mount('route', 'home', {
		title: 'Home'
	});
});

// Access: /rec - おすすめ
riot.route('/rec', () => {
	require('./tags/recommend');

	// routeタグにrecommendをマウント
	riot.mount('route', 'recommend', {
		title: 'おすすめ'
	})
});

// Router起動用Moduleを用意
module.exports = {
	start: () => {
		// Riot routerを起動
		riot.route.start(true);
	}
}