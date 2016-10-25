// オブザーバーをグローバルに登録
window.obs = riot.observable();

// ルーティングの設定を呼び出し、起動
const router = require('./router');
router.start();