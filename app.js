/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require("restify");
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
  console.log("%s listening to %s", server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
  openIdMetadata: process.env.BotOpenIdMetadata
});

// Listen for messages from users
server.post("/api/messages", connector.listen());

/*----------------------------------------------------------------------------------------
 * Bot Storage: This is a great spot to register the private state storage for your bot.
 * We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
 * For samples and documentation, see: https56://github.com/Microsoft/BotBuilder-Azure
 * ---------------------------------------------------------------------------------------- */

/*
var tableName = "botdata";
var azureTableClient = new botbuilder_azure.AzureTableClient(
  tableName,
  process.env["AzureWebJobsStorage"]
);
var tableStorage = new botbuilder_azure.AzureBotStorage(
  { gzipData: false },
  azureTableClient
); */

// Welcome Dialog
var MainOptions = ["My Job", "My Team", "My Interview", "Our business", "HR"];
var inMemoryStorage = new builder.MemoryBotStorage();

//Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector, function(session) {
  var welcomeCard = new builder.HeroCard(session)
    .title("Candidate Assistant Bot")
    .subtitle("Choose ... ")
    .images([
      new builder.CardImage(session)
        .url(
          "https://firebasestorage.googleapis.com/v0/b/informatica-bot.appspot.com/o/informatica.png?alt=media&token=3c3a9c61-75f8-40ee-b957-a481b8cc36ca"
        )
        .alt("contoso_flowers")
    ])
    .buttons([
      builder.CardAction.imBack(
        session,
        session.gettext(MainOptions[0]),
        MainOptions[0]
      ),
      builder.CardAction.imBack(
        session,
        session.gettext(MainOptions[1]),
        MainOptions[1]
      ),
      builder.CardAction.imBack(
        session,
        session.gettext(MainOptions[2]),
        MainOptions[2]
      ),
      builder.CardAction.imBack(
        session,
        session.gettext(MainOptions[3]),
        MainOptions[3]
      ),
      builder.CardAction.imBack(
        session,
        session.gettext(MainOptions[4]),
        MainOptions[4]
      )
    ]);

  session.send(new builder.Message(session).addAttachment(welcomeCard));
}).set("storage", inMemoryStorage);

/* ================
myJob 
===================*/

bot
  .dialog("myJob", function(session) {
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel);
    msg.attachments([
      new builder.HeroCard(session)
        .title("Job Description")
        .subtitle("Team Lead")
        .text(
          "This job is programming intensive, and will require expertize in java"
        )
        .images([
          builder.CardImage.create(
            session,
            "http://petersapparel.parseapp.com/img/whiteshirt.png"
          )
        ])
        .buttons([
          builder.CardAction.imBack(
            session,
            "myJobKnowMore",
            "Watch latest Video"
          ),
          builder.CardAction.imBack(session, "main", "Back to main ")
        ]),
      new builder.HeroCard(session)
        .title("Desired Skills")
        .subtitle("Ability to technically lead a team of developers")
        .text("Expertise in big Data, ETL , kafka, Hazlecast")
        .images([
          builder.CardImage.create(
            session,
            "http://petersapparel.parseapp.com/img/grayshirt.png"
          )
        ])
        .buttons([
          builder.CardAction.imBack(
            session,
            "knowmoreDesiredSkills",
            "Watch latest video"
          ),
          builder.CardAction.imBack(session, "main", "Back to main ")
        ]),
      new builder.HeroCard(session)
        .title("What you gain ?")
        .subtitle("You get to work on bleeding edge technology")
        .text("This job helps you develop your skills")
        .images([
          builder.CardImage.create(
            session,
            "http://petersapparel.parseapp.com/img/grayshirt.png"
          )
        ])
        .buttons([
          builder.CardAction.imBack(
            session,
            "myJobKnowMore",
            "Watch latest Video"
          ),
          builder.CardAction.imBack(session, "main", "Back to main ")
        ])
    ]);
    session.send(msg).endDialog();
  })
  .triggerAction({ matches: /^(My Job)/i });

