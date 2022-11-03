import { v4 } from 'uuid';

export async function handler(event: any, context: any) {
  return {
    statusCode: 200,
    // Add a random string using an external package
    // to show how bundling of dependencies works
    body: 'Hello from lambda!' + v4(),
  };
}
