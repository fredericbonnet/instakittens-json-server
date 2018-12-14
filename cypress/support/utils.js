/*
 * Utilities.
 */

/**
 * Pick random element in array.
 *
 * @param array Array to pick element from
 * @param condition Optional predicate
 */
function getRandomElement(array, condition) {
  let index = Math.floor(Math.random() * array.length);
  while (condition && !condition(array[index])) {
    index = (index + 1) % array.length;
  }
  return array[index];
}

/**
 * Get an account of the given role.
 *
 * @param role Account role (e.g. admin, user)
 */
function getAccount(role) {
  return global.accounts.find(account => account.role === role);
}

/** Get user list */
function getUserList() {
  return global.db.users;
}

/** Get list of users having all three types of albums. */
function getUsersWithAlbums() {
  const typesPerUser = getAlbumList().reduce((acc, album) => {
    const { user_id, type } = album;
    acc[user_id] = [...(acc[user_id] || []), type];
    return acc;
  }, {});
  return Object.entries(typesPerUser)
    .filter(([userId, types]) => {
      return (
        types.includes('PUBLIC') &&
        types.includes('RESTRICTED') &&
        types.includes('PRIVATE')
      );
    })
    .map(([userId, types]) => getUser(userId));
}

/** Get user */
function getUser(id) {
  // JSON stringify/parse is the simplest way to deep clone an object.
  return JSON.parse(
    JSON.stringify(global.db.users.find(user => user.id == id))
  );
}

/** Get album list */
function getAlbumList() {
  return global.db.albums;
}

/** Get album */
function getAlbum(id) {
  // JSON stringify/parse is the simplest way to deep clone an object.
  return JSON.parse(
    JSON.stringify(global.db.albums.find(album => album.id == id))
  );
}

/** Get photo list */
function getPhotoList() {
  return global.db.photos;
}

/** Get photo */
function getPhoto(id) {
  // JSON stringify/parse is the simplest way to deep clone an object.
  return JSON.parse(
    JSON.stringify(global.db.photos.find(photo => photo.id == id))
  );
}

/** Get comment list */
function getCommentList() {
  return global.db.comments;
}

/** Get comment */
function getComment(id) {
  // JSON stringify/parse is the simplest way to deep clone an object.
  return JSON.parse(
    JSON.stringify(global.db.comments.find(comment => comment.id == id))
  );
}

module.exports = {
  getRandomElement,
  getAccount,
  getUserList,
  getUsersWithAlbums,
  getUser,
  getAlbumList,
  getAlbum,
  getPhotoList,
  getPhoto,
  getCommentList,
  getComment,
};
