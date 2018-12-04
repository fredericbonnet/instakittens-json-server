Feature: User access : Albums

  As a registered user
  I want to access the Albums

Background:
  Given I am a registered user
    And I am identified

Scenario: Getting the Album list
   When I get the Album list
   Then the operation is forbidden

Scenario: Reading an Album
  Given an existing Album Id "id"
   When I get the Album "id"
   Then the operation is forbidden

Scenario: Reading an unknown Album
  Given an unknown Album Id "id"
   When I get the Album "id"
   Then the operation is forbidden

Scenario: Creating an Album
  Given a new Album "new album" 
   When I create the Album "new album"
   Then the operation is forbidden

Scenario: Updating an Album
  Given an existing Album Id "id"
    And I get the Album "id"
   Then the operation is forbidden
  Given a new Album "updated album"
   When I update the Album "id" with "updated album" 
   Then the operation is forbidden
   When I get the Album "id"
   Then the operation is forbidden

Scenario: Updating an unknown Album 
  Given an unknown Album Id "id"
    And a new Album "updated album"
   When I update the Album "id" with "updated album" 
   Then the operation is forbidden

Scenario: Replacing an Album
  Given an existing Album Id "id"
    And I get the Album "id"
   Then the operation is forbidden
  Given a new Album "replaced album"
   When I replace the Album "id" with "replaced album" 
   Then the operation is forbidden
   When I get the Album "id"
   Then the operation is forbidden

Scenario: Replacing an unknown Album 
  Given an unknown Album Id "id"
    And a new Album "replaced album"
   When I replace the Album "id" with "replaced album" 
   Then the operation is forbidden

Scenario: Deleting an Album
  Given an existing Album Id "id"
    And I get the Album "id"
   Then the operation is forbidden
   When I delete the Album "id"
   Then the operation is forbidden
   When I get the Album "id"
   Then the operation is forbidden

Scenario: Deleting an unknown Album
  Given an unknown Album Id "id"
   When I delete the Album "id"
   Then the operation is forbidden
