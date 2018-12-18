Feature: User access : User Comments

  As a registered user
  I want to access the User Comments

Background:
  Given I am a registered user
    And I am identified
  Given an existing User Id "user id"
   When I get the User "user id"
   Then I should get the User "user"
    And I open the User "user"

Scenario: Getting the Comment list
   When I get the Comment list
   Then I should get the complete Comment list

Scenario: Reading a Comment
  Given an existing Comment Id "id"
   When I get the Comment "id"
   Then I should get the Comment "comment"
  Given the Comment Id "id2" of the Comment "comment"
   Then the Id "id2" should equal the Id "id"
  Given the User Id "user id2" of the Comment "comment"
   Then the Id "user id2" should equal the Id "user id"

Scenario: Reading an unknown Comment
  Given an unknown Comment Id "id"
   When I get the Comment "id"
   Then the resource should not be found

Scenario: Creating a Comment
  Given a new Comment "new comment" 
   When I create the Comment "new comment"
   Then the operation is forbidden

Scenario: Updating a Comment
  Given an existing Comment Id "id"
    And a new Comment "updated comment"
   When I update the Comment "id" with "updated comment" 
   Then the operation is forbidden

Scenario: Updating an unknown Comment 
  Given an unknown Comment Id "id"
    And a new Comment "updated comment"
   When I update the Comment "id" with "updated comment" 
   Then the operation is forbidden

Scenario: Replacing a Comment
  Given an existing Comment Id "id"
    And a new Comment "replaced comment"
   When I replace the Comment "id" with "replaced comment" 
   Then the operation is forbidden

Scenario: Replacing an unknown Comment 
  Given an unknown Comment Id "id"
    And a new Comment "replaced comment"
   When I replace the Comment "id" with "replaced comment" 
   Then the operation is forbidden

Scenario: Deleting a Comment
  Given an existing Comment Id "id"
   When I delete the Comment "id"
   Then the operation is forbidden

Scenario: Deleting an unknown Comment
  Given an unknown Comment Id "id"
   When I delete the Comment "id"
   Then the operation is forbidden