bot
  .dialog("myJobKnowMore", function(session) {
    var msg = new builder.Message(session);
    var vcardInfo = {
      title: "Team Lead",
      text:
        "At Informatica, We “DATA”. We Do Good, Act As One Team, Think Customer First, and Aspire For The Future. Informatica enables companies to unleash the power of data to become more agile, realize new growth opportunities, lead to new inventions resulting in intelligent market disruptions.",
      imageURL:
        "https://firebasestorage.googleapis.com/v0/b/informatica-bot.appspot.com/o/informaticaThumbnail.png?alt=media&token=eb34dae6-ca2d-4b8a-9f64-8f73152de3a6",
      videoURL:
        "https://firebasestorage.googleapis.com/v0/b/informatica-bot.appspot.com/o/teamLeadDescription.mp4?alt=media&token=ea50b1ef-b7b3-42ca-ba75-bcdfa5996d30",
      backButton: "Return"
    };
    msg.attachments([createVideoCard(session, vcardInfo)]);
    session.send(msg).endDialog();
  })
  .triggerAction({ matches: /^(myJobKnowMore)/i });

bot
  .dialog("knowmoreDesiredSkills", function(session) {
    var msg = new builder.Message(session);
    var vcardInfo = {
      title: "Roles and Responsibilities",
      text:
        "At Informatica, the roles and responsibilities of team lead are multiple...",
      imageURL:
        "https://firebasestorage.googleapis.com/v0/b/informatica-bot.appspot.com/o/informaticaThumbnail.png?alt=media&token=eb34dae6-ca2d-4b8a-9f64-8f73152de3a6",
      videoURL:
        "https://firebasestorage.googleapis.com/v0/b/informatica-bot.appspot.com/o/rolesAndRespOfTeamLead.mp4?alt=media&token=e5868572-c547-43ee-8cb3-916bfb61d691",
      backButton: "Return"
    };
    msg.attachments([createVideoCard(session, vcardInfo)]);
    session.send(msg).endDialog();
  })
  .triggerAction({ matches: /^(knowmoreDesiredSkills)/i });

function createVideoCard(session, vcardInfo) {
  return new builder.VideoCard(session)
    .title(vcardInfo.title)
    .text(vcardInfo.text)
    .image(builder.CardImage.create(session, vcardInfo.imageURL))
    .media([
      {
        url: vcardInfo.videoURL
      }
    ])
    .buttons([builder.CardAction.imBack(session, "main", "Back to main ")]);
}

/* ================
myTeam
===================*/
bot
  .dialog("MyTeam", function(session) {
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel);
    msg.attachments([
      new builder.HeroCard(session)
        .title("Watch our Office environment")
        .text("Watch the cozy yet professional workspace to inspire our team")
        .images([
          builder.CardImage.create(
            session,
            "http://petersapparel.parseapp.com/img/grayshirt.png"
          )
        ])
        .buttons([
          builder.CardAction.imBack(
            session,
            "watchOfficeEnvi",
            "Watch Recent Office Video"
          ),
          builder.CardAction.imBack(session, "main", "Back to main ")
        ]),
      new builder.HeroCard(session)
        .title("Meet Team HR")
        .text("Team HR at work ...")
        .images([
          builder.CardImage.create(
            session,
            "http://petersapparel.parseapp.com/img/grayshirt.png"
          )
        ])
        .buttons([
          builder.CardAction.imBack(
            session,
            "watchTeamHRmsg",
            "Watch Recent Team HR Msg"
          ),
          builder.CardAction.imBack(session, "main", "Back to main ")
        ]),
      new builder.HeroCard(session)
        .title("Meet your furure Team")
        .text("Listen to our team talk about the team")
        .images([
          builder.CardImage.create(
            session,
            "http://petersapparel.parseapp.com/img/whiteshirt.png"
          )
        ])
        .buttons([
          builder.CardAction.imBack(
            session,
            "watchFutureTeam",
            "Watch recent Team Video"
          ),
          builder.CardAction.imBack(session, "main", "Back to main ")
        ])
    ]),
      session.send(msg).endDialog();
  })
  .triggerAction({ matches: /^(My Team)/i });

