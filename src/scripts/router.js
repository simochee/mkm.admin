// Tagファイルを呼び出し
require('./tags/common/navbar');
require('./tags/common/slide-menu');


/*
 * Routerを設定
 */
// Access: / - ホーム
riot.route('/', () => {
	require('./tags/home');

	// routeタグにhomeをマウント
	riot.mount('route', 'home', {
		title: 'myAdmin.vβ'
	})
});

// Router起動用Moduleを用意
module.exports = {
	start: () => {
		// Riot routerを起動
		riot.route.start(true);
	}
}