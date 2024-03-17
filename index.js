const express = require("express");
const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const multiplayerSchema = new mongoose.Schema({
  time: Date,
  user: String,
  eventtype: String,
  league: String,
  position: Number,
  car: String,
  trackname: String,
  racetime: String,
  reputationpoints: String,
});

const dailyeventSchema = new mongoose.Schema({
  time: Date,
  user: String,
  eventtype: String,
  position: String,
  car: String,
  trackname: String,
  racetime: String,
  reputationpoints: String,
});

const showroomSchema = new mongoose.Schema({
  time: Date,
  user: String,
  eventtype: String,
  position: String,
  car: String,
  trackname: String,
  racetime: String,
  reputationpoints: String,
});

const seasonalSchema = new mongoose.Schema({
  time: Date,
  user: String,
  eventtype: String,
  position: String,
  car: String,
  trackname: String,
  racetime: String,
  reputationpoints: String,
});

const userdetailsSchema = new mongoose.Schema({
  user: String,
  SerialNumber: String,
  bios: String,
  motherboard: String,
  processor: String,
  systeminformation : String,
  monitor : String,
  graphics_cards : String
});



const userloginSchema = new mongoose.Schema({
  time : String,
  user: String,
  passes: String,
  lastlogin: Date,
  SerialNumber: String,
  creationdate : String,
  ispreminum : Boolean,
  isdevtester: Boolean
})



const configSchema = new mongoose.Schema({
  configdetails : String,
  multiplayeroneghost : Boolean,
  multiplayeroneslipstream : Boolean,
  multiplayertwotype : Number,
  multiplayertwoghost : Boolean,
  multiplayertwoslipstream : Boolean,
  multiplayertwoallcar : Boolean,
  multiplayertwosinglecarname : String,
  carhuntname : String,
  carhunttrack : String,
  carhuntclass : String,
  carhuntv2track : Boolean,
  mp1name : String,
  mp2name : String,
  latestbuild : String,
  showannouncement : Boolean,
  announcement : String,
})



const Multiplayer = mongoose.model("Multiplayer", multiplayerSchema);
const Dailyevent = mongoose.model("Dailyevent", dailyeventSchema);
const Showroom = mongoose.model("Showroom" ,showroomSchema)
const Seasonal = mongoose.model("Seasonal" , seasonalSchema)
const Userdetails = mongoose.model("Userdetails", userdetailsSchema);
const Userlogin = mongoose.model("Userlogin", userloginSchema);
const configurations = mongoose.model("Configurations" , configSchema);





app.use(express.json());
app.use(cors());




/// api/userdetails saves the new computer information
app.post("/api/userdetails", async (req, res) => {
  console.log(req.body);
  const user = new Userdetails(req.body);
  try {
    await user.save();
    console.log("Device Information saved successfully");
    res.send("User Registered");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving user");
  }
});

app.post("/api/multiplayer", async (req, res) => {
  console.log(req.body);
  const user = new Multiplayer(req.body);
  try {
    await user.save();
    console.log("Result saved successfully");
    res.send("User data received");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving user");
  }
});

app.post("/api/dailyevent", async (req, res) => {
  // Check if the request body has a 'time' key
  console.log(req.body);
  const user = new Dailyevent(req.body);

  try {
    await user.save();
    console.log("Result saved successfully");
    res.send("User data received");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving user");
  }
});

app.post("/api/showroom", async (req, res) => {
  // Check if the request body has a 'time' key
  console.log(req.body);
  const user = new Showroom(req.body);
  try {
    await user.save();
    console.log("Result saved successfully");
    res.send("User data received");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving user");
  }
});

app.post("/api/seasonalevent", async (req, res) => {
  // Check if the request body has a 'time' key
  console.log(req.body);
  const user = new Seasonal(req.body);
  try {
    await user.save();
    console.log("Result saved successfully");
    res.send("User data received");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving user");
  }
});

//multiplayeroneslipstream

