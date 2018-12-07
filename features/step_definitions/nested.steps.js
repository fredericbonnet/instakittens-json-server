const { BeforeAll, Given } = require('cucumber');

const { getRandomElement, getUser, getAlbumList } = require('../../e2e/utils');

let parentUserList;
BeforeAll(function() {
  // Get list of users having all three types of albums.
  const typesPerUser = getAlbumList().reduce((acc, album) => {
    const { user_id, type } = album;
    acc[user_id] = [...(acc[user_id] || []), type];
    return acc;
  }, {});
  parentUserList = Object.entries(typesPerUser)
    .filter(([userId, types]) => {
      return (
        types.includes('PUBLIC') &&
        types.includes('RESTRICTED') &&
        types.includes('PRIVATE')
      );
    })
    .map(([userId, types]) => getUser(userId));
});

Given('a User Id {string} with albums', function(v) {
  const user = getRandomElement(
    parentUserList,
    user => !this.account || user.id !== this.account.userId
  );
  this.setVariable(v, user.id);
});

Given('I open the User {string}', function(v) {
  const user = this.getVariable(v);
  this.setParent('user_id', user);
});
Given('I open the Album {string}', function(v) {
  const album = this.getVariable(v);
  this.setParent('album_id', album);
});
Given('I open the Photo {string}', function(v) {
  const photo = this.getVariable(v);
  this.setParent('photo_id', photo);
});
