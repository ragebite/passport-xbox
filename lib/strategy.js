// Imports
var util = require('util');
var OAuth2Strategy = require('passport-oauth2');
var InternalOAuthError = require('passport-oauth2').InternalOAuthError;
var request = require('request')

/**
 * `Strategy` constructor.
 *
 * @param {Object}   options
 * @param {Function} verify
 * @api public
 */
function XboxStrategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://login.live.com/oauth20_authorize.srf';
    options.tokenURL = options.tokenURL || 'https://login.live.com/oauth20_token.srf';
    options.scopeSeparator = options.scopeSeparator || ' ';
    options.customHeaders = options.customHeaders || {};

    OAuth2Strategy.call(this, options, verify);
    
    this.name = 'xbox';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(XboxStrategy, OAuth2Strategy);

/**
 * Retrieve user profile from Xbox Live.
 *
 * @param {String}   accessToken
 * @param {Function} done
 * @api protected
 */
XboxStrategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.useAuthorizationHeaderforGET(true);
  var data = {
    'RelyingParty': 'http://auth.xboxlive.com',
    'TokenType': 'JWT',
    'Properties': {
      'AuthMethod': 'RPS',
      'SiteName': 'user.auth.xboxlive.com',
      'RpsTicket': 'd=' + accessToken
    }
  };

  var options = {
    url: 'https://user.auth.xboxlive.com/user/authenticate',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'x-xbl-contract-version': '0'
    },
    json: data
  }

  return request.post(options, function (err, response, body) {
    if (err) {
      return done(new InternalOAuthError('Failed to pass authentication layer.', err))
    }

    if (body.Token === undefined || !body.Token) {
      return done(new InternalOAuthError('Failed to pass authentication layer.', err))
    }

    Authorize(accessToken, body.Token, done)
  });
}

function Authorize(accessToken, authenticateToken, done) {
  var data = {
    'RelyingParty': 'http://xboxlive.com',
    'TokenType': 'JWT',
    'Properties': {
      'SandboxId': 'RETAIL',
      'UserTokens': [authenticateToken]
    }
  };

  // Send request
  var options = {
    url: 'https://xsts.auth.xboxlive.com/xsts/authorize',
    json: data
  }

  return request.post(options, function (err, response, body) {
    if (err) {
      return done(new InternalOAuthError('Failed to pass authorization layer.', err))
    }

    if (!body.DisplayClaims || body.DisplayClaims === undefined) {
      return done(new InternalOAuthError('Failed to pass authorization layer.', err))
    }

    let data = body.DisplayClaims.xui[0]
    var profile = {
      provider: 'xbox',
      id: data.xid,
      username: data.gtg,
      age: data.agg,
      uhs: data.uhs,
      _raw: data
    }

    done(null, profile)
  });
}

/**
 * Expose `Strategy`.
 */
module.exports = XboxStrategy
