import { handler } from '../../services/SpacesTable/Create';

const event = {
  body: {
    location: 'Paris',
  },
};

// Run the lambda function locally so that we can debug it
handler(event as any, {} as any);
