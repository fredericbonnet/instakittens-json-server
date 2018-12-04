const { Then } = require('cucumber');

Then('the operation is unauthorized', async function() {
  this.response = await this.request.expect(401);
});
Then('the operation is forbidden', async function() {
  this.response = await this.request.expect(403);
});
Then('the operation fails', async function() {
  this.response = await this.request.expect(500);
});
Then('the resource should not be found', async function() {
  this.response = await this.request.expect(404);
});
Then('the resource should be deleted', async function() {
  this.response = await this.request.expect(200);
});
