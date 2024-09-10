import axios from "axios";
import { Request, Response } from "express";
import conversationModel from "../model/conversation.model";
import { getLocationToken } from "../utils/tokenAutomation";

// Function to fetch authorization code and access token
async function getAuthToken(locationId: string): Promise<void> {
  const tokenData = getLocationToken(locationId);
  return tokenData;
}

// Function to fetch conversation data
async function fetchConversations(authToken: string, locationId: string) {
  const options = {
    method: "GET",
    url: "https://services.leadconnectorhq.com/conversations/search",
    params: { locationId },
    headers: {
      Authorization: `Bearer ${authToken}`,
      Version: "2021-04-15",
      Accept: "application/json",
    },
  };

  const { data } = await axios.request(options);
  return data;
}

async function fetchMessages(authToken: string, conversationId: string) {
  const config = {
    method: "GET",
    url: `https://services.leadconnectorhq.com/conversations/${conversationId}/messages`,
    headers: {
      Authorization: `Bearer ${authToken}`,
      Version: "2021-04-15",
      Accept: "application/json",
    },
  };

  const { data } = await axios.request(config);
  return data;
}

// Main function to get all conversations
const getAllConversation = async (req: Request, res: Response): Promise<void> => {
  // try {
  //   const { locationId } = req.body;
  //   const authToken = await getAuthToken(locationId);
  //   const conversationData = await fetchConversations(authToken, locationId);
  //   const allConversationsWithMessages = [];
  //   for (const conversation of conversationData.conversations) {
  //     const totalMessages = await fetchMessages(authToken, conversation.id);
  //     const messagesArray = Array.isArray(totalMessages.messages.messages)
  //       ? totalMessages.messages.messages
  //       : [];
  //     const convoData = {
  //       conversationId: conversation.id,
  //       locationId: conversation.locationId,
  //       dateAdded: conversation.dateAdded,
  //       dateUpdated: conversation.dateUpdated,
  //       lastMessage: conversation.lastMessageBody,
  //       contactId: conversation.contactId,
  //       fullName: conversation.fullName,
  //       contactName: conversation.contactName,
  //       messages: messagesArray.map((message: any) => ({
  //         messageId: message.id,
  //         locationId: message.locationId,
  //         contactId: message.contactId,
  //         messageBody: message.body,
  //       })),
  //     };
  //     allConversationsWithMessages.push(convoData);
  //   }
  //   // At this point, you can save `allConversationsWithMessages` to your database
  //   const saveConvo = await conversationModel.insertMany(
  //     allConversationsWithMessages
  //   );
  //   res.status(200).json({
  //     status: true,
  //     data: saveConvo,
  //   });
  // } catch (err) {
  //   console.error(err);
  //   res.status(400).json({
  //     status: false,
  //     message: "Something went wrong while fetching conversation",
  //   });
  // }
};

export { getAllConversation };
