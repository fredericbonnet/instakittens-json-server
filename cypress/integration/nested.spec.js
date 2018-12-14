/// <reference types="Cypress" />

const {
  getRandomElement,
  getAccount,
  getUsersWithAlbums,
  getAlbumList,
  getPhotoList,
  getCommentList,
} = require('../support/utils');

describe('Nested resources', () => {
  let userAccount;
  let adminAccount;
  let userOptions;
  let adminOptions;

  before(() => {
    // Get accounts and set authorization options.
    cy.fixture('test-accounts.json').then(accounts => {
      global.accounts = accounts;
      userAccount = getAccount('user');
      adminAccount = getAccount('admin');
      userOptions = {
        auth: userAccount,
      };
      adminOptions = {
        auth: adminAccount,
      };
    });

    // Get database.
    cy.task('db').then(db => (global.db = db));
  });

  describe('Albums', () => {
    let albumId;

    beforeEach(() => {
      // Select random album.
      albumId = getRandomElement(getAlbumList()).id;
    });

    describe('Photos', () => {
      let photoList;

      beforeEach(() => {
        photoList = getPhotoList().filter(photo => photo.album_id === albumId);
      });

      describe('GET /albums/:albumId/photos', () => {
        const method = 'GET';
        let url;

        beforeEach(() => {
          url = `/albums/${albumId}/photos`;
        });

        it('should be denied in anonymous mode', () => {
          cy.request({
            method,
            url,
            failOnStatusCode: false,
          }).then(response => {
            expect(response.status).to.eq(401);
          });
        });
        it('should be denied in user mode', () => {
          cy.request({
            ...userOptions,
            method,
            url,
            failOnStatusCode: false,
          }).then(response => {
            expect(response.status).to.eq(403);
          });
        });
        it('should retrieve album photo list in JSON format in admin mode', () => {
          cy.request({
            ...adminOptions,
            method,
            url,
          }).then(response => {
            expect(response.status).to.eq(200);
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['content-type']).to.match(
              /^application\/json;?/
            );
            expect(response.body).to.be.an('array');
            expect(response.body).to.have.lengthOf(photoList.length);
          });
        });
      });
    });
  });

  describe('Photos', () => {
    let photoId;

    beforeEach(() => {
      // Select random photo.
      photoId = getRandomElement(getPhotoList()).id;
    });

    describe('Comments', () => {
      let commentList;

      beforeEach(() => {
        commentList = getCommentList().filter(
          comment => comment.photo_id === photoId
        );
      });

      describe('GET /photos/:photoId/comments', () => {
        const method = 'GET';
        let url;

        beforeEach(() => {
          url = `/photos/${photoId}/comments`;
        });

        it('should be denied in anonymous mode', () => {
          cy.request({
            method,
            url,
            failOnStatusCode: false,
          }).then(response => {
            expect(response.status).to.eq(401);
          });
        });
        it('should be denied in user mode', () => {
          cy.request({
            ...userOptions,
            method,
            url,
            failOnStatusCode: false,
          }).then(response => {
            expect(response.status).to.eq(403);
          });
        });
        it('should retrieve photo comment list in JSON format in admin mode', () => {
          cy.request({
            ...adminOptions,
            method,
            url,
          }).then(response => {
            expect(response.status).to.eq(200);
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['content-type']).to.match(
              /^application\/json;?/
            );
            expect(response.body).to.be.an('array');
            expect(response.body).to.have.lengthOf(commentList.length);
          });
        });
      });
    });
  });

  describe('Users', () => {
    let userList;
    let userId;

    before(() => {
      userList = getUsersWithAlbums();
    });

    beforeEach(() => {
      // Select random user different from current one.
      userId = getRandomElement(
        userList,
        user => user.id !== userAccount.userId
      ).id;
    });

    describe('Albums', () => {
      let albumList;

      beforeEach(() => {
        albumList = getAlbumList().filter(album => album.user_id === userId);
      });

      describe('GET /users/:userId/albums', () => {
        const method = 'GET';
        let url;

        beforeEach(() => {
          url = `/users/${userId}/albums`;
        });

        it('should retrieve user album list in JSON format', () => {
          cy.request({
            method,
            url,
          }).then(response => {
            expect(response.status).to.eq(200);
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['content-type']).to.match(
              /^application\/json;?/
            );
            expect(response.body).to.be.an('array');
            expect(response.body).to.have.lengthOf(albumList.length);
          });
        });
      });

      describe('Public albums', () => {
        let albumId;

        beforeEach(() => {
          // Select random public album.
          albumId = getRandomElement(
            albumList.filter(album => album.type === 'PUBLIC')
          ).id;
        });

        describe('GET /users/:userId/albums/:albumId', () => {
          const method = 'GET';
          let url;

          beforeEach(() => {
            url = `/users/${userId}/albums/${albumId}`;
          });

          it('should retrieve user album in JSON format', () => {
            cy.request({
              method,
              url,
            }).then(response => {
              expect(response.status).to.eq(200);
              expect(response.headers).to.have.property('content-type');
              expect(response.headers['content-type']).to.match(
                /^application\/json;?/
              );
              expect(response.body).to.be.an('object');
              expect(response.body.id).to.equal(albumId);
            });
          });

          describe('Photos', () => {
            let photoList;
            let photoId;

            beforeEach(() => {
              // Select random photo.
              photoList = getPhotoList().filter(
                photo => photo.album_id === albumId
              );
              photoId = getRandomElement(photoList).id;
            });

            describe('GET /users/:userId/albums/:albumId/photos', () => {
              const method = 'GET';
              let url;

              beforeEach(() => {
                url = `/users/${userId}/albums/${albumId}/photos`;
              });

              it('should retrieve user album photo list in JSON format', () => {
                cy.request({
                  method,
                  url,
                }).then(response => {
                  expect(response.status).to.eq(200);
                  expect(response.headers).to.have.property('content-type');
                  expect(response.headers['content-type']).to.match(
                    /^application\/json;?/
                  );
                  expect(response.body).to.be.an('array');
                  expect(response.body).to.have.lengthOf(photoList.length);
                });
              });
            });

            describe('GET /users/:userId/albums/:albumId/photos/:photoId', () => {
              const method = 'GET';
              let url;

              beforeEach(() => {
                url = `/users/${userId}/albums/${albumId}/photos/${photoId}`;
              });

              it('should retrieve user album photo in JSON format', () => {
                cy.request({
                  method,
                  url,
                }).then(response => {
                  expect(response.status).to.eq(200);
                  expect(response.headers).to.have.property('content-type');
                  expect(response.headers['content-type']).to.match(
                    /^application\/json;?/
                  );
                  expect(response.body).to.be.an('object');
                  expect(response.body.id).to.equal(photoId);
                });
              });
            });

            describe('Comments', () => {
              let commentList;
              let commentId;

              beforeEach(() => {
                // Select random comment.
                commentList = getCommentList().filter(
                  comment => comment.photo_id === photoId
                );
                commentId = getRandomElement(commentList).id;
              });

              describe('GET /users/:userId/albums/:albumId/photos/:photoId/comments', () => {
                const method = 'GET';
                let url;

                beforeEach(() => {
                  url = `/users/${userId}/albums/${albumId}/photos/${photoId}/comments`;
                });

                it('should retrieve user album photo comment list in JSON format', () => {
                  cy.request({
                    method,
                    url,
                  }).then(response => {
                    expect(response.status).to.eq(200);
                    expect(response.headers).to.have.property('content-type');
                    expect(response.headers['content-type']).to.match(
                      /^application\/json;?/
                    );
                    expect(response.body).to.be.an('array');
                    expect(response.body).to.have.lengthOf(commentList.length);
                  });
                });
              });

              describe('GET /users/:userId/albums/:albumId/photos/:photoId/comments/:commentId', () => {
                const method = 'GET';
                let url;

                beforeEach(() => {
                  url = `/users/${userId}/albums/${albumId}/photos/${photoId}/comments/${commentId}`;
                });

                it('should retrieve user album photo comment in JSON format', () => {
                  cy.request({
                    method,
                    url,
                  }).then(response => {
                    expect(response.status).to.eq(200);
                    expect(response.headers).to.have.property('content-type');
                    expect(response.headers['content-type']).to.match(
                      /^application\/json;?/
                    );
                    expect(response.body).to.be.an('object');
                    expect(response.body.id).to.equal(commentId);
                  });
                });
              });
            });
          });
        });
      });

      describe('Restricted albums', () => {
        let albumId;

        beforeEach(() => {
          // Select random public album.
          albumId = getRandomElement(
            albumList.filter(album => album.type === 'RESTRICTED')
          ).id;
        });

        describe('GET /users/:userId/albums/:albumId', () => {
          const method = 'GET';
          let url;

          beforeEach(() => {
            url = `/users/${userId}/albums/${albumId}`;
          });

          it('should be denied in anonymous mode', () => {
            cy.request({
              method,
              url,
              failOnStatusCode: false,
            }).then(response => {
              expect(response.status).to.eq(401);
            });
          });
          it('should retrieve user album in JSON format in user mode', () => {
            cy.request({
              ...userOptions,
              method,
              url,
            }).then(response => {
              expect(response.status).to.eq(200);
              expect(response.headers).to.have.property('content-type');
              expect(response.headers['content-type']).to.match(
                /^application\/json;?/
              );
              expect(response.body).to.be.an('object');
              expect(response.body.id).to.equal(albumId);
            });
          });

          describe('Photos', () => {
            let photoList;
            let photoId;

            beforeEach(() => {
              // Select random photo.
              photoList = getPhotoList().filter(
                photo => photo.album_id === albumId
              );
              photoId = getRandomElement(photoList).id;
            });

            describe('GET /users/:userId/albums/:albumId/photos', () => {
              const method = 'GET';
              let url;

              beforeEach(() => {
                url = `/users/${userId}/albums/${albumId}/photos`;
              });

              it('should be denied in anonymous mode', () => {
                cy.request({
                  method,
                  url,
                  failOnStatusCode: false,
                }).then(response => {
                  expect(response.status).to.eq(401);
                });
              });
              it('should retrieve user album photo list in JSON format in user mode', () => {
                cy.request({
                  ...userOptions,
                  method,
                  url,
                }).then(response => {
                  expect(response.status).to.eq(200);
                  expect(response.headers).to.have.property('content-type');
                  expect(response.headers['content-type']).to.match(
                    /^application\/json;?/
                  );
                  expect(response.body).to.be.an('array');
                  expect(response.body).to.have.lengthOf(photoList.length);
                });
              });
            });

            describe('GET /users/:userId/albums/:albumId/photos/:photoId', () => {
              const method = 'GET';
              let url;

              beforeEach(() => {
                url = `/users/${userId}/albums/${albumId}/photos/${photoId}`;
              });

              it('should be denied in anonymous mode', () => {
                cy.request({
                  method,
                  url,
                  failOnStatusCode: false,
                }).then(response => {
                  expect(response.status).to.eq(401);
                });
              });
              it('should retrieve user album photo in JSON format in user mode', () => {
                cy.request({
                  ...userOptions,
                  method,
                  url,
                }).then(response => {
                  expect(response.status).to.eq(200);
                  expect(response.headers).to.have.property('content-type');
                  expect(response.headers['content-type']).to.match(
                    /^application\/json;?/
                  );
                  expect(response.body).to.be.an('object');
                  expect(response.body.id).to.equal(photoId);
                });
              });
            });

            describe('Comments', () => {
              let commentList;
              let commentId;

              beforeEach(() => {
                // Select random comment.
                commentList = getCommentList().filter(
                  comment => comment.photo_id === photoId
                );
                commentId = getRandomElement(commentList).id;
              });

              describe('GET /users/:userId/albums/:albumId/photos/:photoId/comments', () => {
                const method = 'GET';
                let url;

                beforeEach(() => {
                  url = `/users/${userId}/albums/${albumId}/photos/${photoId}/comments`;
                });

                it('should be denied in anonymous mode', () => {
                  cy.request({
                    method,
                    url,
                    failOnStatusCode: false,
                  }).then(response => {
                    expect(response.status).to.eq(401);
                  });
                });
                it('should retrieve user album photo comment list in JSON format in user mode', () => {
                  cy.request({
                    ...userOptions,
                    method,
                    url,
                  }).then(response => {
                    expect(response.status).to.eq(200);
                    expect(response.headers).to.have.property('content-type');
                    expect(response.headers['content-type']).to.match(
                      /^application\/json;?/
                    );
                    expect(response.body).to.be.an('array');
                    expect(response.body).to.have.lengthOf(commentList.length);
                  });
                });
              });

              describe('GET /users/:userId/albums/:albumId/photos/:photoId/comments/:commentId', () => {
                const method = 'GET';
                let url;

                beforeEach(() => {
                  url = `/users/${userId}/albums/${albumId}/photos/${photoId}/comments/${commentId}`;
                });

                it('should be denied in anonymous mode', () => {
                  cy.request({
                    method,
                    url,
                    failOnStatusCode: false,
                  }).then(response => {
                    expect(response.status).to.eq(401);
                  });
                });
                it('should retrieve user album photo comment in JSON format in user mode', () => {
                  cy.request({
                    ...userOptions,
                    method,
                    url,
                  }).then(response => {
                    expect(response.status).to.eq(200);
                    expect(response.headers).to.have.property('content-type');
                    expect(response.headers['content-type']).to.match(
                      /^application\/json;?/
                    );
                    expect(response.body).to.be.an('object');
                    expect(response.body.id).to.equal(commentId);
                  });
                });
              });
            });
          });
        });
      });

      describe('Private albums', () => {
        let albumId;

        beforeEach(() => {
          // Select random public album.
          albumId = getRandomElement(
            albumList.filter(album => album.type === 'PRIVATE')
          ).id;
        });

        describe('GET /users/:userId/albums/:albumId', () => {
          const method = 'GET';
          let url;

          beforeEach(() => {
            url = `/users/${userId}/albums/${albumId}`;
          });

          it('should be denied in anonymous mode', () => {
            cy.request({
              method,
              url,
              failOnStatusCode: false,
            }).then(response => {
              expect(response.status).to.eq(401);
            });
          });
          it('should be denied in user mode', () => {
            cy.request({
              ...userOptions,
              method,
              url,
              failOnStatusCode: false,
            }).then(response => {
              expect(response.status).to.eq(403);
            });
          });
          it('should retrieve user album in JSON format in admin mode', () => {
            cy.request({
              ...adminOptions,
              method,
              url,
            }).then(response => {
              expect(response.status).to.eq(200);
              expect(response.headers).to.have.property('content-type');
              expect(response.headers['content-type']).to.match(
                /^application\/json;?/
              );
              expect(response.body).to.be.an('object');
              expect(response.body.id).to.equal(albumId);
            });
          });

          describe('Photos', () => {
            let photoList;
            let photoId;

            beforeEach(() => {
              // Select random photo.
              photoList = getPhotoList().filter(
                photo => photo.album_id === albumId
              );
              photoId = getRandomElement(photoList).id;
            });

            describe('GET /users/:userId/albums/:albumId/photos', () => {
              const method = 'GET';
              let url;

              beforeEach(() => {
                url = `/users/${userId}/albums/${albumId}/photos`;
              });

              it('should be denied in anonymous mode', () => {
                cy.request({
                  method,
                  url,
                  failOnStatusCode: false,
                }).then(response => {
                  expect(response.status).to.eq(401);
                });
              });
              it('should be denied in user mode', () => {
                cy.request({
                  ...userOptions,
                  method,
                  url,
                  failOnStatusCode: false,
                }).then(response => {
                  expect(response.status).to.eq(403);
                });
              });
              it('should retrieve user album photo list in JSON format in admin mode', () => {
                cy.request({
                  ...adminOptions,
                  method,
                  url,
                }).then(response => {
                  expect(response.status).to.eq(200);
                  expect(response.headers).to.have.property('content-type');
                  expect(response.headers['content-type']).to.match(
                    /^application\/json;?/
                  );
                  expect(response.body).to.be.an('array');
                  expect(response.body).to.have.lengthOf(photoList.length);
                });
              });
            });

            describe('GET /users/:userId/albums/:albumId/photos/:photoId', () => {
              const method = 'GET';
              let url;

              beforeEach(() => {
                url = `/users/${userId}/albums/${albumId}/photos/${photoId}`;
              });

              it('should be denied in anonymous mode', () => {
                cy.request({
                  method,
                  url,
                  failOnStatusCode: false,
                }).then(response => {
                  expect(response.status).to.eq(401);
                });
              });
              it('should be denied in user mode', () => {
                cy.request({
                  ...userOptions,
                  method,
                  url,
                  failOnStatusCode: false,
                }).then(response => {
                  expect(response.status).to.eq(403);
                });
              });
              it('should retrieve user album photo in JSON format in admin mode', () => {
                cy.request({
                  ...adminOptions,
                  method,
                  url,
                }).then(response => {
                  expect(response.status).to.eq(200);
                  expect(response.headers).to.have.property('content-type');
                  expect(response.headers['content-type']).to.match(
                    /^application\/json;?/
                  );
                  expect(response.body).to.be.an('object');
                  expect(response.body.id).to.equal(photoId);
                });
              });
            });

            describe('Comments', () => {
              let commentList;
              let commentId;

              beforeEach(() => {
                // Select random comment.
                commentList = getCommentList().filter(
                  comment => comment.photo_id === photoId
                );
                commentId = getRandomElement(commentList).id;
              });

              describe('GET /users/:userId/albums/:albumId/photos/:photoId/comments', () => {
                const method = 'GET';
                let url;

                beforeEach(() => {
                  url = `/users/${userId}/albums/${albumId}/photos/${photoId}/comments`;
                });

                it('should be denied in anonymous mode', () => {
                  cy.request({
                    method,
                    url,
                    failOnStatusCode: false,
                  }).then(response => {
                    expect(response.status).to.eq(401);
                  });
                });
                it('should be denied in user mode', () => {
                  cy.request({
                    ...userOptions,
                    method,
                    url,
                    failOnStatusCode: false,
                  }).then(response => {
                    expect(response.status).to.eq(403);
                  });
                });
                it('should retrieve user album photo comment list in JSON format in admin mode', () => {
                  cy.request({
                    ...adminOptions,
                    method,
                    url,
                  }).then(response => {
                    expect(response.status).to.eq(200);
                    expect(response.headers).to.have.property('content-type');
                    expect(response.headers['content-type']).to.match(
                      /^application\/json;?/
                    );
                    expect(response.body).to.be.an('array');
                    expect(response.body).to.have.lengthOf(commentList.length);
                  });
                });
              });

              describe('GET /users/:userId/albums/:albumId/photos/:photoId/comments/:commentId', () => {
                const method = 'GET';
                let url;

                beforeEach(() => {
                  url = `/users/${userId}/albums/${albumId}/photos/${photoId}/comments/${commentId}`;
                });

                it('should be denied in anonymous mode', () => {
                  cy.request({
                    method,
                    url,
                    failOnStatusCode: false,
                  }).then(response => {
                    expect(response.status).to.eq(401);
                  });
                });
                it('should be denied in user mode', () => {
                  cy.request({
                    ...userOptions,
                    method,
                    url,
                    failOnStatusCode: false,
                  }).then(response => {
                    expect(response.status).to.eq(403);
                  });
                });
                it('should retrieve user album photo comment in JSON format in admin mode', () => {
                  cy.request({
                    ...adminOptions,
                    method,
                    url,
                  }).then(response => {
                    expect(response.status).to.eq(200);
                    expect(response.headers).to.have.property('content-type');
                    expect(response.headers['content-type']).to.match(
                      /^application\/json;?/
                    );
                    expect(response.body).to.be.an('object');
                    expect(response.body.id).to.equal(commentId);
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('Comments', () => {
      let commentList;
      let commentId;

      beforeEach(() => {
        // Select random comment.
        commentList = getCommentList().filter(
          comment => comment.user_id === userId
        );
        commentId = getRandomElement(commentList).id;
      });

      describe('GET /users/:userId/comments', () => {
        const method = 'GET';
        let url;

        beforeEach(() => {
          url = `/users/${userId}/comments`;
        });

        it('should retrieve user comment list in JSON format', () => {
          cy.request({
            method,
            url,
          }).then(response => {
            expect(response.status).to.eq(200);
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['content-type']).to.match(
              /^application\/json;?/
            );
            expect(response.body).to.be.an('array');
            expect(response.body).to.have.lengthOf(commentList.length);
          });
        });
      });

      describe('GET /users/:userId/comments/:commentId', () => {
        const method = 'GET';
        let url;

        beforeEach(() => {
          url = `/users/${userId}/comments/${commentId}`;
        });

        it('should retrieve user comment in JSON format', () => {
          cy.request({
            method,
            url,
          }).then(response => {
            expect(response.status).to.eq(200);
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['content-type']).to.match(
              /^application\/json;?/
            );
            expect(response.body).to.be.an('object');
            expect(response.body.id).to.equal(commentId);
          });
        });
      });
    });
  });

  describe('Me', () => {
    const method = 'GET';
    let userId;

    beforeEach(() => {
      // Select current user.
      userId = userAccount.userId;
    });

    it('should be denied in anonymous mode', () => {
      cy.request({
        method,
        url: '/me',
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(401);
      });
    });
    it('should retrieve current user in JSON format', () => {
      cy.request({
        ...userOptions,
        method,
        url: '/me',
      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.headers).to.have.property('content-type');
        expect(response.headers['content-type']).to.match(
          /^application\/json;?/
        );
        expect(response.body).to.be.an('object');
        expect(response.body.id).to.equal(userId);
      });
    });
    it('should be unavailable in admin mode', () => {
      cy.request({
        ...adminOptions,
        method,
        url: '/me',
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(404);
      });
    });

    describe('Albums', () => {
      let albumList;

      beforeEach(() => {
        albumList = getAlbumList().filter(album => album.user_id === userId);
      });

      describe('GET /me/albums', () => {
        const method = 'GET';
        let url;

        beforeEach(() => {
          url = `/me/albums`;
        });

        it('should retrieve user album list in JSON format in user mode', () => {
          cy.request({
            ...userOptions,
            method,
            url,
          }).then(response => {
            expect(response.status).to.eq(200);
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['content-type']).to.match(
              /^application\/json;?/
            );
            expect(response.body).to.be.an('array');
            expect(response.body).to.have.lengthOf(albumList.length);
          });
        });
      });

      describe('Public albums', () => {
        let albumId;

        beforeEach(() => {
          // Select random public album.
          albumId = getRandomElement(
            albumList.filter(album => album.type === 'PUBLIC')
          ).id;
        });

        describe('GET /me/albums/:albumId', () => {
          const method = 'GET';
          let url;

          beforeEach(() => {
            url = `/me/albums/${albumId}`;
          });

          it('should retrieve user album in JSON format in user mode', () => {
            cy.request({
              ...userOptions,
              method,
              url,
            }).then(response => {
              expect(response.status).to.eq(200);
              expect(response.headers).to.have.property('content-type');
              expect(response.headers['content-type']).to.match(
                /^application\/json;?/
              );
              expect(response.body).to.be.an('object');
              expect(response.body.id).to.equal(albumId);
            });
          });

          describe('Photos', () => {
            let photoList;
            let photoId;

            beforeEach(() => {
              // Select random photo.
              photoList = getPhotoList().filter(
                photo => photo.album_id === albumId
              );
              photoId = getRandomElement(photoList).id;
            });

            describe('GET /me/albums/:albumId/photos', () => {
              const method = 'GET';
              let url;

              beforeEach(() => {
                url = `/me/albums/${albumId}/photos`;
              });

              it('should retrieve user album photo list in JSON format in user mode', () => {
                cy.request({
                  ...userOptions,
                  method,
                  url,
                }).then(response => {
                  expect(response.status).to.eq(200);
                  expect(response.headers).to.have.property('content-type');
                  expect(response.headers['content-type']).to.match(
                    /^application\/json;?/
                  );
                  expect(response.body).to.be.an('array');
                  expect(response.body).to.have.lengthOf(photoList.length);
                });
              });
            });

            describe('GET /me/albums/:albumId/photos/:photoId', () => {
              const method = 'GET';
              let url;

              beforeEach(() => {
                url = `/me/albums/${albumId}/photos/${photoId}`;
              });

              it('should retrieve user album photo in JSON format in user mode', () => {
                cy.request({
                  ...userOptions,
                  method,
                  url,
                }).then(response => {
                  expect(response.status).to.eq(200);
                  expect(response.headers).to.have.property('content-type');
                  expect(response.headers['content-type']).to.match(
                    /^application\/json;?/
                  );
                  expect(response.body).to.be.an('object');
                  expect(response.body.id).to.equal(photoId);
                });
              });
            });

            describe('Comments', () => {
              let commentList;
              let commentId;

              beforeEach(() => {
                // Select random comment.
                commentList = getCommentList().filter(
                  comment => comment.photo_id === photoId
                );
                commentId = getRandomElement(commentList).id;
              });

              describe('GET /me/albums/:albumId/photos/:photoId/comments', () => {
                const method = 'GET';
                let url;

                beforeEach(() => {
                  url = `/me/albums/${albumId}/photos/${photoId}/comments`;
                });

                it('should retrieve user album photo comment list in JSON format in user mode', () => {
                  cy.request({
                    ...userOptions,
                    method,
                    url,
                  }).then(response => {
                    expect(response.status).to.eq(200);
                    expect(response.headers).to.have.property('content-type');
                    expect(response.headers['content-type']).to.match(
                      /^application\/json;?/
                    );
                    expect(response.body).to.be.an('array');
                    expect(response.body).to.have.lengthOf(commentList.length);
                  });
                });
              });

              describe('GET /me/albums/:albumId/photos/:photoId/comments/:commentId', () => {
                const method = 'GET';
                let url;

                beforeEach(() => {
                  url = `/me/albums/${albumId}/photos/${photoId}/comments/${commentId}`;
                });

                it('should retrieve user album photo comment in JSON format in user mode', () => {
                  cy.request({
                    ...userOptions,
                    method,
                    url,
                  }).then(response => {
                    expect(response.status).to.eq(200);
                    expect(response.headers).to.have.property('content-type');
                    expect(response.headers['content-type']).to.match(
                      /^application\/json;?/
                    );
                    expect(response.body).to.be.an('object');
                    expect(response.body.id).to.equal(commentId);
                  });
                });
              });
            });
          });
        });
      });

      describe('Restricted albums', () => {
        let albumId;

        beforeEach(() => {
          // Select random public album.
          albumId = getRandomElement(
            albumList.filter(album => album.type === 'RESTRICTED')
          ).id;
        });

        describe('GET /me/albums/:albumId', () => {
          const method = 'GET';
          let url;

          beforeEach(() => {
            url = `/me/albums/${albumId}`;
          });

          it('should retrieve user album in JSON format in user mode', () => {
            cy.request({
              ...userOptions,
              method,
              url,
            }).then(response => {
              expect(response.status).to.eq(200);
              expect(response.headers).to.have.property('content-type');
              expect(response.headers['content-type']).to.match(
                /^application\/json;?/
              );
              expect(response.body).to.be.an('object');
              expect(response.body.id).to.equal(albumId);
            });
          });

          describe('Photos', () => {
            let photoList;
            let photoId;

            beforeEach(() => {
              // Select random photo.
              photoList = getPhotoList().filter(
                photo => photo.album_id === albumId
              );
              photoId = getRandomElement(photoList).id;
            });

            describe('GET /me/albums/:albumId/photos', () => {
              const method = 'GET';
              let url;

              beforeEach(() => {
                url = `/me/albums/${albumId}/photos`;
              });

              it('should retrieve user album photo list in JSON format in user mode', () => {
                cy.request({
                  ...userOptions,
                  method,
                  url,
                }).then(response => {
                  expect(response.status).to.eq(200);
                  expect(response.headers).to.have.property('content-type');
                  expect(response.headers['content-type']).to.match(
                    /^application\/json;?/
                  );
                  expect(response.body).to.be.an('array');
                  expect(response.body).to.have.lengthOf(photoList.length);
                });
              });
            });

            describe('GET /me/albums/:albumId/photos/:photoId', () => {
              const method = 'GET';
              let url;

              beforeEach(() => {
                url = `/me/albums/${albumId}/photos/${photoId}`;
              });

              it('should retrieve user album photo in JSON format in user mode', () => {
                cy.request({
                  ...userOptions,
                  method,
                  url,
                }).then(response => {
                  expect(response.status).to.eq(200);
                  expect(response.headers).to.have.property('content-type');
                  expect(response.headers['content-type']).to.match(
                    /^application\/json;?/
                  );
                  expect(response.body).to.be.an('object');
                  expect(response.body.id).to.equal(photoId);
                });
              });
            });

            describe('Comments', () => {
              let commentList;
              let commentId;

              beforeEach(() => {
                // Select random comment.
                commentList = getCommentList().filter(
                  comment => comment.photo_id === photoId
                );
                commentId = getRandomElement(commentList).id;
              });

              describe('GET /me/albums/:albumId/photos/:photoId/comments', () => {
                const method = 'GET';
                let url;

                beforeEach(() => {
                  url = `/me/albums/${albumId}/photos/${photoId}/comments`;
                });

                it('should retrieve user album photo comment list in JSON format in user mode', () => {
                  cy.request({
                    ...userOptions,
                    method,
                    url,
                  }).then(response => {
                    expect(response.status).to.eq(200);
                    expect(response.headers).to.have.property('content-type');
                    expect(response.headers['content-type']).to.match(
                      /^application\/json;?/
                    );
                    expect(response.body).to.be.an('array');
                    expect(response.body).to.have.lengthOf(commentList.length);
                  });
                });
              });

              describe('GET /me/albums/:albumId/photos/:photoId/comments/:commentId', () => {
                const method = 'GET';
                let url;

                beforeEach(() => {
                  url = `/me/albums/${albumId}/photos/${photoId}/comments/${commentId}`;
                });

                it('should retrieve user album photo comment in JSON format in user mode', () => {
                  cy.request({
                    ...userOptions,
                    method,
                    url,
                  }).then(response => {
                    expect(response.status).to.eq(200);
                    expect(response.headers).to.have.property('content-type');
                    expect(response.headers['content-type']).to.match(
                      /^application\/json;?/
                    );
                    expect(response.body).to.be.an('object');
                    expect(response.body.id).to.equal(commentId);
                  });
                });
              });
            });
          });
        });
      });

      describe('Private albums', () => {
        let albumId;

        beforeEach(() => {
          // Select random public album.
          albumId = getRandomElement(
            albumList.filter(album => album.type === 'PRIVATE')
          ).id;
        });

        describe('GET /me/albums/:albumId', () => {
          const method = 'GET';
          let url;

          beforeEach(() => {
            url = `/me/albums/${albumId}`;
          });

          it('should retrieve user album in JSON format in user mode', () => {
            cy.request({
              ...userOptions,
              method,
              url,
            }).then(response => {
              expect(response.status).to.eq(200);
              expect(response.headers).to.have.property('content-type');
              expect(response.headers['content-type']).to.match(
                /^application\/json;?/
              );
              expect(response.body).to.be.an('object');
              expect(response.body.id).to.equal(albumId);
            });
          });

          describe('Photos', () => {
            let photoList;
            let photoId;

            beforeEach(() => {
              // Select random photo.
              photoList = getPhotoList().filter(
                photo => photo.album_id === albumId
              );
              photoId = getRandomElement(photoList).id;
            });

            describe('GET /me/albums/:albumId/photos', () => {
              const method = 'GET';
              let url;

              beforeEach(() => {
                url = `/me/albums/${albumId}/photos`;
              });

              it('should retrieve user album photo list in JSON format in user mode', () => {
                cy.request({
                  ...userOptions,
                  method,
                  url,
                }).then(response => {
                  expect(response.status).to.eq(200);
                  expect(response.headers).to.have.property('content-type');
                  expect(response.headers['content-type']).to.match(
                    /^application\/json;?/
                  );
                  expect(response.body).to.be.an('array');
                  expect(response.body).to.have.lengthOf(photoList.length);
                });
              });
            });

            describe('GET /me/albums/:albumId/photos/:photoId', () => {
              const method = 'GET';
              let url;

              beforeEach(() => {
                url = `/me/albums/${albumId}/photos/${photoId}`;
              });

              it('should retrieve user album photo in JSON format in user mode', () => {
                cy.request({
                  ...userOptions,
                  method,
                  url,
                }).then(response => {
                  expect(response.status).to.eq(200);
                  expect(response.headers).to.have.property('content-type');
                  expect(response.headers['content-type']).to.match(
                    /^application\/json;?/
                  );
                  expect(response.body).to.be.an('object');
                  expect(response.body.id).to.equal(photoId);
                });
              });
            });

            describe('Comments', () => {
              let commentList;
              let commentId;

              beforeEach(() => {
                // Select random comment.
                commentList = getCommentList().filter(
                  comment => comment.photo_id === photoId
                );
                commentId = getRandomElement(commentList).id;
              });

              describe('GET /me/albums/:albumId/photos/:photoId/comments', () => {
                const method = 'GET';
                let url;

                beforeEach(() => {
                  url = `/me/albums/${albumId}/photos/${photoId}/comments`;
                });

                it('should retrieve user album photo comment list in JSON format in user mode', () => {
                  cy.request({
                    ...userOptions,
                    method,
                    url,
                  }).then(response => {
                    expect(response.status).to.eq(200);
                    expect(response.headers).to.have.property('content-type');
                    expect(response.headers['content-type']).to.match(
                      /^application\/json;?/
                    );
                    expect(response.body).to.be.an('array');
                    expect(response.body).to.have.lengthOf(commentList.length);
                  });
                });
              });

              describe('GET /me/albums/:albumId/photos/:photoId/comments/:commentId', () => {
                const method = 'GET';
                let url;

                beforeEach(() => {
                  url = `/me/albums/${albumId}/photos/${photoId}/comments/${commentId}`;
                });

                it('should retrieve user album photo comment in JSON format in user mode', () => {
                  cy.request({
                    ...userOptions,
                    method,
                    url,
                  }).then(response => {
                    expect(response.status).to.eq(200);
                    expect(response.headers).to.have.property('content-type');
                    expect(response.headers['content-type']).to.match(
                      /^application\/json;?/
                    );
                    expect(response.body).to.be.an('object');
                    expect(response.body.id).to.equal(commentId);
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('Comments', () => {
      let commentList;
      let commentId;

      beforeEach(() => {
        // Select random comment.
        commentList = getCommentList().filter(
          comment => comment.user_id === userId
        );
        commentId = getRandomElement(commentList).id;
      });

      describe('GET /me/comments', () => {
        const method = 'GET';
        let url;

        beforeEach(() => {
          url = `/me/comments`;
        });

        it('should retrieve user comment list in JSON format in user mode', () => {
          cy.request({
            ...userOptions,
            method,
            url,
          }).then(response => {
            expect(response.status).to.eq(200);
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['content-type']).to.match(
              /^application\/json;?/
            );
            expect(response.body).to.be.an('array');
            expect(response.body).to.have.lengthOf(commentList.length);
          });
        });
      });

      describe('GET /me/comments/:commentId', () => {
        const method = 'GET';
        let url;

        beforeEach(() => {
          url = `/me/comments/${commentId}`;
        });

        it('should retrieve user comment in JSON format in user mode', () => {
          cy.request({
            ...userOptions,
            method,
            url,
          }).then(response => {
            expect(response.status).to.eq(200);
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['content-type']).to.match(
              /^application\/json;?/
            );
            expect(response.body).to.be.an('object');
            expect(response.body.id).to.equal(commentId);
          });
        });
      });
    });
  });
});
