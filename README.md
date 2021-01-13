This app will take in as input a user's Diablo 2 save files (original and PlugY versions) and provide various information useful to the user such as:

 - A social feature wherein a user can see the Diablo 2 characters and items found of other users who have uploaded their Diablo 2 files.
      - "Leader board" for users who have made the most progress.
 - Automated "Holy Grail" check. This will also ensure no one will lie about the items they claim to have found (unless they know how to read the hex of the save files)
      - There could also be a "Holy Grail" leader board which takes into account "Perfect" items.
 - The ability to instantly search for any item in the stash
 - The ability to filter items by level req, type, quality, rarity, class, strength req, dexterity req, and any other affix.
 - "Character Views" of the stash: 
      - User selects one of their Diablo 2 characters and the app will automatically filter items suited for the character's particular characteristics and attributes.
      - Character View will generate optimal "build recommendations" for the user which will take into account all the available items in inventory as well as class/build preferences.
      - Character View highlights recommended items with requirements not yet met by the character but are within reach.
 - "Horadric Cube Function":
      - This feature will generate a list of Horadric Cube recipes that the user can fulfill given the collection of all the items in the user's shared stash, character stashes, and inventories.
      - Additionally the user can select any existing Horadric Cube recipe and the app will display the items the user has which are required for the recipe. If the user does not have the item or items required to make the recipe the app will let the user know (also if any of the missing items could be obtained from a different Horadric Cube recipe).

This app will make use of a Java program used to parse D2 files which can be found here: https://github.com/collinharmon/d2fileparser


Known bugs:
 - front-end allows uploading with no file chosen
 - cannot calculate affixes that are dependent on char level. may be possbile for items in personal stashes. need to dig in
 - don't allow spaces in username
 - upload stash fails indicate success to front-end
 - when .sss named "_LOD_SharedStashSave" the java app cannot parse. Probably due to a naming restriction i have in place 
 - in stashviewer no notification if query returns nothing


Nice to haves:
 - Filter charms by skillers/class 


 To Dos:
 - try/catch error handling for various chunks of code need (see building item query)
 - middleware for backend to log every ping
 - refactor code
 - performance analysis (profiler)
 - resolve html parser installation fault