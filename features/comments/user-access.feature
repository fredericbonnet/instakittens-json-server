Feature: User access : Comments

  As a registered user
  I want to access the Comments

Background:
  Given I am a registered user
    And I am identified

Scenario: Getting the Comment list
   When I get the Comment list
   Then the operation is forbidden

Scenario: Reading a Comment
  Given an existing Comment Id "id"
   When I get the Comment "id"
   Then the operation is forbidden

Scenario: Reading an unknown Comment
  Given an unknown Comment Id "id"
   When I get the Comment "id"
   Then the operation is forbidden

Scenario: Creating a Comment
  Given a new Comment "new comment" 
   When I create the Comment "new comment"
   Then the operation is forbidden

Scenario: Updating a Comment
  Given an existing Comment Id "id"
    And I get the Comment "id"
   Then the operation is forbidden
  Given a new Comment "updated comment"
   When I update the Comment "id" with "updated comment" 
   Then the operation is forbidden
   When I get the Comment "id"
   Then the operation is forbidden

Scenario: Updating an unknown Comment 
  Given an unknown Comment Id "id"
    And a new Comment "updated comment"
   When I update the Comment "id" with "updated comment" 
   Then the operation is forbidden

Scenario: Replacing a Comment
  Given an existing Comment Id "id"
    And I get the Comment "id"
   Then the operation is forbidden
  Given a new Comment "replaced comment"
   When I replace the Comment "id" with "replaced comment" 
   Then the operation is forbidden
   When I get the Comment "id"
   Then the operation is forbidden

Scenario: Replacing an unknown Comment 
  Given an unknown Comment Id "id"
    And a new Comment "replaced comment"
   When I replace the Comment "id" with "replaced comment" 
   Then the operation is forbidden

Scenario: Deleting a Comment
  Given an existing Comment Id "id"
    And I get the Comment "id"
   Then the operation is forbidden
   When I delete the Comment "id"
   Then the operation is forbidden
   When I get the Comment "id"
   Then the operation is forbidden

Scenario: Deleting an unknown Comment
  Given an unknown Comment Id "id"
   When I delete the Comment "id"
   Then the operation is forbidden
