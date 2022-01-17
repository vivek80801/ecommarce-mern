import { createHmac } from "crypto";
import { saveUserToDatabase } from "./microservices/user";

export module User {
  export const secret = process.env.SECRET ?? "user";
  export class MyUser {
    username: string;
    password: string;
    email: string;
    constructor(username: string, email: string, password: string) {
      this.username = username;
      this.email = email;
      this.password = password;
    }
    hash() {
      const hash = createHmac("sha256", secret)
        .update(this.password)
        .digest("hex");
      this.password = hash;
    }
    save() {
      saveUserToDatabase(this.username, this.email, this.password);
    }
  }
}
