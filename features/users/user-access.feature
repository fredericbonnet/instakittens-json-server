Feature: User access : Users

  As a registered user
  I want to access the Users

Background:
  Given I am a registered user
    And I am identified

Scenario: Getting the User list
   When I get the User list
   Then I should get the complete User list

Scenario: Reading a User
  Given an existing User Id "id"
   When I get the User "id"
   Then I should get the User "user"
  Given the User Id "id2" of the User "user"
   Then the User Id "id2" should equal the User Id "id"

Scenario: Reading an unknown User
  Given an unknown User Id "id"
   When I get the User "id"
   Then the resource should not be found

Scenario: Creating a User
  Given a new User "new user" 
   When I create the User "new user"
   Then the operation is forbidden

Scenario: Updating a User
  Given an existing User Id "id"
    And I get the User "id"
   Then I should get the User "user"
  Given a new User "updated user"
   When I update the User "id" with "updated user" 
   Then the operation is forbidden
   When I get the User "id"
   Then I should get the User "user2"
    And the User "user2" should equal the User "user"

Scenario: Updating an unknown User 
  Given an unknown User Id "id"
    And a new User "updated user"
   When I update the User "id" with "updated user" 
   Then the operation is forbidden

Scenario: Replacing a User
  Given an existing User Id "id"
    And I get the User "id"
   Then I should get the User "user"
  Given a new User "replaced user"
   When I replace the User "id" with "replaced user" 
   Then the operation is forbidden
   When I get the User "id"
   Then I should get the User "user2"
    And the User "user2" should equal the User "user"

Scenario: Replacing an unknown User 
  Given an unknown User Id "id"
    And a new User "replaced user"
   When I replace the User "id" with "replaced user" 
   Then the operation is forbidden

Scenario: Deleting a User
  Given an existing User Id "id"
    And I get the User "id"
   Then I should get the User "user"
   When I delete the User "id"
   Then the operation is forbidden
   When I get the User "id"
   Then I should get the User "user2"
    And the User "user2" should equal the User "user"

Scenario: Deleting an unknown User
  Given an unknown User Id "id"
   When I delete the User "id"
   Then the operation is forbidden
