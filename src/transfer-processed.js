import { loop } from "loop-sdk";

export async function handleTransferProcessed(eventBody) {
    // TODO: Add Invoice ID to webhook
    const {
        paymentId,
        tokenSymbol,
        endUser,
        email,
        success,
        reason,
        amountPaid,
        transaction,
    } = eventBody;

    if (success) {
        console.log(`Transfer ${paymentId} processed, txid: ${transaction}`);
        console.log(`User email: ${email} from payment wallet: ${endUser}`);
        console.log(`Amount: ${amountPaid} ${tokenSymbol}`);
    } else {
        // TODO: handle common failure reasons here (need documentation)
        console.log(`Transfer ${paymentId} failed. Reason: ${reason}`);

        // TODO: once we have better functionality of getTransfer,
        // we can just get it by ID instead of filtering all results
        const transfer = loop
            .getTransfers()
            .find((transfer) => transfer.id === paymentId);
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
    }
}
