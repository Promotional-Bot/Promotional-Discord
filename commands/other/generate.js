"use strict";

module.exports = {
  name: "generate",
  description: "Returns self generated promotional link(s).",
  cooldown: 3000,
  options: [
    {
      type: 4,
      name: "count",
      description: "How much links to self generate",
      min_value: 1,
      max_value: 12,
    },
  ],
  execute: async (interaction, args) => {
    const count = args.count ?? 6;

    let embed = {
      title: "",
      timestamp: new Date(),
      color: 16776960,
      description: `Requesting self generated promotional link(s)...`,
      author: {
        name: "Promotional",
        icon_url: "https://i.ibb.co/W5QdSFy/Promotional.jpg",
      },
    };

    const msg = await interaction.createFollowup({ embed: embed });

    let embeds = [];

    let author = {
      name: "Promotional",
      icon_url: "https://i.ibb.co/W5QdSFy/Promotional.jpg",
    };

    try {
      let links = [];

      const data = {
        partnerUserId: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,               
          (function(t) {
              const e = 16 * Math.random() | 0;
              return ("x" === t ? e : 3 & e | 8).toString(16)
          }))
      };
      
      for (let i = 0; i < count; i++) {
        const response = await fetch(
          "https://api.discord.gx.games/v1/direct-fulfillment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          },
        );

        if (!response.ok) {
          links.push(`Failed! Status: ${response.status}`);
        }

        if (response.ok) {
          const responseData = await response.json();

          links.push(
            `https://discord.com/billing/partner-promotions/1180231712274387115/${responseData.token}`,
          );
        }
      }

      let linksText;

      while (links.length > 0) {
        linksText = links
          .slice(0, 9)
          .map((link, index) => {
            if (link.startsWith("https")) {
              return `${
                index + 1 + embeds.length * 9
              }. [Claim Promotional](${link})`;
            } else {
              return `${index + 1 + embeds.length * 9}. ${link}`;
            }
          })
          .join("\n");

        const newEmbed = {
          color: 65280,
          description: `Request(s) fulfilled. Claim your promotional(s):\n\n${linksText}`,
        };

        if (embeds.length === 0) {
          newEmbed.author = author;
          newEmbed.description = `Request(s) fulfilled. Claim your promotional(s):\n\n${linksText}`;
        }

        embeds.push(newEmbed);

        links = links.slice(9);
      }

      embeds[embeds.length - 1].timestamp = new Date();
      embeds[embeds.length - 1].description =
        `Request(s) fulfilled. Claim your promotional(s):\n\n${linksText}`;

      msg.edit({ embeds: embeds });
    } catch (error) {
      console.error("Error:", error);
    }
  },
};
