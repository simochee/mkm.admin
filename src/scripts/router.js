// Tagファイルを呼び出し
require('./tags/common/navbar');
require('./tags/common/slide-menu');
require('./tags/common/btn');

// navbarをマウント
const navbar = riot.mount('navbar')[0];

/*
 * Routerを設定
 */
// Access: / - ホーム
riot.route('/', () => {
	require('./tags/home');

	navbar.setTitle('Home')
	// routeタグにhomeをマウント
	riot.mount('route', 'home');
});

// Access: /rec - おすすめ
riot.route('/rec', () => {
	require('./tags/recommend');

	navbar.setTitle('おすすめ');
	// routeタグにrecommendをマウント
	riot.mount('route', 'recommend')
});

// Router起動用Moduleを用意
module.exports = {
	start: () => {
		// Riot routerを起動
		riot.route.start(true);
	}
}