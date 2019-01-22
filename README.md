# hikr
Tindr style app for hiking buddies

### Ideas



User Stories:
--Overall goals--
I am a hiker who is new to the area and want to find people to show me local trails.

As a user searching for a new hiking buddy, I want to see people close to me

As a experienced hiker, I want to find other people that want to do long hikes


Basic pages and elements:

Nav Bar - Home -- Login/Signup  -> Home --  Search Faves Friends Profile

Landing Page - Show basic overview and call to action (try not to be too generic...)

Login/Signup pages - ...

Search/Match page -- Show one other member at a time with a profile photo and summary with one faved hike.

Other User profile page -- Matched users can see full profile of all faved hikes 

Profile page -- Show photos, summary, activities, and favorite hikes. Edit available

Messenger -- Inbox style messages. Clicking a person opens individual message stream

Search Hikes/Fave -- Search a list of local hikes (with hikingproject.com) and add to faves (Stretch Goal)



Database Schema:

User --
firstName:string
lastName:string
email:string \[validated and unique\] 
password:string (hashed) \[8-24\]
dob:date \[over 18\]

------------------------------------

Profile --
userId: Integer (Foreign Key)
displayName: String
location: PostGIS GEOGRAPHY POINT
displayLocation: String
summary: Text
photo: String (url of uploaded photo)
desiredPaceId: integer (bitmask)
desiredDistanceId: integer (bitmask)

------------------------------------

DesiredPace --
id:integer (bitmask)
name:string 

1 - Leisurely
2 - Casual
4 - Brisk
8 - Running

------------------------------------

DesiredDistance --
id:integer (bitmask)
name:string 

1 - Short (0-5mi) 
2 - Medium (6-15)
3 - Long (16+)
4 - Multi-Day

------------------------------------

One-Way-Matching --
userFromId: integer -> User.id
userToId: integer -> User.id

------------------------------------

Conversation --
name:string

------------------------------------

userConversation (Join Table) --
userId: Integer
conversationId: Integer

------------------------------------

Messages --
senderId: Integer
conversationId: Integer
content: Text

------------------------------------

Associations:
User : Profile -- 1:1

User : Conversation -- M:M (userConversation join table)

Conversation : Message -- 1:M 

User : User -- M:M (matching join table)
One directional

------------------------------------

script resetDB.sh will clear db and reseed with test data
This includes 100 users (with not creative but usable data)
and conversations/messages
everyone's password is password
user 11 is matching everyone but no one is matching back

## Routes
| route | method | description |
|:------|:------:|------------:|
| / | GET | Landing Page |
| /auth/login | GET | Login Page |
| /auth/login | POST | Authenticate User |
| /auth/logout | GET | Logs user out. Redirect to / |
| /auth/signup | GET | Sign Up Page |
| /auth/signup | POST | Validate sign up form |
| /profile | GET | Show logged in user's profile |
| /profile | PUT | Update user's profile |
| /profile | DELETE | Delete user |
| /profile/delete | GET | Show user delete confirmation |
| /profile/edit | GET | Show edit form for profile |
| /profile/location | GET | Show search bar for location |
| /profile/location-selector | GET | Show results of location search |
| /search | GET | Show another user's profile if it matches search parameters|
| /conversation | GET | Show list of matched users to talk to |
| /conversation/:idx | GET | Show all messages in that conversation |





## Technologies/Libraries/Frameworks/Etc
* Node.js + Express - Server
* Postgres + PostGIS - Database
* Sequelize - ORM
* Redis - To store sessions
* Pug Templating - Server Side Rendering
* Tachyons - Styling (CSS Utility classes)
* Socket.io - Realtime updates/chat
* Alertify - Prettier alerts
* Cloudinary - To upload profile photo
* Mapbox API - Geocoding


### BUGS/TODO:
* Searching for other users requires a page refresh, which makes the DB search for another list
* Selecting a new location doesn't return back to the edit page
* There are no notifications when new messages or matches are made
