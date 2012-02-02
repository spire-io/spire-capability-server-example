Clever with Capabilities
========================

(The code for this article is [available on
github](https://github.com/thedaniel/spire-capability-server-example))

Spire.io APIs use something called a *capability* for authentication and
authorization. (To learn more about capabilities, see our [previous
post](http://TODO) on the topic.) Essentially, instead of giving users a
session and then checking the user's permissions for each action, we give users
an encrypted key that is tied specifically to an action they are allowed to
take. For example, with the "create channel" capability, for the account
"alice", any client that knows that capability can create as many channels for
alice as they want, but can't take any other action on alice's account. This is
very different than the situation where alice's session key is compromised in a
typical application, and an implementation of the [principle of least
privilege](http://en.wikipedia.org/wiki/Principle_of_least_privilege).

This is an awesome way to manage access both for us the API provider and you
the developer. Let's walk through a simple example of one way to use the
capabilities provided by Spire.io to manage the access your users have to
different aspects of your app. We're big fans of node.js at Spire.io, so this
example will use node's Express web framework to serve up the capabilities to
the client as well as host the site.

TODO: A nice little chart that shows a server full of capabilities sharing them
selectively with a client.

The Server
----------

We'll start with some simple code to initialize the Spire.io library, as well
as initialize variables to hold the subscription and channel resources that
we'll be sharing with our clients.

<script src="https://gist.github.com/1720921.js?file=gistfile1.js"></script>

We're going to have two channels, `client-publishable-channel` and
`client-subscribable-channel`. I imagine you can guess what capabilities we'll
be sharing with the client for each.

(TODO - I think diving into spire.requests is unfortunate, but it's the only
way to get a handle on the newly created channel and later in the client code
the only way to use capabilities directly. Depending on when this blog post is
published, we can either rewrite the server code or insert a paragraph here
explaining why we're going into spire.requests)

Below is the callback we'll pass in when we connect to Spire.io. We use the
requests module of the Spire.io library to create the channel and subscription
and assign them to the variables we initialized earlier.

<script src="https://gist.github.com/1721075.js?file=gistfile1.js"></script>

Now here's the guts of our application - a very simple callback on the channel
that our client will publish to, that does something we don't want clients to
spoof for each other. In this case, we're just reversing whatever string we're
sent.

<script src="https://gist.github.com/1721093.js?file=gistfile1.txt"></script>

Now we set up our Express app with a single method for discovery. We'll just
give our clients enough capability to publish to one channel and listen on
another. In this trivial example, everyone who loads the page will be on the
same two channels. In a more serious implementation, you'd probably make
someone authenticate here, and give each user their own channel for publishing,
and depending on the application, either the same server channel (in the case
of e.g. a chat application where everyone is in the same room) or their own
read-only channel.

<script src="https://gist.github.com/1721108.js?file=gistfile1.js"></script>

Finally, we start our server in a loop that makes sure all our resources have
been created before launching:

<script src="https://gist.github.com/1721128.js?file=gistfile1.js"></script>

The Client
----------

Now that our client has the capabilities, it needs to use them. Below's all the
javascript we need. You'll notice that we get `/discover` as the callback for
`spire.connect()` - this makes sure that we've already fetched the description
resource of the Spire.io API. Otherwise, when we tried to create our channel
and subscription, our `spire` object wouldn't know what URLs and content types
to use to create them!

<script src="https://gist.github.com/1721166.js?file=gistfile1.js"></script>

That's all there is to selectively handing out capabilities with the Spire.io
API using our JavaScript library. Check out [the code on
github](https://github.com/thedaniel/spire-capability-server-example)!

TODO snappy conclusion
