require('dotenv-safe').load()

const cfg = {}

// HTTP Port to run our web application
cfg.port = process.env.PORT || 3001

// A random string that will help generate secure one-time passwords and
// HTTP sessions
cfg.secret = process.env.APP_SECRET || 'keyboard cat'

// Password for Online Portal
cfg.password = process.env.PASSWORD || ''

// Your Twilio account SID and auth token, both found at:
// https://www.twilio.com/user/account
//
// A good practice is to store these string values as system environment
// variables, and load them from there as we are doing below. Alternately,
// you could hard code these values here as strings.
cfg.accountSid = process.env.TWILIO_ACCOUNT_SID
cfg.authToken = process.env.TWILIO_AUTH_TOKEN

// A Twilio number you control - choose one from:
// https://www.twilio.com/user/account/phone-numbers/incoming
// Specify in E.164 format, e.g. "+16519998877"
cfg.twilioNumber = process.env.TWILIO_NUMBER

// MongoDB connection string - MONGO_URL is for local dev,
// MONGOLAB_URI is for the MongoLab add-on for Heroku deployment
cfg.mongoUrl = process.env.MONGOLAB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017' // default

// MongoDB connection string for test purposes
cfg.mongoUrlTest = 'mongodb://localhost:8000'

// Set Subscribe phrase
cfg.subscribe = process.env.SUBSCRIBE || 'subscribe'
cfg.unsubscribe = process.env.UNSUBSCRIBE || 'unsubscribe'

// Set SMS responses
cfg.messages = {
  newSub: process.env.MESSAGE_NEWSUB || 'Thanks for contacting us! Text "subscribe" to receive updates via text message.',
  subTrue: process.env.MESSAGE_SUBTRUE || 'You are now subscribed for updates.',
  subFalse: process.env.MESSAGE_SUBFALSE || 'You have unsubscribed. Text "subscribe" to start receiving updates again.',
  subUnknown: process.env.MESSAGE_SUBUNKNOWN || 'Sorry, we didn\'t understand that. available commands are: subscribe or unsubscribe'
}

// Set SMS error messages
cfg.err = {
  newSub: process.env.ERROR_NEWSUB || 'We couldn\'t sign you up - try again.',
  findOne: process.env.FINDONE || 'Derp! Please text back again later.',
  save: process.env.SAVE || 'We could not subscribe you - please try again.'
}

// Export configuration object
module.exports = cfg
