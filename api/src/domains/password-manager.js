class PasswordManager {
  get Username() {
    return this.username;
  }
  set Username(username) {
    this.username = username;
  }

  get AccountName() {
    return this.account_name;
  }
  set AccountName(accountName) {
    this.account_name = accountName;
  }

  get Password() {
    return this.password;
  }
  set Password(password) {
    this.password = password;
  }

  get UserId() {
    return this.user_id;
  }
  set UserId(userId) {
    this.user_id = userId;
  }

  toString() {
    const output = {
      id: this.id,
      email: this.email,
      accountName: this.account_name,
      password: this.password,
      userId: this.user_id
    };

    return output;
  }
}

module.exports = PasswordManager;
