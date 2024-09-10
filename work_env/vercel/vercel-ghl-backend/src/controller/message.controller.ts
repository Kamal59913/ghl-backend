import axios, { AxiosRequestConfig } from "axios";
import { Request, response, Response } from "express";


const createConversationFunction = async (location_id: any, contact_id: any) => {
  let response_data;
  try {
    const response = await axios.post(
      'https://services.leadconnectorhq.com/conversations/',
      {
        locationId: location_id,
        contactId: contact_id
      },
      {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJMb2NhdGlvbiIsImF1dGhDbGFzc0lkIjoiZ3NUTTdhU3E2NnA2QjNiT1RoZ2giLCJzb3VyY2UiOiJJTlRFR1JBVElPTiIsInNvdXJjZUlkIjoiNjY5NWVkYWY1MTM1MzhjMTY2ZmMwMWRiLWx5d25nOGtnIiwiY2hhbm5lbCI6Ik9BVVRIIiwicHJpbWFyeUF1dGhDbGFzc0lkIjoiZ3NUTTdhU3E2NnA2QjNiT1RoZ2giLCJvYXV0aE1ldGEiOnsic2NvcGVzIjpbImNvbnRhY3RzLnJlYWRvbmx5IiwiY29udGFjdHMud3JpdGUiLCJmb3Jtcy5yZWFkb25seSIsImZvcm1zLndyaXRlIiwidXNlcnMucmVhZG9ubHkiLCJ1c2Vycy53cml0ZSIsImxvY2F0aW9ucy5yZWFkb25seSIsImxvY2F0aW9ucy9jdXN0b21WYWx1ZXMucmVhZG9ubHkiLCJsb2NhdGlvbnMvY3VzdG9tRmllbGRzLnJlYWRvbmx5IiwibG9jYXRpb25zL2N1c3RvbVZhbHVlcy53cml0ZSIsImxvY2F0aW9ucy9jdXN0b21GaWVsZHMud3JpdGUiLCJjb252ZXJzYXRpb25zL21lc3NhZ2Uud3JpdGUiLCJjb252ZXJzYXRpb25zL21lc3NhZ2UucmVhZG9ubHkiLCJjb252ZXJzYXRpb25zLnJlYWRvbmx5IiwiY29udmVyc2F0aW9ucy53cml0ZSIsImNvbnZlcnNhdGlvbnMvcmVwb3J0cy5yZWFkb25seSJdLCJjbGllbnQiOiI2Njk1ZWRhZjUxMzUzOGMxNjZmYzAxZGIiLCJjbGllbnRLZXkiOiI2Njk1ZWRhZjUxMzUzOGMxNjZmYzAxZGItbHl3bmc4a2cifSwiaWF0IjoxNzIxODIyNzQ1LjIyOCwiZXhwIjoxNzIxOTA5MTQ1LjIyOH0.t12qNTyRAwBX5Rez9yPHXNBtnDNqwC7Yt7A7g0V16B_U8Ud7KF8gU4BhLeNfuykP3N3uzWMLMhChfMnn-AyWUL3f6y-o3T4slbTO1WumJorc0YWdjs8Qak32nTOADaXiMoAGumW8grUIp0Rtke6RsbB5EeDN_fVlK6IQM0Gv1nBMPTptImwFSwje4-QBh6Xb7o-rGBKSF1kQW4KcdbbGyxe-iX_0X5WcqYEFcpaUWQTgOkuM_X0iMLNowNGb6NB3C0iLmX2C5vy7RC4XfXDKUgAEvJoa4UBlCVZqh_ihs1EVgfRwLA3tzzx8c6MwgV_6mi5rEs0oA28pfzipq24kAaeBGIYLAISnOClDmCO384HmdtR8yhLFKdszsBol5PobMrJlKqZJVgz72JrahnB1u-TB1tEBUzWRM5CcIyWeGYj_l78JR9upPJh79A8Zho6rYTnhK19F5sfCvr3Z8rX6VFAgha3jWY0ewpUKR6ArmDUx8YyFupzz8Wl9OZPhi2EMFBsczvMKmL2iHLG17NRb10emlhtscA7_tfTxXvqNzD3QzXivgwc2XTQI6ji9iWA7v3PIW2AqKrIZfIbWdv65aMvY4Hl4J-VA-wIw3MuYg-ceD4Lf75ysKYosR9oD9Gfvdl1-GUU7HYXJxWHCr4VGLoBt7n6Eib4j4FVl84ktF2s',
          Version: '2021-04-15',
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    );
    response_data = response.data;
  } catch (error: any) {
    response_data = error.response.data;
  }
  return response_data;
};

const fetchConversations = async (locationId: string, limit: number) => {
  try {
    const response = await axios.get('https://services.leadconnectorhq.com/conversations/search', {
      headers: {
        Authorization: process.env.AUTHORIZATION_TOKEN,
        Version: process.env.VERSION,
        Accept: process.env.ACCEPT,
      },
      params: {
        locationId: locationId,
        limit: limit,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching conversations:", error.response?.data || error.message);
    throw error;
  }
};

const findConversation = async (conversation: any, contact_id: any) => {
  
  const { conversations } = conversation;
  for(let i = 0; i<conversations.length; i++) {
    if(conversations[i].contactId == contact_id) {
        return conversations[i].id
    }
  }

  return null;
};

const getContactId = async (location_id: any) => {
  
  let contactId;
  let contacts = []

  const response= await axios.get('https://services.leadconnectorhq.com/contacts/',{
    headers: {
      Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJMb2NhdGlvbiIsImF1dGhDbGFzc0lkIjoiZ3NUTTdhU3E2NnA2QjNiT1RoZ2giLCJzb3VyY2UiOiJJTlRFR1JBVElPTiIsInNvdXJjZUlkIjoiNjY5NWVkYWY1MTM1MzhjMTY2ZmMwMWRiLWx5d25nOGtnIiwiY2hhbm5lbCI6Ik9BVVRIIiwicHJpbWFyeUF1dGhDbGFzc0lkIjoiZ3NUTTdhU3E2NnA2QjNiT1RoZ2giLCJvYXV0aE1ldGEiOnsic2NvcGVzIjpbImNvbnRhY3RzLnJlYWRvbmx5IiwiY29udGFjdHMud3JpdGUiLCJmb3Jtcy5yZWFkb25seSIsImZvcm1zLndyaXRlIiwidXNlcnMucmVhZG9ubHkiLCJ1c2Vycy53cml0ZSIsImxvY2F0aW9ucy5yZWFkb25seSIsImxvY2F0aW9ucy9jdXN0b21WYWx1ZXMucmVhZG9ubHkiLCJsb2NhdGlvbnMvY3VzdG9tRmllbGRzLnJlYWRvbmx5IiwibG9jYXRpb25zL2N1c3RvbVZhbHVlcy53cml0ZSIsImxvY2F0aW9ucy9jdXN0b21GaWVsZHMud3JpdGUiLCJjb252ZXJzYXRpb25zL21lc3NhZ2Uud3JpdGUiLCJjb252ZXJzYXRpb25zL21lc3NhZ2UucmVhZG9ubHkiLCJjb252ZXJzYXRpb25zLnJlYWRvbmx5IiwiY29udmVyc2F0aW9ucy53cml0ZSIsImNvbnZlcnNhdGlvbnMvcmVwb3J0cy5yZWFkb25seSJdLCJjbGllbnQiOiI2Njk1ZWRhZjUxMzUzOGMxNjZmYzAxZGIiLCJjbGllbnRLZXkiOiI2Njk1ZWRhZjUxMzUzOGMxNjZmYzAxZGItbHl3bmc4a2cifSwiaWF0IjoxNzIxODIyNzQ1LjIyOCwiZXhwIjoxNzIxOTA5MTQ1LjIyOH0.t12qNTyRAwBX5Rez9yPHXNBtnDNqwC7Yt7A7g0V16B_U8Ud7KF8gU4BhLeNfuykP3N3uzWMLMhChfMnn-AyWUL3f6y-o3T4slbTO1WumJorc0YWdjs8Qak32nTOADaXiMoAGumW8grUIp0Rtke6RsbB5EeDN_fVlK6IQM0Gv1nBMPTptImwFSwje4-QBh6Xb7o-rGBKSF1kQW4KcdbbGyxe-iX_0X5WcqYEFcpaUWQTgOkuM_X0iMLNowNGb6NB3C0iLmX2C5vy7RC4XfXDKUgAEvJoa4UBlCVZqh_ihs1EVgfRwLA3tzzx8c6MwgV_6mi5rEs0oA28pfzipq24kAaeBGIYLAISnOClDmCO384HmdtR8yhLFKdszsBol5PobMrJlKqZJVgz72JrahnB1u-TB1tEBUzWRM5CcIyWeGYj_l78JR9upPJh79A8Zho6rYTnhK19F5sfCvr3Z8rX6VFAgha3jWY0ewpUKR6ArmDUx8YyFupzz8Wl9OZPhi2EMFBsczvMKmL2iHLG17NRb10emlhtscA7_tfTxXvqNzD3QzXivgwc2XTQI6ji9iWA7v3PIW2AqKrIZfIbWdv65aMvY4Hl4J-VA-wIw3MuYg-ceD4Lf75ysKYosR9oD9Gfvdl1-GUU7HYXJxWHCr4VGLoBt7n6Eib4j4FVl84ktF2s',
      Version: '2021-07-28',
      Accept: 'application/json'
    }, 
    params: {locationId: location_id, limit: '20'},
  });
  contacts.push(...response.data.contacts)


  for(let i=0; i<contacts.length; i++) {
    if(contacts[i].locationId === location_id) {
      contactId = contacts[i].id
    }
  }

  return contactId;
};


const sendMessage = async (req: Request, res: Response): Promise<void> => {
  const { subject, email, mssg } = req.body;
  // Validate request body

  const contactId = "F9NPKdgmdHyyQFFxU0Fk";
  const API_URL = "https://services.leadconnectorhq.com/conversations/messages";
  const options: AxiosRequestConfig = {
    method: "POST",
    url: API_URL,
    headers: {
      Authorization: process.env.AUTHORIZATION_TOKEN,
      Version: process.env.VERSION,
      Accept: process.env.ACCEPT,                                                                                                                                         
    },
    data: {
      type: "Email",
      contactId: contactId,
      html: mssg,
      emailFrom: email,
      // emailTo: 'kamallochan.boruah@qualhon.com',         
      subject: subject,
      emailReplyMode: "reply",
      // conversationProviderId: "HCXs4kYSfhgNsQCA9bO4",
    },
  };

  try {
    const { data } = await axios.request(options);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "Failed to send message.",
      details: error.message,
    });
  }
};

const createConversation = async (req: Request, res: Response): Promise<void> => {

  const { agentId } = req.body;
  const locationId = agentId


  try {
  /*1) Getting the Contact Id*/
  const contactId = await getContactId(locationId);


  /*2) Creating the conversation*/
  if(contactId && locationId) {

    const response = await createConversationFunction(locationId,contactId)
        

  /*3) If Already Exists than get the Conversation Id*/
    let conversations = []
    if(response.status === 400) {
      const conversationResponse = await fetchConversations(locationId, 20)
      conversations.push(conversationResponse)
    }

    const currentConversation_Id = await findConversation(conversations[0], contactId)
    res.status(200).json({ success: true, response });
      
  }
    } catch (error) {
      console.error(error);
    }
  }

 

export { sendMessage, createConversation };
