# boiler_plate
My Custom Node Boiler Plate

Dependencies: 
- dotenv : for environmental variables
- body-parser : for reading form data and passport-local
- express
- mongoose : database ORM
- passport : Authentication
- passport-local : local authentication
- express-session : Authentication Sessions
- connect-flash : displaying messages from server side logic to view
- ejs : view engine (could substitute any other engine with minor adjustments)

This boiler plate is intended to be basic startup project with minimal dependencies for most projects.  It is also intended to follow the
MVC architectural pattern.

# server.js
- initializes most dependencies
- connects to MongoDB via mongoose
- forwards all routes to ./app/routes.js

#./app/routes.js
- forwards routes to the appropriate controllers
- In this case, the only initial controller is the userController.
- This file also has the ability to verify if the user is logged in 'isLoggedIn(req, res, next)'.  If the user is not logged in, 
they are forwarded to the "/login" route.

# controllers
- Most routes are forwarded to a controller, unless the route is only rendering a basic view page that doesn't require any server side logic.
- The controller is responsible for the middle work between the models / data and the view.
   - startLogin() - renders the login.ejs page
   - login() - this is the post request that forwards the data to passport 'local-strategy'
   - startSignup() - renders the signup.ejs page
   - signup() - this is the post request that forwards the data to passport 'signup-strategy'
       - Currently this will accept an email or user name and any password option
   - logout() - runs req.logout() and redirects to the "/" route


# models
- Represents what our data should look like
- the User model currently only contains a username and password


# ./config/passport.js
- This contains the two local strategies: 'local-login' and 'local-signup'
- the login() and signup() methods from the userController are forwarded to this file

./public
- This is the static folder set in server.js
- css
   - contains css files
- js
   - contains Java Script files
   - site.js
      - As a test, an alert should occur when the "/" route is used.

# views
- contains ejs files
- folder names should correspond with the controller name.  Example: userController that renders login pages -> ./views/user/login.ejs
- ./views/partials
  - contains header.ejs and footer.ejs
    - header.ejs : contains the document type, html tag, head tags and body tag.  This file should contain all relevant css links.
    - footer.ejs : this will be displayed at the bottom of every page when included in the appropriate ejs file
