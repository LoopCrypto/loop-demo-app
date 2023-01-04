export async function handleTransferProcessed(eventBody) {
    // TODO: Add Invoice ID to webhook
    // TODO: The naming of event args between different webhook events are not very consistent
    const {
        paymentId, // Transfer ID (probably should unify the naming)
        tokenSymbol,
        endUser, // Wallet address of the user
        email,
        success,
        reason,
        amountPaid,
        transaction, // tx ID of the payment
    } = eventBody;

    if (success) {
        console.log(`Transfer ${paymentId} processed, txid: ${transaction}`);
        console.log(`User email: ${email} from wallet: ${endUser}`);
        console.log(`Amount: ${amountPaid} ${tokenSymbol}`);
    } else {
        // TODO: handle common failure reasons here (need documentation)
        // Note: To retry processing transfer, you will need to submit a
        // transfer with a different invoice ID.
        console.log(`Transfer ${paymentId} failed. Reason: ${reason}`);
    }
}
