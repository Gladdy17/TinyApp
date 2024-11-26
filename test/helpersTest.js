const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.isObject(user, 'user is an object');
    assert.equal(user.id, expectedUserID, 'user ID matches expected ID');
  });
  it('should return null with an invalid email', function() {
    const user = getUserByEmail("nonemail@test.com, testingusers");
    assert.isNull(user, 'user is undefined');
  });
});