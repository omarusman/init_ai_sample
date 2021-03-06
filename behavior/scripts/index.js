'use strict'

exports.handle = (client) => {
  // Create steps
  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('welcome')
      client.addResponse('provide/documentation', {
        documentation_link: 'http://docs.init.ai',
      })
      client.addResponse('provide/instructions')

      client.updateConversationState({
        helloSent: true
      })

      client.done()
    }
  })

  const untrained = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('apology/untrained')
      client.done()
    }
  })

  const handleGreeting = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('greeting')
      client.done()
    }
});

const handleGoodbye = client.createStep({
  satisfied() {
    return false
  },

  prompt() {
    client.addResponse('goodbye')
    client.done()
  }
})

  client.runFlow({
    classifications: {
      // map inbound message classifications to names of streams

      // Add a greeting handler with a reference to the greeting stream
    greeting: 'greeting',
    goodbye: 'goodbye',

    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
        greeting: handleGreeting,
         goodbye: handleGoodbye,
      main: 'onboarding',
      onboarding: [sayHello],
      end: [untrained],
    },
  })
}
