import { handleTransferProcessed } from "./transfer-processed.js";
import { handleSignup } from "./signup.js";
import { handleCancel } from "./cancel.js";
import { handleLatePayment } from "./late-payment.js";
import { loop } from "@loop-crypto/loop-sdk";

export async function incoming(event, context, callback) {
    const signature = event.headers["loop-signature"];
    const validWebhook = loop.verifyWebhook(event.body, signature);
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
        case "AgreementSignedUp":
            handleSignup(body);
            break;
        case "AgreementCancelled":
            handleCancel(body);
            break;
        case "TransferProcessed":
            handleTransferProcessed(body);
            break;
        case "LatePayment":
            handleLatePayment(body);
            break;
    }
}
