class User {
  get Id() {
    return this.id;
  }
  set Id(id) {
    this.Id = id;
  }

  get Email() {
    return this.email;
  }
  set Email(email) {
    this.email = email;
  }

  get AccountName() {
    return this.accountName;
  }
  set AccountName(accountName) {
    this.accountName = accountName;
  }

  get Password() {
    return this.password;
  }
  set Password(password) {
    this.password = password;
  }

  // get WebToken() {
  //   return this.webToken;
  // }
  // set WebToken(webToken) {
  //   this.webToken = webToken;
  // }

  toString() {
    const output = {
      Id: this.id,
      Email: this.email,
      Password: this.password,
      AccountName: this.accountName,
      // WebToken: this.webToken
    };

    return output;
  }
}

module.exports = User;
