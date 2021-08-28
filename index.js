require('./env');
require('./globals');

const { mongodb } = require('./app/utils');
const router = require('./app/routers');

mongodb.initialize();
router.initialize();