bot
  .dialog("watchOfficeEnvi", function(session) {
    var msg = new builder.Message(session);
    var vcardInfo = {
      title: "Sneak peak at Office Environment",
      text: "Take a look at our world class office space ",
      imageURL:
        "https://firebasestorage.googleapis.com/v0/b/informatica-bot.appspot.com/o/informaticaThumbnail.png?alt=media&token=eb34dae6-ca2d-4b8a-9f64-8f73152de3a6",
      videoURL:
        "https://firebasestorage.googleapis.com/v0/b/informatica-bot.appspot.com/o/MeetTheDublinTeam.mp4?alt=media&token=72eb19f9-53c9-4a5e-bf93-fafebf6843e0",
      backButton: "Return"
    };
    msg.attachments([createVideoCard(session, vcardInfo)]);
    session.send(msg).endDialog();
  })
  .triggerAction({ matches: /^(watchOfficeEnvi)/i });

bot
  .dialog("watchTeamHRmsg", function(session) {
    var msg = new builder.Message(session);
    var vcardInfo = {
      title: "Meet our Team's HR",
      text: "Wath our team building excercise ...",
      imageURL:
        "https://firebasestorage.googleapis.com/v0/b/informatica-bot.appspot.com/o/informaticaThumbnail.png?alt=media&token=eb34dae6-ca2d-4b8a-9f64-8f73152de3a6",
      videoURL:
        "https://firebasestorage.googleapis.com/v0/b/informatica-bot.appspot.com/o/teamHRinAction.mp4?alt=media&token=3b7a45d6-1955-45d7-bb90-f238138a77fe",
      backButton: "Return"
    };
    msg.attachments([createVideoCard(session, vcardInfo)]);
    session.send(msg).endDialog();
  })
  .triggerAction({ matches: /^(watchTeamHRmsg)/i });

bot
  .dialog("watchFutureTeam", function(session) {
    var msg = new builder.Message(session);
    var vcardInfo = {
      title: "Watch our team talk about our work ...",
      text: "Work time at Informatica...",
      imageURL:
        "https://firebasestorage.googleapis.com/v0/b/informatica-bot.appspot.com/o/informaticaThumbnail.png?alt=media&token=eb34dae6-ca2d-4b8a-9f64-8f73152de3a6",
      videoURL:
        "https://firebasestorage.googleapis.com/v0/b/informatica-bot.appspot.com/o/MeetTheDublinTeam.mp4?alt=media&token=72eb19f9-53c9-4a5e-bf93-fafebf6843e0",
      backButton: "Return"
    };
    msg.attachments([createVideoCard(session, vcardInfo)]);
    session.send(msg).endDialog();
  })
  .triggerAction({ matches: /^(watchFutureTeam)/i });

/* ================
myInterview 
===================*/

bot
  .dialog("MyInterview", function(session) {
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel);
    msg.attachments([
      new builder.HeroCard(session)
        .title("Interview Schedule")
        .text("This card shall display interview schedule similar to outlook")
        .images([
          builder.CardImage.create(
            session,
            "http://petersapparel.parseapp.com/img/whiteshirt.png"
          )
        ])
        .buttons([builder.CardAction.imBack(session, "main", "Back to main ")]),
      new builder.HeroCard(session)
        .title("Getting to Office ")
        .text("Information on common traffic snarls en route to our office")
        .images([
          builder.CardImage.create(
            session,
            "http://petersapparel.parseapp.com/img/grayshirt.png"
          )
        ])
        .buttons([builder.CardAction.imBack(session, "main", "Back to main ")]),
      new builder.HeroCard(session)
        .title("Pollution information around office")
        .text("Here is the pollution information near office")
        .images([
          builder.CardImage.create(
            session,
            "http://petersapparel.parseapp.com/img/grayshirt.png"
          )
        ])
        .buttons([builder.CardAction.imBack(session, "main", "Back to main ")])
    ]);
    session.send(msg).endDialog();
  })
  .triggerAction({ matches: /^(My Interview)/i });

