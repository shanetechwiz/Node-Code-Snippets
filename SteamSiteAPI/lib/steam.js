const request = require('request');
const utils = require('./utils');
const config = require('../config');

module.exports = {
	getUserInventory: (user_steam_id, game_app_id, game_context_id, callback) => {
		let inventoryLink = `http://steamcommunity.com/profiles/${user_steam_id}/inventory/json/${game_app_id}"/${game_context_id}`;

		request(inventoryLink,  (err, resp, body) => {
			if(err) { console.log(`Failed to get inventory: ${err}`); return; }

			if(body) {
				try
				{
					let items = (typeof body == "string") ? JSON.parse(body) : body;
					let userInventory = utils.steam_inventory_merge(items.rgInventory, items.rgDescriptions, game_context_id);
					
					callback({ success: true, data: JSON.stringify(userInventory) });
				}
				catch(err) {
					callback({ success: false, error: err });
				}				
			}
			else {
				callback({ success: false, error: config.error_messages.unable_to_get_user_inventory });
			}
			
		});
	}
}