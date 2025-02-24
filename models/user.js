export class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  __setConfirmEmail(confirmEmail) {
    this.confirmEmail = confirmEmail;
  }

  __setConfirmPassword(confirmPassword) {
    this.confirmPassword = confirmPassword;
  }

  emailIsValid() {
    return this.email.includes('@');
  }

  passwordIsValid() {
    //Firebase only accepts passwords that have 6 or more characters.
    return this.password.length >= 6;
  }

  emailsAreEqual() {
    return this.email === this.confirmEmail;
  }

  passwordsAreEqual() {
    return this.password === this.confirmPassword;
  }
}