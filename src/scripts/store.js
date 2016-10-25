/*
 * JSONを参照して保持するモジュールSQUIRE
 * シングルトンで管理するためアクセスを抑えられる（はず）
 */

const request = require('superagent');

const dataStore = {
	rec: null,
	menu: null
}

const updated = {
	rec: false
}

module.exports = {
	getRecommend: () => {
		return new Promise((resolve, reject) => {
			// 取得済みの場合
			if(dataStore.rec) {
				resolve(dataStore.rec);
			}
			// 取得されていない場合
			else {
				request
					.get('./store/recommend.json')
					.end((err, res) => {
						if(err) {
							reject(err);
							return;
						}
						dataStore.rec = res.body;
						resolve(res.body);
					});
			}
			
		});
	},
	getMenuList: () => {
		return new Promise((resolve, reject) => {
			// 取得済みの場合
			if(dataStore.menu) {
				resolve(dataStore.menu);
			}
			// 取得されていない場合
			else {
				request
					.get('./store/menu-list.json')
					.end((err, res) => {
						if(err) {
							reject(err);
							return;
						}
						dataStore.menu = res.body;
						resolve(res.body);
					});
			}
		});
	}
}