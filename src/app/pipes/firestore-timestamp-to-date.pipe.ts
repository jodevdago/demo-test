import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'firestoreTimestampToDate',
  standalone: true
})
export class FirestoreTimestampToDatePipe implements PipeTransform {
  transform(value: Timestamp | null | undefined): Date | null {
    if (value) {
      return value.toDate();
    }
    return null;
  }
}
