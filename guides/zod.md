# Using Zod to Validate API Responses

```typescript
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import z from 'zod';
import { Friend } from '../types';

const NameSchema = z.string().nonempty().min(3).max(102);
const FriendSchema = z.object({
  id: z.string(),
  name: NameSchema,
  boughtLastTime: z.boolean(),
});

type FriendApiResponse = z.infer<typeof FriendSchema>;
export class FriendsDataService {
  #httpClient = inject(HttpClient);
 

  addFriend(name: string, tempId: string) {
    return this.#httpClient
      .post<FriendApiResponse>('/api/user/friends', { name })
      .pipe(
        map((friend) => FriendSchema.parse(friend)),
        map((friend) => ({ friend, tempId })),
      );
  }
 
}
```