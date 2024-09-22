import { FirestoreTimestampToDatePipe } from './firestore-timestamp-to-date.pipe';

describe('FirestoreTimestampToDatePipe', () => {
  it('create an instance', () => {
    const pipe = new FirestoreTimestampToDatePipe();
    expect(pipe).toBeTruthy();
  });
});
