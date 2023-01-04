import { handleTransferProcessed } from "./transfer-processed.js";
import { handleSignup } from "./signup.js";
import { verifyWebhook } from "loop-sdk";

export async function incoming(event, context, callback) {
    const signature = event.headers["loop-signature"];
    const validWebhook = verifyWebhook(event.body, signature);
    if (!validWebhook) {
        throw new Error("Invalid request signature");
    }

    const body = JSON.parse(event.body);
    const { event: webhookType, networkId, contractAddress } = body;
    if (networkId != process.env.LOOP_CONTRACT_NETWORK_ID) {
        throw new Error("Mismatched network ID");
    }
    if (contractAddress != process.env.LOOP_CONTRACT_ADDRESS) {
        throw new Error("Mismatched contract address");
    }

    switch (webhookType) {
        case "SubscriptionSignedUp":
            handleSignup(body);
            break;
        case "SubscriptionUnsubscribed":
            // TODO: AFAIK we are not sending this webhook yet
            break;
        case "TransferProcessed":
            handleTransferProcessed(body);
            break;
        case "LatePayment":
            // TODO
            break;
    }
}
