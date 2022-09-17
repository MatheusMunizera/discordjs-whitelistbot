const Whitelist = require('./whitelistClass');
module.exports = ({
	client,
	message
}) => {
	console.log(`CRIANDO CANAL NO DISCORD ${message.author.username}`)
	new Whitelist({
		message,
		client
	})
}