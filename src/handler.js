import { handleTransferProcessed } from "./transfer-processed.js";
import { handleSignup } from "./signup.js";
import { handleCancel } from "./cancel.js";
import { handleLatePayment } from "./late-payment.js";
import { loop } from "@loop-crypto/loop-sdk";

export async function incoming(event, context, callback) {
    try {
        const signature = event.headers["loop-signature"];
        const validWebhook = loop.verifyWebhook(event.body, signature);
        if (!validWebhook) {
            throw new Error("Invalid request signature");
        }

        const body = JSON.parse(event.body);
        const { event: webhookType, networkId, contractAddress } = body;
        console.log(`Handling incoming webhook event: ${webhookType}`);

        if (networkId != process.env.LOOP_CONTRACT_NETWORK_ID) {
            throw new Error("Mismatched network ID");
        }
        if (
            contractAddress.toLowerCase() !==
            process.env.LOOP_CONTRACT_ADDRESS.toLowerCase()
        ) {
            throw new Error(`Mismatched contract address: ${contractAddress}`);
        }

        switch (webhookType) {
            case "AgreementSignedUp":
                await handleSignup(body);
                break;
            case "AgreementCancelled":
                await handleCancel(body);
                break;
            case "TransferProcessed":
                await handleTransferProcessed(body);
                break;
            case "LatePayment":
                await handleLatePayment(body);
                break;
        }
        console.log("Handler finished");
    } catch (error) {
        console.log(`Demo app handler failed. Error: ${error}`);
    }
}
