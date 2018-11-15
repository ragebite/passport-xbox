# Passport-Xbox

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Xbox Live](http://xboxlive.com/) using OpenID 2.0.


## Installation

```bash
$ npm install --save passport-xbox
```

## Usage

#### Configure Strategy

The Xbox authentication strategy authenticates users using a xbox live account,
which is also an OpenID 2.0 identifier.  The strategy requires a `validate`
callback, which accepts this identifier and calls `done` providing a user.
Additionally, options can be supplied to specify a return URL and realm.

```javascript
passport.use(new XboxStrategy({
    clientID: 'id-of-app-created-microsoft-accounts',
    clientSecret: 'secret/generated-password-microsoft-accounts',
    callbackURL: 'http://localhost:3000/auth/xbox/return',
    scope: 'Xboxlive.signin'
  },
  
  function(accessToken, profile, done) {
    User.findOne({ openId: identifier }, function (err, user) {
      return done(err, user);
    });
  }
));
```

A Xbox Client ID & Client Secret can be obtained at [Apps Microsoft](https://apps.dev.microsoft.com/#/appList)

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'xbox'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app
  .get('/auth/xbox', passport.authenticate('xbox'))
  .get('/auth/xbox/return', passport.authenticate('xbox', { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/');
  })
;
```

## Tests

## License

(The MIT License)

Copyright (c) 2011 Jared Hanson

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
