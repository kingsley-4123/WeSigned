// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('we-signed-offline');

// Create a new document in the collection.
db.getCollection('transactions').insertOne({
  "payedBy": "694ce47ac079dbfc9122475c",
  "transactionReference": "trx_874yydndfjksnnjd993j",
  "paymentReference": "pRef_ndddfnsn84uu499nkkfn",
  "amount": 1000,
  "email": "kings@gmail.com",
  "expires": 1769237969411
  "description": "1 month subscription",
  "currency": "NGN",
  "status": "success"
});
