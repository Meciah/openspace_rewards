import dotenv from "dotenv";
dotenv.config();

import {
  ActionTraceData,
  createDfuseClient,
  InboundMessage,
  InboundMessageType,
} from "@dfuse/client";
import nodeFetch from "cross-fetch";
import { processSale } from "./lib/discord";
import { runMain } from "./lib/run";
import { PurchaseSaleProps } from "./typings/sale";

(global as any).WebSocket = require("ws");

// MAIN function
async function main(): Promise<void> {
  const client = createDfuseClient({
    authentication: false,
    network: "wax.dfuse.eosnation.io",
    httpClientOptions: {
      fetch: nodeFetch,
    },
  });

  console.log("Starting...");

  const stream = await client.streamActionTraces(
    { accounts: "theopenroyal", action_names: "logreward" },
    (message: InboundMessage<any>) => {
      if (message.type === InboundMessageType.ACTION_TRACE) {
        const { land_id, project_name, reward, winner }: PurchaseSaleProps = (
          message.data as ActionTraceData<any>
        ).trace.act.data;

        console.log(`land_id: #${land_id} | project_name: '${project_name}' | reward: '${reward} | winner: '${winner}'`);

        // NOTE: do not await as it will block the process
        //console.log(memo.split(" ")[0])
        processSale(land_id, project_name, reward, winner);
      }
    }
  );

  // const stream2 = await client.streamActionTraces(
  //   { accounts: "theopenroyal", action_names: "transfer" },
  //   (message: InboundMessage<any>) => {
  //     if (message.type === InboundMessageType.ACTION_TRACE) {
  //       const { memo, quantity, to }: PurchaseSaleProps = (
  //         message.data as ActionTraceData<any>
  //       ).trace.act.data;

  //       console.log(`Mesdfgsdgsmo: #${memo[0]} | Quantity: '${quantity}' | Buyer: '${to}'`);

  //       // NOTE: do not await as it will block the process
  //       processSale(memo.split(" ").slice(-1)[0], quantity, to);
  //     }
  //   }
  // );

  await new Promise(() => {});
  await stream.close();
  //await stream2.close();

  client.release();
}

runMain(main);