app.post("/api/login", async (req, res) => {
  console.log(req.body);
  const username = req.body.user;
  const password = req.body.passes;
  const lastLoginTime = req.body.time;
  try {
    let getallconfiginfo =  await configurations.findOne({ configdetails : "mainconfiginformations"})
    foundUser = await Userlogin.findOne({ user: username, passes: password });
      if (foundUser) {
        foundUser.lastlogin = lastLoginTime;
        let serialExists = await Userlogin.findOne({SerialNumber: req.body.SerialNumber})
        if (serialExists){
          verifieduser = true
        }
        else {
          verifieduser = false
          foundUser.SerialNumber = req.body.SerialNumber 
        }
        foundUser.creationdate = req.body.botcreationdate
        let savedUser = await foundUser.save();
        const sendinfo = {
          username: req.body.user,
          aawasta: savedUser.ispreminum,
          halkhabar: savedUser.isdevtester,
          verified: verifieduser,
          mp1name : getallconfiginfo.mp1name,
          mp2name : getallconfiginfo.mp2name,
          multiplayeroneghost : getallconfiginfo.multiplayeroneghost,
          multiplayeroneslipstream : getallconfiginfo.multiplayeroneslipstream,
          multiplayertwotype : getallconfiginfo.multiplayertwotype,
          multiplayertwoghost : getallconfiginfo.multiplayertwoghost,
          multiplayertwoslipstream : getallconfiginfo.multiplayertwoslipstream,
          multiplayertwoallcars : getallconfiginfo.multiplayertwoallcar,
          multiplayertwosinglecarname : getallconfiginfo.multiplayertwosinglecarname,
          carhuntname : getallconfiginfo.carhuntname,
          carhunttrack :  getallconfiginfo.carhunttrack,
          latestbuild : getallconfiginfo.latestbuild,
          carhuntv2track : getallconfiginfo.carhuntv2track,
          carhuntclass : getallconfiginfo.carhuntclass,
          announcement : getallconfiginfo.announcement
        };
        return res.status(200).json(sendinfo);
      } else {
        // Check if user exists without checking password
        let userExists = await Userlogin.findOne({ user: username });
        let serialExists = await Userlogin.findOne({SerialNumber: req.body.SerialNumber})
        if (userExists) {
          // If user exists, send a 401 status
          return res.status(401).json({ error: 'Unauthorized' });
        } else if (serialExists){
          return res.status(403).json({ error: 'Unauthorized' });
        }  
        else {
          // If no user is found, save the request body
          newuserdata = {
            user: req.body.user,
            passes: req.body.passes,
            SerialNumber: req.body.SerialNumber,
            lastlogin: req.body.time,
            creationdate: req.body.botcreationdate,
            ispreminum: false,
            isdevtester: false
          }
          const newUser = new Userlogin(newuserdata);
          let savedUser = await newUser.save();
          const sendinfo = {
            username: req.body.user,
            aawasta: false,
            halkhabar: false,
            verified: false,
            mp1name : getallconfiginfo.mp1name,
            mp2name : getallconfiginfo.mp2name,
            multiplayeroneghost : getallconfiginfo.multiplayeroneghost,
            multiplayeroneslipstream : getallconfiginfo.multiplayeroneslipstream,
            multiplayertwotype : getallconfiginfo.multiplayertwotype,
            multiplayertwoghost : getallconfiginfo.multiplayertwoghost,
            multiplayertwoslipstream : getallconfiginfo.multiplayertwoslipstream,
            multiplayertwoallcars : getallconfiginfo.multiplayertwoallcar,
            multiplayertwosinglecarname : getallconfiginfo.multiplayertwosinglecarname,
            carhuntname : getallconfiginfo.carhuntname,
            carhunttrack :  getallconfiginfo.carhunttrack,
            latestbuild : getallconfiginfo.latestbuild,
            carhuntclass : getallconfiginfo.carhuntclass,
            carhuntv2track : getallconfiginfo.carhuntv2track,
            announcement : getallconfiginfo.announcement
          };
          return res.status(200).json(sendinfo);
        }
      }
    }
   catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});


app.post('/relays', async(req, res) => {
  console.log(req.body);
  const datass = new configurations(req.body);
  try {
    await datass.save();
    console.log("Result saved successfully");
    res.send("Configuration Saved Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Configuration Saving Failed");
  }


})


app.get('/resource/carhunt', async(req, res) => {
  let getallconfiginfo =  await configurations.findOne({ configdetails : "mainconfiginformations"})
  res.sendFile(path.join(__dirname, `carhunt//${getallconfiginfo.carhuntname}.png`));
});

app.get('/resource/carhunt_selected', async(req, res) => {
  let getallconfiginfo =  await configurations.findOne({ configdetails : "mainconfiginformations"})
  res.sendFile(path.join(__dirname, `carhunt//${getallconfiginfo.carhuntname}_selected.png`));
});




app.get('/output/multiplayer', async (req, res) => {
  try {
    const items = await Multiplayer.find()
      .sort({ _id: -1 }) // Assuming you have an "_id" field with auto-generated timestamps
      .limit(200)
      .exec();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});


app.get('/output/dailyevent', async (req, res) => {
  try {
    const items = await Dailyevent.find()
      .sort({ _id: -1 }) // Assuming you have an "_id" field with auto-generated timestamps
      .limit(100)
      .exec();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});


//Routes go here
app.get("/", (req, res) => {
  res.json({ Status: "Alive" });
});

//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  });
});

