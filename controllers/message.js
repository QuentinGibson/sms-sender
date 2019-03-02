const Subscriber = require('../models/subscriber')
const messageSender = require('../lib/messageSender')
const config = require('../config')

// Create a function to handle Twilio SMS / MMS webhook requests
exports.webhook = function (request, response) {
  // Get the user's phone number
  const phone = request.body.From

  // Try to find a subscriber with the given phone number
  Subscriber.findOne({
    phone: phone
  }, function (err, sub) {
    if (err) return respond(config.err.findOne)

    if (!sub) {
      // If there's no subscriber associated with this phone number,
      // create one
      const newSubscriber = new Subscriber({
        phone: phone
      })

      newSubscriber.save(function (err, newSub) {
        if (err || !newSub) { return respond(config.err.newSub) }

        // We're signed up but not subscribed - prompt to subscribe
        respond(config.messages.newSub)
      })
    } else {
      // For an existing user, process any input message they sent and
      // send back an appropriate message
      processMessage(sub)
    }
  })

  // Process any message the user sent to us
  function processMessage (subscriber) {
    // get the text message command sent by the user
    let msg = request.body.Body || ''
    msg = msg.toLowerCase().trim()

    // Conditional logic to do different things based on the command from
    // the user
    if (msg === config.subscribe || msg === config.unsubscribe) {
      // If the user has elected to subscribe for messages, flip the bit
      // and indicate that they have done so.
      subscriber.subscribed = msg === config.subscribe
      subscriber.save(function (err) {
        if (err) {
          return respond(config.err.save)
        }

        // Otherwise, our subscription has been updated
        let responseMessage = subscriber.subscribed ? config.messages.subTrue : config.messages.subFalse

        respond(responseMessage)
      })
    } else {
      // If we don't recognize the command, text back with the list of
      // available commands
      const responseMessage = config.messages.subUnknown

      respond(responseMessage)
    }
  }

  // Set Content-Type response header and render XML (TwiML) response in a
  // Jade template - sends a text message back to user
  function respond (message) {
    response.type('text/xml')
    response.render('twiml', {
      message: message
    })
  }
}

exports.sendRequest = function (request, response) {
  const password = request.body.password
  if (password === config.password) {
    const message = request.body.message
    const imageUrl = request.body.imageUrl

    // Send messages to all subscribers
    Subscriber.find({
      subscribed: true
    }).then((subscribers) => {
      messageSender.sendMessageToSubscribers(subscribers, message, imageUrl)
    }).then(() => {
      request.flash('successes', 'Messages on their way!')
      response.redirect('/')
    }).catch((err) => {
      console.log('err ' + err.message)
      request.flash('errors', err.message)
      response.redirect('/')
    })
  }
}

// Handle form submissionstub
exports.sendMessages = function (request, response) {
  // Get message info from form submission
  const message = request.body.message
  const imageUrl = request.body.imageUrl

  // Send messages to all subscribers
  Subscriber.find({
    subscribed: true
  }).then((subscribers) => {
    messageSender.sendMessageToSubscribers(subscribers, message, imageUrl)
  }).then(() => {
    request.flash('successes', 'Messages on their way!')
    response.redirect('/')
  }).catch((err) => {
    console.log('err ' + err.message)
    request.flash('errors', err.message)
    response.redirect('/')
  })
}
