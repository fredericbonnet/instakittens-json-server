Feature: User access : User Album Photos

  As a registered user
  I want to access User Album Photos

Background:
  Given I am a registered user
    And I am identified
  Given a User Id "user id" with albums
   When I get the User "user id"
   Then I should get the User "user"
    And I open the User "user"
  Given an existing public Album Id "album id"
   When I get the Album "album id"
   Then I should get the Album "album"
    And I open the Album "album"

Scenario: Getting the Photo list
   When I get the Photo list
   Then I should get the complete Photo list

Scenario: Reading a Photo
  Given an existing Photo Id "id"
   When I get the Photo "id"
   Then I should get the Photo "photo"
  Given the Photo Id "id2" of the Photo "photo"
   Then the Id "id2" should equal the Id "id"
  Given the Album Id "album id2" of the Photo "photo"
   Then the Id "album id2" should equal the Id "album id"

Scenario: Reading an unknown Photo
  Given an unknown Photo Id "id"
   When I get the Photo "id"
   Then the resource should not be found

Scenario: Creating a Photo
  Given a new Photo "new photo" 
   When I create the Photo "new photo"
   Then the operation is forbidden

Scenario: Updating a Photo
  Given an existing Photo Id "id"
    And a new Photo "updated photo"
   When I update the Photo "id" with "updated photo" 
   Then the operation is forbidden

Scenario: Updating an unknown Photo 
  Given an unknown Photo Id "id"
    And a new Photo "updated photo"
   When I update the Photo "id" with "updated photo" 
   Then the operation is forbidden

Scenario: Replacing a Photo
  Given an existing Photo Id "id"
    And a new Photo "replaced photo"
   When I replace the Photo "id" with "replaced photo" 
   Then the operation is forbidden

Scenario: Replacing an unknown Photo 
  Given an unknown Photo Id "id"
    And a new Photo "replaced photo"
   When I replace the Photo "id" with "replaced photo" 
   Then the operation is forbidden

Scenario: Deleting a Photo
  Given an existing Photo Id "id"
   When I delete the Photo "id"
   Then the operation is forbidden

Scenario: Deleting an unknown Photo
  Given an unknown Photo Id "id"
   When I delete the Photo "id"
   Then the operation is forbidden
