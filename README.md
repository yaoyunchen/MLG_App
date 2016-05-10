# cMLG App
### Champion Mastery of League Gambler App

## INTRODUCTION

Do you have a friend who disagree with you that you're the better League player?  Are you curious to if you would do better with Teemo then your buddy?  If so, welcome to the cMLG App!

Our App allows a user to compete against another player with a chosen champion to determine who does better with the champion over a period of time.  Users can place bets, using our app's own point system, to see if they barely beat out their opponent or totally dominate them. 

After signing up with cMLG App, users can challenge other registered users to see who can have the most point gain over 24 hours.  The cMLG App makes use of the League of Legends API to determine users' average mastery points gained over a period of 24 hours by periodically checking the user's recent match history for games with the chosen champion.  At the end of the match, points will be rewarded (or taken) based on the results.  Users can take advantage of party bonuses, or any other factors that can affect points gain, or even play in the same teams as their opponent, but that wouldn't really be beneficial.  All that matters is they gain more points on average (so if you S+ first game, you can quit while you're ahead).


## PROJECT OUTLINE
### Tech 
* JavaScript 
* angular.js
* Node.js
* Express.js
* postGreSQL
* gulp.js
* bootstrap
* ac-charts
* jQuery
* GitHub
* Sublime Text 3

### To run locally:
```
1. Clone the project 'https://github.com/yaoyunchen/MLG_App.git'.
2. Make sure you have node and npm installed.
3. Run [$ npm install] in terminal.
4. Install pSQL
  1. Run [$ brew install postgresql].
  2. Run [$ initdb /usr/local/var/postgres].
5. Run [$ node models/database.js].
6. Run [$ node models/alterDB/*.js].
7. Run postgres -D /usr/local/var/postgres to start pSQL server.
8. Replace process.env.LOL_API_KEY in line 9 of '/routes/index.js' with your League of Legends API Key.
9. Run [$ npm start] in terminal.
10. Visit 'localhost::8888' to view app.
```

### Sign Up
```
  1. Click on the 'Sign Up' button, or in the nav bar.
  2. Enter a valid summoner's name (that's not registed in cMLG and actually exists in League of Legends).
  3. Enter your email (won't spam, just for confirmation emails)*.
  4. Enter a password (----------->PLEASE, DON'T USE YOUR ACTUAL LEAGUE OF LEGENDS PASSWORD<----------).
  5. Change your league of legends user profile icon to the one we specified after account creation, until account is confirmed (we periodically check the League API to see if you did!).**  
  
  *  Not yet implemented. 
  ** Not yet implemented, account will just be created and usable at the moment.
```
### Log In
```
  1. Click on the 'Log In' button or in the nav bar.
  2. Use the email and password entered when signing up to log in.
```
### Log Out
```
  1. To log out, just click 'Log Out' in the nav bar.
```
### Matches
```
  1. Creating Matches
    1. After loggin in, click on the 'Create Match' button or in the nav bar to challenge another user.
    2. Enter a champion name, or browse through all the champions and select the icon.
    3. Lock in the champion.
    4. Enter a user registered in the cMLG App in 'summoner name'.
    5. Place you bet!
      1. The bet amount will be subtracted when the challenge is submitted.
      2. The max bet is 1000 points, min bet 100 points.
        1. No challenges can be issued if you have insufficient points! **
    6. Select if you think if it will be a close match (but you still win), or you would totally dominate your opponent.
    7. Send the challenge request! Opponents have 15 minutes to accept a pending match, and you have 15 minutes to confirm challenges sent to you. **
  2. Pending Matches
    1. After loggin in, click on the 'Pending Matches' button or in the nav bar to view ongoing match requests.
      1. Accepting Matches
        1. Click on the 'Accept' button for the match you wish to accept.
        2. Points will be deducted as soon as a match is accepted until the results.
          1. If you have insufficient points, you will not be able to accept matches!
        3. Match starts for both users as soon as a match request is accepted!
      2. Cancelling Matches
        1. To cancel a request you sent, click on the 'cancel' button beside the match.
        2. Points spent on the challenge will be refunded.
  3. Ongoing Matches
    1. To view ongoing matches, click the 'Current Matches' button or your username in the nav bar.
    2. Your total points (including ongoing bets) is shown in a pie chart.
      1. Click sections of the pie chart to view match information of different games. ***
      
  * Daily point system will be implemented to give users points.
  ** Email system will be implemented to notify challenges.
  *** Will have timer of expiring matches.
```

## FEATURES

### Current

### Planned


## CONTRIBUTORS


## DISCLAIMER
