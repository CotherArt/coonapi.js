import mongoose from "mongoose";

export enum RoleType {
  Administrator = "Administrator",
  User = "User",
  Moderator = "Moderator",
  Guest = "Guest",
}

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  profile: {
    img: { type: String , default: "profile_img.jpg"},
    name: { type: String },
    lastName: { type: String },
    sex: { type: String },
    birthDate: { type: Date },
    phoneNumber: { type: String },
  },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
    role: {
      type: String,
      enum: Object.values(RoleType),
      default: RoleType.User,
    },
  },
});

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserByUsername = (username: string) =>
  UserModel.findOne({ username });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({
    "authentication.sessionToken": sessionToken,
  });
export const getUserByID = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserByID = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
export const updateUserByID = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
