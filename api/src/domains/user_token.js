class UserToken {
  get Id() {
    return this.id;
  }
  set Id(id) {
    this.Id = id;
  }

  get UserId() {
    return this.userId;
  }

  set UserId(userId) {
    this.userId = userId;
  }

  toString() {
    const output = {
      Id: this.id,
      UserId: this.userId
    };

    return output;
  }
}

module.exports = UserToken;