/* ================
companyHR
===================*/
bot
  .dialog("companyHR", function(session) {
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel);
    msg.attachments([
      new builder.HeroCard(session)
        .title("HR head")
        .text("Watch our HR head talk")
        .images([
          builder.CardImage.create(
            session,
            "http://petersapparel.parseapp.com/img/grayshirt.png"
          )
        ])
        .buttons([
          builder.CardAction.imBack(session, "hrHeadMsg", "Watch Recent Msg"),
          builder.CardAction.imBack(session, "main", "Back to main ")
        ]),
      new builder.HeroCard(session)
        .title("Meet the India Team")
        .text(
          "Listen to our Indian team share their experience on working at informatica"
        )
        .images([
          builder.CardImage.create(
            session,
            "http://petersapparel.parseapp.com/img/whiteshirt.png"
          )
        ])
        .buttons([
          builder.CardAction.imBack(
            session,
            "watchIndiaTeam",
            "Watch recent India Center Team Video"
          ),
          builder.CardAction.imBack(session, "main", "Back to main ")
        ])
    ]),
      new builder.HeroCard(session)
        .title("Certifications")
        .text("How certifications help")
        .images([
          builder.CardImage.create(
            session,
            "http://petersapparel.parseapp.com/img/grayshirt.png"
          )
        ])
        .buttons([
          builder.CardAction.imBack(
            session,
            "watchCertificationHelp",
            "Informatica Certified Professionals stand apart from the pack. Join them."
          ),
          builder.CardAction.imBack(session, "main", "Back to main ")
        ]),
      session.send(msg).endDialog();
  })
  .triggerAction({ matches: /^(HR)/i });

bot
  .dialog("hrHeadMsg", function(session) {
    var msg = new builder.Message(session);
    var vcardInfo = {
      title: "Watch our HR head talk",
      text: "Here is our HR inviting ",
      imageURL:
        "https://firebasestorage.googleapis.com/v0/b/informatica-bot.appspot.com/o/informaticaThumbnail.png?alt=media&token=eb34dae6-ca2d-4b8a-9f64-8f73152de3a6",
      videoURL:
        "https://firebasestorage.googleapis.com/v0/b/informatica-bot.appspot.com/o/graceSpeech.mp4?alt=media&token=a1ba9796-9b6f-4492-a3f6-95ef03d37888",
      backButton: "Return"
    };
    msg.attachments([createVideoCard(session, vcardInfo)]);
    session.send(msg).endDialog();
  })
  .triggerAction({ matches: /^(hrHeadMsg)/i });

bot
  .dialog("watchIndiaTeam", function(session) {
    var msg = new builder.Message(session);
    var vcardInfo = {
      title: "Meet our Team in India Office",
      text: "Listen to them share their experience...",
      imageURL:
        "https://firebasestorage.googleapis.com/v0/b/informatica-bot.appspot.com/o/informaticaThumbnail.png?alt=media&token=eb34dae6-ca2d-4b8a-9f64-8f73152de3a6",
      videoURL:
        "https://firebasestorage.googleapis.com/v0/b/informatica-bot.appspot.com/o/indiaTeam.mp4?alt=media&token=d22db418-d093-47fa-89b8-5246bcc921e6",
      backButton: "Return"
    };
    msg.attachments([createVideoCard(session, vcardInfo)]);
    session.send(msg).endDialog();
  })
  .triggerAction({ matches: /^(watchIndiaTeam)/i });

// Send welcome when conversation with bot is started, by initiating the root dialog
bot.on("conversationUpdate", function(message) {
  if (message.membersAdded) {
    message.membersAdded.forEach(function(identity) {
      if (identity.id === message.address.bot.id) {
        bot.beginDialog(message.address, "/");
      }
    });
  }
});

bot
  .dialog("OurBusiness", function(session) {
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel);
    msg.attachments([
      new builder.HeroCard(session)
        .title("Moving Business To Cloud")
        .text("Multicloud. On-Prem. Hybrid. Approach Your Cloud Your Way")
        .images([
          builder.CardImage.create(
            session,
            "http://petersapparel.parseapp.com/img/whiteshirt.png"
          )
        ])
        .buttons([builder.CardAction.imBack(session, "main", "Back to main ")]),
      new builder.HeroCard(session)
        .title("Drive 360 Engagement")
        .text("Helping you to engage your customers")
        .images([
          builder.CardImage.create(
            session,
            "http://petersapparel.parseapp.com/img/grayshirt.png"
          )
        ])
        .buttons([builder.CardAction.imBack(session, "main", "Back to main ")]),
      new builder.HeroCard(session)
        .title("Provide Analytics Insights")
        .text("Helping you analyze your business data")
        .images([
          builder.CardImage.create(
            session,
            "http://petersapparel.parseapp.com/img/grayshirt.png"
          )
        ])
        .buttons([builder.CardAction.imBack(session, "main", "Back to main ")])
    ]);
    session.send(msg).endDialog();
  })
  .triggerAction({ matches: /^(Our business)/i });
