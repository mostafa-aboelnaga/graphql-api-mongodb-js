const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
} = graphql;

const User = require("../model/user");
const Hobby = require("../model/hobby");
const Post = require("../model/post");
const { assign } = require("lodash");

// var usersData = [
//   {
//     id: "1",
//     name: "Mostafa",
//     age: 22,
//     profession: "Progammer",
//   },
//   {
//     id: "2",
//     name: "Salwa",
//     age: 25,
//     profession: "Designer",
//   },
//   {
//     id: "3",
//     name: "Amal",
//     age: 45,
//     profession: "Mother",
//   },
//   {
//     id: "4",
//     name: "Mohamed",
//     age: 30,
//     profession: "Brother",
//   },
//   {
//     id: "5",
//     name: "Kamal",
//     age: 70,
//     profession: "Father",
//   },
// ];

// var hobbiesData = [
//   {
//     id: "1",
//     title: "Programming",
//     description: "Using computers to make..",
//     userId: "4",
//   },
//   {
//     id: "2",
//     title: "2Programming",
//     description: "2Using computers to make..",
//     userId: "3",
//   },
//   {
//     id: "3",
//     title: "3Programming",
//     description: "3Using computers to make..",
//     userId: "2",
//   },
//   {
//     id: "4",
//     title: "4Programming",
//     description: "4Using computers to make..",
//     userId: "1",
//   },
// ];
// var postsData = [
//   { id: "1", comment: "Using computers to make..", userId: "1" },
//   { id: "2", comment: "2Using computers to make..", userId: "1" },
//   { id: "3", comment: "3Using computers to make..", userId: "3" },
// ];

const UserType = new GraphQLObjectType({
  name: "User",
  description: "Documentation for user...",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({ userId: parent.id });
      },
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return Hobby.find({ userId: parent.id });
      },
    },
  }),
});

const HobbyType = new GraphQLObjectType({
  name: "Hobby",
  description: "Hobby desc",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "Post desc",
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Desc",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },

    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      },
    },

    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Hobby.find({ id: args.id });
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return Hobby.find({});
      },
    },

    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Post.find({ id: args.id });
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "Desc",
  fields: {
    CreateUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let user = User({
          name: args.name,
          age: args.age,
          profession: args.profession,
        });
        return user.save();
      },
    },
    UpdateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return (updatedUser = User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              age: args.age,
              profession: args.profession,
            },
          },
          { new: true },
        ));
      },
    },
    DeleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let deletedUser = User.findByIdAndRemove(args.id).exec();
        if (!deletedUser) throw new "Error"();
        return deletedUser;
      },
    },
    CreatePost: {
      type: PostType,
      args: {
        comment: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let post = Post({
          comment: args.comment,
          userId: args.userId,
        });
        return post.save();
      },
    },
    UpdatePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        comment: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return (updatedPost = Post.findByIdAndUpdate(
          args.id,
          {
            $set: {
              comment: args.comment,
            },
          },
          { new: true },
        ));
      },
    },
    DeletePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let deletedPost = Post.findByIdAndRemove(args.id).exec();
        if (!deletedPost) throw new "Error"();
        return deletedPost;
      },
    },
    CreateHobby: {
      type: HobbyType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let hobby = Hobby({
          title: args.title,
          description: args.description,
          userId: args.userId,
        });
        return hobby.save();
      },
    },
    UpdateHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return (UpdatedHobby = Hobby.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              description: args.description,
            },
          },
          { new: true },
        ));
      },
    },
    DeleteHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let deletedHobby = Hobby.findByIdAndRemove(args.id).exec();
        if (!deletedHobby) throw new "Error"();
        return deletedHobby;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
