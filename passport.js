/**/
// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

module.exports = function() {
	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.username);
	});

	// used to deserialize the user
	passport.deserializeUser(function(username, done) {
		connection.query("select * from users where username = ?", [username], function(err,rows){	
			if (err) {
				console.error(err);
				return;
			}
			console.log(rows);
			done(err, rows[0]);
		});
	});


		// =========================================================================
	// LOCAL SIGNUP ============================================================
	// =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'
	passport.use('local-register', new LocalStrategy({
	    // by default, local strategy uses username and password, we will override with email
	    usernameField : 'username',
	    passwordField : 'password',
	    passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, username, password, done) {
		console.log("registering", username, password);

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
	    connection.query("select * from users where username = ?", [username], function(err,rows){
			console.log(rows);
			console.log("above row object");
			if (err)
	            return done(err);
			 if (rows.length) {
	            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
	        } else {

				// if there is no user with that email
	            // create the user
	            var newUserMysql = {
	            	username: username,
	            	password: password
	            };
				
				// TODO hash passwords
				var insertQuery = "INSERT INTO users ( username, password ) values (?, ?)";
				
				connection.query(insertQuery, [username, password], function(err,rows){
					return done(null, newUserMysql);
				});	
	        }	
		});
	}));

	// =========================================================================
	// LOCAL LOGIN =============================================================
	// =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

	passport.use('local-login', new LocalStrategy({
	    // by default, local strategy uses username and password, we will override with email
	    usernameField : 'username',
	    passwordField : 'password',
	    passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, email, password, done) { // callback with email and password from our form

	     connection.query("SELECT * FROM `users` WHERE `username` = '" + email + "'",function(err,rows){
			if (err)
	            return done(err);
			if (!rows.length) {
	            return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
	        } 
			
			// if the user is found but the password is wrong
	        if (!( rows[0].password == password))
	            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
			
	        // all is well, return successful user
	        return done(null, rows[0]);			
		
		});

	}));
}