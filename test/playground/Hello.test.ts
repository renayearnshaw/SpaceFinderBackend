import { handler } from '../../services/node-lambda/hello';

// Run the lambda function locally so that we can debug it
handler({}, {});
