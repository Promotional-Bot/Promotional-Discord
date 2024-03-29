"use strict";

const { client } = require("../../index.js");

module.exports = {
  name: "reload",
  description: "Reload a command",
  options: [
    {
      type: 3,
      name: "command",
      description: "The name of the command to reload",
      required: true,
      min_length: 2,
      max_length: 25
    },
  ],
  execute: async (interaction, args) => {
    const { command } = args;
    
    const commandData = client.commands.get(command);

    if(!commandData) return interaction.createFollowup(`\`${command}\` is not a valid command name.`);

    const commandPath = `../${commandData.category}/${commandData.name}.js`;

    delete require.cache[require.resolve(commandPath)];

    client.commands.delete(commandData.name);

    const newCommand = require(commandPath);

    newCommand.category = commandData.category;

    client.commands.set(commandData.name, newCommand);

    interaction.createFollowup(`Successfully reloaded the command \`${command}\``);
  }
};
