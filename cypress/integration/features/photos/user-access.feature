Feature: User access : Photos

  As a registered user
  I want to access the Photos

Background:
  Given I am a registered user
    And I am identified

Scenario: Getting the Photo list
   When I get the Photo list
   Then the operation is forbidden

Scenario: Reading a Photo
  Given an existing Photo Id "id"
   When I get the Photo "id"
   Then the operation is forbidden

Scenario: Reading an unknown Photo
  Given an unknown Photo Id "id"
   When I get the Photo "id"
   Then the operation is forbidden

Scenario: Creating a Photo
  Given a new Photo "new photo" 
   When I create the Photo "new photo"
   Then the operation is forbidden

Scenario: Updating a Photo
  Given an existing Photo Id "id"
    And I get the Photo "id"
   Then the operation is forbidden
  Given a new Photo "updated photo"
   When I update the Photo "id" with "updated photo" 
   Then the operation is forbidden
   When I get the Photo "id"
   Then the operation is forbidden

Scenario: Updating an unknown Photo 
  Given an unknown Photo Id "id"
    And a new Photo "updated photo"
   When I update the Photo "id" with "updated photo" 
   Then the operation is forbidden

Scenario: Replacing a Photo
  Given an existing Photo Id "id"
    And I get the Photo "id"
   Then the operation is forbidden
  Given a new Photo "replaced photo"
   When I replace the Photo "id" with "replaced photo" 
   Then the operation is forbidden
   When I get the Photo "id"
   Then the operation is forbidden

Scenario: Replacing an unknown Photo 
  Given an unknown Photo Id "id"
    And a new Photo "replaced photo"
   When I replace the Photo "id" with "replaced photo" 
   Then the operation is forbidden

Scenario: Deleting a Photo
  Given an existing Photo Id "id"
    And I get the Photo "id"
   Then the operation is forbidden
   When I delete the Photo "id"
   Then the operation is forbidden
   When I get the Photo "id"
   Then the operation is forbidden

Scenario: Deleting an unknown Photo
  Given an unknown Photo Id "id"
   When I delete the Photo "id"
   Then the operation is forbidden
