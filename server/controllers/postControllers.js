const Post = require("../models/postModel");
const User = require("../models/userModel");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");

const createPost = async (req, res, next) => {
  try {
    let { title, category, description } = req.body;

    // Check if all fields are provided
    if (!title || !category || !description || !req.files?.thumbnail) {
      return next(
        new HttpError("Fill in all fields and choose thumbnail.", 422)
      );
    }

    const thumbnail = req.files.thumbnail;

    // Check the file size
    if (thumbnail.size > 2000000) {
      return next(
        new HttpError("Thumbnail too big. File should be less than 2MB.", 422)
      );
    }

    // Generate a new filename
    const fileName = thumbnail.name;
    const splittedFilename = fileName.split(".");
    const newFilename = `${
      splittedFilename[0]
    }_${uuid()}.${splittedFilename.pop()}`;

    // Move the file asynchronously with Promise
    await thumbnail.mv(path.join(__dirname, "..", "uploads", newFilename));

    const newPost = await Post.create({
      title,
      category,
      description,
      thumbnail: newFilename,
      creator: req.user.id,
    });

    if (!newPost) {
      return next(new HttpError("Post couldn't be created", 422));
    }

    // Update user post count
    await User.findByIdAndUpdate(req.user.id, { $inc: { posts: 1 } });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error); // Log the error
    return next(new HttpError(error.message || "Could not create post", 500));
  }
};

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updateAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found.", 404));
    }

    res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getCatPosts = async (req, res, next) => {
  try {
    const { category } = req.params;
    const catPosts = await Post.find({ category }).sort({ createdAt: -1 });
    res.json(catPosts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const editPost = async (req, res, next) => {
  try {
    let fileName;
    let newFilename;
    let updatedPost;
    const { postId } = req.params; // Ensure postId is being passed correctly
    let { title, category, description } = req.body;

    // Validate input fields
    if (!title || !category || description.length < 12) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    // Fetch the old post from the database
    const oldPost = await Post.findById(postId);

    // Check if post exists
    if (!oldPost) {
      console.error(`Post with ID ${postId} not found`);
      return next(new HttpError("Post not found.", 404));
    }

    // Ensure the user is the creator of the post
    if (req.user.id !== oldPost.creator) {
      return next(new HttpError("Unauthorized to edit this post.", 403));
    }

    // Check if there are no files uploaded
    if (!req.files || !req.files.thumbnail) {
      // Update without thumbnail
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, category, description },
        { new: true }
      );
    } else {
      // Delete old thumbnail if it exists
      if (oldPost.thumbnail) {
        fs.unlink(
          path.join(__dirname, "..", "uploads", oldPost.thumbnail),
          (err) => {
            if (err) {
              console.error(`Failed to delete old thumbnail: ${err.message}`);
              return next(
                new HttpError("Failed to delete old thumbnail.", 500)
              );
            }
          }
        );
      }

      // Upload new thumbnail
      const { thumbnail } = req.files;

      // Check file size
      if (thumbnail.size > 2000000) {
        return next(
          new HttpError("Thumbnail too big. Should be less than 2MB", 413)
        );
      }

      fileName = thumbnail.name;
      let splittedFilename = fileName.split(".");
      newFilename = `${
        splittedFilename[0]
      }_${uuid()}.${splittedFilename.pop()}`;

      thumbnail.mv(
        path.join(__dirname, "..", "uploads", newFilename),
        async (err) => {
          if (err) {
            console.error(`Error moving new thumbnail: ${err.message}`);
            return next(new HttpError("Failed to upload new thumbnail.", 500));
          }

          // Update post with new thumbnail
          updatedPost = await Post.findByIdAndUpdate(
            postId,
            { title, category, description, thumbnail: newFilename },
            { new: true }
          );

          if (!updatedPost) {
            console.error("Failed to update post after thumbnail upload.");
            return next(new HttpError("Couldn't update post.", 400));
          }

          // Send response after successful update
          res.status(200).json(updatedPost);
        }
      );

      // Return early to wait for async callback
      return;
    }

    // Check if the update was successful
    if (!updatedPost) {
      console.error("Post update failed without file upload.");
      return next(new HttpError("Couldn't update post.", 400));
    }

    // Send success response
    res.status(200).json(updatedPost);
  } catch (error) {
    // Log the error for debugging
    console.error("Error in editPost:", error);

    // Send the error to the error handler
    return next(new HttpError(error.message, 500));
  }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return next(new HttpError("Post unavailable.", 400));
    }
    const post = await Post.findById(postId);
    const fileName = post?.thumbnail;
    if (req.user.id == post.creator) {
      // delete thumbnail from uploads folder
      fs.unlink(
        path.join(__dirname, "..", "uploads", fileName),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          } else {
            await Post.findByIdAndDelete(postId);
            // find user and reduce post count by 1
            const currentUser = await User.findById(req.user.id);
            const userPostCount = currentUser?.posts - 1;
            await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
          }
        }
      );

      res.json(`Post ${postId} deleted successfully`);
    } else {
      return next(new HttpError("Post couldnt be deleted ", 403));
    }
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getCatPosts,
  getUserPosts,
  editPost,
  deletePost,
};
