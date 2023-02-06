import { loop } from "@loop-crypto/loop-sdk";
import { currentSeconds } from "./utils.js";

export async function handleSignup(eventBody) {
    // This is your loop contract receive address
    const toAddress = "0x1BE57B0C6dcCA24D7E16b9b8ed986D759e2A80F9";
    const {
        item,
        addOnItems,
        itemId,
        paymentTokenAddress,
        email,
        subscriber,
        agreementAmount,
        addOnTotalAmount,
        frequencyNumber,
        frequencyUnit,
    } = eventBody;

    // When Passing in USD amounts to the SDK, the amounts are sent in cents.
    const totalFirstBillingAmountCents =
        (parseFloat(agreementAmount) + parseFloat(addOnTotalAmount)) * 100;

    // Send first transfer request
    try {
        const result = await loop.signSendTransfer({
            invoiceId: `${email}-${item}-${addOnItems}-0`,
            itemId: itemId,
            fromAddress: subscriber,
            toAddress: toAddress,
            tokenAddress: paymentTokenAddress,
            amount: totalFirstBillingAmountCents,
            usd: true,
        });
        console.log(result);

        // In this example, we also send out the next 5 transfer requests
        // if a recurring payment is required, in addition to the initial
        // payment to help you understand all the fields that are posted
        // in the webhook and the different functions in the SDK.
        // This is optional and up to you on how you want to handle the
        // subsequent transfer requests.
        const firstBillDate = currentSeconds();
        const billingPeriodSeconds = loop.utils.billingPeriodInSeconds(
            frequencyNumber,
            frequencyUnit
        );
        if (billingPeriodSeconds > 0) {
            const transfers = [];
            for (let i = 1; i <= 5; i++) {
                const invoiceId = `${email}-${item}-${i}`;
                const billingAmount = parseFloat(agreementAmount) * 100;
                const signature = await loop.signTransfer({
                    invoiceId: invoiceId,
                    fromAddress: subscriber,
                    toAddress: toAddress,
                    tokenAddress: paymentTokenAddress,
                    amount: billingAmount,
                    usd: true,
                });
                transfers.push({
                    invoiceId: invoiceId,
                    entityId: process.env.LOOP_API_ID,
                    amount: billingAmount.toString(),
                    from: subscriber,
                    to: toAddress,
                    token: paymentTokenAddress,
                    usd: true,
                    networkId: parseInt(process.env.LOOP_CONTRACT_NETWORK_ID),
                    itemId: itemId,
                    billDate: firstBillDate + billingPeriodSeconds * i,
                    signature: signature,
                });
            }
            const recurringTransfers = await loop.sendTransfers(transfers);
            console.log(recurringTransfers);
        }
    } catch (e) {
        console.log("Signup handler failed!");
        console.log(e);
    }
}
