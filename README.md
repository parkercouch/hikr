# hikr
Tinder for hiking buddies

# PROJECT2
Initial repo for project 2

### Ideas

Find an adventure buddy
(Tinder for hikers?)


User Stories:
--Overall goals--
I am a hiker who is new to the area and want to find people to show me local trails.

As a user searching for a new hiking buddy, I want to see what


Basic pages and elements:

Nav Bar - Home -- Login/Signup  -> Home --  Search Faves Friends Profile

Landing Page - Show basic overview and call to action (try not to be too generic...)

Login/Signup pages - ...

Search/Match page -- Show one other member at a time with a profile photo and summary with one faved hike.

Other User profile page -- Matched users can see full profile of all faved hikes 

Profile page -- Show photos, summary, activities, and favorite hikes. Edit available

Messenger -- Inbox style messages. Clicking a person opens individual message stream

Search Hikes/Fave -- Search a list of local hikes (with hikingproject.com) and add to faves (Stretch Goal)



Database Schema Ideas:

User --
firstName:string
lastName:string
email:string \[validated and unique\] 
password:string (hashed) \[8-24\]
dob:date \[over 18\]

sequelize model:create --name user --attributes firstName:string,lastName:string,email:string,password:string,dob:date

------------------------------------

Profile --
userId: integer -> User.id
displayName: string
location: point? (long, lat) (x, y) type: Sequelize.GEOMETRY('POINT'),
summary: text
photo: string
desiredPaceId: integer
desiredDistanceId: integer


sequelize model:create --name profile --attributes userId:integer,displayName:string,location:geometry,summary:text,photo:string,desiredPaceId:integer,desiredDistanceId:integer

------------------------------------

DesiredPace --
id:integer (bitmask)
name:string 

1 - Leisurely
2 - Casual
4 - Brisk
8 - Running

sequelize model:create --name desiredPace --attributes name:string

------------------------------------

DesiredDistance --
id:integer (bitmask)
name:string 

1 - Short (0-5mi) 
2 - Medium (6-15)
3 - Long (16+)
4 - Multi-Day

sequelize model:create --name desiredDistance --attributes name:string

------------------------------------

One-Way-Matching --
userFromId: integer -> User.id
userToId: integer -> User.id

sequelize model:create --name matching --attributes userFromId:integer,userToId:integer

------------------------------------

Conversation --
id:pk
name:string
createdAt:time

sequelize model:create --name conversation --attributes name:string

------------------------------------

userConversation --
userId:integer
conversationId:integer

sequelize model:create --name userConversation --attributes userId:integer,conversationId:integer

------------------------------------

Messages --
senderId:integer
conversationId:integer
content: text


sequelize model:create --name message --attributes senderId:integer,conversationId:integer,content:text

------------------------------------

Associations:
User : Profile -- 1:1
user.hasOne

User : Conversation -- M:M (userConversation join table)
user.belongsToMany through userConversation
conversation.belongsToMany through userConversation

Conversation : Message -- 1:M 
conversation.hasMany


User : Matched -- 1:M
(User : User) -- M:M (through one-way, matched)
user.belongsToMany, as: Matched, through: matched



------------------------------------
