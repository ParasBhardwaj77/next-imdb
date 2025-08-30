import User from "../models/user.model";
import { connect } from "../mongodb/mongoose";

/**
 * Create or update a user in MongoDB
 * @param {string} id Clerk user ID
 * @param {string} first_name
 * @param {string} last_name
 * @param {string} image_url
 * @param {Array} email_addresses
 */
export const createOrUpdateUser = async (id, first_name, last_name, image_url, email_addresses) => {
  try {
    await connect();

    const email = email_addresses?.[0]?.email_address || "";

    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email,
        },
      },
      { upsert: true, new: true }
    );

    return user;
  } catch (error) {
    console.error("Error: Could not create or update user:", error);
    throw new Error("Database error in createOrUpdateUser");
  }
};

/**
 * Delete a user from MongoDB by Clerk ID
 * @param {string} id Clerk user ID
 */
export const deleteUser = async (id) => {
  try {
    await connect();
    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.error("Error: Could not delete user:", error);
    throw new Error("Database error in deleteUser");
  }
};
