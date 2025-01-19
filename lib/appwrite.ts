import { Client, Account, ID, Avatars, Databases, Query, Storage, ImageGravity } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.quang.aora',
    projectId: '678b77e5000f153c3f9a',
    databaseId: '678b79b400035be3fbf7',
    userCollectionId: '678b7a4700289a3bd047',
    videoCollectionId: '678b7a67003736fbce9c',
    storageId: '678b7b8e0007f5bf8cbb'
}

const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export interface UserSignUp {
    email: string,
    password: string,
    username: string
}

export const createUser = async ({ email, password, username }: UserSignUp) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw new Error('Failed to create user')

        const avatarUrl = avatars.getInitials(username);
        console.log(`Avatar URL: ${avatarUrl}`)

        await signIn({ email, password });

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )
        console.log(`New user: ${newUser}`)

        return newUser;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export interface UserSignIn {
    email: string,
    password: string
}

export const signIn = async ({ email, password }: UserSignIn) => {
    try {
        var result = await account.createEmailPasswordSession(email, password);
        console.log(`Sign in result: ${result}`);
        return result;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw new Error('Failed to get user session')

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        )

        if (!currentUser) throw new Error('Failed to get user')

        return currentUser.documents[0];
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getAllPosts = async () => {
    try {
        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId
        )

        return result.documents;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getLatestPost = async () => {
    try {
        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(5)]
        )

        return result.documents;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const searchPost = async (query: string) => {
    try {
        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.search("title", query)]
        )

        return result.documents;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getUserPosts = async (userId: string) => {
    try {
        const result = await databases.listDocuments(
            appwriteConfig.databaseId,  
            appwriteConfig.videoCollectionId,
            [Query.equal('creator', userId)]
        )

        return result.documents;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const signOut = async () => {
    try {
        const result = await account.deleteSession('current');

        return result;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getFilePreview(fileId: any, type: any) {
    let fileUrl;
  
    try {
      if (type === "video") {
        fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
      } else if (type === "image") {
        fileUrl = storage.getFilePreview(
          appwriteConfig.storageId,
          fileId,
          2000,
          2000,
          ImageGravity.Top,
          100
        );
      } else {
        throw new Error("Invalid file type");
      }
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
  } 

export const uploadFile = async (file: any, type: string) => {
    if (!file) return;

    const { mineType, ...rest } = file;
    const asset = { type: mineType, ...rest };

    try {
        const result = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            asset);

        const fileUrl = await getFilePreview(result.$id, type);

        return fileUrl;

        return result;
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const createVideoPost = async ({ title, video, thumbnail, prompt, userId }: any) => {
    try{
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(thumbnail, "image"),
            uploadFile(video, "video")
        ]);

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            ID.unique(),
            {
                title,
                video: videoUrl,
                thumbnail: thumbnailUrl,
                prompt,
                creator: userId
            }
        )
    } catch (error) {
        console.log(error)
        throw error
    }
}