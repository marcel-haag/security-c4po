import { v4 as UUID } from 'uuid';

export class User {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  interfaceLang?: string;

  constructor(username?: string,
              firstName?: string,
              lastName?: string,
              email?: string,
              interfaceLang?: string) {
    this.id = UUID();
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    if (email) {
      this.email = email;
    } else {
      this.email = null;
    }
    if (interfaceLang) {
      this.interfaceLang = interfaceLang;
    } else {
     this.interfaceLang = 'en-US';
    }
  }
}
