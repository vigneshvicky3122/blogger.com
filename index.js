const express = require("express");
const { mailer } = require("./nodemailer");
const { uploadFile } = require("./S3");
const { hashPassword, hashCompare } = require("./hashPassword");
const { authentication, createToken } = require("./auth");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const multer = require("multer");
const { MongoClient, ObjectId } = require("mongodb");
const Client = new MongoClient(process.env.DB_URL);
const PORT = process.env.PORT || 8000;
const app = express();
const upload = multer();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.get("/dashboard", authentication, async (req, res) => {
  await Client.connect();
  try {
    const Db = Client.db(process.env.DB_NAME);
    let user = await Db.collection(process.env.DB_COLLECTION_ONE).findOne({
      username: req.headers.username,
    });

    let post = await Db.collection(process.env.DB_COLLECTION_TWO)
      .find()
      .toArray();
    if (user && post) {
      res.json({
        statusCode: 200,
        user,
        post,
      });
    } else {
      res.json({
        statusCode: 401,
        message: "couldn't connect",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal server error",
    });
  } finally {
    Client.close();
  }
});
// app.get("/edit_profile/:id", authentication, async (req, res) => {
//   await Client.connect();
//   try {
//     const Db = Client.db(process.env.DB_NAME);
//     let user = await Db.collection(process.env.DB_COLLECTION_ONE)
//       .find({ username: req.params.id })
//       .toArray();
//     if (user) {
//       res.json({
//         statusCode: 200,
//         user,
//       });
//     } else {
//       res.json({
//         statusCode: 401,
//         message: "couldn't connect",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({
//       statusCode: 500,
//       message: "internal server error",
//     });
//   } finally {
//     await Client.close();
//   }
// });
app.get("/user/:username", async (req, res) => {
  await Client.connect();
  try {
    const Db = Client.db(process.env.DB_NAME);
    let user = await Db.collection(process.env.DB_COLLECTION_ONE)
      .find({ username: req.params.username })
      .toArray();
    let post = await Db.collection(process.env.DB_COLLECTION_TWO)
      .find({ "Author.username": req.params.username })
      .toArray();
    if (user && post) {
      res.json({
        statusCode: 200,
        user,
        post,
      });
    } else {
      res.json({
        statusCode: 401,
        message: "couldn't connect",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal server error",
    });
  } finally {
    await Client.close();
  }
});
app.get("/post", authentication, async (req, res) => {
  await Client.connect();
  try {
    const Db = Client.db(process.env.DB_NAME);
    let post = await Db.collection(process.env.DB_COLLECTION_TWO)
      .find()
      .toArray();
    if (post) {
      res.json({
        statusCode: 200,
        post,
      });
    } else {
      res.json({
        statusCode: 401,
        message: "couldn't connect",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal server error",
    });
  } finally {
    await Client.close();
  }
});
app.get("/myData/:id", authentication, async (req, res) => {
  await Client.connect();
  try {
    const Db = Client.db(process.env.DB_NAME);
    let user = await Db.collection(process.env.DB_COLLECTION_ONE)
      .find({ username: req.params.id })
      .toArray();
    let post = await Db.collection(process.env.DB_COLLECTION_TWO)
      .find({ "Author.username": req.params.id })
      .toArray();
    if (user && post) {
      res.json({
        statusCode: 200,
        user,
        post,
      });
    } else {
      res.json({
        statusCode: 401,
        message: "couldn't connect",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal server error",
    });
  } finally {
    await Client.close();
  }
});
app.get("/post/:id", authentication, async (req, res) => {
  await Client.connect();

  try {
    const Db = Client.db(process.env.DB_NAME);
    let post = await Db.collection(process.env.DB_COLLECTION_TWO)
      .find({ _id: new ObjectId(req.params.id) })
      .toArray();

    if (post) {
      res.json({
        statusCode: 200,
        post,
      });
    } else {
      res.json({
        statusCode: 401,
        message: "couldn't connect",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal server error",
    });
  } finally {
    await Client.close();
  }
});
app.put("/edit-post/:id", authentication, upload.any(), async (req, res) => {
  await Client.connect();
  let { Image, Content, Keywords, Category, CreatedAt, Tittle } = req.body;
  try {
    if (Image.includes(process.env.AWS_CLOUDFRONT_KEY)) {
      const Db = Client.db(process.env.DB_NAME);
      let update = await Db.collection(
        process.env.DB_COLLECTION_TWO
      ).findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        {
          $set: {
            Tittle,
            Content,
            Category,
            Keywords,
            CreatedAt,
          },
        }
      );
      if (update) {
        res.json({
          statusCode: 200,
          message: "upload successful",
        });
      } else {
        res.json({
          statusCode: 401,
          message: "upload failed",
        });
      }
    } else {
      const result = await uploadFile(Image);
      const Db = Client.db(process.env.DB_NAME);
      let update = await Db.collection(
        process.env.DB_COLLECTION_TWO
      ).findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        {
          $set: {
            Tittle,
            Content,
            Category,
            Keywords,
            CreatedAt,
            Image: process.env.AWS_CLOUDFRONT_KEY + result.Key,
          },
        }
      );

      if (update) {
        res.json({
          statusCode: 200,
          message: "upload successful",
        });
      } else {
        res.json({
          statusCode: 401,
          message: "upload failed",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal server error",
    });
  } finally {
    await Client.close();
  }
});
app.put(
  "/edit/profile/:username",
  authentication,
  upload.any(),
  async (req, res) => {
    await Client.connect();
    let { Image, Name, Bio } = req.body;
    try {
      const Db = Client.db(process.env.DB_NAME);
      let user = await Db.collection(process.env.DB_COLLECTION_ONE)
        .find({ username: req.params.username })
        .toArray();

      var profile;

      if (Image.includes(process.env.AWS_CLOUDFRONT_KEY)) {
        profile = Image;
      } else {
        const result = await uploadFile(Image);
        profile = process.env.AWS_CLOUDFRONT_KEY + result.Key;
      }

      let verify = await Db.collection(process.env.DB_COLLECTION_ONE)
        .find({ username: req.params.username })
        .toArray();

      let checkAuthor = await Db.collection(process.env.DB_COLLECTION_TWO)
        .find({ "Author.username": user[0].username })
        .toArray();

      for (let index = 0; index < checkAuthor.length; index++) {
        const id = checkAuthor[index]._id;

        let updatePost = await Db.collection(
          process.env.DB_COLLECTION_TWO
        ).findOneAndUpdate(
          { _id: new ObjectId(id) },
          {
            $set: {
              Author: {
                username: verify[0].username,
                profilePic: verify[0].profile,
              },
            },
          }
        );
      }
      let update = await Db.collection(
        process.env.DB_COLLECTION_ONE
      ).findOneAndUpdate(
        { username: user[0].username },
        {
          $set: {
            bio: Bio,
            name: Name,
            profile,
          },
        }
      );
      if (update) {
        res.json({
          statusCode: 200,
          message: "upload successful",
        });
      } else {
        res.json({
          statusCode: 401,
          message: "upload failed",
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        statusCode: 500,
        message: "internal server error",
      });
    } finally {
      await Client.close();
    }
  }
);
app.post("/post", authentication, upload.any(), async (req, res) => {
  await Client.connect();
  try {
    let { Image, Content, Keywords, Category, CreatedAt, Tittle } = req.body;
    const result = await uploadFile(Image);
    const Db = Client.db(process.env.DB_NAME);
    let user = await Db.collection(process.env.DB_COLLECTION_ONE)
      .find({ username: req.headers.username })
      .toArray();
    const updateData = {
      Tittle,
      Content,
      Category,
      Keywords,
      Image: process.env.AWS_CLOUDFRONT_KEY + result.Key,
      CreatedAt,
      Author: { username: user[0].username, profilePic: user[0].profilePic },
      Likes: [],
      Comments: [],
    };

    let post = await Db.collection(process.env.DB_COLLECTION_TWO).insertOne(
      updateData
    );

    if (post) {
      res.json({
        statusCode: 200,
        message: "Upload successful",
      });
    } else {
      res.json({
        statusCode: 401,
        message: "Upload failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal server error",
    });
  } finally {
    await Client.close();
  }
});
app.put("/like/:id", authentication, async (req, res) => {
  await Client.connect();

  try {
    const Db = Client.db(process.env.DB_NAME);
    let like = await Db.collection(
      process.env.DB_COLLECTION_TWO
    ).findOneAndUpdate(
      { _id: ObjectId(req.params.id) },
      { $push: { Likes: req.body.likedBy } }
    );
    if (like) {
      res.json({
        statusCode: 200,
        message: `you liked that post ${req.params.id}`,
      });
    } else {
      res.json({
        statusCode: 401,
        message: "upload failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal server error",
    });
  } finally {
    await Client.close();
  }
});
app.put("/unLike/:id", authentication, async (req, res) => {
  await Client.connect();
  try {
    const Db = Client.db(process.env.DB_NAME);
    let unlike = await Db.collection(
      process.env.DB_COLLECTION_TWO
    ).findOneAndUpdate(
      { _id: ObjectId(req.params.id) },
      { $pull: { Likes: req.body.likedBy } }
    );
    if (unlike) {
      res.json({
        statusCode: 200,
        message: `you unliked that post ${req.params.id}`,
      });
    } else {
      res.json({
        statusCode: 401,
        message: "upload failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal server error",
    });
  } finally {
    await Client.close();
  }
});
app.post("/comments/:id", authentication, async (req, res) => {
  await Client.connect();
  try {
    const Db = Client.db(process.env.DB_NAME);
    let comments = await Db.collection(
      process.env.DB_COLLECTION_TWO
    ).findOneAndUpdate(
      { _id: ObjectId(req.params.id) },
      { $push: { Comments: req.body } }
    );
    if (comments) {
      res.json({
        statusCode: 200,
        message: `you Commented that post ${req.params.id}`,
      });
    } else {
      res.json({
        statusCode: 401,
        message: "upload failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal server error",
    });
  } finally {
    await Client.close();
  }
});
app.put("/follow/:id", authentication, async (req, res) => {
  await Client.connect();

  try {
    const Db = Client.db(process.env.DB_NAME);
    let following = await Db.collection(
      process.env.DB_COLLECTION_ONE
    ).findOneAndUpdate(
      { username: req.params.id },
      { $push: { Following: req.body.followingTo } }
    );
    let followers = await Db.collection(
      process.env.DB_COLLECTION_ONE
    ).findOneAndUpdate(
      { username: req.body.followingTo },
      { $push: { Followers: req.params.id } }
    );
    if (followers && following) {
      res.json({
        statusCode: 200,
        message: `you following that user ${req.body.followingTo}`,
      });
    } else {
      res.json({
        statusCode: 401,
        message: "upload failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal server error",
    });
  } finally {
    await Client.close();
  }
});
app.put("/unfollow/:id", authentication, async (req, res) => {
  await Client.connect();

  try {
    const Db = Client.db(process.env.DB_NAME);
    let unfollow = await Db.collection(
      process.env.DB_COLLECTION_ONE
    ).findOneAndUpdate(
      { username: req.params.id },
      { $pull: { Following: req.body.followingTo } }
    );

    let followers = await Db.collection(
      process.env.DB_COLLECTION_ONE
    ).updateOne(
      { username: req.body.followingTo },
      { $pull: { Followers: req.params.id } }
    );

    if (followers && unfollow) {
      res.json({
        statusCode: 200,
        message: `you unfollow that user ${req.body.followingTo}`,
      });
    } else {
      res.json({
        statusCode: 401,
        message: "upload failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal server error",
    });
  } finally {
    await Client.close();
  }
});
app.post("/signup", async (req, res) => {
  await Client.connect();
  try {
    const Db = Client.db(process.env.DB_NAME);
    let email = await Db.collection(process.env.DB_COLLECTION_ONE)
      .find({ email: req.body.email })
      .toArray();
    let username = await Db.collection(process.env.DB_COLLECTION_ONE)
      .find({ username: req.body.username })
      .toArray();
    if ((username.length === 0) & (email.length === 0)) {
      let hash_password = await hashPassword(req.body.password);
      let userData = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: hash_password,
        createdAt: Date(),
        Followers: [],
        Following: [],
      };
      let user = await Db.collection(process.env.DB_COLLECTION_ONE).insertOne(
        userData
      );
      if (user) {
        res.json({
          statusCode: 200,
          message: "Signup successful",
        });
      }
    } else {
      res.json({
        statusCode: 401,
        message: "User was already exist please login...",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal server error",
    });
  } finally {
    await Client.close();
  }
});
app.post("/login", async (req, res) => {
  await Client.connect();
  try {
    const Db = Client.db(process.env.DB_NAME);
    let user = await Db.collection(process.env.DB_COLLECTION_ONE)
      .find({ email: req.body.email })
      .toArray();
    if (user.length === 1) {
      let hashResult = await hashCompare(req.body.password, user[0].password);
      if (hashResult) {
        let token = await createToken({
          email: user[0].email,
          username: user[0].username,
          name: user[0].name,
        });
        if (token) {
          res.json({
            statusCode: 200,
            message: "Login successful",
            token,
            user,
          });
        }
      } else {
        res.json({
          statusCode: 401,
          message: "Invalid credentials",
        });
      }
    } else {
      res.json({
        statusCode: 404,
        message: "User does not exist, please signup",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal server error",
    });
  } finally {
    await Client.close();
  }
});
app.post("/reset-email-verify", async (req, res) => {
  await Client.connect();
  try {
    const Db = Client.db(process.env.DB_NAME);

    let user = await Db.collection(process.env.DB_COLLECTION_ONE)
      .find({ email: req.body.email })
      .toArray();

    if (user.length === 1) {
      let digits = "123456789";
      let OTP = "";
      for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 9)];
      }

      if (OTP) {
        let saveOtp = await Db.collection(
          process.env.DB_COLLECTION_ONE
        ).findOneAndUpdate(
          { _id: ObjectId(user[0]._id) },
          { $set: { otp: OTP } }
        );
        if (saveOtp) {
          await mailer(req.body.email, OTP);
          res.json({
            statusCode: 200,
            message: "OTP has sent successful",
          });
        } else {
          res.json({
            statusCode: 402,
            message: "Otp generation failed",
          });
        }
      } else {
        res.json({
          statusCode: 403,
          message: "Otp generation failed",
        });
      }
    } else {
      res.json({
        statusCode: 404,
        message: "User does not exist, Do register...",
      });
    }
  } catch {
    res.json({
      statusCode: 500,
      message: "Internal server error",
    });
  } finally {
    await Client.close();
  }
});
app.post("/reset-otp-verify", async (req, res) => {
  await Client.connect();
  try {
    const Db = Client.db(process.env.DB_NAME);
    let user = await Db.collection(process.env.DB_COLLECTION_ONE)
      .find({ email: req.body.user })
      .toArray();
    if (user) {
      let verify = user[0].otp == req.body.data.otp;
      if (verify) {
        res.json({
          statusCode: 200,
          message: "Verification successful. Wait...",
          userId: user[0]._id,
        });
      } else {
        res.json({
          statusCode: 401,
          message: "invalid Otp",
        });
      }
    } else {
      res.json({
        statusCode: 402,
        message: "User does not exist",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal server error",
    });
  } finally {
    await Client.close();
  }
});
app.put("/password/reset/:id", async (req, res) => {
  await Client.connect();
  try {
    const Db = Client.db(process.env.DB_NAME);
    let users = await Db.collection(process.env.DB_COLLECTION_ONE)
      .find({ _id: new ObjectId(req.params.id) })
      .toArray();
    if (users) {
      if (req.body.password === req.body.confirmPassword) {
        let hashpassword = await hashPassword(req.body.password);

        if (hashpassword) {
          let users = await Db.collection(
            process.env.DB_COLLECTION_ONE
          ).findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: { password: hashpassword, otp: "" } }
          );
          if (users) {
            res.json({
              statusCode: 200,
              message: "Password changed successfully",
            });
          }
        }
      } else {
        res.json({
          statusCode: 403,
          message: "Details does not match",
        });
      }
    } else {
      res.json({
        statusCode: 404,
        message: "Time expired, Retry...",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal server error",
    });
  } finally {
    await Client.close();
  }
});
app.delete("/delete-post/:id", authentication, async (req, res) => {
  await Client.connect();
  try {
    const Db = Client.db(process.env.DB_NAME);
    let deleteOne = await Db.collection(
      process.env.DB_COLLECTION_TWO
    ).deleteOne({ _id: ObjectId(req.params.id) });
    if (deleteOne) {
      res.json({
        statusCode: 200,
        message: "Post deleted",
      });
    } else {
      res.json({
        statusCode: 401,
        message: "Process failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal server error",
    });
  } finally {
    await Client.close();
  }
});
app.listen(PORT, () => {
  console.log("Server running into port " + PORT);
});
