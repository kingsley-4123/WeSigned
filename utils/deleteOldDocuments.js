async function deleteOldDocuments(collection){
    try{
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const result = await collection.deleteMany({ createdAt: { $lt: sixMonthsAgo } });
        console.log(`Deleted ${result.deletedCount} documents`);
    } catch (error) {
        console.error(error);
    }
}

export default deleteOldDocuments;