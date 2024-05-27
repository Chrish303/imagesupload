const { GraphQLUpload } = require('graphql-upload');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    files: async () => {
      return await prisma.file.findMany();
    },
  },
  Mutation: {
    uploadFile: async (_, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;

      const stream = createReadStream();
      const filePath = path.join(__dirname, `./uploads/${filename}`);
      await new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);
        stream.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      const newFile = await prisma.file.create({
        data: {
          filename,
          mimetype,
          encoding,
          path: filePath,
        },
      });

      return newFile;
    },
    uploadFiles: async (_, { files }) => {
      const uploadedFiles = [];

      for (const file of files) {
        const { createReadStream, filename, mimetype, encoding } = await file;

        const stream = createReadStream();
        const filePath = path.join(__dirname, `./uploads/${filename}`);
        await new Promise((resolve, reject) => {
          const writeStream = fs.createWriteStream(filePath);
          stream.pipe(writeStream);
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        });

        const newFile = await prisma.file.create({
          data: {
            filename,
            mimetype,
            encoding,
            path: filePath,
          },
        });

        uploadedFiles.push(newFile);
      }

      return uploadedFiles;
    },
  },
};

module.exports = resolvers;
