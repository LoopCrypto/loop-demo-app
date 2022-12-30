import { handleSignup } from "./signup.js";

export async function incoming(event, context, callback) {
    // TODO: validate secret? need instructions on how to do that

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
            return;
        case "SubscriptionUnsubscribed":
            // TODO: AFAIK we are not sending this webhook yet
            return;
        default:
            return;
    }
}
