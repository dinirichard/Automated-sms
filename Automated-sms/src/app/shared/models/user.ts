import { Contact } from './contact';

export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  photoUrl: string;
  setuoComplete?: string;
  contacts?: Contact[];
}
