import { Space } from '../models/space';

export class MissingFieldError extends Error {}

export const validateSpace = (arg: any) => {
  if (!(arg as Space).name) {
    throw new MissingFieldError('Value for name is required!');
  }
  if (!(arg as Space).location) {
    throw new MissingFieldError('Value for location is required!');
  }
  if (!(arg as Space).spaceId) {
    throw new MissingFieldError('Value for spaceId is required!');
  }
};
