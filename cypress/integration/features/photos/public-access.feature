Feature: Public access : Photos

  As an anonymous user
  I want to access the Photos

Background:
  Given I am not identified

Scenario: Getting the Photo list
   When I get the Photo list
   Then the operation is unauthorized

Scenario: Reading a Photo
  Given an existing Photo Id "id"
   When I get the Photo "id"
   Then the operation is unauthorized

Scenario: Reading an unknown Photo
  Given an unknown Photo Id "id"
   When I get the Photo "id"
   Then the operation is unauthorized

Scenario: Creating a Photo
  Given a new Photo "new photo" 
   When I create the Photo "new photo"
   Then the operation is unauthorized

Scenario: Updating a Photo
  Given an existing Photo Id "id"
    And I get the Photo "id"
   Then the operation is unauthorized
  Given a new Photo "updated photo"
   When I update the Photo "id" with "updated photo" 
   Then the operation is unauthorized
   When I get the Photo "id"
   Then the operation is unauthorized

Scenario: Updating an unknown Photo 
  Given an unknown Photo Id "id"
    And a new Photo "updated photo"
   When I update the Photo "id" with "updated photo" 
   Then the operation is unauthorized

Scenario: Replacing a Photo
  Given an existing Photo Id "id"
    And I get the Photo "id"
   Then the operation is unauthorized
  Given a new Photo "replaced photo"
   When I replace the Photo "id" with "replaced photo" 
   Then the operation is unauthorized
   When I get the Photo "id"
   Then the operation is unauthorized

Scenario: Replacing an unknown Photo 
  Given an unknown Photo Id "id"
    And a new Photo "replaced photo"
   When I replace the Photo "id" with "replaced photo" 
   Then the operation is unauthorized

Scenario: Deleting a Photo
  Given an existing Photo Id "id"
    And I get the Photo "id"
   Then the operation is unauthorized
   When I delete the Photo "id"
   Then the operation is unauthorized
   When I get the Photo "id"
   Then the operation is unauthorized

Scenario: Deleting an unknown Photo
  Given an unknown Photo Id "id"
   When I delete the Photo "id"
   Then the operation is unauthorized
