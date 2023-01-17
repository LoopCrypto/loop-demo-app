import { loop } from "@loop-crypto/loop-sdk";

export async function handleTransferProcessed(eventBody) {
    // TODO: Add Invoice ID to webhook
    const {
        transferId,
        paymentTokenSymbol,
        endUser,
        email,
        success,
        reason,
        amountPaid,
        transaction,
    } = eventBody;

    if (success) {
        console.log(`Transfer ${transferId} processed, txid: ${transaction}`);
        console.log(`User email: ${email} from payment wallet: ${endUser}`);
        console.log(`Amount: ${amountPaid} ${paymentTokenSymbol}`);
    } else {
        console.log(`Transfer ${transferId} failed. Reason: ${reason}`);

        try {
            const transfer = (
                await loop.getTransfers({ transferId: transferId })
            )[0];
            // Note: To retry processing transfer, you will need to submit a
            // transfer with a different invoice ID.
            if (!transfer.invoiceId.endsWith("retry")) {
                const result = loop.signSendTransfer({
                    invoiceId: `${transfer.invoiceId}-retry`,
                    itemId: transfer.planId,
                    fromAddress: transfer.fromAddress,
                    toAddress: transfer.toAddress,
                    tokenAddress: transfer.token,
                    amount: transfer.amount,
                    usd: transfer.usd,
                });
                console.log(await result);
            }
        } catch (e) {
            console.log(e);
        }
    }
}
