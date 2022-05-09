const { MessageEmbed } = require("discord.js");
const {
	commands,
	musicCommands,
	gameCommands,
} = require("../config/commandHandler");
const { prefixes, color } = require("../config.json");
// const getAyah = require("../utils/special/randomSacred");
const getFromPost = require("../utils/automation/instagram");

module.exports = {
	name: "messageCreate",
	async execute(msg, client) {
		if (msg.author.bot) return;

		// Check if the message is from instagram
		if (msg.content.startsWith("https://www.instagram.com")) {
			const shortcode = msg.content.substring(26, msg.content.length - 1);
			const post = await getFromPost(shortcode);
			console.log(post);
		}

		// check prefix
		let args = "";
		if (msg.content.startsWith(prefixes)) {
			args = msg.content.substring(prefixes.length).split(" ");
		}
		if (!args) return;

		args[0] = args[0].toLowerCase();

		// check command
		let found = false;
		let musicFound = false;
		let gameFound = false;

		commands.each((e) => {
			if (e.name == args[0]) found = true;
		});
		musicCommands.each((e) => {
			// check for shorthand
			if (e.name == args[0]) {
				musicFound = true;
			} else if (e.alias == args[0]) {
				musicFound = true;
				args[0] = e.name;
			}
		});
		gameCommands.each((e) => {
			if (e.name == args[0]) gameFound = true;
		});

		// execute command if found on each category
		if (found) {
			commands
				.get(args[0])
				.execute(msg, args, commands, client, musicCommands, gameCommands);
		} else if (musicFound) {
			let guildQueue = client.player.getQueue(msg.guild.id);
			musicCommands.get(args[0]).execute(msg, args, client, guildQueue);
		} else if (gameFound) {
			gameCommands.get(args[0]).execute(msg, args, client);
		}
	},
};
