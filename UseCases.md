# Use Cases

## Create an Account
The user should be able to create an account by logging in with either Facebook, Instagram, or Google. (By using a 3rd party for login, we don't have to worry about validating email addresses or resetting passwords). 

Once the user successfully authenticates, we will need to check if the email they are creating their account with is not already in use. If so, we will show the user the appropriate error. If not, we will proceed with creating the account. 

First, we need to give each user a correct username. If they login with Facebook or Instagram, we can try making that their username by default. Whether or not we have a default username for the user, we will need to provide him with an option to change his username. Before continuing, we need to validate that the username entered is unique. 

Second, we need to add friends. I don't believe Instagram OAuth supports viewing a user's friends list, so we can only recommend to the user friends found through Facebook that are on Travel Simply. The user should have the option to search for and add new friends, or skip this section. 

## Sign In
The user should be able to sign in to their account with either Facebook, Instagram, or Google. If while they are signing in we find that they are signing in with an in-use email but on the incorrect platform (e.g. signing in with Google instead of Facebook), we can notify the user to sign in with the appropriate 3rd party. If the user is signing in with an email that does not have an account associated with it, we will proceed as if they are creating an account with a new email.

## Delete Account
After putting in checks to ensure the user knows what they are doing (e.g. re-entering their password, typing a sentence like GitHub does, etc.), the account will be deleted and the user signed out. They will also be removed from any travel groups that they are currently in, but not removed from the friends list of others (they will simply show up as a deleted account). 

## Add Friend
Users can add a friend by searching for their username and then sending them a friend request. If the receiving user accepts, they will be added as friends.

## Remove Friend
Users can remove a friend by simply removing them from their friends list without any action needing to be taken by their friend.

## View Calendar
The user should be shown a calendar with information about when his friends are travelling on it. When a user clicks on trip shown on the calendar, they can essentially "preview" it by viewing information that the travel group has made public, like expected cost for a new person, destination, etc. If he chooses, the user can request to join a travel group.

## Request to Join Travel Group
When a user requests to join a travel group, members of the travel group will be notified via email. From their travel group dashboard (or some other location), they can choose to accept the member or reject. For a member to be accepted into a travel group, he must be accepted by all members in the travel group.

## Create Travel Group
When a user chooses to create a travel group, he will first choose a name (optional) for the group. Then, the group will be created with the user who created it designated as the owner.

## Invite User to Travel Group
Any user in a travel group can invite other users to the group. If the user accepts the invitation, his request to join will need to be accepted by all the users in the travel group.

## Remove User from Travel Group
Only the owner can remove a user from a travel group. When a user is removed, calculations invoving the user (e.g. such as shared costs) will be recalculated. 

## Leave Travel Group
Any member can leave a travel group, and if the owner leaves a travel group, he will either manually select someone else in the group to be owner or have a new owner chosen randomly. If he is the last user in the group, the group will be deleted when he leaves. 

## Delete Travel Group
A travel group can be deleted by the owner. When a travel group is deleted, all users inside of it will be removed from the group as well (obviously), and all invitations or join requests related to it will be deleted.

## Modify Travel Group Travel Info
Any user within a travel group can modify its info. The information a travel group contains will include (we may add more later) a destination, basic itinerary, and estimated costs with per user breakdown. Specific information can be chosen to be made public to other users previewing their travel group. 

## Modify Travel Group Settings
Only the owner can modify the travel group settings. The owner can make the travel group public or private. If public, other users who are friends with users in the trave group can preview the group and request to join. If private, only users invited by authorized users within the travel group can join. The owner can also choose to change invite priveleges to include only himself or the anyone in the group (does not matter whether or not the group is public or private).
