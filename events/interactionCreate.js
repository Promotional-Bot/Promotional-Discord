"use strict";

const Eris = require("eris");
const ms = require("ms");

const { client } = require("../index.js");

const cooldowns = new Map();

client.on("interactionCreate", (interaction) => {
  if (interaction instanceof Eris.CommandInteraction) CommandInteraction(interaction);
  else if (interaction instanceof Eris.ComponentInteraction) ComponentInteraction(interaction);
  else if (interaction instanceof Eris.AutocompleteInteraction) AutocompleteInteraction(interaction);
});

async function CommandInteraction(interaction) {
  try {
    await interaction.acknowledge();
  } catch {
    return;
  }

  try {
    const args = {};

    interaction.data.options?.forEach((arg) => {
      if (arg.type === 1) {
        args.sub_command = arg.name;
        for (const option of arg.options) {
          args[option.name] = option.value;
        }
      } else args[arg.name] = arg.value;
    });

    if (!interaction.user) interaction.user = interaction.member.user;

    const member = interaction.user;
    const guild = interaction.channel.guild;

    const command = client.commands.get(interaction.data.name);

    if (guild) {
    if (command.disabled) return interaction.createFollowup({ content: "Command disabled. Try again later." });

    if (command.dmsOnly && guild) return interaction.createFollowup({ content: "You can only use this command in DMs." });

      // handle cooldowns
      if (command.cooldown) {
        const cooldown = cooldowns.get(member.id) ?? {};
        const msData = { long: true };

        if (cooldown[command.name] > Date.now()) {
          const rateLimitEnd = ms(cooldown[command.name] - Date.now(), msData);
          
          if (true) {
            interaction.createFollowup({ content: `You are ratelimited. Ratelimit ends in ${rateLimitEnd}` });
          }
          return;
        }

        cooldown[command.name] = Date.now() + (command.cooldown);
        cooldowns.set(member.id, cooldown);
      }
    }

    await command.execute(interaction, args);
} catch (error) {
    console.error(error);

    interaction.createFollowup({ content: "An error has occurred." });
  }
}

async function ComponentInteraction(interaction) {
  let cmdName;
  
  try {
    if (!interaction.user) interaction.user = interaction.member.user;

    const command = interaction.message.interaction;

    const commandName = command.name.split(" ")[0];
    
    cmdName = commandName;

    const { componentPressEvent, componentSelectEvent } = client.commands.get(commandName);
    
    const { custom_id } = interaction.data;

    if (commandName !== "msg" && interaction.message.interaction.user.id !== (interaction.member?.id ?? interaction.user.id)) return interaction.createMessage({ content: "This isn't for you.", flags: 64 });

    if (interaction.data.component_type === 2) await componentPressEvent(interaction, custom_id);
    else if (interaction.data.component_type === 3) await componentSelectEvent(interaction, custom_id);
  } catch (error) {
    console.error(error);
  }
}

async function AutocompleteInteraction(interaction) {
  try {
    const { name, options } = interaction.data;

    const argument = options.find(args => args.focused);

    const { autocompleteEvent } = client.commands.get(name.split(" ")[0]);

    await autocompleteEvent(interaction, argument);
  } catch (error) {
    console.error(error);
  }
}