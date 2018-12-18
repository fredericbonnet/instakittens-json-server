Feature: Public access : Comments

  As an anonymous user
  I want to access the Comments

Background:
  Given I am not identified

Scenario: Getting the Comment list
   When I get the Comment list
   Then the operation is unauthorized

Scenario: Reading a Comment
  Given an existing Comment Id "id"
   When I get the Comment "id"
   Then the operation is unauthorized

Scenario: Reading an unknown Comment
  Given an unknown Comment Id "id"
   When I get the Comment "id"
   Then the operation is unauthorized

Scenario: Creating a Comment
  Given a new Comment "new comment" 
   When I create the Comment "new comment"
   Then the operation is unauthorized

Scenario: Updating a Comment
  Given an existing Comment Id "id"
    And I get the Comment "id"
   Then the operation is unauthorized
  Given a new Comment "updated comment"
   When I update the Comment "id" with "updated comment" 
   Then the operation is unauthorized
   When I get the Comment "id"
   Then the operation is unauthorized

Scenario: Updating an unknown Comment 
  Given an unknown Comment Id "id"
    And a new Comment "updated comment"
   When I update the Comment "id" with "updated comment" 
   Then the operation is unauthorized

Scenario: Replacing a Comment
  Given an existing Comment Id "id"
    And I get the Comment "id"
   Then the operation is unauthorized
  Given a new Comment "replaced comment"
   When I replace the Comment "id" with "replaced comment" 
   Then the operation is unauthorized
   When I get the Comment "id"
   Then the operation is unauthorized

Scenario: Replacing an unknown Comment 
  Given an unknown Comment Id "id"
    And a new Comment "replaced comment"
   When I replace the Comment "id" with "replaced comment" 
   Then the operation is unauthorized

Scenario: Deleting a Comment
  Given an existing Comment Id "id"
    And I get the Comment "id"
   Then the operation is unauthorized
   When I delete the Comment "id"
   Then the operation is unauthorized
   When I get the Comment "id"
   Then the operation is unauthorized

Scenario: Deleting an unknown Comment
  Given an unknown Comment Id "id"
   When I delete the Comment "id"
   Then the operation is unauthorized