//app.post("/api/login", async (req, res) => {
//  console.log(req.body);
//  const username = req.body.user;
//  const password = req.body.passes;
//  const lastLoginTime = req.body.time;
//  try {
//    let getallconfiginfo =  await configurations.findOne({ configdetails : "mainconfiginformations"})
//    let foundUser = await Userlogin.findOne({ user: username, passes: password, SerialNumber: req.body.SerialNumber });
//    if (foundUser) {
//      foundUser.lastlogin = lastLoginTime;
//      foundUser.creationdate = req.body.botcreationdate
//      let savedUser = await foundUser.save();
//      const sendinfo = {
//        username: req.body.user,
//        aawasta: savedUser.ispreminum,
//        halkhabar: savedUser.isdevtester,
//        verified: true,
//        newuser: false,
//        mp1name : getallconfiginfo.mp1name,
//        mp2name : getallconfiginfo.mp2name,
//        multiplayeroneghost : getallconfiginfo.multiplayeroneghost,
//        multiplayeroneslipstream : getallconfiginfo.multiplayeroneslipstream,
//        multiplayertwotype : getallconfiginfo.multiplayertwotype,
//        multiplayertwoghost : getallconfiginfo.multiplayertwoghost,
//        multiplayertwoslipstream : getallconfiginfo.multiplayertwoslipstream,
//        multiplayertwoallcars : getallconfiginfo.multiplayertwoallcar,
//        multiplayertwosinglecarname : getallconfiginfo.multiplayertwosinglecarname,
//        carhuntname : getallconfiginfo.carhuntname,
//        carhunttrack :  getallconfiginfo.carhunttrack,
//        latestbuild : getallconfiginfo.latestbuild,
//        carhuntclass : getallconfiginfo.carhuntclass
//      };
//      return res.status(200).json(sendinfo);
//    } else {
//      let foundUserWithoutSerial = await Userlogin.findOne({ user: username, passes: password });
//      if (foundUserWithoutSerial) {
//        foundUserWithoutSerial.lastlogin = lastLoginTime;
//        foundUserWithoutSerial.creationdate = req.body.botcreationdate
//        let savedUser = await foundUserWithoutSerial.save();
//        const sendinfo = {
//          username: req.body.user,
//          aawasta: savedUser.ispreminum,
//          halkhabar: savedUser.isdevtester,
//          verified: false,
//          newuser: false,
//          mp1name : getallconfiginfo.mp1name,
//          mp2name : getallconfiginfo.mp2name,
//          multiplayeroneghost : getallconfiginfo.multiplayeroneghost,
//          multiplayeroneslipstream : getallconfiginfo.multiplayeroneslipstream,
//          multiplayertwotype : getallconfiginfo.multiplayertwotype,
//          multiplayertwoghost : getallconfiginfo.multiplayertwoghost,
//          multiplayertwoslipstream : getallconfiginfo.multiplayertwoslipstream,
//          multiplayertwoallcars : getallconfiginfo.multiplayertwoallcar,
//          multiplayertwosinglecarname : getallconfiginfo.multiplayertwosinglecarname,
//          carhuntname : getallconfiginfo.carhuntname,
//          carhunttrack :  getallconfiginfo.carhunttrack,
//          latestbuild : getallconfiginfo.latestbuild,
//          carhuntclass : getallconfiginfo.carhuntclass
//        };
//        return res.status(200).json(sendinfo);
//      } else {
//        // Check if user exists without checking password
//        let userExists = await Userlogin.findOne({ user: username });
//        let serialExists = await Userlogin.findOne({SerialNumber: req.body.SerialNumber})
//        if (userExists) {
//          // If user exists, send a 401 status
//          return res.status(401).json({ error: 'Unauthorized' });
//        } else if (serialExists){
//          return res.status(403).json({ error: 'Unauthorized' });
//        }  
//        else {
//          // If no user is found, save the request body
//          newuserdata = {
//            user: req.body.user,
//            passes: req.body.passes,
//            SerialNumber: req.body.SerialNumber,
//            lastlogin: req.body.time,
//            creationdate: req.body.botcreationdate,
//            ispreminum: false,
//            isdevtester: false
//          }
//          const newUser = new Userlogin(newuserdata);
//          let savedUser = await newUser.save();
//          const sendinfo = {
//            username: req.body.user,
//            aawasta: false,
//            halkhabar: false,
//            verified: false,
//            newuser: true,
//            mp1name : getallconfiginfo.mp1name,
//            mp2name : getallconfiginfo.mp2name,
//            multiplayeroneghost : getallconfiginfo.multiplayeroneghost,
//            multiplayeroneslipstream : getallconfiginfo.multiplayeroneslipstream,
//            multiplayertwotype : getallconfiginfo.multiplayertwotype,
//            multiplayertwoghost : getallconfiginfo.multiplayertwoghost,
//            multiplayertwoslipstream : getallconfiginfo.multiplayertwoslipstream,
//            multiplayertwoallcars : getallconfiginfo.multiplayertwoallcar,
//            multiplayertwosinglecarname : getallconfiginfo.multiplayertwosinglecarname,
//            carhuntname : getallconfiginfo.carhuntname,
//            carhunttrack :  getallconfiginfo.carhunttrack,
//            latestbuild : getallconfiginfo.latestbuild,
//            carhuntclass : getallconfiginfo.carhuntclass
//          };
//          return res.status(200).json(sendinfo);
//        }
//      }
//    }
//  } catch (err) {
//    console.error(err);
//    return res.status(500).json({ error: 'Server error' });
//  }
//});