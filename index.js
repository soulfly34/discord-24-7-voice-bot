const Discord = require('discord.js'), 
      client = new Discord.Client({ ws: { intents: Discord.Intents.ALL }}), 
      ytdlDiscord = require("discord-ytdl-core");

client.on('ready', async() => {
  client.user.setStatus("dnd");
  client.user.setActivity("Voice Bot & Soulfly#1111");
  play(); // Begin.
})


const { channelID, modID, videoURL, clientToken } = {
  clientToken: "", // You'r Application Token
  channelID: "", // Voice Channel ID
  modID: "", // Staff Role ID
  videoURL: "" // Youtube Music & Video URL
}

client.on('voiceStateUpdate', (oldState, newState) => {
  if((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

  let isMod = client.channels.cache.get(channelID).members.some(member => member.roles.cache.has(modID));
  if(newState.channelID == channelID && isMod){
    client.channels.cache.get(channelID).leave();
  } else if(oldState.channelID == channelID && !isMod){
    play();
  }
})


function play(){ 
  const url = await ytdlDiscord(videoURL, {
     filter: "audioonly",
     opusEncoded: true,
     encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
  });

  let type = videoURL.includes("youtube.com") ? "opus" : "ogg/opus"; 
  client.channels.cache.get(channelID).join().then(connection => { 
    let isMod = client.channels.cache.get(channelID).members.some(member => member.roles.cache.has(modID));
    if(!isMod) { 
      connection.play(url, { type }).on("finish", () => play(url)); 
    } else {
      play(url); 
    }
  }); 
}  

client.login(clientToken)  
