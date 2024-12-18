const express = require('express');
const syncDatabase = require('./config/syncDatabase');
const app = express();
app.use(express.json());
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const cartRoute = require('./routes/cartRoute');
const paymentRoute = require('./routes/paymentRoute');
const supplierRoute = require('./routes/supplierRoute');
const cors = require('cors');

app
    .use(cors({origin: '*'}))
    .use('/user', userRoute)
    .use('/product', productRoute)
    .use('/cart', cartRoute)
    .use('/payment', paymentRoute)
    .use('/supplier', supplierRoute);
syncDatabase();

app.listen(3000, () => {
    console.log('Server runnin on http://localhost:3000');
});
