require('./env');
require('./globals');

const { mongodb,redis } = require('./app/utils');
const router = require('./app/routers');

mongodb.initialize();
redis.initialize();
router.initialize();
