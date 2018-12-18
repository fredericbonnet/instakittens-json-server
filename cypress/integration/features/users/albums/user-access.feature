Feature: User access : User Albums

  As a registered user
  I want to access User Albums

Background:
  Given I am a registered user
    And I am identified
  Given a User Id "user id" with albums
   When I get the User "user id"
   Then I should get the User "user"
    And I open the User "user"

Scenario: Getting the Album list
   When I get the Album list
   Then I should get the complete Album list

Scenario: Reading a public Album
  Given an existing public Album Id "id"
   When I get the Album "id"
   Then I should get the Album "album"
  Given the Album Id "id2" of the Album "album"
   Then the Id "id2" should equal the Id "id"
  Given the User Id "user id2" of the Album "album"
   Then the Id "user id2" should equal the Id "user id"

Scenario: Reading a restricted Album
  Given an existing restricted Album Id "id"
   When I get the Album "id"
   Then I should get the Album "album"
  Given the Album Id "id2" of the Album "album"
   Then the Id "id2" should equal the Id "id"
  Given the User Id "user id2" of the Album "album"
   Then the Id "user id2" should equal the Id "user id"

Scenario: Reading a private Album
  Given an existing private Album Id "id"
   When I get the Album "id"
   Then the operation is forbidden

Scenario: Reading an unknown Album
  Given an unknown Album Id "id"
   When I get the Album "id"
   Then the resource should not be found

Scenario: Creating an Album
  Given a new Album "new album" 
   When I create the Album "new album"
   Then the operation is forbidden

Scenario: Updating an Album
  Given an existing Album Id "id"
    And a new Album "updated album"
   When I update the Album "id" with "updated album" 
   Then the operation is forbidden

Scenario: Updating an unknown Album 
  Given an unknown Album Id "id"
    And a new Album "updated album"
   When I update the Album "id" with "updated album" 
   Then the operation is forbidden

Scenario: Replacing an Album
  Given an existing Album Id "id"
    And a new Album "replaced album"
   When I replace the Album "id" with "replaced album" 
   Then the operation is forbidden

Scenario: Replacing an unknown Album 
  Given an unknown Album Id "id"
    And a new Album "replaced album"
   When I replace the Album "id" with "replaced album" 
   Then the operation is forbidden

Scenario: Deleting an Album
  Given an existing Album Id "id"
   When I delete the Album "id"
   Then the operation is forbidden

Scenario: Deleting an unknown Album
  Given an unknown Album Id "id"
   When I delete the Album "id"
   Then the operation is forbidden
