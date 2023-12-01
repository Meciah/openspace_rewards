// discord webhook sender

import fetch from "cross-fetch";
import { WEBHOOK } from "./env";
import { sleep } from "./etc";

export const processSale = async (land_id: number, project_name: string, reward: Array<number>, winner:string) => {
  // try to prevent sudden multiple requests
  // TODO: add ways to improve or change this
  await sleep(1000);

  //send the sale embed to the discord webhook
    const res = createResponse(land_id, project_name, reward, winner);
    console.log(res.embeds[0].fields);
    let discordWebhook = WEBHOOK;
    if (!WEBHOOK.endsWith("?wait=true")) {
      discordWebhook += "?wait=true";
    }
    const r = await fetch(discordWebhook, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(res),
    });

    const data = await r.json();
    if (!r.ok) {
      console.error(data);
    }

    console.log(`Sent: Land_id #${land_id}`);
};

const handleImg = (img: string) => {
  if (img.startsWith("https://") || img.startsWith("http://")) {
    return img;
  }

  return `https://atomichub-ipfs.com/ipfs/${img}`;
};

// generate embed response
const createResponse = (
  land_id: number,
  project_name: string,
  reward: Array<number>,
  winner: string,
) => {
  return {
    content: null,
    embeds: [
      {
        author: {
          name: "The Open Space",
          icon_url: `https://resizer.atomichub.io/images/v1/preview?ipfs=QmSoLjiW5Bgro3NmE3ZXQ7mkBGhXHezpU3ysDo1maDhugn&size=370&output=png`,
        },
        title: "Reward Issued",
        fields: [
          {
            name: "Project Name",
            value: project_name,
            inline: true,
          },
          {
            name: "Land ID",
            value: land_id,
            inline: true,
          },
          {
            name: "Reward Winner",
            value: winner,
          },
            ...reward.map((rewards, index) => ({
              name: `Reward`,
              value: `${rewards}`,
            })),
        ],
        timestamp: new Date().toISOString(),
        // footer: {
        //   text: `Sale ID: ${saleId}`,
        // },
      },
    ],

  };

};

