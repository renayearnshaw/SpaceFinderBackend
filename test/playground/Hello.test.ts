import { handler } from '../../services/tables/Spaces/Read';

const event = {
  body: {
    location: 'Paris',
  },
};

// Run the lambda function locally so that we can debug it
handler({} as any, {} as any).then((apiResult) => {
  // format the body for easier viewing
  const items = JSON.parse(apiResult.body);
  // Add a console.log call so that we can put a breakpoint here
  console.log(123);
});
