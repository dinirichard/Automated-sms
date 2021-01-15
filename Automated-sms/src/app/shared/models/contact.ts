export interface Contact {
  id?: string;
  name: string;
  emailAddresses?: string[];
  phoneNumbers: string[] | string;
  owner?: string;
}
