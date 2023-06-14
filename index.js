const request = require("./request.js");
const { Client, MessageEmbed } = require("discord.js");
const client = new Client({
  intents: 3276799,
});
const config = require("./config.json");

client.on("ready", () => {
  console.log("Online");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.content.startsWith(config.prefix)) return;
  const args = message.content.split(" ").slice(1);

  const splitarg = args.join(" ").slice(0).split(" // ");
  const [name, time, currency] = splitarg;

  request
    .getItemData(name, time, currency)
    .then((resp) => {
      if (resp.data.success == "false" || !name || !time || !currency) {
        const errorMessage = new MessageEmbed()
          .setColor("#ff0000")
          .setTitle("Erro")
          .setDescription(
            "Estrutura correta: $info item(english) // time(days) // currency\n\nExemplo:\nInput: $info AK-47 | Aquamarine Revenge (Battle-Scarred) // 7 // USD\n\nSaída:\nAK-47 | Aquamarine Revenge (Battle-Scarred)\nInformações dos últimos 7 dias\nPreço médio = USD 15.58;\nQuantidade vendida = 373;\nMenor preço = USD 13.99;\nMaior preço = USD 17.82;"
          );

        return message.reply({ embeds: [errorMessage] });
      }

      const embedMessage = new MessageEmbed()
        .setColor("#" + request.getItemColor(name))
        .setTitle(name)
        .setDescription(`Informações do Steam nos últimos ${time} dia(s)`)
        .addFields("Preço médio", `${currency} ${resp.data.average_price}`,
        "Quantidade vendida", resp.data.amount_sold,
        "Menor preço", `${currency} ${resp.data.lowest_price}`,
        "Maior preço", `${currency} ${resp.data.highest_price}`);

      message.reply({ embeds: [embedMessage] });
    })
    .catch((err) => {
      console.error(err);
    });
});

client.login(config.TOKEN);