"use strict";

const { client } = require("../../index.js");

module.exports = {
  name: "ping",
  description: "Returns the bot's current ping.",
  execute: async (interaction, args) => {
    let embed = {
      title: "",
      timestamp: new Date(),
      color: 16776960,
      description: "Grabbing current ping...",
      author: {
        name: "Promotional",
        icon_url: "https://i.ibb.co/W5QdSFy/Promotional.jpg"
      }
    }; 
    
    const currentTime = Date.now();
    
    const msg = await interaction.createFollowup({ embed: embed });

    let message = `**Ping**: \`${Date.now() - currentTime}ms\`\n\n`;

    embed = {
      title: "",
      timestamp: new Date(),
      color: 65280,
      description: message,
      author: {
        name: "Promotional",
        icon_url: "https://i.ibb.co/W5QdSFy/Promotional.jpg"
      }
    };

    msg.edit({ embed: embed });
  }
};
