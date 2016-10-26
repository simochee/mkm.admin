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
	require('./tags/menu-list');

	navbar.setTitle('おすすめ');
	// routeタグにrecommendをマウント
	riot.mount('route', 'recommend')
});

// Access: /menu - お品書き
riot.route('/menu', () => {
	require('./tags/menu');
	require('./tags/menu-list');

	navbar.setTitle('お品書き');
	// routeタグにmenuをマウント
	riot.mount('route', 'menu');
});

// News: /news - おしらせ
riot.route('/news', () => {
	require('./tags/news');

	navbar.setTitle('おしらせ');
	// routeタグにnewsをマウント
	riot.mount('route', 'news');
});

riot.route(() => {
	require('./tags/home');

	navbar.setTitle('myAdmin for 村村村');
	riot.mount('route', 'home');
})

// Router起動用Moduleを用意
module.exports = {
	start: () => {
		// Riot routerを起動
		riot.route.start(true);
	}
}